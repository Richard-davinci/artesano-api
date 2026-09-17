import mongoose from 'mongoose';
//categorias de los platos
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    trim: true,
    minlength: 3,
    maxlength: 60
  },
  description: {
    type: String,
    trim: true,
    maxlength: 300,
    default: ''
  }
});

const Category = mongoose.model('category', categorySchema);

export default Category;