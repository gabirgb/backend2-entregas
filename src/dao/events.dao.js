import { eventModel } from "../models/events.model.js";

export class EventsDAO {
    /* queryOptions (param) - es un obj que tiene opciones de filtrado pasadas desde el Controller/Service
    Obtiene eventos aplicando filtros opcionales (nombre, rango de fechas, etc.). Al pasarle un objeto desde el controlador con parámetros que recibo vía req.query, puedo armar búsquedas combinadas, por ejemplo: todos los eventos en estado "published" que contengan la palabra "Festival" entre marzo y junio.
    */

    //recordar pasarle el req.query en el controller al GET porque sino acá llega vacio
    async get(queryOptions = {}) {
        //desestructuro el onjeto donde vienen los posibles parámetros de búsqueda
        const { title, location, category, artist, fromDate, toDate, status } = queryOptions;
        // creo un objeto vacio donde voy a ir armando la consulta, donde cada propiedad será un parametro de busqueda configurado
        const mongoQuery = {};

        // 1. Búsqueda por título/ artista (insensible a mayúsculas/minúsculas y parcial)
        if (title) {
            mongoQuery.title = { $regex: title, $options: 'i' };
        }

        if (artist) {
            mongoQuery.artist = { $regex: artist, $options: 'i' };
        }

        // 2. Búsqueda por rango de fechas (desde / hasta)
        if (fromDate || toDate) {
            mongoQuery.date = {};
            //trae eventos a partir de la fecha (greater than or equal)
            if (fromDate) mongoQuery.date.$gte = new Date(fromDate);
            //trae eventos previos a la fecha (less than or equal)
            if (toDate) mongoQuery.date.$lte = new Date(toDate);
        }

        // 3. Filtro opcional por estado
        if (status) {
            mongoQuery.status = status;
        }

        return await eventModel.find(mongoQuery).lean();
    }

    // Busca un evento por su ID de MongoDB
    async getById(id) {
        return await eventModel.findById(id).lean();
    }

    // creamos un evento
    // acá no hago try/catch para que cuando mangoose lance un error, este pueda ser cazado directamente en el controlador en el catch y la envie al errorHandler con next(error).
    async create(event = {}) {
        const newEvent = await eventModel.create(event);
        return newEvent.toJSON();
    }
}

