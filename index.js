const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

//! INIT APP
const app = express();
app.use(express.json());
app.use(cors());

//! DB CONNECTION
const db = mysql.createConnection({
  host: process.env.MYSQLHOST /*|| "localhost"*/,
  user: process.env.MYSQLUSER /*|| "root"*/,
  password: process.env.MYSQLPASSWORD /*|| "password"*/,
  database: process.env.MYSQLDATABASE /*|| "booksapp"*/,
  port: process.env.MYSQLPORT /*|| 3306,*/,
});

app.get("/", (req, res) => {
  res.send("Hello this is the backend");
});

//! GET ALL BOOKS
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

//! POST A BOOK
app.post("/books", (req, res) => {
  const q =
    "INSERT INTO books (title,author,description,price) VALUES (?,?,?,?)";

  const values = [
    req.body.title,
    req.body.author,
    req.body.description,
    req.body.price,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

//! DELETE A BOOK
//! Se le agrega :id, porque es necesario especificar cual borrar de todos
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id=?";

  db.query(q, [bookId], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Book has been deleted successfully");
    }
  });
});

//! UPDATE A BOOK
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;

  const values = [
    req.body.title,
    req.body.author,
    req.body.description,
    req.body.price,
  ];
  const q = `UPDATE books 
    SET 
      title = COALESCE(NULLIF(?, ''), title), 
      author = COALESCE(NULLIF(?, ''), author),
      description = COALESCE(NULLIF(?, ''), description),
      price= COALESCE(NULLIF(?, ''), price)
    WHERE id= ?`;

  db.query(q, [...values, bookId], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Book has been updated successfully");
    }
  });
});

//! CONNECTION
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listen in PORT: ${PORT}...`);
});
