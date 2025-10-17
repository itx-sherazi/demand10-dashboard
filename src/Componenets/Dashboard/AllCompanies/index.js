"use client";
import React, { useState, useEffect } from 'react';
import { getAllCompanies, updateCompanyWithTeamLeads, deleteCompanyWithTeamLeads, updateCompanySponsorship } from '@/services/api';
import { Search, Edit, Trash2, Users, Building, Globe, Calendar, MapPin, Plus, X, Save, Map, List, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Company Card Component
const CompanyCard = ({ company, onEdit, onDelete, onToggleSponsor, viewMode = "list" }) => {
  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    // If it's already a full URL, return as is
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, prepend the API base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://demand10.com/api/v1';
    // Remove /api/v1 prefix if it exists in the imagePath since uploads are served directly
    const cleanPath = imagePath.startsWith('/api/v1') ? imagePath.substring(7) : imagePath;
    // For uploads, we need to remove the /api/v1 part from the base URL
    const uploadBaseUrl = baseUrl.replace('/api/v1', '');
    return `${uploadBaseUrl}${cleanPath}`;
  };

  const imageUrl = getImageUrl(company.image);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Company Image/Logo Header */}
      <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl} 
            alt={company.companyName} 
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" 
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-gray-200 shadow-lg">
            <Building className="w-8 h-8 text-gray-500" />
          </div>
        )}
        
        {/* Sponsor Badge */}
        {company.sponsor && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            SPONSOR
          </div>
        )}
        
        {/* Action Buttons - Top Right */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={() => onEdit(company)}
            className="p-2 bg-white/90 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm"
            title="Edit Company"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(company._id, company.companyName)}
            className="p-2 bg-white/90 text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
            title="Delete Company"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Company Content */}
      <div className="p-5">
        {/* Company Title & Category */}
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
            {company.companyName}
          </h3>
          <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
            {company.subcategory?.name || 'Unknown Category'}
          </p>
        </div>

        {/* Company Details */}
        <div className="space-y-3 text-sm mb-4">
          {company.employees && (
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-3 text-blue-500" />
              <span>{company.employees} employees</span>
            </div>
          )}
          
          {company.companyCountry && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-3 text-green-500" />
              <span>{company.companyCountry}</span>
            </div>
          )}
          
          {company.foundedYear && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-3 text-purple-500" />
              <span>Founded {company.foundedYear}</span>
            </div>
          )}
          
          {company.website && (
            <div className="flex items-center text-gray-600">
              <Globe className="w-4 h-4 mr-3 text-orange-500" />
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline truncate flex-1"
              >
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Industries Tags */}
        {company.industryTags && company.industryTags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {company.industryTags.slice(0, 3).map((industry, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                >
                  {typeof industry === 'object' && industry !== null ? industry.industryName : industry}
                </span>
              ))}
              {company.industryTags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{company.industryTags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sponsor Toggle Button */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleSponsor(company._id, !company.sponsor)}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
              company.sponsor
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Star className={`w-4 h-4 mr-2 ${company.sponsor ? "fill-current" : ""}`} />
            {company.sponsor ? "Sponsored" : "Make Sponsor"}
          </button>
        </div>

        {/* Team Leads Section */}
        {company.teamLeads && company.teamLeads.length > 0 && (
          <div className="pt-4 border-t border-gray-100 mt-4">
            <div className="flex items-center mb-3">
              <Users className="w-4 h-4 mr-2 text-indigo-500" />
              <p className="text-sm font-semibold text-gray-700">
                Team Leads ({company.teamLeads.length})
              </p>
            </div>
            <div className="space-y-2">
              {company.teamLeads.slice(0, 2).map((lead, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">
                      {lead.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{lead.name}</span>
                    {lead.position && (
                      <span className="text-gray-500 ml-1">• {lead.position}</span>
                    )}
                  </div>
                </div>
              ))}
              {company.teamLeads.length > 2 && (
                <div className="text-xs text-gray-500 pl-8">
                  +{company.teamLeads.length - 2} more team members
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Map View Component
const MapView = ({ companies, onEdit, onDelete, onToggleSponsor }) => {
  // For now, we'll create a simple grid view that looks like a map
  // In a real implementation, you would integrate with a mapping library like Google Maps
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Companies Map View</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companies.map((company) => (
          <CompanyCard
            key={company._id}
            company={company}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleSponsor={onToggleSponsor}
            viewMode="map"
          />
        ))}
      </div>
    </div>
  );
};

// Search Bar Component
const SearchBar = ({ searchQuery, onSearch, resultsCount }) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search companies..."
          value={searchQuery}
          onChange={onSearch}
          className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>
      {searchQuery && (
        <p className="mt-2 text-sm text-gray-600">
          {resultsCount || 0} companies found for &quot;<span className="font-medium">{searchQuery}</span>&quot;
        </p>
      )}
    </div>
  );
};

// Pagination Component
const Pagination = ({ pagination, currentPage, onPageChange }) => {
  if (!pagination.totalPages || pagination.totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Previous
      </button>
      
      <span className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading companies...</span>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ searchQuery }) => {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <Building className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No companies found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {searchQuery 
            ? `No companies match "${searchQuery}". Try adjusting your search terms.`
            : 'No companies are available at the moment. Check back later or add some companies.'
          }
        </p>
      </div>
    </div>
  );
};

// Team Lead Form Component
const TeamLeadForm = ({ lead, index, onChange, onRemove }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900">Team Lead {index + 1}</h4>
        <button
          onClick={() => onRemove(index)}
          className="text-red-600 hover:bg-red-100 p-1 rounded transition-colors"
          title="Remove team lead"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={lead.name || ''}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <input
            type="text"
            value={lead.position || ''}
            onChange={(e) => onChange(index, 'position', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., CEO, CTO"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
          <input
            type="url"
            value={lead.linkedinUrl || ''}
            onChange={(e) => onChange(index, 'linkedinUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
          <input
            type="url"
            value={lead.facebookUrl || ''}
            onChange={(e) => onChange(index, 'facebookUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://facebook.com/..."
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
          <input
            type="url"
            value={lead.twitterUrl || ''}
            onChange={(e) => onChange(index, 'twitterUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://twitter.com/..."
          />
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function AllCompaniesTeamData() {
  // State Management
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({});
  const [teamLeads, setTeamLeads] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  // API Functions
  const loadCompanies = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const data = await getAllCompanies(page, 50, search);
      setCompanies(data.companies);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    loadCompanies(1, query);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadCompanies(newPage, searchQuery);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setFormData({
      companyName: company.companyName || '',
      employees: company.employees || '',
      website: company.website || '',
      description: company.description || '',
      linkedinUrl: company.linkedinUrl || '',
      facebookUrl: company.facebookUrl || '',
      twitterUrl: company.twitterUrl || '',
      companyCountry: company.companyCountry || '',
      foundedYear: company.foundedYear || '',
      industryTags: Array.isArray(company.industryTags) 
        ? company.industryTags.map(industry => 
            typeof industry === 'object' && industry !== null ? industry.industryName : industry
          ).join(', ') 
        : ''
    });
    setTeamLeads(company.teamLeads || []);
    setNewImage(null);
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamLeadChange = (index, field, value) => {
    const updatedTeamLeads = [...teamLeads];
    updatedTeamLeads[index] = { ...updatedTeamLeads[index], [field]: value };
    setTeamLeads(updatedTeamLeads);
  };

  const addTeamLead = () => {
    setTeamLeads([...teamLeads, {
      name: '',
      position: '',
      linkedinUrl: '',
      facebookUrl: '',
      twitterUrl: ''
    }]);
  };

  const removeTeamLead = (index) => {
    setTeamLeads(teamLeads.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleUpdateCompany = async () => {
    if (!editingCompany) return;

    const updateFormData = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        if (key === 'industryTags') {
          updateFormData.append(key, JSON.stringify(formData[key].split(',').map(i => i.trim())));
        } else {
          updateFormData.append(key, formData[key]);
        }
      }
    });

    updateFormData.append('teamLeads', JSON.stringify(teamLeads));

    if (newImage) {
      updateFormData.append('image', newImage);
    }

    try {
      await updateCompanyWithTeamLeads(editingCompany._id, updateFormData);
      toast.success('Company updated successfully!');
      setEditModalOpen(false);
      loadCompanies(currentPage, searchQuery);
    } catch (error) {
      toast.error('Failed to update company');
      console.error('Update error:', error);
    }
  };

  const handleDeleteCompany = async (companyId, companyName) => {
    if (window.confirm(`Are you sure you want to delete ${companyName}? This action cannot be undone.`)) {
      try {
        await deleteCompanyWithTeamLeads(companyId);
        toast.success('Company deleted successfully!');
        loadCompanies(currentPage, searchQuery);
      } catch (error) {
        toast.error('Failed to delete company');
        console.error('Delete error:', error);
      }
    }
  };

  const handleToggleSponsor = async (companyId, sponsor) => {
    try {
      const response = await updateCompanySponsorship(companyId, sponsor);
      if (response.status === 200) {
        toast.success(`Company ${sponsor ? 'sponsored' : 'unsponsored'} successfully!`);
        // Update the company in the state
        setCompanies(prevCompanies => 
          prevCompanies.map(company => 
            company._id === companyId 
              ? { ...company, sponsor } 
              : company
          )
        );
      } else {
        toast.error('Failed to update company sponsorship');
      }
    } catch (error) {
      toast.error('Failed to update company sponsorship');
      console.error('Sponsorship error:', error);
    }
  };

  // Initial Load
  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Management</h1>
          <p className="text-gray-600">Manage all companies and their team members</p>
        </div>

        {/* View Toggle and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <Map className="w-4 h-4 mr-2" />
              Map View
            </button>
          </div>
          
          <SearchBar 
            searchQuery={searchQuery}
            onSearch={handleSearch}
            resultsCount={pagination.totalCompanies}
          />
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Companies Views */}
        {!loading && companies.length > 0 && (
          <>
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {companies.map((company) => (
                  <CompanyCard
                    key={company._id}
                    company={company}
                    onEdit={openEditModal}
                    onDelete={handleDeleteCompany}
                    onToggleSponsor={handleToggleSponsor}
                  />
                ))}
              </div>
            ) : (
              <MapView 
                companies={companies} 
                onEdit={openEditModal}
                onDelete={handleDeleteCompany}
                onToggleSponsor={handleToggleSponsor}
              />
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && companies.length === 0 && (
          <EmptyState searchQuery={searchQuery} />
        )}

        {/* Pagination */}
        <Pagination 
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Company</h2>
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees</label>
                      <input
                        type="text"
                        name="employees"
                        value={formData.employees}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 50-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="companyCountry"
                        value={formData.companyCountry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., United States"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                      <input
                        type="number"
                        name="foundedYear"
                        value={formData.foundedYear}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 2010"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industries</label>
                      <input
                        type="text"
                        name="industryTags"
                        value={formData.industryTags}
                        onChange={handleInputChange}
                        placeholder="IT Services, Cybersecurity, Cloud Computing"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple industries with commas</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {editingCompany?.image && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Current logo:</p>
                          <img src={getImageUrl(editingCompany.image)} alt="Current logo" className="w-20 h-20 object-cover rounded-lg border" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links & Description */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Social Links & Description</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                      <input
                        type="url"
                        name="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                      <input
                        type="url"
                        name="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://twitter.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description of the company..."
                      />
                    </div>
                  </div>
                </div>

                {/* Team Leads Section */}
                <div className="mt-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Team Leads</h3>
                    <button
                      onClick={addTeamLead}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Lead
                    </button>
                  </div>

                  <div className="space-y-4">
                    {teamLeads.map((lead, index) => (
                      <TeamLeadForm
                        key={index}
                        lead={lead}
                        index={index}
                        onChange={handleTeamLeadChange}
                        onRemove={removeTeamLead}
                      />
                    ))}
                    
                    {teamLeads.length === 0 && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No team leads added yet</p>
                        <p className="text-sm text-gray-400">Click &quot;Add Team Lead&quot; to get started</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCompany}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}