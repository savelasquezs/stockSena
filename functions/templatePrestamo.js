const createBorrowingEmailTemplate = (prestamo, almacen) => {
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
        <h2>Hola, ${prestamo.customer.name}, el SENA ha creado un prestamo a tu nombre</h2>
        <h5>Estos son los productos prestados :</h5>
        ${customerTable}
        <p>Si no has hecho este prestamo o tienes algun reclamo por hacer, acercate a el almacen de ${almacen} de tu centro de formación.</p>
      </body>
    </html>
  `;

  return emailTemplate;
};

module.exports = createBorrowingEmailTemplate;
