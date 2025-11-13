'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { subcategoriesDashboard, editSubcategory } from '@/services/api';

// Dynamically import jodit-react to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const SubcategoryContent = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const editor = useRef(null);

  useEffect(() => {
    setMounted(true);
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const response = await subcategoriesDashboard();
      if (response.data.ok) {
        setSubcategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setMessage('Error fetching subcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryChange = async (e) => {
    const subcategoryId = e.target.value;
    
    if (!subcategoryId) {
      setSelectedSubcategory(null);
      setContent('');
      return;
    }

    // Show loading state
    setLoadingContent(true);
    setMessage('');

    // Small delay to show loading indicator
    await new Promise(resolve => setTimeout(resolve, 100));

    const subcategory = subcategories.find(s => s._id === subcategoryId);
    setSelectedSubcategory(subcategory);
    // Make sure to load existing content properly
    setContent(subcategory.content || '');
    
    setLoadingContent(false);
  };

  const handleSaveContent = async () => {
    if (!selectedSubcategory) {
      setMessage('Please select a subcategory first');
      return;
    }

    setSaving(true);
    setMessage('');
    
    try {
      // Check if content is empty or just whitespace/empty tags
      let cleanContent = content || '';
      
      // Remove whitespace and check if it's just empty HTML tags
      const trimmedContent = cleanContent.trim();
      if (trimmedContent === '' || trimmedContent === '<p><br></p>' || trimmedContent === '<p></p>') {
        cleanContent = '';
      }
      
      const payload = {
        content: cleanContent
      };

      const response = await editSubcategory(selectedSubcategory._id, payload);
      
      if (response.status === 200) {
        setMessage('Content saved successfully! Note: It may take up to 10 minutes for changes to appear on the website due to caching.');
        // Update the subcategory in the list
        setSubcategories(subcategories.map(s => 
          s._id === selectedSubcategory._id 
            ? { ...s, content: cleanContent } 
            : s
        ));
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('Error saving content: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content: ' + error.message);
    } finally {
      setSaving(false);
    }
  };



  // Show initial loading state
  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Subcategory Content Management</h2>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Subcategory Content Management</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg transition-all ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Subcategory
        </label>
        <select
          onChange={handleSubcategoryChange}
          value={selectedSubcategory?._id || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          disabled={loading || loadingContent}
        >
          <option value="">-- Select a Subcategory --</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory._id} value={subcategory._id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      {loadingContent && (
        <div className="flex justify-center items-center py-12 mb-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      )}

      {selectedSubcategory && !loadingContent && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content for: <span className="text-teal-600 font-semibold">{selectedSubcategory.name}</span>
              <span className="text-sm text-gray-500 ml-2">({content?.length || 0} characters)</span>
            </label>
            <div className="border-2 border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#1e477f] focus-within:border-[#1e477f] transition-all duration-200">
              <JoditEditor
                ref={editor}
                value={content}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button
              onClick={handleSaveContent}
              disabled={saving}
              className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                saving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
              }`}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Content'}
            </button>
          </div>
        </>
      )}

      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      )}
    </div>
  );
};

export default SubcategoryContent;