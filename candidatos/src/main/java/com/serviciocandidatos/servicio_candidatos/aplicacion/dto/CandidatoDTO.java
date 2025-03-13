package com.serviciocandidatos.servicio_candidatos.aplicacion.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CandidatoDTO {
    private Long id;
    private Long vacanteId;
    private String nombre;
    private String email;
    private String telefono;
    private String curriculumUrl;
    private String estado;
    private LocalDate fechaPostulacion;
}
