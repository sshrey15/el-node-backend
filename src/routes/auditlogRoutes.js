import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditlogController.js';


const router = Router();


router.route("/").get(getAuditLogs);
export default router;