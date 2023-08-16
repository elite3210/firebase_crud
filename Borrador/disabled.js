
/*
<form action="#">
  <fieldset id="shipping">
    <legend>Dirección de Envío</legend>
    <input type="text" placeholder="Nombre" />
    <input type="text" placeholder="Dirección" />
    <input type="text" placeholder="Código postal" />
  </fieldset>
  <br />
  <fieldset id="billing">
    <legend>Dirección de facturación</legend>
    <label for="billing_is_shipping">Igual que la dirección de envío:</label>
    <input type="checkbox" id="billing-checkbox" checked />
    <br />
    <input type="text" placeholder="Nombre" disabled />
    <input type="text" placeholder="Dirección" disabled />
    <input type="text" placeholder="Código postal" disabled />
  </fieldset>
</form>

*/


/*

input[type="text"]:disabled {
  background: #ccc;
}

*/


// Esperar a que la página termine de cargarse
document.addEventListener(
    "DOMContentLoaded",
    function () {
      // Adjunte el detector de eventos `change` al checkbox
      document.getElementById("billing-checkbox").onchange = toggleBilling;
    },
    false,
  );
  
  function toggleBilling() {
    // Seleccione los campos de texto de facturación
    var billingItems = document.querySelectorAll('#billing input[type="text"]');
    console.log('hola mundo elizito...')
    // Alternar los campos de texto de facturación
    for (var i = 0; i < billingItems.length; i++) {
      billingItems[i].disabled = !billingItems[i].disabled;
    }
  }