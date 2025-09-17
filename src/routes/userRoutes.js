
import { Router } from "express";
import { register, login, getUsers, updateUser, deleteUser } from "../controllers/userController.js";

const router = Router();

router.route("/")
	.get(getUsers);

router.route("/register")
	.post(register);

router.route("/login")
	.post(login);

router.route("/:id")
	.put(updateUser)
	.delete(deleteUser);

export default router;
