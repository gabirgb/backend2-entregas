process.loadEnvFile("./.env");

export const config = {
    PORT: process.env.PORT,
    general: {
        SECRET: process.env.SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
    },
    database: {
        MONGO_URI: process.env.MONGO_URI,
        DB_NAME: process.env.DB_NAME,
    }
}