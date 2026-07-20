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
         
        const emailFire = user.email;
        console.log(idToken)
        postarUsuario(idToken, emailFire , nome, telefone)
         // fetch --> post 

         // se o post for bem sucedido --> direcionar para painel do coletor.
       })
    })
    .catch((error)=>{
      console.log("Erro ao criar usuário ou no post do usuário", error.message)
    })
}

async function postarUsuario(idToken, email, nome, telefone){
      try{
           const resposta = await fetch("http://localhost:8080/usuario", {
              method: "POST",

              headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${idToken}`
              },

              body:  JSON.stringify({
                "nome": nome,
                "email": email,
                "telefone": telefone,
                "tipo_usuario": "COLETOR"
            })
           })

           if(resposta.ok){
            console.log("Usuário cadastrado com sucesso no banco Java!")
            window.location.href = "Painel_coletor.html"
           }
      }catch(erro){
        console.log( "Erro no fetch (post do coletor)" + erro)
      }
}






//    - No Erro: verificar se o erro é de "e-mail já em uso" ou "senha muito curta" e exibir mensagem amigável na tela