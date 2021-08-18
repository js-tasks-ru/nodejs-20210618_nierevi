const Koa = require('koa');
const {categoryRouter} = require('./routes/categories');
const {productRouter} = require('./routes/products');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

app.use(categoryRouter.routes());
app.use(productRouter.routes());

module.exports = app;
