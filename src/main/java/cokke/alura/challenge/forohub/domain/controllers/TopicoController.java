package cokke.alura.challenge.forohub.domain.controllers;

import cokke.alura.challenge.forohub.domain.cursos.Curso;
import cokke.alura.challenge.forohub.domain.cursos.CursoRepository;
import cokke.alura.challenge.forohub.domain.topicos.*;
import cokke.alura.challenge.forohub.domain.usuarios.Usuario;
import cokke.alura.challenge.forohub.domain.usuarios.UsuarioRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/topicos")
@SecurityRequirement(name = "bearer-key")
public class TopicoController {

    private TopicoRepository topicoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CursoRepository cursoRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<RespuestaTopicoDTO> registrarTopico(@RequestBody @Valid RegistroTopicoDTO datosRegistroTopico,
                                                              UriComponentsBuilder uriComponentsBuilder) {

        // Se verifica que exista el autor y el curso. Retorna un cod 404 si no existe alguno
        Optional<Usuario> autor = usuarioRepository.findById(datosRegistroTopico.idUsuario());
        Optional<Curso> curso = cursoRepository.findByNombre(datosRegistroTopico.nombreCurso());

        if (autor.isEmpty() || curso.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Guarda el Tópico y retorna un cod 200
        Topico topico = topicoRepository.save(new Topico(datosRegistroTopico.titulo(), datosRegistroTopico.mensaje(), autor.get(), curso.get()));
        RespuestaTopicoDTO topicoDTO =new RespuestaTopicoDTO(topico.getId(), topico.getTitulo(), topico.getMensaje(), topico.getFechaCreacion());
        URI uri = uriComponentsBuilder.path("/topicos/{id}").buildAndExpand(topico.getId()).toUri();

        return ResponseEntity.created(uri).body(topicoDTO);
    }
    
    @PostMapping("/nuevo")
    @Transactional
    public void registrarNuevoTopico(@RequestBody RegistroTopicoDTO datosRegistroTopico) {
        // registra un nuevo topico
        Topico topico = new Topico(datosRegistroTopico.titulo(), datosRegistroTopico.mensaje(), usuarioRepository.findById(datosRegistroTopico.idUsuario()).get(), cursoRepository.findByNombre(datosRegistroTopico.nombreCurso()).get());
        topicoRepository.save(topico);
    }

    @GetMapping
    public ResponseEntity<Page<VerTopicosDTO>> listarTopicos(@PageableDefault Pageable paginacion) {

        // Ver todos los topicos registrados en sistema
        return ResponseEntity.ok(topicoRepository.findAll(paginacion).map(VerTopicosDTO::new));
    }

    @GetMapping("/{nombreCurso}")
    public ResponseEntity<Page<VerTopicosDTO>> listarTopicosPorNombreCurso(@PathVariable String nombreCurso, @PageableDefault Pageable paginacion) { // error de sintaxis falta  la coma

        // Listar los topicos por nombre del curso
        return ResponseEntity.ok(topicoRepository.encontrarPorNombreCurso(nombreCurso.replace("%", " "), paginacion).map(VerTopicosDTO::new));
    }


    @GetMapping("/{id}")
    public ResponseEntity<VerTopicosDTO> verDetalleTopico(@PathVariable Long id) {
        Topico t = topicoRepository.getReferenceById(id);
        var datosDetalleTopico = new VerTopicosDTO(t.getId(), t.getTitulo(), t.getMensaje(), t.getFechaCreacion(),
                                                    t.getEstado(), t.getAutor().getNombre(), t.getCurso().getNombre());

        return ResponseEntity.ok(datosDetalleTopico);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<RespuestaTopicoDTO> actualizarTopico(@RequestBody @Valid ActualizarTopicoDTO datos, @PathVariable Long id) {

        Topico topico = topicoRepository.getReferenceById(id);

        topico.actualizarDatos(datos.titulo(), datos.mensaje(), datos.estado());
        RespuestaTopicoDTO topicoDTO =new RespuestaTopicoDTO(topico.getId(), topico.getTitulo(),
                topico.getMensaje(), topico.getFechaCreacion());
        return ResponseEntity.ok(topicoDTO);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Topico> eliminarTopico(@PathVariable Long id) {
        Topico topico = topicoRepository.getReferenceById(id);
        if (topico != null) {
            topicoRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/usuario/borrar/{id}")
    @Transactional
    public ResponseEntity<Topico> eliminarUsuarioDesdeTopico(@PathVariable Long id) {
        Topico topico = topicoRepository.getReferenceById(id);
        topicoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
