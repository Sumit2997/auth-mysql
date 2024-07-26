const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/connect");
const { check, validationResult } = require("express-validator");

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        (err, result) => {
          if (err) throw err;
          const payload = {
            user: {
              id: result.insertId,
            },
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      );
    }
  );
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Credentials" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    }
  );
};
module.exports = { register, login };
