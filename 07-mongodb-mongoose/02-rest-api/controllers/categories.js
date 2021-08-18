const Category = require('../models/Category');

const subcategoryDTO = function (doc) {
  return {
    id: doc._id,
    title: doc.title,
  }
}

const categoryDTO = function (doc) {
  return {
    id: doc._id,
    title: doc.title,
    subcategories: doc.subcategories.map(subcategoryDTO),
  }
}

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});

  ctx.body = {
    categories: categories.map(categoryDTO),
  };
};
