const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const serialize = require("serialize-javascript");

const app = express();
app.use(bodyParser.json());

// ❌ Hardcoded Secret
const DB_PASSWORD = "SuperSecretPassword123";

// ❌ SQL Injection
app.get("/user", (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  res.send("Query executed: " + query);
});

// ❌ Command Injection
app.get("/ping", (req, res) => {
  const host = req.query.host;
  exec("ping -c 1 " + host, (error, stdout) => {
    res.send(stdout);
  });
});

// ❌ eval usage
app.post("/run", (req, res) => {
  const code = req.body.code;
  const result = eval(code);
  res.send(result.toString());
});

// ❌ XSS via unsafe serialization
app.get("/serialize", (req, res) => {
  const input = req.query.input;
  const output = serialize(input);
  res.send(output);
});

app.listen(3000, () => {
  console.log("Vulnerable app running on port 3000");
});
