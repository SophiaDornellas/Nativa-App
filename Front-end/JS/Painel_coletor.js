import { auth } from "../JS/Firebase-init.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    onAuthStateChanged(auth, async (user) => {

        if (user) {
            window.token = await user.getIdToken()
            console.log(window.token)
            carregarDadosDoPerfil()
            carregarMinhaAgenda()
            aparecerBoxEdicao()
            configurarBotaoVoltarSair()

            // Chamar a função que vai montar o filtro e acionar o get dos pedidos
            const selectResiduo = document.getElementById("tipoResiduoFiltro");
            const selectVolume = document.getElementById("volumeFiltro");
            const inputData = document.getElementById("dataFiltro");
            const selectRegiao = document.getElementById("regiaoFiltro");

            obterFiltros()

            // Para acionar o get dos pedidos sempre que o filtro for alterado
            const elementosFiltro = [selectResiduo, selectVolume, inputData, selectRegiao];

            elementosFiltro.forEach((elemento) => {
                elemento.addEventListener("change", () => {
                    obterFiltros();
                });
            });

        } else {
            window.location.href = "Login.html"
        }
    })
})


function obterFiltros() {

    const residuo = document.getElementById("tipoResiduoFiltro");
    const volume = document.getElementById("volumeFiltro");
    const data = document.getElementById("dataFiltro");
    const regiao = document.getElementById("regiaoFiltro");

    const filtro = {
        tipo_residuo: residuo.value, // ex: "seco", "papelao" ou ""
        volume: volume.value,
        status: "AGUARDANDO COLETOR",    // ex: "pouco", "medio" ou ""
        data_coleta: data.value,           // ex: "2026-07-21" ou ""
        regiao: regiao.value        // ex: "pampulha", "leste" ou ""
    };

    let param = new URLSearchParams()
    for (let chave in filtro) {
        let valor = filtro[chave]
        if (valor != null && valor != "") {
            param.set(chave, valor)
        }
    }

    console.log("Filtros selecionados:", param.toString());
    carregarPedidosDisponiveis(param.toString())

}





// =========================================================================
// 4. FUNÇÕES DE CARREGAMENTO DE DADOS (API CONTROLLERS)
// =========================================================================

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
            atribuirDadosDoPerfil(dados)
        } else {
            console.error("Erro na requisição. Status:", resposta.status);
        }

    } catch (error) {
        // ✅ Corrigido: declarado o parâmetro 'error' no catch
        console.error("Falha ao comunicar com a API:", error);
    }


}



async function carregarPedidosDisponiveis(param) {
    try {
        const resposta = await fetch("http://localhost:8080/pedido" + "?" + param)

        if (resposta.ok) {
            const dados = await resposta.json()
            console.log(dados)
            mostrarPedidosdaLista(dados)

        } else {
            console.log("resposta não retornou ok" + resposta.status)
        }
    } catch (error) {
        console.error("Falha ao comunicar com a API para buscar os pedidos", error);
    }
    // Fazer FETCH GET para /api/pedidos/disponiveis passando os parâmetros de busca
    // Limpar o container de pedidos no HTML
    // Mapear os dados recebidos da API e injetar a estrutura dos novos cards
}

