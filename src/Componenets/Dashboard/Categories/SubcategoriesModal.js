  "use client";
  import { useState, useEffect } from "react";
  import { toast } from "react-toastify";
  import { addSubCategory, editSubcategory, subcategoriesDashboard } from "@/services/api";
  import Input from "@/Componenets/ui/Input";
  import Button from "@/Componenets/ui/Button";

  const SubcategoriesModal = ({
    isOpen,
    setIsOpen,
    selectedItem,
    refreshData,
    subMode,
    setSubMode,
  }) => {
    const [loading, setLoading] = useState(false);
    const [subcategoryList, setSubcategoryList] = useState([
      { name: "", description: "", totalCompanies: "" }
    ]);

    // Fetch and format subcategory data
    useEffect(() => {
      const fetchSubcategories = async () => {
        if (subMode === "edit" && selectedItem?._id) {
          try {
            setLoading(true);
            const response = await subcategoriesDashboard();
            
            if (response.data?.ok) {
              // Filter subcategories for the current category
              const categorySubcategories = response.data.data.filter(
                sub => sub.category === selectedItem._id
              );

              // Format the data with proper types and add commas to numbers
              const formattedSubs = categorySubcategories.map(sub => ({
                _id: sub._id,
                name: sub.name || "",
                description: sub.description || "",
                totalCompanies: sub.totalCompanies ? sub.totalCompanies.toLocaleString() : ""
              }));

              setSubcategoryList(formattedSubs.length ? formattedSubs : [{ 
                name: "", 
                description: "", 
                totalCompanies: "" 
              }]);
            }
          } catch (error) {
            console.error("Error fetching subcategories:", error);
            toast.error("Failed to load subcategories");
            setSubcategoryList([{ name: "", description: "", totalCompanies: "" }]);
          } finally {
            setLoading(false);
          }
        } else {
          setSubcategoryList([{ name: "", description: "", totalCompanies: "" }]);
        }
      };

      fetchSubcategories();
    }, [selectedItem, subMode]);

    const handleSubcategoryChange = (index, field, value) => {
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

    const removeSubcategoryField = (index) => {
      const updatedList = subcategoryList.filter((_, i) => i !== index);
      setSubcategoryList(updatedList.length ? updatedList : [{ name: "", description: "", totalCompanies: "" }]);
    };

    const addSubcategoryField = () => {
      setSubcategoryList([...subcategoryList, { name: "", description: "", totalCompanies: "" }]);
    };

    const validateSubcategories = () => {
      for (const sub of subcategoryList) {
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

    const handleSubmit = async () => {
      if (!selectedItem?._id) {
        toast.error("No category selected");
        return;
      }

      if (!validateSubcategories()) {
        return;
      }

      setLoading(true);
      try {
        // Format data for API - remove commas from numbers
        const newSubcategories = subcategoryList
          .filter(sub => !sub._id)
          .map(sub => ({
            name: sub.name.trim(),
            description: sub.description.trim(),
            totalCompanies: sub.totalCompanies.replace(/,/g, '') // Remove commas before sending
          }));

        const existingSubcategories = subcategoryList
          .filter(sub => sub._id)
          .map(sub => ({
            _id: sub._id,
            name: sub.name.trim(),
            description: sub.description.trim(),
            totalCompanies: sub.totalCompanies.replace(/,/g, '') // Remove commas before sending
          }));

        // API calls
        if (newSubcategories.length > 0) {
          const response = await addSubCategory({
            subcategories: newSubcategories,
            categoryId: selectedItem._id
          });
          if (response.status !== 201) {
            throw new Error("Failed to add subcategories");
          }
          toast.success(`${newSubcategories.length} subcategory(s) added`);
        }

        if (existingSubcategories.length > 0) {
          const updateResults = await Promise.all(
            existingSubcategories.map(sub => 
              editSubcategory(sub._id, {
                name: sub.name,
                description: sub.description,
                totalCompanies: sub.totalCompanies.replace(/,/g, '') // Remove commas before sending
              })
            )
          );
          
          if (updateResults.some(res => res.status !== 200)) {
            throw new Error("Some subcategories failed to update");
          }
          toast.success(`${existingSubcategories.length} subcategory(s) updated`);
        }

        refreshData();
        handleClose();
      } catch (err) {
        console.error("Error saving subcategories:", err);
        toast.error(err.response?.data?.message || err.message || "Failed to save subcategories");
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setIsOpen(false);
      setSubcategoryList([{ name: "", description: "", totalCompanies: "" }]);
      setSubMode("add");
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-[700px] mx-auto max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Manage Subcategories
            </h2>
            <p className="text-gray-600 mb-4">
              Category:{" "}
              <span className="font-semibold text-[#1a365d]">
                {selectedItem?.name}
              </span>
            </p>
            <div className="w-16 h-1 bg-[#1a365d] mx-auto rounded-full"></div>
          </div>

          <div className="flex justify-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="add"
                checked={subMode === "add"}
                onChange={() => setSubMode("add")}
                className="text-[#1a365d] focus:ring-[#1a365d]"
              />
              <span className="font-medium text-gray-700">Add New</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="edit"
                checked={subMode === "edit"}
                onChange={() => setSubMode("edit")}
                className="text-[#1a365d] focus:ring-[#1a365d]"
              />
              <span className="font-medium text-gray-700">Edit Existing</span>
            </label>
          </div>

          <div className="space-y-6 mb-6">
            {loading ? (
              <div className="text-center py-8">Loading subcategories...</div>
            ) : (
              subcategoryList.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-700">
                      Subcategory {index + 1}
                    </h4>
                    {subcategoryList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubcategoryField(index)}
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
                      <Input
                        value={item.name}
                        onChange={(e) => handleSubcategoryChange(index, "name", e.target.value)}
                        placeholder="Enter subcategory name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a365d] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleSubcategoryChange(index, "description", e.target.value)}
                        placeholder="Enter description"
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a365d] focus:outline-none resize-none"
                        required
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
                        onChange={(e) => handleSubcategoryChange(index, "totalCompanies", e.target.value)}
                        placeholder="Enter total companies (e.g., 222,334,342)"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1a365d] focus:outline-none"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can use commas to format numbers (e.g., 1,234,567)
                      </p>
                    </div>
                  </div>
                </div>
                
              ))
            )}

            <button
              type="button"
              onClick={addSubcategoryField}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
              disabled={loading}
            >
              + Add Another Subcategory
            </button>
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <Button
              label={loading ? "Saving..." : "Save Subcategories"}
              onClick={handleSubmit}
              loading={loading}
              className="px-6 py-3 bg-[#1a365d] hover:bg-[#3bb5ab] text-white rounded-lg font-medium"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    );
  };

  export default SubcategoriesModal;