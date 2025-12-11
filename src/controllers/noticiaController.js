const prisma = require('../config/database');

// Criar notícia (apenas instituições)
exports.criarNoticia = async (req, res) => {
  try {
    console.log('📰 Criando notícia');

    if (req.userType !== 'instituicao') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { titulo, conteudo, categoria, icone } = req.body;

    if (!titulo || !conteudo || !categoria) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const noticia = await prisma.noticia.create({
      data: {
        titulo,
        conteudo,
        categoria,
        icone: icone || '📰',
        autorId: req.userId
      },
      include: {
        autor: {
          select: {
            nome: true,
            tipo: true
          }
        }
      }
    });

    console.log('✅ Notícia criada:', noticia.id);

    res.status(201).json({ 
      success: true, 
      noticia,
      message: 'Notícia publicada com sucesso!' 
    });
  } catch (error) {
    console.error('❌ Erro ao criar notícia:', error);
    res.status(500).json({ error: 'Erro ao criar notícia' });
  }
};

// Listar notícias (público)
exports.listarNoticias = async (req, res) => {
  try {
    console.log('📋 Listando notícias');

    const noticias = await prisma.noticia.findMany({
      include: {
        autor: {
          select: {
            nome: true,
            tipo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, noticias });
  } catch (error) {
    console.error('❌ Erro ao listar notícias:', error);
    res.status(500).json({ error: 'Erro ao listar notícias' });
  }
};

// Buscar notícia por ID
exports.getNoticia = async (req, res) => {
  try {
    const { id } = req.params;

    const noticia = await prisma.noticia.findUnique({
      where: { id },
      include: {
        autor: {
          select: {
            nome: true,
            tipo: true
          }
        }
      }
    });

    if (!noticia) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }

    res.json({ success: true, noticia });
  } catch (error) {
    console.error('❌ Erro ao buscar notícia:', error);
    res.status(500).json({ error: 'Erro ao buscar notícia' });
  }
};

// Deletar notícia (apenas autor)
exports.deletarNoticia = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.userType !== 'instituicao') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const noticia = await prisma.noticia.findUnique({ where: { id } });

    if (!noticia) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }

    if (noticia.autorId !== req.userId) {
      return res.status(403).json({ error: 'Você não pode deletar esta notícia' });
    }

    await prisma.noticia.delete({ where: { id } });

    res.json({ success: true, message: 'Notícia deletada com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar notícia:', error);
    res.status(500).json({ error: 'Erro ao deletar notícia' });
  }
};