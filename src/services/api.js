import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data.users || [];
};

export const deleteUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete user");
  }

  return await response.json();
};

export const blockUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/block`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to block user");
  }

  return await response.json();
};

export const activateUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/activate`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to activate user");
  }

  return await response.json();
};

export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network error");
  }
};

export const signinUser = async (signinData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(signinData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Network error");
  }
};

export const deleteRequestById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleterequest/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API error deleting request:", error);
    return { ok: false, message: "Network or server error." };
  }
};

export const updateCompany = async (companyId, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateproduct/${companyId}`, {
      method: "PUT",
      body: formData,
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update car");
    }

    const data = await response.json();

    return data.product;
  } catch (error) {
    console.error("Error updating car:", error);
    throw error;
  }
};

export const fetchProductDetail = async (slug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch product");
  }
};

export const addProductService = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add-product`, formData, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error in addProductService:", error);
    throw error;
  }
};

export const deleteCompany = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
};

export const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/All`, {
    credentials: "include"
  });
  const result = await response.json();

  // Check if data is okay
  if (!result.ok) {
    throw new Error("No company found");
  }

  return result.products;
};

export const fetchDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboardAllProducts`, {
    credentials: "include"
  });
  const result = await response.json();

  // Check if data is okay
  if (!result.ok) {
    throw new Error("No company found");
  }

  return result.products;
};

export const deleteBlog = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogdelete/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
};

export const AddBlog = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/creat`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create blog");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchRequest = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/AllData`, {
      credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch requests");
    }

    return result;
  } catch (error) {
    console.error('fetchRequest error:', error);
    throw error;
  }
};

export const fetchProductData = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${slug}`, {
      credentials: "include"
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch product");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchCompanyTabelData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAll`, {
      credentials: "include"
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch product");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// services/api.js
export const fetchBlog = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/get?page=${page}&limit=${limit}`);
  const result = await response.json();
  return {
    data: result.data,
    totalPages: result.totalPages,
    totalBlogs: result.totalPosts
  };
};

export const addProduct = async (formData, imageFile) => {
  const submitData = new FormData();

  Object.keys(formData).forEach((key) => {
    if (formData[key]) {
      submitData.append(key, formData[key]);
    }
  });

  submitData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/add-product`, {
    method: "POST",
    body: submitData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add product");
  }

  return result;
};

export const fetchSampelCompany = async () => {
  const response = await fetch(`${API_BASE_URL}/getAll`, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  const result = await response.json();
  return result.product;
};

export const AddSampelData = async (formData, imageFile) => {
  const submitData = new FormData();

  Object.keys(formData).forEach((key) => {
    if (formData[key]) {
      submitData.append(key, formData[key]);
    }
  });

  submitData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/add`, {
    method: "POST",
    body: submitData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add product");
  }

  return result;
};

export const updateSampelData = async (companyId, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateCompany/${companyId}`, {
      method: "PUT",
      body: formData,
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update car");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating car:", error);
    throw error;
  }
};

export const deleteSampelCompany = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteCompany/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
};

export const deleteDataSet = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleterequest/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
};

export const categories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional: for fresh data every time
      credentials: "include"
    });

    const data = await res.json();
    return { data };
  } catch (error) {
    console.error("Error in categories():", error);
    return { data: { ok: false, data: [] } };
  }
};

export const subcategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/subcategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional
      credentials: "include"
    });

    const data = await res.json();
    return { data }; // So response.data.ok and data.data work
  } catch (error) {
    console.error("Error in subcategories():", error);
    return { data: { ok: false, data: [] } };
  }
};

export const subcategoriesDashboard = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/subcategories-dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional
      credentials: "include"
    });

    const data = await res.json();
    return { data }; // So response.data.ok and data.data work
  } catch (error) {
    console.error("Error in subcategoriesDashboard():", error);
    return { data: { ok: false, data: [] } };
  }
};

