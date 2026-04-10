# 🛡️ Guia DevClub: Como Esconder Chaves de API (Front-end seguro)

Este é um resumão de como protegemos a chave da Groq (ou qualquer outra chave sensível) criando o nosso próprio mini-servidor. Guarde isso com carinho para os próximos projetos!

---

## 🛑 O Problema: Por que nunca expor a chave no Front-end?
No Front-end (HTML, CSS e JS que rodam no navegador), o código fica totalmente acessível ao usuário (o famoso F12 -> aba Sources). Se você deixar lá, qualquer um rouba sua chave e usa no seu lugar, estourando seu limite de uso.
* **Analogia:** É como pendurar a "chave do cofre" na parede do restaurante para todo cliente pegar.

## ✅ A Solução: Criar um Back-end (A "Cozinha")
A gente tira a responsabilidade do Front-end de falar com a API e cria um servidor seguro. O Front pede para o Servidor, o Servidor pega a chave secreta, faz a pesquisa na Groq e só devolve a resposta pronta para o Front.


---

## 🛠️ Passo a Passo Prático

### Passo 1: Inicializar o projeto e instalar os ajudantes
Dentro da pasta do projeto, no terminal:
1. `npm init -y` (Cria o `package.json`, que é o "RG" do projeto).
2. `npm install express cors dotenv`
   * **express:** Constrói o servidor facilmente.
   * **cors:** Permite que seu Front-end consiga pedir informações pro Back-end.
   * **dotenv:** Permite que a gente carregue variáveis super secretas num arquivo separado.

### Passo 2: Criar o "Cofre" com `.env`
Crie um arquivo chamado exatamente **`.env`** na raiz. É lá que a chave fica!
```env
GROQ_API_KEY=gsk_suachavegiganteaqui
```
*Aviso:* O seu javascript lê isso através do código `process.env.GROQ_API_KEY`.

### Passo 3: Fechar as portas com `.gitignore`
Crie o arquivo **`.gitignore`** e nunca deixe que esse "Cofre" vá parar no GitHub!
```text
node_modules/
.env
```

### Passo 4: Criar o Servidor (`server.js`)
Crie o arquivo `server.js` e cole o código do servidor. Esse arquivo recebe a mensagem do usuário, injeta a chave de segurança escondida, acessa a Groq e cospe a resposta limpa para o front-end. 
*(Para rodar o servidor no terminal: `node server.js`)*

### Passo 5: Atualizar o Front-end (`script.js`) 
Apague a chave velha do Front! O seu "Garçom" (`fetch`) não vai mais pedir no endpoint da Groq, ele vai pedir no SEU servidor:
```javascript
// O Front-end bate na NOSSA cozinha
const resposta = await fetch("http://localhost:3000/api/gerar-css", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: textoUsuario })
});

const dados = await resposta.json();
let codigo = dados.codigo; // Muito mais simples!
```

---
**🏆 Parabéns! Você subiu de nível em Segurança de Software.**
*Ass: Professor DevClub*
