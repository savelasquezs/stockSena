const createBorrowingEmailTemplate = require("./templatePrestamo");
const createTraspasoEmailTemplate = require("./templateTraspaso");

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "santyvan974@gmail.com",
    pass: "vbgqwzhxrbgesehe",
  },
});
const sendContactForm = (
  customerMail,
  prestamo,
  almacen,
  esTraspaso,
  clienteTraspaso
) => {
  return transport
    .sendMail({
      subject: esTraspaso
        ? "Traspaso de productos SENA"
        : "Prestamo de productos SENA",
      bcc: [customerMail],
      html: esTraspaso
        ? createTraspasoEmailTemplate(prestamo, almacen, clienteTraspaso)
        : createBorrowingEmailTemplate(prestamo, almacen),
    })
    .then((r) => console.log(r))
    .catch((e) => consol.log(e));
};

exports.sendEmailBorrowing = functions.https.onRequest((req, resp) => {
  cors(req, resp, () => {
    // your function body here - use the provided req and res from cors
    if (req.body.secret != "SantiagoIsTheBest")
      return resp.send("missing secret");
    sendContactForm(
      req.body.email,
      req.body.prestamo,
      req.body.almacen,
      req.body.esTraspaso || false,
      req.body.clienteTraspaso || null
    );
    resp.send("...sending Email");
  });
});
