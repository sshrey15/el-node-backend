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
    console.log("User", req.user)
    console.log("Categoires", category)
    const auditLog = await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        message: `User ${req.user.username} created category '${category.name}' (${category.code}).`,
        entityType: 'CATEGORY',
        entityId: category.id,
        userId: req.user.userId,
      },

      
    });
    console.log("Audit Log", auditLog)  
    res.status(201).json(category, auditLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;
    const category = await prisma.category.update({ where: { id }, data: { name, code } });

    const auditLog = await prisma.auditLog.create({
      data:{
        action: 'UPDATE',
        message: `User updated category '${category.name}' (${category.code}).`,
        entityType: 'CATEGORY',
        entityId: category.id,
        userId: req.user.userId,
      }
    })
    res.json(category, auditLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });

    const auditLog = await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        message: `'${req.user.username}' deleted category with ID ${id}.`,
        entityType: 'CATEGORY',
        entityId: id,
        userId: req.user.userId,
      }
    })
    res.json({ message: 'Category deleted', auditLog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
