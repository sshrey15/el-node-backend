import prisma from '../utils/prisma.js';
import { cloudinary, upload } from '../utils/cloudinary.js';

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        user: true,
        inventoryItems: {
          include: {
            destination: true,
          },
        },
      },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, uniqueCode, description, categoryId, userId } = req.body;
      const getuserName = await prisma.user.findUnique({
      where: { id: req.user.userId },
    })
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Upload image to Cloudinary using a stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' }, // Optional: organizes images in a folders
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(req.file.buffer);
    });

    const product = await prisma.product.create({
      data: {
        name,
        uniqueCode,
        description,
        image: uploadResult.secure_url, // Store the public URL from Cloudinary
        categoryId,
        userId,
      },
    });

    console.log("Product", product)


    const auditLog = await prisma.auditLog.create({
      data:{
        action: 'CREATE',
        message: `User ${getuserName.username} created product '${product.name}' (${product.uniqueCode})`,
        entityId: product.id,
        entityType: 'PRODUCT',
        userId: req.user.userId
      }
    })

    res.status(201).json(product, auditLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, uniqueCode, description, categoryId } = req.body;
      const getuserName = await prisma.user.findUnique({
      where: { id: req.user.userId },
    })
    
    let imageUrl = req.body.image; // Assume image can be updated or remain the same
    
    if (req.file) {
      // If a new file is uploaded, upload it to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        uniqueCode,
        description,
        image: imageUrl,
        categoryId,
      },
    });

    const auditLog = await prisma.auditLog.create({
      data:{
        action: 'UPDATE',
        message: `User ${getuserName.username} updated product '${product.name}' (${product.uniqueCode})`,
        entityId: product.id,
        entityType: 'PRODUCT',
        userId: req.user.userId
      }
    })

    res.json(product,auditLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const getuserName = await prisma.user.findUnique({
      where: { id: req.user.userId },
    })

    const productToDelete = await prisma.product.findUnique({
      where: { id }
    })

    if (!productToDelete) {
      return res.status(404).json({ error: 'Product not found' });
    }
   
    await prisma.product.delete({ where: { id } });

    const auditLog = await prisma.auditLog.create({
      data:{
        action: 'DELETE',
        message: `User ${getuserName.username} deleted product '${productToDelete.name}'.`,
        entityId: id,
        entityType: 'PRODUCT',
        userId: req.user.userId
      }
    })
    
    res.json({ message: 'Product deleted successfully', auditLog });
  } catch (err){
    res.status(400).json({ error: err.message });
  }
};

