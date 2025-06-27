import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { casterApplications } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

// Criar candidatura
export const createApplication = async (req: Request, res: Response) => {
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
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Candidatura enviada com sucesso!',
      data: application
    });
  } catch (error) {
    console.error('Erro ao criar candidatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Listar todas as candidaturas (Admin)
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let applicationsQuery = db.select().from(casterApplications);
    
    if (status && typeof status === 'string') {
      applicationsQuery = applicationsQuery.where(eq(casterApplications.status, status));
    }
    
    const applications = await applicationsQuery
      .orderBy(desc(casterApplications.createdAt))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: Number(page),
        limit: Number(limit)
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
export const getApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID da candidatura é obrigatório'
      });
    }
    
    const [application] = await db
      .select()
      .from(casterApplications)
      .where(eq(casterApplications.id, id));

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
    console.error('Erro ao buscar candidatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Revisar candidatura (Aprovar/Rejeitar)
export const reviewApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
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

    const [updatedApplication] = await db
      .update(casterApplications)
      .set({
        status,
        reviewNotes,
        // reviewedBy: reviewerId, // TODO: Adicionar quando auth middleware estiver pronto
        reviewedAt: new Date(),
        updatedAt: new Date()
      })
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
    console.error('Erro ao revisar candidatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
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