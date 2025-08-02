const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
const routes = require("./routes");

app.use(routes);

app.use(cors());

app.use("/", mainRouter);

app.post("/signin", login);
app.post("/signup", createUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
