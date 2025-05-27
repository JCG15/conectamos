// Función para redirigir después de ingresar el nombre
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

  // Lógica de redirección
  console.log(`Bienvenido ${nombre}! Redirigiendo...`);

  // Cerrar el modal
  modal.hide();

  // Mostrar mensaje de bienvenida
  alert(`¡Bienvenido ${nombre}! Prepárate para la aventura.`);

  window.location.href = `eleccionminijuego.html?nombre=${encodeURIComponent(nombre)}`;
});


// Validación
document.getElementById("nombreUsuario").addEventListener("input", function () {
  if (this.value.trim() !== "") {
    this.classList.remove("is-invalid");
  }
});

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