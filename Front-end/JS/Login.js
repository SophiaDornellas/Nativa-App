// IMPORTAÇÕES:
// - Importar 'auth' de './firebase-config.js' [4]
// - Importar funções do Firebase: 'signInWithEmailAndPassword' e 'sendPasswordResetEmail' [7, 12]

// ELEMENTOS A MAPEAR DO DOM:
// - Botão "Cadastrar" no cabeçalho (redirecionar para seleção de cadastro) [13, 14]
// - Input de E-mail [14]
// - Input de Senha [14]
// - Checkbox "Lembrar de mim" [14]
// - Link "Esqueci minha senha" [14]
// - Formulário de Login (evento de submit) [14, 15]
// - Link "Ainda não tem conta? Cadastre-se aqui" [14]

// ESTRUTURAS E LÓGICAS DE PROGRAMAÇÃO:
// Evento: Submit do Formulário de Login:
//    - Bloquear comportamento padrão de recarregar a página (event.preventDefault())
//    - Capturar valores de E-mail e Senha
//    - Chamar 'signInWithEmailAndPassword(auth, email, senha)' [7]
//    - No Sucesso: redirecionar o usuário para o painel de controle dele
//    - No Erro: capturar o código de erro e exibir um alerta fofo em português (ex: "Senha incorreta!" ou "E-mail não cadastrado")
// Evento: Clique em "Esqueci minha senha":
//    - Verificar se o campo de E-mail está preenchido
//    - Chamar 'sendPasswordResetEmail(auth, email)' [12, 16]
//    - Exibir alerta confirmando o envio do link de recuperação [12]
