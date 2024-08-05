import Usuario from "../models/Usuario.js";
import crearToken from "../helpers/crearToken.js";
import Producto from "../models/Producto.js";
import Cliente from "../models/Cliente.js";
import Pedido from "../models/Pedido.js";

//Resolver
const resolvers = {
    Query: {

        //---------USUARIOS------------
        obtenerUsuario: async(_, {}, context)=>{
            
            return context.usuario;
        },
        
        //---------PRODUCTOS------------
        obtenerProductos: async(_)=>{
            try {
                const productos = await Producto.find({})
                return productos;
            }catch(error){
                console.log(error)
            }
        },

        obtenerProducto: async(_, {id})=>{

            const producto = await Producto.findById(id);
            if(!producto){
                throw new Error("Producto inexistente");
            }

            return producto;
        },

        //---------CLIENTES------------
        obtenerCliente: async(_,{id})=>{
            
            const cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error("Cliente no registrado")
            }
            return cliente;
        },

        obtenerClientes: async(_) =>{
            try{
                const clientes = await Cliente.find({});
                return clientes;
            }catch(error){
                console.log(error);
            }
        },

        obtenerMejoresClientes: async ()=>{
            const clientes = await Pedido.aggregate([
                //Buscamos los pedidos completados
                {$match: {estado: "COMPLETADO"}},

                //Sumamos los montos
                {$group: {
                    id: "$cliente",
                    total: {$sum: '$total'}
                }},
                //Traemos la informacion de los clientes
                {
                    $lookup: {
                        from: 'clientes',
                        localField: 'id',
                        foreignField: "_id",
                        as: "cliente"
                    }
                }
            ]);
            return clientes;
        },

        obtenerProductoPorNombre: async(_, {nombre}) =>{
            try{
                const productos = await Producto.find({$text: {$search: nombre}}).limit(10)

                if(!productos){
                    throw new Error("No se ha encontrado producto con ese nombre")
                }

                return productos;
            }catch(error){
                console.log(error)
            }
        },

        //---------PEDIDOS------------
        obtenerPedidos: async()=>{
            
            try{
                const pedidos = await Pedido.find({}).populate('cliente');
                return pedidos;

            }catch(error){
                console.log(error);
            }
        },

        obtenerPedidosCliente: async(_,{}, context)=>{

            try{
                const pedidos = await Pedido.find({cliente: context.id});
                
                if(!pedidos){
                    throw new Error("El cliente no cuenta con pedidos")
                }
            
                return pedidos;

            }catch(error){
                console.log("estos no son los pedidos")
                console.log(error);
            }
        },

        obtenerPedido: async(_,{id})=>{

            const pedido = await Pedido.findById(id);
            if(!pedido) {
                throw new Error('Pedido no encontrado');
            }
            return pedido;
        },

        obtenerPedidosPorEstado: async(_,{estado})=>{

            try{
                const pedidos = await Pedido.find({estado: estado})
                return pedidos;
            }catch(error){
                console.log(error)
            }
        }
    },

    Mutation: {

        //---------USUARIOS------------
        agregarUsuario: async(_, {input}) => {
            
            const {email} = input;
            //Revisar si existe
            const usuarioNuevo = await Usuario.findOne({email});
            if(usuarioNuevo) {
                throw new Error("Usuario existente");
            }
            
            // Guardar usuario nuevo
            try {
                const usuario = new Usuario(input)
                await usuario.save()
                return usuario;
            }catch (error){
                console.log(error)
            }
        },

        autenticarUsuario: async(_, {input}) =>{
            const {email, password} = input;

            //Verificar si usuario existe
            const usuario = await Usuario.findOne({email})
            if(!usuario){
                throw new Error("Usuario no registrado");
            }
            
            if(!await usuario.comprobarPassword(password)){
                
                throw new Error("Password incorrecto");
            }
               
            return {
                token: crearToken(usuario),
                
            }
        },

        //---------PRODUCTOS------------
        agregarProducto: async(_, {input}) =>{

            const { nombre } = input;

            const producto = await Producto.findOne({nombre})
            if(producto) {
                throw new Error("Producto ya existente");
            }

            try{
                const nuevo = new Producto(input);
                await nuevo.save();
    
                return nuevo
            }catch(error) {
                console.log(error)
            }
        },

        editarProducto: async(_, {id, input}) =>{

            const producto = await Producto.findById(id);
            const {nombre, precio, stock, categoria} = input;

            console.log(producto)

            if(!producto){
                throw new Error("Producto inexistente")
            }

            producto.nombre = nombre || producto.nombre;
            producto.precio = precio || producto.precio;
            producto.stock = stock || producto.stock;
            producto.categoria = categoria || producto.categoria;

            try{
                const productoEditado = await producto.save()
                //Otra forma seria
                //producto = await Producto.findOneAndUpdate({id:id}, input, {new: true})
                return productoEditado
            }catch(error){
                console.log(error)
            }
        },

        eliminarProducto: async(_, {id}) =>{
            const producto = await Producto.findById(id);

            if(!producto){
                throw new Error("Producto inexistente");
            }

            try{
                await producto.deleteOne()
                
                //Otra forma:
                // await Producto.findOneAndDelete({id})
                return `Producto "${producto.nombre}" eliminado`
            }catch(error){
                console.log(error)
            }
        },

        //---------CLIENTES------------
        agregarCliente: async(_, {input}) =>{

            const {email} = input;

            const clienteEmail = await Cliente.findOne({email})

            if(clienteEmail){
                throw new Error("Usuario existente");
            }

            try{
                const cliente = new Cliente(input);
                await cliente.save()
                return cliente
            }catch (error){
                console.log(error)
            }

        },

        editarCliente: async(_, {id, input}) =>{

            const {nombre, apellido, telefono, email} = input;
            
            const cliente = await Cliente.findById(id);

            if(!cliente) {
                throw new Error("Cliente no registrado");
            }

            cliente.nombre = nombre;
            cliente.apellido = apellido;
            cliente.telefono = telefono;
            cliente.email = email;

            try{
                const editado = await cliente.save();
                return editado;
            }catch(error){
                console.log(error);
            }
        },

        eliminarCliente: async(_, {id})=>{

            const cliente = await Cliente.findById(id);

            if(!cliente){
                throw new Error("Cliente inexistente");
            }

            try{
                await cliente.deleteOne()
                return `El cliente: "${cliente.nombre}" ha sido eliminado.`
            }catch(error){
                console.log(error);
            }

        },

        //---------PEDIDOS------------
        agregarPedido: async(_, {input}, context)=>{
            
            const {cliente} = input;

            const clienteExiste = await Cliente.findById(cliente);
            if(!clienteExiste){
                throw new Error("Cliente no registrado");
            }
            
            for await (const articulo of input.pedido){
                const {id, cantidad} = articulo;
                const productoExiste = await Producto.findById(id);
                
                if(!productoExiste){
                    throw new Error("Producto no registrado");
                }

                if(productoExiste.stock < cantidad){
                    throw new Error(`Stock insuficiente de "${productoExiste.nombre}" para realizar el pedido`);
                }

                productoExiste.stock -= cantidad;
                await productoExiste.save()
            }

            try{
                const nuevo = new Pedido(input)
                await nuevo.save()
                return nuevo;
            }catch(error){
                console.log(error);
            }
        },

        editarPedido: async(_, {id, input}) =>{

            const pedido = await Pedido.findById(id);
            if(!pedido){
                throw new Error("Pedido no registrado");
            }

            for await (const articulo of input.pedido){
                const {id, cantidad} = articulo;
                const productoExiste = await Producto.findById(id);
                
                if(!productoExiste){
                    throw new Error("Producto no registrado");
                }

                if(productoExiste.stock !== input.pedido.cantidad){

                    if(productoExiste.stock < cantidad){
                        throw new Error(`Stock insuficiente de "${productoExiste.nombre}" para realizar el pedido. Stock actual: ${productoExiste.stock}`);
                    }

                    productoExiste.stock -= cantidad;
                    await productoExiste.save()
                
                }

            }
            
            pedido.estado = input.estado;

            try{
                const actualizado = await pedido.save();
                return actualizado;
            }catch(error){
                console.log(error);
            }
        },

        eliminarPedido: async(_, {id}) =>{

            const pedido = await Pedido.findById(id);
            if(!pedido){
                throw new Error("Pedido no registrado");
            }

            try{
                await pedido.deleteOne()
                return "Pedido eliminado"
            }catch(error){
                console.log(error);
            }

        }
    }
}

export default resolvers;