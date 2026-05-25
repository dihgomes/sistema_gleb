const bcrypt = require('bcrypt');
const prisma = require('./prisma');

/**
 * Script de seed para criar ou atualizar administrador inicial
 * Execute com: npm run seed
 */
async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    const emailAdmin = 'administrador';
    const senhaAdmin = 'admin123';

    // Verifica se já existe algum admin
    const adminExists = await prisma.admin.findUnique({
      where: { email: emailAdmin }
    });

    if (adminExists) {
      console.log('⚠️  Administrador já existe. Atualizando senha...');
      
      const senhaHash = await bcrypt.hash(senhaAdmin, 10);
      
      const adminAtualizado = await prisma.admin.update({
        where: { email: emailAdmin },
        data: {
          nome: 'Administrador',
          senhaHash
        }
      });

      console.log('✅ Administrador atualizado com sucesso!');
      console.log('� Usuário:', adminAtualizado.email);
      console.log('🔑 Senha: admin123');
      console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
      return;
    }

    // Cria admin padrão
    const senhaHash = await bcrypt.hash(senhaAdmin, 10);

    const admin = await prisma.admin.create({
      data: {
        nome: 'Administrador',
        email: emailAdmin,
        senhaHash
      }
    });

    console.log('✅ Administrador criado com sucesso!');
    console.log('� Usuário:', admin.email);
    console.log('🔑 Senha: admin123');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
