const express = require("express");
const validateForm = require("../controllers/validateForm");
const authController = require("../controllers/authController");
const { rateLimiter } = require("../controllers/rateLimiter");
const router = express.Router();

router
  .route("/login")
  .get(authController.handleLogin)
  .post(validateForm, rateLimiter(30, 4), authController.attemptLogin);

router.post(
  "/register",
  validateForm,
  rateLimiter,
  authController.attemptRegister
);

module.exports = router;
