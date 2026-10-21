# 🔐 Login-Register-Edit

> **Plataforma completa de autenticação e gerenciamento de perfil com upload de avatar**

![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-v5.2+-blue?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14+-336791?logo=postgresql)
![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/License-ISC-yellow)

---

## 📋 Sobre o Projeto

**Login-Register-Edit** é uma aplicação web full-stack que oferece um sistema completo de autenticação de usuários com funcionalidades avançadas de gerenciamento de perfil. O projeto foi desenvolvido com foco em segurança, usabilidade e performance.

### ✨ Principais Funcionalidades

- ✅ **Registro de Usuários** - Cadastro seguro com validação de dados
- ✅ **Login/Logout** - Autenticação com sessões seguras
- ✅ **Gerenciamento de Perfil** - Edição de informações pessoais
- ✅ **Upload de Avatar** - Integração com Supabase Storage
- ✅ **Busca de CEP** - Preenchimento automático de endereço via ViaCEP
- ✅ **Edição de Endereço** - Atualização completa de dados de localização
- ✅ **Criptografia de Senha** - Bcrypt com salt de 12 rounds
- ✅ **Sessões Persistentes** - Express-session com segurança

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 5.2+ | Framework web |
| **PostgreSQL** | 14+ | Banco de dados relacional |
| **Supabase** | 2.112+ | Backend-as-a-Service (Auth + Storage) |
| **Bcrypt** | 6.0+ | Criptografia de senhas |
| **Multer** | 2.4+ | Upload de arquivos |
| **EJS** | 6.0+ | Template engine |

### Frontend
| Tecnologia | Descrição |
|-----------|-----------|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos responsivos |
| **JavaScript (Vanilla)** | Interatividade sem dependências |
| **Bootstrap Icons** | Ícones vetoriais |

### Ferramentas de Desenvolvimento
| Ferramenta | Descrição |
|-----------|-----------|
| **Nodemon** | Auto-reload em desenvolvimento |
| **Prisma** | ORM (opcional) |
| **Joi** | Validação de dados |
| **dotenv** | Variáveis de ambiente |

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.112.3",
    "bcrypt": "^6.0.0",
    "express": "^5.2.1",
    "express-session": "^1.19.0",
    "ejs": "^6.0.1",
    "multer": "^2.4.0",
    "pg": "^8.23.0",
    "dotenv": "^17.4.2",
    "joi": "^18.2.3"
  }
}
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js v18 ou superior
- PostgreSQL v14 ou superior
- Conta Supabase (gratuita)
- Git

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/Astr0ns/Login-Register-Edit.git
cd Login-Register-Edit
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
HOST=0.0.0.0
PORT=3000
NODE_ENV=development

# Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=login_register_edit

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta

# Sessão
SESSION_SECRET=sua_chave_secreta_aleatoria

# ViaCEP API (opcional)
VIACEP_API=https://viacep.com.br/ws
```

### Passo 4: Configurar Banco de Dados

#### Criar Tabela de Usuários

```sql
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    celular VARCHAR(20),
    CPF VARCHAR(14),
    bio TEXT,
    avatar_url VARCHAR(500),
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_cpf ON usuario(CPF);
```

### Passo 5: Configurar Supabase Storage

1. Acesse seu projeto Supabase
2. Vá para **Storage** → **Create a new bucket**
3. Nome do bucket: `images`
4. **⚠️ IMPORTANTE:** Marque como **Public**
5. Copie a URL e chave de serviço para `.env`

### Passo 6: Iniciar o Servidor

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em: `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
Login-Register-Edit/
├── app/
│   ├── config/
│   │   ├── pool_conexoes.js      # Conexão PostgreSQL
│   │   └── router.js              # Rotas principais
│   ├── controller/
│   │   ├── user.js                # Lógica de usuários
│   │   ├── cepAPI.js              # Integração ViaCEP
│   │   └── upload-img.js          # Upload de avatar
│   └── views/
│       ├── pages/
│       │   ├── index.ejs          # Página inicial
│       │   ├── login.ejs          # Login
│       │   ├── register.ejs       # Registro
│       │   └── profile.ejs        # Perfil do usuário
│       └── partials/              # Componentes reutilizáveis
├── public/
│   ├── sources/
│   │   ├── profile.css            # Estilos do perfil
│   │   ├── index.css              # Estilos gerais
│   │   └── upload-img.js          # JavaScript do avatar
│   └── images/                    # Imagens estáticas
├── .env                           # Variáveis de ambiente
├── .gitignore                     # Arquivos ignorados
├── package.json                   # Dependências
├── index.js                       # Arquivo principal
└── README.md                      # Este arquivo
```

---

## 🔄 Fluxo de Funcionamento

### 1. Registro de Usuário

```
Usuário preenche formulário
    ↓
Validação de dados (Joi)
    ↓
Verificação de email duplicado
    ↓
Criptografia de senha (Bcrypt)
    ↓
Inserção no banco de dados
    ↓
Redirecionamento para login
```

### 2. Login

```
Usuário insere email e senha
    ↓
Busca usuário no banco
    ↓
Comparação de senha (Bcrypt)
    ↓
Criação de sessão
    ↓
Redirecionamento para perfil
```

### 3. Upload de Avatar

```
Usuário clica no avatar
    ↓
Seleciona arquivo (JPG, PNG, WebP)
    ↓
