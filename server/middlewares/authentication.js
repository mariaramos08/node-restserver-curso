const jwt = require('jsonwebtoken');

// ===================
// Verificar Token
// ===================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

}

// ===================
// Verificar Admin Role
// ===================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.rol !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    } else {
        next();
        return;
    }
}

// ===================
// Verificar Token IMG EN URL
// ===================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        next();
    })
}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}