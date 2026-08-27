# 🎮 GameHub

## 📌 O contexto

Projeto desenvolvido para a disciplina de **DevOps e Integração Contínua** com o objetivo de demonstrar, de forma prática, diferentes etapas do ciclo de desenvolvimento e entrega de software.

Ao longo do projeto foram aplicados conceitos de:

- versionamento;
- integração contínua;
- containerização;
- persistência de dados;
- configuração de ambientes;
- automação de pipelines;
- deploy;
- documentação.

A proposta do GameHub é servir como um ambiente educacional para demonstrar como diferentes práticas e ferramentas podem trabalhar em conjunto dentro de um fluxo DevOps.

> **DevOps não é uma ferramenta específica, mas uma cultura e uma maneira de organizar o desenvolvimento, a integração, a entrega e a operação do software.**

---

# 🕹️ O projeto

O GameHub é uma aplicação Web que permite ao usuário manter sua própria biblioteca de jogos.

A aplicação permite:

- pesquisar informações de jogos através da API TheGamesDB;
- cadastrar jogos em uma biblioteca pessoal;
- registrar uma avaliação de 1 a 5 estrelas;
- pesquisar jogos cadastrados;
- visualizar os jogos em uma interface paginada;
- armazenar os dados em banco MySQL.

Durante o cadastro, o sistema consulta a API externa **TheGamesDB** para auxiliar no preenchimento das informações.

Os dados cadastrados são posteriormente armazenados no banco MySQL.

---

# 🧰 Tecnologias utilizadas

## Desenvolvimento

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/css-%23663399.svg?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-%236DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%234479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

## DevOps e Integração

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white)

---

# ♾️ Fluxo DevOps do projeto

O GameHub foi utilizado para integrar diferentes ferramentas dentro de um mesmo fluxo.

```text
Desenvolvimento
     ↓
Git
     ↓
GitHub
     ↓
GitHub Actions
     ↓
Integração Contínua
     ↓
Docker
     ↓
Docker Compose
     ↓
Jenkins
     ↓
Deploy
     ↓
Health Check
     ↓
Aplicação em execução
```

---

# 📁 Estrutura principal do projeto

```text
GameHub/
│
├── .github/
│   └── workflows/
│
├── backend/
│   ├── .env.example
│   ├── .env.docker.example
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── init.sql
│
├── public/
│   ├── css/
│   ├── images/
│   ├── js/
│   └── index.html
│
├── .dockerignore
├── compose.yaml
├── Dockerfile
├── Jenkinsfile
└── README.md
```

Os arquivos contendo credenciais reais não são armazenados no repositório.

Exemplos:

```text
backend/.env
backend/.env.docker
```

---

# 🚀 Executando o projeto

A forma recomendada de executar o GameHub é utilizando **Docker e Docker Compose**.

Dessa forma, não é necessário instalar manualmente Node.js e MySQL para executar a aplicação.

---

## 📋 Pré-requisitos

Para executar o GameHub utilizando o ambiente recomendado:

- Git;
- Docker Desktop;
- Docker Compose;
- uma chave válida da API TheGamesDB.

Para reproduzir também a pipeline de deploy utilizada no projeto:

- Java;
- Jenkins.

> Jenkins não é necessário apenas para executar o GameHub. Ele é utilizado para reproduzir o fluxo de automação e deploy desenvolvido durante a disciplina.

---

# 1️⃣ Clonar o repositório

Abra o terminal e execute:

```bash
git clone URL_DO_REPOSITORIO
```

Exemplo:

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

Depois entre na pasta:

```bash
cd GameHub
```

---

# 2️⃣ Configurar as variáveis de ambiente

Os arquivos contendo valores reais não são enviados ao GitHub.

Para executar o projeto utilizando Docker, utilize como modelo:

```text
backend/.env.docker.example
```

Crie uma cópia chamada:

```text
backend/.env.docker
```

O arquivo deverá possuir uma estrutura semelhante a:

