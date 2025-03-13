package com.servicioentrevistas.servicio_entrevistas.dominio.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "entrevista")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Entrevista {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long candidatoId;
    private String entrevistador;
    private LocalDateTime fechaHora;
    private String estado; // "PENDIENTE", "REALIZADA", "CANCELADA"
    private String observaciones;
}
