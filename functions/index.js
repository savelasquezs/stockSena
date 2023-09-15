const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { setDoc, doc } = require("firebase/firestore");
const cors = require("cors");

admin.initializeApp();

exports.createUser = functions.https.onCall((data, context) => {
  // Use cors middleware with the origin option
  return cors({ origin: "http://localhost:9000" })(data, context, () => {
    // Check if the caller is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be logged in to create a user"
      );
    }

    // Validate the user data
    if (!data.email || !data.password || !data.displayName) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing user data"
      );
    }
    const userData = {
      email: data.email,
      displayName: data.displayName,
      role: "invitado",
      almacen: data.almacen,
    };

    // Create the user with the Admin SDK
    return admin
      .auth()
      .createUser(userData)
      .then((userRecord) => {
        // Save the user data in Firestore
        const docRef = doc(db, "users", userRecord.uid);
        return setDoc(docRef, userData)
          .then(() => {
            // Generate the email verification link
            return admin
              .auth()
              .generateEmailVerificationLink(data.email)
              .then((link) => {
                // Send the email verification link to the user
                // You can use any email service you prefer
                // For example, you can use nodemailer or sendgrid
                // See https://firebase.google.com/docs/auth/custom-email-handler for more details
                return sendEmail(data.email, link)
                  .then(() => {
                    // Return a success message
                    return { message: "Usuario registrado exitosamente" };
                  })
                  .catch((error) => {
                    // Handle errors
                    throw new functions.https.HttpsError(
                      "internal",
                      error.message
                    );
                  });
              })
              .catch((error) => {
                // Handle errors
                throw new functions.https.HttpsError("internal", error.message);
              });
          })
          .catch((error) => {
            // Handle errors
            throw new functions.https.HttpsError("internal", error.message);
          });
      })
      .catch((error) => {
        // Handle errors
        throw new functions.https.HttpsError("internal", error.message);
      });
  });
});
