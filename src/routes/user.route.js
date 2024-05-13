import { Router } from "express";
import { loginuser, logoutuser, refreshAccessToken, registeruser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewre.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registeruser
);
router.route("/login").post(loginuser)
router.route("/logout").post(verifyJWT,logoutuser)
router.route("/refresh-access").post(refreshAccessToken)

export default router;
