import { ApolloServer } from "apollo-server";
import resolvers from "./db/resolvers.js";
import typeDefs from "./db/schema.js";
import dotenv from "dotenv"
import { conectarDB } from "./config/db.js";
import jwt from "jsonwebtoken";

dotenv.config();
conectarDB();

//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req})=>{

        const token = req.headers["authorization"] || "";
    
        if(token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
                return {
                    usuario
                };
            }catch(error){
                console.log("Hubo un error");
                console.log(error);
            }
        }
    }
})

//Arrancamos el servidor
server.listen({port: process.env.PORT || 4000}).then(({url})=>{
    console.log(`Servidor lista en la URL ${url}`)
})