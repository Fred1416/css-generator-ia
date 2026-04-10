# 🎨 CSS Generator IA

Desenvolva estilos incríveis apenas descrevendo o que você imagina. Uma aplicação Full-stack que utiliza Inteligência Artificial para converter textos em códigos CSS prontos para uso na tela.

<div align="center">
  <img src="./img/CSS Generator.png" alt="Demonstração do CSS Generator IA" width="800">
</div>

## 🚀 O Projeto

O **CSS Generator IA** nasceu com o objetivo de simplificar o desenvolvimento Front-end usando IA. Além da interface amigável, o projeto destaca-se por possuir uma arquitetura moderna e **segura**: toda a comunicação com a API de IA foi isolada em um Back-end (Node.js) utilizando **Variáveis de Ambiente**, garantindo que nenhuma credencial sensível fique exposta no lado do cliente.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
- HTML5 Semântico
- CSS3 (UI Responsiva, Flexbox)
- JavaScript Vanilla (Fetch API e Manipulação do DOM)

**Back-end:**
- Node.js
- Express (Criação de rotas RESTful)
- Cors (Gerenciamento de permissões)
- Dotenv (Segurança do cofre)

**Inteligência Artificial:**
- [Groq API](https://groq.com/) (LLaMA 3.3 70B)

## ⚙️ Como Executar Localmente

### Pré-requisitos
Você precisará ter o **[Node.js](https://nodejs.org/)** instalado na sua máquina e gerar gratuitamente uma chave na **Groq**.

### Passo a Passo

1. Instale as dependências do Back-end:
   ```bash
   npm install
   ```

2. Configure o seu Cofre (Variável de Ambiente):
   Crie um arquivo chamado `.env` na raiz do projeto e insira a sua chave da Groq:
   ```env
   GROQ_API_KEY=sua_chave_aqui
   ```

3. Ligue a "Cozinha" (Servidor):
   ```bash
   node server.js
   ```

4. Abra o Front-end:
   Com o servidor rodando no terminal, basta dar um duplo clique e abrir o arquivo `index.html` no seu navegador!

---
Autor: Frederico Junior Duarte
*Projeto desenvolvido aplicando boas práticas de segurança, isolamento de Front-end/Back-end e requisições HTTP.*
