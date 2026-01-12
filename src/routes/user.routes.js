import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

// router.post("/register", registerUser);
router.route("/register").post(
    upload.fields([ // middlewares just before execution of any method
        {
            name:"avater",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
export default router;
