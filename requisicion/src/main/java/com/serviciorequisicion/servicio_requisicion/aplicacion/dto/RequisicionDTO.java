package com.serviciorequisicion.servicio_requisicion.aplicacion.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RequisicionDTO {
    private Long id;
    private String cargo;              // Mantenemos como "cargo" (no "nombreCargo")
    private String funciones;
    private String categoriaSalarial;  // Mantenemos como "categoriaSalarial"
    private String perfil;
    private String estado;
    private LocalDate fechaInicio;     // Reemplaza fechaSolicitud
    private LocalDate fechaFin;        // Nueva fecha de fin
    private CandidatoDTO candidatoSeleccionado; // ID del usuario seleccionado (nullable)
    private Long idAreaSolicitante;
    private String comentarios;
}