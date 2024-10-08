const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.filter(user => user.username === username);
}


const authenticatedUser = (username,password)=>{ 
  let validusers = users.some((user) => {
    return (user.username === username && user.password === password)
    });

    if (validusers.length = 0) {
        return true;
    } else {
        return false;
        }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }
  
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
        
      return res.status(208).json({ message: "Error logging in" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const {review} = req.body;
  const username = req.session.authorization.username;

  if(!isbn || !review){
    return res.status(400).json({message: "ISBN and review missing"});
  }

  const book = books[isbn];
  if(!book){
    return res.status(404).json({ message: "Book not found"});
  }

  let userReview = book.reviews.find(r => r.username === username);
  if(userReview){
    userReview.review = review;
  } else {
    book.review.push({ username, review});
  }

    return res.status(200).json({ message: "Review added/modified"});
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const initialReviewCount = book.reviews.length;
    book.reviews = book.reviews.filter(review => review.username !== username);
  
    if (book.reviews.length < initialReviewCount) {
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