export const addCategory = async (form) => {
  try {
    const res = await fetch(`${API_BASE_URL}/create-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status, // 🟢 So you can check response.status === 201
      data,
    };
  } catch (error) {
    console.error("Error in addCategory():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

export const addSubCategory = async (payload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/create-subcategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status, // 🔁 So you can check: if (res?.status === 201)
      data,
    };
  } catch (error) {
    console.error("Error in addSubCategory():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/delete-categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status, // So you can check response?.status === 200
      data,
    };
  } catch (error) {
    console.error("Error in deleteCategory():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

export const updateCategory = async (payload, id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/edit-categories/${id}`, {
      method: "PUT", // or PATCH depending on backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status, // you’re checking for 201 or 200
      data,
    };
  } catch (error) {
    console.error("Error in updateCategory():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

export const editSubcategory = async (id, payload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/editsubcategories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
    };
  } catch (error) {
    console.error("Error in editSubcategory():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Enhanced edit subcategory with detailed data and images
export const editSubcategoryDetailed = async (id, formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/editsubcategories/${id}`, {
      method: "PUT",
      body: formData, // FormData for image uploads
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
    };
  } catch (error) {
    console.error("Error in editSubcategoryDetailed():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Create subcategory with detailed data and images
export const createSubcategoryDetailed = async (formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/create-subcategory`, {
      method: "POST",
      body: formData, // FormData for image uploads
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
    };
  } catch (error) {
    console.error("Error in createSubcategoryDetailed():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Get single subcategory details
export const getSubcategoryDetails = async (slug) => {
  try {
    const res = await fetch(`${API_BASE_URL}/detail/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
    };
  } catch (error) {
    console.error("Error in getSubcategoryDetails():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

export const uploadExcelSheet = async (file, name) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("subcategoryName", name);

  try {
    const res = await fetch(`${API_BASE_URL}/companies/upload-to-subcategory`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status,
      data,
    };
  } catch (error) {
    console.error("Error in uploadExcelSheet():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

export const deleteSubCategories = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/deletesubcategories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await res.json();

    return {
      status: res.status, 
      data,
    };
  } catch (error) {
    console.error("Error in deleteCategory():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

export async function fetchCompanyDetail(slug) {
  const res = await fetch(`${API_BASE_URL}/companybyslug/${slug}`, {
    credentials: "include"
  });

  if (!res.ok) {
    // Optional: Handle HTTP errors more explicitly
    console.error("Failed to fetch company detail");
    return [];
  }

  return await res.json();
}

export async function fetchCompanies(slug) {
  const res = await fetch(`${API_BASE_URL}/subcategories/companies/${slug}`, {
    credentials: "include"
  });

  if (!res.ok) {
    console.error("Failed to fetch companies");
    return [];
  }

  return await res.json();
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      cache: "no-store", // disables Next.js caching
      credentials: "include"
    });

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}

// services/api.js

export const fetchRelatedCompanies = async (subcategoryId, excludeSlug) => {
  try {
    const res = await fetch(`${API_BASE_URL}/related-companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subcategory: subcategoryId,
        excludeSlug: excludeSlug,
      }),
      cache: "no-store", // Optional: to avoid caching in SSR
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Failed to fetch related companies");
    }

    const data = await res.json();
    return data?.companies;
  } catch (error) {
    console.error("Error fetching related companies:", error);
    return [];
  }
};


export const  fetchCompaniesSearch = async (searchParams) => {
  const params = new URLSearchParams();

  if (searchParams.company_name) {
    params.append("company_name", searchParams.company_name);
  }
  if (searchParams.company_country) {
    params.append("company_country", searchParams.company_country);
  }
  if (searchParams.subcategory_slug) {
    params.append("subcategory_slug", searchParams.subcategory_slug);
  }

  const res = await fetch(`${API_BASE_URL}/search-companies?${params.toString()}`, {
    cache: "no-store",
    credentials: "include"
  });

  const data = await res.json();
  return data.data || [];
}

export const fetchTrending = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/trending`, {
      credentials: "include"
    });
    const data = await response.json(); // 👈 yeh zaroori hai

    return {
      products: data?.products || [],
    };
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};

export const uploadOgImage = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-og-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Upload failed" };
  }
};

// Get Current OG Image
export const getOgImage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/og-image`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch OG image" };
  }
};

// 🆕 Get All Companies with Pagination and Search
export const getAllCompanies = async (page = 1, limit = 50, search = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    
    const response = await fetch(`${API_BASE_URL}/companies/all?${params}`, {
      credentials: "include"
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch companies");
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching all companies:', error);
    throw error;
  }
};

// 🆕 Update Company with Team Leads
export const updateCompanyWithTeamLeads = async (companyId, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateCompanyTeam/${companyId}`, {
      method: "PUT",
      body: formData,
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update company");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

// 🆕 Delete Company with Team Leads
export const deleteCompanyWithTeamLeads = async (companyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteCompanyTeam/${companyId}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete company");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

// 🆕 Fetch all company claims
export const fetchAllCompanyClaims = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/claims`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching company claims:', error);
    throw error;
  }
};

// 🆕 Approve company claim
export const approveCompanyClaim = async (claimId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/claim/approve/${claimId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error approving company claim:', error);
    throw error;
  }
};

// 🆕 Reject company claim
export const rejectCompanyClaim = async (claimId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/claim/reject/${claimId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error rejecting company claim:', error);
    throw error;
  }
};

// 🆕 Delete company claim
export const deleteCompanyClaim = async (claimId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/claim/${claimId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting company claim:', error);
    throw error;
  }
};

// 🆕 Fetch all company listing requests
export const fetchAllCompanyListingRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching company listing requests:', error);
    throw error;
  }
};

// 🆕 Approve company listing request
export const approveCompanyListingRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listing/approve/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error approving company listing request:', error);
    throw error;
  }
};

