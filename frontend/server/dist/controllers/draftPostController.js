import { db } from '../db/connection.js';
import { draftPosts } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';
export const createDraftPost = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Utilizador não autenticado' });
        }
        const { type, title, description, urgency, country, 
        // Player fields
        nickname, role, experience, availability, lookingFor, 
        // Team fields
        teamName, lookingForRole, commitment, requirements } = req.body;
        // Validações básicas
        if (!type || !title || !description) {
            return res.status(400).json({
                error: 'Tipo, título e descrição são obrigatórios'
            });
        }
        if (!['player', 'team'].includes(type)) {
            return res.status(400).json({
                error: 'Tipo deve ser "player" ou "team"'
            });
        }
        // Criar o post
        const newPost = await db.insert(draftPosts).values({
            authorId: userId,
            type,
            title,
            description,
            urgency: urgency || 'medium',
            country: country || 'pt',
            // Player fields
            nickname: type === 'player' ? nickname : null,
            role: type === 'player' ? role : null,
            experience: type === 'player' ? experience : null,
            availability: type === 'player' ? availability : null,
            lookingFor: type === 'player' ? lookingFor : null,
            // Team fields
            teamName: type === 'team' ? teamName : null,
            lookingForRole: type === 'team' ? lookingForRole : null,
            commitment: type === 'team' ? commitment : null,
            requirements: type === 'team' ? requirements : null,
            isActive: true,
            views: 0,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        }).returning();
        return res.status(201).json({
            success: true,
            data: newPost[0]
        });
    }
    catch (error) {
        console.error('Erro ao criar draft post:', error);
        return res.status(500).json({
            error: 'Erro interno do servidor ao criar post'
        });
    }
};
export const getDraftPosts = async (req, res) => {
    try {
        const { type, role, country = 'pt', page = 1, limit = 20, search } = req.query;
        const conditions = [eq(draftPosts.isActive, true)];
        if (type) {
            conditions.push(eq(draftPosts.type, type));
        }
        if (role) {
            conditions.push(eq(draftPosts.role, role));
        }
        if (country) {
            conditions.push(eq(draftPosts.country, country));
        }
        // Ordenação e paginação
        const offset = (Number(page) - 1) * Number(limit);
        const posts = await db.select()
            .from(draftPosts)
            .where(and(...conditions))
            .orderBy(desc(draftPosts.createdAt))
            .limit(Number(limit))
            .offset(offset);
        res.json({
            success: true,
            data: posts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: posts.length
            }
        });
    }
    catch (error) {
        console.error('Erro ao obter draft posts:', error);
        res.status(500).json({
            error: 'Erro interno do servidor ao obter posts'
        });
    }
};
export const getDraftPost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID do post é obrigatório' });
        }
        const post = await db.select()
            .from(draftPosts)
            .where(eq(draftPosts.id, id))
            .limit(1);
        if (!post.length) {
            return res.status(404).json({
                error: 'Post não encontrado'
            });
        }
        // Incrementar views
        const currentPost = post[0];
        if (!currentPost) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        await db.update(draftPosts)
            .set({ views: (currentPost.views || 0) + 1 })
            .where(eq(draftPosts.id, id));
        return res.json({
            success: true,
            data: { ...currentPost, views: (currentPost.views || 0) + 1 }
        });
    }
    catch (error) {
        console.error('Erro ao obter draft post:', error);
        return res.status(500).json({
            error: 'Erro interno do servidor ao obter post'
        });
    }
};
export const deleteDraftPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Utilizador não autenticado' });
        }
        if (!id) {
            return res.status(400).json({ error: 'ID do post é obrigatório' });
        }
        const post = await db.select()
            .from(draftPosts)
            .where(eq(draftPosts.id, id))
            .limit(1);
        if (!post.length) {
            return res.status(404).json({
                error: 'Post não encontrado'
            });
        }
        // Verificar se o user é o autor
        const currentPost = post[0];
        if (!currentPost) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        if (currentPost.authorId !== userId) {
            return res.status(403).json({
                error: 'Não tem permissão para eliminar este post'
            });
        }
        // Soft delete
        await db.update(draftPosts)
            .set({
            isActive: false,
            updatedAt: new Date()
        })
            .where(eq(draftPosts.id, id));
        return res.json({
            success: true,
            message: 'Post eliminado com sucesso'
        });
    }
    catch (error) {
        console.error('Erro ao eliminar draft post:', error);
        return res.status(500).json({
            error: 'Erro interno do servidor ao eliminar post'
        });
    }
};
export const getDraftPostStats = async (req, res) => {
    try {
        // Mock data para estatísticas
        const stats = {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
        };
        // Aqui podes implementar queries reais se necessário
        // const result = await db.select().from(draftPosts)...
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({
            error: 'Erro interno do servidor ao obter estatísticas'
        });
    }
};
//# sourceMappingURL=draftPostController.js.map