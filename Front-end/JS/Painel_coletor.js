// =========================================================================
// 1. IMPORTAÇÕES E CONFIGURAÇÕES INICIAIS
// =========================================================================
// Importar 'auth' do Firebase-init.js
// Importar onAuthStateChanged do SDK do Firebase Auth


// =========================================================================
// 2. VARIÁVEIS GLOBAIS E SELETORES DO DOM
// =========================================================================
// Variável global para armazenar o Token JWT atual do Coletor
// Seletores do Header (Nome do Coletor e Saldo do Bônus)
// Seletores dos Filtros (Selects de resíduo, volume, região e input de data)
// Seletores dos Containers (.css-cards-list dos pedidos disponíveis e da agenda)


// =========================================================================
// 3. MONITORAMENTO DE AUTENTICAÇÃO (FIREBASE STATE)
// =========================================================================
// Executar onAuthStateChanged para verificar se o utilizador está logado
// Se logado: Gerar getIdToken(true), guardar na variável e chamar os carregamentos
// Se deslogado: Redirecionar para a página de login.html


// =========================================================================
// 4. FUNÇÕES DE CARREGAMENTO DE DADOS (API CONTROLLERS)
// =========================================================================

function carregarDadosDoPerfil() {
    // Fazer FETCH GET para a API Java buscando os dados do coletor logado
    // Injetar o Nome e o Bônus Acumulado nos elementos do Header
}

function carregarPedidosDisponiveis(filtros = {}) {
    // Fazer FETCH GET para /api/pedidos/disponiveis passando os parâmetros de busca
    // Limpar o container de pedidos no HTML
    // Mapear os dados recebidos da API e injetar a estrutura dos novos cards
}

function carregarMinhaAgenda() {
    // Fazer FETCH GET para /api/pedidos/agenda enviando o token do coletor
    // Limpar o container da seção "Minha Agenda de Trabalho"
    // Mapear os dados e injetar os cards com os botões de Cancelar/Finalizar
}


// =========================================================================
// 5. ESCUTA DE EVENTOS (FILTROS DE BUSCA)
// =========================================================================
// Adicionar ouvinte de evento "change" nos inputs e selects de filtragem
// Obter os valores selecionados da tela e disparar a função carregarPedidosDisponiveis


// =========================================================================
// 6. CONTROLADOR DE AÇÕES NOS CARDS (EVENT DELEGATION)
// =========================================================================
// Adicionar ouvinte de "click" no container geral da página (.css-main-content)
// Capturar o ID do pedido clicado através do card pai mais próximo (.css-request-card)

// ➔ SUB-BLOCO A: Botão "Aceitar e Reservar" (.js-btn-aceitar)
//    - Fazer FETCH PUT/POST para a API Java associando o pedido a este coletor
//    - Recarregar as listas do painel e da agenda em caso de sucesso

// ➔ SUB-BLOCO B: Botão "Finalizar Coleta" (.css-btn-blue)
//    - Fazer FETCH PUT para a API Java alterando o estado do pedido para concluído
//    - Atualizar o saldo de bônus do coletor no ecrã

// ➔ SUB-BLOCO C: Botão "Cancelar Coleta" (.css-btn-red-outline)
//    - Exibir uma caixinha de confirmação com confirm()
//    - Se confirmado, fazer FETCH PUT para a API Java libertando o pedido de volta para a rede

// ➔ SUB-BLOCO D: Botão "Rota" (.css-btn-route)
//    - Capturar o endereço em texto de dentro do card
//    - Abrir uma nova aba do navegador com a URL de navegação do Google Maps