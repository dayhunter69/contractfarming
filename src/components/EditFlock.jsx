import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const EditFlock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [existingImage, setExistingImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

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
    image_location: '',
    complete_date: null,
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
        toast.error('Failed to fetch users list');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchFlockData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`http://localhost:8800/flock/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const flockData = response.data; // Direct object, not an array

        // Format the english_date to YYYY-MM-DD
        const formattedDate = new Date(flockData.english_date)
          .toISOString()
          .split('T')[0];

        setFormData({
          ...flockData,
          english_date: formattedDate,
        });

        if (flockData.image_location) {
          setExistingImage(flockData.image_location);
        }
      } catch (error) {
        console.error('Error fetching flock:', error);
        toast.error('Failed to fetch flock details');
      }
    };

    fetchFlockData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'complete_date' && value === '') {
      setFormData((prev) => ({ ...prev, [name]: null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should not exceed 10MB');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setRemoveExistingImage(true);
    }
  };

  const handleRemoveImage = () => {
    setExistingImage(null);
    setSelectedFile(null);
    setRemoveExistingImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const accessToken = localStorage.getItem('accessToken');

    const formDataToSend = new FormData();

    // Properly handle null values when adding to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image_location') {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
        // Don't append anything for null values, letting the backend use database defaults
      }
    });

    if (selectedFile) {
      formDataToSend.append('image', selectedFile);
    }

    if (removeExistingImage) {
      formDataToSend.append('remove_image', 'true');
    }

    try {
      await axios.put(`http://localhost:8800/flock/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Flock updated successfully');

      // Delay navigation slightly to allow toast to be seen
      setTimeout(() => {
        navigate('/myflock');
      }, 1000);
    } catch (error) {
      console.error('Error updating flock:', error);
      // Provide more specific error message based on the error type
      const errorMessage =
        error.response?.data?.message ||
        'Failed to update flock. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ImagePreview = ({ file, src, alt }) => {
    const [previewSrc, setPreviewSrc] = useState(null);

    useEffect(() => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewSrc(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewSrc(null);
      }
    }, [file]);

    const imageSrc = file
      ? previewSrc
      : src
      ? `http://localhost:8800/uploads/${src.split('/').pop()}`
      : null;

    return (
      <div className="w-32 h-24 relative">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover rounded-lg shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/128x96?text=No+Image';
            }}
          />
        ) : (
          <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Toaster position="bottom-center" richColors />
      <h2 className="flex items-center justify-center text-2xl font-bold mb-4">
        Edit Flock: {formData.flock_id}
      </h2>
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
            Location
          </label>
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
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
            Nepali Placement Date <span className="text-red-500">*</span>
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
        {/* <div>
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
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Upload
          </label>
          {(existingImage && !removeExistingImage) || selectedFile ? (
            <div className="relative inline-block">
              <ImagePreview
                file={selectedFile}
                src={existingImage}
                alt={`Flock ${formData.flock_id}`}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              accept="image/*"
            />
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/myflock')}
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFlock;
