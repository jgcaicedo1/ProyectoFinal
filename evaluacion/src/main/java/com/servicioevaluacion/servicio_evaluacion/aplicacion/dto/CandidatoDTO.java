package com.servicioevaluacion.servicio_evaluacion.aplicacion.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CandidatoDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String estado;
}
