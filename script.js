// ============================================
// CSS Generator IA - Script Melhorado
// ============================================

// ⚠️ IMPORTANTE: Nunca exponha a chave API no frontend!
// Use um backend/proxy para esconder a chave


// Seleção de elementos
const botao = document.querySelector(".botao");
const textarea = document.querySelector(".input-texto");
const blocoCodigo = document.querySelector(".bloco-codigo");
const codigoResposta = document.querySelector(".codigo-resposta");
const btnCopiar = document.querySelector(".btn-copiar");
const loadingSpinner = document.querySelector(".loading-spinner");
const errorMessage = document.querySelector(".error-message");
const historicList = document.querySelector(".historico-list");
const charCount = document.querySelector(".current-chars");

// Estado
let ultimoCodigo = "";

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    botao.addEventListener("click", gerarCodigo);
    btnCopiar.addEventListener("click", copiarCodigo);
    textarea.addEventListener("input", atualizarContador);
    carregarHistorico();
}

// ============================================
// CONTAGEM DE CARACTERES
// ============================================

function atualizarContador() {
    charCount.textContent = textarea.value.length;
}

// ============================================
// VALIDAÇÃO
// ============================================

function validarInput(texto) {
    if (!texto || texto.trim().length === 0) {
        mostrarErro("😕 Por favor, descreva o que deseja gerar!");
        return false;
    }
    if (texto.length > 500) {
        mostrarErro("⚠️ Descrição muito longa (máximo 500 caracteres)");
        return false;
    }
    return true;
}

// ============================================
// GERAÇÃO DE CÓDIGO
// ============================================

async function gerarCodigo() {
    const textoUsuario = textarea.value.trim();
    
    // Validação
    if (!validarInput(textoUsuario)) return;
    
    // Preparar UI
    esconderErro();
    mostrarLoading();
    botao.disabled = true;
    
    try {
        const resposta = await fetch("/api/gerar-css", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: textoUsuario
            })
        });
        
        // Verificar resposta
        if (!resposta.ok) {
            throw new Error(`Erro do nosso servidor: ${resposta.status}`);
        }
        
        const dados = await resposta.json();
        
        let codigo = dados.codigo.trim();
        
        // Limpar markdown se existir (extra segurança)
        codigo = codigo.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
        
        // Validar se o código contém HTML/CSS
        if (!codigo.includes("<") && !codigo.includes("{")) {
            throw new Error("A IA não retornou código válido. Tente descrever melhor.");
        }
        
        // Atualizar tela
        ultimoCodigo = codigo;
        blocoCodigo.textContent = codigo;
        codigoResposta.srcdoc = codigo;
        
        // Adicionar ao histórico
        adicionarHistorico(textoUsuario, codigo);
        
        // Feedback visual
        mostrarSucesso();
        
    } catch (erro) {
        console.error("Erro:", erro);
        let mensagem = "❌ Erro ao gerar código";
        
        if (erro.message.includes("Failed to fetch")) {
            mensagem = "🔗 Erro de conexão. Verifique sua internet.";
        } else if (erro.message.includes("401")) {
            mensagem = "🔑 Erro de autenticação. Configure a chave API corretamente.";
        } else if (erro.message.includes("429")) {
            mensagem = "⏰ Muitas requisições. Aguarde um momento e tente novamente.";
        } else if (erro.message.includes("retornou código válido")) {
            mensagem = "🤔 A IA não conseguiu gerar o código. Tente ser mais específico.";
        } else {
            mensagem = `❌ ${erro.message}`;
        }
        
        mostrarErro(mensagem);
        blocoCodigo.textContent = "";
        codigoResposta.srcdoc = "";
        
    } finally {
        esconderLoading();
        botao.disabled = false;
        textarea.focus();
    }
}

// ============================================
// CÓPIA DE CÓDIGO
// ============================================

function copiarCodigo() {
    if (!ultimoCodigo) {
        mostrarErro("📋 Gere um código primeiro para copiar!");
        return;
    }
    
    navigator.clipboard.writeText(ultimoCodigo).then(() => {
        const textOriginal = btnCopiar.textContent;
        btnCopiar.textContent = "✅ Copiado!";
        
        setTimeout(() => {
            btnCopiar.textContent = textOriginal;
        }, 2000);
    }).catch(erro => {
        mostrarErro("❌ Erro ao copiar para a área de transferência");
    });
}

// ============================================
// FEEDBACK VISUAL
// ============================================

function mostrarLoading() {
    loadingSpinner.style.display = "flex";
}

function esconderLoading() {
    loadingSpinner.style.display = "none";
}

function mostrarErro(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.style.display = "block";
}

function esconderErro() {
    errorMessage.style.display = "none";
}

function mostrarSucesso() {
    // Poderia adicionar animação aqui
}

// ============================================
// HISTÓRICO (localStorage)
// ============================================

function adicionarHistorico(descricao, codigo) {
    const historico = obterHistorico();
    
    historico.unshift({
        descricao,
        codigo,
        data: new Date().toLocaleTimeString("pt-BR")
    });
    
    // Manter apenas os últimos 10 itens
    if (historico.length > 10) {
        historico.pop();
    }
    
    localStorage.setItem("cssGeneratorHistorico", JSON.stringify(historico));
    carregarHistorico();
}

function obterHistorico() {
    const dados = localStorage.getItem("cssGeneratorHistorico");
    return dados ? JSON.parse(dados) : [];
}

function carregarHistorico() {
    const historico = obterHistorico();
    historicList.innerHTML = "";
    
    if (historico.length === 0) {
        historicList.innerHTML = '<p style="color: #71717a; text-align: center; padding: 20px;">Nenhuma geração ainda. Comece a criar! 🚀</p>';
        return;
    }
    
    historico.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "historico-item";
        div.innerHTML = `
            <span class="historico-texto" title="${item.descricao}">
                ${item.descricao} <span style="color: #52525b; font-size: 12px;">(${item.data})</span>
            </span>
            <button class="historico-delete" data-index="${index}">✕</button>
        `;
        
        div.addEventListener("click", (e) => {
            if (!e.target.classList.contains("historico-delete")) {
                ultimoCodigo = item.codigo;
                blocoCodigo.textContent = item.codigo;
                codigoResposta.srcdoc = item.codigo;
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
        
        div.querySelector(".historico-delete").addEventListener("click", (e) => {
            e.stopPropagation();
            deletarDoHistorico(index);
        });
        
        historicList.appendChild(div);
    });
}

function deletarDoHistorico(index) {
    const historico = obterHistorico();
    historico.splice(index, 1);
    localStorage.setItem("cssGeneratorHistorico", JSON.stringify(historico));
    carregarHistorico();
}

// ============================================
// INICIALIZAR
// ============================================

init();