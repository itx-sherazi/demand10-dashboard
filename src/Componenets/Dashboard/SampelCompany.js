"use client";
import { useState, useEffect } from "react";
import {
  deleteSampelCompany,
  fetchSampelCompany,
  updateSampelData,
} from "../../services/api";
import { Edit, Trash2, X, Search, Building2 } from "lucide-react";
import { Calendar, MapPin,Globe, Users, Factory } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export default function SampelCompany() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    employees: '',
    industries: '',
    website: '',
    linkedinUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    companyCountry: '',
    description: '',
    foundedYear: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  // Fetch existing companies from the database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const products = await fetchSampelCompany();
        setData(products || []);
        setFilteredData(products || []);
      } catch (err) {
        // Don't treat "No company found" as an error - it's a normal empty state
        if (
          err.message === "No company found" ||
          err.message.includes("No company")
        ) {
          setData([]);
          setFilteredData([]);
          setError(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((company) =>
        company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyCountry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industries?.some(industry => 
          industry.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 bg-red-100 rounded-md">
        Error loading data: {error}
      </div>
    );

  // Handle delete company
  const handleDelete = async (companyId) => {

    if (!companyId) {
      toast.error("Company ID not found");
      return;
    }

    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteSampelCompany(companyId);
        const updatedData = data.filter((company) => company._id !== companyId);
        setData(updatedData);
        setFilteredData(updatedData);
        toast.success("Company deleted successfully");
      } catch (err) {
        toast.error("Failed to delete company");
        console.error("Delete error:", err);
      }
    }
  };

  // Handle edit click - FIXED: Proper company data setting
  const handleEditClick = (company) => {

    if (!company._id) {
      toast.error("Company ID not found");
      return;
    }

    // Set current company
    setCurrentCompany(company);

    // Set form data with proper schema fields
    setFormData({
      companyName: company.companyName || "",
      employees: company.employees?.toString() || "",
      industries: Array.isArray(company.industries) ? company.industries.join(', ') : company.industries || "",
      website: company.website || "",
      linkedinUrl: company.linkedinUrl || "",
      facebookUrl: company.facebookUrl || "",
      twitterUrl: company.twitterUrl || "",
      companyCountry: company.companyCountry || "",
      description: company.description || "",
      foundedYear: company.foundedYear?.toString() || "",
    });

    // Set image preview if exists
    setImagePreview(company.image || "");
    setSelectedImage(null); // Reset selected image
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // FIXED: Better form submission handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentCompany || !currentCompany._id) {
      toast.error("Company ID not found. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields to FormData with correct schema field names
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("employees", formData.employees);
      formDataToSend.append("industries", formData.industries);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("linkedinUrl", formData.linkedinUrl);
      formDataToSend.append("facebookUrl", formData.facebookUrl);
      formDataToSend.append("twitterUrl", formData.twitterUrl);
      formDataToSend.append("companyCountry", formData.companyCountry);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("foundedYear", formData.foundedYear);

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      // Debug: Log what we're sending
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Send update request
      const response = await updateSampelData(currentCompany._id, formDataToSend);

      // Update the data state with the updated company
      const updatedData = data.map((company) =>
        company._id === currentCompany._id
          ? {
              ...company,
              ...formData,
              industries: formData.industries.split(',').map(ind => ind.trim()),
              employees: formData.employees ? parseInt(formData.employees) : company.employees,
              foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : company.foundedYear,
              image: response.company?.image || response.image || company.image,
            }
          : company
      );

      setData(updatedData);
      setFilteredData(updatedData);

      // Reset modal state
      handleCloseModal();
      toast.success("Company updated successfully");
    } catch (err) {
      toast.error("Failed to update company");
      console.error("Update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to close modal and reset state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCompany(null);
    setSelectedImage(null);
    setImagePreview("");
    setFormData({
      companyName: '',
      employees: '',
      industries: '',
      website: '',
      linkedinUrl: '',
      facebookUrl: '',
      twitterUrl: '',
      companyCountry: '',
      description: '',
      foundedYear: '',
    });
  };

  // Empty State Component
  const EmptyState = ({ isSearchResult = false }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Building2 size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isSearchResult ? "No companies found" : "No companies yet"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {isSearchResult
          ? `No companies match your search "${searchTerm}". Try adjusting your search terms.`
          : "You haven't added any companies yet. Create your first company to get started."}
      </p>
   
      {isSearchResult && (
        <button
          onClick={() => setSearchTerm("")}
          className="inline-flex items-center px-4 py-2 bg-[#1e9e9a] text-white rounded-lg  transition-colors"
        >
          Clear search
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"> Sampel Companies</h1>
      </div>

      {/* Only show search bar if there are companies */}
      {data.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies by name, country, or industry..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a]"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredData.length} companies matching &quot;{searchTerm}
              &quot;
            </p>
          )}
        </div>
      )}

      {/* Show empty state if no data at all */}
      {data.length === 0 ? (
        <EmptyState />
      ) : filteredData.length === 0 && searchTerm ? (
        /* Show search empty state if search returns no results */
        <EmptyState isSearchResult={true} />
      ) : (
        /* Show table with data */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Founded Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((company, index) => (
                <tr key={company._id || index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {company.image ? (
                      <Image
                        width={100}
                        height={100}
                        src={company.image}
                        alt={company.companyName}
                        className="w-24 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {company.employees}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.foundedYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {company.companyCountry}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.isArray(company.industries) ? (
                      <div className="flex flex-wrap gap-1">
                        {company.industries.slice(0, 2).map((industry, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            {industry}
                          </span>
                        ))}
                        {company.industries.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{company.industries.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        {company.industries || 'Not specified'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEditClick(company)}
                      className="text-[#1e9e9a] mr-3"
                      title={`Edit ${company.companyName}`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="text-red-500 hover:text-red-700"
                      title={`Delete ${company.companyName}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#1e9e9a] text-white px-8 py-4 rounded-t-xl flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-2xl font-bold">Edit Company Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-blue-200 focus:outline-none p-1 rounded-full hover:bg-[#1e9e9a] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Building2 size={16} className="mr-1 text-[#1e9e9a]" />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      required
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Employees */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Users size={16} className="mr-1 text-[#1e9e9a]" />
                      Number of Employees
                    </label>
                    <input
                      type="text"
                      name="employees"
                      value={formData.employees}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      placeholder="e.g., 50-100, 1000+"
                    />
                  </div>

                  {/* Founded Year */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Calendar size={16} className="mr-1 text-[#1e9e9a]" />
                      Founded Year
                    </label>
                    <input
                      type="number"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleInputChange}
                      min="1800"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      placeholder="e.g., 2010"
                    />
                  </div>

                  {/* Company Country */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <MapPin size={16} className="mr-1 text-[#1e9e9a]" />
                      Company Country
                    </label>
                    <input
                      type="text"
                      name="companyCountry"
                      value={formData.companyCountry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      placeholder="e.g., United States"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Globe size={16} className="mr-1 text-[#1e9e9a]" />
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Industries */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Factory size={16} className="mr-1 text-[#1e9e9a]" />
                      Industries
                    </label>
                    <input
                      type="text"
                      name="industries"
                      value={formData.industries}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      placeholder="Technology, Software, AI (separate with commas)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter industries separated by commas
                    </p>
                  </div>

                  {/* LinkedIn URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>

                  {/* Facebook URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebookUrl"
                      value={formData.facebookUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  {/* Twitter URL */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      placeholder="https://twitter.com/..."
                    />
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors resize-vertical"
                      placeholder="Enter detailed company description..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Logo/Image
                    </label>
                    <div className="flex items-center space-x-6">
                      {imagePreview && (
                        <div className="relative">
                          <Image
                            width={100}
                            height={100}
                            src={imagePreview}
                            alt="Company preview"
                            className="w-32 h-20 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:col-span-2 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-[#1e9e9a] text-white rounded-lg hover:from-[#1e9e9a] hover:to-[#1e9e9a] focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:ring-offset-2 flex items-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Updating Company...
                          </>
                        ) : (
                          "Update Company"
                        )}
                      </button>
                    </div>
                  </div>
                </div>n
              </form>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}