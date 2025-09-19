import prisma from '../utils/prisma.js';

export const getDestinations = async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({ 
      include: { 
        inventoryItems: {
          include: {
            product: true,
            category: true
          }
        }
      } 
    });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDestination = async (req, res) => {
  try {
    const { name, description } = req.body;
    const destination = await prisma.destination.create({ data: { name, description } });
    res.status(201).json(destination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const destination = await prisma.destination.update({ where: { id }, data: { name, description } });
    res.json(destination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({ where: { id } });
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
