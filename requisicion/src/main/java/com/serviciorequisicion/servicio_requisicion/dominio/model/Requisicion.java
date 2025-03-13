package com.serviciorequisicion.servicio_requisicion.dominio.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "requisiciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Requisicion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cargo;
    private String funciones;
    private String categoriaSalarial;
    private String perfil;
    private String estado;

    private LocalDate fechaInicio;         // Reemplaza fechaSolicitud
    private LocalDate fechaFin;            // Nueva fecha de fin

    @OneToOne
    @JoinColumn(name = "id_usuario_seleccionado")
    private Candidato candidatoSeleccionado;   // Nullable

    @Column(nullable = false)
    private Long idAreaSolicitante;        // No nullable, obligatorio

    private String comentarios;
}