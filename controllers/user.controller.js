const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  // obtener usuario, email y password de la petición
  const { username, email, password } = req.body;
  try {
    // Generemos un fragmento aleatorio para usarse con el password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newCart = await Cart.create({});

    const respuestaDB = await User.create({
      username,
      email,
      password: hashedPassword,
      cart: newCart
    });
    // usuario creado
    return res.json(respuestaDB);
  } catch (error) {
    return res.status(400).json({
      msg: error,
    });
  }
};

exports.login = async (req, res) => {
  // obtenemos el email y password de la petición
  const { email, password } = req.body;
  try {
    // buscamos al usuario
    let foundUser = await User.findOne({ email });
  
    // si no se encuentra al usuario, devolvemos un error
    if (!foundUser) {
      return res.status(400).json({ msg: "Username does not exist" });
    }
    // si lo encuentra, evaluamos si la contraseña es correcta
    const passCorrecto = await bcryptjs.compare(password, foundUser.password);
    // si la contraseña es incorrecta, lo reportamos
    // debemos tener cuidado de no entregar más info de la estrictamente necesaria
    if (!passCorrecto) {
      return res
        .status(400)
        .json({ msg: "The username or password does not correspond" });
    }
    // si todo es correcto, generamos un json web token
    // 1. el 'payload' será un objeto que contendrá el id del usuario
    const payload = { user: { id: foundUser.id } };
    // 2. firma del jwt
    jwt.sign(
      payload,
      // usamos la palabra secreta para descifrar la firma electrónica del token
      process.env.SECRET,
      {
        expiresIn: '1d',
      },
      (error, token) => {
        if (error) throw error;
        //si todo va bien, retorna el token
        const isProd = process.env.NODE_ENV === 'production';
        res.
            cookie('token', token, {
              httpOnly: true,
              secure: isProd,
              sameSite: isProd ? 'None': 'Lax',
              maxAge: 24 * 60 * 60 * 1000
            })
            .json({ msg: 'Login sucessful' });
      }
    );
  } catch (error) {
    res.json({
      msg: "we have an error",
      error,
    });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    // confirmamos que el usuario exista y
    //retorna sus datos, excluyendo de password
    const usuario = await User.findById(req.user.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    // en caso de error, devolvemos un mensaje
    res.status(500).json({
      msg: "we have an error",
      error,
    });
  }
};

exports.updateUser = async (req, res) => {
  const newDataForOurUser = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      newDataForOurUser,
      { new: true }
    ).select("-password");

    res.json({
      msg: "Usuario actualizado con éxito.",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Hubo un error actualizando el usuario.",
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  })
  return res.json({ msg: 'Logout sucessful' });
}
