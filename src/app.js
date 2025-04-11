const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const createToken = require("./createToken");
const icPaymentLogRoute = require('./routes/ic-payment-log.route');

const app = express();
app.use(express.json());
//Rutas
app.use('/api', icPaymentLogRoute);

app.use("/", function (req, res, next) {
  res.send(`<h1> API IC-PAYMENT-CONFIRM | Entorno: ${process.env.NODE_ENV}<h1>`);
});

createToken.createToken();
const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`El server está corriendo en el puerto ${port}`);
});
