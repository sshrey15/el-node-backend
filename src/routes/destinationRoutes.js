
import { Router } from "express";
import { getDestinations, createDestination, updateDestination, deleteDestination } from "../controllers/destinationController.js";
import { authenticate } from "../middlewares/auth.js";
const router = Router();

router.route("/")
  .get(getDestinations)
  .post(authenticate, createDestination);

router.route("/:id")
  .put(authenticate, updateDestination)
  .delete(authenticate, deleteDestination);

export default router;
