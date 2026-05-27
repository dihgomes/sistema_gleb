import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { validarNomeUsuario, validarSenha } from '../src/utils/validation.js';

const prisma = new PrismaClient();

async function criarAdmin() {
  try {
    // Dados do novo admin - CONFIGURE NO .env
    const nome = process.env.ADMIN_NOME || 'scrb';
    const email = process.env.ADMIN_EMAIL || 'scrb@sistema.com';
    const senha = process.env.ADMIN_SENHA;
    const role = process.env.ADMIN_ROLE || 'admin';

    if (!senha) {
      console.error('\n❌ ERRO: Senha não configurada!');
      console.log('\n📝 Configure a variável ADMIN_SENHA no arquivo .env');
      console.log('   Exemplo: ADMIN_SENHA=SuaSenhaForte@123\n');
      process.exit(1);
    }

    console.log('\n='.repeat(60));
    console.log('🔐 CRIANDO NOVO ADMINISTRADOR');
    console.log('='.repeat(60));

    // Validar nome
    console.log('\n📝 Validando nome...');
    const nomeValidation = validarNomeUsuario(nome);
    if (!nomeValidation.valid) {
      console.error('❌ Erro na validação do nome:', nomeValidation.error);
      process.exit(1);
    }
    console.log('✅ Nome válido!');

    // Validar senha
    console.log('\n🔒 Validando senha...');
    const senhaValidation = validarSenha(senha);
    if (!senhaValidation.valid) {
      console.error('❌ Erro na validação da senha:', senhaValidation.error);
      process.exit(1);
    }
    console.log('✅ Senha válida!');

    // Verificar se nome já existe
    console.log('\n👤 Verificando se nome já existe...');
    const adminPorNome = await prisma.admin.findUnique({
      where: { nome }
    });

    if (adminPorNome) {
      console.error('❌ Erro: Nome de usuário já cadastrado!');
      process.exit(1);
    }
    console.log('✅ Nome disponível!');

    // Verificar se email já existe
    console.log('\n📧 Verificando se email já existe...');
    const adminPorEmail = await prisma.admin.findUnique({
      where: { email }
    });

    if (adminPorEmail) {
      console.error('❌ Erro: Email já cadastrado!');
      process.exit(1);
    }
    console.log('✅ Email disponível!');

    // Hash da senha
    console.log('\n🔐 Gerando hash da senha...');
    const senhaHash = await bcrypt.hash(senha, 10);
    console.log('✅ Hash gerado!');

    // Criar admin
    console.log('\n👤 Criando administrador...');
    const admin = await prisma.admin.create({
      data: {
        nome,
        email,
        senhaHash,
        role,
        primeiroAcesso: true, // Vai pedir para trocar senha no primeiro login
        ativo: true
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ ADMINISTRADOR CRIADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\n📋 Dados do administrador:');
    console.log(`   ID:              ${admin.id}`);
    console.log(`   Nome:            ${admin.nome}`);
    console.log(`   Email:           ${admin.email}`);
    console.log(`   Role:            ${admin.role}`);
    console.log(`   Primeiro Acesso: ${admin.primeiroAcesso ? 'SIM (vai pedir troca de senha)' : 'NÃO'}`);
    console.log(`   Ativo:           ${admin.ativo ? 'SIM' : 'NÃO'}`);
    console.log(`   Criado em:       ${admin.criadoEm.toLocaleString('pt-BR')}`);
    console.log('\n' + '='.repeat(60));
    console.log('🔑 Credenciais de acesso:');
    console.log(`   Nome (Login): ${nome}`);
    console.log(`   Senha:        ${senha}`);
    console.log('='.repeat(60));
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - O login é feito com o NOME do usuário, não com email');
    console.log('   - No primeiro login, o sistema vai pedir para trocar a senha');
    console.log('   - A nova senha deve seguir as mesmas regras de validação');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Erro ao criar administrador:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

criarAdmin();
