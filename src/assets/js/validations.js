// Función para limpiar el texto de un input
function limpiarTexto(input) {
  const textoOriginal = input.value;
  const textoNuevo = textoOriginal
      .replace(/ {2,}/g, " ") // Reemplazar varios espacios en blanco seguidos por un solo espacio en blanco
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+/g, "") // Eliminar cualquier caracter que no sea una letra, número o espacio en blanco
      .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+$/g, ""); // Eliminar cualquier caracter que no sea una letra, número o espacio en blanco al principio o al final del texto

  input.value = textoNuevo;
}

// Aplicar la limpieza de texto a todos los inputs de tipo text, search y textarea
document.querySelectorAll('input[type="text"]:not(.name):not(.telefono):not(.pdf), input[type="search"], textarea').forEach(input => {
  input.addEventListener('input', function() {
    limpiarTexto(this);
  });
});


function limpiarTextoNombre(input) {
  const textoOriginal = input.value;
  const textoNuevo = textoOriginal
      .replace(/ {2,}/g, " ") // Reemplazar varios espacios en blanco seguidos por un solo espacio en blanco
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]+/g, "") // Eliminar cualquier caracter que no sea una letra, letra acentuada o espacio en blanco

  input.value = textoNuevo;
}

// Aplicar la limpieza de texto a todos los inputs de tipo text, search y textarea
document.querySelectorAll('input[type="text"].name').forEach(input => {
  input.addEventListener('input', function() {
    limpiarTextoNombre(this);
  });
});

function limpiarTextoPDF(input) {
  const textoOriginal = input.value;
  let textoNuevo = textoOriginal
      .replace(/[^a-zA-Z0-9-_]+/g, "") // Permitir solo letras sin acentos, números, guiones medios y bajos

  // Si el usuario intenta ingresar un punto, agregar automáticamente ".pdf"
  if (textoOriginal.includes('.')) {
    textoNuevo += '.pdf';
  }

  input.value = textoNuevo;
}

document.querySelectorAll('input[type="text"].pdf').forEach(input => {
  input.addEventListener('input', function() {
    limpiarTextoPDF(this);
  });
});


document.querySelectorAll('input[type="email"]').forEach(input => {
  input.addEventListener('input', function() {
    const emailOriginal = this.value;
    let partes = emailOriginal.split('@');

    if (partes.length > 1) {
        // Parte después del @: permitir solo utdelacosta.edu.mx
        partes[1] = partes[1].replace(/[^a-zA-Z0-9.]+/g, ""); // Eliminar caracteres no permitidos
        if (partes[1] !== "utdelacosta.edu.mx") {
            partes[1] = "utdelacosta.edu.mx";
        }
    }

    const emailValidado = partes.join('@')
        .replace(/[^a-zA-Z0-9@._-]+/g, "") // Permitir solo letras, números y los caracteres @, ., _, y -
        .replace(/\.{2,}/g, ".") // Reemplazar puntos consecutivos con un solo punto
        .replace(/\.@|@\./g, "@"); // Evitar punto inmediatamente antes o después de @

    this.value = emailValidado;
  });
});

document.querySelectorAll('input[type="text"].telefono').forEach(input => {
  input.addEventListener('input', function() {
    let telefonoOriginal = this.value;
    let telefonoValidado = telefonoOriginal
      .replace(/[^0-9]+/g, "") // Permitir solo números y un signo "+" opcional
      .replace(/^(\+{2,})/, "+") // Permitir solo un signo "+" al principio del número
      .replace(/^0+(?=\d)/, "") // Eliminar ceros a la izquierda que sean parte del número
      .replace(/\+.*\+/, "+"); // Eliminar signos "+" adicionales en el número

    // Truncar a un máximo de 10 caracteres
    if (telefonoValidado.length > 10) {
      telefonoValidado = telefonoValidado.substring(0, 10);
    }

    this.value = telefonoValidado;
  });
});


document.querySelectorAll('input[type="password"]').forEach(input => {
  input.addEventListener('input', function() {
    const passwordOriginal = this.value;
    const passwordValidado = passwordOriginal
      .replace(/[^a-zA-Z0-9]+/g, "") // Permitir solo letras (sin acentuaciones) y números
      .replace(/\s+/g, ""); // Eliminar espacios

    this.value = passwordValidado;
  });
});

