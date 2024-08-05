import mongoose from "mongoose";
import bcrypt from "bcrypt";

const clienteSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    apellido: {
        type: String,
        required: true,
        trim: true
    },

    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    telefono:{
        type: Number,
        required: true,
        trim: true,
        unique: true
    },

    carrito:{
        type: Array
    }

});

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;