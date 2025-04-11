import Product from '../models/products.models.js';


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const formattedProducts = {};
    
    products.forEach(product => {
      formattedProducts[product._id] = {
        itemID: product._id,
        itemName: product.itemName,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        inStock: product.inStock
      };
    });

    res.status(200).json({
      success: true,
      menuItems: formattedProducts
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

