import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setUPages] = useState(0);
  const [rows, setURows] = useState(0);
  const [Keyword, setKeyword] = useState('');

  const getUser = async () => {
    const response = await axios.get(`http://localhost:5000/api/users`);
    setUsers(response.data.result);
  };

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
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
