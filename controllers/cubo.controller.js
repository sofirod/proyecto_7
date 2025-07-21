const Cubo = require("../models/cubo.model");
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.getAllCubos = async (req, res) => {
  try {
    const cubos = await Cubo.find({});
    res.json({
      cubos,
    });
  } catch (error) {
    res.status(500).json({
      msg: "There was an error obtaining data",
    });
  }
};

exports.createCubo = async (req, res) => {
  const { name, price, description, img, currency, slug } = req.body;
  try {

    const product = await stripe.products.create({
      name,
      description,
      images: [img],
      metadata: {
        productDescription: description,
        slug
      }
    })

    const stripePrice = await stripe.prices.create({
      unit_amount: price,
      currency,
      product: product.id
    })

    const newCubo = await Cubo.create({
      idProd: product.id,
      priceID: stripePrice.id,
      name,
      price,
      description,
      img,
      slug,
      currency
    });
    res.json(newCubo);
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error creando el cubo",
      error
    });
  }
};

exports.updateCuboById = async (req, res) => {
  const { name, price, description, img } = req.body;

  try {
    const updatedCubo = await Cubo.findByIdAndUpdate(
      req.params.id,

      { name, price, description, img },

      { new: true, runValidators: true }
    );

    if (!updatedCubo) {
      return res.status(404).json({ message: "Cubo no encontrada" });
    }

    return res.status(200).json({ updatedCubo });
  } catch (error) {
    return res.status(500).json({
      msg: "Hubo un error actualizando el cubo",

      error: error.message,
    });
  }
};

exports.deleteCuboById = async (req, res) => {
    try {
        const CuboBorrado = await Cubo.findByIdAndDelete(req.params.id)
        res.json(CuboBorrado)
    } catch (error) {
        res.status(500).json({
            msg: "There was an error erasing the specified guitar"
        })
    }
}
