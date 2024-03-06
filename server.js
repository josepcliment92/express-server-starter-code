require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/artist-songs-db") // artist-songs-db es el nombre que le damos a la DB. Si esta DB no existe, en nuestro Mongo se creará una nueva DB vacía con ese nombre
  .then(() => {
    console.log("todo bien, conectados a la DB");
  })
  .catch(() => {
    console.log("todo mal, hubo un problema en la conexión a la DB");
  });

const app = express();

// all middlewares & configurations here
app.use(logger("dev")); //recibe una función de la librería morgan que nos permite ver los mensajes cada vez que un usuario contacta con el servidor. Útil para el entorno de desarrollo.
app.use(express.static("public"));

// below two configurations will help express routes at correctly receiving data.
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array

const Artist = require("./models/Artist.model");

// all routes here...
app.get("/", (req, res, next) => {
  res.json({ message: "all good here!" });
});

//crear ruta que intente buscar todos los artistas que hay en la DB
app.get("/artists", (req, res, next) => {
  //1. buscar los artistas en la DB
  Artist.find() //.find permite buscar múltiples docs en una colección
    //.select({ name: 1, genre: 1 }) // método para que únicamente muestre las propiedades que le indicas
    .then((response) => {
      console.log(response);
      //2. enviarlos al cliente
      res.json(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

//filtrar artista por query de búsqueda
app.get("/search/artists", (req, res, next) => {
  //1. buscar los artistas en la DB
  Artist.find({ name: req.query.name }) //dentro de .find incluimos las propidades por las que permitimos al cliente que pueda filtrar la información. En este caso sería solo el name, podríamos incluir también las demás: genre, isTouring, etc.
    .select({ name: 1, genre: 1 }) // método para que únicamente muestre las propiedades que le indicas
    .then((response) => {
      console.log(response);
      //2. enviarlos al cliente
      res.json(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

//ruta para crear artistas. usamos .post para crear
app.post("/artists", (req, res, next) => {
  //1. recibir del cliente la información para crear el artista
  console.log(req.body);
  //2. Crear el artista en la DB
  Artist.create({
    name: req.body.name,
    awardsQty: req.body.awardsQty,
    isTouring: req.body.isTouring,
    genre: req.body.genre,
  })
    .then(() => {
      //3. indicarle al cliente que ha sido creado
      res.json({ message: "Todo bien, documento creado" });
    })
    .catch((error) => {
      console.log(error);
    });
});

//ruta para buscar los detalles de un artista por su id
app.get("/artists/:artistId", async (req, res, next) => {
  //console.log(req.params)
  try {
    const response = await Artist.findById(req.params.artistId);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

//ruta para borrar artistas por su id
app.delete("/artists/:artistId", async (req, res, next) => {
  try {
    await Artist.findByIdAndDelete(req.params.artistId);
    res.json({ message: "artista borrado" });
  } catch (error) {
    console.log(error);
  }
});

//ruta para actualizar todos los datos de un artista
app.put("/artists/:artistId", async (req, res, next) => {
  console.log(req.params);
  console.log(req.body);
  const { name, awardsQty, isTouring, genre } = req.body;

  try {
    const response = await Artist.findByIdAndUpdate(
      req.params.artistId,
      {
        name,
        awardsQty,
        isTouring,
        genre,
      },
      { new: true }
    ); // añadir {new:true} no es necesario, abajo se explica para qué sirve
    //el método hace la actualización pero devuelve el documento antes de hacer la actualización.
    //si por alguna razón queremos que nos devuelva el doc después de la actualización, debemos agregar un 3r argumento que es un objeto con la propiedad {new: true}
    res.json(response);
  } catch (error) {
    console.log;
  }
});

// server listen & PORT
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
