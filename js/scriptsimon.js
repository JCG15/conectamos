// Variables del juego
let secuencia = [];
let nivelActual = 1;
let puntos = 0;
let record = localStorage.getItem("simonRecord") || 0;
let jugadorActual = localStorage.getItem('jugadorActual') || 'Jugador';
let jugando = false;
let indiceSecuencia = 0;
let esperandoInput = false;

// DOM
const botonesSimon = document.querySelectorAll(".boton-simon");
const btnIniciar = document.getElementById("btn-iniciar");
const btnVolver = document.getElementById("btn-volver");
const nivelDisplay = document.getElementById("nivel");
const puntosDisplay = document.getElementById("puntos");
const recordDisplay = document.getElementById("record");
const mensajeDisplay = document.getElementById("mensaje");
const nivelProgreso = document.getElementById("nivel-progreso");

// Sonidos
const sonidos = {
  rojo: new Audio("./sonidos/accion.mp3"),
  verde: new Audio("./sonidos/accion.mp3"),
  amarillo: new Audio("./sonidos/accion.mp3"),
  azul: new Audio("./sonidos/accion.mp3"),
  error: new Audio("./sonidos/error.mp3"),
  exito: new Audio("./sonidos/acierto.mp3"),
};

// Inicializar el juego
function init() {
  // Configurar record
  recordDisplay.textContent = record;

  btnIniciar.addEventListener("click", iniciarJuego);
  btnVolver.addEventListener("click", volverAlMenu);

  botonesSimon.forEach((boton) => {
    boton.addEventListener("click", manejarClick);
  });

  // Crear efecto de estrellas
  crearEstrellas();
}

// Función para iniciar el juego
function iniciarJuego() {
  if (jugando) return;

  jugando = true;
  secuencia = [];
  nivelActual = 1;
  puntos = 0;
  indiceSecuencia = 0;

  nivelDisplay.textContent = nivelActual;
  puntosDisplay.textContent = puntos;
  mensajeDisplay.textContent = "Observa la secuencia...";

  btnIniciar.disabled = true;
  btnIniciar.innerHTML = '<i class="fas fa-sync-alt"></i> Reiniciar';

  // Generar primera secuencia
  agregarColorASecuencia();
  reproducirSecuencia();
}

// Agregar un nuevo color a la secuencia
function agregarColorASecuencia() {
  const colores = ["rojo", "verde", "amarillo", "azul"];
  const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
  secuencia.push(colorAleatorio);
}

// Reproducir la secuencia actual
function reproducirSecuencia() {
  esperandoInput = false;
  let i = 0;

  const intervalo = setInterval(() => {
    if (i >= secuencia.length) {
      clearInterval(intervalo);
      esperandoInput = true;
      mensajeDisplay.textContent = "¡Tu turno! Repite la secuencia";
      return;
    }

    const color = secuencia[i];
    resaltarBoton(color);
    i++;
  }, 800);
}

// Resaltar un botón
function resaltarBoton(color) {
  const boton = document.getElementById(`simon-${color}`);
  boton.classList.add("activo");
  sonidos[color].currentTime = 0;
  sonidos[color].play();

  setTimeout(() => {
    boton.classList.remove("activo");
  }, 500);
}

// Manejar clic en los botones
function manejarClick(e) {
  if (!jugando || !esperandoInput) return;

  const color = e.target.id.split("-")[1];
  resaltarBoton(color);

  // Verificar si es el color correcto
  if (color === secuencia[indiceSecuencia]) {
    indiceSecuencia++;

    // Secuencia completada correctamente
    if (indiceSecuencia === secuencia.length) {
      puntos += nivelActual * 10;
      puntosDisplay.textContent = puntos;

      // Actualizar progreso de nivel
      const progreso = (indiceSecuencia / (nivelActual + 3)) * 100;
      nivelProgreso.style.width = `${progreso}%`;

      // Subir de nivel cada 3 secuencias correctas
      if (secuencia.length % 3 === 0) {
        nivelActual++;
        nivelDisplay.textContent = nivelActual;
        nivelProgreso.style.width = "0%";
        sonidos.exito.play();
        mensajeDisplay.textContent = `¡Nivel ${nivelActual}! Observa la nueva secuencia...`;
      } else {
        mensajeDisplay.textContent = "¡Correcto! Siguiente secuencia...";
      }

      setTimeout(() => {
        indiceSecuencia = 0;
        agregarColorASecuencia();
        reproducirSecuencia();
      }, 1500);
    }
  } else {
    // Error - fin del juego
    sonidos.error.play();
    mensajeDisplay.textContent = "¡Oh no! Secuencia incorrecta";
    terminarJuego();
  }
}

