const jwt = require("jsonwebtoken");

const generateAccessToken = async (email, id) => {
  const payload = {
    email,
    id,
    type: "access-token",
  };
  const options = {
    algorithm: "HS256",
    expiresIn: "1d",
  };
  const result = await jwt.sign(payload, process.env.SECRET_KEY, options);
  return result;
};
const verify = async (token) => {
  const result = await jwt.verify(token, process.env.JWT_KEY);
  return result;
};
module.exports = {
  generateAccessToken,
  verify,
};
