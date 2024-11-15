const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find(user => user.username === username && user.password === password);
    return user ? true : false;  // Return true if a matching user is found, otherwise false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is valid and password matches
  if (isValid(username) && authenticatedUser(username, password)) {
    // Generate a JWT token
    const accessToken = jwt.sign({ username }, 'accessSecret', { expiresIn: '1h' });

    // Store the access token in the session (this could be optional, as JWT is self-contained)
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Login successful", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Get the review from the query parameters
  const review = req.query.review;

  // Get the username from the session
  const username = req.session.authorization ? req.session.authorization.username : null;

  // Check if the user is logged in
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Check if a review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already reviewed the book
  if (book.reviews[username]) {
    // Modify the existing review
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // Add the new review
    book.reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Get the username from the session
  const username = req.session.authorization ? req.session.authorization.username : null;

  // Check if the user is logged in
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has reviewed the book
  if (book.reviews[username]) {
    // Delete the review
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
