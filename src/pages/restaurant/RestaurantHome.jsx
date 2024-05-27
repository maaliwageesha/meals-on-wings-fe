import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom if using React Router
import './RestaurantStyle.css';

export const RestaurantHome = () => {
  console.log("RestaurantHome component is rendered");
  return (
    <div className="container">
      <nav>
        <ul className="menu">
          <li>
            <Link to="/menu-management">Menu Management</Link>
          </li>
          <li>
            <Link to="/order-history">Order History</Link>
          </li>
          <li>
            <Link to="/ongoing-orders">Ongoing Orders</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}