const bcrypt = require("bcryptjs");
const db = require("../config/db");
const generateToken = require("../utils/generateToken");

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (insertErr, insertResult) => {
            if (insertErr) {
              return res.status(500).json({
                message: "Registration failed",
                error: insertErr.message,
              });
            }

            const token = generateToken({
              id: insertResult.insertId,
              email,
            });

            res.status(201).json({
              message: "User registered successfully",
              token,
              user: {
                id: insertResult.insertId,
                name,
                email,
              },
            });
          }
        );
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  );
};

// Login User
const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      try {
        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({
            message: "Invalid credentials",
          });
        }

        const token = generateToken({
          id: user.id,
          email: user.email,
        });

        res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  );
};

// Get Profile
const getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};