// 🆕 Reject company listing request
export const rejectCompanyListingRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listing/reject/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error rejecting company listing request:', error);
    throw error;
  }
};

// 🆕 Review Management APIs

// 🆕 Enhanced error handling for approveReview
export const approveReview = async (reviewId) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await axios.put(
      `${API_BASE_URL}/approve/${reviewId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    
    return response.data;
  } catch (error) {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    console.error('Error approving review:', error);
    throw error;
  }
};

// 🆕 Enhanced error handling for rejectReview
export const rejectReview = async (reviewId) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await axios.put(
      `${API_BASE_URL}/reject/${reviewId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    
    return response.data;
  } catch (error) {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    console.error('Error rejecting review:', error);
    throw error;
  }
};

// 🆕 Enhanced error handling for deleteReview
export const deleteReview = async (reviewId) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await axios.delete(
      `${API_BASE_URL}/delete/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    
    return response.data;
  } catch (error) {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    console.error('Error deleting review:', error);
    throw error;
  }
};

// 🆕 Enhanced error handling for fetchAllReviews
export const fetchAllReviews = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await axios.get(`${API_BASE_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// 🆕 Update company sponsorship status
export const updateCompanySponsorship = async (companyId, sponsor) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${companyId}/sponsor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({ sponsor }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update company sponsorship");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in updateCompanySponsorship():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Delete Company Listing Request
export const deleteCompanyListingRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listing/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting company listing request:', error);
    throw error;
  }
};

export const getAdminUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/getuser`, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin users");
  }

  const data = await response.json();
  return data.users || [];
};

export const deleteAdminUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete admin user");
  }

  return await response.json();
};

// 🆕 Badge Management APIs

// 🆕 Create a new badge
export const createBadge = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/badges`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create badge");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in createBadge():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Get all badges
export const getAllBadges = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/badges?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch badges");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in getAllBadges():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Get badges by category
export const getBadgesByCategory = async (category, filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/badges/category/${category}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch badges by category");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in getBadgesByCategory():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Get badge by ID
export const getBadgeById = async (badgeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/badges/${badgeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch badge");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in getBadgeById():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Update badge
export const updateBadge = async (badgeId, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/badges/${badgeId}`, {
      method: "PUT",
      body: formData,
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update badge");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in updateBadge():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Delete badge
export const deleteBadge = async (badgeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/badges/${badgeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete badge");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in deleteBadge():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Update company badge homepage status
export const updateCompanyBadgeHomepage = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company-badges/homepage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update company badge homepage status");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in updateCompanyBadgeHomepage():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Assign badge to company
export const assignBadgeToCompany = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company-badges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to assign badge to company");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in assignBadgeToCompany():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Assign ranking badge to company
export const assignRankingBadge = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company-badges/ranking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to assign ranking badge to company");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in assignRankingBadge():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Remove badge from company
export const removeBadgeFromCompany = async (companyBadgeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company-badges/${companyBadgeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove badge from company");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in removeBadgeFromCompany():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Update company badge assignment
export const updateCompanyBadge = async (companyBadgeId, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company-badges/${companyBadgeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update company badge assignment");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in updateCompanyBadge():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Get badges for a specific company (admin)
export const getCompanyBadges = async (companyId, filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/company-badges/company/${companyId}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch company badges");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in getCompanyBadges():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Get badges for a specific company (public/frontend)
export const getCompanyBadgesForFrontend = async (companyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/badges/public/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch company badges for frontend");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in getCompanyBadgesForFrontend():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

// 🆕 Get all company badge assignments
export const getAllCompanyBadges = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/company-badges?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch company badge assignments");
    }

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Error in getAllCompanyBadges():", error);
    return {
      status: 500,
      data: { message: "Something went wrong", error: error.message },
    };
  }
};

