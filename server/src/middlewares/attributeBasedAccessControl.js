const Contact = require("../models/contactModel");

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const isUserOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  if (req.user.role !== 'admin' && String(contact.userID) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  next();
};

module.exports = { isAdmin, isUserOrAdmin };
