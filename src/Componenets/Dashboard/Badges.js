import { useState, useEffect } from "react";
import { 
  createBadge, 
  getAllBadges, 
  updateBadge, 
  deleteBadge,
  assignBadgeToCompany,
  getAllCompanyBadges,
  removeBadgeFromCompany,
  getCompanyBadges,
  getAllCompanies,
  getBadgeReferralStats,
  updateCompanyBadgeHomepage // Add this import
} from "@/services/api";
import { 
  FaMedal, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaCheck, 
  FaTimes,
  FaChartBar
} from "react-icons/fa";

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [referralStats, setReferralStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("gallery"); // gallery, assign, referrals
  const [searchTerm, setSearchTerm] = useState("");
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [companyBadges, setCompanyBadges] = useState([]);
  const [editingCompanyBadge, setEditingCompanyBadge] = useState(null);

  // Form states
  const [badgeForm, setBadgeForm] = useState({
    id: "",
    name: ""
  });
  const [companyBadgeForm, setCompanyBadgeForm] = useState({
    expiresAt: "",
    homepage: false // Add homepage field
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // Load badges and companies on component mount
  useEffect(() => {
    loadBadges();
    loadCompanies();
  }, []);

  // Load referral stats when the referrals tab is selected
  useEffect(() => {
    if (activeTab === "referrals") {
      loadReferralStats();
    }
  }, [activeTab]);

  const loadBadges = async () => {
    setLoading(true);
    try {
      const response = await getAllBadges();
      if (response.status === 200) {
        setBadges(response.data.data);
      } else {
        setError(response.data.message || "Failed to load badges");
      }
    } catch (err) {
      setError("Failed to load badges");
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    setLoading(true);
    try {
      // Fetch companies from the API
      const companiesData = await getAllCompanies(1, 100, '');
      if (companiesData && companiesData.companies) {
        setCompanies(companiesData.companies.map(company => ({
          _id: company._id,
          companyName: company.companyName,
          slug: company.slug
        })));
      } else {
        // Fallback to mock data if API call fails
        setCompanies([
          { _id: "1", companyName: "Tech Solutions Inc.", slug: "tech-solutions" },
          { _id: "2", companyName: "Digital Innovations Ltd.", slug: "digital-innovations" },
          { _id: "3", companyName: "Cloud Services Co.", slug: "cloud-services" },
          { _id: "4", companyName: "Data Analytics Corp.", slug: "data-analytics" },
          { _id: "5", companyName: "Cyber Security Ltd.", slug: "cyber-security" }
        ]);
      }
    } catch (err) {
      console.error("Error loading companies:", err);
      // Fallback to mock data if API call fails
      setCompanies([
        { _id: "1", companyName: "Tech Solutions Inc.", slug: "tech-solutions" },
        { _id: "2", companyName: "Digital Innovations Ltd.", slug: "digital-innovations" },
        { _id: "3", companyName: "Cloud Services Co.", slug: "cloud-services" },
        { _id: "4", companyName: "Data Analytics Corp.", slug: "data-analytics" },
        { _id: "5", companyName: "Cyber Security Ltd.", slug: "cyber-security" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadReferralStats = async () => {
    setLoading(true);
    try {
      const response = await getBadgeReferralStats({ limit: 20 });
      if (response.status === 200) {
        setReferralStats(response.data.data);
      } else {
        setError(response.data.message || "Failed to load referral stats");
      }
    } catch (err) {
      setError("Failed to load referral stats");
    } finally {
      setLoading(false);
    }
  };

  const searchCompanies = async (searchTerm) => {
    if (!searchTerm) {
      loadCompanies();
      return;
    }
    
    setLoading(true);
    try {
      // Search companies via API
      const companiesData = await getAllCompanies(1, 100, searchTerm);
      if (companiesData && companiesData.companies) {
        setCompanies(companiesData.companies.map(company => ({
          _id: company._id,
          companyName: company.companyName,
          slug: company.slug
        })));
      } else {
        // Fallback filtering of mock data
        const filtered = [
          { _id: "1", companyName: "Tech Solutions Inc.", slug: "tech-solutions" },
          { _id: "2", companyName: "Digital Innovations Ltd.", slug: "digital-innovations" },
          { _id: "3", companyName: "Cloud Services Co.", slug: "cloud-services" },
          { _id: "4", companyName: "Data Analytics Corp.", slug: "data-analytics" },
          { _id: "5", companyName: "Cyber Security Ltd.", slug: "cyber-security" }
        ].filter(company => 
          company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setCompanies(filtered);
      }
    } catch (err) {
      console.error("Error searching companies:", err);
      // Fallback filtering of mock data
      const filtered = [
        { _id: "1", companyName: "Tech Solutions Inc.", slug: "tech-solutions" },
        { _id: "2", companyName: "Digital Innovations Ltd.", slug: "digital-innovations" },
        { _id: "3", companyName: "Cloud Services Co.", slug: "cloud-services" },
        { _id: "4", companyName: "Data Analytics Corp.", slug: "data-analytics" },
        { _id: "5", companyName: "Cyber Security Ltd.", slug: "cyber-security" }
      ].filter(company => 
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setCompanies(filtered);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyBadges = async (companyId) => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const response = await getCompanyBadges(companyId);
      if (response.status === 200) {
        setCompanyBadges(response.data.data);
      } else {
        setError(response.data.message || "Failed to load company badges");
      }
    } catch (err) {
      setError("Failed to load company badges");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleBadgeFormChange = (e) => {
    const { name, value } = e.target;
    setBadgeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyBadgeFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompanyBadgeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add a safe function to toggle modal visibility
  const toggleModal = (modalId, show = true) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      if (show) {
        modal.classList.remove('hidden');
      } else {
        modal.classList.add('hidden');
      }
    }
  };

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", badgeForm.name);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await createBadge(formData);
      
      if (response.status === 201) {
        setSuccess("Badge created successfully!");
        setBadgeForm({
          name: ""
        });
        setImageFile(null);
        setPreviewImage("");
        toggleModal('create-badge-modal', false); // Hide modal safely
        loadBadges(); // Refresh the badge list
      } else {
        setError(response.data.message || "Failed to create badge");
      }
    } catch (err) {
      setError("Failed to create badge");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBadge = async (badgeId, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach(key => {
        if (key !== 'id') { // Don't append the ID
          formData.append(key, updatedData[key]);
        }
      });

      const response = await updateBadge(badgeId, formData);
      
      if (response.status === 200) {
        setSuccess("Badge updated successfully!");
        toggleModal('edit-badge-modal', false); // Hide modal safely
        loadBadges(); // Refresh the badge list
      } else {
        setError(response.data.message || "Failed to update badge");
      }
    } catch (err) {
      setError("Failed to update badge");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBadge = async (badgeId) => {
    if (!window.confirm("Are you sure you want to delete this badge?")) return;
    
    setLoading(true);
    try {
      const response = await deleteBadge(badgeId);
      
      if (response.status === 200) {
        setSuccess("Badge deleted successfully!");
        loadBadges(); // Refresh the badge list
      } else {
        setError(response.data.message || "Failed to delete badge");
      }
    } catch (err) {
      setError("Failed to delete badge");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignBadge = async () => {
    if (!selectedCompany || !selectedBadge) {
      setError("Please select both a company and a badge");
      return;
    }

    setLoading(true);
    try {
      // Check if company already has this badge assigned
      const existingBadges = await getCompanyBadges(selectedCompany);
      const isBadgeAssigned = existingBadges.data.data.some(
        badge => badge.badge._id === selectedBadge
      );

      let response;
      
      if (isBadgeAssigned) {
        // If badge is already assigned, update the homepage status only
        // Find the existing company badge ID
        const existingCompanyBadge = existingBadges.data.data.find(
          badge => badge.badge._id === selectedBadge
        );
        
        if (existingCompanyBadge) {
          const payload = {
            companyId: selectedCompany,
            badgeId: selectedBadge,
            homepage: companyBadgeForm.homepage
          };
          
          response = await updateCompanyBadgeHomepage(payload);
        } else {
          throw new Error("Could not find existing company badge");
        }
      } else {
        // If badge is not assigned, assign it with homepage status
        const payload = {
          companyId: selectedCompany,
          badgeId: selectedBadge,
          expiresAt: companyBadgeForm.expiresAt || undefined,
          homepage: companyBadgeForm.homepage
        };

        response = await assignBadgeToCompany(payload);
      }

      if (response.status === 200 || response.status === 201) {
        setSuccess("Badge assignment updated successfully!");
        setCompanyBadgeForm({
          expiresAt: "",
          homepage: false
        });
        // Refresh company badges
        loadCompanyBadges(selectedCompany);
      } else {
        setError(response.data.message || "Failed to assign badge");
      }
    } catch (err) {
      console.error("Error in handleAssignBadge:", err);
      setError("Failed to assign badge: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompanyBadge = (companyBadge) => {
    setEditingCompanyBadge(companyBadge);
    setCompanyBadgeForm({
      expiresAt: companyBadge.expiresAt ? companyBadge.expiresAt.split('T')[0] : ""
    });
  };

  const handleUpdateCompanyBadge = async () => {
    if (!editingCompanyBadge) return;

    setLoading(true);
    try {
      const payload = {
        expiresAt: companyBadgeForm.expiresAt || undefined
      };

      const response = await updateCompanyBadge(editingCompanyBadge._id, payload);
      
      if (response.status === 200) {
        setSuccess("Company badge updated successfully!");
        setEditingCompanyBadge(null);
        setCompanyBadgeForm({
          expiresAt: ""
        });
        // Refresh company badges
        loadCompanyBadges(selectedCompany);
      } else {
        setError(response.data.message || "Failed to update company badge");
      }
    } catch (err) {
      setError("Failed to update company badge");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCompanyBadge = async (companyBadgeId) => {
    if (!window.confirm("Are you sure you want to remove this badge from the company?")) return;
    
    setLoading(true);
    try {
      const response = await removeBadgeFromCompany(companyBadgeId);
      
      if (response.status === 200) {
        setSuccess("Badge removed from company successfully!");
        // Refresh company badges
        loadCompanyBadges(selectedCompany);
      } else {
        setError(response.data.message || "Failed to remove badge");
      }
    } catch (err) {
      setError("Failed to remove badge");
    } finally {
      setLoading(false);
    }
  };

  // Function to construct full image URL
  const getFullImageUrl = (imagePath) => {
    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, prepend the base URL
    // Images are served directly from the backend static file server
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://api.intentwire.com';
    return `${baseUrl}${imagePath}`;
  };

  const filteredBadges = badges.filter(badge => 
    badge.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Badge Management</h1>
        <p className="text-gray-600 mt-2">
          Create, assign, and track company badges
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaTimes className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "gallery"
                ? "border-[#40c0b8] text-[#40c0b8]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaMedal className="inline mr-2" />
            Badge Gallery
          </button>
          
          <button
            onClick={() => setActiveTab("assign")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assign"
                ? "border-[#40c0b8] text-[#40c0b8]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaPlus className="inline mr-2" />
            Assign Badges
          </button>
          
          <button
            onClick={() => setActiveTab("referrals")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "referrals"
                ? "border-[#40c0b8] text-[#40c0b8]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaChartBar className="inline mr-2" />
            Referral Stats
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "gallery" && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Badge Gallery</h3>
                <p className="mt-1 text-sm text-gray-500">All available badges in the system</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => toggleModal('create-badge-modal', true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#40c0b8] hover:bg-[#359a94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40c0b8]"
                >
                  <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                  Create New Badge
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBadges.map((badge) => (
                <div key={badge._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">{badge.name}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setBadgeForm({
                              id: badge._id,
                              name: badge.name
                            });
                            setPreviewImage(getFullImageUrl(badge.image));
                            // Show edit modal
                            toggleModal('edit-badge-modal', true);
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteBadge(badge._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4">
                    {badge.image ? (
                      <img 
                        src={getFullImageUrl(badge.image)} 
                        alt={badge.name} 
                        className="mx-auto h-24 w-24 object-contain"
                      />
                    ) : (
                      <div className="mx-auto h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Badge Modal */}
      <div id="create-badge-modal" className="hidden fixed inset-0  bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5  w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Badge</h3>
              <button 
                onClick={() => toggleModal('create-badge-modal', false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <form onSubmit={handleCreateBadge} className="mt-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Badge Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={badgeForm.name}
                  onChange={handleBadgeFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Badge Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img src={previewImage} alt="Preview" className="h-24 w-24 object-contain" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={() => toggleModal('create-badge-modal', false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#40c0b8] hover:bg-[#359a94] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Badge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Badge Modal */}
      <div id="edit-badge-modal" className="hidden fixed inset-0  overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5  w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Badge</h3>
              <button 
                onClick={() => toggleModal('edit-badge-modal', false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateBadge(badgeForm.id, {
                name: badgeForm.name,
                image: imageFile
              });
            }} className="mt-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                  Badge Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={badgeForm.name}
                  onChange={handleBadgeFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-image">
                  Badge Image
                </label>
                <input
                  type="file"
                  id="edit-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img src={previewImage} alt="Preview" className="h-24 w-24 object-contain" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={() => toggleModal('edit-badge-modal', false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#40c0b8] hover:bg-[#359a94] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Badge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {activeTab === "assign" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Assign Badges to Companies</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Selection */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Search Companies
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={companySearchTerm}
                    onChange={(e) => {
                      setCompanySearchTerm(e.target.value);
                      searchCompanies(e.target.value);
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#40c0b8] focus:border-[#40c0b8] sm:text-sm"
                    placeholder="Search companies..."
                  />
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Companies</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {companies.map((company) => (
                    <div
                      key={company._id}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        selectedCompany === company._id ? 'bg-[#e8f4f3]' : ''
                      }`}
                      onClick={() => {
                        setSelectedCompany(company._id);
                        loadCompanyBadges(company._id);
                      }}
                    >
                      <div className="font-medium">{company.companyName}</div>
                      <div className="text-sm text-gray-500">{company.slug}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Badge Selection and Assignment */}
            <div className="lg:col-span-2">
              {selectedCompany ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Select Badge
                      </label>
                      <div className="relative">
                        <select
                          value={selectedBadge}
                          onChange={(e) => setSelectedBadge(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40c0b8]"
                        >
                          <option value="">Choose a badge</option>
                          {filteredBadges.map((badge) => (
                            <option key={badge._id} value={badge._id}>
                              {badge.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Expiration Date (Optional)
                        </label>
                        <input
                          type="date"
                          name="expiresAt"
                          value={companyBadgeForm.expiresAt}
                          onChange={handleCompanyBadgeFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40c0b8]"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="homepage"
                            checked={companyBadgeForm.homepage}
                            onChange={handleCompanyBadgeFormChange}
                            className="rounded border-gray-300 text-[#40c0b8] focus:ring-[#40c0b8]"
                          />
                          <span className="ml-2 text-gray-700 text-sm font-bold">Display on Homepage</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Check this box to display this company in the homepage VIP listings
                        </p>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={handleAssignBadge}
                          disabled={loading || !selectedBadge}
                          className="bg-[#40c0b8] hover:bg-[#359a94] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        >
                          {loading ? "Assigning..." : "Assign Badge"}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Company&apos;s Current Badges</h3>
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40c0b8] mx-auto"></div>
                        </div>
                      ) : companyBadges.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No badges assigned to this company
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {companyBadges.map((companyBadge) => (
                            <div 
                              key={companyBadge._id} 
                              className="border border-gray-200 rounded-md p-3 flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                {companyBadge.badge.image ? (
                                  <img 
                                    src={getFullImageUrl(companyBadge.badge.image)} 
                                    alt={companyBadge.badge.name} 
                                    className="h-10 w-10 object-contain mr-3"
                                  />
                                ) : (
                                  <div className="h-10 w-10 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
                                    <FaMedal className="text-gray-500" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">{companyBadge.badge.name}</div>
                                  <div className="text-xs text-gray-500">
                                    Assigned: {new Date(companyBadge.assignedAt).toLocaleDateString()}
                                  </div>
                                  {companyBadge.expiresAt && (
                                    <div className="text-xs text-gray-500">
                                      Expires: {new Date(companyBadge.expiresAt).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditCompanyBadge(companyBadge)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleRemoveCompanyBadge(companyBadge._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Select a company to assign badges
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "referrals" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Badge Referral Statistics</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40c0b8]"></div>
            </div>
          ) : referralStats.length === 0 ? (
            <div className="text-center py-12">
              <FaChartBar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No referral data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Badge referrals will appear here once users start embedding badges on their websites.
              </p>
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">How to get referral data:</h4>
                <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                  <li>Embed badges on external websites (not intentwire.com)</li>
                  <li>Visitors to those websites will trigger referral tracking</li>
                  <li>Clicks on badges will drive traffic back to company profiles</li>
                  <li>Referral data will appear here within a few minutes</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source Website
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrals
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Referral
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referralStats.map((stat) => (
                    <tr key={`${stat.companyId}-${stat.sourceWebsite}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.sourceWebsite}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.companyName || `Company ID: ${stat.companyId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {stat.referralCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(stat.lastReferralAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-md font-medium text-blue-900 mb-2">How to track referrals:</h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>When users embed badges on their websites, referral tracking is automatic</li>
              <li>Each click from an embedded badge is tracked with the source website information</li>
              <li>Referral data helps you understand which websites are driving traffic to company profiles</li>
              <li>Use this data to identify valuable partnerships and content distribution channels</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}