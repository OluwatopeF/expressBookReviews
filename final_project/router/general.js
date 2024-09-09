const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req,res) => {

    const username = req.query.username;
    const password = req.query.password;

    if (username && password){
        if(!isValid(username)){
            users.push({"username":username, "password":password});
            return res.status(200).json({message: "Registration complete"});
        } else{
            return res.status(404).json({message: "username already exists"});
        }
    } else{
        return res.status(404).json({message: "ERROR. cannot register user"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    try {
      const bookList = books; 
      res.json(bookList); 

    } catch (error) {
      
      console.error(error);
      res.status(500).json({ message: "Error retrieving book list" });
    }
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try {
      const requestedIsbn = req.params.isbn; 
      const book = books[requestedIsbn];
      if (book) {
        res.json(book); 
      } else {
        res.status(404).json({ message: "Book not found" }); 
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error. No book details found" });
    }
   });
  

  // Get book details based on author
  public_users.get('/author/:author',function (req, res) {
    try {
      const requestedAuthor = req.params.author; 
      const matchingBooks = [];
  
      const bookKeys = Object.keys(books);
  
      for (const key of bookKeys) {
        const book = books[key];
        if (book.author === requestedAuthor) {
          matchingBooks.push(book);
        }
      }
  
      if (matchingBooks.length > 0) {
        res.json(matchingBooks);
      } else {
        res.status(404).json({ message: "Book not found by that author" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving books" }); 
    }
  });
  
  // Get all books based on title
  public_users.get('/title/:title',function (req, res) {
    try {
      const titleFind = req.params.title; 
      const matchingBooks = [];

      const bookKeys = Object.keys(books);
  
      for (const key of bookKeys) {
        const book = books[key];
        if (book.title.toLowerCase() === titleFind.toLowerCase()) { 
          matchingBooks.push(book);
        }
      }
  
      if (matchingBooks.length > 0) {
        res.json(matchingBooks); 
      } else {
        res.status(404).json({ message: "No books found with title: " + titleFind});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving books" }); 
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
