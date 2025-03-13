package com.serviciorequisicion.servicio_requisicion.dominio.repository;

import com.serviciorequisicion.servicio_requisicion.dominio.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidatoRepository extends JpaRepository<Candidato, Long> {
}