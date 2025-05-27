// Variables del juego
let cartasVolteadas = [];
let parejasEncontradas = 0;
let movimientos = 0;
let bloqueo = false;
let jugadorActual = localStorage.getItem("jugadorActual") || "Jugador";
let juegoCompletado = false;

// Colores disponibles para las estrellas (8 parejas)
const coloresEstrellas = [
  "roja",
  "azul",
  "verde",
  "amarilla",
  "purpura",
  "naranja",
  "rosa",
  "turquesa",
];

// Crear fondo estelar
function crearFondoEstelar() {
  const fondo = document.getElementById("fondoEstelar");
  const cantidadEstrellas = 100;

  for (let i = 0; i < cantidadEstrellas; i++) {
    const estrella = document.createElement("div");
    estrella.className = "estrella-fondo";

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

    fondo.appendChild(estrella);
  }
}

// Crear efecto de confeti
function crearConfetti(x, y, color) {
  for (let i = 0; i < 7; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.backgroundColor = color || getRandomColor();
    confetti.style.animationDelay = `${i * 0.1}s`;

    document.body.appendChild(confetti);

    // Eliminar después de la animación
    setTimeout(() => {
      confetti.remove();
    }, 1000);
  }
}

function getRandomColor() {
  const colors = [
    "#ff3e3e",
    "#2196f3",
    "#4caf50",
    "#ffeb3b",
    "#9c27b0",
    "#ff9800",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Inicializar el juego
function iniciarJuego() {
  const tablero = document.getElementById("tablero");
  tablero.innerHTML = "";

  // Crear un array con las parejas de cartas
  let cartas = [];
  coloresEstrellas.forEach((color) => {
    cartas.push({ color, encontrada: false });
    cartas.push({ color, encontrada: false });
  });

  // Barajar las cartas
  cartas = cartas.sort(() => Math.random() - 0.5);

  // Crear las cartas en el tablero
  cartas.forEach((carta, index) => {
    const elementoCarta = document.createElement("div");
    elementoCarta.className = "carta";
    elementoCarta.dataset.indice = index;
    elementoCarta.dataset.color = carta.color;

    elementoCarta.innerHTML = `
                    <div class="cara trasera">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="cara frente">
                        <i class="fas fa-star estrella-${carta.color}"></i>
                    </div>
                `;

    elementoCarta.addEventListener("click", voltearCarta);
    tablero.appendChild(elementoCarta);
  });

  // Reiniciar contadores
  parejasEncontradas = 0;
  movimientos = 0;
  cartasVolteadas = [];
  bloqueo = false;
  actualizarContadores();
}

// Voltear una carta
function voltearCarta() {
  if (
    bloqueo ||
    this.classList.contains("volteada") ||
    this.classList.contains("encontrada")
  ) {
    return;
  }

  // Voltear la carta
  this.classList.add("volteada");
  cartasVolteadas.push(this);

  // Sonido al voltear
  const sonidoVoltear = new Audio("./sonidos/accion.mp3");
  sonidoVoltear.play();

  // Verificar si hay dos cartas volteadas
  if (cartasVolteadas.length === 2) {
    movimientos++;
    actualizarContadores();
    verificarPareja();
  }
}

// Verificar si las cartas volteadas son pareja
function verificarPareja() {
  bloqueo = true;

  const [carta1, carta2] = cartasVolteadas;
  const esPareja = carta1.dataset.color === carta2.dataset.color;

  if (esPareja) {
    // Sonido de acierto
    const sonidoAcierto = new Audio("./sonidos/acierto.mp3");
    sonidoAcierto.play();

    // Pareja encontrada
    carta1.classList.add("encontrada");
    carta2.classList.add("encontrada");
    parejasEncontradas++;

    // Confetti
    const rect1 = carta1.getBoundingClientRect();
    const rect2 = carta2.getBoundingClientRect();
    crearConfetti(
      rect1.left + rect1.width / 2.3,
      rect1.top + rect1.height / 1.8,
      getComputedStyle(carta1.querySelector(".frente i")).color
    );
    crearConfetti(
      rect2.left + rect2.width / 2.3,
      rect2.top + rect2.height / 1.8,
      getComputedStyle(carta2.querySelector(".frente i")).color
    );

    // Verificar si el juego ha terminado
    if (parejasEncontradas === coloresEstrellas.length) {
      setTimeout(finalizarJuego, 500);
    }

    cartasVolteadas = [];
    bloqueo = false;
  } else {
    // Sonido de error
    const sonidoError = new Audio("./sonidos/error.mp3");
    sonidoError.play();

    // No es pareja, voltear de nuevo después de un tiempo
    setTimeout(() => {
      carta1.classList.remove("volteada");
      carta2.classList.remove("volteada");
      cartasVolteadas = [];
      bloqueo = false;
    }, 1000);
  }
}

// Actualizar los contadores de juego
function actualizarContadores() {
  document.getElementById("parejas-encontradas").textContent =
    parejasEncontradas;
  document.getElementById("movimientos").textContent = movimientos;
}

// Finalizar el juego
function finalizarJuego() {
  // Calcular puntos (menos movimientos = más puntos)
  const puntos = Math.max(150 - movimientos * 3, 10);

  // Guardar puntos para mostrar en el menú principal
  if (puntos > 0) {
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

  // Mostrar mensaje de felicitación
  const mensaje = `¡Felicidades ${jugadorActual}!\n\nEncontraste todas las parejas en ${movimientos} movimientos.\n\nGanaste ${puntos} puntos.`;

  // Crear modal de felicitación dinámico
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
  const modal = new bootstrap.Modal(
    document.getElementById("modalFelicitacion")
  );
  modal.show();

  // Eliminar el modal cuando se cierre
  document
    .getElementById("modalFelicitacion")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });
}

// Volver al menú principal
function volverAlMenu() {
  if (parejasEncontradas > 0 || movimientos > 0) {
    if (!confirm("¿Estás seguro de que quieres salir? Perderás tu progreso.")) {
      return;
    }
  }

  window.location.href = "./eleccionminijuego.html";
}

document
  .getElementById("btn-reiniciar")
  .addEventListener("click", iniciarJuego);
document.getElementById("btn-volver").addEventListener("click", volverAlMenu);

// Iniciar el juego al cargar
document.addEventListener("DOMContentLoaded", function () {
  crearFondoEstelar();
  iniciarJuego();
});
