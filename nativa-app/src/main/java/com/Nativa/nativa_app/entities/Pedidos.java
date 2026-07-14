package com.Nativa.nativa_app.entities;

import jakarta.persistence.Entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;


@Entity
@Table(name = "tb_pedidos")

public class Pedidos implements Serializable{
	private static final long serialVersionUID = 1L; // Para alterar a classe futuramente e rodar o programa sem dar erros

	@Id //cria a coluna id como chave primária 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_pedido")
	private Long id_pedido;
	
	@ManyToOne 
	@JoinColumn( name = "id_gerador", nullable = false) // não é necessário o : referencedColumnName = "id_usuario"
	private Usuarios id_gerador;
	
	@ManyToOne
	@JoinColumn(name = "id_coletor") // não é necessário o: referencedColumnName = "id_usuario"
	private Usuarios id_coletor;
	
	//@JoinColumn()
	//private String titulo; // vai vir dentro do objeto USUARIO
	
	@Column(name = "tipo_residuo", nullable = false)
	private String tipo_residuo;
	
	
	@Column(name = "volume", nullable = false)
	private String volume;
	
	@Column(name = "status", nullable = false)
	private String status =  "PENDENTE";
	
	@Column(name = "data_coleta", nullable = false)
	private LocalDate data_coleta;
	
	@Column(name = "horario_coleta", length = 100, nullable = false)
	private String horario_coleta;
	
	@Column(name = "observacao", columnDefinition = "TEXT")
	private String observacao;
	
	@Column(name = "xp_pedido")
	private Integer xp_pedido;
	
	public Pedidos() {
		
	};
	
	public Pedidos(Usuarios id_gerador, String tipo_residuo, String volume, LocalDate data_coleta, String horario_coleta, String observacao, Integer xp_pedido) {
		this.id_gerador = id_gerador;
		this.tipo_residuo = tipo_residuo;
		this.volume = volume;
		this.data_coleta = data_coleta;
		this.horario_coleta = horario_coleta;
		this.observacao = observacao;
		this.xp_pedido = xp_pedido;
		// O status não precisa estar no construtor porque ele já foi inicializado como "PENDENTE" por padrão!
		// o Id também não precisa estar no construtor pois já é criado automaticamente
		// E também não precisa colocar o coletor no contrutor por que ele inicia null
	}

	public Long getId_pedido() {
		return id_pedido;
	}

	public void setId_pedido(Long id_pedido) {
		this.id_pedido = id_pedido;
	}

	public Usuarios getId_gerador() {
		return id_gerador;
	}

	public void setId_gerador(Usuarios id_gerador) {
		this.id_gerador = id_gerador;
	}

	public Usuarios getId_coletor() {
		return id_coletor;
	}

	public void setId_coletor(Usuarios id_coletor) {
		this.id_coletor = id_coletor;
	}

	public String getTipo_residuo() {
		return tipo_residuo;
	}

	public void setTipo_residuo(String tipo_residuo) {
		this.tipo_residuo = tipo_residuo;
	}

	public String getVolume() {
		return volume;
	}

	public void setVolume(String volume) {
		this.volume = volume;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDate getData_coleta() {
		return data_coleta;
	}

	public void setData_coleta(LocalDate data_coleta) {
		this.data_coleta = data_coleta;
	}

	public String getHorario_coleta() {
		return horario_coleta;
	}

	public void setHorario_coleta(String horario_coleta) {
		this.horario_coleta = horario_coleta;
	}

	public String getObservacao() {
		return observacao;
	}

	public void setObservacao(String observacao) {
		this.observacao = observacao;
	}

	public Integer getXp_pedido() {
		return xp_pedido;
	}

	public void setXp_pedido(Integer xp_pedido) {
		this.xp_pedido = xp_pedido;
	}
	
	
	
	
	
}
