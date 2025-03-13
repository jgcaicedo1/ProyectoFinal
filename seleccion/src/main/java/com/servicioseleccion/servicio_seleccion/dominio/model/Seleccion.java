package com.servicioseleccion.servicio_seleccion.dominio.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "seleccion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Seleccion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long candidatoId;
    private String evaluacionFinal; // "ACEPTADO", "RECHAZADO"
    private String comentario;
    private LocalDate fechaSeleccion;
}
