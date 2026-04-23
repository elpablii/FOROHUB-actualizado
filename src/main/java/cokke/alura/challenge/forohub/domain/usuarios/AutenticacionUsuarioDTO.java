package cokke.alura.challenge.forohub.domain.usuarios;

import jakarta.validation.constraints.NotBlank;

public record AutenticacionUsuarioDTO(
        @NotBlank
        String correo,
        @NotBlank
        String contrasena
) {
}
