const createTraspasoEmailTemplate = (prestamo, almacen, clienteTraspaso) => {
  const customerTable = `
    <table border="1">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Unidad de Medida</th>
          <th>Fecha Entrega</th>
        </tr>
      </thead>
      <tbody>
        ${prestamo.productosList
          .map(
            (product) => `
          <tr>
            <td>${product.product}</td>
            <td>${product.quantity}</td>
            <td>${product.unidadMedida}</td>
            <td>${new Date(product.dueDate).toLocaleDateString()}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  const emailTemplate = `
    <html>
      <head>
        <style>
          table {
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
          }
        </style>
      </head>
      <body>
        <h3>Hola, <strong style="text-transform: capitalize;"> ${prestamo.customer.name}</strong>, el SENA ha creado un prestamo a tu nombre.</h3>
        <h5>Este prestamo ha sido un traspaso de <strong style="text-transform: capitalize;"> ${clienteTraspaso}</strong>.</h5>

        <h5>Estos son los productos prestados :</h5>
        ${customerTable}
        <p>Si no reconoces este prestamo o tienes algun reclamo por hacer, acercate a el almacen de ${almacen} de tu centro de formación.</p>
      </body>
    </html>
  `;

  return emailTemplate;
};

module.exports = createTraspasoEmailTemplate;
