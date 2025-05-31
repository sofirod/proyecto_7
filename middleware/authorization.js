const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
	// extraemos el token que viene en la petición.
	// para ello, extraeremos la sección authorization
	// del header de la petición
	let { authorization } = req.headers;
	// si no viene la autorización, retornamos un error
	if (!authorization) {
		return res.status(401).json({ msg: "Unauthorized access" })
	}
	try {
		// obtenemos el token y el tipo de autorización desde la autorización
		console.log('authorization', authorization);
		let [type, token] = authorization.split(" ")
		// validamos que el tipo sea Token o Bearer.
		if (type === "Token" || type === "Bearer") {
			// confirmamos la verificación del token a través de la librería de JWT
			const openToken = jwt.verify(token, process.env.SECRET)
			console.log('openToken', openToken);
			req.user = openToken.user
			// si todo está correcto, a la petición le anclamos 
			// una propiedad adicional con el token descifrado
			// next, al invocarse, permite avanzar a la siguiente función
			next()
		} else { // si no se especifica Token o Bearer, enviamos error
			return res.status(401).json({ msg: "Unauthorized access" })
		}
	} catch (error) {
		res.json({ msg: "we have an error", error })
	}
}