import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const MyFlock = () => {
  const [flocks, setFlocks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchFlocks = async () => {
      try {
        const response = await axios.get('http://localhost:8800/flock', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlocks(response.data);
      } catch (error) {
        console.error('Error fetching flocks:', error);
      }
    };

    fetchFlocks();
  }, [token]);

  const handleFlockClick = (flock_id) => {
    navigate(`/myflock/${flock_id}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">My Flocks</h2>
        <button
          className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate('/addflock')}
        >
          Add Flock
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Flock No
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Caretaker Farmer
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Placement Nepali Date
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                English Date
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flocks.map((flock, index) => (
              <tr
                key={flock.id}
                className={`cursor-pointer ${
                  index % 2 === 0 ? 'bg-gray-50' : ''
                } hover:bg-gray-200 transition`}
                onClick={() => handleFlockClick(flock.id)}
              >
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {flock.flock_id}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {flock.caretaker_farmer}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {flock.quantity}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {flock.nepali_date}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {moment(flock.english_date).format('YYYY-MM-DD')}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <a
                    href={`https://www.google.com/maps?q=${flock.Location}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Location
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyFlock;
