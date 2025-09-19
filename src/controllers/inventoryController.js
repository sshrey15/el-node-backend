import prisma from '../utils/prisma.js';

// @desc    Get all inventory items
// @route   GET /api/inventory
export const getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      include: { product: true, destination: true, category: true },
    });
    res.json(inventoryItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create a new inventory item with an auto-generated unique code
// @route   POST /api/inventory
export const createInventoryItem = async (req, res) => {
  try {
    const { 
        status, 
        yearOfPurchase, 
        productId, 
        destinationId, 
        categoryId 
    } = req.body;

    // 1. Validate incoming data
    if (!yearOfPurchase || !productId || !categoryId) {
        return res.status(400).json({ error: 'Missing required fields: yearOfPurchase, productId, categoryId' });
    }

    // 2. Fetch related product and category data to build the code
    const product = await prisma.product.findUnique({ 
        where: { id: productId },
        select: { uniqueCode: true }
    });
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { code: true }
    });

    if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
    }
    if (!category) {
        return res.status(404).json({ error: 'Category not found.' });
    }
//shrey
    // 3. Determine the serial number by counting existing items for this product
    const itemCount = await prisma.inventoryItem.count({
        where: { productId: productId }
    });
    const serialNumber = (itemCount + 1).toString().padStart(3, '0'); // Formats as 001, 002, etc.

    // 4. Construct the unique code
    const yearShort = yearOfPurchase.toString().slice(-2); // Get last 2 digits
    const generatedUniqueCode = `EHS-${category.code}-${product.uniqueCode}-${yearShort}-${serialNumber}`;
    // 5. Create the new inventory item
    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        uniqueCode: generatedUniqueCode, // Use the auto-generated code
        status,
        yearOfPurchase,
        productId,
        destinationId,
        categoryId,
      },
    });
    res.status(201).json(inventoryItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update an inventory item
// @route   PUT /api/inventory/:id
export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const inventoryItem = await prisma.inventoryItem.update({
      where: { id },
      data,
    });
    res.json(inventoryItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.inventoryItem.delete({ where: { id } });
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

