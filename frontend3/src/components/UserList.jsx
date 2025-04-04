import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);
  // const [page, setPage] = useState(0);
  // const [limit, setLimit] = useState(10);
  // const [pages, setUPages] = useState(0);
  // const [rows, setURows] = useState(0);
  // const [Keyword, setKeyword] = useState('');

  const getUser = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/users`, {
      header: { Authorization: `Bearer, ${data.token}` },
    });
    console.log(data);
    setUsers(data.result);
  };

  useEffect(() => {
    getUser();
  }, [users]);

  return (
    <div className="container">
      <form action="">
        <div className="form-group">
          {/* <label className="label">Search</label> */}
          <button className="btn btn-info" type="submit">
            Search
          </button>
          <input type="text" className="search" placeholder="Search..." />
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.gender}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
