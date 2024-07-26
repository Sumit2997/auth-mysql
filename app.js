require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// connet db
const DB = require("./db/connect");

const authenticateUser = require("./middleware/authentication");

//routers
const authRouter = require("./routes/auth");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packagesF

// routes
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await DB.connect(err=>{
      if(err)throw err;
      console.log('mysql connected...')
    })
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error,'hello');
  }
};

start();
