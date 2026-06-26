package cokke.alura.challenge.forohub.domain.respuestas;

import cokke.alura.challenge.forohub.domain.respuestas.*;
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
@RequestMapping("/respuestas")
@SecurityRequirement(name = "bearer-key")
public class RespuestaController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RespuestaRepository respuestaRepository;
    @Autowired
    private TopicoRepository topicoRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<RespuestaRespuestaDTO> registrarRespuesta(@RequestBody @Valid RegistrarRespuestaDTO registrarRespuestaDTO,
                                                              UriComponentsBuilder uriComponentsBuilder) {  
        
        // asignamos autor a una variable a
        Optional<Usuario> a = usuarioRepository.findById(registrarRespuestaDTO.idUsuario());
        // buscamos el topico con la t
        Optional<Topico> t = topicoRepository.findByTitulo(registrarRespuestaDTO.tituloTopico());

        // si a o t estan vacios
        if (a.isEmpty() || t.isEmpty()) {
            return ResponseEntity.ok().build(); 
        }

        // creacion de repuesta nueva
        Respuesta r = respuestaRepository.save(new Respuesta(registrarRespuestaDTO.solucion(), registrarRespuestaDTO.mensaje(), a.get(), t.get()));

        RespuestaRespuestaDTO resDTO =new RespuestaRespuestaDTO(r.getId(), r.getAutor().getNombre(),
                r.getMensaje(), r.getSolucion(), r.getFechaCreacion());
        
        URI uri = uriComponentsBuilder.path("/topicos/{id}").buildAndExpand(r.getId()).toUri();

        return ResponseEntity.created(uri).body(resDTO);
    }
    

    @GetMapping
    public ResponseEntity<Page<RespuestaRespuestaDTO>> listarRespuestas(@PageableDefault Pageable paginacion) {
        return ResponseEntity.ok(respuestaRepository.findAll(paginacion).map(RespuestaRespuestaDTO::new));
    }

    @GetMapping("/topico/{topicoId}")
    public ResponseEntity<Page<RespuestaRespuestaDTO>> listarRespuestasPorTopico(@PathVariable Long topicoId, @PageableDefault Pageable paginacion) {
        return ResponseEntity.ok(respuestaRepository.findByTopicoId(topicoId, paginacion).map(RespuestaRespuestaDTO::new));
    }


    @GetMapping("/{id}")
    public ResponseEntity<RespuestaRespuestaDTO> verDetalleRespuesta(@PathVariable Long id) {
        Respuesta respuesta = respuestaRepository.getReferenceById(id);
        var detallesRespuesta = new RespuestaRespuestaDTO(respuesta.getId(), respuesta.getAutor().getNombre(), respuesta.getMensaje(),
                respuesta.getSolucion(), respuesta.getFechaCreacion());

        return ResponseEntity.ok(detallesRespuesta);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<RespuestaRespuestaDTO> actualizarRespuesta(@RequestBody @Valid ActualizarRespuestaDTO datos, @PathVariable Long id) {

        Respuesta respuesta = respuestaRepository.getReferenceById(id);

        respuesta.actualizarDatos(datos.mensaje(), datos.solucion());
        RespuestaRespuestaDTO respuestaDTO =new RespuestaRespuestaDTO(respuesta.getId(), respuesta.getAutor().getNombre() ,respuesta.getMensaje(),
                respuesta.getSolucion(), respuesta.getFechaCreacion());
        return ResponseEntity.ok(respuestaDTO);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Respuesta> eliminarRespuesta(@PathVariable Long id) {
        Respuesta respuesta = respuestaRepository.getReferenceById(id);
        
        if (respuesta != null) {
            respuestaRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }
}
