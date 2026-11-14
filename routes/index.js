import categoryRouter from './categoryRouter.js';
import dishRouter from './dishRouter.js';
import authRouter from './authRouter.js';

const routerAPI = (app) => {
  app.use('/api/categories', categoryRouter);
  app.use('/api/dishes', dishRouter);
  app.use('/api/auth', authRouter);
};

export default routerAPI;
