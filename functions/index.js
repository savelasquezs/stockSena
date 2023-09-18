const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { setDoc, doc } = require("firebase/firestore");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

exports.createUser = functions.https.onCall((data, context) => {
  // Get the request's origin from the headers
  const requestOrigin = context.rawRequest.headers.origin;

  // Use cors middleware with the dynamically obtained origin
  return cors({ origin: requestOrigin })(data, context, () => {
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
                // Implement your email sending logic here
                // Example: sendEmail(data.email, link);

                // Return a success message
                return { message: "Usuario registrado exitosamente" };
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
