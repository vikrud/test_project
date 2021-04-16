const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { isEmpty } = require("../../utils.js");
const { userService } = require("./user.service");
const { CustomError } = require("../../errorHandler");

const localStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async function (email, password, done) {
        try {
            const usersCred = { email: email, password: password };

            const userToken = await userService.userLogin(usersCred);
            return done(null, userToken);
        } catch (err) {
            done(err);
        }
    }
);

function authenticateLogin() {
    return function (req, res, next) {
        passport.authenticate(
            localStrategy,
            { session: false },
            (error, token, info) => {
                if (isEmpty(req.body)) {
                    throw new CustomError("EMPTY_EMAIL_PASS_DATA");
                }

                if (error) {
                    return next(error);
                }
                if (!token) {
                    return next(new CustomError("UNAUTHORISED"));
                }

                req.token = token;
                next();
            }
        )(req, res, next);
    };
}

module.exports = { authenticateLogin };
