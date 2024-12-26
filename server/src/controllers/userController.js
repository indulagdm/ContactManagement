const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/userModel");
const CustomError = require("../middlewares/CustomError");

const registerUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      //   return res.status(400).json({ message: "all fields are required!" });
      return next(new CustomError("All fields are required.", 400));
    }

    if (!validator.isEmail(email)) {
      //   return res
      //     .status(400)
      //     .json({ message: `Email is not in correct order.` });
      return next(new CustomError("Email is not in correct order.", 400));
    }

    const existUser = await User.findOne({ email: email });
    if (existUser) {
      //   return res
      //     .status(400)
      //     .json({ message: "User already registered system." });
      return next(new CustomError("User already registered.", 400));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashPassword, role });

    if (newUser) {
      res
        .status(201)
        .json({ message: "User registration successfully.", data: newUser });
      console.log(`new user created.`);
    } else {
      //   return res
      //     .status(400)
      //     .json({ message: "User registration unsuccessfully." });
      return next(new CustomError("User registration unsuccessful.", 400));
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new CustomError("All fields are required.", 400));
    }

    if (!validator.isEmail(email)) {
      //   return res
      //     .status(400)
      //     .json({ message: "Email is not in correct pattern." });
      return next(new CustomError("Email is not in correct order.", 400));
    }

    const existUser = await User.findOne({ email: email });

    if (!existUser) {
      return next(new CustomError("User not registered.", 404));
    }

    const isMatchPassword = await bcrypt.compare(password, existUser.password);

    if (!isMatchPassword) {
      return next(
        new CustomError(
          "Password doesn't match. Please re enter password.",
          400
        )
      );
    }

    if (existUser.role === "admin") {
      if (existUser && isMatchPassword) {
        const accessToken = jwt.sign(
          { id: existUser._id, role: existUser.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Login Successfully.",
          data: existUser.email,
          accessToken,
        });
        console.log(`${existUser.role} logged.`);
      } else {
        return next(
          new CustomError("Login unsuccessful. Please re login.", 400)
        );
      }
    } else if (existUser.role === "user") {
      if (existUser && isMatchPassword) {
        const accessToken = jwt.sign(
          { id: existUser._id, role: existUser.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Login Successfully.",
          data: existUser.email,
          accessToken,
        });
        console.log(`${existUser.role} logged.`);
      } else {
        return next(
          new CustomError("Login unsuccessful. Please re login.", 400)
        );
      }
    } else {
      return next(new CustomError("You can't access", 401));
    }
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new CustomError("All fields are required.", 400));
    }

    if (!validator.isEmail(email)) {
      //   return res
      //     .status(400)
      //     .json({ message: "Email is not in correct pattern." });
      return next(new CustomError("Email is not in correct order.", 400));
    }

    const existUser = await User.findOne({ email: email });

    if (!existUser) {
      return next(new CustomError("User not registered.", 404));
    }

    const isMatchPassword = await bcrypt.compare(password, existUser.password);

    if (!isMatchPassword) {
      return next(
        new CustomError(
          "Password doesn't match. Please re enter password.",
          400
        )
      );
    }

    if (existUser.role === "admin") {
      if (existUser && isMatchPassword) {
        const accessToken = jwt.sign(
          { id: existUser._id, role: existUser.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Login Successfully.",
          data: existUser.email,
          accessToken,
        });
        console.log(`${existUser.role} logged.`);
      } else {
        return next(
          new CustomError("Login unsuccessful. Please re login.", 400)
        );
      }
    } else {
      return next(new CustomError("You can't access", 401));
    }
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during logout." });
  }
};

const getUsers = async (req, res, next) => {
  try {
    const findUsers = await User.find({ role: "user" });
    if (!findUsers) {
      return next(new CustomError("No data founded.", 400));
    }
    res.status(200).json({ message: "Data is founded.", data: findUsers });
  } catch (error) {
    next(error);
  }
};

const getUserByID = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existUser = await User.findById(id);

    if (!existUser) {
      return next(new CustomError("No data found.", 400));
    }
    res.status(200).json({ message: "Record found.", data: existUser });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return next(new CustomError("No user found.", 404));
    }

    if (req.user.role !== "admin" && String(user.id) !== String(req.user.id)) {
      return next(
        new CustomError("You can not permission for perform this action.", 400)
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        id: req.user.id,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(new CustomError("User profile update unsuccessful.", 400));
    }

    res
      .status(200)
      .json({ message: `${user.email} profile update successfully.` });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return next(new CustomError("User not found.", 404));
    }

    if (req.user.role !== "admin") {
      return next(
        new CustomError("You haven't permission for perform this action.", 400)
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return next(new CustomError("User deleted unsuccessful.", 400));
    }
    res.status(200).json({ message: `${user.email} deleted.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  logout,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
};
