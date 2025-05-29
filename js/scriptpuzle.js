// Variables del juego
let nivelActual = 1;
let piezasEncajadas = 0;
let puntosAcumulados = parseInt(localStorage.getItem("puntosPuzzleEspacial")) || 0;
let jugadorActual = localStorage.getItem("jugadorActual") || "Jugador";
let nivelesCompletados = JSON.parse(localStorage.getItem("nivelesCompletadosPuzzle")) || [];

// Imágenes para los puzzles
const imagenesPuzzle = [
  // Nivel 1 (2 piezas)
  [
    "./imagenes/fotospuzle/navepipo1.png",
    "./imagenes/fotospuzle/navepipo2.png",
  ],
  // Nivel 2 (4 piezas)
  [
    "./imagenes/fotospuzle/tierra1.jpg",
    "./imagenes/fotospuzle/tierra2.jpg",
    "./imagenes/fotospuzle/tierra3.jpg",
    "./imagenes/fotospuzle/tierra4.jpg",
  ],
  // Nivel 3 (6 piezas)
  [
    "./imagenes/fotospuzle/cohete1.jpg",
    "./imagenes/fotospuzle/cohete2.jpg",
    "./imagenes/fotospuzle/cohete3.jpg",
    "./imagenes/fotospuzle/cohete4.jpg",
    "./imagenes/fotospuzle/cohete5.jpg",
    "./imagenes/fotospuzle/cohete6.jpg",
  ],
  // Nivel 4 (9 piezas)
  [
    "./imagenes/fotospuzle/espacio1.jpg",
    "./imagenes/fotospuzle/espacio2.jpg",
    "./imagenes/fotospuzle/espacio3.jpg",
    "./imagenes/fotospuzle/espacio4.jpg",
    "./imagenes/fotospuzle/espacio5.jpg",
    "./imagenes/fotospuzle/espacio6.jpg",
    "./imagenes/fotospuzle/espacio7.jpg",
    "./imagenes/fotospuzle/espacio8.jpg",
    "./imagenes/fotospuzle/espacio9.jpg",
  ],
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
function crearConfetti(x, y, cantidad = 20) {
  for (let i = 0; i < cantidad; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${x + Math.random() * 20 - 10}px`;
    confetti.style.top = `${y}px`;
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.animationDelay = `${i * 0.1}s`;
    confetti.style.width = `${Math.random() * 8 + 4}px`;
    confetti.style.height = `${Math.random() * 8 + 4}px`;

    document.body.appendChild(confetti);

    // Eliminar después de la animación
    setTimeout(() => {
      confetti.remove();
    }, 2000);
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
    "#4cc9f0",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Inicializar el selector de niveles
function inicializarSelectorNiveles() {
  const selector = document.getElementById("selectorNivel");
  selector.innerHTML = "";

  for (let i = 1; i <= imagenesPuzzle.length; i++) {
    const btnNivel = document.createElement("button");
    btnNivel.className = "btn-nivel";
    if (i === nivelActual) btnNivel.classList.add("activo");
    if (nivelesCompletados.includes(i)) btnNivel.classList.add("completado");
    btnNivel.textContent = `Nivel ${i}`;
    btnNivel.dataset.nivel = i;

    btnNivel.addEventListener("click", () => {
      cambiarNivel(i);
    });

    selector.appendChild(btnNivel);
  }
}

// Cambiar de nivel
function cambiarNivel(nivel) {
  nivelActual = nivel;
  document.getElementById("nivel-actual").textContent = nivel;

  // Actualizar botones de nivel
  const botones = document.querySelectorAll(".btn-nivel");
  botones.forEach((btn) => {
    btn.classList.remove("activo");
    if (parseInt(btn.dataset.nivel) === nivel) {
      btn.classList.add("activo");
    }
  });

  iniciarJuego();
}

// Iniciar el juego
function iniciarJuego() {
  const contenedorPiezas = document.getElementById("contenedorPiezas");
  const tableroPuzzle = document.getElementById("tableroPuzzle");

  // Limpiar contenedores
  contenedorPiezas.innerHTML = "";
  tableroPuzzle.innerHTML = "";

  // Reiniciar contador de piezas encajadas
  piezasEncajadas = 0;

  // Configurar el tablero según el nivel
  const piezasNivel = imagenesPuzzle[nivelActual - 1];
  const columnas = nivelActual <= 2 ? 2 : 3;

  tableroPuzzle.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;

  // Crear un array de índices barajados
  const indicesBarajados = Array.from({length: piezasNivel.length}, (_, i) => i)
    .sort(() => Math.random() - 0.5);

  // Primero creamos todos los huecos en el tablero
  for (let i = 0; i < piezasNivel.length; i++) {
    const hueco = document.createElement("div");
    hueco.className = "hueco";
    hueco.dataset.indiceCorrecto = i; 
    
    hueco.addEventListener("dragover", permitirSoltar);
    hueco.addEventListener("dragenter", resaltarHueco);
    hueco.addEventListener("dragleave", quitarResaltadoHueco);
    hueco.addEventListener("drop", soltarPieza);

    tableroPuzzle.appendChild(hueco);
  }

  // Piezas en orden barajado
  indicesBarajados.forEach((posicionBarajada, index) => {
    const indiceReal = posicionBarajada;
    const imagen = piezasNivel[indiceReal];
    
    const pieza = document.createElement("div");
    pieza.className = "pieza";
    pieza.dataset.indiceCorrecto = indiceReal; 
    pieza.dataset.indiceActual = index;
    pieza.style.backgroundImage = `url(${imagen})`;
    pieza.draggable = true;

    pieza.addEventListener("dragstart", arrastrarPieza);

    contenedorPiezas.appendChild(pieza);
  });
}


// Funciones para el drag and drop
function arrastrarPieza(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.indiceActual);
  setTimeout(() => {
    e.target.style.opacity = "0.4";
  }, 0);
}

function permitirSoltar(e) {
  e.preventDefault();
}

function resaltarHueco(e) {
  e.preventDefault();
  if (!e.target.classList.contains("ocupado")) {
    e.target.classList.add("hover");
  }
}

function quitarResaltadoHueco(e) {
  e.target.classList.remove("hover");
}

function soltarPieza(e) {
  e.preventDefault();
  e.target.classList.remove("hover");

  const indicePieza = e.dataTransfer.getData("text/plain");
  const pieza = document.querySelector(`.pieza[data-indice-actual="${indicePieza}"]`);

  if (pieza && !pieza.classList.contains("encajada")) {
    // Verificar si el hueco es el correcto para esta pieza
    const esCorrecto = parseInt(e.target.dataset.indiceCorrecto) === parseInt(pieza.dataset.indiceCorrecto);

    if (esCorrecto) {
      // Encajar la pieza
      e.target.classList.add("ocupado");
      e.target.style.backgroundImage = pieza.style.backgroundImage;
      e.target.style.backgroundSize = "cover";

      pieza.classList.add("encajada");
      piezasEncajadas++;

      // Sonido de acierto
      const sonidoAcierto = new Audio("./sonidos/acierto.mp3");
      sonidoAcierto.play();

      // Confetti
      const rect = e.target.getBoundingClientRect();
      crearConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

      // Verificar si se completó el nivel
      if (piezasEncajadas === imagenesPuzzle[nivelActual - 1].length) {
        setTimeout(completarNivel, 500);
      }
    } else {
      // Sonido de error
      const sonidoError = new Audio("./sonidos/error.mp3");
      sonidoError.play();

      // Efecto visual de error
      pieza.style.animation = "shake 0.5s";
      setTimeout(() => {
        pieza.style.animation = "";
      }, 500);
    }

    // Restaurar opacidad de la pieza
    pieza.style.opacity = "1";
  }
}

// Completar nivel
function completarNivel() {
  // Calcular puntos
  const puntosNivel = nivelActual * 50;
  puntosAcumulados += puntosNivel;

  // Guardar en localStorage
  localStorage.setItem("puntosPuzzleEspacial", puntosAcumulados);

  // Marcar nivel como completado si no lo estaba
  if (!nivelesCompletados.includes(nivelActual)) {
    nivelesCompletados.push(nivelActual);
    localStorage.setItem("nivelesCompletadosPuzzle",JSON.stringify(nivelesCompletados));
  }

  // Actualizar contador de puntos
  actualizarContadores();

  // Mostrar mensaje de felicitación
  const mensaje = `¡Felicidades ${jugadorActual}!\n\nCompletaste el nivel ${nivelActual}.\n\nGanaste ${puntosNivel} puntos.`;

  // Crear modal de felicitación
  const modalHTML = `
                <div class="modal fade" id="modalFelicitacion" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content" style="background-color: var(--color-primario); color: white; border: 2px solid var(--color-secundario);">
                            <div class="modal-header" style="border-bottom: 1px solid var(--color-secundario);">
                                <h5 class="modal-title" style="color: var(--color-secundario);">¡Nivel completado!</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center">
                                <i class="fas fa-rocket fa-4x mb-3" style="color: var(--color-secundario);"></i>
                                <p>${mensaje}</p>
                            </div>
                            <div class="modal-footer" style="border-top: 1px solid var(--color-secundario);">
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                                ${
                                  nivelActual < imagenesPuzzle.length
                                    ? `<button type="button" class="btn btn-success" id="btn-siguiente-nivel">
                                        Siguiente nivel <i class="fas fa-arrow-right"></i>
                                    </button>`
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modal = new bootstrap.Modal(document.getElementById("modalFelicitacion"));
  modal.show();

  // Configurar botón de siguiente nivel si existe
  const btnSiguiente = document.getElementById("btn-siguiente-nivel");
  if (btnSiguiente) {
    btnSiguiente.addEventListener("click", function () {
      cambiarNivel(nivelActual + 1);
      modal.hide();
    });
  }

  // Eliminar el modal cuando se cierre
  document.getElementById("modalFelicitacion").addEventListener("hidden.bs.modal", function () {this.remove();});

  // Actualizar selector de niveles
  inicializarSelectorNiveles();
}

// Actualizar los contadores de juego
function actualizarContadores() {
  document.getElementById("puntos-acumulados").textContent = puntosAcumulados;
}

// Volver al menú principal
function volverAlMenu() {
  if (piezasEncajadas > 0) {
    if (!confirm("¿Estás seguro de que quieres salir? Perderás tu progreso en este nivel.")) {
      return;
    }
  }

  window.location.href = "./eleccionminijuego.html";
}

document.getElementById("btn-reiniciar").addEventListener("click", iniciarJuego);
document.getElementById("btn-volver").addEventListener("click", volverAlMenu);

// Iniciar el juego al cargar
document.addEventListener("DOMContentLoaded", function () {
  crearFondoEstelar();
  inicializarSelectorNiveles();
  actualizarContadores();
  iniciarJuego();

  // Animación de shake para errores
  const style = document.createElement("style");
  style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-5px); }
                    40%, 80% { transform: translateX(5px); }
                }
            `;
  document.head.appendChild(style);
});