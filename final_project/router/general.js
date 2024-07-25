const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
   const { username, password } = req.body;
   console.log(username);
   const userExists = users.some(user => user.username === username);

   if (userExists) {
     console.log("Username already exists"); // Log existing username
     return res.status(400).json({ message: "Username already exists" });
   }

   if (!username || !password){
    res.status(400).json({error: 'username & password are required'});
   } else {
    users.push({username, password});
    return res.status(201).json({ message: "User registered successfully" });
   }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    res.json(book);
  }else{
    res.status(404).json({ message: "books not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  });

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 const title = req.params.title;
  const booksByTitle = [];

  Object.keys(books).forEach((isbn) => {

    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  });

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
