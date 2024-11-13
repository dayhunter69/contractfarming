import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import ReusableSortableTable from './ReusableSortableTable';

const CustomDialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-[900px] w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const ImagePreview = ({ src, alt }) => {
  if (!src) {
    return (
      <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  const filename = src.split('/').pop();

  return (
    <div className="w-32 h-24 relative">
      <img
        src={`https://cfbeta.safnepal.com/uploads/${filename}`}
        alt={alt}
        className="w-full h-full object-cover rounded-lg shadow-sm"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/128x96?text=No+Image';
        }}
      />
    </div>
  );
};

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!imageSrc) return null;

  const filename = imageSrc.split('/').pop();

  return (
    <CustomDialog isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-h-[80vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all duration-200 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={`https://cfbeta.safnepal.com/uploads/${filename}`}
          alt="Enlarged view"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/800x600?text=Image+Not+Found';
          }}
        />
      </div>
    </CustomDialog>
  );
};

const MyFlock = () => {
  const [showAddFlockButton, setShowAddFlockButton] = useState(false);
  const [flocks, setFlocks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setShowAddFlockButton(userRole === '0' || userRole === '1');

    const fetchFlocks = async () => {
      try {
        const response = await axios.get('https://cfbeta.safnepal.com/flock', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlocks(response.data);
      } catch (error) {
        console.error('Error fetching flocks:', error);
        toast.error('Failed to fetch flocks');
      }
    };

    fetchFlocks();
  }, [token]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const columns = [
    {
      id: 'english_date',
      label: 'Date',
      render: (value) => moment(value).format('YYYY-MM-DD'),
    },
    {
      id: 'flock_id',
      label: 'Flock No',
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      id: 'username_assigned_to',
      label: 'Assigned To',
      render: (value) => (
        <span className="px-2 py-1 text-xs md:text-sm font-medium rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      id: 'quantity',
      label: 'Quantity',
      render: (value) => (
        <span className="px-2 py-1 text-xs md:text-sm font-semibold rounded-full bg-green-100 text-green-800">
          {value.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'cum_mortality',
      label: 'Cumulative Mortality',
      render: (value) => value || '—',
    },
    {
      id: 'cum_sold',
      label: 'Cumulative Sold',
      render: (value) => value || '—',
    },
    {
      id: 'nepali_date',
      label: 'Placement Date',
    },
    {
      id: 'caretaker_farmer',
      label: 'Caretaker Farmer',
      render: (value) => (
        <span className="px-2 py-1 text-xs md:text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
          {value}
        </span>
      ),
    },
    {
      id: 'address',
      label: 'Address',
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      id: 'corporative_name',
      label: 'Corporative',
      render: (value) => value || '—',
    },
    {
      id: 'image_preview',
      label: 'Image',
      render: (_, row) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (row.image_location) {
              setSelectedImage(row.image_location);
            }
          }}
        >
          <ImagePreview
            src={row.image_location}
            alt={`Flock ${row.flock_id}`}
          />
        </div>
      ),
    },
    {
      id: 'Location',
      label: 'Location',
      render: (value) => (
        <a
          href={`https://www.google.com/maps?q=${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          View Location
        </a>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Flocks
        </h2>
        {showAddFlockButton && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            onClick={() => navigate('/addflock')}
          >
            Add Flock
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ReusableSortableTable
          columns={columns}
          rows={flocks}
          defaultSortColumn="flock_id"
          navigateOnClick={true}
          getNavigationPath={(row) => `/myflock/${row.id}`}
        />
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage}
      />
    </div>
  );
};

export default MyFlock;
