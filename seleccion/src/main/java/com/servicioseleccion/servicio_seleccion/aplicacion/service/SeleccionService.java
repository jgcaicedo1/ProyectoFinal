package com.servicioseleccion.servicio_seleccion.aplicacion.service;

import com.servicioseleccion.servicio_seleccion.aplicacion.dto.SeleccionDTO;
import com.servicioseleccion.servicio_seleccion.dominio.model.Seleccion;
import com.servicioseleccion.servicio_seleccion.dominio.repository.SeleccionRepository;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeleccionService {

    private final SeleccionRepository seleccionRepository;

    @KafkaListener(topics = "entrevista-eventos", groupId = "microservicios-group")
    public void recibirEntrevista(String mensaje) {
        System.out.println("Evento recibido en servicio-seleccion: " + mensaje);
    }

    public SeleccionService(SeleccionRepository seleccionRepository) {
        this.seleccionRepository = seleccionRepository;
    }

    public List<SeleccionDTO> obtenerSeleccionados() {
        return seleccionRepository.findAll().stream()
                .map(sel -> new SeleccionDTO(
                        sel.getId(), sel.getCandidatoId(), sel.getEvaluacionFinal(),
                        sel.getComentario(), sel.getFechaSeleccion()))
                .collect(Collectors.toList());
    }
    
    public SeleccionDTO registrarSeleccion(SeleccionDTO dto) {
        Seleccion seleccion = new Seleccion(null, dto.getCandidatoId(),
                dto.getEvaluacionFinal(), dto.getComentario(), LocalDate.now());
        Seleccion nuevaSeleccion = seleccionRepository.save(seleccion);
        return new SeleccionDTO(nuevaSeleccion.getId(), nuevaSeleccion.getCandidatoId(),
                nuevaSeleccion.getEvaluacionFinal(), nuevaSeleccion.getComentario(),
                nuevaSeleccion.getFechaSeleccion());
    }
}
