package cokke.alura.challenge.forohub.domain.topicos;

import cokke.alura.challenge.forohub.domain.cursos.CursoRepository;
import cokke.alura.challenge.forohub.domain.usuarios.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TopicoControllerTest {

    @Mock
    private TopicoRepository topicoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private CursoRepository cursoRepository;

    @InjectMocks
    private TopicoController topicoController;

    @Test
    void listarTopicos_DebeRetornarPaginaDeTopicos() {
        // Arrange
        Page<Topico> paginaVacia = new PageImpl<>(Collections.emptyList());
        when(topicoRepository.findAll(any(PageRequest.class))).thenReturn(paginaVacia);

        // Act
        ResponseEntity<Page<VerTopicosDTO>> response = topicoController.listarTopicos(PageRequest.of(0, 10));

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
