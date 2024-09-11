import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get('http://localhost:8800/books');
        setBooks(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllBooks();
  }, []);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl font-bold text-center mb-8">Anil Book Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            key={book.id}
          >
            {book.cover && (
              <img
                className="w-full h-48 object-cover"
                src={book.cover}
                alt={book.title}
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              <p className="text-gray-700 mb-4">{book.desc}</p>
              <span className="text-gray-900 font-bold">Rs.{book.price}</span>
              <button className="delete">Delete</button>
              <button className="Update">Update</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          to="/add"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
        >
          Add New Book
        </Link>
      </div>
    </div>
  );
};

export default Books;
