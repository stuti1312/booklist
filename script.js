// book class : represent the book
class Book {
  constructor(author, title, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class: handle UI tasks
class UI {
  // display books
  static displayBooks() {
    // books data
    // const StoredBooks = [
    //   {
    //     title: "YOU CAN WIN",
    //     author: "Shiv Kheda",
    //     isbn: "1234567890",
    //   },
    //   {
    //     title: "THE SECRET",
    //     author: "Rhonda Byrne",
    //     isbn: "2345678901",
    //   },
    //   {
    //     title: "THE ALCHEMIST",
    //     author: "Paulo Ceolho",
    //     isbn: "3456789012",
    //   },
    //   {
    //     title: "BEFORE I FALL",
    //     author: "Lauren Oliver",
    //     isbn: "4567890123",
    //   },
    //   {
    //     title: "THE HELP",
    //     author: "Kathryn Stockett",
    //     isbn: "5678901234",
    //   },
    // ];

    const books = Store.getBooks();
    // const books = StoredBooks;
    books.forEach((book) => UI.addBookToList(book));
  }

  //   add books to list
  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class='btn btn-danger btn-sm delete'>X</td>
    `;
    list.appendChild(row);
  }

  // delete books
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  // show alert
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // remove alert message in 2 sec
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  // clear feilds once added
  static clearFeilds() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// store class: handles storage
class Store {
  // get books
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  // add books
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  // remove books
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// event: to display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// event: to add a books
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("please fulfill all the fields", "danger");
  } else {
    // instantiate book
    const book = new Book(author, title, isbn);
    //   console.log(book);

    // add book to ui
    UI.addBookToList(book);

    // add book to store/local storage
    UI.addBook(book);

    // show success message
    UI.showAlert("BOOK ADDED", "success");

    // clear feilds
    UI.clearFeilds();
  }
});

// event: to remove a books
document.querySelector("#book-list").addEventListener("click", (e) => {
  // remove book from ui
  UI.deleteBook(e.target);

  // remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show success message
  UI.showAlert("BOOK REMOVED", "warning");
});
