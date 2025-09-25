import { Router } from 'express';
import { getAuditLogs, deleteAuditLog } from '../controllers/auditlogController.js';


const router = Router();


router.route("/").get(getAuditLogs);
router.route("/:id").delete(deleteAuditLog);
export default router;