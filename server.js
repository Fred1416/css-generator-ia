
// 1. Carrega o nosso cofre (.env) logo de cara
require('dotenv').config(); 

// 2. Chama nossos ajudantes
const express = require('express');
const cors = require('cors');

// 3. Cria a nossa "Cozinha" (Servidor)
const app = express();

// 4. Avisa o Porteiro que todo mundo pode entrar (CORS) e que a linguagem é JSON
app.use(cors());
app.use(express.json());

// 4.1 Permite que o servidor entregue nosso Front-end!
app.use(express.static(__dirname));

// 5. A Rota: É como se fosse o "Caixa" onde o Garçom (seu script.js) vai fazer o pedido
app.post('/api/gerar-css', async (req, res) => {
    
    // Pegamos a frase que o usuário digitou lá no HTML
    const promptUsuario = req.body.prompt; 

    try {
        // A Cozinha faz o pedido pra Groq...
        const respostaGroq = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // ⚠️ OLHA O SEGREDO AQUI! 
                // process.env puxa a chave de dentro do arquivo .env! Segura e invisível!
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}` 
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Você é um gerador de código HTML e CSS profissional. 
                        REGRAS IMPORTANTES:
                        - Responda SOMENTE com código puro em HTML/CSS
                        - NUNCA use crases, markdown ou explicações
                        - Formato: primeiro a tag <style> completa com CSS, depois o HTML
                        - Use HTML5 semântico
                        - CSS moderno com flexbox/grid quando apropriado
                        - Se pedir movimento, use @keyframes com translateY/rotate
                        - Garanta que o código funcione em um iframe
                        - Código limpo e bem estruturado
                        - COMECE DIRETAMENTE COM <style>, sem prefácio`
                    },
                    {
                        role: "user",
                        content: promptUsuario
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        const dados = await respostaGroq.json();
        
        // Pega a resposta mastigada da IA
        const codigoGerado = dados.choices[0].message.content;

        // Entrega o "prato pronto" pro Front-end!
        res.json({ codigo: codigoGerado });

    } catch (erro) {
        console.error("Erro na cozinha:", erro);
        res.status(500).json({ error: "Deu ruim na Groq" }); // Se queimar a panela, avisa.
    }
});

// 6. Liga o servidor (Abre as portas do restaurante)
// O process.env.PORT é necessário para a Render!
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`🚀 A Cozinha tá aberta e rodando na porta ${PORTA}!`);
});
