class Book {
  constructor(title, author, year, genre) {
    this.id = Date.now();
    this.title = title;
    this.author = author;
    this.year = year;
    this.genre = genre;
  }
}

const books = JSON.parse(localStorage.getItem('books')) || [];

const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

function renderBooks(list) {
  bookList.innerHTML = '';
  list.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';

    const info = document.createElement('div');
    info.className = 'book-info';
    info.innerHTML = `<strong>${book.title}</strong> — ${book.author} (${book.year})<br><em>${book.genre}</em>`;

    const actions = document.createElement('div');
    actions.className = 'book-actions';

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.onclick = () => deleteBook(book.id);

    actions.appendChild(delBtn);
    card.appendChild(info);
    card.appendChild(actions);

    bookList.appendChild(card);
  });
}

function addBook(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const year = parseInt(document.getElementById('year').value.trim());
  const genre = document.getElementById('genre').value.trim();

  if (!title || !author || !year || !genre) return;

  const newBook = new Book(title, author, year, genre);
  books.push(newBook);
  saveBooks();
  renderBooks(books);
  bookForm.reset();
}

function deleteBook(id) {
  const index = books.findIndex(book => book.id === id);
  if (index > -1) {
    books.splice(index, 1);
    saveBooks();
    renderBooks(books);
  }
}

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

function filterBooks() {
  const query = searchInput.value.toLowerCase();
  let filtered = books.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );

  const sortBy = sortSelect.value;
  if (sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'year') {
    filtered.sort((a, b) => a.year - b.year);
  }

  renderBooks(filtered);
}

bookForm.addEventListener('submit', addBook);
searchInput.addEventListener('input', filterBooks);
sortSelect.addEventListener('change', filterBooks);

renderBooks(books);
