package com.serviciorequisicion.servicio_requisicion.dominio.model;

import jakarta.persistence.*;
import lombok.*;

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

    private String nombre;
    private String email;
    private String curriculum_url;
    private String telefono;
}