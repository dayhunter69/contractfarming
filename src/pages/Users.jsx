import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8800/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Function to map the role numbers to role names
  const mapRole = (role) => {
    switch (role) {
      case '0':
        return 'Superadmin';
      case '1':
        return 'Admin';
      case '2':
        return 'Line Supervisor';
      default:
        return 'Unknown Role';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">My Flocks</h2>
        <button
          className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate('/adduser')}
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-3 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`cursor-pointer ${
                  index % 2 === 0 ? 'bg-gray-50' : ''
                } hover:bg-gray-200 transition`}
              >
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  {user.username}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {mapRole(user.role)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
