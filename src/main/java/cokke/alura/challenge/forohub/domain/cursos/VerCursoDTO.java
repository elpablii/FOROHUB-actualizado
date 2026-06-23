package cokke.alura.challenge.forohub.domain.cursos;

public record VerCursoDTO(Long id, String nombre, String categoria) {
    public VerCursoDTO(Curso curso) {
        this(curso.getId(), curso.getNombre(), curso.getCategoria());
    }
}
