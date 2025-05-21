// Almacenamiento de jugadores y puntuaciones
let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
let jugadorActual = localStorage.getItem("nombre") || "";

// Función para iniciar un juego
function iniciarJuego(juego) {
  if (!jugadorActual) {
    alert("Por favor, ingresa tu nombre en la página principal primero.");
    return;
  }

  // Actualizar puntuación del jugador
  actualizarPuntuacion(jugadorActual, puntosGanados);

  // Cerrar el modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalMinijuegos")
  );
  modal.hide();

  // Actualizar la tabla de puntuaciones
  cargarPuntuaciones();
}

// Función para actualizar la puntuación de un jugador
function actualizarPuntuacion(nombre, puntos) {
  // Buscar si el jugador ya existe
  const jugadorIndex = jugadores.findIndex((j) => j.nombre === nombre);

  if (jugadorIndex !== -1) {
    // Actualizar puntuación existente
    jugadores[jugadorIndex].puntos += puntos;
  } else {
    // Agregar nuevo jugador
    jugadores.push({
      nombre: nombre,
      puntos: puntos,
      nivel: 1,
    });
  }

  // Ordenar jugadores por puntos (descendente)
  jugadores.sort((a, b) => b.puntos - a.puntos);

  // Actualizar niveles basados en la posición
  jugadores.forEach((jugador, index) => {
    jugador.nivel = index + 1;
  });

  // Guardar en localStorage
  localStorage.setItem("jugadores", JSON.stringify(jugadores));
}

// Función para cargar las puntuaciones en la tabla
function cargarPuntuaciones() {
  const tbody = document.getElementById("tablaPuntuacionesBody");
  tbody.innerHTML = "";

  // Ordenar jugadores por puntos (por si acaso)
  jugadores.sort((a, b) => b.puntos - a.puntos);

  // Llenar la tabla
  jugadores.forEach((jugador, index) => {
    const tr = document.createElement("tr");

    // Aplicar clases especiales a los primeros puestos
    let clasePuesto = "";
    if (index === 0) clasePuesto = "puesto-1";
    else if (index === 1) clasePuesto = "puesto-2";
    else if (index === 2) clasePuesto = "puesto-3";

    tr.innerHTML = `
                    <td class="${clasePuesto}">${index + 1}</td>
                    <td class="${clasePuesto}">${jugador.nombre}</td>
                    <td>${jugador.puntos}</td>
                    <td>${jugador.nivel}</td>
                `;

    tbody.appendChild(tr);
  });
}

document.getElementById("simondice").addEventListener("click", function(){window.location.href='minijuegosimon.html'});
document.getElementById("estrellas").addEventListener("click", function(){window.location.href='minijuegoestrellas.html'});

// Al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  // Verificar si hay un jugador actual
  if (!jugadorActual) {
    // Redirigir a la página principal si no hay nombre
    alert("Por favor, ingresa tu nombre en la página principal primero.");
    window.location.href = "index.html";
    return;
  }

  // Actualizar la tabla de puntuaciones
  cargarPuntuaciones();

  // Configurar el título con el nombre del jugador
  document.querySelector(".titulo-nave").textContent += ` - ${jugadorActual}`;
});
