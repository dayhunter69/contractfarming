import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ReusableSortableTable from './ReusableSortableTable';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const FlockDetail = () => {
  const { flockId } = useParams();
  const location = useLocation();
  const flock_id = location.state?.flock_id;
  const username_assigned_to = location.state?.username_assigned_to;
  const [flockDetails, setFlockDetails] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userRole = parseInt(localStorage.getItem('userRole'), 10);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flock details:', error);
        setLoading(false);
      }
    };

    fetchFlockDetails();
  }, [flockId, token]);

  const columns = [
    {
      id: 'english_date',
      label: 'Entry Date',
      render: (value) => moment(value).format('YYYY-MM-DD'),
    },
    {
      id: 'age_days',
      label: 'Age (Days)',
      render: (value) => (
        <div className="flex justify-center items-center h-full">{value}</div>
      ),
    },
    {
      id: 'num_birds',
      label: 'Opening Birds',
      render: (value) => (
        <span className="flex justify-center items-center py-1 text-xs md:text-sm font-semibold rounded-full bg-green-100 text-green-800">
          {value.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'total_consumption',
      label: 'Total Consumption',
      render: (_, row) => {
        const bpsConsumption = row.bps_consumption || 0;
        const b1Consumption = row.b1_consumption || 0;
        const b2Consumption = row.b2_consumption || 0;
        const totalConsumption = bpsConsumption + b1Consumption + b2Consumption;

        return (
          <div className="flex justify-center items-center h-full font-semibold">
            {totalConsumption > 0 ? totalConsumption.toLocaleString() : '-'}
          </div>
        );
      },
    },
    {
      id: 'generated_fcr',
      label: 'FCR',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || '-'}
        </div>
      ),
    },
    {
      id: 'mortality_birds',
      label: 'Num Mortality',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || '-'}
        </div>
      ),
    },
    {
      id: 'mortality_percentage',
      label: 'Mortality %',
      render: (_, row) => {
        const numOfBirds = row.num_birds || 0;
        const mortality = row.mortality_birds || 0;
        const percentage = (mortality / numOfBirds) * 100;

        return (
          <div className="flex justify-center items-center h-full font-semibold">
            {percentage > 0 ? percentage.toLocaleString() + '%' : '-'}
          </div>
        );
      },
    },
    {
      id: 'number_of_birds_sold',
      label: 'Sale Market',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || 0}
        </div>
      ),
    },
    {
      id: 'closing_birds',
      label: 'Closing Birds',
      render: (_, row) => {
        const numOfBirds = row.num_birds || 0;
        const mortality = row.mortality_birds || 0;
        const sales = row.number_of_birds_sold || 0;
        const closing_bird = numOfBirds - mortality - sales;

        return (
          <div className="flex justify-center items-center py-1 text-xs md:text-sm font-semibold rounded-full bg-red-100 text-red-800">
            {closing_bird > 0 ? closing_bird.toLocaleString() : '-'}
          </div>
        );
      },
    },
    {
      id: 'avg_weight',
      label: 'Avg Wt/Bird GRAM',
      render: (value) => (
        <span className="flex justify-center items-center py-1 text-xs md:text-sm font-semibold">
          {value || '-'}
        </span>
      ),
    },

    {
      id: 'total_weight',
      label: 'T_Weight KG',
      render: (_, row) => {
        const closing_birds =
          row.num_birds - row.mortality_birds - row.number_of_birds_sold || 0;
        const avgweight = row.avg_weight || 0;
        const total_weight = (closing_birds * avgweight) / 1000;

        return (
          <div className="flex justify-center items-center h-full font-semibold">
            {total_weight > 0 ? total_weight.toLocaleString() : '-'}
          </div>
        );
      },
    },
    {
      id: 'bps_consumption',
      label: 'BPS Consumption',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || '-'}
        </div>
      ),
    },
    {
      id: 'b1_consumption',
      label: 'B1 Consumption',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || '-'}
        </div>
      ),
    },
    {
      id: 'b2_consumption',
      label: 'B2 Consumption',
      render: (value) => (
        <div className="flex justify-center items-center h-full">
          {value || '-'}
        </div>
      ),
    },

    {
      id: 'net_weight_sold',
      label: 'Wt Sale',
      render: (value) => (
        <span className="text-gray-800 flex justify-center items-center">
          {value || 0}
        </span>
      ),
    },
    {
      id: 'price_per_kg',
      label: 'Rate/KG',
      render: (value) => (
        <span className="text-gray-800 flex justify-center items-center">
          {value || '-'}
        </span>
      ),
    },
    {
      id: 'total_amount',
      label: 'Total Amount',
      render: (_, row) => {
        const wt_sold = row.net_weight_sold || 0;
        const ppkg = row.price_per_kg || 0;
        const amount = wt_sold * ppkg;

        return (
          <div className="flex justify-center items-center h-full font-semibold text-green-500">
            {amount > 0 ? amount.toLocaleString() : '-'}
          </div>
        );
      },
    },
    {
      id: 'mortality_reason',
      label: 'Mortality Reason',
      render: (value) => (
        <span className="text-gray-800 flex justify-center items-center">
          {value || '-'}
        </span>
      ),
    },
    {
      id: 'medicine',
      label: 'Medicine',
      render: (value) => (
        <span className="text-gray-800 flex justify-center items-center">
          {value || '-'}
        </span>
      ),
    },
    ...(userRole === 0 || userRole === 1
      ? [
          {
            label: 'Action',
            render: (_, row) => (
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/editflockdetail/${row.id}`);
                  }}
                >
                  Edit
                </button>
                <div onClick={(e) => e.stopPropagation()}>
                  <DeleteConfirmDialog
                    id={row.id}
                    name={row.flock_id}
                    token={token}
                    endpoint="flock-details"
                    resourceName="Flock Detail"
                    setData={setFlockDetails}
                    consequencesList={[
                      'Permanently delete this flock row',
                      'Remove all associated images: field, feed and mortality',
                      "Delete this row's health records and mortality data",
                      'Erase financial transactions linked to this daily entry',
                    ]}
                  />
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-gray-500 text-lg">No data available</p>
      <p className="text-gray-400 text-sm mt-2">
        Click the 'Daily Entry' button to add new flock details
      </p>
    </div>
  );

  // Conditional rendering based on flockDetails state
  const renderContent = () => {
    // Check if flockDetails is empty (null, undefined, or empty array)
    if (!flockDetails || flockDetails.length === 0) {
      return (
        <div className="max-w-[99%] mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl md:text-3xl font-bold select-none md:ml-0 ml-9 capitalize">
              {flock_id} {username_assigned_to}
            </h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md select-none"
              onClick={() => navigate(`/myflock/${flockId}/addflockdetail/`)}
            >
              Daily Entry
            </button>
          </div>
          <EmptyState />
        </div>
      );
    }
    // Render the table if there are rows
    return (
      <div className="max-w-[99%] mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl md:text-3xl font-bold select-none md:ml-0 ml-9 capitalize">
            {flock_id} {username_assigned_to}
          </h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md select-none"
            onClick={() => navigate(`/myflock/${flockId}/addflockdetail/`)}
          >
            Daily Entry
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <ReusableSortableTable
            columns={columns}
            rows={flockDetails}
            defaultSortColumn="age_days"
            navigateOnClick={true}
            getNavigationPath={(row) => `/myflock/${flockId}/${row.id}`}
            loading={loading}
          />
        </div>
      </div>
    );
  };

  return renderContent();
};

export default FlockDetail;
