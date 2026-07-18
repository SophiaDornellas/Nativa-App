package com.Nativa.nativa_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

import com.Nativa.nativa_app.entities.Pedidos;
import com.Nativa.nativa_app.entities.Usuarios;

import java.time.LocalDate;
import java.util.List;

public interface PedidosRepository extends JpaRepository<Pedidos, Long>{
  // List<Pedidos> findById_geradorOrderById_pedidoDesc(Usuarios gerador); //O nome do atributo ( ) no método tem que ser o mesmo nome do atributo da sua entidade (id_gerador) 
  //List<Pedidos> findById_coletorOrderById_pedidoDesc(Usuarios coletor);
  // void deleteById_pedidoAndId_gerador(Long id_pedido, Usuarios id_gerador);
   
// 1. Busca os pedidos do GERADOR ordenados pelo ID do pedido decrescente
   @Query("SELECT p FROM Pedidos p WHERE p.id_gerador = :gerador ORDER BY p.id_pedido DESC")
   List<Pedidos> findByIdGeradorOrderByIdPedidoDesc(@Param("gerador") Usuarios gerador);

   // 2. Busca os pedidos do COLETOR ordenados pelo ID do pedido decrescente
   @Query("SELECT p FROM Pedidos p WHERE p.id_coletor = :coletor ORDER BY p.id_pedido DESC")
   List<Pedidos> findByIdColetorOrderByIdPedidoDesc(@Param("coletor") Usuarios coletor);
   
   @Modifying // Garante a permissão de escrita/remoção no banco
   @Query("DELETE FROM Pedidos p WHERE p.id_pedido = :idPedido AND p.id_gerador = :gerador")
   int deleteByIdPedidoAndIdGerador(@Param("idPedido") Long idPedido, @Param("gerador") Usuarios gerador);
   
   @Query("SELECT p FROM Pedidos p WHERE " +
           "(:tipo_residuo IS NULL OR p.tipo_residuo = :tipo_residuo) AND " +
           "(:volume IS NULL OR p.volume = :volume) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:data_coleta IS NULL OR p.data_coleta = :data_coleta) AND " +
           "(:regiao IS NULL OR LOWER(p.id_gerador.endereco_regiao) LIKE LOWER(CONCAT('%', :regiao, '%'))) " +
           "ORDER BY p.id_pedido DESC")
    List<Pedidos> buscarComFiltros(
        @Param("tipo_residuo") String tipo_residuo,
        @Param("volume") String volume,
        @Param("status") String status,
        @Param("data_coleta") LocalDate data_coleta,
        @Param("regiao") String regiao
    );
}
