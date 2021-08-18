const Router = require('koa-router');
const {categoryList} = require('../controllers/categories')

const categoryRouter = new Router({prefix: '/api'});

categoryRouter.get('/categories', categoryList);

module.exports.categoryRouter = categoryRouter;