# Integração Frontend com Backend - API de Carteiras

## 🎯 Objetivo

Integrar o frontend público com o backend para exibir dados reais das carteiras digitais ao escanear o QR Code, substituindo os dados mockados.

## ✅ Implementações Realizadas

### **1. Tipos TypeScript**
`src/types/carteira.ts`

Criados tipos para:
- `CarteiraPublica` - Dados retornados pela API
- `CarteiraDisplay` - Dados formatados para exibição
- `DataMaconica` - Datas maçônicas
- `Loja` - Informações de lojas

### **2. Transformação de Dados**
`src/utils/transformCarteiraData.ts`

Função que converte dados da API para o formato esperado pelos componentes:
- Mapeia `foto_url` → `foto`
- Mapeia `situacao_atual` → `situacao`
- Transforma `datas_maconicas` para formato de exibição
- Transforma `lojas` para formato de exibição

### **3. ValidationPage Atualizada**
`src/components/public/ValidationPage.tsx`

**Funcionalidades:**
- ✅ Busca dados da API usando o código do QR
- ✅ Estados de loading durante carregamento
- ✅ Tratamento de erros (404, 403, etc)
- ✅ Fallback para dados mockados quando não há código
- ✅ Mensagens de erro amigáveis

**Fluxo:**
1. Componente recebe `codigo` da URL via `useParams`
2. Se código existe, faz requisição para API
3. Transforma dados da API para formato de exibição
4. Exibe dados ou mensagem de erro

### **4. Rotas Configuradas**
`src/routes/index.tsx`

**Rotas públicas:**
- `/` - Página inicial (dados mockados)
- `/q/:codigo` - Validação por QR Code (dados da API)

## 🔄 Fluxo de Validação

```
QR Code Escaneado
    ↓
URL: https://scrb.org.br/q/ABC123XYZ456
    ↓
Frontend captura código "ABC123XYZ456"
    ↓
Requisição: GET /api/public/carteira/ABC123XYZ456
    ↓
Backend retorna dados da carteira
    ↓
Frontend transforma e exibe dados
```

## 📡 Endpoints Utilizados

### **GET /api/public/carteira/:codigo_unico**

**Resposta de sucesso (200):**
```json
{
  "nome": "JOÃO CARLOS DA SILVA SANTOS",
  "foto_url": "http://localhost:5001/uploads/foto.jpg",
  "situacao_atual": "REGULAR",
  "datas_maconicas": [
    {
      "titulo": "Aprendiz",
      "data": "19/10/2024",
      "loja": "DEUS, PAZ E PROGRESSO Nº 30"
    }
  ],
  "lojas": [
    {
      "tipo": "Filiação",
      "data": "19/10/2024",
      "desligamento": "--",
      "loja": "DEUS, PAZ E PROGRESSO Nº 30"
    }
  ],
  "dados_validados_em": "23/05/2026 13:57:46",
  "hash_validacao": "6ee3c7f94782e53390d2293df9db5d6f",
  "ativo": true
}
```

**Erro - Carteira não encontrada (404):**
```json
{
  "error": "Carteira não encontrada"
}
```

**Erro - Carteira inativa (403):**
```json
{
  "error": "Carteira inativa",
  "message": "Esta carteira digital está inativa no momento."
}
```

## 🎨 Estados da Interface

### **Loading**
- Spinner animado
- Mensagem: "Carregando dados da carteira..."

### **Erro**
- Ícone de erro vermelho
- Título: "Erro ao Validar Carteira"
- Mensagem de erro específica
- Orientação para o usuário

### **Sucesso**
- Exibe todos os dados da carteira
- Foto do membro
- Situação atual (REGULAR, IRREGULAR, etc)
- Datas maçônicas
- Lojas
- Hash de validação

## 🔧 Como Testar

### **1. Criar uma carteira no admin**
```
http://localhost:5173/admin/carteiras/nova
```

### **2. Gerar QR Code**
```
http://localhost:5173/admin/carteiras/:id/qrcode
```

### **3. Copiar código único**
Exemplo: `ABC123XYZ456`

### **4. Acessar URL de validação**
```
http://localhost:5173/q/ABC123XYZ456
```

### **5. Verificar dados exibidos**
- Nome deve corresponder ao cadastrado
- Foto deve aparecer
- Situação deve estar correta
- Datas e lojas devem estar listadas

## 📝 Dados Mockados vs API

### **Quando usa dados mockados:**
- Acesso à rota `/` (página inicial)
- Código não fornecido na URL

### **Quando usa dados da API:**
- Acesso à rota `/q/:codigo`
- Código fornecido na URL

## 🚀 Próximos Passos

Para remover completamente os dados mockados:

1. Remover import de `mockMasonData` em ValidationPage
2. Definir estado inicial como `null`
3. Exibir mensagem quando não há código
4. Deletar arquivo `src/data/mockData.ts` (opcional)

## 🔒 Segurança

- ✅ Validação de código único no backend
- ✅ Verificação de carteira ativa
- ✅ Tratamento de erros adequado
- ✅ Sem exposição de dados sensíveis

## 📱 Responsividade

A página de validação é totalmente responsiva:
- Mobile: Layout vertical
- Tablet: Layout adaptado
- Desktop: Layout em duas colunas

## ✨ Melhorias Futuras

- [ ] Cache de dados para reduzir requisições
- [ ] Animações de transição
- [ ] Compartilhamento de carteira
- [ ] Histórico de validações
- [ ] Modo offline com service worker