Modal mostra preview
    ↓
Clica "Confirmar"
    ↓
Upload para Supabase Storage
    ↓
Obtém URL pública
    ↓
Salva URL no banco de dados
    ↓
Atualiza sessão
    ↓
Avatar exibido permanentemente
```

### 4. Busca de CEP

```
Usuário digita CEP (8 dígitos)
    ↓
JavaScript faz requisição para ViaCEP
    ↓
API retorna dados de endereço
    ↓
Campos são preenchidos automaticamente
    ↓
Usuário pode editar se necessário
```

---

## 🔐 Segurança

### Implementações de Segurança

- ✅ **Criptografia de Senha** - Bcrypt com 12 rounds de salt
- ✅ **Sessões Seguras** - Express-session com cookie seguro
- ✅ **Validação de Entrada** - Joi para validação de dados
- ✅ **Proteção CSRF** - Tokens de sessão
- ✅ **SQL Injection Prevention** - Prepared statements (pg)
- ✅ **Bucket Público** - Supabase Storage com acesso controlado
- ✅ **Variáveis de Ambiente** - Chaves sensíveis não expostas

### Boas Práticas

```javascript
// ✅ Usar prepared statements
const query = "SELECT * FROM usuario WHERE email = $1";
connection.query(query, [email]);

// ✅ Criptografar senhas
const senhaHash = await bcrypt.hash(senha, salt);

// ✅ Validar entrada
const schema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required()
});
```

---

## 📝 Rotas da API

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Página inicial |
| GET | `/login` | Formulário de login |
| POST | `/fazerLogin` | Processar login |
| GET | `/register` | Formulário de registro |
| POST | `/fazerRegistro` | Processar registro |
| POST | `/logout` | Fazer logout |

### Perfil

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/profile` | Página de perfil |
| POST | `/editarInfo` | Atualizar informações |
| POST | `/editarEndereco` | Atualizar endereço |
| POST | `/upload-avatar` | Upload de avatar |

### Utilitários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/controller/cepAPI.js` | API de CEP |
| GET | `/controller/upload-img.js` | Script de upload |

---

## 🐛 Troubleshooting

### Avatar não aparece após upload

**Solução:** Verifique se o bucket Supabase está marcado como **Public**

```bash
# Supabase Dashboard → Storage → images → Settings → Public
```

### Erro de conexão com banco de dados

**Solução:** Verifique as variáveis de ambiente

```bash
# Verificar .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=login_register_edit
```

### Sessão não persiste

**Solução:** Verifique se `SESSION_SECRET` está configurado

```env
SESSION_SECRET=sua_chave_secreta_aleatoria_e_forte
```

### CEP não preenche automaticamente

**Solução:** Verifique conexão com internet e se ViaCEP está acessível

```javascript
// Testar em console do navegador
fetch('https://viacep.com.br/ws/01310100/json')
  .then(r => r.json())
  .then(console.log)
```

---

## 📊 Diagrama de Banco de Dados

```
┌─────────────────────────────────────┐
│          TABELA: usuario            │
├─────────────────────────────────────┤
│ id (PK)                             │
│ nome                                │
│ sobrenome                           │
│ email (UNIQUE)                      │
│ senha (HASH)                        │
│ celular                             │
│ CPF                                 │
│ bio                                 │
│ avatar_url (Supabase URL)           │
│ logradouro                          │
│ numero                              │
│ complemento                         │
│ bairro                              │
│ cidade                              │
│ estado                              │
│ cep                                 │
│ created_at                          │
│ updated_at                          │
└─────────────────────────────────────┘
```

---

## 🎨 Interface do Usuário

### Páginas Principais

1. **Página Inicial** (`/`)
   - Apresentação do projeto
   - Links para login/registro

2. **Login** (`/login`)
   - Formulário de autenticação
   - Link para registro

3. **Registro** (`/register`)
   - Formulário de cadastro
   - Validação em tempo real

4. **Perfil** (`/profile`)
   - Edição de informações pessoais
   - Upload de avatar
   - Edição de endereço
   - Busca automática de CEP

---

## 🚀 Deploy

### Opções de Deploy

#### Heroku
```bash
heroku create seu-app
git push heroku main
```

#### Railway
```bash
railway link
railway up
```

#### Vercel + Serverless
```bash
vercel deploy
```

#### DigitalOcean
```bash
doctl apps create --spec app.yaml
```

---

## 📚 Documentação Adicional

- [Express.js Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- [EJS Docs](https://ejs.co/)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Astr0ns**

- GitHub: [@Astr0ns](https://github.com/Astr0ns)
- Projeto: [Login-Register-Edit](https://github.com/Astr0ns/Login-Register-Edit)

---

## 🙏 Agradecimentos

- Supabase pela infraestrutura cloud
- ViaCEP pela API de CEP
- Comunidade Node.js
- Todos os contribuidores

---

## 📞 Suporte

Para suporte, abra uma issue no repositório GitHub ou entre em contato através do email.

---

## 🔄 Changelog

### v1.0.0 (2026-10-21)
- ✅ Sistema de autenticação completo
- ✅ Upload de avatar com Supabase
- ✅ Integração com ViaCEP
- ✅ Gerenciamento de perfil
- ✅ Criptografia de senha com Bcrypt

---

**Última atualização:** 21 de outubro de 2026

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
