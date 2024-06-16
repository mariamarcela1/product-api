const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Definir o modelo do Produto
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  color: String,
  weight: Number,
  type: String,
  price: Number,
  dateCreated: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Rota: Listar todos os produtos
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Rota: Listar um produto por ID ou Nome
app.get('/products/:identifier', async (req, res) => {
  const identifier = req.params.identifier;
  try {
    let product;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier);
    } else {
      product = await Product.findOne({ name: identifier });
    }
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.json(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Rota: Cadastrar um novo produto
app.post('/products', async (req, res) => {
  const productData = req.body;
  const newProduct = new Product(productData);
  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Rota: Atualizar um produto existente
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).send('Product not found');
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Rota: Deletar um produto
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).send('Product not found');
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
