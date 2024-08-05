import { gql} from "apollo-server";

//Schema
const typeDefs = gql`
 
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
    }

    type Producto {
        id: ID
        nombre: String
        precio: Float
        categoria: String
        stock: Int
    }

    type Cliente {
        id: ID
        nombre: String
        apellido: String
        email: String
        telefono: Int
    }

    type Pedido {
        id: ID
        total: Float
        creado: String
        cliente: Cliente
        estado: String
        pedido: [PedidoGrupo]
    }

    type PedidoGrupo {
        id:ID
        cantidad: Int
        nombre: String
        precio: Float
    }

    type Token {
        token: String
    }

    type MejoresClientes {
        total: Float
        cliente: [Cliente]
    }

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    input ProductoInput {
        id: ID
        nombre: String!
        precio: Float!
        categoria: String!
        stock: Int!
    }

    input EditProductoInput {
        nombre: String
        precio: Float
        categoria: String
        stock: Int
    }

    input ClienteInput {
        nombre: String!
        apellido: String!
        email: String!
        telefono: Int!
    }

    input EditClienteInput {
        nombre: String
        apellido: String
        email: String
        telefono: Int
    }

    input PedidoInput {
        pedido: [PedidoProductoInput]
        total: Float
        cliente: ID
        estado: EstadoPedido
    }

    enum EstadoPedido {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }

    input PedidoProductoInput {
        id: ID
        cantidad: Int 
        nombre: String
        precio: Float
    }

    input EditPedidoInput {
        estado: EstadoPedido
    }
    
    input AutenticarInput {
        email: String!
        password: String!
    }

    type Query {
        #USUARIOS
        obtenerUsuario: Usuario     
        
        #PRODUCTOS
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto
        obtenerProductoPorNombre(nombre: String!): [Producto]

        #CLIENTES
        obtenerClientes: [Cliente]
        obtenerCliente(id: ID!): Cliente
        obtenerMejoresClientes: [MejoresClientes]

        #PEDIDOS
        obtenerPedidos: [Pedido]
        obtenerPedidosCliente: [Pedido]
        obtenerPedido(id: ID!): Pedido
        obtenerPedidosPorEstado(estado: String!): [Pedido]
      
    }

    type Mutation {
        #USUARIOS
        agregarUsuario(input: UsuarioInput) : Usuario
        autenticarUsuario(input: AutenticarInput) : Token

        #PRODUCTOS
        agregarProducto(input: ProductoInput) : Producto
        editarProducto(id: ID!, input: EditProductoInput) : Producto
        eliminarProducto(id:ID!) : String

        #CLIENTES
        agregarCliente(input: ClienteInput) : Cliente
        editarCliente(id:ID!, input: EditClienteInput) : Cliente
        eliminarCliente(id:ID!) : String

        #PEDIDOS
        agregarPedido(input: PedidoInput): Pedido
        editarPedido(id:ID!, input: EditPedidoInput): Pedido
        eliminarPedido(id:ID!): String

    }

`;

export default typeDefs;