import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const FlockDetail = () => {
  const { flockId } = useParams();
  const [flockDetails, setFlockDetails] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchFlockDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/flock-details/${flockId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFlockDetails(response.data);
      } catch (error) {
        console.error('Error fetching flock details:', error);
      }
    };

    fetchFlockDetails();
  }, [flockId, token]);

  const handleRowClick = (detail) => {
    navigate(`/myflock/${flockId}/details`, {
      state: { flockDetail: detail },
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Flock Details</h2>
        <button
          className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate(`/myflock/${flockId}/addflockdetail/`)}
        >
          Daily Entry
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Nepali Date
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                English Date
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Age (Days)
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Number of Birds
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Mortality
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Mortality Reason
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Medicine
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flockDetails.map((detail, index) => (
              <tr
                key={detail.id}
                className={`cursor-pointer ${
                  index % 2 === 0 ? 'bg-gray-50' : ''
                } hover:bg-gray-200 transition`}
                onClick={() => handleRowClick(detail)}
              >
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {detail.nepali_date}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {moment(detail.english_date).format('YYYY-MM-DD')}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {detail.age_days}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {detail.num_birds}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {detail.mortality_birds}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {detail.mortality_reason}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {detail.medicine}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlockDetail;
