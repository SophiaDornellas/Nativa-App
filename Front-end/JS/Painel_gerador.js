import { auth } from "../JS/Firebase-init.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    onAuthStateChanged(auth, async (user) => {

        if (user) {
            window.token = await user.getIdToken()
            // console.log(window.token)
            configurarBotaoVoltarSair()
            aparecerBoxEdicaoGerador();
            carregarDadosDoPerfil()
            carregarHistoricoColetas()

            setInterval(() => {
                carregarDadosDoPerfil();
                carregarHistoricoColetas();
            }, 3000);

            const formLancarPedido = document.querySelector("#formLancarPedido")
            formLancarPedido.addEventListener("submit", (e) => {
                e.preventDefault()
                console.log("pedido lançado")
                montarJsonPedido()
            })
            // carregarDadosDoPerfil()
            // carregarMinhaAgenda()
            // aparecerBoxEdicao()
        } else {
            window.location.href = "Login.html"
        }
    })
})

async function carregarDadosDoPerfil() {

    try {
        const resposta = await fetch("http://localhost:8080/usuario/perfil", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${window.token}`
            }
        })
        if (resposta.ok) {
            const dados = await resposta.json()
            // console.log(dados)
            atribuirDadosDoPerfil(dados)
        } else {
            console.error("Erro na requisição. Status:", resposta.status);
        }

    } catch (error) {
        // ✅ Corrigido: declarado o parâmetro 'error' no catch
        console.error("Falha ao comunicar com a API:", error);
    }


}

async function criarNovoPedido(pedidoBody) {
    // // 1. Gera o JSON formatado
    // const pedidoBody = montarJsonPedido();

    // Se a validação dentro do montarJsonPedido falhar (retornar null), interrompe o envio
    // if (!pedidoBo) return;

    try {
        const resposta = await fetch("http://localhost:8080/pedido", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.token}`
            },
            body: JSON.stringify(pedidoBody)
        });

        if (resposta.ok) {
            const pedidoCriado = await resposta.json();
            console.log("✅ Pedido cadastrado com sucesso!", pedidoCriado);
            // alert("Solicitação de coleta criada com sucesso!");

            // Recarrega o histórico na tela e limpa os campos
            if (typeof carregarHistoricoColetas === "function") {
                carregarHistoricoColetas();
            }
        } else {
            console.error("Erro ao criar pedido. Status:", resposta.status);
        }

    } catch (error) {
        console.error("Falha ao comunicar com a API:", error);
    }
}

// Vincular o evento ao botão no HTML


