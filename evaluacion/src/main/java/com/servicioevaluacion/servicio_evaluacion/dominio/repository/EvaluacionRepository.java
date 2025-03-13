package com.servicioevaluacion.servicio_evaluacion.dominio.repository;

import com.servicioevaluacion.servicio_evaluacion.dominio.model.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    List<Evaluacion> findByCandidatoId(Long candidatoId);
    List<Evaluacion> findByEstado(String estado);
}
