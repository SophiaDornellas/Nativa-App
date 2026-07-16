import{auth} from "../JS/Firebase-init.js"
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


   const form_cadastro_gerador = document.querySelector("#form_cadastro_gerador")

   form_cadastro_gerador.addEventListener("submit", (e)=>{
      e.preventDefault()
      const email_gerador = document.querySelector("#input_email_gerador").value
      const senha_gerador = document.querySelector("#input_senha_gerador").value 
      const nome_gerador = document.querySelector("#input_nome_gerador").value
      const telefone_gerador = document.querySelector("#input_telefone_gerador").value
      const endereco_gerador = document.querySelector("#input_endereco_gerador").value
      const regiao_gerador = document.querySelector("#input_regiao_gerador").value

      cadastrarGerador(email_gerador, senha_gerador, nome_gerador, telefone_gerador, endereco_gerador, regiao_gerador)


   })

   function cadastrarGerador(email, senha, nome, telefone, endereco, regiao){

      createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential)=>{
         const user = userCredential.user
         user.getIdToken(true).then((idToken)=>{
            //buscar geolocalização
            // juntar endereco e regiao
            // fetch post 
         })
      })
      .catch((error)=>{

      })

   }

// 2. CONSTANTES E SELETORES DO DOM (ESCOPO GLOBAL)
// - Mapear o formulário HTML pelo ID '#form_cadastro_gerador' [3]
// - Mapear os Inputs: Nome da Empresa, E-mail, Telefone, Senha [4]
// - NOVO: Mapear o Input de Endereço (ex: '#input_endereco_gerador') ou CEP [5]

// 3. OUVINTE DE EVENTOS PRINCIPAL (SUBMIT DO FORMULÁRIO)
// - Monitorar o evento 'submit' do formulário para manter as validações visuais nativas do HTML ativas (required) [6]
// - Passar o parâmetro de evento 'e' na arrow function [7]

// 4. PREVENÇÃO DE RECARREGAMENTO
// - Chamar 'e.preventDefault()' na primeira linha interna do evento para travar a atualização automática da tela [7, 8]

// 5. CAPTURA DOS VALORES DOS CAMPOS
// - Capturar o valor (.value) de todos os inputs (Nome, E-mail, Telefone, Senha e Endereço) [9]

// 6. VALIDAÇÃO PRÉVIA DE SEGURANÇA
// - Criar um bloco 'if' para verificar se nenhum dos campos obrigatórios foi enviado em branco [10, 11]
// - Se houver dados em branco, exibir alert() informativo e usar 'return;' para bloquear o envio [12]

// 7. INÍCIO DO FLUXO ASSÍNCRONO: CADASTRO NO FIREBASE AUTH
// - Chamar a função principal passando todos os dados como argumentos:
//   cadastrarGerador(nome, email, telefone, senha, endereco)

// 8. CRIAÇÃO DE CONTA NO FIREBASE (createUserWithEmailAndPassword)
// - Invocar 'createUserWithEmailAndPassword(auth, email, senha)' [2]
// - Tratamento de Sucesso (.then):
//   - Receber o objeto 'userCredential' e extrair o usuário: 'const user = userCredential.user' [2, 13]
//   - Obter o Token de Identificação assinado: Chamar 'user.getIdToken(true)' [14, 15]
//   - Tratamento de Sucesso do Token (.then((idToken) => { ... })):
//     * Agora que temos a segurança garantida pelo Firebase, vamos buscar a geolocalização do endereço! [16]

// 9. NOVO PASSO: CONSULTA DE GEOCODIFICAÇÃO (API NOMINATIM OPENSTREETMAP)
// - Dentro do bloco do idToken, disparar um 'fetch' para a API de geocodificação gratuita:
//   fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
// - Processar a resposta convertendo para JSON: '.then(response => response.json())'
// - Tratamento de Sucesso da Geocodificação (.then(data => { ... })):
//   - Verificar se a API encontrou o endereço (se o array 'data' não está vazio)
//   - Se encontrou:
//     * Extrair a Latitude: 'const latitude = data.lat'
//     * Extrair a Longitude: 'const longitude = data.lon'
//   - Se NÃO encontrou:
//     * Definir valores padrão de segurança (coordenadas do centro da cidade, por exemplo) ou alertar o usuário para revisar o endereço digitado.

// 10. REQUISIÇÃO HTTP POST PARA O SEU BACK-END JAVA (SPRING BOOT)
// - Ainda dentro do escopo do token e das coordenadas, abrir a chamada do 'fetch()' para a sua API Spring Boot [17]
// - URL Alvo: "http://localhost:8080/api/comerciantes" [18]
// - Configuração do Envio:
//   - method: "POST" [18]
//   - headers: {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer " + idToken  <-- Envia o token criptografado para o Java decodificar e validar o usuário no Admin SDK [16, 17, 19]
//     }
//   - body: JSON.stringify({ 
//       uid: user.uid, 
//       nome: nome, 
//       telefone: telefone, 
//       email: email,
//       latitude: latitude,   <-- NOVA INFORMAÇÃO EXTRAÍDA DA API DE MAPAS
//       longitude: longitude  <-- NOVA INFORMAÇÃO EXTRAÍDA DA API DE MAPAS
//     })

// 11. REDIRECIONAMENTO DE SUCESSO
// - Se a API Spring Boot retornar sucesso (como status 201 Created), encaminhar o comerciante para o seu painel de controle interno:
//   window.location.href = "Painel_gerador.html" [20]

// 12. TRATAMENTO DE EXCEÇÕES E FALHAS (.catch)
// - Criar um bloco '.catch()' geral para interceptar e exibir mensagens amigáveis em português caso:
//   * O e-mail já esteja cadastrado no Firebase Auth. [21]
//   * A API de geocodificação de endereços esteja offline.
//   * A sua API Java Spring Boot retorne algum erro de banco de dados ou conexão.