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
    },
    github:
    {
        CALLBACK_URL: process.env.CALLBACK_URL,
        CALLBACK_PATH: process.env.CALLBACK_PATH,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        CLIENT_ID: process.env.CLIENT_ID,
        USER_AGENT: process.env.USER_AGENT
    }
}