import { auth } from "../JS/Firebase-init.js"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


const form_cadastro_gerador = document.querySelector("#form_cadastro_gerador")

form_cadastro_gerador.addEventListener("submit", (e) => {
   e.preventDefault()
   const email_gerador = document.querySelector("#input_email_gerador").value
   const senha_gerador = document.querySelector("#input_senha_gerador").value
   const nome_gerador = document.querySelector("#input_nome_gerador").value
   const telefone_gerador = document.querySelector("#input_telefone_gerador").value

   const rua = document.querySelector("#input_rua_gerador").value.trim()
   const numero = document.querySelector("#input_numero_gerador").value.trim()
   const bairro = document.querySelector("#input_bairro_gerador").value.trim()
   const regiao_gerador = document.querySelector("#input_regiao_gerador").value.trim()
   const cidade = document.querySelector("#input_cidade_gerador").value.trim()
   const estado = document.querySelector("#input_estado_gerador").value.trim()

   // 2. Criação da variável 'endereco' montada e formatada
   const enderecoCompleto_gerador = `${rua}, ${numero} - ${bairro}, ${cidade} - ${estado} (${regiao_gerador})`;
   

   


      //    // Exemplo de como montar na hora de enviar o PUT/POST de edição:
      // const rua = document.getElementById("genEditRua").value.trim();
      // const numero = document.getElementById("genEditNumero").value.trim();
      // const bairro = document.getElementById("genEditBairro").value.trim();
      // const regiao = document.getElementById("genEditRegiao").value.trim();

      // // Padrão: "Rua, Número - Bairro - Região"
      // const endereco_regiao = `Rua ${rua}, ${numero} - Bairro ${bairro} - ${regiao}`;

      // RuaEnumero=
      // cidade
      // estado= 

      cadastrarGerador(email_gerador, senha_gerador, nome_gerador, telefone_gerador, enderecoCompleto_gerador )


})

function cadastrarGerador(email, senha, nome, telefone, enderecoCompleto_gerador) {

   createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {

         const user = userCredential.user
         const emailFire = user.email
         // const endereco_regiao = endereco + regiao //Enviar Bairro para o back-end!!!

         user.getIdToken(true).then((idToken) => {

            // 1. Usamos a busca estruturada + o parâmetro de email oficial da documentação!
            // const ruaENumero = "Rua Meridional, 42"; // Ex: "Rua dos Guajajaras, 175"
            // const cidade = "Belo Horizonte";
            // const estado = "MG";

            // const emailIdentificacao = "sophiadornellas7@gmail.com"; // ◄ Coloque um e-mail real aqui!

            // const urlMapas = `https://nominatim.openstreetmap.org/search?format=json&limit=1&street=${encodeURIComponent(ruaENumero)}&city=${encodeURIComponent(cidade)}&state=${encodeURIComponent(estado)}&email=${encodeURIComponent(emailIdentificacao)}`;

            // console.log("URL Estruturada:", urlMapas);


            console.log("TODAS AS INFORMAÇÕES" + emailFire, senha, nome, telefone, enderecoCompleto_gerador)
            postarUsuario(idToken, emailFire, nome, telefone, enderecoCompleto_gerador)
                  // Continuar com o fluxo (Fetch POST para salvar no Firebase/Banco, etc.)

            // fetch(urlMapas)
            //    .then(response => response.json())
            //    .then(data => {
            //       console.log("Resposta exata da API:", data); // Agora deve vir preenchida!

            //       let latitude = 0.0;
            //       let longitude = 0.0;

            //       if (data && data.length > 0) {
            //          latitude = parseFloat(data[0].lat);
            //          longitude = parseFloat(data[0].lon);
            //          console.log("Coordenadas obtidas:", latitude, longitude);
            //       } else {
            //          console.warn("Endereço não encontrado pelo OpenStreetMap. Salvando com coordenadas padrão (0.0).");
            //       }
            //       // postarUsuario(idToken, emailFire, nome, telefone, endereco_regiao, latitude, longitude)
            //       // // Continuar com o fluxo (Fetch POST para salvar no Firebase/Banco, etc.)
            //    })
            //    .catch(error => {
            //       console.error("Erro ao buscar no OpenStreetMap:", error);
            //    })
         })
      }
      )
}

async function postarUsuario(idToken, email, nome, telefone, enderecoCompleto_gerador) {
   try {
      const resposta = await fetch("http://localhost:8080/usuario", {
         method: "POST",

         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
         },

         body: JSON.stringify({
            "nome": nome,
            "email": email,
            "telefone": telefone,
            "tipo_usuario": "GERADOR",
            "endereco_regiao": enderecoCompleto_gerador,
            // "latitude": latitude,
            // "longitude": longitude
         })
      })

      if (resposta.ok) {
         console.log("Usuário cadastrado com sucesso no banco Java!")
         window.location.href = "Painel_gerador.html"
      }
   } catch (erro) {
      console.log("Erro no fetch (post do coletor)" + erro)
   }
}





// 12. TRATAMENTO DE EXCEÇÕES E FALHAS (.catch)
// - Criar um bloco '.catch()' geral para interceptar e exibir mensagens amigáveis em português caso:
//   * O e-mail já esteja cadastrado no Firebase Auth. [21]
//   * O endereço está errado, curto, api de geolocalização está offline, endereço errado.
//   * A sua API Java Spring Boot retorne algum erro de banco de dados ou conexão. Se a senha for fraca, ou já existir email, etc

//VALIDAR AS COORDENADAS PARA NÃO VIR ERRADO ***

// fetch(urlMapas)
//     .then(response => response.json())
//     .then(data => {
//         if (data && data.length > 0) {
//             // ✅ Encontrou o endereço exato!
//             let latitude = data[0].lat;
//             let longitude = data[0].lon;

//             // Prossegue salvando no backend...
//         } else {
//             // ❌ O endereço digitado não existe ou está incompleto
//             alert("Não encontramos o endereço informado. Verifique o nome da rua e o número.");
//             return; // Impede o envio do cadastro
//         }
//     });