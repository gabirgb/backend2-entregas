process.loadEnvFile("./.env");

export const config = {
    PORT: process.env.PORT,
    general: {
        SECRET: process.env.SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        NODE_ENV: process.env.NODE_ENV
    },
    database: {
        MONGO_URI: process.env.MONGO_URL,
        DB_NAME: process.env.DB_NAME,
    }
}