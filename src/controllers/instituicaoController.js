const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

// Cadastro de Instituição
exports.cadastrarInstituicao = async (req, res) => {
  try {
    console.log('📝 Requisição de cadastro de instituição');
    
    const { nome, email, senha, tipo } = req.body;

    // Validação
    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se email já existe
    const existente = await prisma.instituicao.findUnique({ where: { email } });
    if (existente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar instituição (aprovado = false por padrão)
    const instituicao = await prisma.instituicao.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tipo,
        aprovado: false // Precisa ser aprovada por um admin
      }
    });

    console.log('✅ Instituição cadastrada:', instituicao.id);

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado! Aguarde aprovação para acessar o sistema.',
      instituicao: {
        id: instituicao.id,
        nome: instituicao.nome,
        email: instituicao.email,
        aprovado: instituicao.aprovado
      }
    });
  } catch (error) {
    console.error('❌ Erro ao cadastrar instituição:', error);
    res.status(500).json({ error: 'Erro ao cadastrar instituição' });
  }
};

// Login de Instituição (já existe no authController, mas vamos garantir)
exports.loginInstituicao = async (req, res) => {
  try {
    console.log('🔐 Login de instituição');
    
    const { email, senha } = req.body;

    const instituicao = await prisma.instituicao.findUnique({ where: { email } });
    
    if (!instituicao) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!instituicao.aprovado) {
      return res.status(403).json({ 
        error: 'Sua instituição ainda não foi aprovada. Aguarde a análise do administrador.' 
      });
    }

    const senhaValida = await bcrypt.compare(senha, instituicao.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: instituicao.id, type: 'instituicao' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login bem-sucedido:', instituicao.nome);

    res.json({
      success: true,
      token,
      instituicao: {
        id: instituicao.id,
        nome: instituicao.nome,
        email: instituicao.email,
        tipo: instituicao.tipo
      }
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// Buscar dados da instituição logada
exports.getMeuPerfil = async (req, res) => {
  try {
    const instituicao = await prisma.instituicao.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        aprovado: true,
        createdAt: true
      }
    });

    if (!instituicao) {
      return res.status(404).json({ error: 'Instituição não encontrada' });
    }

    res.json({ success: true, instituicao });
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};