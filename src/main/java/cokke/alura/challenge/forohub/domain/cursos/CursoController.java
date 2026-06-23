package cokke.alura.challenge.forohub.domain.cursos;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cursos")
@SecurityRequirement(name = "bearer-key")
public class CursoController {

    @Autowired
    private CursoRepository repository;

    @GetMapping
    public ResponseEntity<Page<VerCursoDTO>> listCursos(@PageableDefault(size = 10, sort = {"nombre"}) Pageable pageable) {
        return ResponseEntity.ok(repository.findAll(pageable).map(VerCursoDTO::new));
    }
}
