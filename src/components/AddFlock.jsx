import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const AddFlock = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    assigned_to: '',
    Location: '',
    caretaker_farmer: '',
    flock_id: '',
    nepali_date: '',
    english_date: new Date().toISOString().split('T')[0],
    quantity: 0,
    address: '',
    corporative_name: '',
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
        toast.error('Failed to fetch users list', {
          style: { background: '#EF4444', color: 'white' },
        });
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 5MB limit
        toast.error('File size should not exceed 10MB', {
          style: { background: '#EF4444', color: 'white' },
        });
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    const accessToken = localStorage.getItem('accessToken');

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    if (selectedFile) {
      formDataToSend.append('image', selectedFile);
    }

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

      toast.success(
        `Flock created successfully. Flock ID: ${response.data.flockId}`,
        {
          style: { background: '#10B981', color: 'white' },
        }
      );

      // Delay navigation slightly to allow toast to be seen
      setTimeout(() => {
        navigate('/myflock');
      }, 1000);
    } catch (error) {
      console.error(
        'Error creating flock:',
        error.response ? error.response.data : error.message
      );
      toast.error('Failed to create flock. Please try again.', {
        style: { background: '#EF4444', color: 'white' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Toaster position="bottom-center" richColors />
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
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
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Corporative Name
          </label>
          <input
            type="text"
            name="corporative_name"
            value={formData.corporative_name}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Upload
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
            accept="image/*"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFlock;
