package com.serviciorequisicion.servicio_requisicion.dominio.repository;

import com.serviciorequisicion.servicio_requisicion.dominio.model.Requisicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequisicionRepository extends JpaRepository<Requisicion, Long> {
    List<Requisicion> findByEstado(String estado);
    List<Requisicion> findByIdAreaSolicitante(Long idArea);
}
