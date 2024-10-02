import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Camera } from 'react-camera-pro';

const AddFlockDetail = () => {
  const navigate = useNavigate();
  const { flockId } = useParams();
  const cameraRef = useRef(null);

  const [formData, setFormData] = useState({
    nepali_date: '',
    english_date: new Date().toISOString(),
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
    image_mortality: null,
    flock_id: flockId || '',
  });

  const [isLocationValid, setIsLocationValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    if (flockId) {
      setFormData((prevData) => ({ ...prevData, flock_id: flockId }));
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
      getCurrentLocation(farmLocation);
    } catch (error) {
      setErrorMessage('Failed to fetch farm location.');
      setIsFetchingLocation(false);
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

  const calculateDistance = ([lat1, lon1], [lat2, lon2]) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
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

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'english_date') {
        formDataToSend.append(key, formatDateForMySQL(formData[key]));
      } else if (key === 'image_mortality' && formData[key]) {
        formDataToSend.append(key, formData[key], 'captured_image.jpg');
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        'http://localhost:8800/flock-details',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Form submitted successfully:', response.data);
      alert(
        `Flock detail created successfully. Flock Detail ID: ${response.data.flockDetailId}`
      );
      navigate(`/myflock/${flockId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      alert(
        'Failed to create flock detail. Please check your connection and try again.'
      );
    }
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = () => {
    if (cameraRef.current) {
      const imageSrc = cameraRef.current.takePhoto();
      setCapturedImage(imageSrc);
      setFormData((prevData) => ({
        ...prevData,
        image_mortality: dataURLtoFile(imageSrc, 'captured_image.jpg'),
      }));
      closeCamera();
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const removePhoto = () => {
    setCapturedImage(null);
    setFormData((prevData) => ({
      ...prevData,
      image_mortality: null,
    }));
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
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
        >
          {/* Form fields */}
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

          {/* ... (other form fields) */}
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Mortality
            </label>
            {!capturedImage ? (
              <button
                type="button"
                onClick={openCamera}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Take Photo
              </button>
            ) : (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            )}
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

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-md">
            <Camera
              ref={cameraRef}
              aspectRatio={16 / 9}
              facingMode={facingMode}
              className="w-full"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={capturePhoto}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Capture
              </button>
              <button
                onClick={switchCamera}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Switch Camera
              </button>
              <button
                onClick={closeCamera}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFlockDetail;
