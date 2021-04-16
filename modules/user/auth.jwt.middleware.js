const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { CustomError } = require("../../errorHandler");

const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_PRIVATE_KEY,
    },
    function (payload, done) {
        const tokenAge = Math.floor(Date.now() / 1000) - payload.iat;

        if (payload.id && tokenAge < 60 * 60 * 3) {
            return done(null, payload);
        } else {
            return done(null, false);
        }
    }
);

function authenticateJWT() {
    return function (req, res, next) {
        passport.authenticate(
            jwtStrategy,
            { session: false },
            (error, user, info) => {
                if (error) {
                    return next(error);
                }
                if (!user) {
                    return next(new CustomError("UNAUTHORISED"));
                }

                req.user = user;
                next();
            }
        )(req, res, next);
    };
}

module.exports = { authenticateJWT };
