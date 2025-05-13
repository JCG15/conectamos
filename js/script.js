// Función para redirigir después de ingresar el nombre
//addEventListener.getElementById
document.getElementById("enviar").addEventListener("click",function () {
  const nombre = document.getElementById("nombreUsuario").value.trim();
  localStorage.setItem('nombre', nombre);
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("nombreModal")
  );

  if (nombre === "") {
    // Mostrar error si el campo está vacío
    document.getElementById("nombreUsuario").classList.add("is-invalid");
    document.getElementById("nombreUsuario").nextElementSibling.textContent =
      "Por favor ingresa tu nombre";
    return;
  }

  // Aquí iría la lógica de redirección
  console.log(`Bienvenido ${nombre}! Redirigiendo...`);

  // Cerrar el modal
  modal.hide();

  // Mostrar mensaje de bienvenida (simulando redirección)
  alert(`¡Bienvenido ${nombre}! Prepárate para la aventura.`);

  // En un caso real, aquí redirigirías a la siguiente página
  window.location.href = `eleccionminijuego.html?nombre=${encodeURIComponent(nombre)}`;
});


// Validación en tiempo real
document.getElementById("nombreUsuario").addEventListener("input", function () {
  if (this.value.trim() !== "") {
    this.classList.remove("is-invalid");
  }
});

// Inicializar el modal correctamente
document.addEventListener("DOMContentLoaded", function () {
  var myModal = new bootstrap.Modal(document.getElementById("nombreModal"));

  // Mostrar el modal al hacer clic en ENTRAR
  document.getElementById("botonEntrar").addEventListener("click", function () {
    myModal.show();
  });

  // Limpiar el campo al mostrar el modal
  document
    .getElementById("nombreModal")
    .addEventListener("show.bs.modal", function () {
      document.getElementById("nombreUsuario").value = "";
      document.getElementById("nombreUsuario").focus();
    });
});