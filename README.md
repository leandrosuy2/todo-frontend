# 📝 To-Do List Frontend

Aplicação frontend moderna e responsiva para gerenciamento de tarefas (To-Do List), construída com React 18, TypeScript, Vite e Tailwind CSS. Esta aplicação consome uma API REST para autenticação e operações CRUD de tarefas.

**Repositório:** [https://github.com/leandrosuy2/todo-frontend.git](https://github.com/leandrosuy2/todo-frontend.git)

## 🎯 O que faz o projeto?

Este é um sistema completo de gerenciamento de tarefas que permite:

- **Autenticação de usuários**: Login e cadastro com token JWT
- **Gerenciamento de tarefas**: Criar, editar, excluir e marcar tarefas como concluídas
- **Filtros inteligentes**: Visualizar todas as tarefas, apenas pendentes ou apenas concluídas
- **Interface moderna**: Design responsivo e intuitivo com Tailwind CSS
- **Feedback visual**: Notificações toast para todas as operações
- **Proteção de rotas**: Apenas usuários autenticados podem acessar as tarefas

## 🚀 Como rodar o projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior
- **npm** (geralmente vem com o Node.js)

Para verificar se você tem instalado, execute no terminal:

```bash
node --version
npm --version
```

### Passo a passo

#### 1. Clone o repositório

```bash
git clone https://github.com/leandrosuy2/todo-frontend.git
cd todo-frontend
```

#### 2. Instale as dependências

```bash
npm install
```

Este comando irá instalar todas as dependências necessárias do projeto (React, TypeScript, Vite, Tailwind, etc.).

#### 3. Configure a URL da API (Opcional)

Por padrão, a aplicação se conecta ao backend em `http://localhost:3000`. Se seu backend estiver rodando em outra URL ou porta, crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> **Nota**: Substitua pela URL do seu backend se necessário. O backend precisa estar rodando para que a aplicação funcione corretamente.

#### 4. Execute o projeto

```bash
npm run dev
```

#### 5. Acesse a aplicação

Abra seu navegador e acesse:

**http://localhost:5173**

A aplicação estará rodando e você poderá:
- Fazer cadastro ou login
- Criar e gerenciar suas tarefas

## 📦 Scripts Disponíveis

O projeto possui os seguintes scripts npm:

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite) |
| `npm run build` | Cria o build otimizado para produção |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o linter para verificar o código |

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida para desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **React Router** - Roteamento de páginas
- **React Query (TanStack Query)** - Gerenciamento de estado do servidor e cache
- **Axios** - Cliente HTTP para requisições à API
- **React Hot Toast** - Biblioteca de notificações toast elegantes

## 📋 Funcionalidades

### Autenticação
- ✅ Login de usuários
- ✅ Cadastro de novos usuários
- ✅ Armazenamento seguro de token JWT
- ✅ Redirecionamento automático após autenticação

### Gerenciamento de Tarefas
- ✅ Listagem de tarefas com paginação
- ✅ Criar novas tarefas
- ✅ Editar tarefas existentes
- ✅ Excluir tarefas
- ✅ Marcar tarefas como concluídas/pendentes
- ✅ Filtros por status (Todas, Pendentes, Concluídas)

### Interface
- ✅ Design responsivo (mobile-first)
- ✅ Feedback visual em todas as operações
- ✅ Estados de loading, erro e sucesso
- ✅ Proteção de rotas (requer autenticação)
- ✅ Acessibilidade básica

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticação (Login, Register)
│   ├── shared/        # Componentes reutilizáveis (Button, Input, Card, etc.)
│   ├── tasks/         # Componentes de tarefas (TaskList, TaskItem, TaskForm)
│   └── routes/        # Componentes de roteamento (ProtectedRoute)
├── hooks/             # Hooks personalizados (useAuth, useTasks, etc.)
├── pages/             # Páginas da aplicação (TasksPage, NotFound)
├── services/          # Serviços de API (api.ts)
├── types/             # Definições de tipos TypeScript
├── App.tsx            # Componente principal da aplicação
└── main.tsx           # Entry point da aplicação
```

## 🪝 Hooks Personalizados

### `useAuth()`
Gerencia o estado de autenticação do usuário:
- `login(credentials)` - Realiza login
- `register(userData)` - Registra novo usuário
- `logout()` - Faz logout
- `isAuthenticated` - Estado booleano de autenticação
- `user` - Dados do usuário atual

### `useTasks(status, page, limit)`
Gerencia o ciclo de vida das tarefas:
- `tasks` - Lista de tarefas
- `loading` - Estado de carregamento
- `error` - Erro, se houver
- `create(data)` - Cria nova tarefa
- `update({ id, data })` - Atualiza tarefa existente
- `remove(id)` - Remove tarefa
- `toggleStatus(id)` - Alterna status da tarefa (concluída/pendente)

### `useTaskFilters()`
Gerencia os filtros de status das tarefas:
- `status` - Status atual do filtro
- `changeStatus(status)` - Altera o filtro

## 🛣️ Rotas da Aplicação

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/login` | Página de login | Público |
| `/register` | Página de cadastro | Público |
| `/tasks` | Página de tarefas | Protegido (requer login) |
| `/` | Redireciona para `/tasks` | - |
| `*` | Página 404 (não encontrada) | Público |

## 🔐 Autenticação

- O token JWT é armazenado no `localStorage` do navegador
- Rotas protegidas verificam autenticação automaticamente
- Usuários não autenticados são redirecionados para `/login`
- O token é incluído automaticamente em todas as requisições via interceptor do Axios
- Em caso de erro 401 (não autorizado), o usuário é deslogado automaticamente

## 🎯 Integração com API

A aplicação espera que o backend forneça os seguintes endpoints:

### Autenticação
- `POST /login` - Autenticação de usuário
- `POST /register` - Cadastro de novo usuário

### Tarefas
- `GET /tasks` - Listar tarefas (query params: `status`, `page`, `limit`)
- `GET /tasks/:id` - Obter tarefa específica por ID
- `POST /tasks` - Criar nova tarefa
- `PUT /tasks/:id` - Atualizar tarefa existente
- `DELETE /tasks/:id` - Excluir tarefa
- `PATCH /tasks/:id/complete` - Alternar status da tarefa

### Formato de Resposta Esperado

**Login/Register:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "Nome do Usuário",
    "email": "email@example.com"
  }
}
```

**Lista de Tarefas:**
```json
{
  "tasks": [...],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

## 🎨 Estilização

- **Tailwind CSS** para estilização utilitária e responsiva
- Design **mobile-first** (otimizado para dispositivos móveis)
- Estados visuais para loading, erro e sucesso
- Acessibilidade básica (foco visível, contrastes adequados)
- Tema moderno e limpo

## 🐛 Solução de Problemas

### A aplicação não conecta ao backend
- Verifique se o backend está rodando
- Confirme a URL no arquivo `.env` (ou use o padrão `http://localhost:3000`)
- Verifique se não há bloqueios de CORS

### Erro ao instalar dependências
- Certifique-se de ter Node.js 18+ instalado
- Tente limpar o cache: `npm cache clean --force`
- Delete `node_modules` e `package-lock.json` e execute `npm install` novamente

### Porta 5173 já está em uso
- O Vite tentará usar outra porta automaticamente
- Ou você pode especificar outra porta: `npm run dev -- --port 3001`

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 👨‍💻 Autor

**Leandro Dantas**

- GitHub: [@leandrosuy2](https://github.com/leandrosuy2)
- Repositório: [todo-frontend](https://github.com/leandrosuy2/todo-frontend.git)
