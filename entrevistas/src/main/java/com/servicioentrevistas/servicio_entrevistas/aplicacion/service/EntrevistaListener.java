package com.servicioentrevistas.servicio_entrevistas.aplicacion.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class EntrevistaListener {

    @KafkaListener(topics = "evaluacion-eventos", groupId = "microservicios-group")
    public void recibirEvaluacion(String mensaje) {
        System.out.println("Evento recibido en servicio-entrevistas: " + mensaje);
    }
}
