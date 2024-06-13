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
document.querySelectorAll('input[type="text"]:not(.name):not(.telefono):not(.pdf):not(.tema):not(.trimestre), input[type="search"], textarea').forEach(input => {
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

function limpiarTextoTema(input) {
  const textoOriginal = input.value;
  const textoNuevo = textoOriginal
      .replace(/ {2,}/g, " ") // Reemplazar varios espacios en blanco seguidos por un solo espacio en blanco
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9()\-,. ]+/g, "") // Permitir letras, números, y algunos símbolos específicos
      .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9()\-,. ]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9()\-,. ]+$/g, ""); // Eliminar cualquier caracter que no sea una letra, número, símbolo específico o espacio en blanco al principio o al final del texto

  input.value = textoNuevo;
}

document.querySelectorAll('input[type="text"].tema').forEach(input => {
  input.addEventListener('input', function() {
    limpiarTextoTema(this);
  });
});

function limpiarTextoTrimestre(input) {
  const textoOriginal = input.value;
  const textoNuevo = textoOriginal
      .replace(/ {2,}/g, " ") // Reemplazar varios espacios en blanco seguidos por un solo espacio en blanco
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+/g, "") // Permitir letras, números, espacios en blanco y guion medio
      .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+$/g, "") // Eliminar cualquier caracter que no sea una letra, número, espacio en blanco o guion medio al principio o al final del texto
      .toUpperCase();
  input.value = textoNuevo;
}

document.querySelectorAll('input[type="text"].trimestre').forEach(input => {
  input.addEventListener('input', function() {
    limpiarTextoTrimestre(this);
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

