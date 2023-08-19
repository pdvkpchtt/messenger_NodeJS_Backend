const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidV4 } = require("uuid");

module.exports.handleLogin = async (req, res) => {
  if (req.session.user && req.session.user.username) {
    console.log("logged in");
    res.json({ loggedIn: true, usernmae: req.session.user.username });
  } else res.json({ loggedIn: false });
};

module.exports.attemptLogin = async (req, res) => {
  const potentialLogin = await pool.query(
    "SELECT id, username, psshash, userid FROM users u WHERE u.username=$1",
    [req.body.username]
  );

  if (potentialLogin.rowCount > 0) {
    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].psshash
    );

    if (isSamePass) {
      //login
      req.session.user = {
        username: req.body.username,
        id: potentialLogin.rows[0].id,
        userid: potentialLogin.rows[0].userid,
      };
      res.json({ loggedIn: true, username: req.body.username });
    } else {
      // not good login
      console.log("Not good");
      res.json({ loggedIn: false, status: "Wrong username or password" });
    }
  } else {
    console.log("Not good");
    res.json({ loggedIn: false, status: "Wrong username or password" });
  }
};

module.exports.attemptRegister = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    // register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, psshash, userid) values($1,$2,$3) RETURNING id, username, userid",
      [req.body.username, hashedPass, uuidV4()]
    );
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
      userid: newUserQuery.rows[0].userid,
    };
    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "Username taken" });
  }
};
