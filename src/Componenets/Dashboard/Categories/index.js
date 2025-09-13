"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataTable from "../DataTable";
import {
  categories,
  deleteCategory,
} from "@/services/api";
import AddEditCategoryModal from "./AddEditCategoryModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const CategoriesMain = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listData, setListData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const headers = [
    {
      label: "Category Name",
      attribute: "name",
    },
    {
      label: "Actions",
      attribute: "Actions",
      parseData: (item) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleEditClick(item)}
            className="bg-[#4ecfc5] hover:bg-[#3bb5ab] text-white px-4 py-2 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(item)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const getCategories = async () => {
    try {
      const response = await categories();
      if (response?.data?.ok) {
        setListData(response?.data?.data);
        toast.success("Categories loaded successfully");
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Error loading categories");
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setConfirmDelete(true);
  };

  const confirmDeletion = async () => {
    if (selectedItem) {
      try {
        const response = await deleteCategory(selectedItem?._id);
        if (response?.status === 200) {
          toast.success("Category deleted successfully");
          getCategories();
        } else {
          toast.error("Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Error deleting category");
      }
    }
    setConfirmDelete(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="px-4 py-4">
      <DataTable
        data={listData}
        title={"Categories"}
        headers={headers}
        setIsModalOpen={setIsModalOpen}
        btnLabel={"Add Category"}
      />

      {/* Modals */}
      <AddEditCategoryModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        refreshData={getCategories}
      />

      <DeleteConfirmationModal
        isOpen={confirmDelete}
        setIsOpen={setConfirmDelete}
        selectedItem={selectedItem}
        confirmDeletion={confirmDeletion}
      />
    </div>
  );
};

export default CategoriesMain;