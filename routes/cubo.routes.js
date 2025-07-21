const express = require('express');
const { getAllCubos, createCubo, updateCuboById, deleteCuboById } = require('../controllers/Cubo.controller');
const cuboRouter = express.Router();

cuboRouter.get('/', getAllCubos); // localhost:3000/api/guitars
cuboRouter.post('/', createCubo); // localhost:3000/api/guitars
cuboRouter.put('/:id', updateCuboById); // localhost:3000/api/guitars/:id
cuboRouter.delete('/:id', deleteCuboById); // localhost:3000/api/guitars/:id

module.exports = cuboRouter;