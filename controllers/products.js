const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const search = "dining";

  const products = await Product.find({
    price: {
      $gt: 30,
    },
    rating: {
      $eq: 4.5,
    },
  })
    .sort("price")
    .select("name price rating");

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query; // we get a boolean

  //   console.log(featured, company);
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = {
      $regex: name,
      $options: "i",
    };
  }

  let result = Product.find(queryObject); // lets get this quick
  // sorting
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldList = fields.split(",").join(" ");
    console.log(fieldList);
    result = result.select(fieldList);
  }

  // filters
  // if (numericFilters) {
  //   const operatorMap = {
  //     ">": "$gt",
  //     ">=": "$gte",
  //     "=": "$eq",
  //     "<": "$lt",
  //     "<=": "$lte",
  //   };
  //   const regex = /\b(<|<=|=|>|>=)\b/g;
  //   let filters = numericFilters.replace(
  //     regex,
  //     (match) => `-${operatorMap[match]}-`
  //   );
  //   const options = ["price", "rating"];
  //   filters = filters.split(",").forEach((item) => {
  //     const [field, operator, value] = item.split("-");
  //     if (options.includes(field)) {
  //       queryObject[field] = {
  //         [operator]: Number(value),
  //       };
  //     }
  //   });
  // }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  const page = Number(req.query.page) || 1; // convert string to Number
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; // skip the first set

  result = result.limit(limit).skip(skip);

  const products = await result;
  console.log(queryObject);
  return res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
