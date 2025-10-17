"use client"
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../DataTable';
import { subcategoriesDashboard, uploadExcelSheet, deleteSubCategories } from '@/services/api';
import Button from '@/Componenets/ui/Button';
import 'react-toastify/dist/ReactToastify.css';

const Sheet = () => {
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [addCompanyModal, setAddCompanyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const getSubCategories = async () => {
    const response = await subcategoriesDashboard();
    if (response?.data?.ok) {
      setListData(response?.data?.data);
      setFilteredData(response?.data?.data);
    }
  };

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(listData);
    } else {
      const filtered = listData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, listData]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const res = await uploadExcelSheet(file, selectedItem?.name);
      if (res?.data?.data) {
        setExcelData(res.data); // Assuming your API returns parsed Excel rows in `data`
      }
      if (res?.status === 201) {
        toast.success("File Uploaded Successfully");
      }
      setAddCompanyModal(false); // Close modal after upload
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await deleteSubCategories(itemToDelete._id || itemToDelete.id);
      
      if (res?.status === 200) {
        toast.success('Subcategory deleted successfully');
        getSubCategories();
      } else {
        toast.error(res?.data?.message || 'Failed to delete subcategory');
      }
    } catch (err) {
      console.error('Delete failed', err);
      toast.error(err?.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setConfirmDelete(true);
  };

  const headers = [
    {
      label: 'Sub Category Name',
      attribute: 'name',
    },
    {
      label: 'Actions',
      attribute: 'Actions',
      parseData: (item) => (
        <div className="flex gap-2 justify-center">
          <Button
            label={'Add Company'}
            onClick={() => {
              setAddCompanyModal(true);
              setSelectedItem(item);
            }}
            className={'!bg-[#1a365d] hover:!bg-[#3bb5ab] text-white px-4 py-2 rounded-lg transition-colors duration-200'}
          />
          <Button
            label={'Delete'}
            onClick={() => handleDeleteClick(item)}
            className={'!bg-red-500 hover:!bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200'}
            disabled={deleteLoading}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getSubCategories();
  }, []);

  return (
    <div className="p-5">
      {/* Header with Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent outline-none transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

   

      <DataTable
        data={filteredData}
        title={''}
        headers={headers}
      />
   
      {addCompanyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-[500px] mx-auto transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#1a365d] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Upload Excel Sheet
              </h2>
              <p className="text-gray-600 mb-4">
                For: <span className="font-semibold text-[#1a365d]">{selectedItem?.name}</span>
              </p>
              <div className="w-16 h-1 bg-[#1a365d] mx-auto rounded-full"></div>
            </div>

            <div className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1a365d] transition-colors duration-200">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="excel-upload"
                  className={`cursor-pointer block ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div className="space-y-2">
                    <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 font-medium">
                      {loading ? 'Uploading...' : 'Click to select Excel file'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports .xlsx and .xls files (Max 5MB)
                    </p>
                  </div>
                </label>
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="flex items-center justify-center space-x-2 p-4 bg-[#1a365d] bg-opacity-10 rounded-lg">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1a365d]"></div>
                  <span className="text-[#1a365d] font-medium">Uploading file...</span>
                </div>
              )}

              {/* File Guidelines */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">File Guidelines:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Supported formats: .xlsx</li>
                  <li>• Make sure your Excel file is properly formatted</li>
                  <li>• First row should contain column headers</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 bo mt-6">
              <button
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => {
                  setAddCompanyModal(false);
                  setSelectedItem(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => {
                  setConfirmDelete(false);
                  setItemToDelete(null);
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
                onClick={handleDeleteSubCategory}
                disabled={deleteLoading}
              >
                {deleteLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {deleteLoading ? 'Deleting...' : 'Delete Subcategory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sheet;