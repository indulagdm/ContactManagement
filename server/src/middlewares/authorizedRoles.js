function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You haven't permission for this action." });
    }
    next();
  };
}

module.exports = authorizeRoles;


// const allowedUsers = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return res.status(401).json({ message: "User not Authorized." });
//     }
//     next();
//   };
// };

// module.exports = allowedUsers
