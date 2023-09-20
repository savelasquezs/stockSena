const { onRequest } = require("firebase-functions/v2/https");
const { getAuth } = require("firebase-admin/auth");
const { nodemailer } = require("nodemailer")

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user: "cristiandavid3d@gmail.com",
    pass: "gavf eydk qlqs npsn"
  }
})

exports.sayHello = onRequest({ cors: true }, (req, res) => {
  // Access data from the request body

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Se requiere email y contraseña" });
  }
  getAuth()
    .createUser({ email, password })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });
});
