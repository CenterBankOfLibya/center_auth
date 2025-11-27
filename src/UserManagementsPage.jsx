import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchData from './Api/FetchApi';
  // Roles state for assigning roles
  // // Permission management state




  // Fetch all roles when needed
const UserManagementsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(10);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [management, setManagement] = useState('');
  const [managements, setManagements] = useState([]);
  const [status, setStatus] = useState('');
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRoleUserId, setSelectedRoleUserId] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [assignRoleLoading, setAssignRoleLoading] = useState(false);
  const [assignRoleError, setAssignRoleError] = useState(null);
  const [assignRoleSuccess, setAssignRoleSuccess] = useState(null);
  const [users, setUsers] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const openRoleModal = async (userId) => {
    setSelectedRoleUserId(userId);
    setShowRoleModal(true);
    setSelectedRoleId('');
    setAssignRoleError(null);
    setAssignRoleSuccess(null);
    setRolesLoading(true);
    setRolesError(null);
    try {
      const data = await fetchData('roles', 'GET');
      setRoles(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setRolesError(err.message || 'Failed to fetch roles');
    } finally {
      setRolesLoading(false);
    }
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedRoleUserId(null);
    setSelectedRoleId('');
    setAssignRoleError(null);
    setAssignRoleSuccess(null);
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!selectedRoleId) return;
    setAssignRoleLoading(true);
    setAssignRoleError(null);
    setAssignRoleSuccess(null);
    try {
      await fetchData(`roles/${selectedRoleId}/users?per_page=${page}`, 'POST', JSON.stringify({ users_id: [selectedRoleUserId] }));
      setAssignRoleSuccess('Role assigned successfully.');
      // Optionally refresh users list to reflect new role
      const data = await fetchData('user-managements', 'GET');
      setUsers(Array.isArray(data) ? data : data.data || []);
      setShowRoleModal(false);
    } catch (err) {
      setAssignRoleError(err.message || 'Failed to assign role');
    } finally {
      setAssignRoleLoading(false);
    }
  };
  useEffect(() => {
    const fetchManagements = async () => {
      try {
        const data = await fetchData('systems/managements?list', 'GET');
        setManagements(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Failed to fetch managements', err);
      }
    };
    fetchManagements();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = `user-managements?per_page=${page}`;
        if (search) query += `&filter[search]=${search}`;
        if (management) query += `&filter[management.name]=${management}`;
        if (status) query += `&filter[is_active]=${status}`;

        const data = await fetchData(query, 'GET');
        setUsers(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch user managements');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [page, search, management, status]);

  // Password update state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const openPasswordModal = (userId) => {
    setSelectedUserId(userId);
    setNewPassword('');
    setPasswordError(null);
    setPasswordSuccess(null);
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUserId(null);
    setNewPassword('');
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      await fetchData(`user-managements/${selectedUserId}/password`, 'PUT', JSON.stringify({ password: newPassword }));
      setPasswordSuccess('Password updated successfully.');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Toggle active state
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [toggleError, setToggleError] = useState(null);

  const handleToggleActive = async (userId) => {
    setToggleLoadingId(userId);
    setToggleError(null);
    try {
      await fetchData(`user-managements/${userId}/active-toggle`, 'PUT');
      setUsers(users => users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
    } catch (err) {
      setToggleError(err.message || 'Failed to toggle active state');
    } finally {
      setToggleLoadingId(null);
    }
  };

  // Create user state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ emp_number: '', email: '', password: '', name: '' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(null);
    try {
      const body = {
        emp_number: createForm.emp_number,
        email: createForm.email,
        password: createForm.password,
        name: createForm.name,
      };
      await fetchData('user-managements', 'POST', JSON.stringify(body));
      setCreateSuccess('User created successfully.');
      setCreateForm({ emp_number: '', email: '', password: '', name: '' });
      // Refresh users list
      const data = await fetchData('user-managements?per_page=1000', 'GET');
      setUsers(Array.isArray(data) ? data : data.data || []);
      setShowCreateForm(false);
    } catch (err) {
      setCreateError(err.message || 'Failed to create user');
    } finally {
      setCreateLoading(false);
    }
  };
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionUserId, setPermissionUserId] = useState(null);
  const [permissionRoleId, setPermissionRoleId] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState(null);
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const [assignPermissionLoading, setAssignPermissionLoading] = useState(false);
  const [assignPermissionError, setAssignPermissionError] = useState(null);
  const [assignPermissionSuccess, setAssignPermissionSuccess] = useState(null);

  // Open permission modal for user
  const openPermissionModal = (userId, userRoles) => {
    setPermissionUserId(userId);
    setShowPermissionModal(true);
    setPermissionRoleId('');
    setPermissions([]);
    setPermissionsError(null);
    setSelectedPermissionId('');
    setAssignPermissionError(null);
    setAssignPermissionSuccess(null);
  };

  // Fetch permissions for selected role
  const handleRoleSelect = async (roleId) => {
    setPermissionRoleId(roleId);
    setPermissionsLoading(true);
    setPermissionsError(null);
    setPermissions([]);
    setSelectedPermissionId('');
    try {
      const data = await fetchData(`roles/${roleId}/permissions`, 'GET');
      setPermissions(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setPermissionsError(err.message || 'Failed to fetch permissions');
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Assign permission to user for role
  const handleAssignPermission = async (e) => {
    e.preventDefault();
    if (!permissionRoleId || !selectedPermissionId) return;
    setAssignPermissionLoading(true);
    setAssignPermissionError(null);
    setAssignPermissionSuccess(null);
    try {
      await fetchData(`roles/${permissionRoleId}/permissions/${selectedPermissionId}/users`, 'POST', JSON.stringify({ users: [permissionUserId] }));
      setAssignPermissionSuccess('Permission assigned successfully.');
      // Optionally refresh users list
      const data = await fetchData('user-managements', 'GET');
      setUsers(Array.isArray(data) ? data : data.data || []);
      setShowPermissionModal(false);
    } catch (err) {
      setAssignPermissionError(err.message || 'Failed to assign permission');
    } finally {
      setAssignPermissionLoading(false);
    }
  };

  const closePermissionModal = () => {
    setShowPermissionModal(false);
    setPermissionUserId(null);
    setPermissionRoleId('');
    setPermissions([]);
    setPermissionsError(null);
    setSelectedPermissionId('');
    setAssignPermissionError(null);
    setAssignPermissionSuccess(null);
  };

  const handleRemoveRole = async (userId, roleId) => {
    if (!window.confirm('Are you sure you want to remove this role?')) return;
    try {
      await fetchData(`roles/${roleId}/users`, 'DELETE' , JSON.stringify({ users_id: [userId] }));
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, roles: user.roles.filter(r => r.id !== roleId) };
        }
        return user;
      }));
    } catch (err) {
      alert(err.message || 'Failed to remove role');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              <span className="font-medium">User Management System</span>
           </div>
           <h1 className="text-3xl font-bold text-gray-900">User Directory</h1>
           <p className="text-gray-500">Manage and view all system users</p>
        </div>
        <div className="flex items-center space-x-4">
           <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center shadow-sm"
            onClick={() => setShowCreateForm((v) => !v)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            {showCreateForm ? 'Cancel' : 'Add New User'}
          </button>
           <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://i.pravatar.cc/150?img=12" alt="Admin" className="h-full w-full object-cover" />
           </div>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateUser} className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
                <input
                type="text"
                name="emp_number"
                value={createForm.emp_number}
                onChange={handleCreateChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                type="text"
                name="name"
                value={createForm.name}
                onChange={handleCreateChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                type="email"
                name="email"
                value={createForm.email}
                onChange={handleCreateChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                type="password"
                name="password"
                value={createForm.password}
                onChange={handleCreateChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>
          </div>
          {createError && <div className="text-red-600 text-sm mt-4">{createError}</div>}
          {createSuccess && <div className="text-green-600 text-sm mt-4">{createSuccess}</div>}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div className="flex-1 max-w-2xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Search Users</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                            type="text" 
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" 
                            placeholder="Search by name, username, or department..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-40">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">management</label>
                        <select 
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={management}
                            onChange={(e) => setManagement(e.target.value)}
                        >
                            <option value="">All management</option>
                           {
                            managements.map((management) => (
                                <option key={management.id} value={management.name}>{management.name}</option>
                            ))
                           }
                        </select>
                    </div>
                    <div className="w-40">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select 
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="1">Active</option>
                            <option value="0">Disabled</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        Showing 1 to 5 of 5 users
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Rows per page:</span>
                        <select 
                        onChange={
                            (e) => setPage(parseInt(e.target.value))
                        }
                        className="border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 py-1">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                               <option>100</option>
                                  <option>500</option>
                                     <option>1000</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* Table Section */}
        {loading && <div className="p-8 text-center text-gray-500">Loading users...</div>}
        {error && <div className="p-8 text-center text-red-600">{error}</div>}
        {toggleError && <div className="p-4 text-center text-red-600 bg-red-50">{toggleError}</div>}
        
        {!loading && !error && (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">managements</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Management Level</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Systems Access</th>

                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><span className="">Actions</span></th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                    <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
                    </tr>
                ) : (
                    users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              
                                <div className="ml-4">
                                    <div 
                                        className="text-sm font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                                        onClick={() => navigate(`/user-profile/${user.id}`)}
                                    >
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.emp_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {/* Placeholder for Department */}
                      {
                        user.management.name
                      }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {/* Placeholder for Management Level */}
                       {
                        user.department.name
                       }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                                user.id === 4 ? 'bg-yellow-100 text-yellow-800' : 
                                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {user.id === 4 ? (
                                     <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Pending
                                     </span>
                                ) : user.is_active ? (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Disabled
                                    </span>
                                )}
                            </span>
                        </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {/* Placeholder for Systems Access */}
                             <div className="flex gap-2">

                                {user.roles.map((perm) => (
                                    <span key={perm.id} className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium  ${
                                        perm.id == '1' ? ' bg-blue-200' :
                                        perm.id == '2' ? '  bg-green-200' :
                                        perm.id == '3' ? ' bg-yellow-200' :
                                        perm.id == '4' ? ' bg-red-200' :
                                        perm.id == '5' ? ' bg-purple-200' :
                                        perm.id == '6' ? ' bg-pink-200' :
                                        perm.id == '7' ? ' bg-indigo-200' :
                                        perm.id == '8' ? ' bg-teal-200' :
                                        'bg-gray-200'
                                    } text-gray-600 `}>
                                        {perm.name} 
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveRole(user.id, perm.id);
                                            }}
                                            className="ml-1.5 text-gray-500 hover:text-red-600 focus:outline-none"
                                            title="Remove Role"
                                        >
                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                             </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {/* Placeholder for Systems Access */}
                             <div className="flex gap-2">

                                {user.permissions.map((perm) => (
                                    <span key={perm.id} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border border-gray-200 text-gray-600 bg-white">
                                        {perm.name} - {perm.full_name}
                                    </span>
                                ))}
                             </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative inline-block text-left">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdownId(openDropdownId === user.id ? null : user.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                    </svg>
                                </button>
                                {/* Dropdown Menu */}
                                {openDropdownId === user.id && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setOpenDropdownId(null);
                                                navigate(`/user-profile/${user.id}`);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOpenDropdownId(null);
                                                openPasswordModal(user.id);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Update Password
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOpenDropdownId(null);
                                                handleToggleActive(user.id);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${user.is_active ? 'text-red-600' : 'text-green-600'}`}
                                            disabled={toggleLoadingId === user.id}
                                        >
                                            {user.is_active ? 'Deactivate User' : 'Activate User'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOpenDropdownId(null);
                                                openRoleModal(user.id);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Assign Role
                                        </button>
                                        <button
                                            onClick={() => {
                                                setOpenDropdownId(null);
                                                openPermissionModal(user.id, user.roles);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Manage Permissions
                                        </button>
                                    </div>
                                </div>
                                )}
                            </div>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        )}
      </div>

      {/* Modals (Keep existing logic, just ensure they render correctly on top) */}
      {/* Add Role Modal */}
          {showRoleModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">Assign Role to User</h2>
                {rolesLoading ? (
                  <div>Loading roles...</div>
                ) : rolesError ? (
                  <div className="text-red-600 text-sm mb-2">{rolesError}</div>
                ) : (
                  <form onSubmit={handleAssignRole}>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                      value={selectedRoleId}
                      onChange={e => setSelectedRoleId(e.target.value)}
                      required
                    >
                      <option value="">Select a role</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                    {assignRoleError && <div className="text-red-600 text-sm mb-2">{assignRoleError}</div>}
                    {assignRoleSuccess && <div className="text-green-600 text-sm mb-2">{assignRoleSuccess}</div>}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={closeRoleModal}
                        disabled={assignRoleLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        disabled={assignRoleLoading || !selectedRoleId}
                      >
                        {assignRoleLoading ? 'Assigning...' : 'Assign Role'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Password Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">Update Password</h2>
                <form onSubmit={handlePasswordUpdate}>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                    placeholder="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                  {passwordError && <div className="text-red-600 text-sm mb-2">{passwordError}</div>}
                  {passwordSuccess && <div className="text-green-600 text-sm mb-2">{passwordSuccess}</div>}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={closePasswordModal}
                      disabled={passwordLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      disabled={passwordLoading || !newPassword}
                    >
                      {passwordLoading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Manage Permissions Modal */}
          {showPermissionModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
              <div className="bg-white p-6 w-full max-w-md rounded shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Assign Permission to User</h2>
                <form onSubmit={handleAssignPermission}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Select Role</label>
                    <select
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={permissionRoleId}
                      onChange={e => handleRoleSelect(e.target.value)}
                      required
                    >
                      <option value="">Select a role</option>
                      {users.find(u => u.id === permissionUserId)?.roles?.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  {permissionsLoading && <div>Loading permissions...</div>}
                  {permissionsError && <div className="text-red-600 text-sm mb-2">{permissionsError}</div>}
                  {permissionRoleId && permissions.length > 0 && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Select Permission</label>
                      <select
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={selectedPermissionId}
                        onChange={e => setSelectedPermissionId(e.target.value)}
                        required
                      >
                        <option value="">Select a permission</option>
                        {permissions.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {assignPermissionError && <div className="text-red-600 text-sm mb-2">{assignPermissionError}</div>}
                  {assignPermissionSuccess && <div className="text-green-600 text-sm mb-2">{assignPermissionSuccess}</div>}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={closePermissionModal}
                      disabled={assignPermissionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                      disabled={assignPermissionLoading || !permissionRoleId || !selectedPermissionId}
                    >
                      {assignPermissionLoading ? 'Assigning...' : 'Assign Permission'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    </div>
  );
};

export default UserManagementsPage;
