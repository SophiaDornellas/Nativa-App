package com.Nativa.nativa_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.Nativa.nativa_app.entities.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, String> {
 // List<Usuarios> findAllByOrderByXp_totalDesc();
  
  @Query("SELECT u FROM Usuarios u ORDER BY u.xp_total DESC")
  List<Usuarios> findAllOrderByXpTotalDesc();
}
