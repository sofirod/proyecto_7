const Guitar = require("../models/guitar.model");

exports.getAllGuitars = async (req, res) => {
  try {
    const guitarras = await Guitar.find({});
    res.json({
      guitarras,
    });
  } catch (error) {
    res.status(500).json({
      msg: "There was an error obtaining data",
    });
  }
};

exports.createGuitar = async (req, res) => {
  const { nombre, precio } = req.body;
  try {
    const nuevaGuitarra = await Guitar.create({ nombre, precio });
    res.json(nuevaGuitarra);
  } catch (error) {
    res.status(500).json({
      msg: "There was an error creating the guitar",
    });
  }
};

exports.updateGuitarById = async (req, res) => {
  const { nombre, precio } = req.body;

  try {
    const updatedGuitar = await Guitar.findByIdAndUpdate(
      req.params.id,

      { nombre, precio },

      { new: true, runValidators: true }
    );

    if (!updatedGuitar) {
      return res.status(404).json({ message: "Guitarra no encontrada" });
    }

    return res.status(200).json({ updatedGuitar });
  } catch (error) {
    return res.status(500).json({
      msg: "Hubo un error actualizando la guitarra",

      error: error.message,
    });
  }
};

exports.deleteGuitarById = async (req, res) => {
    try {
        const guitarraBorrada = await Guitar.findByIdAndDelete(req.params.id)
        res.json(guitarraBorrada)
    } catch (error) {
        res.status(500).json({
            msg: "There was an error erasing the specified guitar"
        })
    }
}
