const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const createToken = () => {
  // Define la carga útil del token
  const payload = {
    // Aquí puedes poner cualquier dato que quieras en el token.
    // Por ejemplo, podrías incluir el ID de un usuario para rastrear quién hizo una solicitud a tu API.
    userId: 'APP_TOKEN'
  };

  // Define las opciones del token
  const options = {
  };

  // Crea el token
  const token = jwt.sign(payload, SECRET_KEY, options)

  console.log(token);
}

module.exports = { createToken };
