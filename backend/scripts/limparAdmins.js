import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function limparAdmins() {
  try {
    console.log('\n='.repeat(60));
    console.log('🗑️  LIMPANDO TODOS OS ADMINISTRADORES');
    console.log('='.repeat(60));

    // Deletar todos os admins
    const resultado = await prisma.admin.deleteMany({});

    console.log('\n✅ Administradores deletados com sucesso!');
    console.log(`   Total deletado: ${resultado.count}`);
    console.log('\n' + '='.repeat(60));
    console.log('✨ Banco de dados limpo!');
    console.log('='.repeat(60));
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Erro ao limpar administradores:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

limparAdmins();
