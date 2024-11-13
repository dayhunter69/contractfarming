import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';
import moment from 'moment';

const Details = () => {
  const { flockId } = useParams();
  const location = useLocation();
  const [flock, setFlock] = useState(null);
  const flockDetail = location.state?.flockDetail;
  const token = localStorage.getItem('accessToken');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageTitle, setImageTitle] = useState('');

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      setSelectedImage(null);
    }
  }, []);

  useEffect(() => {
    // Add event listener for ESC key
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const fetchFlock = async () => {
      try {
        const response = await axios.get(
          `https://cfbeta.safnepal.com/flock/${flockId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFlock(response.data[0]);
      } catch (error) {
        console.error('Error fetching flock data:', error);
      }
    };

    fetchFlock();
  }, [flockId, token]);

  if (!flock || !flockDetail) {
    return <p className="text-center p-4">Loading data...</p>;
  }

  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );

  const ImageWithPopup = ({ src, alt, title }) => (
    <img
      src={`https://cfbeta.safnepal.com/uploads/${src.split('/').pop()}`}
      alt={alt}
      className="rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
      height={200}
      width={200}
      onClick={() => {
        setSelectedImage(src);
        setImageTitle(title);
      }}
    />
  );

  const ImagePopup = () => {
    if (!selectedImage) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          // Close popup when clicking the overlay (outside the image)
          if (e.target === e.currentTarget) {
            setSelectedImage(null);
          }
        }}
      >
        <div className="relative max-w-6xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              {imageTitle}
            </h3>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="overflow-auto max-h-[85vh]">
            <img
              src={`https://cfbeta.safnepal.com/uploads/${selectedImage
                .split('/')
                .pop()}`}
              alt={imageTitle}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Flock Summary section */}
      <div className="bg-white shadow-md rounded-lg mb-6 overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Flock Summary</h2>
        </div>
        <div className="p-4">
          <DetailItem label="Flock ID" value={flock.flock_id} />
          <DetailItem label="Caretaker" value={flock.caretaker_farmer} />
          <DetailItem label="Quantity" value={flock.quantity} />
          <DetailItem label="Address" value={flock.address} />
          <DetailItem label="Location" value={flock.Location} />
          <DetailItem label="Placement Nepali Date" value={flock.nepali_date} />
          <DetailItem
            label="Placement English Date"
            value={moment(flock.english_date).format('YYYY-MM-DD')}
          />
          <DetailItem label="Assigned To" value={flock.assigned_to} />
          <DetailItem label="Corporative Name" value={flock.corporative_name} />

          {flock.image_location && (
            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">Flock Image</h3>
              <ImageWithPopup
                src={flock.image_location}
                alt="Flock"
                title="Flock Image"
              />
            </div>
          )}
        </div>
      </div>

      {/* Flock Detail section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Flock Detail</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Nepali Date" value={flockDetail.nepali_date} />
            <DetailItem
              label="English Date"
              value={moment(flockDetail.english_date).format('YYYY-MM-DD')}
            />
            <DetailItem label="Age (Days)" value={flockDetail.age_days} />
            <DetailItem label="Number of Birds" value={flockDetail.num_birds} />
            <DetailItem label="Mortality" value={flockDetail.mortality_birds} />
            <DetailItem
              label="Number of Birds Sold"
              value={flockDetail.number_of_birds_sold}
            />
            <DetailItem
              label="Total Weight Sold"
              value={flockDetail.net_weight_sold}
            />
            <DetailItem
              label="Price per Kilogram"
              value={flockDetail.price_per_kg}
            />
            <DetailItem
              label="Revenue"
              value={flockDetail.net_weight_sold * flockDetail.price_per_kg}
            />
            <DetailItem
              label="Mortality Reason"
              value={flockDetail.mortality_reason}
            />
            <DetailItem label="Medicine" value={flockDetail.medicine} />
          </div>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="BPS Stock" value={flockDetail.bps_stock} />
            <DetailItem label="B1 Stock" value={flockDetail.b1_stock} />
            <DetailItem label="B2 Stock" value={flockDetail.b2_stock} />
            <DetailItem
              label="BPS Consumption"
              value={flockDetail.bps_consumption}
            />
            <DetailItem
              label="B1 Consumption"
              value={flockDetail.b1_consumption}
            />
            <DetailItem
              label="B2 Consumption"
              value={flockDetail.b2_consumption}
            />
          </div>
          {flockDetail.image_mortality && (
            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">
                Mortality Image
              </h3>
              <ImageWithPopup
                src={flockDetail.image_mortality}
                alt="Mortality"
                title="Mortality Image"
              />
            </div>
          )}
          {flockDetail.feed_image && (
            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">Feed Image</h3>
              <ImageWithPopup
                src={flockDetail.feed_image}
                alt="Feed"
                title="Feed Image"
              />
            </div>
          )}
          {flockDetail.field_image && (
            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">Field Image</h3>
              <ImageWithPopup
                src={flockDetail.field_image}
                alt="Field"
                title="Field Image"
              />
            </div>
          )}
        </div>
      </div>
      <ImagePopup />
    </div>
  );
};

export default Details;
