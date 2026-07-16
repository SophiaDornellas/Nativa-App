import{auth} from "../JS/Firebase-init.js"
import{createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const form_cadastro_coletor = document.querySelector("#form_cadastro_coletor")



form_cadastro_coletor.addEventListener("submit", (e)=>{
   e.preventDefault()
   
   const email_coletor = document.querySelector("#input_email_coletor").value
   const senha_coletor = document.querySelector("#input_senha_coletor").value 
   const nome_coletor = document.querySelector("#input_nome_coletor").value
   const telefone_coletor = document.querySelector("#input_telefone_coletor").value
   
   cadastrarColetor(email_coletor, senha_coletor, nome_coletor, telefone_coletor)
})


function cadastrarColetor(email, senha, nome, telefone){
    createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential)=>{
       const user = userCredential.user
       user.getIdToken(true).then((idToken)=>{
         

         // fetch --> post 
         // se o post for bem sucedido --> direcionar para painel do coletor.
       })
    })
    .catch((error)=>{
      console.log("Erro ao criar usuário ou no post do usuário", error.message)
    })
}




// ELEMENTOS A MAPEAR DO DOM:
// - Input "Nome Completo" [20]
// - Input "E-mail" [20]
// - Input "Telefone / WhatsApp" [21]
// - Input "Senha" [21]
// - Formulário de Cadastro (evento de submit) [21]

// ESTRUTURAS E LÓGICAS DE PROGRAMAÇÃO:
// Evento: Submit do Formulário:
//    - Bloquear recarregamento da página (event.preventDefault())
//    - Capturar Nome, E-mail, Telefone e Senha dos inputs [20, 21]
//    - Chamar 'createUserWithEmailAndPassword(auth, email, senha)' [4, 7]
//    - No Sucesso da criação de credenciais no Firebase:
//         * Pegar o UID gerado pelo Firebase para esse usuário
//         * Fazer uma requisição HTTP POST para o seu back-end Java Spring Boot [22-24]
//           enviando um JSON contendo: { uid, nome, telefone, email }
//         * No sucesso do banco Java: redirecionar para o painel de coletas
//    - No Erro: verificar se o erro é de "e-mail já em uso" ou "senha muito curta" e exibir mensagem amigável na tela