async function carregarMinhaAgenda() {
    try {
        const resposta = await fetch("http://localhost:8080/pedido/coletor", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${window.token}`
            }
        })
        if (resposta.ok) {
            const dados = await resposta.json()
            console.log("AGENDA DO COLETOR:", dados)
            mostrarPedidosdaAgenda(dados)
        } else {
            console.log(resposta.status)
        }
    } catch (error) {
        console.log("erro na requisição dos pedidos da agenda do coletor" + error)
    }
    // Fazer FETCH GET para /api/pedidos/agenda enviando o token do coletor
    // Limpar o container da seção "Minha Agenda de Trabalho"
    // Mapear os dados e injetar os cards com os botões de Cancelar/Finalizar
}

function mostrarPedidosdaAgenda(dados) {
    // 1. Seleciona o container específico da Agenda do Coletor
    const containerAgenda = document.querySelector(".css-static-section .css-cards-list");

    if (!containerAgenda) return;

    // 2. Limpa os cards estáticos anteriores
    containerAgenda.innerHTML = "";

    // 3. Caso o coletor não tenha nenhum pedido aceito na sua agenda
    if (!dados || dados.length === 0) {
        let mensagemVazia = document.createElement("p");
        mensagemVazia.style.textAlign = "center";
        mensagemVazia.style.color = "#666";
        mensagemVazia.style.padding = "16px";
        mensagemVazia.textContent = "Você ainda não aceitou nenhuma coleta.";
        containerAgenda.appendChild(mensagemVazia);
        return;
    }

    // 4. Mapeia e constrói a estrutura DOM de cada pedido reservado
    dados.forEach((item) => {

        // Tratamento de valores nulos/vazios
        for (let chave in item) {
            if (item[chave] === null || item[chave] === "") {
                item[chave] = "Não informado";
            }
        }

        // --- CARD PRINCIPAL (.css-request-card .css-agenda-card) ---
        let card = document.createElement("div");
        card.classList.add("css-request-card", "css-agenda-card");
        card.setAttribute("data-id", item.id_pedido);

        // --- HEADER DO CARD (.css-card-header) ---
        let cardHeader = document.createElement("div");
        cardHeader.classList.add("css-card-header");

        let titulo = document.createElement("h3");
        titulo.textContent = item.id_gerador?.nome ? item.id_gerador.nome : "Gerador sem nome";

        let badgeStatus = document.createElement("span");
        badgeStatus.classList.add("css-status-badge", "css-status-orange");
        badgeStatus.textContent = item.status;

        cardHeader.appendChild(titulo);
        cardHeader.appendChild(badgeStatus);

        // --- CONTAINER DE DETALHES (.css-card-details) ---
        let cardDetails = document.createElement("div");
        cardDetails.classList.add("css-card-details");

        // Linha com Endereço + Botão Rota
        let addressRow = document.createElement("div");
        addressRow.classList.add("css-address-row");

        let pEndereco = document.createElement("p");
        let enderecoTexto = item.id_gerador?.endereco_regiao || item.regiao || "Endereço não cadastrado";
        pEndereco.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${enderecoTexto}`;

        let btnRota = document.createElement("button");
        btnRota.classList.add("css-btn-route");
        btnRota.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> Rota`;

        // Evento para abrir o endereço no Google Maps
        btnRota.addEventListener("click", () => {
            if (enderecoTexto !== "Endereço não cadastrado") {
                const urlMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoTexto)}`;
                window.open(urlMaps, "_blank");
            } else {
                alert("Este gerador não possui um endereço cadastrado.");
            }
        });

        addressRow.appendChild(pEndereco);
        addressRow.appendChild(btnRota);

        // Horário
        let pHorario = document.createElement("p");
        pHorario.innerHTML = `<i class="fa-solid fa-clock"></i> ${item.data_coleta} — ${item.horario_coleta}`;

        // Tipo de Resíduo
        let pResiduo = document.createElement("p");
        pResiduo.innerHTML = `<i class="fa-solid fa-leaf"></i> ${item.tipo_residuo}`;

        // Volume
        let pVolume = document.createElement("p");
        pVolume.innerHTML = `<i class="fa-solid fa-box"></i> <strong>Volume:</strong> ${item.volume}`;

        cardDetails.appendChild(addressRow);
        cardDetails.appendChild(pHorario);
        cardDetails.appendChild(pResiduo);
        cardDetails.appendChild(pVolume);

        // --- GRUPO DE BOTÕES DE AÇÃO (.css-action-group-split) ---
        let actionGroup = document.createElement("div");
        actionGroup.classList.add("css-action-group-split");

        // Botão Cancelar
        let btnCancelar = document.createElement("button");
        btnCancelar.classList.add("css-btn-action", "css-btn-red-outline");
        btnCancelar.textContent = "Cancelar Coleta";
        btnCancelar.setAttribute("data-id", item.id_pedido);
        btnCancelar.addEventListener("click", () => {
            let idPedido = btnCancelar.getAttribute("data-id");
            if (confirm("Tem certeza que deseja cancelar e liberar este pedido de volta para a rede?")) {
                console.log("Cancelar pedido ID:", idPedido);
                cancelarColeta(idPedido)
            }
        });

        // Botão Finalizar
        let btnFinalizar = document.createElement("button");
        btnFinalizar.classList.add("css-btn-action", "css-btn-blue");
        btnFinalizar.textContent = "Finalizar Coleta";
        btnFinalizar.setAttribute("data-id", item.id_pedido);
        btnFinalizar.addEventListener("click", () => {
            let idPedido = btnFinalizar.getAttribute("data-id");
            console.log("Finalizar pedido ID:", idPedido);
            // Aqui chamará sua função de concluir a coleta
        });

        actionGroup.appendChild(btnCancelar);
        actionGroup.appendChild(btnFinalizar);

        // --- ANEXA TODOS OS ELEMENTOS AO CARD ---
        card.appendChild(cardHeader);
        card.appendChild(cardDetails);
        card.appendChild(actionGroup);

        // Injeta na Agenda
        containerAgenda.appendChild(card);
    });
}


