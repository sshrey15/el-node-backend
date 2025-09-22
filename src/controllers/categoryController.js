import prisma from '../utils/prisma.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ include: { products: true } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, code } = req.body;
    const category = await prisma.category.create({ data: { name, code } });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        message: `User '${req.user.username}' created category '${category.name}' (${category.code}).`,
        entityType: 'CATEGORY',
        entityId: category.id, // <-- FIX: Added the ID of the newly created category
        userId: req.user.id,
      },
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;
    const category = await prisma.category.update({ where: { id }, data: { name, code } });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
