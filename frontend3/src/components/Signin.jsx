import React, { useState } from 'react';

export default function Signin() {
  const [user, setUser] = useState();

  return (
    <div className="container box-border">
      <h2>SIGNIN</h2>
      <form action="">
        <div className="form-group">
          <label>User</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="text" />
        </div>
        <div className="form-button">
          <button className="btn btn-success" type="submit">
            Signin
          </button>
        </div>
      </form>
    </div>
  );
}
