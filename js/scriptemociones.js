// Emociones disponibles
const emociones = [
  { nombre: "Feliz", icono: "fa-smile", codigo: "😊" },
  { nombre: "Triste", icono: "fa-sad-tear", codigo: "😢" },
  { nombre: "Enfadado", icono: "fa-angry", codigo: "😠" },
  { nombre: "Sorprendido", icono: "fa-surprise", codigo: "😲" },
];

// Variables del juego
let nivelActual = 1;
let aciertos = 0;
let preguntasTotales = 5;
let preguntasRespondidas = 0;
let puntosAcumulados = 0;
let emocionCorrecta = null;
let jugadorActual = localStorage.getItem('nombreJugador') || 'Jugador';

// DOM
const emocionActualElement = document.getElementById("emocion-actual");
const opcionesEmocionesElement = document.getElementById("opciones-emociones");
const nivelActualElement = document.getElementById("nivel-actual");
const aciertosElement = document.getElementById("aciertos");
const totalPreguntasElement = document.getElementById("total-preguntas");
const puntosAcumuladosElement = document.getElementById("puntos-acumulados");
const nivelProgresoElement = document.getElementById("nivel-progreso");
const btnVolver = document.getElementById("btn-volver");

// Inicializar juego
function iniciarJuego() {
  // Verificar jugador
  if (!jugadorActual) {
    alert("Por favor, ingresa tu nombre en la página principal primero.");
    window.location.href = "index.html";
    return;
  }

  // Configurar nivel
  nivelActual = 1;
  preguntasTotales = 5;
  actualizarInterfaz();
  generarNuevaPregunta();

  
  btnVolver.addEventListener("click", volverAlMenu);
}

// Actualizar interfaz
function actualizarInterfaz() {
  nivelActualElement.textContent = nivelActual;
  totalPreguntasElement.textContent = preguntasTotales;
  puntosAcumuladosElement.textContent = puntosAcumulados;
  aciertosElement.textContent = aciertos;
}

// Generar nueva pregunta
function generarNuevaPregunta() {
  // Seleccionar emoción correcta aleatoria
  emocionCorrecta = emociones[Math.floor(Math.random() * emociones.length)];
  emocionActualElement.textContent = emocionCorrecta.codigo;
  emocionActualElement.className = "astronauta-cara";

  // Generar opciones
  const opciones = [...emociones];
  opciones.sort(() => Math.random() - 0.5);

  // Mostrar opciones
  opcionesEmocionesElement.innerHTML = "";
  opciones.forEach((emocion) => {
    const boton = document.createElement("button");
    boton.className = "btn-emocion";
    boton.innerHTML = `${emocion.nombre}`;
    boton.addEventListener("click", () => verificarRespuesta(emocion));
    opcionesEmocionesElement.appendChild(boton);
  });
}

// Verificar respuesta
function verificarRespuesta(emocionSeleccionada) {
  preguntasRespondidas++;
  const esCorrecta = emocionSeleccionada.nombre === emocionCorrecta.nombre;

  // Efecto visual
  emocionActualElement.classList.add(esCorrecta ? "acierto" : "error");

  // Actualizar puntuación
  if (esCorrecta) {
    aciertos++;
    const puntosGanados = nivelActual * 10;
    puntosAcumulados += puntosGanados;
  }

  // Actualizar progreso
  const progreso = (preguntasRespondidas / preguntasTotales) * 100;
  nivelProgresoElement.style.width = `${progreso}%`;

  // Actualizar interfaz
  actualizarInterfaz();

  // Verificar si se completó el nivel
  if (preguntasRespondidas >= preguntasTotales) {
    setTimeout(completarNivel, 1000);
  } else {
    setTimeout(generarNuevaPregunta, 1000);
  }
}

// Completar nivel
function completarNivel() {
  // Crear modal
  const modalHTML = `
                <div class="modal fade modal-espacial" id="modalResultado" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">¡Nivel ${nivelActual} Completado!</h5>
                            </div>
                            <div class="modal-body">
                                <div class="efecto-constelacion" id="efecto-constelacion"></div>
                                
                                <div class="emoji-resultado">🚀</div>
                                
                                <div class="puntos-ganados">
                                    +${puntosAcumulados} Puntos
                                </div>
                                
                                <div class="detalles-resultado">
                                    <p><i class="fas fa-check-circle" style="color: #4CAF50;"></i> Aciertos: ${aciertos}/${preguntasTotales}</p>
                                    <p><i class="fas fa-trophy" style="color: #FFD700;"></i> Nivel completado: ${nivelActual}/3</p>
                                </div>
                            </div>
                            <div class="modal-footer">
                                ${
                                  nivelActual < 3
                                    ? `<button type="button" class="btn-modal btn-continuar" id="btnContinuar">
                                        <i class="fas fa-arrow-right"></i> Siguiente Nivel
                                    </button>`
                                    : ""
                                }
                                <button type="button" class="btn-modal btn-volver" id="btnVolverModal">
                                    <i class="fas fa-home"></i> Volver al Menú
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

  // Añadir modal
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Crear efecto de constelación
  crearEfectoConstelacion();

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("modalResultado"));
  modal.show();

  // Configurar botones del modal
  document.getElementById("btnContinuar")?.addEventListener("click", () => {
    modal.hide();
    setTimeout(() => {
      // Avanzar al siguiente nivel
      nivelActual++;
      aciertos = 0;
      preguntasRespondidas = 0;
      preguntasTotales += 2;
      nivelProgresoElement.style.width = "0%";
      actualizarInterfaz();
      generarNuevaPregunta();
      document.getElementById("modalResultado").remove();
    }, 500);
  });

  document.getElementById("btnVolverModal").addEventListener("click", () => {
    modal.hide();
    setTimeout(() => {
      window.location.href = `eleccionminijuego.html?puntos=${puntosAcumulados}&juego=emociones`;
    }, 500);
  });

  // Eliminar modal al cerrar
  document
    .getElementById("modalResultado")
    .addEventListener("hidden.bs.modal", function () {
      this.remove();
    });
}

// Crear efecto de constelación para el modal
function crearEfectoConstelacion() {
  const contenedor = document.getElementById("efecto-constelacion");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  const cantidad = 30;

  for (let i = 0; i < cantidad; i++) {
    const estrella = document.createElement("div");
    estrella.className = "estrella-efecto";

    estrella.style.width = `${Math.random() * 4 + 2}px`;
    estrella.style.height = estrella.style.width;
    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.top = `${Math.random() * 100}%`;
    estrella.style.animationDelay = `${Math.random() * 2}s`;
    estrella.style.animationDuration = `${Math.random() * 1 + 0.5}s`;

    contenedor.appendChild(estrella);
  }
}

// Volver al menú
function volverAlMenu() {
  if (preguntasRespondidas > 0 && preguntasRespondidas < preguntasTotales) {
    if (!confirm("¿Estás seguro de que quieres salir?")) {
      return;
    }
  }
  window.location.href = `eleccionminijuego.html?puntos=${puntosAcumulados}&juego=emociones`;
}

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

// Iniciar al cargar
document.addEventListener("DOMContentLoaded", () => {
  crearFondoEstelar();
  iniciarJuego();
});