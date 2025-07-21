// 1. importaciones
const express = require('express')
const app = express()      
const cors = require('cors')
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db')
require('dotenv').config();

const userRouter = require('./routes/user.routes');
const cuboRouter = require('./routes/cubo.routes');
const cartRouter = require('./routes/cart.routes');

// conexión a la base de datos
connectDB()

// Habilitar CORS
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins = isProd
    ? process.env.FRONTEND_URL_PROD
    : process.env.FRONTEND_URL_DEV;

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    }))
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRouter); // localhost:3000/api/users
app.use('/api/cubos', cuboRouter); // localhost:3000/api/cubos
app.use('/api/carts', cartRouter); // localhost:3000/api/carts

app.listen(process.env.PORT, () => console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)); 
