package com.servicioentrevistas.servicio_entrevistas.aplicacion.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EntrevistaDTO {
    private Long id;
    private Long candidatoId;
    private String entrevistador;
    private LocalDateTime fechaHora;
    private String estado;
    private String observaciones;
}
