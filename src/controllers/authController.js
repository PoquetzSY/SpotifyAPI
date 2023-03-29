const User = require('../models/user');

function getHome(req, res) {
  res.render('home');
}
// Función para renderizar la vista principal
function getIndex(req, res) {
  res.render('index');
}
// Función para renderizar la vista register
function getRegister(req, res) {
  res.render('register', { message: 'Invalid username or password'});
}

// Función para renderizar la vista login
function getLogin(req, res) {
  res.render('login', { message: 'Invalid username or password' });
}

// Función para iniciar sesión
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && password) {
      req.session.userId = user._id;
      res.redirect('login');
    }
    res.render('login', { message: 'Invalid email or password' });
  } catch (error) {
    console.log(error);
    res.render('login', { message: 'Error logging in' });
  }
}

// Función para obtener la información del usuario actual
async function getUser(req, res) {
  try {
    // Buscamos el usuario en la base de datos
    const user = await User.findById(req.user.id).select('-password');

    // Enviamos los datos del usuario como respuesta
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la información del usuario' });
  }
}

module.exports = {
  login,
  getUser,
  getIndex,
  getRegister,
  getLogin,
  getHome
};
