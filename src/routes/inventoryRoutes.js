import { Router } from 'express';
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../controllers/inventoryController.js';
import { authenticate } from '../middlewares/auth.js';
const router = Router();

router.get('/', getInventoryItems);
router.post('/',authenticate, createInventoryItem);
router.put('/:id',authenticate, updateInventoryItem);
router.delete('/:id',authenticate, deleteInventoryItem);

export default router;
