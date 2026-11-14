import mongoose from 'mongoose';
import Dish from '../models/Dish.js';
import Category from '../models/Category.js';

//clase  platos cpntroller
class DishController {

  async getAll(req, res) {
    try {
      const { name, category, minPrice, maxPrice } = req.query;

      const filter = {};

      if (name !== undefined) {
        if (
          typeof name !== 'string' ||
          name.trim() === '' ||
          name.trim().length > 100
        ) {
          return res.status(400).json({
            message: 'El nombre de búsqueda debe tener entre 1 y 100 caracteres'
          });
        }

        const searchName = name
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        filter.name = {
          $regex: searchName,
          $options: 'i'
        };
      }

      if (category !== undefined) {
        if (
          typeof category !== 'string' ||
          !mongoose.isObjectIdOrHexString(category)
        ) {
          return res.status(400).json({
            message: 'El ID de categoría no es válido'
          });
        }

        filter.category = category;
      }

      if (minPrice !== undefined) {
        if (
          typeof minPrice !== 'string' ||
          minPrice.trim() === '' ||
          !Number.isFinite(Number(minPrice)) ||
          Number(minPrice) < 0
        ) {
          return res.status(400).json({
            message: 'El precio mínimo debe ser un número mayor o igual a cero'
          });
        }

        filter.price = {
          $gte: Number(minPrice)
        };
      }

      if (maxPrice !== undefined) {
        if (
          typeof maxPrice !== 'string' ||
          maxPrice.trim() === '' ||
          !Number.isFinite(Number(maxPrice)) ||
          Number(maxPrice) < 0
        ) {
          return res.status(400).json({
            message: 'El precio máximo debe ser un número mayor o igual a cero'
          });
        }

        if (!filter.price) {
          filter.price = {};
        }

        filter.price.$lte = Number(maxPrice);
      }

      if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        Number(minPrice) > Number(maxPrice)
      ) {
        return res.status(400).json({
          message: 'El precio mínimo no puede superar al máximo'
        });
      }

      const dishes = await Dish
        .find(filter)
        .populate('category');

      return res.status(200).json({
        message: 'success',
        data: dishes
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error al obtener los platos'
      });
    }
  }

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

      const {
        name,
        description,
        price,
        available,
        category
      } = req.body;

      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          message: 'El nombre es obligatorio y debe ser un texto'
        });
      }

      if (
        typeof description !== 'string' ||
        description.trim() === ''
      ) {
        return res.status(400).json({
          message: 'La descripción es obligatoria y debe ser un texto'
        });
      }

      if (
        typeof price !== 'number' ||
        !Number.isFinite(price) ||
        price < 0.01
      ) {
        return res.status(400).json({
          message: 'El precio debe ser un número mayor o igual a 0.01'
        });
      }

      if (
        available !== undefined &&
        typeof available !== 'boolean'
      ) {
        return res.status(400).json({
          message: 'La disponibilidad debe ser true o false'
        });
      }

      if (
        typeof category !== 'string' ||
        !mongoose.isObjectIdOrHexString(category)
      ) {
        return res.status(400).json({
          message: 'Debés enviar un ID de categoría válido'
        });
      }

      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          message: 'La categoría no existe'
        });
      }

      const dish = await Dish.create({
        name,
        description,
        price,
        available,
        category
      });

      return res.status(201).json({
        message: 'success',
        data: dish
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: error.message
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Error al crear el plato'
      });
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
          message: 'El ID del plato no es válido'
        });
      }

      const dish = await Dish.findById(id).populate('category');

      if (!dish) {
        return res.status(404).json({
          message: 'Plato no encontrado'
        });
      }

      return res.status(200).json({
        message: 'success',
        data: dish
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error al obtener el plato'
      });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
          message: 'El ID del plato no es válido'
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

      const {
        name,
        description,
        price,
        available,
        category
      } = req.body;

      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          message: 'El nombre es obligatorio y debe ser un texto'
        });
      }

      if (
        typeof description !== 'string' ||
        description.trim() === ''
      ) {
        return res.status(400).json({
          message: 'La descripción es obligatoria y debe ser un texto'
        });
      }

      if (
        typeof price !== 'number' ||
        !Number.isFinite(price) ||
        price < 0.01
      ) {
        return res.status(400).json({
          message: 'El precio debe ser un número mayor o igual a 0.01'
        });
      }

      if (typeof available !== 'boolean') {
        return res.status(400).json({
          message: 'La disponibilidad debe ser true o false'
        });
      }

      if (
        typeof category !== 'string' ||
        !mongoose.isObjectIdOrHexString(category)
      ) {
        return res.status(400).json({
          message: 'Debés enviar un ID de categoría válido'
        });
      }

      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          message: 'La categoría no existe'
        });
      }

      const dish = await Dish.findByIdAndUpdate(
        id,
        { name, description, price, available, category },
        { new: true, runValidators: true }
      ).populate('category');

      if (!dish) {
        return res.status(404).json({
          message: 'Plato no encontrado'
        });
      }

      return res.status(200).json({
        message: 'success',
        data: dish
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: error.message
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Error al actualizar el plato'
      });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!mongoose.isObjectIdOrHexString(id)) {
        return res.status(400).json({
          message: 'El ID del plato no es válido'
        });
      }

      const dish = await Dish.findByIdAndDelete(id);

      if (!dish) {
        return res.status(404).json({
          message: 'Plato no encontrado'
        });
      }

      return res.status(200).json({
        message: 'Plato eliminado correctamente',
        data: dish
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error al eliminar el plato'
      });
    }
  }
}

export default DishController;