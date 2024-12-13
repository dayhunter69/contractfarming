import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '2', // Default role to Line Supervisor
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const accessToken = localStorage.getItem('accessToken');

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
      toast.success(`User ${formData.username} created successfully`, {
        style: { background: '#10B981', color: 'white' },
      });

      // Delay navigation slightly to allow toast to be seen
      setTimeout(() => {
        navigate('/users');
      }, 1000);
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to create user. Please try again.';
      toast.error(errorMessage, {
        style: { background: '#EF4444', color: 'white' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Toaster position="bottom-center" richColors />
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div
              className={`absolute right-3 top-0 bottom-0 flex items-center ${
                isSubmitting
                  ? 'cursor-not-allowed text-gray-400'
                  : 'cursor-pointer'
              }`}
              onClick={!isSubmitting ? togglePasswordVisibility : undefined}
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          >
            <option value="1">Admin</option>
            <option value="2">Line Supervisor</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-lg transition flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Creating User...
              </>
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
