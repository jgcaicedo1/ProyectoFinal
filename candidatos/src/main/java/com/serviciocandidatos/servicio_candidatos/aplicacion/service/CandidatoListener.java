package com.serviciocandidatos.servicio_candidatos.aplicacion.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class CandidatoListener {

    @KafkaListener(topics = "publicacion-eventos", groupId = "microservicios-group")
    public void escucharEventos(String mensaje) {
        System.out.println("Evento recibido en servicio-candidatos: " + mensaje);
        // Lógica para abrir postulaciones
    }
}
