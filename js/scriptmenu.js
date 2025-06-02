// Almacenamiento de jugadores y puntuaciones
let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
let nombreJugador = localStorage.getItem("nombreJugador") || "";

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
    });
  }

  // Ordenar jugadores por puntos (descendente)
  jugadores.sort((a, b) => b.puntos - a.puntos);

  // Guardar en localStorage
  localStorage.setItem("jugadores", JSON.stringify(jugadores));
  
  // Actualizar la tabla de puntuaciones
  cargarPuntuaciones();
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
    `;

    tbody.appendChild(tr);
  });
}

// Función para recibir puntos desde otros minijuegos
function recibirPuntosDesdeMinijuego(puntos) {
  if (nombreJugador && puntos) {
    actualizarPuntuacion(nombreJugador, puntos);
  }
}

// Event listeners para los minijuegos
document.getElementById("simondice").addEventListener("click", function() {
  window.location.href = 'minijuegosimon.html';
});
document.getElementById("estrellas").addEventListener("click", function() {
  window.location.href = 'minijuegoestrellas.html';
});
document.getElementById("sentimientos").addEventListener("click", function() {
  window.location.href = 'minijuegosentimientos.html';
});
document.getElementById("puzle").addEventListener("click", function() {
  window.location.href = 'minijuegopuzle.html';
});

// Al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  // Verificar si hay un jugador actual
  if (!nombreJugador) {
    // Redirigir a la página principal si no hay nombre
    alert("Por favor, ingresa tu nombre en la página principal primero.");
    window.location.href = "index.html";
    return;
  }
  
  // Verificar si hay puntos para agregar (provenientes de un minijuego)
  const urlParams = new URLSearchParams(window.location.search);
  const puntosGanados = urlParams.get('puntos');
  
  if (puntosGanados) {
    recibirPuntosDesdeMinijuego(parseInt(puntosGanados));
    // Limpiar el parámetro de la URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Actualizar la tabla de puntuaciones
  cargarPuntuaciones();

  // Configurar el título con el nombre del jugador
  document.querySelector(".titulo-nave").textContent += ` - ${nombreJugador}`;
});
