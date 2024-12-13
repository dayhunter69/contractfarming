import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { X, Edit, CircleOff } from 'lucide-react';
import { toast } from 'sonner';
import ReusableSortableTable from './ReusableSortableTable';
import DeleteConfirmDialog from './DeleteConfirmDialog';

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
// Only use when preview of image is also necessary in the row
// const ImagePreview = ({ src, alt }) => {
//   if (!src) {
//     return (
//       <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
//         <span className="text-gray-400 text-sm">No Image</span>
//       </div>
//     );
//   }

//   const filename = src.split('/').pop();

//   return (
//     <div className="w-32 h-24 relative">
//       <img
//         src={`http://localhost:8800/uploads/${filename}`}
//         alt={alt}
//         className="w-full h-full object-cover rounded-lg shadow-sm"
//         onError={(e) => {
//           e.target.onerror = null;
//           e.target.src = 'https://placehold.co/128x96?text=No+Image';
//         }}
//       />
//     </div>
//   );
// };

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
          src={`http://localhost:8800/uploads/${filename}`}
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

const Archieves = () => {
  const [flocks, setFlocks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFlocks = async () => {
      try {
        const response = await axios.get('http://localhost:8800/flock', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlocks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flocks:', error);
        toast.error('Failed to fetch flocks');
        setLoading(false);
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

  const userRole = parseInt(localStorage.getItem('userRole'), 10); // Convert the role to an integer
  const handleMarkAsComplete = async (flockId) => {
    try {
      // Dont touch this date otherwise a database error can occur
      await axios.put(
        `http://localhost:8800/flock/${flockId}`,
        { complete_date: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Flock moved to Running FLock successfully');
      // Optionally, refresh the flocks list or remove the completed flock
      setFlocks((prevFlocks) =>
        prevFlocks.filter((flock) => flock.id !== flockId)
      );
    } catch (error) {
      console.error('Error marking flock as complete:', error);
      toast.error('Failed to mark flock as complete');
    }
  };
  const columns = [
    // {
    //   id: 'english_date',
    //   label: 'PlacementDate',
    //   render: (value) => moment(value).format('YYYY-MM-DD'),
    // },
    {
      id: 'english_date',
      label: 'Placement Date',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {moment(value).format('YYYY-MM-DD')}
        </div>
      ),
    },
    {
      id: 'complete_date',
      label: 'Completion Date',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {moment(value).format('YYYY-MM-DD')}
        </div>
      ),
    },
    {
      id: 'flock_id',
      label: 'Flock No',
      render: (value) => (
        <div className="flex justify-center items-center h-full">{value}</div>
      ),
    },
    {
      id: 'username_assigned_to',
      label: 'Assigned To',
      render: (value) => (
        <span className="flex justify-center items-center px-1/3 py-1 text-xs md:text-sm font-medium">
          {value}
        </span>
      ),
    },
    {
      id: 'highest_age',
      label: 'Age',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || 'No Entry'}
        </div>
      ),
    },
    {
      id: 'quantity',
      label: 'Opening Birds',
      render: (value) => (
        <span className="flex justify-center items-center py-1 text-xs md:text-sm font-semibold rounded-full bg-green-100 text-green-800">
          {value.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'total_mortality',
      label: 'Mortality',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || '-'}
        </div>
      ),
    },
    {
      id: 'total_sales',
      label: 'Birds Sold',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || '-'}
        </div>
      ),
    },
    {
      id: 'closing_bird',
      label: 'Closing Birds',
      render: (_, row) => {
        const closing = row.quantity - row.total_sales - row.total_mortality;

        return (
          <div className="flex justify-center items-center py-1 text-xs md:text-sm font-semibold rounded-full bg-red-100 text-red-800">
            {closing > 0 ? closing.toLocaleString() : '0'}
          </div>
        );
      },
    },

    {
      id: 'avg_weight',
      label: 'Avg Weight',
      render: (_, row) => {
        let avgWeight = '-';
        if (row.latest_flock_detail) {
          try {
            const details = JSON.parse(row.latest_flock_detail);
            avgWeight = details.avg_weight ? `${details.avg_weight} kg` : '-';
          } catch (error) {
            console.error(
              'Error parsing latest_flock_detail for average weight:',
              error
            );
            avgWeight = '-';
          }
        }
        return (
          <div className="flex justify-center items-center h-full">
            {avgWeight}
          </div>
        );
      },
    },
    {
      id: 'weight_day',
      label: 'Weight Day',
      render: (_, row) => {
        let weightDay = '-';
        if (row.latest_flock_detail) {
          try {
            const details = JSON.parse(row.latest_flock_detail);
            weightDay = details.weight_age ? `${details.weight_age} days` : '-';
          } catch (error) {
            console.error(
              'Error parsing latest_flock_detail for weight day:',
              error
            );
            weightDay = '-';
          }
        }
        return (
          <div className="flex justify-center items-center h-full">
            {weightDay}
          </div>
        );
      },
    },
    {
      id: 'total_feed_consumption',
      label: 'Total Feed Consumption',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || '-'}
        </div>
      ),
    },
    {
      id: 'fcr',
      label: 'FCR',
      render: (_, row) => {
        let fcr = '-';
        if (row.latest_flock_detail) {
          try {
            const details = JSON.parse(row.latest_flock_detail);
            fcr = details.fcr ? details.fcr.toFixed(4) : '-';
          } catch (error) {
            console.error('Error parsing latest_flock_detail:', error);
            fcr = '-';
          }
        }
        return (
          <div className="flex justify-center items-center h-full">{fcr}</div>
        );
      },
    },
    {
      id: 'caretaker_farmer',
      label: 'Caretaker Farmer',
      render: (value) => (
        <span className="px-2 py-1 text-xs md:text-sm ">{value}</span>
      ),
    },
    {
      id: 'address',
      label: 'Address',
      render: (value) => (
        <span className="text-gray-800 flex justify-center items-center">
          {value}
        </span>
      ),
    },
    // {
    //   id: 'image_preview',
    //   label: 'Flock Image',
    //   render: (_, row) => (
    //     <div
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         if (row.image_location) {
    //           setSelectedImage(row.image_location);
    //         }
    //       }}
    //     >
    //       <ImagePreview
    //         src={row.image_location}
    //         alt={`Flock ${row.flock_id}`}
    //       />
    //     </div>
    //   ),
    // },
    {
      id: 'image_preview',
      label: 'Flock Image',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (row.image_location) {
              setSelectedImage(row.image_location);
            }
          }}
          className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
            row.image_location
              ? 'text-purple-700 bg-purple-50 hover:bg-purple-100'
              : 'text-gray-500 bg-gray-100 cursor-not-allowed'
          }`}
          disabled={!row.image_location}
        >
          {row.image_location ? 'View Image' : 'No Image'}
        </button>
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
    ...(userRole === 0 || userRole === 1
      ? [
          {
            label: 'Action',
            render: (_, row) => (
              <div className="flex gap-2 items-center">
                <button
                  className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/editflock/${row.id}`);
                  }}
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  className="px-3 py-1 text-white bg-orange-500 rounded hover:bg-yellow-600 flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsComplete(row.id);
                  }}
                >
                  <CircleOff className="w-4 h-4" /> InComplete
                </button>
                <div onClick={(e) => e.stopPropagation()}>
                  <DeleteConfirmDialog
                  // ... existing props
                  />
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];
  const completedFlocks = flocks.filter(
    (flock) => flock.complete_date !== null
  );

  return (
    <div className="max-w-[99%] mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl md:text-3xl font-bold text-[#77B94B] select-none">
          Completed Flocks
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ReusableSortableTable
          columns={columns}
          rows={completedFlocks}
          defaultSortColumn="flock_id"
          navigateOnClick={true}
          getNavigationPath={(row) => `/myflock/${row.id}`}
          loading={loading}
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

export default Archieves;
