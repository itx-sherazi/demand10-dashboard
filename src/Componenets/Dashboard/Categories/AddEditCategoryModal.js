"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { addCategory, updateCategory } from "@/services/api";
import Input from "@/Componenets/ui/Input";
import Button from "@/Componenets/ui/Button";

const AddEditCategoryModal = ({
  isOpen,
  setIsOpen,
  selectedItem,
  setSelectedItem,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: selectedItem?.name || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsOpen(false);
    setForm({ name: "" });
    setSelectedItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    try {
      if (selectedItem) {
        await updateCategory(form, selectedItem._id);
        toast.success("Category updated successfully");
      } else {
        await addCategory(form);
        toast.success("Category added successfully");
      }
      refreshData();
      handleCancel();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {selectedItem ? "Edit Category" : "Add New Category"}
          </h2>
          <div className="w-16 h-1 bg-[#4ecfc5] mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <Input
              name="name"
              placeholder="Enter category name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4ecfc5] focus:outline-none transition-colors"
              onChange={handleChange}
              value={form.name}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <Button
              label={
                loading
                  ? "Saving..."
                  : selectedItem
                  ? "Update"
                  : "Add Category"
              }
              type="submit"
              loading={loading}
              className="px-6 py-3 bg-[#4ecfc5] hover:bg-[#3bb5ab] text-white rounded-lg transition-colors font-medium"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCategoryModal;