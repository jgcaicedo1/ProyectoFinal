package com.servicioseleccion.servicio_seleccion.aplicacion.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SeleccionDTO {
    private Long id;
    private Long candidatoId;
    private String evaluacionFinal;
    private String comentario;
    private LocalDate fechaSeleccion;
}
