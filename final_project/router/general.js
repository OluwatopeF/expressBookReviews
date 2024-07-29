const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

   if (username && password){
    if(!isValid(username)){
        users.push({
            "username":username,
            "password":password
        });
      return res.status(200).json({message: "Registration complete"});
    } else{
        return res.status(404).json({message: "username already exists"});
    }
}
return res.status(404).json({message: "ERROR. cannot register user"});
});

// Get the book list available in the shop
public_users.get('/',function (res) {
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
