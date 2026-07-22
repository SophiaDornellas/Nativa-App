package com.Nativa.nativa_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Nativa.nativa_app.entities.Usuarios;
import com.Nativa.nativa_app.repository.UsuariosRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import jakarta.transaction.Transactional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/usuario")
public class UsuariosController {
	
	@Autowired
	private UsuariosRepository usuarioRepository;
	
	@PostMapping
	public Usuarios criarUsuario(
			@RequestHeader("Authorization") String idToken_usuario,
			@RequestBody Usuarios usuario) {
		
		try {		    
		  String token_usuario = idToken_usuario.replace("Bearer", "").trim();
		  FirebaseToken decodedToken_usuario = FirebaseAuth.getInstance().verifyIdToken(token_usuario);
		  String id_usuario = decodedToken_usuario.getUid();
		  		
		  usuario.setId(id_usuario);
		  return usuarioRepository.save(usuario);
		  
		}catch(Exception e) {
			e.printStackTrace(); // 💡 Isso vai cuspir o erro real e a causa no console do Eclipse!
		    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno ao cadastrar o usuário", e);
		}
		//catch (com.google.firebase.auth.FirebaseAuthException e) {
		  //  throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
		//} catch (org.springframework.dao.DataIntegrityViolationException e) {
		    //throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este e-mail já está cadastrado", e);
		//} catch (Exception e) {
		  //  throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno ao cadastrar o usuário", e);
		//}
		
	}
	
	@GetMapping
	public List<Usuarios> retornarUsuarios(){
		return usuarioRepository.findAllOrderByXpTotalDesc();
	}
	
	@GetMapping("/perfil")
	public Usuarios retornarPerfil(
			@RequestHeader("Authorization") String idToken_usuario) {
		try {
			  String token_usuario = idToken_usuario.replace("Bearer", "").trim();
			  FirebaseToken decodedToken_usuario = FirebaseAuth.getInstance().verifyIdToken(token_usuario);
			  String id_usuario = decodedToken_usuario.getUid();
			  
			  return usuarioRepository.findById(id_usuario).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
			
		}catch (ResponseStatusException e) {
		    throw e; 
		} catch (com.google.firebase.auth.FirebaseAuthException e) {
		    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
		} catch (Exception e) {
		    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao buscar dados do perfil", e);
		}
	}
	
	@PutMapping
	@Transactional
	public ResponseEntity<Usuarios> editarPerfil(
			@RequestHeader("Authorization") String idToken_usuario,
			@RequestBody Usuarios usuarioAtualizado) {
		try {
			  String token_usuario = idToken_usuario.replace("Bearer", "").trim();
			  FirebaseToken decodedToken_usuario = FirebaseAuth.getInstance().verifyIdToken(token_usuario);
			  String id_usuario = decodedToken_usuario.getUid();
			  
			  Usuarios usuarioExistente = usuarioRepository.findById(id_usuario).orElseThrow(() ->
	          new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado")
			     );
			  
			  usuarioExistente.setNome(usuarioAtualizado.getNome());
			  usuarioExistente.setTelefone(usuarioAtualizado.getTelefone());
			  usuarioExistente.setEndereco_regiao(usuarioAtualizado.getEndereco_regiao());
			  usuarioExistente.setLatitude(usuarioAtualizado.getLatitude());
			  usuarioExistente.setLongitude(usuarioAtualizado.getLongitude());
			  usuarioExistente.setXp_total(usuarioAtualizado.getXp_total());
			  
			  return ResponseEntity.ok(usuarioRepository.save(usuarioExistente));
			
		}catch (ResponseStatusException e) {
		    throw e; 
		} catch (com.google.firebase.auth.FirebaseAuthException e) {
		    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
		} catch (Exception e) {
		    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar dados do perfil", e);
		}
	}
	
	

}
