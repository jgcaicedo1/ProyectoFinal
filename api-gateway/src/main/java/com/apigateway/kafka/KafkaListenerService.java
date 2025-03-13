package com.apigateway.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaListenerService {

    @KafkaListener(topics = "publicacion-eventos", groupId = "microservicios-group")
    public void recibirPublicacionEvento(String mensaje) {
        System.out.println("Evento recibido en API Gateway: " + mensaje);
    }
}
