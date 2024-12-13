import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Camera } from 'react-camera-pro';
import { Loader2, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const EditFlockDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const cameraRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState({
    image_mortality: null,
    feed_image: null,
    field_image: null,
  });
  const [removeImages, setRemoveImages] = useState({
    image_mortality: false,
    feed_image: false,
    field_image: false,
  });
  const [formData, setFormData] = useState({
    nepali_date: '',
    english_date: '',
    location: '',
    age_days: 0,
    num_birds: 0,
    avg_weight: 0,
    mortality_birds: 0,
    number_of_birds_sold: 0,
    net_weight_sold: 0,
    price_per_kg: 0,
    bps_stock: 0,
    b1_stock: 0,
    b2_stock: 0,
    bps_consumption: 0,
    b1_consumption: 0,
    b2_consumption: 0,
    mortality_reason: '',
    medicine: '',
    image_mortality: null,
    feed_image: null,
    field_image: null,
    fcr: 0,
  });

  const [capturedImages, setCapturedImages] = useState({
    image_mortality: null,
    feed_image: null,
    field_image: null,
  });
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  // Fetch existing flock detail
  useEffect(() => {
    const fetchFlockDetail = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(
          `http://localhost:8800/flock-details/singledetail/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const flockDetail = response.data[0];
        const formattedDate = new Date(flockDetail.english_date)
          .toISOString()
          .split('T')[0];

        setFormData({
          ...flockDetail,
          english_date: formattedDate,
        });

        // Set existing images
        const imageFields = ['image_mortality', 'feed_image', 'field_image'];
        const newExistingImages = {};
        imageFields.forEach((field) => {
          if (
            flockDetail[field] &&
            flockDetail[field] !== 'feed' &&
            flockDetail[field] !== 'field'
          ) {
            newExistingImages[field] = flockDetail[field];
          }
        });
        setExistingImages(newExistingImages);
      } catch (error) {
        console.error('Error fetching flock detail:', error);
        toast.error('Failed to fetch flock detail');
      }
    };

    fetchFlockDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const accessToken = localStorage.getItem('accessToken');

    // Create a helper function to sanitize numeric values
    const sanitizeNumericValue = (value) => {
      // If value is null, undefined, or empty string, return null
      if (value === null || value === undefined || value === '') {
        return null;
      }
      // If it's already a number, return it
      if (typeof value === 'number') {
        return value;
      }
      // Try to convert string to number
      const numValue = Number(value);
      // Return null if it's not a valid number, otherwise return the number
      return isNaN(numValue) ? null : numValue;
    };
    const totalFeedConsumption =
      parseFloat(formData.bps_consumption) +
      parseFloat(formData.b1_consumption) +
      parseFloat(formData.b2_consumption);

    // Calculate total bird weight
    const totalWeight = formData.avg_weight * formData.num_birds;

    // Calculate FCR
    let calculatedFCR; // Declare calculatedFCR outside the blocks

    if (totalWeight !== 0) {
      calculatedFCR = totalFeedConsumption / (totalWeight / 1000); // Convert weight to kg
    } else {
      calculatedFCR = 0;
    }

    // Update formData with calculated FCR before submission
    formData.fcr = calculatedFCR.toFixed(4); // Round to 4 decimal places
    const formDataToSend = new FormData();

    // Define numeric fields
    const numericFields = [
      'age_days',
      'num_birds',
      'avg_weight',
      'mortality_birds',
      'number_of_birds_sold',
      'net_weight_sold',
      'price_per_kg',
      'bps_stock',
      'b1_stock',
      'b2_stock',
      'bps_consumption',
      'b1_consumption',
      'b2_consumption',
      'fcr',
    ];

    Object.keys(formData).forEach((key) => {
      if (key === 'english_date') {
        formDataToSend.append(key, formatDateForMySQL(formData[key]));
      } else if (
        ['image_mortality', 'feed_image', 'field_image'].includes(key)
      ) {
        if (formData[key] instanceof File || formData[key] instanceof Blob) {
          formDataToSend.append(key, formData[key], `${key}.jpg`);
        } else if (removeImages[key]) {
          formDataToSend.append(`remove_${key}`, 'true');
        }
      } else if (numericFields.includes(key)) {
        // Handle numeric fields
        const sanitizedValue = sanitizeNumericValue(formData[key]);
        // Only append if the value is not null
        if (sanitizedValue !== null) {
          formDataToSend.append(key, sanitizedValue);
        }
      } else {
        // Handle other fields normally
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.put(
        `http://localhost:8800/flock-details/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Flock detail updated successfully');
      navigate(`/myflock/${formData.flock_id}`);
    } catch (error) {
      console.error('Error updating flock detail:', error);
      // Provide more specific error message
      const errorMessage =
        error.response?.data?.message || 'Failed to update flock detail';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCamera = (imageType) => {
    setCurrentImageType(imageType);
    setIsCameraOpen(true);
  };

  const capturePhoto = () => {
    if (cameraRef.current && currentImageType) {
      const imageSrc = cameraRef.current.takePhoto();
      const imageFile = dataURLtoFile(imageSrc, `${currentImageType}.jpg`);

      if (imageFile) {
        setCapturedImages((prev) => ({
          ...prev,
          [currentImageType]: imageSrc,
        }));

        setFormData((prevData) => ({
          ...prevData,
          [currentImageType]: imageFile,
        }));

        // Remove existing image and mark for removal
        setExistingImages((prev) => ({ ...prev, [currentImageType]: null }));
        setRemoveImages((prev) => ({ ...prev, [currentImageType]: true }));

        closeCamera();
      } else {
        toast.error('Failed to capture image');
      }
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    try {
      let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }

      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error('Error converting dataURL to file:', error);
      return null;
    }
  };

  const removePhoto = (imageType) => {
    // Reset specific image states
    setCapturedImages((prev) => ({ ...prev, [imageType]: null }));
    setFormData((prevData) => ({ ...prevData, [imageType]: null }));
    setExistingImages((prev) => ({ ...prev, [imageType]: null }));
    setRemoveImages((prev) => ({ ...prev, [imageType]: true }));
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setCurrentImageType(null);
  };

  const ImagePreview = ({ file, src, alt, onRemove }) => {
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
      <div className="relative w-32 h-24">
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
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  const renderImageInput = (imageType, label) => {
    const capturedImage = capturedImages[imageType];
    const existingImage = existingImages[imageType];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {existingImage || capturedImage ? (
          <div className="relative inline-block">
            <ImagePreview
              file={
                capturedImage
                  ? new File(
                      [dataURLtoFile(capturedImage, 'temp.jpg')],
                      'temp.jpg'
                    )
                  : null
              }
              src={existingImage}
              alt={`${label} preview`}
              onRemove={() => removePhoto(imageType)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openCamera(imageType)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Take Photo
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Toaster position="bottom-center" richColors />
      <h2 className="text-2xl font-bold mb-4">Edit Flock Detail: {id}</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        {/* Existing form fields with similar structure to AddFlockDetail */}
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
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-not-allowed"
            placeholder="Latitude, Longitude"
            disabled
          />
        </div>

        {/* Rest of the form fields... (similar to AddFlockDetail) */}
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
            Average Weight Per Bird in gram{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="avg_weight"
            value={formData.avg_weight}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Mortality Birds
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
            Number of Birds Sold
          </label>
          <input
            type="number"
            name="number_of_birds_sold"
            value={formData.number_of_birds_sold}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Net Weight Sold
          </label>
          <input
            type="number"
            name="net_weight_sold"
            value={formData.net_weight_sold}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Per Kg
          </label>
          <input
            type="number"
            name="price_per_kg"
            value={formData.price_per_kg}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            BPS Stock
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
            B1 Stock
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
            B2 Stock
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
            BPS Consumption
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
            B1 Consumption
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
            B2 Consumption
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

        {renderImageInput('image_mortality', 'Mortality Image')}
        {renderImageInput('feed_image', 'Feed Stock Image')}
        {renderImageInput('field_image', 'Field Image')}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(`/myflock/${formData.flock_id}`)}
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

export default EditFlockDetail;
