import { eventModel } from "../models/events.model.js";

export class EventsDAO {
    /* queryOptions (param) - es un obj que tiene opciones de filtrado pasadas desde el Controller/Service
    Obtiene eventos aplicando filtros opcionales (nombre, rango de fechas, etc.). Al pasarle un objeto desde el controlador con parámetros que recibo vía req.query, puedo armar búsquedas combinadas, por ejemplo: todos los eventos en estado "published" que contengan la palabra "Festival" entre marzo y junio.
    */

    //recordar pasarle el req.query en el controller al GET porque sino acá llega vacio
    // queryOptions o "filter"
    async getAllEvents(queryOptions = {}) {
        //desestructuro el onjeto donde vienen los posibles parámetros de búsqueda
        const {
            title,
            location,
            category,
            artist,
            fromDate,
            toDate,
            status,
            search,
            page = 1,
            limit = 10,
            sort = 'date'
        } = queryOptions;
        // creo un objeto vacio donde voy a ir armando la consulta, donde cada propiedad será un parametro de busqueda configurado
        const filter = {};

        // 1. Busqueda por titulo
        // $options: 'i' hace que la búsqueda no distinga mayúsculas y minúsculas.
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        // 2. Busqueda por artista
        if (artist) {
            filter.artist = { $regex: artist, $options: 'i' };
        }

        // 3. Busqueda por categoria
        // Si category es una referencia a otra colección, podemos filtrar por su id.
        // Endpoint: GET /api/events?category=65f1...
        if (category) {
            filter.category = category; //Luego podemos usar populate para devolver información de la categoría. Esto permite que la respuesta incluya datos asociados y no solo el id.
        }

        // 4. Busqueda por locacion
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        // 5. Búsqueda por rango de fechas (desde / hasta)
        // Endpoint: GET /api/events?fromDate=2026-06-01&toDate=2026-06-30
        if (fromDate || toDate) {
            filter.date = {};
            //trae eventos a partir de la fecha (greater than or equal)
            if (fromDate) filter.date.$gte = new Date(fromDate);
            //trae eventos previos a la fecha (less than or equal)
            if (toDate) filter.date.$lte = new Date(toDate);
        }

        // 6. Filtro opcional por estado
        // Endpoint: GET /api/events?status=cancelled
        if (status) {
            filter.status = status;
        }

        // 7. BUSQUEDA (NO FILTRO) por texto
        //También podemos permitir búsqueda por texto en campos como título o descripción. Una opción simple es usar $or con expresiones regulares.
        // Endpoint: GET /api/events?search=backend
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        }


        // 8. Paginación
        // Endpoint: GET /api/events?page=1&limit=10
        // Esto permite devolver una página específica de resultados.
        // const events = await EventModel
        //   .find(filter)
        //   .skip(skip)
        //   .limit(limitNumber)

        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.min(Number(limit) || 10, 50); // Máximo 50 por página por seguridad
        const skip = (pageNumber - 1) * limitNumber;

        // 9. Ordenamiento
        // Endpoint: GET /api/events?sort=date
        // En Mongoose, el signo menos indica orden descendente.

        // const sortOption = sort || 'date';
        // const events = await EventModel
        //   .find(filter)
        //   .sort(sortOption);

        // Ejecuto la consulta y el conteo en paralelo para optimizar rendimiento
        // events (o docs): es el subconjunto de datos que devuelve la base de datos para la página actual que pidió el usuario. Si pedi la página 1 con un límite de 10, events es un array que contiene exactamente 10 elementos.
        // totalEvents (o totalDocs): es el número total de elementos que existen en la base de datos Y que coinciden con el filtro.
        const [events, totalEvents] = await Promise.all([
            eventModel
                .find(filter)
                // comentado por ahora hasta implementar la relacion a las otras colecciones desde events.dao.js
                // .populate('category')
                // .populate('organizer', 'first_name last_name email')
                .sort(sort)
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            eventModel.countDocuments(filter)
        ]);

        // Si sé que hay 100 elementos x ej (totalEvents) y muestro 10 por página (limit), esta línea calcula automáticamente que hay 10 páginas en total:
        // (Math.ceil(100 / 10) = 10)
        // Mientras que en la respuesta HTTP le envío solo los 10 de la página actual en el campo payload o docs.
        const totalPages = Math.ceil(totalEvents / limitNumber);

        // Retornamos un objeto completo con la metadata de paginación
        return {
            docs: events,
            totalDocs: totalEvents,
            limit: limitNumber,
            page: pageNumber,
            totalPages: totalPages,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null
        };

        // res.json({
        //     status: 'success',
        //     payload: events,
        //     pagination: {
        //         total: totalEvents,
        //         page: pageNumber,
        //         limit: limitNumber,
        //         totalPages: Math.ceil(totalEvents / limitNumber)
        //     }
        // })


        //Además de devolver eventos, conviene devolver información de paginación.
        // Esto permite que un frontend sepa:
        // cuántos resultados existen;
        // en qué página está;
        // cuántos elementos hay por página;
        // cuántas páginas totales hay.

        // Los query params también deben validarse:
        // page debería ser un número positivo;
        // limit debería tener un máximo razonable;
        // fromDate y toDate deberían ser fechas válidas;
        // status debería pertenecer a los estados permitidos;
        // sort debería limitarse a campos seguros.

        // Ojo con filtros demasiado abiertos: si permitimos limit=100000, podríamos generar respuestas muy pesadas, por eso conviene definir límites.
        // Por ej:
        //const limitNumber = Math.min(Number(limit) || 10, 50)
        // Esto indica que, aunque el cliente pida más, el máximo será 50


        //return await eventModel.find(filter).lean().populate('category');
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

    // Actualizar un evento por ID
    async update(id, updateData) {
        // Usamos { new: true, runValidators: true } para que devuelva el documento actualizado y se ejecuten las validaciones del Schema de Mongoose.
        return await eventModel.findByIdAndUpdate(id, updateData, {
            new: true, //por defecto, Mongoose devuelve el documento antes de ser modificado. Con new = true me aseguro de que el servicio y el controlador reciban el evento ya actualizado.
            runValidators: true // las validaciones de Mongoose (como mínimos de caracteres, enums, etc.) por defecto no corren en los updates. "runValidators: true" fuerza a que Mongoose valide los datos antes de guardarlos en la base de datos.
        }).lean();
    }

}

