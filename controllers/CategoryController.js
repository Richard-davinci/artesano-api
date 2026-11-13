import mongoose from 'mongoose';
import Category, { categoryNameCollation } from '../models/Category.js';
import Dish from '../models/Dish.js';

// Quita espacios externos y deja solo la inicial en mayúscula.
function formatCategoryName(name) {
  const trimmedName = name.trim().toLocaleLowerCase('es');
  const [first, ...rest] = trimmedName;
  return first.toLocaleUpperCase('es') + rest.join('');
}

// Devuelve 409 cuando el nombre ya pertenece a otra categoría.
const duplicateName = (res) => res.status(409).json({
  message: 'Ya existe una categoría con ese nombre'
});

// Identifica un nombre duplicado rechazado por el índice de MongoDB.
const isDuplicateName = (error) => error.code === 11000 && error.keyPattern?.name === 1;

class CategoryController {
  // Lista todas las categorías.
  async getAll(req, res) {
    try {
      const categories = await Category.find();

      return res.status(200).json({
        message: 'success',
        data: categories
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error al obtener las categorías'
      });
    }
  }

  // Valida el ID y busca la categoría correspondiente.
  async getById(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
          message: 'El ID de la categoría no es válido'
        });
      }

      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          message: 'Categoría no encontrada'
        });
      }

      return res.status(200).json({
        message: 'success',
        data: category
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error al obtener la categoría'
      });
    }
  }

  // Valida los datos y crea una categoría si el nombre está disponible.
  async create(req, res) {
    try {
      if (
        !req.body ||
        typeof req.body !== 'object' ||
        Array.isArray(req.body)
      ) {
        return res.status(400).json({
          message: 'Debés enviar un objeto JSON'
        });
      }

      const { name, description } = req.body;

      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          message: 'El nombre es obligatorio y debe ser un texto'
        });
      }

      if (
        description !== undefined &&
        typeof description !== 'string'
      ) {
        return res.status(400).json({
          message: 'La descripción debe ser un texto'
        });
      }

      const formattedName = formatCategoryName(name);
      if (await Category.exists({ name: formattedName }).collation(categoryNameCollation)) {
        return duplicateName(res);
      }

      const category = await Category.create({
        name: formattedName,
        description
      });

      return res.status(201).json({
        message: 'success',
        data: category
      });
    } catch (error) {
      if (isDuplicateName(error)) return duplicateName(res);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: error.message
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Error al crear la categoría'
      });
    }
  }

  // Actualiza la categoría sin permitir que tome el nombre de otra.
  async update(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
          message: 'El ID de la categoría no es válido'
        });
      }

      if (
        !req.body ||
        typeof req.body !== 'object' ||
        Array.isArray(req.body)
      ) {
        return res.status(400).json({
          message: 'Debés enviar un objeto JSON'
        });
      }

      const { name, description } = req.body;

      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          message: 'El nombre es obligatorio y debe ser un texto'
        });
      }

      // PUT exige enviar ambos campos.
      // La descripción puede ser un texto vacío.
      if (typeof description !== 'string') {
        return res.status(400).json({
          message: 'Debés enviar la descripción como texto'
        });
      }

      const formattedName = formatCategoryName(name);
      if (await Category.exists({
        _id: { $ne: id },
        name: formattedName
      }).collation(categoryNameCollation)) {
        if (!(await Category.exists({ _id: id }))) {
          return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        return duplicateName(res);
      }

      const category = await Category.findByIdAndUpdate(
        id,
        { name: formattedName, description },
        { new: true, runValidators: true }
      );

      if (!category) {
        return res.status(404).json({
          message: 'Categoría no encontrada'
        });
      }

      return res.status(200).json({
        message: 'success',
        data: category
      });
    } catch (error) {
      if (isDuplicateName(error)) return duplicateName(res);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: error.message
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Error al actualizar la categoría'
      });
    }
  }

  // Elimina la categoría solo si no tiene platos asociados.
  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
          message: 'El ID de la categoría no es válido'
        });
      }

      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          message: 'Categoría no encontrada'
        });
      }

      // Sigue el criterio de carreras y materias de la cátedra.
      const dishes = await Dish.find({ category: id });

      if (dishes.length > 0) {
        return res.status(400).json({
          message: 'No se puede eliminar una categoría con platos asociados'
        });
      }

      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res.status(404).json({
          message: 'Categoría no encontrada'
        });
      }

      return res.status(200).json({
        message: 'Categoría eliminada correctamente',
        data: deletedCategory
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error al eliminar la categoría'
      });
    }
  }
}

export default CategoryController;