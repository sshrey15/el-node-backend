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

    const auditLog = await prisma.auditLog.create({
      data:{
        action: 'CREATE',
        message: `User created destination ${destination.name}`,
        entityType: 'DESTINATION',
        entityId: destination.id,
        userId: req.user.userId,
      }
    })
    res.status(201).json(destination, auditLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const destination = await prisma.destination.update({ where: { id }, data: { name, description } });

        const getuserName = await prisma.user.findUnique({
      where: { id: req.user.userId },
    })

    const auditLog = await prisma.auditLog.create({
      data:{
        action:'UPDATE',
        message: `User ${getuserName.username} updated destination ${destination.name}`,
        entityType: 'DESTINATION',
        entityId: destination.id,
        userId: req.user.userId,
      }
    })
    res.json(destination, auditLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
        const getuserName = await prisma.user.findUnique({
      where: { id: req.user.userId },
    })

    const destinationToDelete = await prisma.user.findUnique({
      where: {id}
    })
    
    await prisma.destination.delete({ where: { id } });

    const auditLog = await prisma.auditLog.create({
      data:{
      action: 'DELETE',
      message: `User ${getuserName.username} deleted destination with ID ${destinationToDelete.name}`,
      entityType: 'DESTINATION',
      entityId: id,
      userId: req.user.userId,
      }
    })

    res.json({ message: 'Destination deleted', auditLog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
