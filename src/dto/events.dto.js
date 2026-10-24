export class EventsDTO {
    constructor(event) {
        this.id = event._id || event.id;
        this.code = event.code;
        this.title = event.title;
        this.description = event.description;
        this.fromDate = event.fromDate;
        this.toDate = event.toDate;
        this.startTime = event.startTime;
        this.endTime = event.endTime;
        this.location = event.location;
        this.category = event.category;
        this.artist = event.artist;
        this.thumbnail = event.thumbnail;
        this.price = event.price;
        this.capacity = event.capacity;
        this.status = event.status;
        // Si el organizer viene populado, podemos sanitizarlo o usar su DTO si es un objeto completo
        this.organizer = event.organizer;
    }
}