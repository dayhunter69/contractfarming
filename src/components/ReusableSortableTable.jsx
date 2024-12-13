import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Printer, ChevronDown, Search } from 'lucide-react';

const TableSkeleton = ({ columns, rowCount = 5 }) => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>

      {/* Table Header Skeleton */}
      <div className="grid grid-flow-col gap-4 mb-4">
        {Array(columns)
          .fill(0)
          .map((_, idx) => (
            <div
              key={`header-skeleton-${idx}`}
              className="h-10 bg-gray-200 rounded"
            ></div>
          ))}
      </div>

      {/* Table Rows Skeleton */}
      {Array(rowCount)
        .fill(0)
        .map((_, rowIdx) => (
          <div
            key={`row-skeleton-${rowIdx}`}
            className="grid grid-flow-col gap-4 mb-20"
          >
            {Array(columns)
              .fill(0)
              .map((_, colIdx) => (
                <div
                  key={`cell-skeleton-${rowIdx}-${colIdx}`}
                  className="h-1 bg-gray-200 rounded relative overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};
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
          className={`inline-flex items-center justify-center w-full rounded-md px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 focus:outline-none select-none ${
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
          className="origin-top-right absolute ml-1 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const ReusableSortableTable = ({
  columns,
  rows,
  defaultSortColumn = '',
  navigateOnClick,
  getNavigationPath,
  loading = true, // New loading prop
}) => {
  const [orderBy, setOrderBy] = useState(defaultSortColumn);
  const [order, setOrder] = useState('asc');
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.id)
  );
  // const [filterColumn, setFilterColumn] = useState('');
  // const [filterValue, setFilterValue] = useState('');
  const [density, setDensity] = useState('standard');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // New state for global search
  const [globalSearchValue, setGlobalSearchValue] = useState('');

  const navigate = useNavigate();

  const handleSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (row) => {
    if (navigateOnClick && getNavigationPath) {
      const path = getNavigationPath(row);
      navigate(path, {
        state: {
          flock_id: row.flock_id,
          username_assigned_to: row.username_assigned_to,
        },
      });
    }
  };

  const handleColumnToggle = (columnId) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  // const handleFilterChange = (e) => {
  //   setFilterValue(e.target.value);
  // };

  const handleDensityChange = (newDensity) => {
    setDensity(newDensity);
    setActiveDropdown(null);
  };

  const handleGlobalSearchChange = (e) => {
    setGlobalSearchValue(e.target.value);
  };

  const exportCSV = () => {
    const headers = visibleColumns
      .map((id) => columns.find((col) => col.id === id).label)
      .join(',');
    const csvContent = [
      headers,
      ...filteredSortedRows.map((row) =>
        visibleColumns.map((id) => row[id]).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'table_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print Table</title>');
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

  const filteredSortedRows = useMemo(() => {
    let result = rows;

    // Global search functionality
    if (globalSearchValue) {
      const searchTerm = globalSearchValue.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) =>
          String(row[col.id]).toLowerCase().includes(searchTerm)
        )
      );
    }

    // Column-specific filter
    // if (filterColumn && filterValue) {
    //   result = result.filter((row) =>
    //     String(row[filterColumn])
    //       .toLowerCase()
    //       .includes(filterValue.toLowerCase())
    //   );
    // }

    // Sorting
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
  }, [rows, globalSearchValue, orderBy, order, columns]);

  const densityClasses = {
    compact: 'py-1/2',
    standard: 'py-1',
    comfortable: 'py-2',
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Skeleton buttons */}
          <div className="flex gap-2">
            {['COLUMNS', 'DENSITY', 'EXPORT'].map((label) => (
              <div
                key={label}
                className="h-10 w-24 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
          {/* Skeleton search */}
          <div className="w-48 h-10 bg-gray-200 rounded animate-pulse ml-auto"></div>
        </div>

        <div className="overflow-x-auto">
          <TableSkeleton
            columns={
              columns.filter((col) => visibleColumns.includes(col.id)).length
            }
            rowCount={7}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center bg-gray-900 text-white p-2 rounded-md">
        <div className="flex flex-wrap gap-2 mb-2 sm:mb-0 items-center">
          <Dropdown
            label="COLUMNS"
            isOpen={activeDropdown === 'COLUMNS'}
            setIsOpen={(isOpen) => setActiveDropdown(isOpen ? 'COLUMNS' : null)}
            setActiveDropdown={setActiveDropdown}
          >
            {columns.map((col) => (
              <label
                key={`column-toggle-${col.id}`} // Add a unique key here
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

          {/* <Dropdown
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
                  <option key={`filter-${col.id}`} value={col.id}>
                    {' '}
                    // Add a unique key here
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
          </Dropdown> */}

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

          {/* Global Search Input */}
          <div className="relative flex-grow max-w-xs ml-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search all columns..."
              value={globalSearchValue}
              onChange={handleGlobalSearchChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto relative h-[82vh]">
        <table className="min-w-full bg-white border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-900">
            <tr>
              {columns
                .filter((col) => visibleColumns.includes(col.id))
                .map((column) => (
                  <th
                    key={`header-${column.id}`}
                    className="bg-gray-900 text-white px-4 py-2 text-center text-xs font-medium uppercase tracking-wider cursor-pointer select-none border-x border-gray-700 relative group hover:bg-gray-800 transition-colors"
                    onClick={handleSort(column.id)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {column.label}
                      {orderBy === column.id && (
                        <span className="text-gray-300">
                          {order === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredSortedRows.map((row, index) => (
              <tr
                key={row.id || `row-${index}`}
                className={
                  'cursor-pointer bg-gray-50 hover:bg-green-100 transition'
                }
                onClick={() => handleRowClick(row)}
              >
                {columns
                  .filter((col) => visibleColumns.includes(col.id))
                  .map((column) => (
                    <td
                      key={`cell-${row.id || index}-${column.id}`}
                      className={`px-1 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-200 ${densityClasses[density]}`}
                    >
                      {column.render
                        ? column.render(row[column.id], row)
                        : row[column.id]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReusableSortableTable;
