const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Routes = require("./Routes/routes");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use(Routes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});