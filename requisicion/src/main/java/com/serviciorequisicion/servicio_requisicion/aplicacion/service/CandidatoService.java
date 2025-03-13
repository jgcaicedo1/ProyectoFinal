package com.serviciorequisicion.servicio_requisicion.aplicacion.service;

import com.serviciorequisicion.servicio_requisicion.aplicacion.dto.CandidatoDTO;
import com.serviciorequisicion.servicio_requisicion.dominio.model.Candidato;
import com.serviciorequisicion.servicio_requisicion.dominio.repository.CandidatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CandidatoService {
    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    public CandidatoService(CandidatoRepository candidatoRepository) {
        this.candidatoRepository = candidatoRepository;
    }

    public Candidato findById(Long id) {
        return candidatoRepository.findById(id).orElse(null);
    }

    public CandidatoDTO obtenerCandidatoPorId(Long id) {
        return candidatoRepository.findById(id)
            .map(this::convertirACandidatoDTO)
            .orElseThrow(() -> new RuntimeException("Candidato no encontrado con ID: " + id));
    }

    private CandidatoDTO convertirACandidatoDTO(Candidato candidato) {
        return new CandidatoDTO(
            candidato.getId(),
            candidato.getNombre(),
            candidato.getEmail(),
            candidato.getCurriculum_url(),
            candidato.getTelefono()
        );
    }
}