function atribuirDadosDoPerfil(dados) {
    if (!dados) return;

    // =========================================================================
    // 1. PREENCHIMENTO DO CABEÇALHO DO GERADOR
    // =========================================================================
    const elemNomeLoja = document.querySelector(".css-store-name");
    const elemEndLoja = document.querySelector(".css-store-sub");
    const elemXpLoja = document.querySelectorAll(".css-badge-group .css-badge")[1]; // Pega a tag de XP (350 XP)

    if (elemNomeLoja) {
        elemNomeLoja.textContent = dados.nome ? dados.nome : "Nome do Estabelecimento";
    }

    if (elemEndLoja) {
        // Exibe o endereço completo no subtítulo do card
        elemEndLoja.textContent = dados.endereco_regiao ? dados.endereco_regiao : "Endereço não cadastrado";
    }

    if (elemXpLoja) {
        let xpTotal = dados.xp_total !== undefined && dados.xp_total !== null ? dados.xp_total : 0;
        elemXpLoja.innerHTML = `<i class="fa-solid fa-leaf"></i> ${xpTotal} XP`;
    }

    // =========================================================================
    // 2. PREENCHIMENTO DOS CAMPOS DO MODAL DE EDIÇÃO
    // =========================================================================
    const inputNome = document.getElementById("genEditNome");
    const inputTelefone = document.getElementById("genEditTelefone");
    const inputRua = document.getElementById("genEditRua");
    const inputNumero = document.getElementById("genEditNumero");
    const inputBairro = document.getElementById("genEditBairro");
    const selectRegiao = document.getElementById("genEditRegiao");
    const selectCidade = document.getElementById("genEditCidade");
    const selectEstado = document.getElementById("genEditEstado");

    if (inputNome) inputNome.value = dados.nome || "";
    if (inputTelefone) inputTelefone.value = dados.telefone || "";

    // Padrão fixo para Cidade e Estado
    if (selectCidade) selectCidade.value = "Belo Horizonte";
    if (selectEstado) selectEstado.value = "MG";

    // =========================================================================
    // 3. DESESTRUTURAÇÃO INTELIGENTE DA STRING 'endereco_regiao'
    // =========================================================================
    if (dados.endereco_regiao) {
        const endTexto = dados.endereco_regiao;

        // Tenta separar pelo delimitador principal '-'
        const partesHifen = endTexto.split("-").map(p => p.trim());

        // Partes típicas:
        // partesHifen[0] -> "Meridional, 42" (Rua e Número)
        // partesHifen[1] -> "Bairro Serrano" (Bairro)
        // partesHifen[2] -> "Belo Horizonte" ou "Região"

        // --- Extração de Rua e Número ---
        if (partesHifen[0]) {
            const partesRuaNum = partesHifen[0].split(",");
            if (partesRuaNum.length >= 2) {
                if (inputRua) inputRua.value = partesRuaNum[0].trim();
                if (inputNumero) inputNumero.value = partesRuaNum[1].trim();
            } else {
                if (inputRua) inputRua.value = partesHifen[0];
            }
        }

        // --- Extração de Bairro ---
        if (partesHifen[1]) {
            // Remove a palavra "Bairro" caso esteja gravada
            let bairroLimpo = partesHifen[1].replace(/Bairro/i, "").trim();
            if (inputBairro) inputBairro.value = bairroLimpo;
        }

        // --- Extração e Seleção da Região ---
        // Procura se alguma região conhecida de BH está contida na string
        const regioesBH = ["Barreiro", "Centro-Sul", "Leste", "Pampulha", "Venda Nova", "Nordeste", "Noroeste", "Norte", "Oeste"];
        const regiaoEncontrada = regioesBH.find(r => endTexto.toLowerCase().includes(r.toLowerCase()));

        if (regiaoEncontrada && selectRegiao) {
            selectRegiao.value = regiaoEncontrada;
        }
    }
}

function aparecerBoxEdicaoGerador() {
    // Seletores ajustados exclusivamente para o Gerador
    const btnEngrenagem = document.querySelector(".css-top-nav .fa-gear")?.parentElement;
    const modalEditarPerfil = document.getElementById("modalEditarPerfilGerador");
    const btnFecharModal = document.getElementById("btnFecharModalGerador");

    // Abrir o modal ao clicar na engrenagem do header
    if (btnEngrenagem && modalEditarPerfil) {
        btnEngrenagem.addEventListener("click", (e) => {
            e.preventDefault();
            modalEditarPerfil.classList.add("active");
        });
    }

    // Fechar o modal ao clicar no botão 'X'
    if (btnFecharModal && modalEditarPerfil) {
        btnFecharModal.addEventListener("click", () => {
            modalEditarPerfil.classList.remove("active");
        });
    }

    // Fechar ao clicar no fundo semitransparente fora da caixinha
    if (modalEditarPerfil) {
        modalEditarPerfil.addEventListener("click", (e) => {
            if (e.target === modalEditarPerfil) {
                modalEditarPerfil.classList.remove("active");
            }
        });
    }
}

function editarUsuario() {
    // const rua = document.getElementById("genEditRua").value.trim();
    // const numero = document.getElementById("genEditNumero").value.trim();
    // const bairro = document.getElementById("genEditBairro").value.trim();
    // const regiao = document.getElementById("genEditRegiao").value.trim();

    // // Garante a formatação exata antes de disparar o PUT para a API
    // const enderecoRegiaoFormatado = `${rua}, ${numero} - Bairro ${bairro} - ${regiao}`;
}

