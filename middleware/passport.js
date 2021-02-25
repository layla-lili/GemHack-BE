const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const { User } = require("../db/models");
const { JWT_SECRET } = require("../config/keys");

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      // if expired
      return done(null, false); // throw a 401
    } else {
      try {
        const user = await User.findByPk(jwtPayload.id);
        return done(null, user); // will throw a 401 if user does not exist
      } catch (error) {
        return done(error);
      }
    }
  }
);

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: {
        username, // username: username,
      },
    });
    let passwordsMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    return done(null, passwordsMatch ? user : false);
    // done(null, false) this will throw a 401 error
  } catch (error) {
    return done(error);
  }
});
