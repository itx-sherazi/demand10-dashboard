"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  fetchAllCompanyListingRequests, 
  approveCompanyListingRequest, 
  rejectCompanyListingRequest,
  deleteCompanyListingRequest
} from '../../services/api';
import { handleApiError, showSuccess } from '../../utils/errorHandler';

export default function CompanyListings() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    // If it's already a full URL, return as is
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, prepend the API base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    // Remove /api/v1 prefix if it exists in the imagePath since uploads are served directly
    const cleanPath = imagePath.startsWith('/api/v1') ? imagePath.substring(7) : imagePath;
    // For uploads, we need to remove the /api/v1 part from the base URL
    const uploadBaseUrl = baseUrl.replace('/api/v1', '');
    return `${uploadBaseUrl}${cleanPath}`;
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await fetchAllCompanyListingRequests();
      
      if (data.ok) {
        setRequests(data.requests);
      } else {
        handleApiError(new Error(data.message || 'Failed to fetch requests'), 'Fetching Requests');
      }
    } catch (error) {
      handleApiError(error, 'Fetching Requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const data = await approveCompanyListingRequest(requestId);
      
      if (data.ok) {
        showSuccess('Request approved successfully');
        // Update the requests list
        const updatedRequests = requests.map(request => 
          request._id === requestId ? { ...request, status: 'approved' } : request
        );
        setRequests(updatedRequests);
        
        // If modal is open for this request, update it too
        if (selectedRequest && selectedRequest._id === requestId) {
          setSelectedRequest({ ...selectedRequest, status: 'approved' });
        }
      } else {
        handleApiError(new Error(data.message || 'Failed to approve request'), 'Approving Request');
      }
    } catch (error) {
      handleApiError(error, 'Approving Request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const data = await rejectCompanyListingRequest(requestId);
      
      if (data.ok) {
        showSuccess('Request rejected successfully');
        // Update the requests list
        const updatedRequests = requests.map(request => 
          request._id === requestId ? { ...request, status: 'rejected' } : request
        );
        setRequests(updatedRequests);
        
        // If modal is open for this request, update it too
        if (selectedRequest && selectedRequest._id === requestId) {
          setSelectedRequest({ ...selectedRequest, status: 'rejected' });
        }
      } else {
        handleApiError(new Error(data.message || 'Failed to reject request'), 'Rejecting Request');
      }
    } catch (error) {
      handleApiError(error, 'Rejecting Request');
    }
  };

  // Add delete handler
  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this company listing request? This action cannot be undone.')) {
      try {
        const data = await deleteCompanyListingRequest(requestId);
        
        if (data.ok) {
          showSuccess('Listing request deleted successfully');
          // Remove the request from the list
          setRequests(requests.filter(request => request._id !== requestId));
          
          // Close modal if it's open for this request
          if (selectedRequest && selectedRequest._id === requestId) {
            closeModal();
          }
        } else {
          handleApiError(new Error(data.message || 'Failed to delete listing request'), 'Deleting Request');
        }
      } catch (error) {
        handleApiError(error, 'Deleting Request');
      }
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Listings</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ecfc5]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Listings</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No company listing requests found.</p>
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
                  Category
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
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{request.companyEmail}</div>
                    <div>{request.companyPhone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{request.categoryId?.name || 'N/A'}</div>
                    <div className="text-xs">{request.subcategoryId?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <>
                      <button
                        onClick={() => handleApprove(request._id)}
                        className={`mr-3 ${
                          request.status === 'approved' 
                            ? 'text-green-800 bg-green-100 hover:bg-green-200' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        disabled={request.status === 'approved'}
                      >
                        {request.status === 'approved' ? 'Approved ✓' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className={`mr-3 ${
                          request.status === 'rejected' 
                            ? 'text-red-800 bg-red-100 hover:bg-red-200' 
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        disabled={request.status === 'rejected'}
                      >
                        {request.status === 'rejected' ? 'Rejected ✗' : 'Reject'}
                      </button>
                    </>
                    <button
                      onClick={() => handleDelete(request._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="text-blue-600 hover:text-blue-900 ml-3"
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing company details */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Company Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Company Name:</span> {selectedRequest.companyName}</p>
                    <p><span className="font-medium">Email:</span> {selectedRequest.companyEmail}</p>
                    <p><span className="font-medium">Phone:</span> {selectedRequest.companyPhone}</p>
                    <p><span className="font-medium">Website:</span> {selectedRequest.website || 'N/A'}</p>
                    <p><span className="font-medium">Country:</span> {selectedRequest.companyCountry || 'N/A'}</p>
                    <p><span className="font-medium">Founded:</span> {selectedRequest.foundedYear || 'N/A'}</p>
                    <p><span className="font-medium">Employees:</span> {selectedRequest.employees || 'N/A'}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Category Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Category:</span> {selectedRequest.categoryId?.name || 'N/A'}</p>
                    <p><span className="font-medium">Subcategory:</span> {selectedRequest.subcategoryId?.name || 'N/A'}</p>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-3">Social Links</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">LinkedIn:</span> {selectedRequest.linkedinUrl || 'N/A'}</p>
                    <p><span className="font-medium">Facebook:</span> {selectedRequest.facebookUrl || 'N/A'}</p>
                    <p><span className="font-medium">Twitter:</span> {selectedRequest.twitterUrl || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Description</h4>
                  <p className="text-gray-600">{selectedRequest.description || 'No description provided.'}</p>
                </div>
                
                {selectedRequest.image && (
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Company Image</h4>
                    <img 
                      src={getImageUrl(selectedRequest.image)} 
                      alt={selectedRequest.companyName} 
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
                
                {selectedRequest.teamLeads && selectedRequest.teamLeads.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Team Leads</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedRequest.teamLeads.map((lead, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <p><span className="font-medium">Name:</span> {lead.name || 'N/A'}</p>
                          <p><span className="font-medium">Position:</span> {lead.position || 'N/A'}</p>
                          <p><span className="font-medium">LinkedIn:</span> {lead.linkedin || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}