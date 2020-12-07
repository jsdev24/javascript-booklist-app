
let title = document.getElementById("title");
let author = document.getElementById("author");
let isbn = document.getElementById("isbn");
let addBookBtn = document.getElementById("addBookBtn");
let bookList = document.getElementById("bookList");
let snackbar = document.getElementById("snackbar");


class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}


class UI {
  static displayBooks() {
    let books = Store.getBooks();

    books.forEach((book, i) => {
        UI.addBookToList(book, i);
    })
  }

  static addBookToList(book, i) {
    let bookItem = `
      <div class="book-item" data-index=${i} title=${book.isbn}>
        <div class="book-title">
          ${book.title}
        </div>
        <div class="book-author">
          ${book.author}
        </div>
        <img src="img/delete.png" class="deleteBtn delete" alt="">
      </div>`;

    bookList.innerHTML += bookItem;

    document.querySelectorAll(".delete").forEach(deleteBtn => {
        deleteBtn.addEventListener("click", function() {
            this.parentElement.remove();
            Store.removeBook(this);
            UI.showAlert("Book Removed", "#5cb85c");
        })
    })
  }

  static showAlert(message, bgColor) {
    let div = document.createElement('div');
    div.className = "alert";
    div.style.backgroundColor = bgColor;
    div.setAttribute("id", "snackbar");
    div.appendChild(document.createTextNode(message));
    let form = document.querySelector("form");
    document.querySelector(".left-section").insertBefore(div, form);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    title.value = "";
    author.value = "";
    isbn.value = "";
  }
}


class Store {
  static getBooks() {
    let books;

    if(localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }
  
  static addBook(book) {
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(element) {
    let dataIndex = element.parentElement.getAttribute("data-index");
    let books = Store.getBooks();
    books.splice(dataIndex, 1);
    localStorage.setItem("books", JSON.stringify(books));
  }
}


document.addEventListener("DOMContentLoaded", UI.displayBooks);

addBookBtn.addEventListener("click", e => {
  e.preventDefault();

  let titleValue = title.value.trim();
  let authorValue = author.value.trim();
  let isbnValue = isbn.value.trim();

  if(titleValue === "" || authorValue === "" || isbnValue === "") {
    UI.showAlert("Please fill in all fields", "#df4759");
  } else {
    let book = new Book(titleValue, authorValue, isbnValue);
    UI.addBookToList(book);
    Store.addBook(book);
    UI.showAlert("Book Added", "#5cb85c");
    UI.clearFields();
  }
})
