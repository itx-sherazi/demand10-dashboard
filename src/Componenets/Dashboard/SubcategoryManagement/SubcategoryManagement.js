"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { categories, subcategoriesDashboard, addSubCategory, editSubcategory, deleteSubCategories } from "@/services/api";
import Button from "@/Componenets/ui/Button";

const SubcategoryManagement = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryList, setSubcategoryList] = useState([{ name: "", description: "", totalCompanies: "" }]);
  const [existingSubcategories, setExistingSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await categories();
      if (response?.data?.ok) {
        setCategoriesList(response?.data?.data);
      } else {
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
      
      if (response.data?.ok) {
        // Filter subcategories for the selected category
        const categorySubcategories = response.data.data.filter(
          sub => sub.category === categoryId
        );
        
        // Format the data with commas for display
        const formattedSubs = categorySubcategories.map(sub => ({
          _id: sub._id,
          name: sub.name || "",
          description: sub.description || "",
          totalCompanies: sub.totalCompanies ? sub.totalCompanies.toLocaleString() : ""
        }));
        
        setExistingSubcategories(formattedSubs);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
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
      // Reset form when category changes
      setSubcategoryList([{ name: "", description: "", totalCompanies: "" }]);
    } else {
      setExistingSubcategories([]);
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleNewSubcategoryChange = (index, field, value) => {
    const updatedList = [...subcategoryList];
    
    if (field === "totalCompanies") {
      // Allow numbers and commas, remove other characters
      const allowedChars = value.replace(/[^0-9,]/g, '');
      updatedList[index][field] = allowedChars;
    } else {
      updatedList[index][field] = value;
    }
    
    setSubcategoryList(updatedList);
  };

  const removeNewSubcategoryField = (index) => {
    const updatedList = subcategoryList.filter((_, i) => i !== index);
    setSubcategoryList(updatedList.length ? updatedList : [{ name: "", description: "", totalCompanies: "" }]);
  };

  const addNewSubcategoryField = () => {
    setSubcategoryList([...subcategoryList, { name: "", description: "", totalCompanies: "" }]);
  };

  const handleExistingSubcategoryChange = (index, field, value) => {
    const updatedList = [...existingSubcategories];
    
    if (field === "totalCompanies") {
      // Allow numbers and commas, remove other characters
      const allowedChars = value.replace(/[^0-9,]/g, '');
      updatedList[index][field] = allowedChars;
    } else {
      updatedList[index][field] = value;
    }
    
    setExistingSubcategories(updatedList);
  };

  const validateSubcategories = (subcategories) => {
    for (const sub of subcategories) {
      if (!sub.name.trim()) {
        toast.error("Subcategory name is required");
        return false;
      }
      if (!sub.description.trim()) {
        toast.error("Description is required for each subcategory");
        return false;
      }
      if (sub.totalCompanies === "") {
        toast.error("Total Companies is required");
        return false;
      }
      
      // Remove commas and validate if it's a valid number
      const numericValue = sub.totalCompanies.replace(/,/g, '');
      if (isNaN(Number(numericValue)) || Number(numericValue) < 0) {
        toast.error("Total Companies must be a valid positive number");
        return false;
      }
    }
    return true;
  };

  const handleSaveNewSubcategories = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }

    if (!validateSubcategories(subcategoryList)) {
      return;
    }

    setLoading(true);
    try {
      // Filter out empty subcategories and remove commas from totalCompanies
      const newSubcategories = subcategoryList
        .filter(sub => sub.name.trim() !== "")
        .map(sub => ({
          ...sub,
          totalCompanies: sub.totalCompanies.replace(/,/g, '') // Remove commas before sending
        }));

      if (newSubcategories.length === 0) {
        toast.info("No new subcategories to add");
        return;
      }

      const response = await addSubCategory({
        subcategories: newSubcategories,
        categoryId: selectedCategory
      });

      if (response.status === 201) {
        toast.success(`${newSubcategories.length} subcategory(s) added successfully`);
        // Reset form
        setSubcategoryList([{ name: "", description: "", totalCompanies: "" }]);
        // Refresh existing subcategories
        fetchSubcategories(selectedCategory);
      } else {
        throw new Error(response.data?.message || "Failed to add subcategories");
      }
    } catch (err) {
      console.error("Error saving subcategories:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to save subcategories");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExistingSubcategories = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }

    if (!validateSubcategories(existingSubcategories)) {
      return;
    }

    setLoading(true);
    try {
      const updateSubcategories = existingSubcategories.map(sub => ({
        ...sub,
        totalCompanies: sub.totalCompanies.replace(/,/g, '') // Remove commas before sending
      }));

      const updateResults = await Promise.all(
        updateSubcategories.map(sub => 
          editSubcategory(sub._id, {
            name: sub.name,
            description: sub.description,
            totalCompanies: sub.totalCompanies
          })
        )
      );
    
      if (updateResults.some(res => res.status !== 200)) {
        throw new Error("Some subcategories failed to update");
      }
    
      toast.success("Subcategories updated successfully");
      fetchSubcategories(selectedCategory);
    } catch (err) {
      console.error("Error updating subcategories:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update subcategories");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    try {
      const res = await deleteSubCategories(itemToDelete._id);
      
      if (res?.status === 200) {
        toast.success('Subcategory deleted successfully');
        fetchSubcategories(selectedCategory);
      } else {
        toast.error(res?.data?.message || 'Failed to delete subcategory');
      }
    } catch (err) {
      console.error('Delete failed', err);
      toast.error(err?.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
      setConfirmDelete(false);
      setItemToDelete(null);
    }
  };

  const openDeleteConfirmation = (item) => {
    setItemToDelete(item);
    setConfirmDelete(true);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  return (
    <div className="px-4 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Subcategory Management</h1>
        <p className="text-gray-600">Manage subcategories for different categories</p>
      </div>

      {/* Category Selection */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category *
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categoriesList.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <>
          {/* Add New Subcategories */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Subcategories</h2>
            
            <div className="space-y-6 mb-6">
              {subcategoryList.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-700">
                      Subcategory {index + 1}
                    </h4>
                    {subcategoryList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNewSubcategoryField(index)}
                        className="px-3 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory Name *
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleNewSubcategoryChange(index, "name", e.target.value)}
                        placeholder="Enter subcategory name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleNewSubcategoryChange(index, "description", e.target.value)}
                        placeholder="Enter description"
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Companies *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={item.totalCompanies}
                        onChange={(e) => handleNewSubcategoryChange(index, "totalCompanies", e.target.value)}
                        placeholder="Enter total companies (e.g., 23,450)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can use commas to format numbers (e.g., 1,234,567)
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addNewSubcategoryField}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                disabled={loading}
              >
                + Add Another Subcategory
              </button>
            </div>

            <div className="flex justify-end">
              <Button
                label={loading ? "Saving..." : "Save New Subcategories"}
                onClick={handleSaveNewSubcategories}
                loading={loading}
                className="px-6 py-3 bg-[#1a365d] hover:bg-[#3bb5ab] text-white rounded-lg font-medium"
                disabled={loading}
              />
            </div>
          </div>

          {/* Existing Subcategories */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Subcategories</h2>
            
            {loading ? (
              <div className="text-center py-8">Loading subcategories...</div>
            ) : existingSubcategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No subcategories found for this category
              </div>
            ) : (
              <div className="space-y-6 mb-6">
                {existingSubcategories.map((item, index) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-700">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => openDeleteConfirmation(item)}
                        className="px-3 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory Name *
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleExistingSubcategoryChange(index, "name", e.target.value)}
                          placeholder="Enter subcategory name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleExistingSubcategoryChange(index, "description", e.target.value)}
                          placeholder="Enter description"
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Companies *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.totalCompanies}
                          onChange={(e) => handleExistingSubcategoryChange(index, "totalCompanies", e.target.value)}
                          placeholder="Enter total companies (e.g., 23,450)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          You can use commas to format numbers (e.g., 1,234,567)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {existingSubcategories.length > 0 && (
              <div className="flex justify-end">
                <Button
                  label={loading ? "Updating..." : "Update Subcategories"}
                  onClick={handleUpdateExistingSubcategories}
                  loading={loading}
                  className="px-6 py-3 bg-[#1a365d] hover:bg-[#3bb5ab] text-white rounded-lg font-medium"
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Confirm Deletion
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-red-500">{itemToDelete?.name}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone and will also delete all associated companies.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                onClick={closeDeleteConfirmation}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
                onClick={handleDeleteSubcategory}
                disabled={loading}
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {loading ? 'Deleting...' : 'Delete Subcategory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubcategoryManagement;