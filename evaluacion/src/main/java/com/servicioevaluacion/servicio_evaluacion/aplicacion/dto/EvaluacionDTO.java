package com.servicioevaluacion.servicio_evaluacion.aplicacion.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EvaluacionDTO {
    private Long id;
    private Long candidatoId;
    private String tipoEvaluacion;
    private double puntaje;
    private String estado;
    private LocalDate fechaEvaluacion;
}
