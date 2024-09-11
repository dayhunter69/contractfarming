import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AddFlockDetail = () => {
  const navigate = useNavigate();
  const { flockId } = useParams();

  const [formData, setFormData] = useState({
    nepali_date: '',
    english_date: new Date().toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    location: '',
    age_days: 0,
    num_birds: 0,
    mortality_birds: 0,
    bps_stock: 0,
    b1_stock: 0,
    b2_stock: 0,
    bps_consumption: 0,
    b1_consumption: 0,
    b2_consumption: 0,
    mortality_reason: '',
    medicine: '',
    image_mortality: '',
    flock_id: flockId || '',
  });

  useEffect(() => {
    if (flockId) {
      setFormData((prevData) => ({ ...prevData, flock_id: flockId }));
    }
  }, [flockId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        'http://localhost:8800/flock-details',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Flock detail created:', response.data);
      alert(
        `Flock detail created successfully. Flock Detail ID: ${response.data.flockDetailId}`
      );
      navigate(`/myflock/${flockId}`);
    } catch (error) {
      console.error('Error creating flock detail:', error);
      alert('Failed to create flock detail. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Flock Detail</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
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
            English Date and Time <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="english_date"
            value={formData.english_date}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Latitude, Longitude"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age (Days) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age_days"
            value={formData.age_days}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Birds <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="num_birds"
            value={formData.num_birds}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mortality Birds <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="mortality_birds"
            value={formData.mortality_birds}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            BPS Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="bps_stock"
            value={formData.bps_stock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            B1 Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="b1_stock"
            value={formData.b1_stock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            B2 Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="b2_stock"
            value={formData.b2_stock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            BPS Consumption <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="bps_consumption"
            value={formData.bps_consumption}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            B1 Consumption <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="b1_consumption"
            value={formData.b1_consumption}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            B2 Consumption <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="b2_consumption"
            value={formData.b2_consumption}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mortality Reason
          </label>
          <input
            type="text"
            name="mortality_reason"
            value={formData.mortality_reason}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter mortality reason"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicine
          </label>
          <input
            type="text"
            name="medicine"
            value={formData.medicine}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter medicine name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Mortality
          </label>
          <input
            type="text"
            name="image_mortality"
            value={formData.image_mortality}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter image location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flock ID
          </label>
          <input
            type="number"
            name="flock_id"
            value={formData.flock_id}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
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

export default AddFlockDetail;
