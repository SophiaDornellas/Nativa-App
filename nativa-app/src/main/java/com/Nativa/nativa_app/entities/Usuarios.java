package com.Nativa.nativa_app.entities;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // 👈 ADICIONE ESTA LINHA
@Entity
@Table(name = "tb_usuarios")
public class Usuarios implements Serializable {
	private static final long serialVersionUID = 1L; // Para alterar a classe futuramente e rodar o programa sem dar erros
	
	@Id
	@Column(name = "id_usuario")
	private String id;
	
	@Column(name = "nome", nullable = false)
	private String nome;
	
	@Column(name = "email", nullable = false, unique = true)
	private String email;
	
	@Column(name = "telefone")
	private String telefone;
	
	@Column(name = "tipo_usuario", nullable = false)
	private String tipo_usuario;
	
	@Column(name = "endereco_regiao")
	private String endereco_regiao;
	
	@Column(name = "latitude")
	private Double latitude;
	
	@Column(name = "longitude")
	private Double longitude;
	
	@Column(name = "xp_total")
	private Integer xp_total = 0;
	
	public Usuarios() {
		
	}
	
	// Note que o id (UID) é passado no construtor porque ele vem do Firebase!
		public Usuarios(String id, String nome, String email, String telefone, String tipo_usuario, String endereco_regiao, Double latitude, Double longitude) {
			this.id = id;
			this.nome = nome;
			this.email = email;
			this.telefone = telefone;
			this.tipo_usuario = tipo_usuario;
			this.endereco_regiao = endereco_regiao;
			this.latitude = latitude;
			this.longitude = longitude;
			this.xp_total = 0; // O XP é sempre inicializado como 0 no cadastro
		}
	
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public String getTipo_usuario() {
		return tipo_usuario;
	}

	public void setTipo_usuario(String tipo_usuario) {
		this.tipo_usuario = tipo_usuario;
	}

	public String getEndereco_regiao() {
		return endereco_regiao;
	}

	public void setEndereco_regiao (String endereco) {
		this.endereco_regiao = endereco;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public Integer getXp_total() {
		return xp_total;
	}

	public void setXp_total(Integer xp_total) {
		this.xp_total = xp_total;
	}
	
	

}