```env
# ==========================================================
# API EXTERNA
# ==========================================================

THEGAMESDB_API_KEY=SUA_CHAVE


# ==========================================================
# CONFIGURAÇÕES UTILIZADAS PELO GAMEHUB
# ==========================================================

DB_HOST=mysql
DB_PORT=3306
DB_USER=gamehub
DB_PASSWORD=SUA_SENHA_GAMEHUB
DB_NAME=gamehub


# ==========================================================
# CONFIGURAÇÕES UTILIZADAS PELO MYSQL
# ==========================================================

MYSQL_ROOT_PASSWORD=SUA_SENHA_ROOT
MYSQL_DATABASE=gamehub
MYSQL_USER=gamehub
MYSQL_PASSWORD=SUA_SENHA_GAMEHUB
```

## ⚠️ Importante

Os valores:

```env
DB_PASSWORD=
```

e:

```env
MYSQL_PASSWORD=
```

devem representar a mesma senha.

Exemplo:

```env
DB_USER=gamehub
DB_PASSWORD=minhaSenha

MYSQL_USER=gamehub
MYSQL_PASSWORD=minhaSenha
```

O usuário `root` é utilizado para administração do MySQL.

A aplicação utiliza o usuário:

```text
gamehub
```

---

# 3️⃣ Configurar a chave da TheGamesDB

A aplicação utiliza a API externa TheGamesDB para realizar buscas de jogos.

Configure:

```env
THEGAMESDB_API_KEY=SUA_CHAVE
```

utilizando uma chave válida.

Cada usuário deve fornecer sua própria credencial de acesso à API.

A chave não deve ser inserida diretamente no código-fonte.

---

# 4️⃣ Validar o Docker Compose

Antes de iniciar o ambiente, é possível validar a configuração:

```bash
docker compose config
```

Caso nenhum erro seja apresentado, o ambiente está pronto para ser iniciado.

---

# 5️⃣ Construir e iniciar o ambiente

Execute:

```bash
docker compose up --build
```

O Docker Compose será responsável por:

```text
Construir a imagem do GameHub
        ↓
Criar a rede Docker
        ↓
Criar o container MySQL
        ↓
Criar o banco gamehub
        ↓
Executar database/init.sql
        ↓
Criar a tabela jogos
        ↓
Criar o volume de persistência
        ↓
Aguardar o MySQL ficar saudável
        ↓
Iniciar o GameHub
```

---

# 6️⃣ Acessar a aplicação

Após os containers iniciarem, acesse:

```text
http://localhost:3000
```

---

# ❤️ Health Check

Para verificar se a aplicação e o banco estão funcionando:

```text
http://localhost:3000/api/health
```

Quando o ambiente estiver saudável, a resposta deverá indicar que a aplicação consegue acessar o banco.

Exemplo:

```json
{
  "status": "ok",
  "aplicacao": "GameHub",
  "banco": "conectado"
}
```

---

# 7️⃣ Testar a aplicação

Após acessar:

```text
http://localhost:3000
```

é possível:

1. clicar em **Adicionar novo jogo**;
2. pesquisar um jogo pelo nome;
3. selecionar um resultado da TheGamesDB;
4. revisar ou completar os campos;
5. escolher uma avaliação;
6. salvar o jogo;
7. verificar o jogo na biblioteca.

Os dados cadastrados serão armazenados no MySQL executado pelo Docker Compose.

---

# 💾 Persistência dos dados

O banco utiliza um volume Docker para armazenar os registros.

Isso significa que executar:

```bash
docker compose down
```

remove os containers, mas mantém os dados.

Depois:

```bash
docker compose up
```

os jogos cadastrados continuam disponíveis.

---

## ⚠️ Apagar também os dados

Para remover containers **e o volume do banco**:

```bash
docker compose down -v
```

Esse comando remove os dados persistentes.

Utilize apenas quando desejar reinicializar completamente o banco.

---

