// 1. importaciones
const express = require('express')
const app = express()      
const cors = require('cors')
const connectDB = require('./config/db')

const userRouter = require('./routes/user.routes');
const guitarRouter = require('./routes/guitar.routes');

// 2. middlewares
// variables de entorno
require('dotenv').config()

// conexión a la base de datos
connectDB()

// Habilitar CORS
app.use(cors())
app.use(express.json());

app.use('/api/users', userRouter); // localhost:3000/api/users
app.use('/api/guitars', guitarRouter); // localhost:3000/api/guitars

// 3. ruteo
// A. Guitarras

app.get("/obtener-guitarras", async (req, res) => {
    try {
        const guitarras = await Guitarra.find({})
        res.json({
            guitarras
        })
    } catch (error) {
        res.status(500).json({
            msg: "There was an error obtaining data"
        })
    }
})

app.post("/crear-guitarra", async(req, res) => {
    const { nombre, precio } = req.body
    try {
        const nuevaGuitarra = await Guitarra.create({ nombre, precio })
        res.json(nuevaGuitarra)
    } catch (error) {
        res.status(500).json({
            msg: "There was an error creating the guitar"
        })
    }
})

app.put("/actualizar-guitarra", async (req, res) => {
    const { id, nombre, precio } = req.body
    try {
        const actualizacionGuitarra = 
	        await Guitarra.findByIdAndUpdate(id, { nombre, precio }, { new: true })
        res.json(actualizacionGuitarra)
    } catch (error) {       
        res.status(500).json({
            msg: "There was an error updating the guitar"
        })
    }
})

app.delete("/borrar-guitarra", async (req, res) => {
    const { id } = req.body
    try {
        const guitarraBorrada = await Guitarra.findByIdAndRemove({_id: id })
        res.json(guitarraBorrada)
    } catch (error) {
        res.status(500).json({
            msg: "There was an error erasing the specified guitar"
        })
    }
})

app.listen(process.env.PORT, () => console.log("Listening to port 3000"))
