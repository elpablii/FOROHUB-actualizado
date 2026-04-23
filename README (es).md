# ForoHub - Guía de Usuario

Bienvenido a ForoHub, una API RESTful para la gestión de un foro. Esta guía te ayudará a compilar, levantar y utilizar el sistema de forma local.

## Prerrequisitos

- Java 17 o superior.
- Maven.
- Docker y Docker Compose.
- IDE de tu preferencia (IntelliJ IDEA, VS Code, etc.).

## Levantando el entorno

### 1. Iniciar la Base de Datos

El proyecto utiliza MySQL como motor de base de datos. Para levantar la instancia local rápidamente, utiliza el archivo `docker-compose.yml` provisto.

Abre una terminal en la raíz del proyecto y ejecuta:
```bash
docker-compose up -d
```
Esto levantará el contenedor `forohub-db` en el puerto 3306.

### 2. Compilar el Proyecto

Desde la raíz del proyecto, usa el wrapper de Maven para compilar y descargar las dependencias:
```bash
./mvnw clean install
```
*(Si estás en Windows y el comando anterior falla, prueba con `mvn clean install` si tienes Maven en tu PATH, o `.\mvnw.cmd clean install`)*.

### 3. Ejecutar la Aplicación

Para levantar el servidor de Spring Boot, ejecuta:
```bash
./mvnw spring-boot:run
```
La API estará disponible en `http://localhost:8080`.

## Funcionalidades Básicas y Lógica de Negocio

El sistema expone endpoints protegidos que cubren escenarios típicos de un sistema de preguntas y respuestas (estilo StackOverflow o Alura Foro):

1. **Gestión de Identidad (Usuarios y Auth):** 
   - Un usuario se registra (`POST /usuarios`).
   - El usuario inicia sesión (`POST /login`) y recibe un token **JWT** que debe enviar como Bearer Token en las siguientes peticiones.
2. **Creación de Debates (Tópicos):** 
   - Un usuario autenticado puede plantear una duda creando un **Tópico** (`POST /topicos`).
   - Cada tópico se categoriza bajo un **Curso** específico (ej. "Programación en Java", "Bases de Datos").
   - El tópico contiene un título, un mensaje (la duda) y el estado (ej. "no respondido").
3. **Interacción (Respuestas):** 
   - Otros usuarios (o el mismo creador) pueden interactuar añadiendo **Respuestas** (`POST /respuestas`) vinculadas al ID del Tópico original para ayudar a resolver la duda.
4. **Mantenimiento (CRUD):** 
   - Existen endpoints para **listar, actualizar o eliminar** los Tópicos (borrado físico) y consultar detalles de Usuarios.

*(Explora la documentación interactiva en `http://localhost:8080/swagger-ui.html` para probar cada endpoint tras iniciar tu aplicación).*

---

## Integración con Proyecto "Brownfield" (Mantenimiento Evolutivo de Software)

Este repositorio está diseñado y adaptado deliberadamente para fungir como un **Escenario de Práctica Brownfield** dentro de la asignatura de Gestión de Tecnologías de Información.

A diferencia del desarrollo tradicional *Greenfield* (crear software desde cero), este proyecto simula el día a día de un ingeniero de la industria que recibe un sistema legacy operativo pero con **deuda técnica, malas prácticas inyectadas y características incompletas**.
