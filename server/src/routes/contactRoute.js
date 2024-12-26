const express = require("express");
const {
  createContact,
  getContacts,
  getContactByID,
  getContactByUserID,
  getAllContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const authenticateToken = require("../middlewares/authenticateToken");
const authorizeRoles = require("../middlewares/authorizedRoles");

const router = express.Router();

router.post("/createContact", authenticateToken, createContact);
router.get("/getContacts", authenticateToken, getContacts);
router.get("/getContact/:id", authenticateToken, getContactByID);
router.get("/getContactByUserID/:id", authenticateToken, getContactByUserID);
router.get("/getAllContacts", authenticateToken, getAllContacts);
router.put("/updateContact/:id", authenticateToken, updateContact);
router.delete("/deleteContact/:id", authenticateToken, deleteContact);

module.exports = router;
