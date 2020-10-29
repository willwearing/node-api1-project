console.log("server running as expected");

const express = require("express");
const shortid = require("shortid");

const generate = require("shortid").generate;

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

let users = [
  {
    id: generate(),
    name: "Will Wearing",
    bio: "The best ever",
  },
];

app.get("/users", (req, res) => {
  try {
    if (!users) {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved.",
      });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {}
});

app.post("/users", (req, res) => {
  const { name, bio } = req.body;
  try {
    if (!name || !bio) {
      res.status(400).json({
        message: "Please provide name and bio for the user",
      });
    } else {
      const newUser = { id: generate(), name, bio };
      users.push(newUser);
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  try {
    if (!user) {
      res.status(404).json({
        message: "The user with the specified ID does not exist.",
      });
    } else {
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "The user information could not be retrieved",
    });
  }
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  try {
    if (!users.find((user) => user.id === id)) {
      res.status(404).json({
        message: "The user with the specified ID does not exist.",
      });
    } else {
      users = users.filter((user) => user.id !== id);
      res
        .status(200)
        .json({ message: `User with the id: '${id}' has been deleted` });
    }
  } catch {
    res.status(500).json({
      errorMessage: "The user could not be removed",
    });
  }
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const indexOfUsers = users.findIndex((user) => user.id === id);
  try {
    if (indexOfUsers !== -1) {
      users[indexOfUsers] = { id, name, bio };
      res.status(200).json(users[indexOfUsers]);
    } else {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user.",
      });
    }
  } catch {
    res.status(500).json({
      errorMessage: "The user information could not be modified.",
    });
  }
});

//bottom one
app.get("*", (req, res) => {
  res.status(404).json({ message: "Not found!" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
