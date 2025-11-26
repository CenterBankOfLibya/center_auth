import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchData from './Api/FetchApi';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchData(`user-managements/${id}`, 'GET');
        if (data && data.data) {
            setUser(data.data);
        } else {
            setError('User not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchUser();
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!user) return <div className="p-8 text-center text-gray-500">User not found</div>;

  const department = user.department ? user.department.name : (user.department_id || 'N/A');
  const managementLevel = user.management ? user.management.name : (user.management_id || 'N/A');
  
  const roles = user.roles || [];
  const permissions = user.permissions || [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-500">View comprehensive user details</p>
        </div>
        <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
        >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Directory
        </button>
      </div>

      {/* User Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex items-center">
        <div className="h-16 w-16 rounded-md overflow-hidden mr-4">
            <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="h-full w-full object-cover" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 mb-1">@{user.emp_number}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.is_active ? 'Active' : 'Disabled'}
            </span>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4 text-gray-900">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <h3 className="text-lg font-medium">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Full Name</p>
                <p className="text-base text-gray-900">{user.name}</p>
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Username</p>
                <p className="text-base text-gray-900">{user.emp_number}</p>
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                <p className="text-base text-gray-900">{user.email}</p>
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 mb-1">User ID</p>
                <p className="text-base text-gray-900">#{user.id}</p>
            </div>
        </div>
      </div>

      {/* Organization Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4 text-gray-900">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <h3 className="text-lg font-medium">Organization Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Department</p>
                <p className="text-base text-gray-900">{department}</p>
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Management Level</p>
                <p className="text-base text-gray-900">{managementLevel}</p>
            </div>
        </div>
      </div>

      {/* Assigned Permissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-1 text-gray-900">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <h3 className="text-lg font-medium">Assigned Roles</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">{roles.length} roles assigned</p>
        
        <div className="space-y-4">
            {roles.map((role, idx) => (
                <div key={role.id || idx} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{role.name}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Role
                    </span>
                </div>
            ))}
        </div>
      </div>

      {/* System Access */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-1 text-gray-900">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 01-2 2v4a2 2 0 012 2h14a2 2 0 012-2v-4a2 2 0 01-2-2m-2-4h.01M17 16h.01"></path></svg>
            <h3 className="text-lg font-medium">Direct Permissions</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">{permissions.length} permissions granted</p>
        
        <div className="space-y-4">
            {permissions.map((perm, idx) => (
                <div key={perm.id || idx} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{perm.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{perm.full_name}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Permission
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