// Terminar el juego
function terminarJuego() {
  jugando = false;
  esperandoInput = false;

  if (puntos > record) {
    record = puntos;
    localStorage.setItem("simonRecord", record);
    recordDisplay.textContent = record;
  }

  // Guardar puntos temporalmente
  localStorage.setItem("puntosTemporales", puntos);
  localStorage.setItem("juegoOrigen", "simon");

  btnIniciar.disabled = false;
  nivelProgreso.style.width = "0%";

  // Mostrar mensaje de felicitación
  const mensaje = `¡Felicidades ${jugadorActual}!\n\nGanaste ${puntos} puntos.`;

  // Crear modal de felicitación
  const modalHTML = `
                <div class="modal fade" id="modalFelicitacion" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content" style="background-color: var(--color-primario); color: white; border: 2px solid var(--color-secundario);">
                            <div class="modal-header" style="border-bottom: 1px solid var(--color-secundario);">
                                <h5 class="modal-title" style="color: var(--color-secundario);">¡Juego completado!</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center">
                                <i class="fas fa-trophy fa-4x mb-3" style="color: var(--color-secundario);"></i>
                                <p>${mensaje}</p>
                            </div>
                            <div class="modal-footer" style="border-top: 1px solid var(--color-secundario);">
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modal = new bootstrap.Modal(document.getElementById("modalFelicitacion"));
  modal.show();

  // Eliminar el modal cuando se cierre
  document
    .getElementById("modalFelicitacion")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });
}

// Guardar puntuación en el sistema principal
function guardarPuntuacion() {
  const puntosGanados =
    parseInt(localStorage.getItem("puntosTemporales")) || puntos;
  let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
  const jugadorIndex = jugadores.findIndex((j) => j.nombre === jugadorActual);

  if (jugadorIndex !== -1) {
    jugadores[jugadorIndex].puntos += puntosGanados;
  } else {
    jugadores.push({
      nombre: jugadorActual,
      puntos: puntosGanados,
      nivel: 1,
    });
  }

  localStorage.setItem("jugadores", JSON.stringify(jugadores));
  localStorage.removeItem("puntosTemporales"); // Limpiar después de usar
  localStorage.removeItem("juegoOrigen");
}

// Volver al menú principal
function volverAlMenu() {
  if (jugando) {
    if (!confirm("¿Estás seguro de que quieres salir? Perderás tu progreso.")) {
      // Guardar puntuación antes de salir
      if (puntos > 0) {
        guardarPuntuacion();
      }
      return;
    }
  }

  window.location.href = "./eleccionminijuego.html";
}

// Crear efecto de estrellas
function crearEstrellas() {
  const contenedor = document.querySelector(".contenedor-juego");
  const cantidad = 50;

  for (let i = 0; i < cantidad; i++) {
    const estrella = document.createElement("div");
    estrella.classList.add("estrella");

    // Tamaño aleatorio
    const size = Math.random() * 3 + 1;
    estrella.style.width = `${size}px`;
    estrella.style.height = `${size}px`;

    // Posición aleatoria
    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.top = `${Math.random() * 100}%`;

    // Opacidad y animación aleatoria
    estrella.style.opacity = Math.random();
    estrella.style.animationDelay = `${Math.random() * 2}s`;
    estrella.style.animationDuration = `${Math.random() * 3 + 1}s`;

    contenedor.appendChild(estrella);
  }
}

// Iniciar el juego al cargar
document.addEventListener("DOMContentLoaded", init);
