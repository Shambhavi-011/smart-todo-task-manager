const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  const checkUserQuery = "SELECT * FROM users WHERE email = ?";

  db.query(checkUserQuery, [cleanEmail], async (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({
        success: false,
        message: "Database error while checking user",
        error: checkErr.message
      });
    }

    if (checkResult.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(cleanPassword, 10);

      const insertUserQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(
        insertUserQuery,
        [name.trim(), cleanEmail, hashedPassword],
        (insertErr, insertResult) => {
          if (insertErr) {
            return res.status(500).json({
              success: false,
              message: "User registration failed",
              error: insertErr.message
            });
          }

          const token = generateToken({
            id: insertResult.insertId,
            email: cleanEmail
          });

          return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
              id: insertResult.insertId,
              name: name.trim(),
              email: cleanEmail
            }
          });
        }
      );
    } catch (hashError) {
      return res.status(500).json({
        success: false,
        message: "Password hashing failed",
        error: hashError.message
      });
    }
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  const findUserQuery = "SELECT * FROM users WHERE email = ?";

  db.query(findUserQuery, [cleanEmail], async (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while logging in",
        error: err.message
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email not found"
      });
    }

    const user = result[0];

    try {
      if (!user.password) {
        return res.status(500).json({
          success: false,
          message: "Stored password hash is missing"
        });
      }

      const isPasswordMatch = await bcrypt.compare(cleanPassword, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Wrong password"
        });
      }

      const token = generateToken({
        id: user.id,
        email: user.email
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (compareError) {
      return res.status(500).json({
        success: false,
        message: "Password comparison failed",
        error: compareError.message
      });
    }
  });
};

const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};