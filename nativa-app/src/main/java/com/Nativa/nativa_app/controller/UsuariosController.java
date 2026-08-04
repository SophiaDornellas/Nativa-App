package com.Nativa.nativa_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Nativa.nativa_app.entities.Usuarios;
import com.Nativa.nativa_app.repository.UsuariosRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
			  System.out.println(id_usuario);
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
	
	@PutMapping("/adicionar-xp/{id}")
	@Transactional
	public ResponseEntity<Usuarios> adicionarXpGerador(
	        @RequestHeader("Authorization") String idToken,
	        @PathVariable String id,
	        @RequestBody java.util.Map<String, Integer> body) {
	    try {
	        // 1. Valida o Token do Firebase para garantir que a requisição é de um usuário autenticado
	        String token = idToken.replace("Bearer", "").trim();
	        FirebaseAuth.getInstance().verifyIdToken(token);

	        // 2. Busca o GERADOR pelo ID que veio no caminho da URL
	        Usuarios gerador = usuarioRepository.findById(id).orElseThrow(() ->
	            new ResponseStatusException(HttpStatus.NOT_FOUND, "Gerador não encontrado")
	        );

	        // 3. Pega os 50 XP do body (ou 50 por padrão se nulo) e soma ao valor existente
	        Integer xpGanha = body.getOrDefault("xp", 50);
	        Integer xpAtual = gerador.getXp_total() != null ? gerador.getXp_total() : 0;
	        
	        gerador.setXp_total(xpAtual + xpGanha);

	        // 4. Salva no banco de dados e retorna o gerador atualizado
	        return ResponseEntity.ok(usuarioRepository.save(gerador));

	    } catch (ResponseStatusException e) {
	        throw e;
	    } catch (com.google.firebase.auth.FirebaseAuthException e) {
	        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado", e);
	    } catch (Exception e) {
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar XP do gerador", e);
	    }
	}

}
