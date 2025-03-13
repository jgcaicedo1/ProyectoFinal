package com.servicioevaluacion.servicio_evaluacion.dominio.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "evaluacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Evaluacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long candidatoId;
    private String tipoEvaluacion; // "PSICOTECNICA", "TECNICA"
    private double puntaje;
    private String estado; // "PENDIENTE", "APROBADO", "REPROBADO"
    
    private LocalDate fechaEvaluacion;
}
