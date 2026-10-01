import passport from "passport";
import passportJWT from "passport-jwt";
import local from "passport-local";
import { config } from "./config.js";
import { usersDAO, usersService } from "../controllers/index.js";
import { comparePassword } from "../utils/crypto.js";


const buscarToken = (req) => {
    let token = null;
    if (req.cookies?.currentUser) {
        token = req.cookies.currentUser;
    }
    return token;
}

//inicializo Passport
export const inicializarPassport = (req) => {

    // current
    passport.use("current", new passportJWT.Strategy({
        secretOrKey: config.general.JWT_SECRET,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken])
    },
        async (payload, done) => {
            try {
                const user = await usersService.getUsersById(payload.id);

                // si el usuario no existe, se devuelve un error (p.e. puede haber sido eliminado mientras tenia sesion activa, y el token sigue siendo válido)
                if (!user) {
                    return done(null, false, { message: "El usuario ya no existe en el sistema" });
                }

                // 3. Todo correcto
                return done(null, user);

            } catch (error) {
                return done(error);
            }
        }
    ));

    // login
    passport.use("login", new local.Strategy(
        {
            usernameField: "email"
        },
        async (username, password, done) => {
            try {
                //TODO: eliminar toLowerCase que ya lo impmemento en el DAO (creo)
                const user = await usersDAO.getByEmail(username.toLowerCase());

                if (!user) {
                    return done(null, false, { message: "Credenciales inválidas." });
                }

                if (!comparePassword(password, user.password)) {
                    return done(null, false, { message: "Credenciales inválidas." });
                }
                //se crea req.user
                return done(null, user);

            } catch (error) {
                return done(error);
            }
        }
    ))

    //registro
    passport.use("registro", new local.Strategy(
        {
            usernameField: "email",
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                const newUser = await usersService.createUser(req.body);
                return done(null, newUser)

            } catch (error) {

                return done(error);
            }
        }
    ))

    //Nuevas estrategias... 
}
