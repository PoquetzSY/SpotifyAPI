# Authentication App

Una aplicación que permite a los usuarios registrarse, iniciar sesión y cerrar sesión. Usa MongoDB para almacenar los detalles del usuario y su estado de inicio de sesión.

## Estructura del Proyecto

* `src/`: Contiene todo el código fuente de la aplicación.
* `index.js`: Punto de entrada de la aplicación.
* `config.js`: Archivo de configuración de la aplicación.
* `models/`: Contiene los modelos de Mongoose para la base de datos.
  * `user.js`: Modelo de usuario.
* `routes/`: Contiene las rutas de la aplicación.
  * `auth.js`: Rutas de autenticación (registro, inicio de sesión y cierre de sesión).
* `views/`: Contiene las vistas de la aplicación.
  * `login.ejs`: Vista de inicio de sesión.
  * `register.ejs`: Vista de registro.
* `.env`: Archivo de variables de entorno.
* `package.json`: Archivo de configuración de npm.

## Estructura de la Base de Datos

- `authentication_app`: Base de datos de la aplicación.
  - `users`: Colección de usuarios.

## Dependencias

- express: Framework para Node.js que permite crear aplicaciones web.
- mongoose: Biblioteca de Node.js que permite interactuar con MongoDB.
- express-session: Biblioteca de Node.js que permite crear sesiones de usuario.
- bcrypt: Biblioteca de Node.js que permite encriptar contraseñas.
- connect-flash: Biblioteca de Node.js que permite mostrar mensajes al usuario.

## Instalación

1. Clonar el repositorio:

https://github.com/Ubyquit/authentication-app.git


2. Instalar las dependencias:

npm install express mongoose express-session bcrypt connect-flash


3. Crear el archivo `.env` con las siguientes variables:

SESSION_SECRET=una-contraseña-secreta
MONGODB_URI=mongodb://localhost:27017/authentication_app


4. Iniciar la aplicación:

npm start


5. La aplicación estará disponible en `http://localhost:3000`.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.


