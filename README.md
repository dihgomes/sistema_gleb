# Sistema de Validação de Carteiras GLEB

Sistema completo para validação de carteiras digitais da Grande Loja Maçônica do Estado da Bahia.

## 🚀 Tecnologias

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Lucide React (ícones)

### Backend
- Node.js + Express
- Prisma ORM
- SQLite
- JWT Authentication
- Multer (upload de arquivos)

## 📦 Estrutura do Projeto

```
sistema_gleb/
├── frontend/          # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/      # Área administrativa
│   │   │   ├── public/     # Página de validação pública
│   │   │   └── ui/         # Componentes reutilizáveis
│   │   ├── contexts/       # Context API (Toast)
│   │   └── utils/          # Utilitários
│   └── dist/               # Build de produção
│
└── backend/           # API Node.js
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   ├── routes/
    │   └── middlewares/
    ├── prisma/
    └── uploads/       # Fotos das carteiras

```

## 🔧 Instalação e Configuração

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (`.env`):
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. (Opcional) Execute o seed para criar usuário admin:
```bash
node src/database/seed.js
```

6. Inicie o servidor:
```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API em `src/config/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🌐 Deploy

### Frontend (Vercel)

O projeto está configurado para deploy automático no Vercel:

1. Conecte seu repositório GitHub ao Vercel
2. Configure o projeto:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. Faça o deploy!

### Backend

Recomendações para deploy do backend:
- **Railway:** Deploy fácil com PostgreSQL
- **Render:** Suporta Node.js e SQLite
- **Heroku:** Tradicional e confiável

**Importante:** Lembre-se de:
- Configurar variáveis de ambiente
- Migrar para PostgreSQL em produção (recomendado)
- Configurar CORS para permitir o domínio do frontend

## 📱 Funcionalidades

### Área Administrativa (`/admin`)

- ✅ Login seguro com JWT
- ✅ Dashboard com estatísticas
- ✅ Criar/Editar carteiras
- ✅ Upload de fotos
- ✅ Gerenciar datas maçônicas e lojas
- ✅ Gerar QR Code para validação
- ✅ Desativar carteiras
- ✅ Toast notifications profissionais

### Página Pública (`/validacao/:codigo`)

- ✅ Validação via QR Code
- ✅ Exibição de dados da carteira
- ✅ Foto do membro
- ✅ Situação atual (REGULAR/DESLIGADO)
- ✅ Datas maçônicas
- ✅ Histórico de lojas
- ✅ Hash de validação
- ✅ Design responsivo e profissional

## 🔐 Credenciais Padrão

Após executar o seed:
- **Usuário:** admin
- **Senha:** admin123

⚠️ **Importante:** Altere essas credenciais em produção!

## 🎨 Design

- Interface moderna e clean
- Totalmente responsivo
- Gradientes e animações suaves
- Toast notifications profissionais
- Cards com sombras e bordas arredondadas

## 📄 Licença

Este projeto é privado e de uso exclusivo da GLEB.

---

Desenvolvido para a Grande Loja Maçônica do Estado da Bahia
