package com.Nativa.nativa_app.controller;


import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestParam;

import com.Nativa.nativa_app.repository.PedidosRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import jakarta.transaction.Transactional;

import com.Nativa.nativa_app.entities.Pedidos;
import com.Nativa.nativa_app.entities.Usuarios;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Permite que qualquer front-end acesse este controller
@RequestMapping("/pedido")
public class PedidosController {
  @Autowired
  private PedidosRepository pedidoRepository;
  
  @GetMapping
  public List<Pedidos> retornarPedidos(
		   @RequestParam(required = false) String tipo_residuo, 
		   @RequestParam(required = false) String volume,
		   @RequestParam(defaultValue = "Aguardando coletor") String status,
		   @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate data_coleta,
		   @RequestParam(required = false) String regiao
		  ){
	  
	  return pedidoRepository.buscarComFiltros(tipo_residuo, volume, status, data_coleta, regiao);
	 	  
  };
  
  
  @GetMapping("/coletor")
  public List<Pedidos> retornarPedidosDoColetor( @RequestHeader("Authorization") String idToken_coletor ){
	  
	   try {
		   //decodificar token
		    String token_coletor = idToken_coletor.replace("Bearer", "").trim();
			FirebaseToken decodedToken_coletor = FirebaseAuth.getInstance().verifyIdToken(token_coletor);
			String id_coletor = decodedToken_coletor.getUid();
			Usuarios coletor = new Usuarios();
			coletor.setId(id_coletor);
		   // return retornar livros com método do repository
			return pedidoRepository.findByIdGeradorOrderByIdPedidoDesc(coletor);
	   }catch(Exception e) {
		   throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
	   }
	  
  }
  
  @GetMapping("/gerador")
  public List<Pedidos> retornarPedidosDoGerador(@RequestHeader("Authorization") String idToken_gerador ){
	  try {
		  //decodificar token
		    String token_gerador = idToken_gerador.replace("Bearer", "").trim();
			FirebaseToken decodedToken_gerador = FirebaseAuth.getInstance().verifyIdToken(token_gerador);
			String id_gerador = decodedToken_gerador.getUid();
			Usuarios gerador = new Usuarios();
			gerador.setId(id_gerador);
		   // return retornar livros com método do repository
			return pedidoRepository.findByIdGeradorOrderByIdPedidoDesc(gerador);
	   }catch(Exception e) {
		   throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
	   }
	  
  }
  
  
  
  @PostMapping
  public Pedidos criarPedido(
		  @RequestHeader("Authorization") String idToken_gerador,
		  @RequestBody Pedidos pedido) {
	  
	  try {
		  
		  //decodificar token
		    String token_gerador = idToken_gerador.replace("Bearer", "").trim();
			FirebaseToken decodedToken_gerador = FirebaseAuth.getInstance().verifyIdToken(token_gerador);
			String id_gerador = decodedToken_gerador.getUid();
			Usuarios gerador = new Usuarios();
			pedido.setId_gerador(gerador);
		  // return salvar livro 
			return pedidoRepository.save(pedido);
	  }catch(Exception e){
		  throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
	  }
	  
  }
  
  @DeleteMapping("/{id}")
  @Transactional
  public ResponseEntity<Void> deletarPedido(
		  @RequestHeader("Authorization") String idToken_gerador,
		  @PathVariable Long id){
	  try {
		    String token_gerador = idToken_gerador.replace("Bearer", "").trim();
			FirebaseToken decodedToken_gerador = FirebaseAuth.getInstance().verifyIdToken(token_gerador);
			String id_gerador = decodedToken_gerador.getUid();
			Usuarios gerador = new Usuarios();
			gerador.setId(id_gerador);
			
			int linhasAfetadas = pedidoRepository.deleteByIdPedidoAndIdGerador(id, gerador);

		    // Se nenhuma linha foi afetada, o pedido não existia ou não era daquele usuário!
		    if (linhasAfetadas == 0) {
		        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado ou você não tem permissão para excluí-lo");
		    }
		    
			return ResponseEntity.noContent().build();
			
	  }catch(Exception e) {
		  throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
	  }
	  
  }
  
  @PutMapping("/{id}")
  @Transactional
  public ResponseEntity<Pedidos> editarPedido(
		  @RequestHeader("Authorization") String idToken_gerador,
		  @RequestBody Pedidos pedidoAtualizado,
		  @PathVariable Long id){
	  
	  try {
		  String token_gerador = idToken_gerador.replace("Bearer", "").trim();
		  FirebaseToken decodedToken_gerador = FirebaseAuth.getInstance().verifyIdToken(token_gerador);
		  String id_geradorEditor = decodedToken_gerador.getUid();
		  
		  Pedidos pedidoExistente = pedidoRepository.findById(id).orElseThrow(() ->
          new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado")
          );
		  
		  if(!pedidoExistente.getId_gerador().getId().equals(id_geradorEditor)){
			  throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Não tens permissão para editar este livro");
		  }
		  pedidoExistente.setStatus(pedidoAtualizado.getStatus());
		  pedidoExistente.setId_coletor(pedidoAtualizado.getId_coletor());
		  
		  return ResponseEntity.ok(pedidoRepository.save(pedidoExistente));
		  
		  
	  }catch(Exception e) {
		  throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
	  }
  }
	  
  
  
}
