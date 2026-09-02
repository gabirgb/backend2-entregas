import mongoose from "mongoose";

export const connDB = async (mongoUri, dbName) => {
    try {
        await mongoose.connect(
            mongoUri,
            {
                //en este objeto puedo agregar varios params rel con la conexion, encriptados, protocolos, nombre db, etc...
                dbName,
            }
        )
        console.log(`DB ${dbName} online!`)
    } catch (error) {
        console.log(`Error al conectar a DB: ${error.message}`)
    }
}