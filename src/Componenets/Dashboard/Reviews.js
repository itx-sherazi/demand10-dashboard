import React, { useState, useEffect } from 'react';
import { fetchAllReviews, approveReview, rejectReview, deleteReview } from '../../services/api';
import { toast } from 'react-hot-toast';
import { handleApiError, showSuccess } from '../../utils/errorHandler';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchAllReviews();
      
      if (data.ok) {
        setReviews(data.reviews);
      } else {
        handleApiError(new Error('Failed to fetch reviews'), 'Fetching Reviews');
      }
    } catch (err) {
      handleApiError(err, 'Fetching Reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const data = await approveReview(reviewId);
      
      if (data.ok) {
        // Update the review status in the local state
        setReviews(reviews.map(review => 
          review._id === reviewId 
            ? { ...review, status: 'approved', approvedAt: new Date(), approvedBy: data.review.approvedBy } 
            : review
        ));
        
        // If the modal is open for this review, update it too
        if (selectedReview && selectedReview._id === reviewId) {
          setSelectedReview({
            ...selectedReview,
            status: 'approved',
            approvedAt: new Date(),
            approvedBy: data.review.approvedBy
          });
        }
        
        showSuccess('Review approved successfully');
      } else {
        handleApiError(new Error('Failed to approve review'), 'Approving Review');
      }
    } catch (err) {
      handleApiError(err, 'Approving Review');
    }
  };

  const handleReject = async (reviewId) => {
    try {
      const data = await rejectReview(reviewId);
      
      if (data.ok) {
        // Update the review status in the local state
        setReviews(reviews.map(review => 
          review._id === reviewId 
            ? { ...review, status: 'rejected', approvedAt: new Date(), approvedBy: data.review.approvedBy } 
            : review
        ));
        
        // If the modal is open for this review, update it too
        if (selectedReview && selectedReview._id === reviewId) {
          setSelectedReview({
            ...selectedReview,
            status: 'rejected',
            approvedAt: new Date(),
            approvedBy: data.review.approvedBy
          });
        }
        
        showSuccess('Review rejected successfully');
      } else {
        handleApiError(new Error('Failed to reject review'), 'Rejecting Review');
      }
    } catch (err) {
      handleApiError(err, 'Rejecting Review');
    }
  };

  const handleDelete = async (reviewId) => {
    // Confirm deletion with user
    const confirmDelete = window.confirm('Are you sure you want to delete this review? This action cannot be undone.');
    
    if (confirmDelete) {
      try {
        const data = await deleteReview(reviewId);
        
        if (data.ok) {
          // Remove the review from the local state
          setReviews(reviews.filter(review => review._id !== reviewId));
          
          // Close modal if it's open for this review
          if (selectedReview && selectedReview._id === reviewId) {
            setIsModalOpen(false);
            setSelectedReview(null);
          }
          
          showSuccess('Review deleted successfully');
        } else {
          handleApiError(new Error(data.message || 'Failed to delete review'), 'Deleting Review');
        }
      } catch (err) {
        handleApiError(err, 'Deleting Review');
      }
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Company Reviews</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({reviews.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md ${
              filter === 'approved' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approved ({reviews.filter(r => r.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-md ${
              filter === 'rejected' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rejected ({reviews.filter(r => r.status === 'rejected').length})
          </button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No reviews found.' 
              : `No ${filter} reviews found.`}
          </p>
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
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {review.company?.companyName || 'Unknown Company'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.user?.email || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.reviewer?.name || review.reviewerName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {review.project?.title || review.title || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.overallRating || review.rating}/5
                    </div>
                    <div className="flex text-xs">
                      {renderStars(review.overallRating || review.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <>
                      <button
                        onClick={() => handleApprove(review._id)}
                        className={`mr-3 ${
                          review.status === 'approved' 
                            ? 'text-green-800 bg-green-100 hover:bg-green-200' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        disabled={review.status === 'approved'}
                      >
                        {review.status === 'approved' ? 'Approved ✓' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(review._id)}
                        className={`mr-3 ${
                          review.status === 'rejected' 
                            ? 'text-red-800 bg-red-100 hover:bg-red-200' 
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        disabled={review.status === 'rejected'}
                      >
                        {review.status === 'rejected' ? 'Rejected ✗' : 'Reject'}
                      </button>
                    </>
                    <button
                      onClick={() => handleViewDetails(review)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
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

      {/* Review Detail Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Review Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Project Information */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Project Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600"><span className="font-medium">Project Title:</span> {selectedReview.project?.title || selectedReview.title || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Project Type:</span> {selectedReview.project?.type || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Budget:</span> {selectedReview.project?.budget || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><span className="font-medium">Duration:</span> {selectedReview.project?.duration || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Review Date:</span> {formatDate(selectedReview.reviewDate || selectedReview.createdAt)}</p>
                  </div>
                </div>
                {selectedReview.project?.summary && (
                  <div className="mt-3">
                    <p className="text-gray-600"><span className="font-medium">Project Summary:</span></p>
                    <p className="text-gray-800 mt-1">{selectedReview.project.summary}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Reviewer Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Reviewer Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600"><span className="font-medium">Name:</span> {selectedReview.reviewer?.name || selectedReview.reviewerName || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Designation:</span> {selectedReview.reviewer?.designation || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Company:</span> {selectedReview.reviewer?.companyName || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Industry:</span> {selectedReview.reviewer?.industry || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Location:</span> {selectedReview.reviewer?.location || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Employees:</span> {selectedReview.reviewer?.employees || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Interview Method:</span> {selectedReview.reviewer?.interviewMethod || 'N/A'}</p>
                    <p className="text-gray-600">
                      <span className="font-medium">Verified:</span> 
                      {selectedReview.reviewer?.verified ? (
                        <span className="text-green-600 ml-1">Yes</span>
                      ) : (
                        <span className="text-gray-500 ml-1">No</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Company Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Company Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600"><span className="font-medium">Name:</span> {selectedReview.company?.companyName || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Slug:</span> {selectedReview.company?.slug || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">User Email:</span> {selectedReview.user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Ratings</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedReview.overallRating || selectedReview.rating || 'N/A'}</div>
                      <div className="text-gray-600 text-sm">Overall</div>
                      <div className="flex justify-center mt-1">
                        {renderStars(selectedReview.overallRating || selectedReview.rating || 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{selectedReview.ratings?.quality || 'N/A'}</div>
                      <div className="text-gray-600 text-sm">Quality</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{selectedReview.ratings?.schedule || 'N/A'}</div>
                      <div className="text-gray-600 text-sm">Schedule</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{selectedReview.ratings?.cost || 'N/A'}</div>
                      <div className="text-gray-600 text-sm">Cost</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-xl font-bold text-gray-900">{selectedReview.ratings?.willingToRefer || 'N/A'}</div>
                    <div className="text-gray-600">Willing to Refer</div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Review Content</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600"><span className="font-medium">Review:</span></p>
                  <p className="text-gray-800 mt-1">{selectedReview.reviewText || selectedReview.review || 'N/A'}</p>
                  
                  {selectedReview.feedbackSummary && (
                    <>
                      <p className="text-gray-600 mt-4"><span className="font-medium">Feedback Summary:</span></p>
                      <p className="text-gray-800 mt-1">{selectedReview.feedbackSummary}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Review Status */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Review Status</h4>
                <div className="flex items-center">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClass(selectedReview.status)}`}>
                    {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                  </span>
                  {selectedReview.approvedAt && (
                    <span className="ml-3 text-gray-600">
                      {selectedReview.status === 'approved' ? 'Approved' : 'Rejected'} on {formatDate(selectedReview.approvedAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleApprove(selectedReview._id)}
                  disabled={selectedReview.status === 'approved'}
                  className={`px-4 py-2 rounded-md ${
                    selectedReview.status === 'approved'
                      ? 'bg-green-800 text-white cursor-default'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {selectedReview.status === 'approved' ? 'Approved ✓' : 'Approve Review'}
                </button>
                <button
                  onClick={() => handleReject(selectedReview._id)}
                  className={`px-4 py-2 rounded-md ${
                    selectedReview.status === 'rejected'
                      ? 'bg-red-800 text-white cursor-default'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {selectedReview.status === 'rejected' ? 'Rejected ✗' : 'Reject Review'}
                </button>
                <button
                  onClick={() => handleDelete(selectedReview._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;