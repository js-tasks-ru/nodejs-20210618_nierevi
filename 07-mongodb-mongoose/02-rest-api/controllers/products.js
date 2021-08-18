const { Types: { ObjectId: { isValid }}} = require('mongoose')
const Product = require('../models/Product');

const productDTO = function (doc) {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    price: doc.price,
    category: doc.category,
    subcategory: doc.subcategory,
    images: doc.images,
  };
};

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.query.subcategory;
    
  if(subcategoryId) {
    if(!isValid(subcategoryId)) {
      ctx.throw(400, 'Invalid subcategory id');
    }

    const categories = await Product.find({subcategory: subcategoryId});

    if(!categories) {
      ctx.throw(404, 'There is no product with such id');
    }

    ctx.body = {
      products: categories.map(productDTO),
    }
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  ctx.body = {
    products: products.map(productDTO),
  };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
    
  if(!isValid(productId)) {
    ctx.throw(400, 'Invalid product id');
  }
    
  const product = await Product.findById(productId);
    
  if(!product) {
    ctx.throw(404, 'There is no product with such id');
  }
    
  ctx.body = {
    product: productDTO(product),
  }
};

