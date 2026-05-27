# 🚀 Resumo Rápido - Deploy Portainer

## 📦 Arquivos Criados

```
gleb/
├── docker-compose.yml          # Orquestração dos containers
├── .env.production             # Variáveis de ambiente (EDITAR!)
├── backup_postgres.bat         # Script de backup do banco
│
├── backend/
│   ├── Dockerfile              # Build do backend
│   └── .dockerignore
│
├── frontend/
│   ├── Dockerfile              # Build do frontend
│   ├── nginx.conf              # Config Nginx do frontend
│   └── .dockerignore
│
└── nginx/
    ├── nginx.conf              # Reverse proxy principal
    └── ssl/                    # Certificados SSL (criar pasta)
        ├── fullchain.pem       # Certificado completo
        └── privkey.pem         # Chave privada
```

---

## ⚡ Passos Rápidos

### 1️⃣ **Preparar Localmente**

```bash
# 1. Editar variáveis de ambiente
# Abra .env.production e configure as senhas

# 2. Fazer backup do PostgreSQL local
backup_postgres.bat
```

---

### 2️⃣ **Configurar SSL**

```bash
# Opção A: Let's Encrypt
sudo certbot certonly --standalone -d sistema.gleb.scrb.org.br
sudo cp /etc/letsencrypt/live/sistema.gleb.scrb.org.br/*.pem nginx/ssl/

# Opção B: Certificado próprio
# Copie seus certificados para nginx/ssl/
```

---

### 3️⃣ **Deploy no Portainer**

1. **Stacks → Add Stack**
2. **Nome:** `sistema-gleb`
3. **Git Repository:** `https://github.com/dihgomes/sistema_gleb.git`
4. **Adicionar variáveis de ambiente** (do .env.production)
5. **Deploy the stack**

---

### 4️⃣ **Restaurar Banco de Dados**

```bash
# Copiar backup para container
docker cp gleb_backup.dump gleb-postgres:/tmp/

# Restaurar
docker exec -it gleb-postgres pg_restore -U gleb_user -d gleb_db -v /tmp/gleb_backup.dump

# Executar migrations
docker exec -it gleb-backend npx prisma migrate deploy
```

---

### 5️⃣ **Configurar DNS**

No painel DNS de scrb.org.br:

```
Tipo: A
Nome: sistema.gleb
Valor: [IP_DO_SERVIDOR]
TTL: 3600
```

---

### 6️⃣ **Testar**

```bash
# Health checks
curl https://sistema.gleb.scrb.org.br/health
curl https://sistema.gleb.scrb.org.br/api/health

# Navegador
https://sistema.gleb.scrb.org.br
```

---

## 🔑 Variáveis de Ambiente Necessárias

```env
POSTGRES_DB=gleb_db
POSTGRES_USER=gleb_user
POSTGRES_PASSWORD=SuaSenhaForte123!
JWT_SECRET=seu_jwt_secret_aqui
ADMIN_SENHA=SenhaAdmin123!
```

---

## 🐳 Containers que serão criados

| Container | Porta | Função |
|-----------|-------|--------|
| gleb-nginx | 80, 443 | Reverse Proxy + SSL |
| gleb-backend | 3002 | API Node.js |
| gleb-frontend | 80 | React App |
| gleb-postgres | 5432 | Banco de Dados |

---

## 🌐 Arquitetura

```
Internet
    ↓
sistema.gleb.scrb.org.br (DNS)
    ↓
Nginx (SSL + Reverse Proxy)
    ├─→ /api/* → Backend (Node.js)
    ├─→ /* → Frontend (React)
    └─→ PostgreSQL (Database)
```

---

## ✅ Checklist Rápido

- [ ] Editar `.env.production` com senhas fortes
- [ ] Fazer backup do PostgreSQL local
- [ ] Configurar certificados SSL em `nginx/ssl/`
- [ ] Fazer push do código para GitHub
- [ ] Criar stack no Portainer
- [ ] Adicionar variáveis de ambiente no Portainer
- [ ] Deploy da stack
- [ ] Restaurar banco de dados
- [ ] Configurar DNS
- [ ] Testar aplicação

---

## 🆘 Comandos Úteis

```bash
# Ver logs
docker logs -f gleb-backend
docker logs -f gleb-frontend
docker logs -f gleb-nginx

# Reiniciar
docker restart gleb-backend

# Status
docker ps

# Acessar container
docker exec -it gleb-backend sh
docker exec -it gleb-postgres psql -U gleb_user -d gleb_db
```

---

## 🎯 URLs Finais

- **Aplicação:** https://sistema.gleb.scrb.org.br
- **API:** https://sistema.gleb.scrb.org.br/api
- **Health:** https://sistema.gleb.scrb.org.br/health

---

## 📞 Próximos Passos

1. ✅ Fazer backup do banco local
2. ✅ Configurar SSL
3. ✅ Deploy no Portainer
4. ✅ Configurar DNS
5. ✅ Testar tudo

**Documentação completa:** `DEPLOY_PORTAINER.md`

---

**Tempo estimado:** 30-45 minutos  
**Dificuldade:** Média  
**Suporte:** diego_gomes
