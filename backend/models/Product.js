const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number },
    nome: { type: String, required: true, trim: true },
    preco: { type: Number, required: true, min: 0 },
    descricao: { type: String },
    categoria: { type: String, default: 'Geral' },
    emEstoque: { type: Boolean, default: true },
    dataCriacao: { type: Date, default: Date.now }
},
    { timestamps: true } // Adiciona timestamps automáticos (createdAt e updatedAt)
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
