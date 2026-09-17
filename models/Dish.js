import mongoose from 'mongoose';
//Schema de Platos
const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del plato es obligatorio'],
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'La descripción del plato es obligatoria'],
    trim: true,
    minlength: 10,
    maxlength: 500
  },
  price: {
    type: Number,
    required: [true, 'El precio del plato es obligatorio'],
    min: [0.01, 'El precio debe ser mayor o igual a 0.01']
  },
  available: {
    type: Boolean,
    default: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: [true, 'La categoría del plato es obligatoria']
  }
});

const Dish = mongoose.model('dish', dishSchema);

export default Dish;