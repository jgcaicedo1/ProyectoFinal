package com.serviciopublicacion.servicio_publicacion.aplicacion.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PublicacionDTO {
    private Long id;
    private Long requisicionId;
    private String plataforma;
    private String fechaPublicacion;
    private String estado;
}
