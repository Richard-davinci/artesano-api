import 'dotenv/config';
import mongoose from 'mongoose';
import Category, { categoryNameCollation } from '../models/Category.js';

try {
  if (!process.env.MONGODB_URI) throw new Error('Falta MONGODB_URI');
  await mongoose.connect(process.env.MONGODB_URI, { autoCreate: false, autoIndex: false });

  const duplicates = await Category.aggregate([
    { $group: { _id: '$name', ids: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]).collation(categoryNameCollation);

  const untrimmed = [];
  for await (const category of Category.find().select('name').lean().cursor()) {
    if (typeof category.name !== 'string' || !category.name.trim() || category.name !== category.name.trim()) {
      untrimmed.push(String(category._id));
    }
  }

  if (duplicates.length || untrimmed.length) {
    for (const group of duplicates) {
      console.error('Categorías duplicadas:', group._id, group.ids.map(String).join(', '));
    }
    if (untrimmed.length) console.error('Categorías con nombre inválido o espacios externos:', untrimmed.join(', '));
    throw new Error('Revisá esas categorías y sus platos antes de activar el índice. No se modificaron los datos.');
  }

  if (process.argv.includes('--apply')) {
    await Category.createIndexes();
    console.log('Índice único de categorías activo.');
  } else {
    console.log('No se encontraron duplicados ni nombres sin normalizar. No se modificaron los datos.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
