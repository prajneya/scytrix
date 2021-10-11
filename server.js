const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path')
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

app.use(express.static(path.join(__dirname, 'client/build')))

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.use('/login', (req, res) => {

	username = req.body.credentials.username
	password = req.body.credentials.password

	let db_connect = dbo.getDb("scytrix");

  db_connect
    .collection("users")
    .find({username})
  	.toArray(function (err, result) {
  		if(result.length==0){
  			return res.status(404).json({ err: "user not found" });
  		}
  		console.log(result)
		bcrypt.compare(password, result[0].password).then(isMatch => {
		  if (isMatch) {
		    // User matched
		    // Create JWT Payload
		    const payload = {
		      id: result[0].id,
		      username: result[0].username,
		    };
		    // Sign token
		    jwt.sign(
		      payload,
		      "secret",
		      {
		        expiresIn: 31556926 // 1 year in seconds
		      },
		      (err, token) => {
		        res.json({
		          success: true,
		          token: token
		        });
		      }
		    );
		  } else {
		    return res
		      .status(400)
		      .json({ passwordincorrect: "Password incorrect" });
		  }
		});
		});
});
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});

