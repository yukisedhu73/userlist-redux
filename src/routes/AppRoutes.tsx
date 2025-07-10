import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Users from '../pages/Users';
import AddEditUser from '../pages/AddEditUser';

const AppRoutes = () => {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {token ? (
          <>
            <Route path="/" element={<Users />} />
            <Route path="/user/add" element={<AddEditUser />} />
            <Route path="/user/edit/:id" element={<AddEditUser />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;