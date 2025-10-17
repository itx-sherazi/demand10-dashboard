"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { fetchAllCompanyClaims, approveCompanyClaim, rejectCompanyClaim, deleteCompanyClaim } from '../../services/api';
import { handleApiError, showSuccess } from '../../utils/errorHandler';

export default function CompanyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const data = await fetchAllCompanyClaims();
      
      if (data.ok) {
        setClaims(data.claims);
      } else {
        handleApiError(new Error(data.message || 'Failed to fetch claims'), 'Fetching Claims');
      }
    } catch (error) {
      handleApiError(error, 'Fetching Claims');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (claimId) => {
    try {
      const data = await approveCompanyClaim(claimId);
      
      if (data.ok) {
        showSuccess('Claim approved successfully');
        // Update the claims list
        setClaims(claims.map(claim => 
          claim._id === claimId ? { ...claim, status: 'approved' } : claim
        ));
      } else {
        handleApiError(new Error(data.message || 'Failed to approve claim'), 'Approving Claim');
      }
    } catch (error) {
      handleApiError(error, 'Approving Claim');
    }
  };

  const handleReject = async (claimId) => {
    try {
      const data = await rejectCompanyClaim(claimId);
      
      if (data.ok) {
        showSuccess('Claim rejected successfully');
        // Update the claims list
        setClaims(claims.map(claim => 
          claim._id === claimId ? { ...claim, status: 'rejected' } : claim
        ));
      } else {
        handleApiError(new Error(data.message || 'Failed to reject claim'), 'Rejecting Claim');
      }
    } catch (error) {
      handleApiError(error, 'Rejecting Claim');
    }
  };

  // Add delete handler
  const handleDelete = async (claimId) => {
    if (window.confirm('Are you sure you want to delete this company claim? This action cannot be undone.')) {
      try {
        const data = await deleteCompanyClaim(claimId);
        
        if (data.ok) {
          showSuccess('Claim deleted successfully');
          // Remove the claim from the list
          setClaims(claims.filter(claim => claim._id !== claimId));
        } else {
          handleApiError(new Error(data.message || 'Failed to delete claim'), 'Deleting Claim');
        }
      } catch (error) {
        handleApiError(error, 'Deleting Claim');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Claims</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a365d]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Claims</h2>
      
      {claims.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No company claims found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{claim.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{claim.userName}</div>
                    <div className="text-sm text-gray-500">{claim.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {claim.userPhone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                      claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <>
                      <button
                        onClick={() => handleApprove(claim._id)}
                        className={`mr-3 ${
                          claim.status === 'approved' 
                            ? 'text-green-800 bg-green-100 hover:bg-green-200' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        disabled={claim.status === 'approved'}
                      >
                        {claim.status === 'approved' ? 'Approved ✓' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(claim._id)}
                        className={`mr-3 ${
                          claim.status === 'rejected' 
                            ? 'text-red-800 bg-red-100 hover:bg-red-200' 
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        disabled={claim.status === 'rejected'}
                      >
                        {claim.status === 'rejected' ? 'Rejected ✗' : 'Reject'}
                      </button>
                    </>
                    {/* Add delete button for all claims */}
                    <button
                      onClick={() => handleDelete(claim._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}