package com.serviciorequisicion.servicio_requisicion.aplicacion.dto;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CandidatoDTO {
    private Long id;
    private String nombre; 
    private String email;
    private String curriculum_url;
    private String telefono;
}
