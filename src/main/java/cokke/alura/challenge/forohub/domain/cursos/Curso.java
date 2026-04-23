package cokke.alura.challenge.forohub.domain.cursos;

import jakarta.persistence.*; // Se quitó para causar error
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Table(name = "cursos")
@Entity(name = "Curso")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Tipo inconsistente con base de datos y métodos (era Long)

    // guarda el nombre
    private String nombre;
    private String categoria;

}