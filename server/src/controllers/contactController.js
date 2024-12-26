const Contact = require("../models/contactModel");
const validator = require("validator");
const CustomError = require("../middlewares/CustomError");

const createContact = async (req, res, next) => {
  try {
    const { contactName, contactNumber } = req.body;

    if (!contactNumber) {
      return next(new CustomError("Contact number not be empty.", 400));
    }

    const existContact = await Contact.findOne({ contactNumber });
    if (existContact) {
      return next(new CustomError("Contact number already exists.", 400));
    }

    const newContact = await Contact.create({
      userID: req.user.id,
      contactName,
      contactNumber,
    });

    if (newContact) {
      res
        .status(201)
        .json({ message: "contact added successfully.", data: newContact });
      console.log("new contact added");
    } else {
      return next(new CustomError("Contact added unsuccessful", 400));
    }
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userID: req.user.id }); //userID: req.user.id
    if (contacts.length === 0) {
      return next(new CustomError("No contact found.", 404));
    }

    res.status(200).json({ data: contacts });
  } catch (error) {
    next(error);
  }
};

const getContactByUserID = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.user.role === "admin") {
      const urlContact = await Contact.find({ userID: id });

      if (urlContact === 0) {
        return next(new CustomError("No contact found.", 404));
      }
      res.status(200).json({ data: urlContact });
    }else{
      return next(new CustomError("Unauthorized access",403));
    }
  } catch (error) {
    next(error);
  }
};

const getContactByID = async (req, res, next) => {
  try {
    const id = req.params.id;

    const contact = await Contact.findById(id);

    if (!contact) {
      return next(new CustomError("Contact details not found.", 404));
    }

    if (
      req.user.role !== "admin" &&
      String(contact.userID) !== String(req.user.id)
    ) {
      //   return res.status(403).json({ message: "Access denied" });
      return next(
        new CustomError(
          "User hasn't permission for get another user's contact details.",
          403
        )
      );
    }

    res.status(200).json({ message: "Contact Detail", data: contact });
  } catch (error) {
    next(error);
  }
};

//for admin use
const getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await Contact.find();

    if (!allContacts) {
      return next(new CustomError("No contact found.", 404));
    }

    if (req.user.role !== "admin") {
      return next(
        new CustomError("Your are not authorized to perform this action.", 403)
      );
    }
    res.status(200).json({ data: allContacts });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = await Contact.findById(id);

    if (!contact) {
      return next(new CustomError("No contact found.", 404));
    }

    if (
      req.user.role !== "admin" &&
      String(contact.userID) !== String(req.user.id)
    ) {
      return next(
        new CustomError(
          "You are not able to update other user's contact details.",
          401
        )
      );
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        userID: req.user.ID,
        contactName: req.body.contactName,
        contactNumber: req.body.contactNumber,
      },
      { new: true }
    );

    if (!updatedContact) {
      return next(new CustomError("Contact update unsuccessful."));
    }

    res.status(200).json({
      message: `${contact.contactName} updated.`,
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = await Contact.findById(id);

    if (!contact) {
      return next(new CustomError("No contact found.", 404));
    }

    if (
      req.user.role !== "admin" &&
      String(contact.userID) !== String(req.user.id)
    ) {
      return next(
        new CustomError(
          "Your are not able to delete other user's contact details."
        )
      );
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return next(new CustomError("Contact delete unsuccessful."));
    }
    res.status(200).json({ message: `${contact.contactName} deleted.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactByID,
  getContactByUserID,
  getAllContacts,
  updateContact,
  deleteContact,
};
