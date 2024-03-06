const mongoose = require("mongoose");

// crear el esquema /.Schema es una clase, por eso hay que añadirle un new delante. Estamos creando una nueva clase(plantilla)
const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // el campo es obligatorio
    unique: true, // el campo no se puede repetir en otros docs.
  },
  awardsQty: {
    type: Number,
    required: true,
    min: 0, // el valor menor es 0. No puede ser número negativo
    default: 0, // valor predefinido si, por alguna razón, no se agrega valor a esta propiedad
  },
  isTouring: {
    type: Boolean,
  },
  genre: {
    type: String,
    enum: ["rock", "indie", "alternative", "metal", "pop", "country"], // permite definir los únicos valores posibles que tendrá esta propiedad
  },
});

// crear el modelo --> herramienta con la que vamos a la DB a hacer cosas
const Artist = mongoose.model("Artist", artistSchema);
//el método .model requiere siempre 2 argumentos:
//1. el nombre interno con el que se conocerá el modelo
//2. el esquema que hemos definido para cada documento de la colección

module.exports = Artist;
// lo exportamos para poder acceder a la DB (esta colección) desde cualquier archivo del servidor
