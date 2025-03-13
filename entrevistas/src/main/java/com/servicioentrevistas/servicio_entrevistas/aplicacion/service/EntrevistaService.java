package com.servicioentrevistas.servicio_entrevistas.aplicacion.service;

import com.servicioentrevistas.servicio_entrevistas.aplicacion.dto.EntrevistaDTO;
import com.servicioentrevistas.servicio_entrevistas.dominio.model.Entrevista;
import com.servicioentrevistas.servicio_entrevistas.dominio.repository.EntrevistaRepository;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntrevistaService {

    private final EntrevistaRepository entrevistaRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    // ✅ Fusionamos los dos constructores en uno solo
    public EntrevistaService(EntrevistaRepository entrevistaRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.entrevistaRepository = entrevistaRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public void notificarEntrevista(Long candidatoId) {
        String mensaje = "Entrevista finalizada para candidato ID: " + candidatoId;
        kafkaTemplate.send("entrevista-eventos", mensaje);
        System.out.println("Evento enviado: " + mensaje);
    }

    public List<EntrevistaDTO> obtenerEntrevistas() {
        return entrevistaRepository.findAll().stream()
                .map(ent -> new EntrevistaDTO(
                        ent.getId(), ent.getCandidatoId(), ent.getEntrevistador(),
                        ent.getFechaHora(), ent.getEstado(), ent.getObservaciones()))
                .collect(Collectors.toList());
    }

    public EntrevistaDTO programarEntrevista(EntrevistaDTO dto) {
        Entrevista entrevista = new Entrevista(null, dto.getCandidatoId(), dto.getEntrevistador(),
                dto.getFechaHora(), "PENDIENTE", dto.getObservaciones());
        Entrevista nuevaEntrevista = entrevistaRepository.save(entrevista);
        return new EntrevistaDTO(nuevaEntrevista.getId(), nuevaEntrevista.getCandidatoId(),
                nuevaEntrevista.getEntrevistador(), nuevaEntrevista.getFechaHora(),
                nuevaEntrevista.getEstado(), nuevaEntrevista.getObservaciones());
    }
}
