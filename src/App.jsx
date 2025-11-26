import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import UserManagementsPage from './UserManagementsPage';
import UserProfilePage from './UserProfilePage';

const App = () => {
  // Fetch the image and display it as a blob URL

  return (
  <Routes>
<Route path="/login"  element={ <LoginPage/>}></Route>
<Route path="/"  element={ <LoginPage/>}></Route>
<Route path="/dashboard" element={<UserManagementsPage />} />
<Route path="/user-profile/:id" element={<UserProfilePage />} />
</Routes>
  );
};

export default App;

