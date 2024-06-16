const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Listar todas as informações de todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar todas as informações de um determinado produto usando seu ID ou Nome
router.get('/:idOrName', async (req, res) => {
  const { idOrName } = req.params;
  try {
    let product;
    if (mongoose.Types.ObjectId.isValid(idOrName)) {
      product = await Product.findById(idOrName);
    } else {
      product = await Product.findOne({ name: idOrName });
    }
    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cadastrar um novo produto
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    color: req.body.color,
    weight: req.body.weight,
    type: req.body.type,
    price: req.body.price
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar um produto existente
router.patch('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedProduct == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar um produto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.remove();
    res.json({ message: 'Deleted product' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
