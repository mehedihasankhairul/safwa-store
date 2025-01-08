// src/app/dashboard/page.js
'use client';

import withAuth from "../components/withAuth";

const Dashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
};

export default withAuth(Dashboard, "admin");
