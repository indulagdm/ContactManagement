const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract Bearer token
  if (!token) return res.status(401).json({ message: "Access token required" });

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Invalid token, Please login again!..." });
      req.user = user; // Attach user info to request
      next();
    });
  } catch (error) {
    next(error);
  }
}

module.exports = authenticateToken;

// const protectedUser = async (req, res, next) => {
//   try {
//     const readingToken = req.headers.authorization;
//     let token;
//     if (readingToken && readingToken.startsWith("Bearer")) {
//       token = readingToken.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(400).json({ message: "No token found." });
//     }

//     //decode token
//     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     console.log(decodeToken);

//     //find user according to token
//     const user = await User.findById(decodeToken.id);

//     if (!user) {
//       return res.status(400).json({ message: "User not found in token." });
//     }

//     req.user = user;
//     // console.log(findUser);
//     next();

//   } catch (error) {
//     return res.status(500).json({ error });
//   }
// };

//module.exports = protectedUser
