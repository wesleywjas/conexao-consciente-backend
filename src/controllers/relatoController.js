const prisma = require('../config/database');

// Criar relato
exports.criarRelato = async (req, res) => {
  try {
    const { convivencia, mudancas, ajuda } = req.body;
    const usuarioId = req.userId;

    const relato = await prisma.relato.create({
      data: {
        convivencia,
        mudancas,
        ajuda,
        usuarioId
      }
    });

    res.status(201).json({ success: true, relato });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar relato' });
  }
};

// Listar relatos (apenas instituições)
exports.listarRelatos = async (req, res) => {
  try {
    if (req.userType !== 'instituicao') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const relatos = await prisma.relato.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        convivencia: true,
        mudancas: true,
        ajuda: true,
        createdAt: true,
        // NÃO retorna dados do usuário (anonimato)
      }
    });

    res.json({ success: true, relatos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar relatos' });
  }
};

// Estatísticas
exports.estatisticas = async (req, res) => {
  try {
    if (req.userType !== 'instituicao') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const total = await prisma.relato.count();
    
    const ultimos7Dias = await prisma.relato.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({
      success: true,
      estatisticas: {
        total,
        ultimos7Dias
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};