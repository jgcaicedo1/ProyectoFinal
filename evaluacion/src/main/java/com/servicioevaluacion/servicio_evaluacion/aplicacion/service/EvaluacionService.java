package com.servicioevaluacion.servicio_evaluacion.aplicacion.service;

import com.servicioevaluacion.servicio_evaluacion.aplicacion.dto.EvaluacionDTO;
import com.servicioevaluacion.servicio_evaluacion.dominio.model.Evaluacion;
import com.servicioevaluacion.servicio_evaluacion.dominio.repository.EvaluacionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EvaluacionService {

    private static final Logger logger = LoggerFactory.getLogger(EvaluacionService.class);

    private final EvaluacionRepository evaluacionRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public EvaluacionService(EvaluacionRepository evaluacionRepository,
                             KafkaTemplate<String, String> kafkaTemplate) {
        this.evaluacionRepository = evaluacionRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public void enviarEvaluacion(Long candidatoId) {
        Objects.requireNonNull(candidatoId, "El ID del candidato no puede ser nulo");
        String mensaje = "Evaluación completada para candidato ID: " + candidatoId;
        try {
            kafkaTemplate.send("evaluacion-eventos", mensaje);
            logger.info("Evento enviado a Kafka: {}", mensaje);
        } catch (Exception e) {
            logger.error("Error al enviar evento a Kafka: {}", mensaje, e);
            throw new RuntimeException("Fallo al enviar mensaje a Kafka", e);
        }
    }

    public List<EvaluacionDTO> obtenerEvaluaciones() {
        return evaluacionRepository.findAll().stream()
                .map(ev -> new EvaluacionDTO(
                        ev.getId(), ev.getCandidatoId(), ev.getTipoEvaluacion(),
                        ev.getPuntaje(), ev.getEstado(), ev.getFechaEvaluacion()))
                .collect(Collectors.toList());
    }

    public EvaluacionDTO registrarEvaluacion(EvaluacionDTO dto) {
        Objects.requireNonNull(dto, "El DTO de evaluación no puede ser nulo");
        Evaluacion evaluacion = new Evaluacion(null, dto.getCandidatoId(), dto.getTipoEvaluacion(),
                dto.getPuntaje(), "PENDIENTE", LocalDate.now());
        Evaluacion nuevaEvaluacion = evaluacionRepository.save(evaluacion);
        logger.info("Evaluación registrada para candidato ID: {}", nuevaEvaluacion.getCandidatoId());
        return new EvaluacionDTO(nuevaEvaluacion.getId(), nuevaEvaluacion.getCandidatoId(),
                nuevaEvaluacion.getTipoEvaluacion(), nuevaEvaluacion.getPuntaje(),
                nuevaEvaluacion.getEstado(), nuevaEvaluacion.getFechaEvaluacion());
    }
}