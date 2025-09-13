"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUsers, deleteUserById, blockUserById, activateUserById } from '@/services/api';

const WebsiteUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch users function
  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getUsers();
      setUsers(usersData);
      toast.success('Website users loaded successfully!');
    } catch (error) {
      console.error('Error fetching website users:', error);
      toast.error('Failed to load website users');
    } finally {
      setLoading(false);
    }
  };

  // Delete user function
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(`delete-${userId}`);
      await deleteUserById(userId);
      setUsers(prev => prev.filter(user => user._id !== userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Block user function
  const blockUser = async (userId) => {
    try {
      setActionLoading(`block-${userId}`);
      const response = await blockUserById(userId);
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, status: 'blocked' } : user
      ));
      toast.success(response.message || 'User blocked successfully!');
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error(`Failed to block user: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Activate user function
  const activateUser = async (userId) => {
    try {
      setActionLoading(`activate-${userId}`);
      const response = await activateUserById(userId);
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, status: 'active' } : user
      ));
      toast.success(response.message || 'User activated successfully!');
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error(`Failed to activate user: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading website users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Website Users Management</h1>
              <p className="text-gray-600 mt-2">Manage all registered website users</p>
              <p className="text-gray-500 text-sm mt-1">Total Users: {users?.length}</p>
            </div>
            <button
              onClick={loadUsers}
              className="bg-[#1e9e9a] hover:bg-[#177e7a] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh Users
            </button>
          </div>
        </div>

        {/* Users List */}
        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Website Users Found</h3>
            <p className="text-gray-500">There are no website users to display at the moment.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Verified
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#78dbd3] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.email.split('@')[0]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 break-all max-w-xs">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isEmailVerified ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => blockUser(user._id)}
                              disabled={actionLoading === `block-${user._id}`}
                              className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                                actionLoading === `block-${user._id}`
                                  ? 'bg-gray-400'
                                  : 'bg-red-600 hover:bg-red-700'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                            >
                              {actionLoading === `block-${user._id}` ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Blocking...
                                </>
                              ) : (
                                'Block'
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => activateUser(user._id)}
                              disabled={actionLoading === `activate-${user._id}`}
                              className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                                actionLoading === `activate-${user._id}`
                                  ? 'bg-gray-400'
                                  : 'bg-green-600 hover:bg-green-700'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                            >
                              {actionLoading === `activate-${user._id}` ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Activating...
                                </>
                              ) : (
                                'Activate'
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => deleteUser(user._id)}
                            disabled={actionLoading === `delete-${user._id}`}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                              actionLoading === `delete-${user._id}`
                                ? 'bg-gray-400'
                                : 'bg-red-600 hover:bg-red-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                          >
                            {actionLoading === `delete-${user._id}` ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                              </>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteUsers;