import categoryRouter from './categoryRouter.js';
import dishRouter from './dishRouter.js';

const routerAPI = (app) => {
  app.use('/api/categories', categoryRouter);
  app.use('/api/dishes', dishRouter);
};

export default routerAPI;