function montarJsonPedido() {
    // 1. CAPTURA DO TIPO DE MATERIAL (tipo_residuo)
    let tipoResiduo = "";
    const radioMisturado = document.getElementById("js-radio-mixed");

    if (radioMisturado && radioMisturado.classList.contains("css-selected")) {
        tipoResiduo = "seco";
    } else {
        // Se escolheu "Separado por Categoria", verifica qual radio interno está marcado
        const subSelecionado = document.querySelector(".js-exclusive-sub:checked");
        if (subSelecionado) {
            // Pega o texto do elemento pai (<label>): "Papelão" -> "papelao" ou "Plástico" -> "plastico"
            let textoCategoria = subSelecionado.parentElement.textContent.trim().toLowerCase();
            tipoResiduo = textoCategoria.replace(/[ãáâ]/g, "a"); // Normaliza 'Papelão' para 'papelao'
        } else {
            alert("Por favor, selecione qual categoria de resíduo separado você deseja descartar.");
            return null;
        }
    }

    // 2. CAPTURA DO VOLUME ESTIMADO (volume)
    let volume = "";
    const volumeAtivo = document.querySelector(".js-vol.css-active .css-volume-title");

    if (volumeAtivo) {
        // Converte "Pouco" -> "pouco", "Médio" -> "medio", "Muito" -> "muito"
        volume = volumeAtivo.textContent.trim().toLowerCase().replace("é", "e");
    } else {
        alert("Por favor, selecione o volume estimado do resíduo.");
        return null;
    }

    // 3. CAPTURA DA DATA E HORÁRIO
    const dataColeta = document.getElementById("inputDataColeta")?.value;
    const horarioColeta = document.getElementById("inputHorarioColeta")?.value.trim();

    if (!dataColeta) {
        alert("Por favor, selecione a data desejada para a coleta.");
        return null;
    }

    if (!horarioColeta) {
        alert("Por favor, informe a janela de horário para a coleta.");
        return null;
    }

    // 4. CAPTURA DAS OBSERVAÇÕES
    const observacao = document.getElementById("iputObservacaoColeta")?.value.trim() || "";

    // =========================================================================
    // MONTAGEM DO OBJETO JSON
    // (A ordem dos atributos segue estritamente a classe Pedidos.java)
    // =========================================================================
    const pedidoBody = {
        "tipo_residuo": tipoResiduo,
        "volume": volume,
        "status": "AGUARDANDO COLETOR",
        "data_coleta": dataColeta,      // Formato YYYY-MM-DD
        "horario_coleta": horarioColeta,
        "observacao": observacao,
        "xp_pedido": 50                 // Pontuação padrão ao criar um novo pedido
    };
    criarNovoPedido(pedidoBody)
    limparCampos()
}


function limparCampos() {
    // 1. Reseta os inputs de texto e data do formulário
    const formElement = document.getElementById("formLancarPedido");
    if (formElement) formElement.reset();

    // 2. Reseta a seleção visual de Volume
    document.querySelectorAll(".js-vol").forEach(opt => opt.classList.remove("css-active"));

    // 3. Captura os elementos de Tipo de Resíduo diretamente no DOM
    const radioMisturado = document.getElementById("js-radio-mixed");
    const radioCategoria = document.getElementById("js-radio-cat");
    const subCategoriasBox = document.getElementById("js-box-categories");
    const iconMisturado = document.getElementById("js-icon-mixed");
    const iconCategoria = document.getElementById("js-icon-cat");

    // 4. Volta a seleção padrão para "Resíduo Seco Misturado"
    if (radioMisturado && radioCategoria) {
        radioMisturado.classList.add("css-selected");
        radioCategoria.classList.remove("css-selected");
    }

    if (subCategoriasBox) {
        subCategoriasBox.classList.add("hide");
    }

    if (iconMisturado && iconCategoria) {
        iconMisturado.className = "fa-regular fa-circle-dot";
        iconCategoria.className = "fa-regular fa-circle";
    }

    // 5. Desmarca os botões de rádio internos
    document.querySelectorAll(".js-exclusive-sub").forEach(inputRadio => inputRadio.checked = false);
}

