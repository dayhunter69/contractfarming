import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddFlock = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    assigned_to: '',
    Location: '',
    caretaker_farmer: '',
    flock_id: '',
    nepali_date: '',
    english_date: new Date().toISOString().split('T')[0],
    quantity: 0,
    address: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://localhost:8800/users', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    if (selectedFile) {
      formDataToSend.append('image', selectedFile);
    }

    console.log('FormData to be sent:', Object.fromEntries(formDataToSend));

    try {
      const response = await axios.post(
        'http://localhost:8800/flock',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Flock created:', response.data);
      alert(`Flock created successfully. Flock ID: ${response.data.flockId}`);
      navigate('/myflock');
    } catch (error) {
      console.error(
        'Error creating flock:',
        error.response ? error.response.data : error.message
      );
      alert('Failed to create flock. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Flock</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To <span className="text-red-500">*</span>
          </label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Longitude & Latitude Coordinates"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter Address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caretaker Farmer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="caretaker_farmer"
            value={formData.caretaker_farmer}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter caretaker farmer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flock ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="flock_id"
            value={formData.flock_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter flock ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nepali Date <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nepali_date"
            value={formData.nepali_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            English Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="english_date"
            value={formData.english_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Upload
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFlock;
