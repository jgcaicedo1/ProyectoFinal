package com.serviciocandidatos.servicio_candidatos.aplicacion.service;

import com.serviciocandidatos.servicio_candidatos.aplicacion.dto.CandidatoDTO;
import com.serviciocandidatos.servicio_candidatos.dominio.model.Candidato;
import com.serviciocandidatos.servicio_candidatos.dominio.repository.CandidatoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;

    public CandidatoService(CandidatoRepository candidatoRepository) {
        this.candidatoRepository = candidatoRepository;
    }

    public List<CandidatoDTO> obtenerCandidatos() {
        return candidatoRepository.findAll().stream()
                .map(cand -> new CandidatoDTO(
                        cand.getId(), cand.getVacanteId(), cand.getNombre(),
                        cand.getEmail(), cand.getTelefono(), cand.getCurriculumUrl(),
                        cand.getEstado(), cand.getFechaPostulacion()))
                .collect(Collectors.toList());
    }

    public CandidatoDTO registrarCandidato(CandidatoDTO dto) {
        Candidato candidato = new Candidato(null, dto.getVacanteId(), dto.getNombre(),
                dto.getEmail(), dto.getTelefono(), dto.getCurriculumUrl(),
                "POSTULADO", LocalDate.now());
        Candidato nuevoCandidato = candidatoRepository.save(candidato);
        return new CandidatoDTO(nuevoCandidato.getId(), nuevoCandidato.getVacanteId(),
                nuevoCandidato.getNombre(), nuevoCandidato.getEmail(),
                nuevoCandidato.getTelefono(), nuevoCandidato.getCurriculumUrl(),
                nuevoCandidato.getEstado(), nuevoCandidato.getFechaPostulacion());
    }

    public Candidato actualizarCandidato(Long id, String estado) {
        if (id == null) {
            throw new IllegalArgumentException("El ID del candidato no puede ser nulo");
        }
        Candidato candidatoExistente = candidatoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidato no encontrado con ID: " + id));
        candidatoExistente.setEstado(estado);
        Candidato candidatoActualizado = candidatoRepository.save(candidatoExistente);
        return candidatoActualizado;
    }
}
