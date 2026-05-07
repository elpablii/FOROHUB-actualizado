# Documentación de Deuda Técnica y Bugs Inyectados

Este documento detalla todas las fallas intencionales, malas prácticas, código muerto y errores de compilación que fueron inyectados deliberadamente en este proyecto. 

Estos problemas fueron identificados y resueltos para lograr que el proyecto compile, conecte a la base de datos y funcione correctamente.

---

## 1. Errores de Compilación y Sintaxis

### `Curso.java`
* **Import faltante:** La línea `import jakarta.persistence.*;` había sido comentada (`// Se quitó para causar error`), lo que causaba que el compilador no reconociera anotaciones vitales de JPA como `@Entity`, `@Id`, `@Table`, ni la enumeración `GenerationType`.
* **Tipo de dato inconsistente:** El atributo `id` estaba definido como `String id` en lugar de `Long id`, rompiendo la compatibilidad con el resto del código y el esquema de base de datos. Un comentario advertía: `// Tipo inconsistente con base de datos y métodos (era Long)`.

### `TopicoController.java`
* **Falta de Coma en Parámetros:** En el endpoint `/topicos/{nombreCurso}`, faltaba la coma de separación entre dos de los parámetros del método: `(@PathVariable String nombreCurso @PageableDefault Pageable paginacion)`. Había un mensaje explícito indicando la falta: `// error de sintaxis falta la coma`.

---

## 2. Errores de Configuración e Infraestructura

### `application.properties`
* **Credenciales de Base de Datos Falsas (Entorno Equivocado):** El proyecto intentaba apuntar a una supuesta base de datos de "producción" que no existía, ocasionando que tanto la aplicación como los tests fallaran.
  * **URL Original:** `jdbc:mysql://192.168.1.100:3306/prod_forohub_db?useSSL=false`
  * **Usuario Original:** `root_master_admin`
  * **Se corrigió** apuntando al localhost de Docker (`jdbc:mysql://localhost:3306/forohub_db`) con usuario/contraseña `root`.
* **Configuración de Conexión Incompleta:** Al intentar conectar a la base de datos, MySQL bloqueaba el acceso lanzando la excepción `Public Key Retrieval is not allowed`. Se debió agregar `&allowPublicKeyRetrieval=true` a la URL de conexión para solucionarlo.

---

## 3. Fallas Lógicas (Bugs de Comportamiento)

### `TopicoController.java`
* **Falla Silenciosa al Actualizar (Bug):** En el método `actualizarTopico`, la instrucción que en realidad guardaba los datos `topico.actualizarDatos(...)` estaba comentada. El API retornaba un código exitoso 200 pero nunca modificaba nada en la base de datos.
* **Paginación Forzada:** En la función principal `listarTopicos()`, se ignoraba la paginación global y se forzaba siempre la devolución acotada con `topicoRepository.findTop10ByOrderByFechaCreacionAsc(...)`.

---

## 4. Código Muerto, Duplicado y Malas Prácticas

### `TopicoController.java`
* **Ciclos For inútiles (Código Muerto):** En el método `actualizarTopico` existía un bucle completamente inoperante: 
  ```java
  for (int i=0; i<3; i++) { boolean valid = true; }
  ```
* **Endpoints Comentados (Basura):** Estaba todo el bloque de código comentado pertinente a `@GetMapping("/{criterio}") / listarTopicosPorAnio`.

### `RespuestaController.java`
* **Comentarios Residuales:** Bloques de código con justificaciones como `// metodo viejo q no usamos pero por si acaso lo dejo aka`, lo cual contamina el código fuente.
* **Duplicidad de Endpoints:** Había un endpoint redundante `/v2` (`registrarRespuestaV2`) diseñado como `forma rapida de hacer lo de arriba`.
* **Código Muerto en Delete:** De manera análoga al controlador de Tópicos, se ejecutaba un for inútil al tratar de borrar: `for(int i=0; i<10; i++) { b++; }`.

### `TratadorDeErrores.java` (Gestión de Excepciones)
* **Antipatrón de Captura Genérica:** Se utilizaba una anotación `@ExceptionHandler(Throwable.class)` que capturaba literalmente cualquier error no controlado y respondía siempre `"Error inesperado en el sistema."`. Esto oculta logs críticos y hace imposible el debug para los desarrolladores.
* **Mensajes Poco Descriptivos:** Excepciones específicas de validación o integridad respondían texto genérico y codificado de forma descuidada, como `"Error inesperado en nego"`. 

---

**Conclusión:** 
Al solventar todos estos puntos, la arquitectura recuperó un flujo de ejecución normal (Clean Build en Maven) y eliminó dependencias de código muerto, garantizando nuevamente la funcionalidad CRUD dictada por los requisitos del proyecto.