// Atualizar a página a cada 10s



async function carregarHistoricoColetas() {
    try {
        const resposta = await fetch("http://localhost:8080/pedido/gerador", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${window.token}`
            }
        })
        if (resposta.ok) {
            const dados = await resposta.json()
            // console.log("Histórico de coleta:", dados)
            mostrarHistoricoColetas(dados)
        } else {
            console.log(resposta.status)
        }
    } catch (error) {
        console.log("erro na requisição dos pedidos da agenda do coletor" + error)
    }

}


function mostrarHistoricoColetas(dados) {
    // 1. Seleciona o container específico do histórico de coletas do Gerador
    const containerHistorico = document.querySelector(".css-history-section .css-collapsible-content");

    if (!containerHistorico) return;

    // 2. Limpa o conteúdo estático anterior da tela
    containerHistorico.innerHTML = "";

    // 3. Caso o gerador ainda não tenha feito nenhum pedido de coleta
    if (!dados || dados.length === 0) {
        let mensagemVazia = document.createElement("p");
        mensagemVazia.style.textAlign = "center";
        mensagemVazia.style.color = "#666";
        mensagemVazia.style.padding = "20px";
        mensagemVazia.textContent = "Você ainda não possui solicitações de coleta registradas.";
        containerHistorico.appendChild(mensagemVazia);
        return;
    }

    // 4. Mapeia e constrói a estrutura DOM de cada pedido do histórico
    dados.forEach((item) => {

        // Tratamento de segurança para valores nulos ou vazios
        for (let chave in item) {
            if (item[chave] === null || item[chave] === "") {
                item[chave] = "Não informado";
            }
        }

        // --- DIV PRINCIPAL DO CARD (.css-history-card) ---
        let card = document.createElement("div");
        card.classList.add("css-history-card");
        card.setAttribute("data-id", item.id_pedido);

        // --- BARRA SUPERIOR DO CARD (.css-card-top-bar: Data + Status) ---
        let cardTopBar = document.createElement("div");
        cardTopBar.classList.add("css-card-top-bar");

        // Data da Coleta (Formatando de YYYY-MM-DD para DD/MM/YYYY)
        let dateTag = document.createElement("span");
        dateTag.classList.add("css-date-tag");

        let dataFormatada = item.data_coleta;
        if (item.data_coleta && item.data_coleta.includes("-")) {
            const partesData = item.data_coleta.split("-");
            if (partesData.length === 3) {
                dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
            }
        }
        dateTag.innerHTML = `<i class="fa-regular fa-calendar"></i> ${dataFormatada}`;

        // Badge de Status com cor dinâmica
        let badgeStatus = document.createElement("span");
        badgeStatus.classList.add("css-status-pill");

        const statusLower = String(item.status).toLowerCase();

        // if (statusLower.includes("aguardando")) {
        //     badgeStatus.classList.add("css-status-waiting");
        //     badgeStatus.textContent = "Aguardando coletor";
        // } else if (statusLower.includes("confirmada")) {
        //     badgeStatus.classList.add("css-status-confirmed");
        //     badgeStatus.textContent = "Coleta confirmada";
        // } else {
        //     badgeStatus.classList.add("css-status-done");
        //     badgeStatus.textContent = item.status;
        // }

        if (statusLower.includes("aguardando")) {
            badgeStatus.classList.add("css-status-waiting");
            badgeStatus.textContent = "Aguardando coletor";
        } else if (statusLower.includes("confirmada")) {
            badgeStatus.classList.add("css-status-confirmed");
            badgeStatus.textContent = "Coleta confirmada";
        } else if (statusLower.includes("concluido")) {
            badgeStatus.classList.add("css-status-done");
            badgeStatus.textContent = "Concluído"; // ✨ Formatação bonita pro usuário!
        } else {
            badgeStatus.classList.add("css-status-done");
            badgeStatus.textContent = item.status;
        }

        cardTopBar.appendChild(dateTag);
        cardTopBar.appendChild(badgeStatus);

        // --- GRID DE INFORMAÇÕES PRINCIPAIS (.css-card-main-info) ---
        let mainInfoGrid = document.createElement("div");
        mainInfoGrid.classList.add("css-card-main-info");

        // Formatação do nome do Material
        let materialTexto = item.tipo_residuo;
        if (materialTexto === "seco") materialTexto = "Resíduo Seco";
        else if (materialTexto === "papelao") materialTexto = "Papelão";
        else if (materialTexto === "plastico") materialTexto = "Plástico";

        // Bloco Material
        let infoMaterial = document.createElement("div");
        infoMaterial.classList.add("css-info-block");
        infoMaterial.innerHTML = `<span class="css-info-label">Material</span><span class="css-info-value">${materialTexto}</span>`;

        // Bloco Volume
        let volumeTexto = item.volume ? item.volume.charAt(0).toUpperCase() + item.volume.slice(1) : "Não informado";
        let infoVolume = document.createElement("div");
        infoVolume.classList.add("css-info-block");
        infoVolume.innerHTML = `<span class="css-info-label">Volume</span><span class="css-info-value">${volumeTexto}</span>`;

        // Bloco Horário
        let infoHorario = document.createElement("div");
        infoHorario.classList.add("css-info-block");
        infoHorario.innerHTML = `<span class="css-info-label">Horário</span><span class="css-info-value">${item.horario_coleta}</span>`;

        // Bloco Ganho XP
        let infoXp = document.createElement("div");
        infoXp.classList.add("css-info-block");
        let xpValor = item.xp_pedido !== "Não informado" ? item.xp_pedido : 50;
        infoXp.innerHTML = `<span class="css-info-label">Ganho</span><span class="css-info-value css-xp-text"><i class="fa-solid fa-leaf"></i> +${xpValor} XP</span>`;

        mainInfoGrid.appendChild(infoMaterial);
        mainInfoGrid.appendChild(infoVolume);
        mainInfoGrid.appendChild(infoHorario);
        mainInfoGrid.appendChild(infoXp);

        // --- OBSERVAÇÃO RETRÁTIL (.css-obs-details) ---
        let obsDetails = document.createElement("details");
        obsDetails.classList.add("css-obs-details");

        let obsSummary = document.createElement("summary");
        obsSummary.classList.add("css-obs-summary");
        obsSummary.innerHTML = `Observação <i class="fa-solid fa-chevron-down css-obs-arrow"></i>`;

        let pObsContent = document.createElement("p");
        pObsContent.classList.add("css-obs-content");
        pObsContent.textContent = item.observacao && item.observacao !== "Não informado" ? item.observacao : "Nenhuma observação adicionada.";

        obsDetails.appendChild(obsSummary);
        obsDetails.appendChild(pObsContent);

        // --- MONTAGEM CONDICIONAL DO RODAPÉ / COLETOR ---
        // Se o pedido tiver um coletor atribuído (Objeto id_coletor)
        let collectorBox = document.createElement("div");
        let btnCancelar = document.createElement("button");
        btnCancelar.classList.add("css-btn-cancel");
        btnCancelar.textContent = "Cancelar Pedido";
        btnCancelar.setAttribute("data-id", item.id_pedido);

        // Adiciona evento de clique para cancelar o pedido
        btnCancelar.addEventListener("click", () => {
            let idPedido = btnCancelar.getAttribute("data-id");
            if (confirm("Tem certeza de que deseja cancelar esta solicitação de coleta?")) {
                console.log("Cancelar solicitação ID:", idPedido);
                cancelarColeta(idPedido)
                // Chame a sua função de cancelar solicitação aqui
            }
        });

        if (item.id_coletor && typeof item.id_coletor === "object" && item.id_coletor.nome) {
            collectorBox.classList.add("css-collector-box", "css-collector-row-layout");

            let infoColetor = document.createElement("div");
            let telColetor = item.id_coletor.telefone ? ` &nbsp;|&nbsp; <i class="fa-solid fa-phone"></i> ${item.id_coletor.telefone}` : "";
            infoColetor.innerHTML = `<i class="fa-solid fa-user-check"></i> <strong>Coletor:</strong> ${item.id_coletor.nome}${telColetor}`;

            collectorBox.appendChild(infoColetor);

            // Permite cancelar apenas se o pedido ainda não tiver sido concluído
            if (!statusLower.includes("concluído") && !statusLower.includes("concluido")) {
                btnCancelar.style.margin = "0";
                collectorBox.appendChild(btnCancelar);
            }
        } else {
            // Se ainda não tem coletor aceito (Aguardando coletor)
            collectorBox.classList.add("css-card-footer-align");

            if (!statusLower.includes("concluído") && !statusLower.includes("concluido")) {
                collectorBox.appendChild(btnCancelar);
            }
        }

        // --- INJETA OS ELEMENTOS DENTRO DO CARD ---
        card.appendChild(cardTopBar);
        card.appendChild(mainInfoGrid);
        card.appendChild(obsDetails);
        card.appendChild(collectorBox);

        // Injeta o card na tela
        containerHistorico.appendChild(card);
    });
}


// =========================================================================
// 7. CANCELAMENTO DE PEDIDOS (EVENT DELEGATION)
// =========================================================================
// Adicionar ouvinte de "click" no container geral da seção de histórico
// Capturar o ID do pedido clicado usando .closest(".css-history-card")
// Identificar se o clique ocorreu em um botão com a classe ".css-btn-cancel"
// Exibir uma caixinha de confirmação nativa usando o método confirm()
// Se confirmado, fazer FETCH DELETE ou PUT para /api/pedidos/${id}/cancelar no Java
// Se a exclusão der certo, remover o card da tela ou chamar carregarHistoricoColetas() para atualizar

async function cancelarColeta(idPedido) {
  try{
    const resposta = await fetch("http://localhost:8080/pedido/" + idPedido, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${window.token}`
        }
    })

    if (resposta.status === 204 || resposta.ok) {
        console.log(`✅ Pedido ${idPedido} cancelado com sucesso!`);
        alert("Solicitação de coleta cancelada com sucesso!");

        // Recarrega os cards na tela para remover o pedido deletado
        carregarHistoricoColetas()
    } else if (resposta.status === 404) {
        alert("Pedido não encontrado ou você não tem permissão para excluí-lo.");
    } else {
        console.error("Erro ao cancelar o pedido. Status:", resposta.status);
        alert("Ocorreu um erro ao tentar cancelar a coleta.");
    }
} catch(error){
   console.log("erro da requisição" + error)
}
}