# ⏹️ Encerrar o ambiente

Para encerrar:

```bash
docker compose down
```

Para iniciar novamente:

```bash
docker compose up
```

Caso existam alterações no código ou no Dockerfile:

```bash
docker compose up --build
```

---

# 🔐 Segurança e variáveis de ambiente

Os arquivos:

```text
backend/.env
backend/.env.docker
```

não devem ser enviados ao GitHub.

Antes de realizar commits, utilize:

```bash
git status
```

e confirme que os arquivos contendo credenciais não aparecem entre os arquivos versionados.

O repositório possui apenas arquivos de exemplo:

```text
backend/.env.example
backend/.env.docker.example
```

Eles documentam quais variáveis precisam ser configuradas sem expor valores reais.

---

# ⚙️ GitHub Actions

O projeto possui workflows de automação armazenados em:

```text
.github/workflows/
```

Entre as automações desenvolvidas estão:

- Integração Contínua;
- validação do projeto;
- deploy estático;
- automação de Releases.

A CI é executada em um runner disponibilizado pelo GitHub.

---

# 🧰 Jenkins

O projeto também possui:

```text
Jenkinsfile
```

responsável por descrever a pipeline utilizada durante a disciplina.

O fluxo implementado inclui:

```text
Checkout
   ↓
Prepare Environment
   ↓
Validate
   ↓
Build
   ↓
Deploy
   ↓
Health Check
```

Para reproduzir essa pipeline, é necessário possuir Jenkins configurado e cadastrar o arquivo:

```text
backend/.env.docker
```

como uma credencial do tipo:

```text
Secret file
```

O projeto utiliza o identificador:

```text
gamehub-env-docker
```

Consulte a Wiki para instruções detalhadas.

---

# 🌐 GitHub Pages

O projeto também possui uma automação relacionada ao GitHub Pages.

Entretanto, é importante observar que o GitHub Pages disponibiliza apenas conteúdo estático.

Portanto:

```text
HTML
CSS
JavaScript
```

podem ser disponibilizados pelo Pages, mas o ambiente completo do GameHub depende também de:

```text
Node.js / Express
MySQL
```

Por esse motivo, o GitHub Pages não representa o deploy completo da aplicação.

Para utilizar todas as funcionalidades, execute o ambiente através do Docker Compose.

---

# 📚 Documentação

A documentação detalhada do projeto está disponível na **Wiki do repositório**.

Entre os conteúdos documentados estão:

- visão geral;
- arquitetura;
- aplicação Web;
- integração com a TheGamesDB;
- banco de dados;
- configurações e secrets;
- Git e GitHub;
- GitHub Actions;
- Docker;
- Docker Compose;
- persistência e volumes;
- execução e deploy;
- Jenkins;
- histórico de desenvolvimento.

Consulte a Wiki para compreender cada etapa do fluxo DevOps implementado.

---

# ✅ Status do projeto

**Versão educacional concluída.**

O fluxo principal definido para o projeto foi implementado e validado.

Entre as possíveis evoluções futuras estão:

- edição de jogos cadastrados;
- exclusão de jogos;
- ampliação dos testes automatizados;
- melhorias de interface;
- utilização de ambientes de deploy externos.

---

# ⚠️ Atenção

Este projeto foi desenvolvido **exclusivamente para fins educacionais e pedagógicos**.

As configurações, credenciais de exemplo, arquitetura e estratégias de deploy utilizadas foram pensadas para um ambiente de laboratório e aprendizado.

O projeto não deve ser considerado pronto para utilização em um ambiente real de produção.

---

# 📌 Resumo para quem acabou de clonar

```text
git clone
    ↓
entrar na pasta
    ↓
copiar .env.docker.example
    ↓
criar .env.docker
    ↓
configurar sua API Key e senhas
    ↓
docker compose config
    ↓
docker compose up --build
    ↓
http://localhost:3000
    ↓
/api/health
    ↓
GameHub funcionando ✅
```
