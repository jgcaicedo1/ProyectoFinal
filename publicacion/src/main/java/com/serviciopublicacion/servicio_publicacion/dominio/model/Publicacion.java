package com.serviciopublicacion.servicio_publicacion.dominio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "publicacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Publicacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long requisicionId;
    private String plataforma; // "INTRANET", "PORTAL_EMPLEO"
    private String fechaPublicacion;
    private String estado; // "ACTIVA", "CERRADA"
}
