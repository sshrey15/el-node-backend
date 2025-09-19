import prisma from '../utils/prisma.js';

export const getInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      include: { product: true, destination: true },
    });
    res.json(inventoryItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const { uniqueCode, status, yearOfPurchase, productId, destinationId } = req.body;
    const inventoryItem = await prisma.inventoryItem.create({
      data: { uniqueCode, status, yearOfPurchase, productId, destinationId },
    });
    res.status(201).json(inventoryItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.inventoryItem.delete({ where: { id } });
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
