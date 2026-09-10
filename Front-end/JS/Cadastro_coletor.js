import{auth} from "../JS/Firebase-init.js"
import{createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const form_cadastro_coletor = document.querySelector("#form_cadastro_coletor")
const API_URL_SERVIDOR = "https://nativa-app.onrender.com"



form_cadastro_coletor.addEventListener("submit", (e)=>{
   e.preventDefault()

   const senha_coletor = document.querySelector("#input_senha_coletor").value 

    // 🔒 Checagem de Senha Forte antes de disparar o Firebase
    const checagem = validarSenha(senha_coletor);
    if (!checagem.tudoValido) {
        boxRegras.classList.add("active");
        inputSenha.focus();
        alert("Crie uma senha forte atendendo a todos os requisitos antes de continuar!");
        return; // Interrompe e não cadastra no Firebase
    } 
   
   const email_coletor = document.querySelector("#input_email_coletor").value
   
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
           const resposta = await fetch(`${API_URL_SERVIDOR}/usuario`, {
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



// =========================================================================
// VALIDAÇÃO PROFISSIONAL DE SENHA FORTE
// =========================================================================

const inputSenha = document.querySelector("#input_senha_coletor");
const boxRegras = document.querySelector("#boxRegrasSenha");

const itemTamanho = document.querySelector("#regra-tamanho");
const itemMaiuscula = document.querySelector("#regra-maiuscula");
const itemEspecial = document.querySelector("#regra-especial");

// Abre a caixinha com as regras ao focar no campo
if (inputSenha && boxRegras) {
    inputSenha.addEventListener("focus", () => {
        boxRegras.classList.add("active");
    });

    // Opcional: fecha ao clicar fora caso a senha já esteja toda válida
    inputSenha.addEventListener("blur", () => {
        if (validarSenha(inputSenha.value).tudoValido) {
            boxRegras.classList.remove("active");
        }
    });

    // Monitora a digitação em tempo real
    inputSenha.addEventListener("input", () => {
        validarSenha(inputSenha.value);
    });
}

function validarSenha(senha) {
    // Critérios
    const temTamanho = senha.length >= 6;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

    // Atualiza linha do Tamanho
    atualizarStatusRegra(itemTamanho, temTamanho);

    // Atualiza linha da Maiúscula
    atualizarStatusRegra(itemMaiuscula, temMaiuscula);

    // Atualiza linha do Caractere Especial
    atualizarStatusRegra(itemEspecial, temEspecial);

    return {
        tudoValido: temTamanho && temMaiuscula && temEspecial
    };
}

function atualizarStatusRegra(elemento, estaValido) {
    if (!elemento) return;
    const icone = elemento.querySelector("i");

    if (estaValido) {
        elemento.classList.add("valido");
        if (icone) {
            icone.className = "fa-solid fa-check";
        }
    } else {
        elemento.classList.remove("valido");
        if (icone) {
            icone.className = "fa-solid fa-circle";
        }
    }
}


//    - No Erro: verificar se o erro é de "e-mail já em uso" 