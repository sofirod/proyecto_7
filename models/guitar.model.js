const mongoose = require('mongoose')
const guitarSchema = mongoose.Schema({
        nombre: {
            type: String, 
            required: true
            },
        precio: {
            type: Number
        },
    },
    {
        timestamps: true
    }
)
const Guitar = mongoose.model('Guitar', guitarSchema)

module.exports = Guitar