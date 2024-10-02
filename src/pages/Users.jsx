import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ReusableSortableTable from '../components/ReusableSortableTable';

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

  const columns = [
    { id: 'username', label: 'Username', minWidth: 170 },
    { id: 'role', label: 'Role', minWidth: 130 },
  ];

  const rows = users.map((user) => ({
    username: user.username,
    role: mapRole(user.role),
  }));

  return (
    <div>
      <div className="flex justify-between items-center mx-5 mb-3">
        <h2>Users</h2>
        <Button variant="contained" onClick={() => navigate('/adduser')}>
          Add User
        </Button>
      </div>
      <div className="w-[98%] justify-center items-center mx-auto">
        <ReusableSortableTable
          columns={columns}
          rows={rows}
          defaultSortColumn="username"
        />
      </div>
    </div>
  );
};

export default UserList;
