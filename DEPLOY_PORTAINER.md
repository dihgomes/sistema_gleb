# 🚀 Deploy no Portainer - Sistema GLEB

## 📋 Pré-requisitos

- ✅ Portainer instalado e configurado
- ✅ Docker e Docker Compose instalados no servidor
- ✅ Domínio `sistema.gleb.scrb.org.br` apontando para o servidor
- ✅ Certificado SSL (Let's Encrypt recomendado)

---

## 🔧 Passo 1: Preparar Variáveis de Ambiente

### 1.1 Edite o arquivo `.env.production`:

```bash
# PostgreSQL
POSTGRES_DB=gleb_db
POSTGRES_USER=gleb_user
POSTGRES_PASSWORD=SuaSenhaForteDoBanco123!

# Backend
JWT_SECRET=seu_jwt_secret_gerado_anteriormente
ADMIN_SENHA=SenhaPadraoAdmin123!

# Frontend
VITE_API_URL=https://sistema.gleb.scrb.org.br/api
```

⚠️ **IMPORTANTE:** Use senhas fortes e diferentes para cada serviço!

---

## 🔐 Passo 2: Configurar SSL

### Opção A: Let's Encrypt (Recomendado)

#### 2.1 Instalar Certbot no servidor:
```bash
sudo apt update
sudo apt install certbot
```

#### 2.2 Gerar certificado:
```bash
sudo certbot certonly --standalone -d sistema.gleb.scrb.org.br
```

#### 2.3 Copiar certificados para o projeto:
```bash
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/sistema.gleb.scrb.org.br/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/sistema.gleb.scrb.org.br/privkey.pem nginx/ssl/
sudo chmod 644 nginx/ssl/*.pem
```

### Opção B: Certificado Próprio

Se você já tem certificados SSL da instituição:

```bash
mkdir -p nginx/ssl
cp seu_certificado.crt nginx/ssl/fullchain.pem
cp sua_chave_privada.key nginx/ssl/privkey.pem
chmod 644 nginx/ssl/*.pem
```

---

## 📦 Passo 3: Migrar Banco de Dados PostgreSQL

### 3.1 Exportar dados do PostgreSQL local:

```bash
# No seu computador local
pg_dump -U seu_usuario -d gleb_db -F c -f gleb_backup.dump
```

### 3.2 Copiar backup para o servidor:

```bash
scp gleb_backup.dump usuario@servidor:/caminho/para/gleb/
```

---

## 🐳 Passo 4: Deploy no Portainer

### 4.1 Fazer upload do projeto:

**Opção A: Via Git (Recomendado)**

1. No Portainer, vá em **Stacks → Add Stack**
2. Nome: `sistema-gleb`
3. Build method: **Git Repository**
4. Repository URL: `https://github.com/dihgomes/sistema_gleb.git`
5. Reference: `main`
6. Compose path: `docker-compose.yml`

**Opção B: Via Upload**

1. Compacte o projeto: `zip -r sistema-gleb.zip .`
2. No Portainer, vá em **Stacks → Add Stack**
3. Nome: `sistema-gleb`
4. Build method: **Upload**
5. Faça upload do arquivo `docker-compose.yml`

### 4.2 Configurar variáveis de ambiente:

No Portainer, adicione as variáveis do arquivo `.env.production`:

```
POSTGRES_DB=gleb_db
POSTGRES_USER=gleb_user
POSTGRES_PASSWORD=SuaSenhaForteDoBanco123!
JWT_SECRET=seu_jwt_secret_aqui
ADMIN_SENHA=SenhaPadraoAdmin123!
```

### 4.3 Deploy:

Clique em **Deploy the stack**

---

## 🔄 Passo 5: Restaurar Banco de Dados

### 5.1 Aguarde os containers iniciarem:

```bash
docker ps
```

Verifique se `gleb-postgres` está rodando.

### 5.2 Copiar backup para o container:

```bash
docker cp gleb_backup.dump gleb-postgres:/tmp/
```

### 5.3 Restaurar dados:

```bash
docker exec -it gleb-postgres pg_restore -U gleb_user -d gleb_db -v /tmp/gleb_backup.dump
```

### 5.4 Executar migrations do Prisma:

```bash
docker exec -it gleb-backend npx prisma migrate deploy
```

---

## 🌐 Passo 6: Configurar DNS

No painel de DNS da instituição (scrb.org.br):

### Adicione um registro A:

```
Tipo: A
Nome: sistema.gleb
Valor: IP_DO_SERVIDOR
TTL: 3600
```

**Ou um CNAME se já tiver um domínio principal:**

```
Tipo: CNAME
Nome: sistema.gleb
Valor: servidor.scrb.org.br
TTL: 3600
```

---

## ✅ Passo 7: Verificar Deploy

### 7.1 Verificar containers:

```bash
docker ps
```

Deve mostrar 4 containers rodando:
- ✅ gleb-nginx
- ✅ gleb-backend
- ✅ gleb-frontend
- ✅ gleb-postgres

### 7.2 Verificar logs:

```bash
# Backend
docker logs gleb-backend

# Frontend
docker logs gleb-frontend

# Nginx
docker logs gleb-nginx

# PostgreSQL
docker logs gleb-postgres
```

### 7.3 Testar endpoints:

```bash
# Health check
curl https://sistema.gleb.scrb.org.br/health

# API
curl https://sistema.gleb.scrb.org.br/api/health
```

### 7.4 Testar no navegador:

Acesse: `https://sistema.gleb.scrb.org.br`

---

## 🔧 Comandos Úteis

### Ver logs em tempo real:
```bash
docker logs -f gleb-backend
docker logs -f gleb-frontend
docker logs -f gleb-nginx
```

### Reiniciar serviços:
```bash
docker restart gleb-backend
docker restart gleb-frontend
docker restart gleb-nginx
```

### Parar stack:
```bash
docker-compose down
```

### Iniciar stack:
```bash
docker-compose up -d
```

### Rebuild containers:
```bash
docker-compose up -d --build
```

### Acessar shell do container:
```bash
docker exec -it gleb-backend sh
docker exec -it gleb-postgres psql -U gleb_user -d gleb_db
```

---

## 🔄 Atualizar Aplicação

### Via Portainer:

1. Vá em **Stacks → sistema-gleb**
2. Clique em **Pull and redeploy**
3. Aguarde o rebuild

### Via CLI:

```bash
cd /caminho/para/gleb
git pull origin main
docker-compose up -d --build
```

---

## 🛡️ Segurança

### Firewall:

Certifique-se de que apenas as portas necessárias estão abertas:

```bash
# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir SSH (se necessário)
sudo ufw allow 22/tcp

# Ativar firewall
sudo ufw enable
```

### Backup Automático:

Crie um cron job para backup diário:

```bash
# Editar crontab
crontab -e

# Adicionar linha (backup às 2h da manhã)
0 2 * * * docker exec gleb-postgres pg_dump -U gleb_user gleb_db > /backups/gleb_$(date +\%Y\%m\%d).sql
```

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Ver logs
docker logs gleb-postgres

# Reiniciar
docker restart gleb-postgres
```

---

### Erro: "502 Bad Gateway"

**Solução:**
```bash
# Verificar se backend está rodando
docker ps | grep backend

# Ver logs
docker logs gleb-backend

# Reiniciar
docker restart gleb-backend
```

---

### Erro: SSL Certificate

**Solução:**
```bash
# Verificar certificados
ls -la nginx/ssl/

# Renovar Let's Encrypt
sudo certbot renew

# Copiar novos certificados
sudo cp /etc/letsencrypt/live/sistema.gleb.scrb.org.br/*.pem nginx/ssl/
docker restart gleb-nginx
```

---

### Erro: "Rate limit exceeded"

**Solução:**
Ajuste os limites no `nginx/nginx.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/s;
```

Depois:
```bash
docker restart gleb-nginx
```

---

## 📊 Monitoramento

### Portainer Dashboard:

- Vá em **Containers** para ver status
- Vá em **Logs** para ver logs em tempo real
- Vá em **Stats** para ver uso de recursos

### Prometheus + Grafana (Opcional):

Se quiser monitoramento avançado, adicione ao `docker-compose.yml`:

```yaml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

---

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Certificados SSL instalados
- [ ] DNS configurado e propagado
- [ ] Backup do banco de dados feito
- [ ] Stack deployada no Portainer
- [ ] Containers rodando (4/4)
- [ ] Banco de dados restaurado
- [ ] Migrations executadas
- [ ] Health checks passando
- [ ] Login funcionando
- [ ] Validação de carteira funcionando
- [ ] Firewall configurado
- [ ] Backup automático configurado

---

## 🎯 URLs Importantes

- **Frontend:** https://sistema.gleb.scrb.org.br
- **API:** https://sistema.gleb.scrb.org.br/api
- **Health Check:** https://sistema.gleb.scrb.org.br/health
- **Portainer:** https://seu-portainer.scrb.org.br

---

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs dos containers
2. Verifique o status no Portainer
3. Teste os health checks
4. Verifique a conectividade de rede
5. Verifique os certificados SSL

---

**Última atualização:** 26/05/2026  
**Versão:** 1.0.0  
**Domínio:** sistema.gleb.scrb.org.br
