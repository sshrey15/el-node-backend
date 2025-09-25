import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { upload } from '../utils/cloudinary.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// The upload.single() middleware processes the 'image' field from the form
router.get('/',  getProducts);
router.post('/', authenticate, upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;