# GameHub

## O contexto

Projeto desenvolvido para a cadeira de DevOps e Integração Contínua com o objetivo de demonstrar, de forma prática, diferentes etapas do ciclo de desenvolvimento e entrega de software.

Ao longo do projeto foram aplicados conceitos de versionamento, integração contínua, containerização, persistência de dados, automação de pipelines e deploy, utilizando as ferramentas trabalhadas durante a disciplina.

A proposta do GameHub é servir como um ambiente de experimentação para demonstrar como diferentes práticas e ferramentas podem ser integradas dentro de um fluxo DevOps.

**DevOps não é uma ferramenta específica, mas uma cultura e uma maneira de organizar o desenvolvimento, a integração, a entrega e a operação do software.**

## O projeto

O GameHub é uma aplicação Web que permite ao usuário manter sua própria biblioteca de jogos.

A aplicação apresenta os jogos cadastrados em uma interface visual organizada e permite adicionar novos títulos por meio de uma janela modal.

Durante o cadastro, o sistema consulta a API externa TheGamesDB para auxiliar no preenchimento das informações dos jogos.

Os dados são persistidos em um banco MySQL e a aplicação pode ser executada em um ambiente containerizado utilizando Docker e Docker Compose.

## Linguagens de programação usadas no projeto

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/css-%23663399.svg?style=for-the-badge&logo=css&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![NodeJS](https://img.shields.io/badge/node.js-%236DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MySQL](https://img.shields.io/badge/mysql-%234479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

## DevOps e Integração no projeto

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white)

## 📚 Documentação

A documentação completa do projeto, incluindo configuração do ambiente, variáveis de ambiente, Docker, Docker Compose, GitHub Actions, Jenkins e demais etapas do fluxo DevOps, está disponível na **Wiki do repositório**.

Para executar ou reproduzir o ambiente do GameHub, consulte a Wiki antes de iniciar a aplicação.

## ⚠️ Atenção

Este projeto foi desenvolvido **exclusivamente para fins educacionais e pedagógicos**.

As configurações, credenciais de exemplo, arquitetura e estratégias de deploy utilizadas foram pensadas para um ambiente de laboratório e aprendizado. Portanto, o projeto não deve ser considerado pronto para utilização em um ambiente de produção real.
