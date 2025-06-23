# CS2Hub Backend API

Backend completo para a plataforma CS2Hub - Comunidade Portuguesa de Counter-Strike 2.

## 🚀 Funcionalidades Implementadas

### ✅ **Controladores Completos**
- **🔐 Autenticação** - Registro, login, JWT, refresh tokens
- **👥 Usuários** - CRUD completo com perfis e roles
- **🏆 Equipes** - Gestão de equipas com jogadores e estatísticas
- **🎮 Jogadores** - Perfis detalhados, stats, achievements
- **🏅 Torneios** - Criação, inscrições, participantes, brackets
- **📰 Notícias** - Sistema de blog com categorias e autores
- **🎤 Casters** - Gestão de comentadores e streamers
- **📋 Draft** - Sistema de draft para equipas

### ✅ **Funcionalidades Avançadas**
- **🔒 Segurança** - JWT, rate limiting, validação Zod
- **📊 Banco de Dados** - PostgreSQL com Drizzle ORM
- **🔄 Cache** - Redis para performance
- **📧 Email** - Sistema de notificações
- **📁 Upload** - Imagens e arquivos
- **🌐 WebSockets** - Funcionalidades em tempo real
- **📝 Logs** - Winston logging
- **🧪 Testes** - Jest com supertest

## 🛠️ Tecnologias

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL + Drizzle ORM
- **Cache**: Redis
- **Auth**: JWT + bcrypt
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Container**: Docker + Docker Compose

## 📦 Instalação

### 1. **Clone e Instale Dependências**
```bash
cd server
npm install
```

### 2. **Configure Variáveis de Ambiente**
```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cs2hub

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. **Configure Banco de Dados**
```bash
# Gere as migrações
npm run db:generate

# Execute as migrações
npm run db:migrate

# Ou use push para desenvolvimento
npm run db:push
```

### 4. **Popule com Dados de Exemplo**
```bash
npm run seed
```

### 5. **Inicie o Servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🐳 Docker

### **Iniciar com Docker Compose**
```bash
docker-compose up -d
```

### **Build da Imagem**
```bash
npm run docker:build
npm run docker:run
```

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Iniciar servidor de produção

# Banco de Dados
npm run db:generate      # Gerar migrações
npm run db:migrate       # Executar migrações
npm run db:push          # Push schema (dev)
npm run db:studio        # Abrir Drizzle Studio
npm run db:drop          # Dropar banco

# Dados
npm run seed             # Popular com dados de exemplo

# Qualidade de Código
npm run lint             # Verificar código
npm run lint:fix         # Corrigir problemas
npm run test             # Executar testes
npm run test:watch       # Testes em modo watch

# Docker
npm run docker:build     # Build da imagem
npm run docker:run       # Executar container
```

## 🔌 Endpoints da API

### **Autenticação**
```
POST   /api/auth/register     # Registrar usuário
POST   /api/auth/login        # Login
POST   /api/auth/refresh      # Refresh token
POST   /api/auth/logout       # Logout
GET    /api/auth/me           # Perfil atual
```

### **Usuários**
```
GET    /api/users             # Listar usuários
GET    /api/users/:id         # Usuário específico
PUT    /api/users/:id         # Atualizar usuário
DELETE /api/users/:id         # Deletar usuário
```

### **Equipes**
```
GET    /api/teams             # Listar equipes
GET    /api/teams/featured    # Equipes em destaque
GET    /api/teams/:id         # Equipe específica
POST   /api/teams             # Criar equipe
PUT    /api/teams/:id         # Atualizar equipe
DELETE /api/teams/:id         # Deletar equipe
```

### **Jogadores**
```
GET    /api/players           # Listar jogadores
GET    /api/players/featured  # Jogadores em destaque
GET    /api/players/:id       # Jogador específico
GET    /api/players/team/:id  # Jogadores da equipe
POST   /api/players           # Criar jogador
PUT    /api/players/:id       # Atualizar jogador
DELETE /api/players/:id       # Deletar jogador
```

### **Torneios**
```
GET    /api/tournaments           # Listar torneios
GET    /api/tournaments/featured  # Torneios em destaque
GET    /api/tournaments/upcoming  # Próximos torneios
GET    /api/tournaments/ongoing   # Torneios em andamento
GET    /api/tournaments/:id       # Torneio específico
POST   /api/tournaments           # Criar torneio
PUT    /api/tournaments/:id       # Atualizar torneio
DELETE /api/tournaments/:id       # Deletar torneio
POST   /api/tournaments/:id/register  # Inscrever equipe
```

### **Notícias**
```
GET    /api/news              # Listar notícias
GET    /api/news/featured     # Notícias em destaque
GET    /api/news/latest       # Últimas notícias
GET    /api/news/:id          # Notícia específica
POST   /api/news              # Criar notícia
PUT    /api/news/:id          # Atualizar notícia
DELETE /api/news/:id          # Deletar notícia
PUT    /api/news/:id/publish  # Publicar notícia
```

### **Casters**
```
GET    /api/casters           # Listar casters
GET    /api/casters/live      # Casters ao vivo
GET    /api/casters/:id       # Caster específico
POST   /api/casters           # Criar caster
PUT    /api/casters/:id       # Atualizar caster
DELETE /api/casters/:id       # Deletar caster
```

## 🗄️ Estrutura do Banco

### **Tabelas Principais**
- `users` - Usuários da plataforma
- `teams` - Equipes de CS2
- `players` - Jogadores
- `tournaments` - Torneios
- `tournament_participants` - Participantes de torneios
- `news` - Notícias e artigos
- `casters` - Comentadores e streamers
- `drafts` - Sistema de draft

### **Relacionamentos**
- Usuários podem pertencer a equipes
- Jogadores pertencem a equipes
- Torneios têm participantes (equipes)
- Notícias têm autores (usuários)

## 🔒 Segurança

- **JWT Authentication** - Tokens seguros com refresh
- **Rate Limiting** - Proteção contra spam
- **Input Validation** - Validação com Zod
- **Password Hashing** - bcrypt para senhas
- **CORS** - Configuração segura
- **Helmet** - Headers de segurança

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de código
npm test -- --coverage
```

### **Estrutura de Testes**
```
src/__tests__/
├── auth.test.ts          # Testes de autenticação
├── teams.test.ts         # Testes de equipes
├── players.test.ts       # Testes de jogadores
├── tournaments.test.ts   # Testes de torneios
└── setup.ts             # Configuração dos testes
```

## 📊 Monitoramento

- **Logs** - Winston com diferentes níveis
- **Health Check** - `/api/health`
- **Rate Limiting** - Proteção contra abuso
- **Error Handling** - Tratamento centralizado de erros

## 🚀 Deploy

### **Produção**
```bash
# Build
npm run build

# Start
npm start
```

### **Docker**
```bash
# Build e run
docker-compose up -d
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/cs2hub/backend/issues)
- **Documentação**: [Wiki](https://github.com/cs2hub/backend/wiki)
- **Email**: support@cs2hub.com

---

**Desenvolvido com ❤️ pela equipa CS2Hub** 