import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { casterApplications } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { getQuery, getQueryInt, getParam, getBody } from '../utils/requestHelpers.js';

// Criar candidatura
export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      type,
      name,
      email,
      country,
      experience,
      specialty,
      description,
      twitchUsername,
      youtubeChannel,
      portfolio,
      motivation
    } = req.body;

    // Validação de dados obrigatórios
    if (!type || !name || !email || !country || !experience) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: tipo, nome, email, país e experiência'
      });
    }

    // Inserir candidatura
    const [application] = await db
      .insert(casterApplications)
      .values({
        type,
        name,
        email,
        country,
        experience,
        specialty,
        description,
        twitchUsername,
        youtubeChannel,
        portfolio,
        motivation
      } as any)
      .returning();

    res.status(201).json({
      success: true,
      message: 'Candidatura enviada com sucesso!',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// Listar todas as candidaturas (Admin)
export const getApplications = async (req: Request, res: Response) => {
  try {
    const status = getQuery(req, 'status');
    const page = getQueryInt(req, 'page', 1);
    const limit = getQueryInt(req, 'limit', 10);
    
    const whereConditions = [];
    if (status) {
      whereConditions.push(eq(casterApplications.status, status));
    }

    const applications = await db.query.casterApplications.findMany({
      where: whereConditions.length > 0 ? whereConditions[0] : undefined,
      orderBy: desc(casterApplications.createdAt),
      limit,
      offset: (page - 1) * limit,
    });

    res.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Erro ao buscar candidaturas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter candidatura específica
export const getApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID da candidatura é obrigatório'
      });
    }
    
    const application = await db.query.casterApplications.findFirst({
      where: eq(casterApplications.id, id)
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidatura não encontrada'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// Revisar candidatura (Aprovar/Rejeitar)
export const reviewApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');
    const body = getBody(req) as { status: string; reviewNotes?: string };
    const { status, reviewNotes } = body;
    // const reviewerId = req.user?.id; // TODO: Implementar quando auth middleware estiver pronto

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID da candidatura é obrigatório'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status deve ser "approved" ou "rejected"'
      });
    }

    const updateData: any = {
      status,
      reviewedAt: new Date(),
      updatedAt: new Date()
    };

    if (reviewNotes !== undefined) {
      updateData.reviewNotes = reviewNotes;
    }

    const [updatedApplication] = await db
      .update(casterApplications)
      .set(updateData)
      .where(eq(casterApplications.id, id))
      .returning();

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Candidatura não encontrada'
      });
    }

    res.json({
      success: true,
      message: `Candidatura ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`,
      data: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

// Estatísticas de candidaturas (Admin)
export const getApplicationStats = async (req: Request, res: Response) => {
  try {
    const applications = await db.select().from(casterApplications);
    
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      byType: {
        caster: applications.filter(app => app.type === 'caster').length,
        streamer: applications.filter(app => app.type === 'streamer').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}; 