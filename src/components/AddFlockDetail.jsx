import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
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

  const [isLocationValid, setIsLocationValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);

  useEffect(() => {
    if (flockId) {
      setFormData((prevData) => ({ ...prevData, flock_id: flockId }));

      // Fetch farm location
      fetchFarmLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flockId]);

  const fetchFarmLocation = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:8800/flock/${flockId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const farmLocation = response.data[0].Location.split(',').map(Number);
      // Fetch user's current location
      getCurrentLocation(farmLocation);
    } catch (error) {
      setErrorMessage('Failed to fetch farm location.');
    }
  };

  const getCurrentLocation = (farmLocation) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          const distance = calculateDistance(farmLocation, userLocation);

          if (distance < 0.1) {
            setIsLocationValid(true);
            setFormData((prevData) => ({
              ...prevData,
              location: `${userLocation[0]}, ${userLocation[1]}`,
            }));
          } else {
            setErrorMessage('You are outside the farm location.');
          }
          setIsFetchingLocation(false);
        },
        (error) => {
          setErrorMessage('Failed to get your current location.');
          setIsFetchingLocation(false);
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by this browser.');
      setIsFetchingLocation(false);
    }
  };

  // Haversine formula to calculate distance between two coordinates in km
  const calculateDistance = ([lat1, lon1], [lat2, lon2]) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');

    // Basic validation
    const requiredFields = [
      'nepali_date',
      'english_date',
      'location',
      'age_days',
      'num_birds',
      'mortality_birds',
      'bps_stock',
      'b1_stock',
      'b2_stock',
      'bps_consumption',
      'b1_consumption',
      'b2_consumption',
      'flock_id',
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Ensure numeric fields are numbers
    const numericFields = [
      'age_days',
      'num_birds',
      'mortality_birds',
      'bps_stock',
      'b1_stock',
      'b2_stock',
      'bps_consumption',
      'b1_consumption',
      'b2_consumption',
      'flock_id',
    ];
    const dataToSend = { ...formData };
    numericFields.forEach((field) => {
      dataToSend[field] = Number(dataToSend[field]);
    });

    // Format the english_date
    const englishDate = new Date(dataToSend.english_date);
    dataToSend.english_date = format(englishDate, 'yyyy-MM-dd HH:mm:ss');

    console.log('Sending data:', JSON.stringify(dataToSend, null, 2));

    try {
      const response = await axios.post(
        'http://localhost:8800/flock-details',
        dataToSend,
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
      console.error(
        'Error creating flock detail:',
        error.response?.data || error.message
      );
      if (error.response) {
        console.error(
          'Server responded with:',
          error.response.status,
          error.response.data
        );
        alert(
          `Failed to create flock detail. Server error: ${error.response.status}. ${error.response.data.message}`
        );
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Failed to create flock detail. No response from server.');
      } else {
        console.error('Error setting up request:', error.message);
        alert(
          'Failed to create flock detail. Please check your connection and try again.'
        );
      }
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Flock Detail</h2>

      {isFetchingLocation ? (
        <div>Fetching your location...</div>
      ) : errorMessage ? (
        <div className="text-red-500">{errorMessage}</div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
          disabled={!isLocationValid}
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
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={!isLocationValid}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default AddFlockDetail;
