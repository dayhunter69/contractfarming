import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Download, Printer, ChevronDown, Filter } from 'lucide-react';

const Dropdown = ({
  label,
  icon: Icon,
  children,
  isOpen,
  setIsOpen,
  setActiveDropdown,
}) => {
  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setActiveDropdown(label);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className={`inline-flex items-center justify-center w-full rounded-md px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 focus:outline-none ${
            isOpen
              ? 'ring-2 ring-offset-2 ring-offset-gray-100 ring-indigo-500'
              : ''
          }`}
          onClick={handleToggle}
        >
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {label}
          <ChevronDown
            className={`ml-2 h-5 w-5 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const FlockDetail = () => {
  const { flockId } = useParams();
  const [flockDetails, setFlockDetails] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [orderBy, setOrderBy] = useState('english_date');
  const [order, setOrder] = useState('asc');
  const [visibleColumns, setVisibleColumns] = useState([
    'nepali_date',
    'english_date',
    'age_days',
    'num_birds',
    'mortality_birds',
    'mortality_reason',
    'medicine',
  ]);
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [density, setDensity] = useState('standard');
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  const handleSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleColumnToggle = (columnId) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleDensityChange = (newDensity) => {
    setDensity(newDensity);
    setActiveDropdown(null);
  };

  const exportCSV = () => {
    const headers = visibleColumns.join(',');
    const csvContent = [
      headers,
      ...filteredSortedFlockDetails.map((detail) =>
        visibleColumns.map((id) => detail[id]).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'flock_details.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(
      '<html><head><title>Print Flock Details</title>'
    );
    printWindow.document.write(
      '<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write(
      document.querySelector('.table-container').innerHTML
    );
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const filteredSortedFlockDetails = useMemo(() => {
    let result = flockDetails;

    if (filterColumn && filterValue) {
      result = result.filter((detail) =>
        String(detail[filterColumn])
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    if (orderBy) {
      result.sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return order === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return order === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    return result;
  }, [flockDetails, filterColumn, filterValue, orderBy, order]);

  const densityClasses = {
    compact: 'py-2',
    standard: 'py-4',
    comfortable: 'py-6',
  };

  const columns = [
    { id: 'nepali_date', label: 'Nepali Date' },
    { id: 'english_date', label: 'English Date' },
    { id: 'age_days', label: 'Age (Days)' },
    { id: 'num_birds', label: 'Number of Birds' },
    { id: 'mortality_birds', label: 'Mortality' },
    { id: 'mortality_reason', label: 'Mortality Reason' },
    { id: 'medicine', label: 'Medicine' },
  ];

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

      <div className="flex flex-wrap justify-between items-center bg-gray-900 text-white p-2 rounded-md mb-4">
        <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
          <Dropdown
            label="COLUMNS"
            isOpen={activeDropdown === 'COLUMNS'}
            setIsOpen={(isOpen) => setActiveDropdown(isOpen ? 'COLUMNS' : null)}
            setActiveDropdown={setActiveDropdown}
          >
            {columns.map((col) => (
              <label
                key={col.id}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col.id)}
                  onChange={() => handleColumnToggle(col.id)}
                  className="mr-2"
                />
                {col.label}
              </label>
            ))}
          </Dropdown>

          <Dropdown
            label="FILTERS"
            icon={Filter}
            isOpen={activeDropdown === 'FILTERS'}
            setIsOpen={(isOpen) => setActiveDropdown(isOpen ? 'FILTERS' : null)}
            setActiveDropdown={setActiveDropdown}
          >
            <div className="px-4 py-2">
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="w-full border rounded px-2 py-1 mb-2 text-gray-700"
              >
                <option value="">Select column to filter</option>
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={filterValue}
                onChange={handleFilterChange}
                placeholder="Filter value"
                className="w-full border rounded px-2 py-1 text-gray-700"
              />
            </div>
          </Dropdown>

          <Dropdown
            label="DENSITY"
            isOpen={activeDropdown === 'DENSITY'}
            setIsOpen={(isOpen) => setActiveDropdown(isOpen ? 'DENSITY' : null)}
            setActiveDropdown={setActiveDropdown}
          >
            {['Compact', 'Standard', 'Comfortable'].map((option) => (
              <button
                key={option.toLowerCase()}
                onClick={() => handleDensityChange(option.toLowerCase())}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {option}
              </button>
            ))}
          </Dropdown>

          <Dropdown
            label="EXPORT"
            isOpen={activeDropdown === 'EXPORT'}
            setIsOpen={(isOpen) => setActiveDropdown(isOpen ? 'EXPORT' : null)}
            setActiveDropdown={setActiveDropdown}
          >
            <button
              onClick={() => {
                exportCSV();
                setActiveDropdown(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
            >
              <Download size={16} className="mr-2" /> Download as CSV
            </button>
            <button
              onClick={() => {
                printTable();
                setActiveDropdown(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
            >
              <Printer size={16} className="mr-2" /> Print
            </button>
          </Dropdown>
        </div>
      </div>
      <div className="overflow-x-auto table-container">
        {filteredSortedFlockDetails.length > 0 ? (
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                {columns
                  .filter((col) => visibleColumns.includes(col.id))
                  .map((column) => (
                    <th
                      key={column.id}
                      className="bg-black text-white px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={handleSort(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id && (
                        <span className="ml-1">
                          {order === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredSortedFlockDetails.map((detail, index) => (
                <tr
                  key={detail.id}
                  className={`cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition`}
                  onClick={() => handleRowClick(detail)}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.id))
                    .map((column) => (
                      <td
                        key={column.id}
                        className={`px-6 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-200 ${densityClasses[density]}`}
                      >
                        {column.id === 'english_date'
                          ? moment(detail[column.id]).format('YYYY-MM-DD')
                          : detail[column.id]}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No data available</p>
            <p className="text-gray-400 text-sm mt-2">
              Click the 'Daily Entry' button to add new flock details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlockDetail;
