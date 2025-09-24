import  prisma  from '../utils/prisma.js';

export const getAuditLogs = async (req,res) => {
    try{
        const auditLogs = await prisma.auditLog.findMany();
        res.json(auditLogs);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

