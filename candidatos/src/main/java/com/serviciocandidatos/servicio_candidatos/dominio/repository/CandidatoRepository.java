package com.serviciocandidatos.servicio_candidatos.dominio.repository;

import com.serviciocandidatos.servicio_candidatos.dominio.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatoRepository extends JpaRepository<Candidato, Long> {
    List<Candidato> findByVacanteId(Long vacanteId);
    List<Candidato> findByEstado(String estado);
}
