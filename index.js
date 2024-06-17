const express = require("express");
const mongoose = require("mongoose");
const server = express();

const productRoutes = require("./routes/productRoutes");

server.use(
  express.urlencoded({
    extended: true,
  })
);

server.use(express.json());

server.use("/", productRoutes);

const DB_USER = 'mariamarcela';
const DB_PASSWORD = encodeURIComponent('a');

// Conexão com MongoDB Atlas
mongoose.connect('mongodb+srv://'+ DB_USER + ':' + DB_PASSWORD + '@cluster0.jheny4w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Eventos de conexão
mongoose.connection.on('connected', () => {
    console.log('Conectado ao MongoDB!');
});

mongoose.connection.on('error', (err) => {
    console.error('Erro de conexão com MongoDB:', err);
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
