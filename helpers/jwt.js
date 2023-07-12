const jwt = require("express-jwt");

function authJwt() {
  try {
    const secret = process.env.secret;
    return jwt({
      secret,
      algorithms: ["HS256"],
      isRevoked: isRevoked,
    }).unless({
      path: [
        { url: "/products", methods: ["GET", "OPTIONS"] },
        { url: "/products/get/featured/1", methods: ["GET", "OPTIONS"] },
        { url: "/categories", methods: ["GET", "OPTIONS"] },

        "/user/login",
        "/user/register",
      ],
    });
  } catch (error) {
    return (req, res, next) => {
      res.status(400).json({
        success: false,
        message: "Error occurred during authentication",
        error: error.message,
      });
    };
  }
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
