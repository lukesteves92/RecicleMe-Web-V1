# Recicle.me - Plataforma de Reciclagem

Plataforma web para gerenciamento de coleta de materiais recicláveis, conectando usuários a pontos de coleta e promovendo práticas sustentáveis.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🚀 Funcionalidades

- 🗺️ **Mapa de Pontos de Coleta** - Mapbox interativo com 4 pontos em SP
- 📸 **Agendamento com Foto** - Upload de imagens dos materiais
- 🎯 **Sistema de Pontos** - Recompensas por reciclagem (5-20 pts/kg)
- 💬 **Chatbot Watson** - Assistente virtual flutuante
- 👤 **Perfil Completo** - Avatar, dados pessoais, histórico
- 🔐 **Autenticação Segura** - Supabase Auth com RLS


## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`

## 📊 Banco de Dados

- **profiles** - Dados do usuário (avatar, telefone, endereço)
- **coletas** - Histórico de coletas (status, pontos, foto)
- **categorias** - Tipos de materiais (6 categorias padrão)
- **Storage** - Bucket para fotos (5MB máx)

## 🎨 Sistema de Pontos

| Material | Pontos/kg |
|----------|-----------|
| Eletrônicos | 20 pts |
| Metal | 15 pts |
| Plástico/Vidro | 10 pts |
| Papel | 8 pts |
| Orgânico | 5 pts |


### IBM Watson Assistant
Para ativar o chatbot:
1. Crie conta em [IBM Cloud](https://cloud.ibm.com/)
2. Configure Watson Assistant
3. Adicione credenciais no backend:
   - `IBM_WATSON_API_KEY`
   - `IBM_WATSON_URL`
   - `IBM_WATSON_ASSISTANT_ID`

### Mapbox Token
Para mapas reais:
1. Crie conta em [Mapbox](https://mapbox.com/)
2. Obtenha token público
3. Configure em `src/pages/PontosColeta.tsx`

## 🔧 Painel Administrativo + Node-RED

### Estrutura Implementada

Este projeto inclui um **painel administrativo web** completo e integração pronta para **Node-RED local**.

#### Painel Admin Web (`/admin`)
- ✅ Controle de funcionalidades (ativar/desativar coletas, chat, notificações)
- ✅ Configuração de limites (máximo de coletas/dia)
- ✅ Estatísticas em tempo real (usuários, coletas, pontos)
- ✅ Autenticação com roles (apenas admins podem acessar)
- ✅ Interface responsiva e intuitiva

#### Edge Functions API (`/admin-api`)
Endpoints REST protegidos por autenticação:
- `GET /admin-api/settings` - Listar todas as configurações
- `PUT /admin-api/settings` - Atualizar configuração
- `GET /admin-api/stats` - Obter estatísticas da plataforma
- `POST /admin-api/toggle-feature` - Ativar/desativar funcionalidades

#### Node-RED Integration
Arquivo `node-red-flows.json` pronto para importar com:
- 🎛️ Dashboard visual com botões e dropdowns
- 📊 Cards de estatísticas coloridos
- 🔄 Toggle de funcionalidades em tempo real
- 📋 Listagem de configurações formatada


### Estrutura do Banco de Dados

#### Tabela `user_roles`
```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- role (enum: 'admin' | 'user')
- created_at (timestamp)
```

#### Tabela `platform_settings`
```sql
- id (uuid, PK)
- key (text, unique)
- value (jsonb)
- description (text)
- updated_at (timestamp)
- updated_by (uuid, FK -> auth.users)
```

### Segurança

- ✅ RLS ativo em todas as tabelas
- ✅ Apenas admins podem modificar configurações
- ✅ Funções SECURITY DEFINER para evitar recursão
- ✅ Autenticação obrigatória nas Edge Functions
- ⚠️ **IMPORTANTE**: Habilite proteção de senhas vazadas (veja seção abaixo)

### ⚠️ Segurança: Proteção de Senhas Vazadas

O linter de segurança detectou que a proteção contra senhas vazadas está desabilitada. Para ativar:

1. Acesse o backend em: **Settings > Tools > View Backend**
2. Vá em **Authentication > Policies**
3. Ative **Password Strength** e **Leaked Password Protection**

Ou via SQL:
```sql
ALTER DATABASE postgres SET app.settings.auth_password_min_length = 8;
ALTER DATABASE postgres SET app.settings.auth_password_required_characters = 'upper,lower,number';
```

[Documentação oficial](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## 📝 Licença

MIT License

---

Desenvolvido por [Lucas Esteves](https://github.com/lukesteves92)
