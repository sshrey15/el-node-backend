
import { Router } from "express";
import { getDestinations, createDestination, updateDestination, deleteDestination } from "../controllers/destinationController.js";

const router = Router();

router.route("/")
  .get(getDestinations)
  .post(createDestination);

router.route("/:id")
  .put(updateDestination)
  .delete(deleteDestination);

export default router;
