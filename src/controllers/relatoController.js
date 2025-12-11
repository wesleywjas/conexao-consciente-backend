const prisma = require('../config/database');

// Criar relato
exports.criarRelato = async (req, res) => {
  try {
    console.log('📝 Requisição de criar relato recebida');
    console.log('User ID:', req.userId);
    console.log('Body:', req.body);

    const { convivencia, mudancas, ajuda } = req.body;
    const usuarioId = req.userId;

    // Validação
    if (!convivencia || !mudancas || !ajuda) {
      console.log('❌ Dados incompletos');
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    console.log('💾 Criando relato no banco...');
    const relato = await prisma.relato.create({
      data: {
        convivencia,
        mudancas,
        ajuda,
        usuarioId
      }
    });

    console.log('✅ Relato criado:', relato.id);

    res.status(201).json({ 
      success: true, 
      relato,
      message: 'Relato enviado com sucesso!' 
    });
  } catch (error) {
    console.error('❌ Erro ao criar relato:', error);
    res.status(500).json({ error: 'Erro ao criar relato' });
  }
};

// Listar relatos (apenas instituições)
exports.listarRelatos = async (req, res) => {
  try {
    console.log('📋 Listando relatos...');
    console.log('User Type:', req.userType);

    if (req.userType !== 'instituicao') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const relatos = await prisma.relato.findMany({
      include: {
        usuario: {
          select: {
            nome: true,
            relacao: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ ${relatos.length} relatos encontrados`);

    res.json({ success: true, relatos });
  } catch (error) {
    console.error('❌ Erro ao listar relatos:', error);
    res.status(500).json({ error: 'Erro ao listar relatos' });
  }
};

// Estatísticas
exports.estatisticas = async (req, res) => {
  try {
    console.log('📊 Buscando estatísticas...');

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

    console.log('✅ Estatísticas:', { total, ultimos7Dias });

    res.json({
      success: true,
      estatisticas: {
        total,
        ultimos7Dias
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};