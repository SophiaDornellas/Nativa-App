// =========================================================================
// TOUR GUIADO DO NATIVO 🍃 - PAINEL DO GERADOR
// =========================================================================

const ETAPAS_TOUR = [
    {
        targetId: "js-toggle-form",
        title: "Olá! Eu sou o Nativo 🍃",
        text: "Bem-vindo ao seu painel! Aqui você pode solicitar a coleta dos seus materiais recicláveis com data e horário marcados para que um coletor autônomo retire no seu local.",
        isFirst: true
    },
    {
        targetId: "tour-step-material",
        title: "Tipo de Material",
        text: "Informe se os materiais estão misturados (secos) ou se você já separou o papelão do plástico."
    },
    {
        targetId: "tour-step-volume",
        title: "Volume Estimado",
        text: "Indique a quantidade aproximada da carga para sabermos o meio de transporte ideal (a pé, moto ou veículo utilitário)."
    },
    {
        targetId: "tour-step-agendamento",
        title: "Data e Horário",
        text: "Defina quando o coletor pode buscar. Ele só comparecerá no dia e dentro do período que você autorizar!"
    },
    {
        targetId: "tour-step-submit",
        title: "Lançar Chamado",
        text: "Tudo certo! Quando terminar o preenchimento, lance o pedido. Se tiver dúvidas futuras, basta clicar no ponto de interrogação (?) de qualquer campo.",
        isLast: true
    }
];

let indiceAtual = 0;

document.addEventListener("DOMContentLoaded", () => {
    montarEstruturaTour();
    vincularBotoesAjuda();

    // Inicia automaticamente apenas na primeira visita
    const tourFeito = localStorage.getItem("nativa_tour_gerador_concluido");
    if (!tourFeito) {
        setTimeout(() => {
            iniciarTourCompleto();
        }, 400);
    }
});

function montarEstruturaTour() {
    // Backdrop escuro
    const overlay = document.createElement("div");
    overlay.id = "tour-overlay";
    overlay.className = "css-tour-overlay";
    document.body.appendChild(overlay);

    // Card flutuante
    const tooltip = document.createElement("div");
    tooltip.id = "tour-tooltip";
    tooltip.className = "css-tour-tooltip";
    tooltip.innerHTML = `
        <button type="button" class="css-tour-close" id="tour-btn-close" title="Fechar">&times;</button>
        <div class="css-tour-header">
            <span class="css-tour-title" id="tour-tooltip-title"></span>
        </div>
        <div class="css-tour-body" id="tour-tooltip-text"></div>
        <div class="css-tour-footer" id="tour-tooltip-footer"></div>
    `;
    document.body.appendChild(tooltip);

    document.getElementById("tour-btn-close").addEventListener("click", fecharOuAvancar);
}

function iniciarTourCompleto() {
    // Garante que o formulário retrátil esteja aberto para exibir os passos
    const formTrigger = document.getElementById("js-toggle-form");
    if (formTrigger && formTrigger.classList.contains("css-collapsed")) {
        formTrigger.click();
    }

    indiceAtual = 0;
    apresentarPasso(indiceAtual);
}

function apresentarPasso(indice) {
    const passo = ETAPAS_TOUR[indice];
    if (!passo) {
        encerrarTour();
        return;
    }

    const elementoAlvo = document.getElementById(passo.targetId);
    if (!elementoAlvo) {
        fecharOuAvancar();
        return;
    }

    // Limpa realces anteriores
    document.querySelectorAll(".css-tour-highlight").forEach(el => el.classList.remove("css-tour-highlight"));

    // Destaca o elemento atual e rola a tela até ele
    elementoAlvo.classList.add("css-tour-highlight");
    elementoAlvo.scrollIntoView({ behavior: "smooth", block: "center" });

    // Preenche textos
    document.getElementById("tour-tooltip-title").textContent = passo.title;
    document.getElementById("tour-tooltip-text").textContent = passo.text;

    // Constrói botões de ação do rodapé
    const footer = document.getElementById("tour-tooltip-footer");
    footer.innerHTML = "";

    if (!passo.isLast) {
        const btnPular = document.createElement("button");
        btnPular.type = "button";
        btnPular.className = "css-tour-btn-skip";
        btnPular.textContent = "Pular Tour";
        btnPular.addEventListener("click", encerrarTour);
        footer.appendChild(btnPular);

        const btnProximo = document.createElement("button");
        btnProximo.type = "button";
        btnProximo.className = "css-tour-btn-next";
        btnProximo.textContent = passo.isFirst ? "Começar Tour" : "Próximo";
        btnProximo.addEventListener("click", fecharOuAvancar);
        footer.appendChild(btnProximo);
    } else {
        const btnConcluir = document.createElement("button");
        btnConcluir.type = "button";
        btnConcluir.className = "css-tour-btn-next";
        btnConcluir.textContent = "Entendido!";
        btnConcluir.addEventListener("click", encerrarTour);
        footer.appendChild(btnConcluir);
    }

    ajustarPosicao(elementoAlvo);

    document.getElementById("tour-overlay").classList.add("css-tour-visible");
    document.getElementById("tour-tooltip").classList.add("css-tour-visible");
}

function ajustarPosicao(alvo) {
    const tooltip = document.getElementById("tour-tooltip");
    const rect = alvo.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let topo = rect.bottom + scrollTop + 10;
    let esquerda = rect.left + (rect.width / 2) - 145;

    // Limites da viewport
    if (esquerda < 16) esquerda = 16;
    if (esquerda + 300 > window.innerWidth) {
        esquerda = window.innerWidth - 306;
    }

    tooltip.style.top = `${topo}px`;
    tooltip.style.left = `${esquerda}px`;
}

function fecharOuAvancar() {
    indiceAtual++;
    if (indiceAtual < ETAPAS_TOUR.length) {
        apresentarPasso(indiceAtual);
    } else {
        encerrarTour();
    }
}

function encerrarTour() {
    document.querySelectorAll(".css-tour-highlight").forEach(el => el.classList.remove("css-tour-highlight"));
    document.getElementById("tour-overlay")?.classList.remove("css-tour-visible");
    document.getElementById("tour-tooltip")?.classList.remove("css-tour-visible");
    localStorage.setItem("nativa_tour_gerador_concluido", "true");
}

// Configura os botões de interrogação (?) para abrir o passo correspondente
function vincularBotoesAjuda() {
    const botoes = document.querySelectorAll(".css-tour-help-btn");
    botoes.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const stepIndex = parseInt(btn.getAttribute("data-tour-step"), 10);
            if (!isNaN(stepIndex)) {
                indiceAtual = stepIndex;
                apresentarPasso(indiceAtual);
            }
        });
    });
}


