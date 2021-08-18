const Router = require('koa-router');
const {productById, productsBySubcategory, productList} = require('../controllers/products');

const productRouter = new Router({prefix: '/api'});

productRouter.get('/products/:id', productById);
productRouter.get('/products', productsBySubcategory, productList);

module.exports.productRouter = productRouter;