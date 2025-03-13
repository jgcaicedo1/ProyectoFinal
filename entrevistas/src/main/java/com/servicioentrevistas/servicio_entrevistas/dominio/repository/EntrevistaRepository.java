package com.servicioentrevistas.servicio_entrevistas.dominio.repository;

import com.servicioentrevistas.servicio_entrevistas.dominio.model.Entrevista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntrevistaRepository extends JpaRepository<Entrevista, Long> {
    List<Entrevista> findByCandidatoId(Long candidatoId);
    List<Entrevista> findByEstado(String estado);
}
