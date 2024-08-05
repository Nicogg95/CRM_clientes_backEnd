import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema({

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

    password:{
        type: String,
        required: true,
        trim: true
    },

    creado: {
        type: Date,
        default: Date.now()
    }
});

usuarioSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }

    // Hashear pass
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function(passInput){
    return await bcrypt.compare(passInput, this.password);
}

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;

