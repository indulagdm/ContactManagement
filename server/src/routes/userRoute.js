const express = require("express");
const {
  registerUser,
  loginUser,
  loginAdmin,
  logout,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRoles = require("../middlewares/authorizedRoles");
const {
  isAdmin,
  isUserOrAdmin,
} = require("../middlewares/attributeBasedAccessControl");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-admin", loginAdmin);
router.post("/logout", authenticateToken, logout);
// router.get("/users", protectedUser, allowedUsers("admin"), getUsers);

//role based authorization
// router.get("/users", authenticateToken, authorizeRoles("admin"), getUsers);
// router.get("/users/:id", authenticateToken, authorizeRoles("admin"), getUserByID);

//attribute based authorization
router.get("/users", authenticateToken, isAdmin, getUsers);
router.get("/user/:id", authenticateToken, getUserByID);
router.put("/user/:id", authenticateToken, updateUser);
router.delete(
  "/user/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;
