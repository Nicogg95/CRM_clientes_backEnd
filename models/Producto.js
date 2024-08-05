import mongoose from "mongoose";

const productoSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    precio: {
        type: Number,
        required: true,
        trim: true
    },

    categoria: {
        type: String,
        required: true,
        trim: true
    },

    stock: {
        type: Number,
        required: true,
        trim: true
    }
});

productoSchema.index({nombre: "text"});

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;