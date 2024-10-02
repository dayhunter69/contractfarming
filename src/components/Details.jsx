import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const Details = () => {
  const { flockId } = useParams();
  const location = useLocation();
  const [flock, setFlock] = useState(null);
  const flockDetail = location.state?.flockDetail;
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchFlock = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/flock/${flockId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Set the first item in the array as the flock data
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

          {flock.image_location && (
            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">Flock Image</h3>
              <img
                src={`http://localhost:8800/uploads/${flock.image_location
                  .split('/')
                  .pop()}`}
                alt="Flock"
                className="rounded-lg shadow-md"
                height={100}
                width={100}
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
              <img
                src={`http://localhost:8800/uploads/${flockDetail.image_mortality
                  .split('/')
                  .pop()}`}
                alt="Mortality"
                className="rounded-lg shadow-md"
                height={200}
                width={200}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
