const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();
router.post("/signup", authController.signup);
router.get("/signup", authController.getsignup);
router.post("/login", authController.login);
router.get("/login", authController.getlogin);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get("/resetPassword/:token", (req, res) => {
  res.render("forgotPassword");
});

// Protect all routes after this middleware

router.use(authController.protect);
router.patch("/updateMyPassword", authController.updatePassword);
// router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
// userController.uploadUserPhoto,
// userController.resizeUserPhoto,

router.use(authController.restrictTo("mgr"));
// router.delete("/delete", userController.deleteuser);

////////////////////////////
router
  .route("/")
  .get(userController.createuser)
  .post(userController.createUser);
router.route("/getAll").get(userController.getAllemp);
// .post(
//   authController.protect,
//   authController.restrictTo("mgr"),
//   userController.createUser
// );

////////////////////////////

// router
//   .route("/")
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router.route("/get/:name").get(userController.getUserName);
module.exports = router;
