"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { categories, subcategoriesDashboard, getSubcategoryDetails, editSubcategory, editSubcategoryDetailed } from "@/services/api";
import Button from "@/Componenets/ui/Button";

const SubcategoryDetails = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoriesList, setSubcategoriesList] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [subcategoryDetails, setSubcategoryDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allSubcategoryCompanies, setAllSubcategoryCompanies] = useState([]);

  // Debug log when subcategoryDetails changes
  useEffect(() => {
    console.log("subcategoryDetails state changed:", subcategoryDetails);
  }, [subcategoryDetails]);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await categories();
      // The API returns { data: { ok: true, data: [...] } }
      if (response?.data?.ok) {
        setCategoriesList(response?.data?.data);
      } else {
        // Handle case where response.data.ok is false or doesn't exist
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Error loading categories");
    }
  };

  // Fetch subcategories for selected category
  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) return;
    
    try {
      setLoading(true);
      const response = await subcategoriesDashboard();
      
      // The API returns { data: { ok: true, data: [...] } }
      if (response.data?.ok) {
        
        // Filter subcategories for the selected category
        // Convert both to strings for comparison
        const categorySubcategories = response.data.data.filter(
          sub => {
            const match = sub.category && sub.category.toString() === categoryId.toString();
            return match;
          }
        );
        
        setSubcategoriesList(categorySubcategories);
        // Reset selected subcategory when category changes
        setSelectedSubcategory("");
        setSubcategoryDetails(null);
      } else {
        // Handle case where response.data.ok is false or doesn't exist
        toast.error("Failed to load subcategories");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategory details
  const fetchSubcategoryDetails = async (subcategorySlug) => {
    if (!subcategorySlug) return;
    
    try {
      setLoading(true);
      const response = await getSubcategoryDetails(subcategorySlug);
      console.log("API response:", response); // Debug log
      
      if (response.status === 200 && response.data.ok) {
        // Fix: properly set the subcategory details structure
        // The backend returns the data directly, not nested in a details object
        const detailsData = {
          name: response.data.name,
          slug: response.data.slug,
          totalCompanies: response.data.totalCompanies,
          details: response.data.details || {
            // Initialize with default structure if details is null/undefined
            heading: "",
            metaTitle: "",
            metaDescription: "",
            metaKeywords: [],
            countries: [],
            regions: [],
            employeeSizeBreakdown: [],
            revenueSizeBreakdown: [],
            servicesOffered: [],
            technologyAdoption: {
              cloudProviders: [],
              rmmTools: [],
              securityTools: []
            },
            decisionMakers: [],
            benchmarkInsights: {
              cagr: 0,
              hiringTrends: 0,
              regionalGrowth: [],
              acquisitions: 0,
              cloudShift: 0
            },
            
          }
        };
        setSubcategoryDetails(detailsData);
      } else {
        toast.error("Failed to load subcategory details");
      }
    } catch (error) {
      console.error("Error fetching subcategory details:", error);
      toast.error("Failed to load subcategory details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategoriesList([]);
      setSelectedSubcategory("");
      setSubcategoryDetails(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory) {
      // Find the subcategory slug from the list
      const subcategory = subcategoriesList.find(sub => sub._id === selectedSubcategory);
   
      if (subcategory && subcategory.slug) {
        fetchSubcategoryDetails(subcategory.slug);
        // Fetch all companies in this subcategory
        fetchCompaniesInSubcategory(subcategory.slug);
      } else {
        setSubcategoryDetails(null);
        setAllSubcategoryCompanies([]);
      }
    } else {
      setSubcategoryDetails(null);
      setAllSubcategoryCompanies([]);
    }
  }, [selectedSubcategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  // Handle changes to the details fields
  const handleDetailChange = (field, value) => {
    setSubcategoryDetails(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value
      }
    }));
  };

  // Fetch all companies in subcategory
  const fetchCompaniesInSubcategory = async (subcategorySlug) => {
    try {
      // Assuming there's an API endpoint to get all companies in a subcategory
      // You might need to implement this endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/companies/${subcategorySlug}?limit=1000`);
      const data = await response.json();
      
      if (data.companies) {
        setAllSubcategoryCompanies(data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    }
  };

  // Handle changes to array fields
  const handleArrayChange = (section, index, field, value) => {
    const updatedArray = [...(subcategoryDetails.details[section] || [])];
    updatedArray[index][field] = value;
    
    setSubcategoryDetails(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [section]: updatedArray
      }
    }));
  };

  // Add a new item to an array field
  const addArrayItem = (section, newItem) => {
    const updatedArray = [...(subcategoryDetails.details[section] || []), newItem];
    
    setSubcategoryDetails(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [section]: updatedArray
      }
    }));
  };

  // Remove an item from an array field
  const removeArrayItem = (section, index) => {
    const updatedArray = (subcategoryDetails.details[section] || []).filter((_, i) => i !== index);
    
    setSubcategoryDetails(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [section]: updatedArray
      }
    }));
  };

  // Save the subcategory details
  const handleSaveDetails = async () => {
    if (!selectedSubcategory || !subcategoryDetails) {
      toast.error("Please select a subcategory first");
      return;
    }

    setSaving(true);
    try {
      // Find the subcategory ID
      const subcategory = subcategoriesList.find(sub => sub._id === selectedSubcategory);
      
      // Send only the details object as JSON data (no FormData needed since no files are uploaded)
      const payload = {
        details: subcategoryDetails.details
      };
      
      // Use the JSON-based edit function instead of the FormData-based one
      const response = await editSubcategory(subcategory._id, payload);

      if (response.status === 200) {
        toast.success("Subcategory details updated successfully");
        // Refresh the data to show the new Cloudinary URLs
        fetchSubcategoryDetails(subcategory.slug);
      } else {
        throw new Error(response.data?.message || "Failed to update subcategory details");
      }
    } catch (err) {
      console.error("Error saving subcategory details:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to save subcategory details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Subcategory Details Management</h1>
        <p className="text-gray-600">Manage detailed information for subcategory solution pages</p>
      </div>

      {/* Category Selection */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category *
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categoriesList.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Selection */}
      {selectedCategory && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Subcategory *
          </label>
          <select
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
            disabled={loading}
          >
            <option value="">Select a subcategory</option>
            {subcategoriesList.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ecfc5]"></div>
          <p className="mt-2 text-gray-600">Loading subcategory details...</p>
        </div>
      )}

      {/* Subcategory Details Form */}
      {subcategoryDetails && !loading && (
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  value={subcategoryDetails.details.heading || ""}
                  onChange={(e) => handleDetailChange("heading", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                  placeholder="Enter heading"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={subcategoryDetails.details.metaTitle || ""}
                  onChange={(e) => handleDetailChange("metaTitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                  placeholder="Enter meta title"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={subcategoryDetails.details.metaDescription || ""}
                  onChange={(e) => handleDetailChange("metaDescription", e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                  placeholder="Enter meta description"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={subcategoryDetails.details.metaKeywords.length > 0 ? subcategoryDetails.details.metaKeywords.join(", ") : ""}
                  onChange={(e) => {
                    // Very explicit approach
                    const inputString = e.target.value;
                    let resultArray = [];
                    
                    if (inputString && inputString.trim() !== "") {
                      resultArray = inputString.split(",").map(item => item.trim());
                    }
                    
                    handleDetailChange("metaKeywords", resultArray);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                  placeholder="Enter keywords separated by commas"
                />
              </div>
            </div>
          </div>

          {/* Geographic Data */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Geographic Data</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Countries */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Countries</h3>
                
                {(subcategoryDetails.details.countries || []).map((country, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={country.country || ""}
                      onChange={(e) => handleArrayChange("countries", index, "country", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="Country"
                    />
                    <input
                      type="number"
                      value={country.percentage || ""}
                      onChange={(e) => handleArrayChange("countries", index, "percentage", parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="%"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("countries", index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem("countries", { country: "", percentage: 0 })}
                  className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  + Add Country
                </button>
              </div>
              
              {/* Regions */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Regions</h3>
                
                {(subcategoryDetails.details.regions || []).map((region, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={region.region || ""}
                      onChange={(e) => handleArrayChange("regions", index, "region", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="Region"
                    />
                    <input
                      type="number"
                      value={region.percentage || ""}
                      onChange={(e) => handleArrayChange("regions", index, "percentage", parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="%"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("regions", index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem("regions", { region: "", percentage: 0 })}
                  className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  + Add Region
                </button>
              </div>
            </div>
          </div>

          {/* Company Size Breakdown */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Size Breakdown</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Size */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Employee Size</h3>
                
                {(subcategoryDetails.details.employeeSizeBreakdown || []).map((size, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={size.range || ""}
                      onChange={(e) => handleArrayChange("employeeSizeBreakdown", index, "range", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="Employee range"
                    />
                    <input
                      type="number"
                      value={size.percentage || ""}
                      onChange={(e) => handleArrayChange("employeeSizeBreakdown", index, "percentage", parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="%"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("employeeSizeBreakdown", index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem("employeeSizeBreakdown", { range: "", percentage: 0 })}
                  className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  + Add Employee Range
                </button>
              </div>
              
              {/* Revenue Size */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Revenue Size</h3>
                
                {(subcategoryDetails.details.revenueSizeBreakdown || []).map((size, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={size.range || ""}
                      onChange={(e) => handleArrayChange("revenueSizeBreakdown", index, "range", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="Revenue range"
                    />
                    <input
                      type="number"
                      value={size.percentage || ""}
                      onChange={(e) => handleArrayChange("revenueSizeBreakdown", index, "percentage", parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="%"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("revenueSizeBreakdown", index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem("revenueSizeBreakdown", { range: "", percentage: 0 })}
                  className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  + Add Revenue Range
                </button>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Services Offered</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Services Offered by MSPs */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Services Offered</h3>
                
                {(subcategoryDetails.details.servicesOffered || []).map((service, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={service.service || ""}
                      onChange={(e) => handleArrayChange("servicesOffered", index, "service", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="Service name"
                    />
                    <input
                      type="number"
                      value={service.percentage || ""}
                      onChange={(e) => handleArrayChange("servicesOffered", index, "percentage", parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                      placeholder="%"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("servicesOffered", index)}
                      className="px-2 py-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem("servicesOffered", { service: "", percentage: 0 })}
                  className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  + Add Service
                </button>
              </div>
              
              {/* Technology Adoption */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Technology Adoption</h3>
                
                {/* Cloud Providers */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Cloud Providers</h4>
                  {(subcategoryDetails.details.technologyAdoption?.cloudProviders || []).map((provider, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={provider.provider || ""}
                        onChange={(e) => {
                          const updatedProviders = [...(subcategoryDetails.details.technologyAdoption?.cloudProviders || [])];
                          updatedProviders[index] = { ...updatedProviders[index], provider: e.target.value };
                          setSubcategoryDetails(prev => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              technologyAdoption: {
                                ...prev.details.technologyAdoption,
                                cloudProviders: updatedProviders
                              }
                            }
                          }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                        placeholder="Provider name"
                      />
                      <input
                        type="number"
                        value={provider.percentage || ""}
                        onChange={(e) => {
                          const updatedProviders = [...(subcategoryDetails.details.technologyAdoption?.cloudProviders || [])];
                          updatedProviders[index] = { ...updatedProviders[index], percentage: parseFloat(e.target.value) || 0 };
                          setSubcategoryDetails(prev => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              technologyAdoption: {
                                ...prev.details.technologyAdoption,
                                cloudProviders: updatedProviders
                              }
                            }
                          }));
                        }}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                        placeholder="%"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedProviders = (subcategoryDetails.details.technologyAdoption?.cloudProviders || []).filter((_, i) => i !== index);
                          setSubcategoryDetails(prev => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              technologyAdoption: {
                                ...prev.details.technologyAdoption,
                                cloudProviders: updatedProviders
                              }
                            }
                          }));
                        }}
                        className="px-2 py-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedProviders = [...(subcategoryDetails.details.technologyAdoption?.cloudProviders || []), { provider: "", percentage: 0 }];
                      setSubcategoryDetails(prev => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          technologyAdoption: {
                            ...prev.details.technologyAdoption,
                            cloudProviders: updatedProviders
                          }
                        }
                      }));
                    }}
                    className="mt-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                  >
                    + Add Provider
                  </button>
                </div>
                
                {/* RMM Tools */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">RMM Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {(subcategoryDetails.details.technologyAdoption?.rmmTools || []).map((tool, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <input
                          type="text"
                          value={tool || ""}
                          onChange={(e) => {
                            const updatedTools = [...(subcategoryDetails.details.technologyAdoption?.rmmTools || [])];
                            updatedTools[index] = e.target.value;
                            setSubcategoryDetails(prev => ({
                              ...prev,
                              details: {
                                ...prev.details,
                                technologyAdoption: {
                                  ...prev.details.technologyAdoption,
                                  rmmTools: updatedTools
                                }
                              }
                            }));
                          }}
                          className="bg-transparent border-none focus:ring-0 p-0"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedTools = (subcategoryDetails.details.technologyAdoption?.rmmTools || []).filter((_, i) => i !== index);
                            setSubcategoryDetails(prev => ({
                              ...prev,
                              details: {
                                ...prev.details,
                                technologyAdoption: {
                                  ...prev.details.technologyAdoption,
                                  rmmTools: updatedTools
                                }
                              }
                            }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedTools = [...(subcategoryDetails.details.technologyAdoption?.rmmTools || []), ""];
                        setSubcategoryDetails(prev => ({
                          ...prev,
                          details: {
                            ...prev.details,
                            technologyAdoption: {
                              ...prev.details.technologyAdoption,
                              rmmTools: updatedTools
                            }
                          }
                        }));
                      }}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm"
                    >
                      + Add Tool
                    </button>
                  </div>
                </div>
                
                {/* Security Tools */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Security Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {(subcategoryDetails.details.technologyAdoption?.securityTools || []).map((tool, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <input
                          type="text"
                          value={tool || ""}
                          onChange={(e) => {
                            const updatedTools = [...(subcategoryDetails.details.technologyAdoption?.securityTools || [])];
                            updatedTools[index] = e.target.value;
                            setSubcategoryDetails(prev => ({
                              ...prev,
                              details: {
                                ...prev.details,
                                technologyAdoption: {
                                  ...prev.details.technologyAdoption,
                                  securityTools: updatedTools
                                }
                              }
                            }));
                          }}
                          className="bg-transparent border-none focus:ring-0 p-0"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedTools = (subcategoryDetails.details.technologyAdoption?.securityTools || []).filter((_, i) => i !== index);
                            setSubcategoryDetails(prev => ({
                              ...prev,
                              details: {
                                ...prev.details,
                                technologyAdoption: {
                                  ...prev.details.technologyAdoption,
                                  securityTools: updatedTools
                                }
                              }
                            }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedTools = [...(subcategoryDetails.details.technologyAdoption?.securityTools || []), ""];
                        setSubcategoryDetails(prev => ({
                          ...prev,
                          details: {
                            ...prev.details,
                            technologyAdoption: {
                              ...prev.details.technologyAdoption,
                              securityTools: updatedTools
                            }
                          }
                        }));
                      }}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm"
                    >
                      + Add Tool
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision-Makers in MSPs */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Decision-Makers</h2>
            
            {(subcategoryDetails.details.decisionMakers || []).map((dm, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={dm.role || ""}
                  onChange={(e) => handleArrayChange("decisionMakers", index, "role", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                  placeholder="Role"
                />
                <input
                  type="number"
                  value={dm.contacts || ""}
                  onChange={(e) => handleArrayChange("decisionMakers", index, "contacts", parseInt(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                  placeholder="Contacts"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("decisionMakers", index)}
                  className="px-2 py-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem("decisionMakers", { role: "", contacts: 0 })}
              className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
            >
              + Add Decision-Maker
            </button>
          </div>

          {/* Benchmark Insights & Trends */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Benchmark Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CAGR (%)
                </label>
                <input
                  type="number"
                  value={subcategoryDetails.details.benchmarkInsights?.cagr || 0}
                  onChange={(e) => setSubcategoryDetails(prev => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      benchmarkInsights: {
                        ...prev.details.benchmarkInsights,
                        cagr: parseFloat(e.target.value) || 0
                      }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hiring Trends (%)
                </label>
                <input
                  type="number"
                  value={subcategoryDetails.details.benchmarkInsights?.hiringTrends || 0}
                  onChange={(e) => setSubcategoryDetails(prev => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      benchmarkInsights: {
                        ...prev.details.benchmarkInsights,
                        hiringTrends: parseFloat(e.target.value) || 0
                      }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acquisitions
                </label>
                <input
                  type="number"
                  value={subcategoryDetails.details.benchmarkInsights?.acquisitions || 0}
                  onChange={(e) => setSubcategoryDetails(prev => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      benchmarkInsights: {
                        ...prev.details.benchmarkInsights,
                        acquisitions: parseInt(e.target.value) || 0
                      }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cloud Shift (%)
                </label>
                <input
                  type="number"
                  value={subcategoryDetails.details.benchmarkInsights?.cloudShift || 0}
                  onChange={(e) => setSubcategoryDetails(prev => ({
                    ...prev,
                    details: {
                      ...prev.details,
                      benchmarkInsights: {
                        ...prev.details.benchmarkInsights,
                        cloudShift: parseFloat(e.target.value) || 0
                      }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ecfc5] focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regional Growth
                </label>
                <div className="flex flex-wrap gap-2">
                  {(subcategoryDetails.details.benchmarkInsights?.regionalGrowth || []).map((region, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <input
                        type="text"
                        value={region || ""}
                        onChange={(e) => {
                          const updatedRegions = [...(subcategoryDetails.details.benchmarkInsights?.regionalGrowth || [])];
                          updatedRegions[index] = e.target.value;
                          setSubcategoryDetails(prev => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              benchmarkInsights: {
                                ...prev.details.benchmarkInsights,
                                regionalGrowth: updatedRegions
                              }
                            }
                          }));
                        }}
                        className="bg-transparent border-none focus:ring-0 p-0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedRegions = (subcategoryDetails.details.benchmarkInsights?.regionalGrowth || []).filter((_, i) => i !== index);
                          setSubcategoryDetails(prev => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              benchmarkInsights: {
                                ...prev.details.benchmarkInsights,
                                regionalGrowth: updatedRegions
                              }
                            }
                          }));
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedRegions = [...(subcategoryDetails.details.benchmarkInsights?.regionalGrowth || []), ""];
                      setSubcategoryDetails(prev => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          benchmarkInsights: {
                            ...prev.details.benchmarkInsights,
                            regionalGrowth: updatedRegions
                          }
                        }
                      }));
                    }}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm"
                  >
                    + Add Region
                  </button>
                </div>
              </div>
            </div>
          </div>

         

         

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              label={saving ? "Saving..." : "Save Details"}
              onClick={handleSaveDetails}
              loading={saving}
              className="px-6 py-3 bg-[#4ecfc5] hover:bg-[#3bb5ab] text-white rounded-lg font-medium"
              disabled={saving}
            />
          </div>
        </div>
      )}

      {!selectedCategory && !loading && (
        <div className="text-center py-12 text-gray-500">
          Please select a category to begin managing subcategory details
        </div>
      )}

      {selectedCategory && !selectedSubcategory && !loading && subcategoriesList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No subcategories found for this category
        </div>
      )}

      {selectedCategory && selectedSubcategory && !subcategoryDetails && !loading && (
        <div className="text-center py-12 text-gray-500">
          No details found for this subcategory
        </div>
      )}
    </div>
  );
};



export default SubcategoryDetails;