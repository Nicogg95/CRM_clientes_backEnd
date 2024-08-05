import mongoose from "mongoose";

const pedidoSchema = mongoose.Schema({

    pedido: {
        type: Array,
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Cliente"
    },

    estado: {
        type: String,
        default: "Preparando"
    },

    creado: {
        type: Date,
        default: Date.now(),
        required: true,
    }

});

const Pedido = mongoose.model("Pedido", pedidoSchema);

export default Pedido;
