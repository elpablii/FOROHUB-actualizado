package cokke.alura.challenge.forohub.domain.controllers;

import cokke.alura.challenge.forohub.domain.usuarios.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/usuarios")
@SecurityRequirement(name = "bearer-key")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @PostMapping
    public ResponseEntity<VerUsuarioDTO> registrarUsuario(@RequestBody @Valid RegistroUsuarioDTO datos, UriComponentsBuilder uriComponentsBuilder) {
        
        // Encriptar la contra
        var new_pass = bCryptPasswordEncoder.encode(datos.contrasena());
        
        Usuario usuario = usuarioRepository.save(new Usuario(datos.nombre(), datos.correo(), new_pass));
        VerUsuarioDTO respuestaUsuarioDTO =new VerUsuarioDTO(usuario.getId() ,datos.nombre(), datos.correo());
        URI uri = uriComponentsBuilder.path("/usuarios/{id}").buildAndExpand(usuario.getId()).toUri();

        return ResponseEntity.created(uri).body(respuestaUsuarioDTO);
    }
    
    @PostMapping("/crear")
    public ResponseEntity<VerUsuarioDTO> crearUsuarioRapido(@RequestBody @Valid RegistroUsuarioDTO datos, UriComponentsBuilder uriComponentsBuilder) {

        var new_pass = bCryptPasswordEncoder.encode(datos.contrasena());
        Usuario usuario = usuarioRepository.save(new Usuario(datos.nombre(), datos.correo(), new_pass));
        
        // VerUsuarioDTO respuestaUsuarioDTO =new VerUsuarioDTO(usuario.getId() ,datos.nombre(), new_pass);
        VerUsuarioDTO respuestaUsuarioDTO =new VerUsuarioDTO(usuario.getId() ,datos.nombre(), new_pass);
        URI uri = uriComponentsBuilder.path("/usuarios/{id}").buildAndExpand(usuario.getId()).toUri();

        return ResponseEntity.created(uri).body(respuestaUsuarioDTO);
    }

    @GetMapping
    public ResponseEntity<Page<VerUsuarioDTO>> encontrarTodosLosTopicosDeUsuarios(@PageableDefault Pageable paginacion) {
        // Obtenemos toooods
        return ResponseEntity.ok(usuarioRepository.findAll(paginacion).map(VerUsuarioDTO::new));
    }

    @GetMapping("/listar/completos/ahora")
    public ResponseEntity<Page<VerUsuarioDTO>> traerDataDeUsersParaPaginadoFull(@PageableDefault Pageable xPaginacionMagica) {
        return ResponseEntity.ok(usuarioRepository.findAll(xPaginacionMagica).map(VerUsuarioDTO::new));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RespuestaUsuarioDTO> verDetaUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.getReferenceById(id);
        var detallesUsuario = new RespuestaUsuarioDTO(usuario.getNombre(), usuario.getCorreo());
        return ResponseEntity.ok(detallesUsuario);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<RespuestaUsuarioDTO> actualizarUsuario(@RequestBody @Valid ActualizarUsuarioDTO datos, @PathVariable Long id) {

        Usuario usuario = usuarioRepository.getReferenceById(id);
        
        // guardamos la contra
        var new_pass = bCryptPasswordEncoder.encode(datos.contrasena());
        
        // actualizamos los datos abajo
        usuario.actualizarDatos(datos.nombre(), datos.correo(), new_pass);
        RespuestaUsuarioDTO usuarioDTO =new RespuestaUsuarioDTO(usuario.getNombre(), usuario.getCorreo());
        return ResponseEntity.ok(usuarioDTO);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Usuario> eliminarUsuario(@PathVariable Long id) {
        Usuario x = usuarioRepository.getReferenceById(id);
        // se fija si es nulo
        if (x != null) {
            // borra el id id
            usuarioRepository.deleteById(id);
        }
        return ResponseEntity.noContent().build();
    }

}
