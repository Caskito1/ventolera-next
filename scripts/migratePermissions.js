// scripts/migratePermissions.js

import admin from "firebase-admin";
import { readFileSync } from "fs";

// INIT FIREBASE
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrate(){

  const snap = await db.collection("usuarios").get();

  for(const doc of snap.docs){

    const user = doc.data();

    if(user.permissions){
      console.log("Skipping:", doc.id);
      continue;
    }

    let permissions;

    // DEV / ADMIN TOTAL
    if(user.rol === "admin"){

      permissions = {
        partituras:"admin",
        recibos:"admin",
        merch:"admin",
        toques:"admin",
        usuarios:"admin"
      };

    }

    // MUSICO
    else{

      permissions = {
        partituras:"read",
        recibos:"read",
        merch:"read",
        toques:"read",
        usuarios:"none"
      };

    }
 // admin de partituras
    if(user.email === "musicoleomendez@gmail.com"){
      permissions.partituras = "write";
    }

    // admin de recibos
    if(user.email === "felipeeb9@gmail.com" ){
      permissions.recibos = "write";
    }

    await db.collection("usuarios")
      .doc(doc.id)
      .update({ permissions });

    console.log("Updated:", user.email);

  }

  console.log("Migration complete");

}

migrate();