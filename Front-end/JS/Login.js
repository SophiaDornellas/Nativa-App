import{auth} from "../JS/Firebase-init.js";
import {signInWithEmailAndPassword,
        sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// IMPORTAÇÕES:
// - Importar 'auth' de './firebase-config.js' [4]
// - Importar funções do Firebase: 'signInWithEmailAndPassword' e 'sendPasswordResetEmail' [7, 12]




const bot_logar = document.querySelector("#bot_logar")
const form_login = document.querySelector("#form_login")
const form_esqueciSenha = document.querySelector("#form_esqueciSenha")
const bot_esqueciSenha = document.querySelector("#bot_esqueciSenha")

form_login.addEventListener("submit", (e)=>{
    e.preventDefault()
    const email_l = document.querySelector("#input_login_email").value
    const senha_l = document.querySelector("#input_login_senha").value
    // if (!email_l || email_l.trim() === "" || !senha_l || senha_l.trim() === "") {
    //     //alert("Por favor, preencha o e-mail e a senha antes de tentar entrar.");
    //     return; // <-- Bloqueia o código aqui e impede o Firebase de rodar!
    // }
    
    logar(email_l, senha_l)
    
})

form_esqueciSenha.addEventListener("submit", (e)=>{
    e.preventDefault()
    const reset_email = document.querySelector("#input_reset_email").value
    esqueciSenha(reset_email)
})

function logar(email, senha){

   
    signInWithEmailAndPassword(auth, email, senha)
    .then((userCredential)=>{

        const user = userCredential.user

        user.getIdToken(true).then((idToken)=>{
        //    fetch("http://localhost:8080/api/usuarios/perfil", {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": "Bearer " + idToken // Enviando o token de forma segura
        //         }
        //     })
        //     .then(response => response.json())
        //     .then(dadosUsuario => {
        //         // 3. O seu back-end responde informando qual é o papel dele (role)
        //         if (dadosUsuario.role === "GERADOR") {
        //             window.location.href = "Painel_gerador.html";
        //         } else if (dadosUsuario.role === "COLETOR") {
        //             window.location.href = "Painel_coletor.html";
        //         } else {
        //             alert("Perfil não identificado no sistema!");
        //         }
        //     })
        //     .catch(error => {
        //         console.error("Erro ao buscar perfil no back-end:", error);
        //     });
        })

    })
    .catch((error)=>{
        console.error("Erro no login do Firebase:", error.message)
    })
}

  function esqueciSenha(email){
    // if(!email){
    //     alert("Precisa preencher o email")
    // }
    sendPasswordResetEmail(auth, email)
    .then(()=>{
         //aparecer mensagem de email enviado
        // const resetContainer = document.querySelector(".css-reset-conteiner");
        //    if (resetContainer) {
        //         resetContainer.removeAttribute("open");
        //      }
        // console.log("email enviado")
    }
    )
    .catch((error)=>{
       console.error("Erro ao enviar email", error.message)
    })
  }