function atribuirDadosDoPerfil(dados) {
    console.log(dados.telefone)
    const elementoNomePerfil = document.querySelector("#nomeColetorHeader")
    const inputEditNome = document.getElementById("editNome")
    const inputEditTelefone = document.getElementById("editTelefone")

    const nomeFormatado = dados.nome ? dados.nome.charAt(0).toUpperCase() + dados.nome.slice(1).toLowerCase() : "";

    elementoNomePerfil.innerText = nomeFormatado;
    inputEditNome.value = dados.nome
    inputEditTelefone.value = dados.telefone
}

function mostrarPedidosdaLista(dados) {
    // 1. Seleciona o container específico dos cards de pedidos disponíveis
    const listaPedidos = document.querySelector(".css-collapsible-body .css-cards-list");

    if (!listaPedidos) return;

    // 2. Limpa o conteúdo estático anterior da tela
    listaPedidos.innerHTML = "";

    // 3. Caso o backend não retorne nenhum pedido
    if (!dados || dados.length === 0) {
        let mensagemVazia = document.createElement("p");
        mensagemVazia.style.textAlign = "center";
        mensagemVazia.style.color = "#666";
        mensagemVazia.style.padding = "16px";
        mensagemVazia.textContent = "Nenhum pedido disponível para os filtros selecionados.";
        listaPedidos.appendChild(mensagemVazia);
        return;
    }

    // 4. Mapeia e constrói a estrutura DOM de cada pedido
    dados.forEach((item) => {

        // Tratamento de valores nulos/vazios em todo o objeto (Estilo Biblioteca)
        for (let chave in item) {
            if (item[chave] === null || item[chave] === "") {
                item[chave] = "Não informado";
            }
        }

        // --- DIV PRINCIPAL DO CARD (.css-request-card) ---
        let card = document.createElement("div");
        card.classList.add("css-request-card");
        card.setAttribute("data-id", item.id_pedido);

        // --- HEADER DO CARD (.css-card-header) ---
        let cardHeader = document.createElement("div");
        cardHeader.classList.add("css-card-header");

        let titulo = document.createElement("h3");
        // Busca o nome do gerador dentro do objeto "id_gerador" do Spring Boot
        titulo.textContent = item.id_gerador?.nome ? item.id_gerador.nome : "Gerador sem nome";

        let badgeStatus = document.createElement("span");
        badgeStatus.classList.add("css-status-badge", "css-status-red");
        badgeStatus.textContent = item.status;

        cardHeader.appendChild(titulo);
        cardHeader.appendChild(badgeStatus);

        // --- TAG DE TIPO DE RESÍDUO (.css-tag-info) ---
        let tagInfo = document.createElement("span");
        tagInfo.classList.add("css-tag-info");

        let iconeFolha = document.createElement("i");
        iconeFolha.classList.add("fa-solid", "fa-leaf");

        tagInfo.appendChild(iconeFolha);
        tagInfo.appendChild(document.createTextNode(` Resíduo: ${item.tipo_residuo}`));

        // --- CONTAINER DE DETALHES (.css-card-details) ---
        let cardDetails = document.createElement("div");
        cardDetails.classList.add("css-card-details");

        // Volume
        let pVolume = document.createElement("p");
        pVolume.innerHTML = `<i class="fa-solid fa-box"></i> <strong>Volume estimado:</strong> ${item.volume}`;

        // Endereço (Extraído do perfil do gerador ou do pedido)
        let pEndereco = document.createElement("p");
        let enderecoTexto = item.id_gerador?.endereco_regiao || item.regiao || "Endereço não cadastrado";
        pEndereco.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${enderecoTexto}`;

        // Data e Horário da coleta
        let pHorario = document.createElement("p");
        pHorario.innerHTML = `<i class="fa-solid fa-clock"></i> ${item.data_coleta} — ${item.horario_coleta}`;

        // Contato (Telefone do gerador)
        let pContato = document.createElement("p");
        let telefoneTexto = item.id_gerador?.telefone || "Sem telefone";
        pContato.innerHTML = `<i class="fa-solid fa-phone"></i> <strong>Contato:</strong> ${telefoneTexto}`;

        cardDetails.appendChild(pVolume);
        cardDetails.appendChild(pEndereco);
        cardDetails.appendChild(pHorario);
        cardDetails.appendChild(pContato);

        // --- SEÇÃO RETRÁTIL DE OBSERVAÇÃO (.css-obs-details) ---
        let obsDetails = document.createElement("details");
        obsDetails.classList.add("css-obs-details");

        let obsSummary = document.createElement("summary");
        obsSummary.innerHTML = `Observação <i class="fa-solid fa-chevron-down"></i>`;

        let pObs = document.createElement("p");
        pObs.textContent = item.observacao;

        obsDetails.appendChild(obsSummary);
        obsDetails.appendChild(pObs);

        // --- BOTÃO DE AÇÃO (.css-btn-action) ---
        let btnAceitar = document.createElement("button");
        btnAceitar.classList.add("css-btn-action", "css-btn-green");
        btnAceitar.setAttribute("data-id", item.id_pedido);
        btnAceitar.textContent = "Aceitar e Reservar";

        // Evento de clique individual para aceitar o pedido
        btnAceitar.addEventListener("click", () => {
            let idPedido = btnAceitar.getAttribute("data-id");
            console.log("Reservando o pedido ID:", idPedido);
            aceitarPedido(idPedido)
            // Aqui você chamará a função de aceitar a coleta
        });

        // --- ANEXA TODOS OS SUB-ELEMENTOS AO CARD ---
        card.appendChild(cardHeader);
        card.appendChild(tagInfo);
        card.appendChild(cardDetails);
        card.appendChild(obsDetails);
        card.appendChild(btnAceitar);

        // --- INJETA O CARD NO CONTAINER DO HTML ---
        listaPedidos.appendChild(card);
    });
}

async function aceitarPedido(idPedido) {
    try {

        // const user = auth.currentUser;

        // if (!user) {
        //     console.error("Usuário não está logado no Firebase!");
        //     alert("Sua sessão expirou. Por favor, faça login novamente.");
        //     window.location.href = "Login.html";
        //     return;
        // }

        // // 2. FORÇA a geração de um token 100% NOVO e VÁLIDO no momento do clique
        // const tokenFresco = await user.getIdToken(true);
        const resposta = await fetch("http://localhost:8080/pedido/coletor-edita/" + idPedido, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.token}`,
            },
            body: JSON.stringify({
                "status": "COLETA CONFIRMADA"
            })
        })

        if (resposta.ok) {
            console.log("✅ Pedido reservado com sucesso!");
            // Re-executa a busca para recarregar a lista (o pedido sumirá pois o status mudou!)
            carregarMinhaAgenda()
            obterFiltros();
        } else {
            console.error("Erro no servidor. Status:", resposta.status);
        }
    } catch (error) {

    }
}

