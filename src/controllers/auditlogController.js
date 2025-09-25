import  prisma  from '../utils/prisma.js';

export const getAuditLogs = async (req,res) => {
    try{
        const auditLogs = await prisma.auditLog.findMany();
        res.json(auditLogs);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}


export const deleteAuditLog = async (req,res) => {
    try{
        const {id} = req.params;
        await prisma.auditLog.delete({where:{id}});
        res.json({message: 'Audit log deleted successfully'});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}
