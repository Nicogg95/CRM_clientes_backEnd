import jwt from "jsonwebtoken";

const crearToken = (usuario) =>{

    const {id, email, nombre, apellido} = usuario;

    return jwt.sign({id, email, nombre, apellido}, process.env.SECRETA, {expiresIn: "30d"})
}

export default crearToken;