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
                return done(null, payload)
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
                let user = await usersDAO.getByEmail(username.toLowerCase());

                if (!user) {
                    return done(null, false)
                }

                if (!comparePassword(password, user.password)) {
                    return done(null, false)
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
                if (error.statusCode && error.statusCode < 500) {
                    return done(null, false, { message: error.message });
                }
                return done(error);
            }
        }
    ))

    //Nuevas estrategias... 
}
