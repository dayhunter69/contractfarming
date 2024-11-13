import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Add = () => {
  const [book, setBook] = useState({
    title: '',
    desc: '',
    price: null,
    cover: '',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://cfbeta.safnepal.com/books', book);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  console.log(book);
  return (
    <div className="form">
      <h1>Add New Book</h1>
      <input
        type="text"
        placeholder="title"
        onChange={handleChange}
        name="title"
      />
      <input type="text" id="desc" onChange={handleChange} name="desc" />
      <input type="number" id="price" onChange={handleChange} name="price" />
      <input type="text" id="cover" onChange={handleChange} name="cover" />
      <button onClick={handleClick}>Submit</button>
    </div>
  );
};

export default Add;
