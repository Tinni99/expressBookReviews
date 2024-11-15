const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Both username and password are required" });
    }
  
    // Check if the username already exists
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Add the new user to the 'users' array
    users.push({ username, password });
  
    // Send success response
    return res.status(201).json({ message: "User successfully registered. You can now login." });
  });
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    axios.get('https://janarhitaza-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/') 
      .then(response => {
        const booksFromAPI = response.data; // Assuming the response contains the books data
        return res.status(200).json(booksFromAPI);
      })
      .catch(error => {
        return res.status(500).json({ message: "Failed to fetch books", error: error.message });
      });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  
    // Make a request using Axios
    axios.get(`https://janarhitaza-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/${isbn}`) 
      .then(response => {
        const bookDetails = response.data; // Assuming the response contains the book details
        return res.status(200).json(bookDetails); // Send book details as JSON response
      })
      .catch(error => {
        // Handle any errors (e.g., book not found, network issues)
        return res.status(500).json({ message: "Failed to fetch book details", error: error.message });
      });
  });
  
// Get book details based on author
// Fetch book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Retrieve author name from request parameters

  // Make a request using Axios
  axios.get(`https://janarhitaza-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai?author=${author}`) 
    .then(response => {
      const booksByAuthor = response.data; // Assuming the response contains the book details
      return res.status(200).json(booksByAuthor); // Send books as JSON response
    })
    .catch(error => {
      // Handle any errors (e.g., no books found by the author, network issues)
      return res.status(500).json({ message: "Failed to fetch books by author", error: error.message });
    });
});


// Get all books based on title
// Fetch book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Retrieve title from request parameters

  // Make a request using Axios
  axios.get(`https://janarhitaza-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai?title=${title}`) 
    .then(response => {
      const booksByTitle = response.data; // Assuming the response contains the book details
      return res.status(200).json(booksByTitle); // Send books as JSON response
    })
    .catch(error => {
      // Handle any errors (e.g., no books found by the title, network issues)
      return res.status(500).json({ message: "Failed to fetch books by title", error: error.message });
    });
});
  
//  Get book review
// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Find the book with the matching ISBN
    const book = books[isbn];
  
    // If the book exists, return the reviews
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      // If no book is found, send a 404 response
      return res.status(404).json({ message: "Book not found" });
    }
  });


module.exports.general = public_users;
