import expres from "express";
import { login, signup } from "../controllers/auth.controller";

const router = expres.Router();

router.post("/login", login);
router.post("/signup", signup);

export default router;
