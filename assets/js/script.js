const formulario = document.querySelector("#formulario"); // --> Formulario HTML
const montoIngresado = document.querySelector("#montoIngresado"); // -> input donde ingresa el monto
const monedaSeleccionada = document.querySelector("#monedaSeleccionada"); // -> Select donde seleccionada la moneda
const resultado = document.querySelector("#resultado");
const ctx = document.getElementById("myChart"); // Grafica

// Renderizar la grafica
const renderizarGrafica = (datos) => {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: datos.map(elemento => elemento.fecha).reverse(),
      datasets: [{
          label: monedaSeleccionada.value,
              data: datos.map(elemento => elemento.valor).reverse(),
          borderWidth: 1,
        },
      ],
    }
  });
};
// Busca los datos de la moneda
const obtenerDatosMoneda = async () => {
  const respuesta = await fetch(
    `https://mindicador.cl/api/${monedaSeleccionada.value}`
  ); // promesa
  const data = await respuesta.json(); // transformo promesa en respuesta
  return data;
};
// se ejecuta al enviar el formulario
const enviarFormulario = async (event) => {
  event.preventDefault(); // con esto evitamos que recargue la pagina

  const datosMoneda = await obtenerDatosMoneda(); // busca el precio de la moneda seleccionada
  const valorMoneda = datosMoneda.serie[0].valor; // es el valor de la moneda actualizada
  const monedaConvertida = (montoIngresado.value / valorMoneda).toFixed(2);

  resultado.innerHTML = monedaConvertida; // renderizamos/pintamos en el html

  const ultimos10dia = datosMoneda.serie.splice(0, 10);
  renderizarGrafica(ultimos10dia);
};
formulario.addEventListener("submit", enviarFormulario); // evento que se va a ejecutar al dar click al boton
