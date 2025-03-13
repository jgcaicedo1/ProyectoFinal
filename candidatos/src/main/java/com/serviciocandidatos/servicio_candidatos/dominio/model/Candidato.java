package com.serviciocandidatos.servicio_candidatos.dominio.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "candidato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Candidato {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long vacanteId;
    private String nombre;
    private String email;
    private String telefono;
    private String curriculumUrl;
    private String estado; // "POSTULADO", "EN_EVALUACION", "RECHAZADO", "SELECCIONADO"
    
    private LocalDate fechaPostulacion;
}
