const router = require("express").Router();
const Produto = require("../models/Products");

// Obter todos os produtos
router.get("/getAll", async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.status(200).json(produtos);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar produtos, o servidor retornou 500.",
    });
  }
});

// Obter um produto por ID
router.get("/getById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await Produto.findById(id);
    if (!produto) {
      return res
        .status(404)
        .json({ success: false, error: "Produto não encontrado." });
    }
    res.status(200).json(produto);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar produto, verifique os dados.",
    });
  }
});

// Criar um novo produto
router.post("/create", async (req, res) => {
  const {
    name,
    description,
    color,
    weight,
    type,
    price,
  } = req.body;

  const dateAdded = new Date();

  if (!name || !price || !description) {
    return res.status(400).json({
      success: false,
      error: "Nome, preço e descrição são obrigatórios",
    });
  }

  const produto = new Produto({
    name,
    description,
    color,
    weight,
    type,
    price,
    dateAdded,
  });

  try {
    await produto.save();
    res
      .status(201)
      .json({ success: true, message: "Produto criado.", produto });
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao criar produto, verifique os dados.",
    });
  }
});

// Atualizar um produto por ID
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    color,
    weight,
    type,
    price,
    dateAdded,
  } = req.body;

  if (!name || !price || !description) {
    return res.status(400).json({
      success: false,
      error: "Nome, preço e descrição são obrigatórios",
    });
  }

  const produto = {
   name,
    description,
    color,
    weight,
    type,
    price,
    dateAdded,
  };

  try {
    const updatedProduct = await Produto.findByIdAndUpdate(id, produto, {
      new: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Produto não encontrado." });
    }

    res
      .status(200)
      .json({ success: true, message: "Produto atualizado.", updatedProduct });
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar produto, verifique os dados.",
    });
  }
});

// Deletar um produto por ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Produto.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Produto não encontrado." });
    }

    res
      .status(200)
      .json({ success: true, message: "Produto deletado.", deletedProduct });
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    res.status(500).json({
      success: false,
      error: "Erro ao deletar produto, verifique os dados.",
    });
  }
});

module.exports = router;
