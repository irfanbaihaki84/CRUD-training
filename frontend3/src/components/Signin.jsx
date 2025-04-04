import React, { useState } from 'react';
import axios from 'axios';

export default function Signin() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async () => {
    // e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/signin',
        {
          username,
          password,
        }
      );
      console.log(data);
      // localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      console.log({ message: error });
    }
  };

  return (
    <div className="container box-border">
      <h2>SIGNIN</h2>
      <form action={submitHandler}>
        <div className="form-group">
          <label>User</label>
          <input
            type="text"
            placeholder="User Name"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="text"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-button">
          <button className="btn btn-success" type="submit">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
