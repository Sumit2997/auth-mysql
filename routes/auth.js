const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { login, register } = require("../controllers/auth");
const auth = require("../middleware/authentication");

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").isLength({ min: 6 }),
  ],
  register
);
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);
router.get('/profile', auth, (req, res) => {
  db.query('SELECT username,email FROM users WHERE id = ?', [req.user.id], (err, result) => {
      if (err) throw err;
      res.json(result[0]);
  });
});


module.exports = router;
