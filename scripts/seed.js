import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Dish from '../models/Dish.js';

dotenv.config();

const menu = [
  {
    name: 'Pizzas',
    description: 'Pizzas grandes con distintas combinaciones de ingredientes',
    dishes: [
      {
        name: 'Pizza de muzzarella',
        description: 'Salsa de tomate, muzzarella, aceitunas y orégano.',
        price: 12000
      },
      {
        name: 'Pizza napolitana',
        description: 'Muzzarella, rodajas de tomate, ajo, aceitunas y orégano.',
        price: 14000
      },
      {
        name: 'Pizza de jamón y morrones',
        description: 'Salsa de tomate, muzzarella, jamón cocido y morrones.',
        price: 15500
      },
      {
        name: 'Pizza fugazzeta',
        description: 'Muzzarella, abundante cebolla y un toque de orégano.',
        price: 14500
      },
      {
        name: 'Pizza cuatro quesos',
        description: 'Salsa de tomate, muzzarella, provolone, roquefort y parmesano.',
        price: 17000
      }
    ]
  },
  {
    name: 'Hamburguesas',
    description: 'Hamburguesas en pan con acompañamiento de papas fritas',
    dishes: [
      {
        name: 'Hamburguesa clásica',
        description: 'Medallón de carne, lechuga, tomate y mayonesa. Con papas fritas.',
        price: 10500
      },
      {
        name: 'Hamburguesa con cheddar y panceta',
        description: 'Medallón de carne, cheddar, panceta y salsa barbacoa. Con papas fritas.',
        price: 13000
      },
      {
        name: 'Hamburguesa doble',
        description: 'Dos medallones de carne, cheddar, cebolla y pepinillos. Con papas fritas.',
        price: 15500
      },
      {
        name: 'Hamburguesa completa',
        description: 'Medallón de carne, jamón, queso, huevo, lechuga y tomate. Con papas fritas.',
        price: 14000
      },
      {
        name: 'Hamburguesa de lentejas',
        description: 'Medallón de lentejas, rúcula, tomate y cebolla caramelizada. Con papas fritas.',
        price: 11000
      }
    ]
  },
  {
    name: 'Milanesas XXL',
    description: 'Milanesas de carne para compartir, acompañadas de papas fritas',
    dishes: [
      {
        name: 'Milanesa XXL clásica',
        description: 'Milanesa de carne XXL con limón y una porción de papas fritas.',
        price: 23000
      },
      {
        name: 'Milanesa XXL napolitana',
        description: 'Milanesa de carne XXL con salsa de tomate, jamón, muzzarella y papas fritas.',
        price: 28000
      },
      {
        name: 'Milanesa XXL a caballo',
        description: 'Milanesa de carne XXL con dos huevos fritos y papas fritas.',
        price: 26000
      },
      {
        name: 'Milanesa XXL con cheddar y panceta',
        description: 'Milanesa de carne XXL cubierta con cheddar y panceta. Con papas fritas.',
        price: 30000
      }
    ]
  },
  {
    name: 'Empanadas',
    description: 'Empanadas al horno; precio por unidad',
    dishes: [
      {
        name: 'Empanada de carne',
        description: 'Empanada al horno rellena de carne, cebolla, morrón y huevo. Precio por unidad.',
        price: 2200
      },
      {
        name: 'Empanada de carne picante',
        description: 'Empanada al horno de carne con cebolla, morrón y ají picante. Precio por unidad.',
        price: 2300
      },
      {
        name: 'Empanada de pollo',
        description: 'Empanada al horno rellena de pollo, cebolla y morrón. Precio por unidad.',
        price: 2100
      },
      {
        name: 'Empanada de jamón y queso',
        description: 'Empanada al horno rellena de jamón cocido y muzzarella. Precio por unidad.',
        price: 2000
      },
      {
        name: 'Empanada de humita',
        description: 'Empanada al horno con choclo, cebolla y salsa blanca. Precio por unidad.',
        price: 2000
      },
      {
        name: 'Empanada caprese',
        description: 'Empanada al horno con muzzarella, tomate y albahaca. Precio por unidad.',
        price: 2100
      }
    ]
  },
  {
    name: 'Pastas',
    description: 'Pastas con diferentes rellenos y salsas; precio por porción',
    dishes: [
      {
        name: 'Ravioles de ricota con filetto',
        description: 'Ravioles rellenos de ricota con salsa de tomate y albahaca.',
        price: 13500
      },
      {
        name: 'Ravioles de verdura con estofado',
        description: 'Ravioles de verdura con salsa de tomate y carne de estofado.',
        price: 16000
      },
      {
        name: 'Sorrentinos de jamón y queso con crema',
        description: 'Sorrentinos rellenos de jamón y queso, acompañados de salsa de crema.',
        price: 15500
      },
      {
        name: 'Sorrentinos de calabaza con cuatro quesos',
        description: 'Sorrentinos de calabaza con salsa de muzzarella, parmesano, roquefort y provolone.',
        price: 17000
      },
      {
        name: 'Ñoquis de papa con bolognesa',
        description: 'Ñoquis de papa con salsa de tomate, carne picada y verduras.',
        price: 14000
      },
      {
        name: 'Ñoquis de papa con salsa rosa',
        description: 'Ñoquis de papa acompañados de una combinación de salsa de tomate y crema.',
        price: 13000
      },
      {
        name: 'Canelones de verdura con salsa mixta',
        description: 'Canelones rellenos de verdura y ricota con salsa blanca y filetto.',
        price: 15000
      },
      {
        name: 'Canelones de carne con salsa blanca',
        description: 'Canelones rellenos de carne y verduras, cubiertos con salsa blanca y queso gratinado.',
        price: 16500
      },
      {
        name: 'Tallarines con pesto',
        description: 'Tallarines acompañados de pesto de albahaca, ajo, nueces, queso y aceite.',
        price: 12500
      },
      {
        name: 'Tallarines con estofado',
        description: 'Tallarines con salsa de tomate y una porción de carne de estofado.',
        price: 15000
      }
    ]
  }
];

const seed = async () => {
  let createdCategories = 0;
  let createdDishes = 0;
  let skippedDishes = 0;

  try {
    await connectDB();

    for (const group of menu) {
      let category = await Category.findOne({
        name: group.name
      });

      if (!category) {
        category = await Category.create({
          name: group.name,
          description: group.description
        });

        createdCategories++;
      }

      for (const item of group.dishes) {
        const existingDish = await Dish.findOne({
          name: item.name,
          category: category._id
        });

        if (existingDish) {
          skippedDishes++;
          continue;
        }

        await Dish.create({
          name: item.name,
          description: item.description,
          price: item.price,
          available: true,
          category: category._id
        });

        createdDishes++;
        console.log(`Creado: ${item.name}`);
      }
    }

    console.log('\nCarga finalizada');
    console.log(`Categorías creadas: ${createdCategories}`);
    console.log(`Platos creados: ${createdDishes}`);
    console.log(`Platos existentes omitidos: ${skippedDishes}`);
  } catch (error) {
    console.error('La carga no se pudo completar:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();