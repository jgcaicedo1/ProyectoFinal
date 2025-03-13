package com.servicioevaluacion.servicio_evaluacion.aplicacion.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class EvaluacionListener {

    @KafkaListener(topics = "postulacion-eventos", groupId = "microservicios-group")
    public void recibirPostulacion(String mensaje) {
        System.out.println("Evento recibido en servicio-evaluacion: " + mensaje);
    }
}
