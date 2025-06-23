# CS2Hub - Hub Ibérico de Counter-Strike 2

O CS2Hub é uma plataforma moderna que une as comunidades competitivas de Counter-Strike 2 de Portugal e Espanha, oferecendo funcionalidades especializadas para casters, notícias e muito mais.

## 🚀 Funcionalidades Principais

### 🎤 **Casters & Streamers**
- Perfis detalhados de casters e streamers
- Filtros por idioma (PT/ES/EN)
- Sistema de avaliações e seguidores
- Status ao vivo em tempo real
- Redes sociais integradas

### 📰 **Sistema de Notícias**
- Artigos categorizados (Torneios, Equipas, Jogadores, Geral)
- Sistema de tags e pesquisa
- Tempo de leitura estimado
- Contador de visualizações
- Editor rico para conteúdo

### 🎨 **Design Moderno**
- Interface glassmorphism
- Animações fluidas com Framer Motion
- Design responsivo
- Tema escuro por padrão
- Componentes reutilizáveis

## 🏗️ Estrutura do Projeto

```
frontend/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 layout/          # Componentes de layout
│   │   │   ├── Header.tsx      # Navegação principal
│   │   │   └── Footer.tsx      # Rodapé
│   │   ├── 📁 ui/              # Componentes UI reutilizáveis
│   │   │   ├── Button.tsx      # Botões
│   │   │   ├── Card.tsx        # Cards
│   │   │   └── ...             # Outros componentes UI
│   │   ├── 📁 sections/        # Secções de páginas
│   │   ├── 📁 features/        # Funcionalidades específicas
│   │   ├── 📁 shared/          # Componentes partilhados
│   │   └── Layout.tsx          # Layout principal
│   ├── 📁 pages/               # Páginas da aplicação
│   │   ├── HomePage.tsx        # Página inicial
│   │   ├── CastersPage.tsx     # Lista de casters
│   │   ├── CasterProfilePage.tsx # Perfil de caster
│   │   ├── NewsPage.tsx        # Lista de notícias
│   │   └── NewsDetailPage.tsx  # Detalhes de notícia
│   ├── 📁 lib/                 # Utilitários e configuração
│   │   ├── 📁 utils/           # Funções utilitárias
│   │   ├── 📁 constants/       # Constantes da aplicação
│   │   ├── 📁 api/             # Cliente API
│   │   ├── 📁 validations/     # Validações
│   │   └── config.ts           # Configuração geral
│   ├── 📁 hooks/               # Hooks customizados
│   │   ├── useApi.ts           # Hook para chamadas API
│   │   ├── useLocalStorage.ts  # Hook para localStorage
│   │   └── useDebounce.ts      # Hook para debounce
│   ├── 📁 types/               # Tipos TypeScript
│   │   ├── api.ts              # Tipos da API
│   │   ├── components.ts       # Tipos de componentes
│   │   └── pages.ts            # Tipos de páginas
│   ├── 📁 utils/               # Utilitários gerais
│   │   ├── 📁 format/          # Funções de formatação
│   │   ├── 📁 validation/      # Funções de validação
│   │   └── 📁 helpers/         # Funções auxiliares
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Ponto de entrada
│   └── index.css               # Estilos globais
├── 📁 server/                  # Backend completo
├── 📁 public/                  # Assets estáticos
├── package.json                # Dependências
├── vite.config.ts              # Configuração Vite
├── tailwind.config.ts          # Configuração Tailwind
└── tsconfig.json               # Configuração TypeScript
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animações
- **React Router** - Roteamento
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM para base de dados
- **PostgreSQL** - Base de dados
- **JWT** - Autenticação

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- PostgreSQL (para o backend)

### Frontend
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Backend
```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📦 Scripts Disponíveis

```json
{
  "dev": "Executa o servidor de desenvolvimento",
  "build": "Cria a build de produção",
  "preview": "Preview da build de produção",
  "lint": "Executa o linter",
  "type-check": "Verifica tipos TypeScript"
}
```

## 🎨 Design System

### Cores Principais
- **Cyan**: `#00ffff` - Cor primária
- **Purple**: `#9333ea` - Cor secundária
- **Pink**: `#ec4899` - Cor de destaque

### Tipografia
- **Orbitron** - Títulos e elementos especiais
- **Inter** - Texto geral

### Componentes
- **Glassmorphism** - Efeito de vidro
- **Gradientes** - Transições suaves
- **Animações** - Micro-interações

## 🔧 Configuração

### Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_PWA=false
```

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🤝 Contribuição

1. Fork o projeto
2. Cria uma branch para a tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit as tuas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abre um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - vê o ficheiro [LICENSE](LICENSE) para detalhes.

## 👥 Equipa

- **Desenvolvimento Frontend**: CS2Hub Team
- **Desenvolvimento Backend**: CS2Hub Team
- **Design**: CS2Hub Team

## 📞 Contacto

- **Email**: contact@cs2hub.pt
- **Discord**: [CS2Hub Community](https://discord.gg/cs2hub)
- **Twitter**: [@cs2hub](https://twitter.com/cs2hub)

---

**CS2Hub** - Unindo as comunidades ibéricas de Counter-Strike 2 🎮 