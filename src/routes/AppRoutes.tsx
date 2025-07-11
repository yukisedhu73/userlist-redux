import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Users from '../pages/Users';
import AddEditUser  from '../pages/AddEditUser';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* All protected routes go inside this */}
        <Route element={<PrivateRoute />}>
          <Route path="/users" element={<Users />} />
          <Route path="/user/add" element={<AddEditUser />} />
          <Route path="/user/edit/:id" element={<AddEditUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