// 1. Configura a abertura/fechamento do Modal ao clicar no botão 'Voltar'
function configurarBotaoVoltarSair() {
    const btnVoltar = document.querySelector(".css-top-nav"); // Pega o primeiro link "Voltar"
    const modalSair = document.getElementById("modalConfirmarSair");
    const btnFechar = document.getElementById("btnFecharModalSair");
    const btnLogout = document.getElementById("btnConfirmarLogout");

    // Abrir o modal ao clicar em "Voltar"
    if (btnVoltar && modalSair) {
        btnVoltar.addEventListener("click", (e) => {
            e.preventDefault();
            modalSair.classList.add("active");
        });
    }

    // Fechar ao clicar no 'X'
    if (btnFechar && modalSair) {
        btnFechar.addEventListener("click", () => {
            modalSair.classList.remove("active");
        });
    }

    // Fechar ao clicar no fundo transparente fora da caixa
    if (modalSair) {
        modalSair.addEventListener("click", (e) => {
            if (e.target === modalSair) {
                modalSair.classList.remove("active");
            }
        });
    }

    // Executar a função de Logout ao clicar no botão vermelho "Sair"
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            executarLogout();
        });
    }
}

// 2. Executa o signOut do Firebase e redireciona para o Login
async function executarLogout() {
    try {
        await signOut(auth);
        console.log("Usuário deslogado com sucesso.");
        window.location.href = "Login.html";
    } catch (error) {
        console.error("Erro ao tentar deslogar do Firebase:", error);
        alert("Ocorreu um erro ao tentar sair da conta.");
    }
}