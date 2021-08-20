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
  }
};

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const keywords = ctx.query.query;

  const products = await Product.find(
    { $text: { $search: keywords } },
    { score: { $meta: "textScore"} },
  ).sort( { score: { $meta: "textScore"} } );

  ctx.body = {
    products: products.map(productDTO),
  }
};
