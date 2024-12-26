const canViewContact = (user, contact) => {
  return user.role === "admin" || contact.userID === user.id;
};
module.exports = { canViewContact };
