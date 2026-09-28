import passport from "passport";
import passportJWT from "passport-jwt";
import local from "passport-local";
import { config } from "./config.js";
import { usersDAO } from "../controllers/index.js";
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
}
