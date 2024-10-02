import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ReusableSortableTable from './ReusableSortableTable';

const MyFlock = () => {
  const [showAddFlockButton, setShowAddFlockButton] = useState(false);
  const [flocks, setFlocks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setShowAddFlockButton(userRole === '0' || userRole === '1');
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

  const columns = [
    { id: 'flock_id', label: 'Flock No' },
    {
      id: 'caretaker_farmer',
      label: 'Caretaker Farmer',
      render: (value) => (
        <span className="px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          {value}
        </span>
      ),
    },
    {
      id: 'quantity',
      label: 'Quantity',
      render: (value) => (
        <span className="px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {value}
        </span>
      ),
    },
    { id: 'nepali_date', label: 'Placement Nepali Date' },
    {
      id: 'english_date',
      label: 'English Date',
      render: (value) => moment(value).format('YYYY-MM-DD'),
    },
    { id: 'address', label: 'Address' },
    {
      id: 'Location',
      label: 'Location',
      render: (value) => (
        <a
          href={`https://www.google.com/maps?q=${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View Location
        </a>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">My Flocks</h2>
        {showAddFlockButton && (
          <button
            className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate('/addflock')}
          >
            Add Flock
          </button>
        )}
      </div>

      <ReusableSortableTable
        columns={columns}
        rows={flocks}
        defaultSortColumn="flock_id"
        navigateOnClick={true}
        getNavigationPath={(row) => `/myflock/${row.id}`}
      />
    </div>
  );
};

export default MyFlock;
