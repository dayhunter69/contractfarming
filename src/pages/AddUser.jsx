import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '2', // Default role to Line Supervisor
  });
  const [showPassword, setShowPassword] = useState(false); // Toggle for showing password
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData({ ...formData, role: selectedRole });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    const accessToken = localStorage.getItem('accessToken');
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8800/auth/signup',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('User created:', response.data);
      alert(`User created successfully: ${formData.username}`);
      navigate('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add User</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div
              className="absolute right-3 top-0 bottom-0 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="1">Admin</option>
            <option value="2">Line Supervisor</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