async function cancelarColeta(idPedido) {
    try {
        const resposta = await fetch("http://localhost:8080/pedido/coletor-edita/" + idPedido, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.token}` // 👈 MANTÉM O TOKEN VÁLIDO!
            },
            body: JSON.stringify({
                "status": "AGUARDANDO COLETOR" // 👈 Envia o status para liberar
            })
        });

        if (resposta.ok) {
            console.log("✅ Coleta cancelada e liberada de volta para a rede!");

            // Recarrega ambas as seções da tela
            obterFiltros();        // Reaparece na lista de disponíveis
            carregarMinhaAgenda(); // Sumi da agenda do coletor
        } else {
            console.error("Erro ao cancelar coleta. Status:", resposta.status);
        }
    } catch (error) {
        console.error("Falha na requisição cancelarColeta:", error);
    }
}

function aparecerBoxEdicao() {
    const btnEngrenagem = document.getElementById("btnEngrenagem");
    const modalEditarPerfil = document.getElementById("modalEditarPerfil");
    const btnFecharModal = document.getElementById("btnFecharModal");

    // Função para abrir o modal
    if (btnEngrenagem && modalEditarPerfil) {
        btnEngrenagem.addEventListener("click", (e) => {
            e.preventDefault(); // Evita comportamento padrão de link
            modalEditarPerfil.classList.add("active");
        });
    }

    // Função para fechar o modal ao clicar no botão 'X'
    if (btnFecharModal && modalEditarPerfil) {
        btnFecharModal.addEventListener("click", () => {
            modalEditarPerfil.classList.remove("active");
        });
    }

    // BÔNUS: Fechar o modal ao clicar no fundo escuro fora da caixinha
    if (modalEditarPerfil) {
        modalEditarPerfil.addEventListener("click", (e) => {
            if (e.target === modalEditarPerfil) {
                modalEditarPerfil.classList.remove("active");
            }
        });
    }
}


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

// 1. Configura a abertura/fechamento do Modal ao clicar no botão 'Voltar'
function configurarBotaoVoltarSair() {
    const btnVoltar = document.querySelector("#btnVoltarSair"); // Pega o primeiro link "Voltar"
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


// ➔ SUB-BLOCO B: Botão "Finalizar Coleta" (.css-btn-blue)
//    - Fazer FETCH PUT para a API Java alterando o estado do pedido para concluído
//    - Atualizar o saldo de bônus do coletor no ecrã



// ➔ SUB-BLOCO D: Botão "Rota" (.css-btn-route)
//    - Capturar o endereço em texto de dentro do card
//    - Abrir uma nova aba do navegador com a URL de navegação do Google Maps

// tratamento de erros: catch, e resivar todo o fluxo.