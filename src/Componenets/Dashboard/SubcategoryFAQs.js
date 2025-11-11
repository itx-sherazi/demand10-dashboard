'use client';
import React, { useState, useEffect } from 'react';
import { subcategoriesDashboard, editSubcategory } from '@/services/api';

const SubcategoryFAQs = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFAQs, setLoadingFAQs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

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
      setFaqs([]);
      return;
    }

    // Show loading state
    setLoadingFAQs(true);
    setMessage('');

    // Small delay to show loading indicator
    await new Promise(resolve => setTimeout(resolve, 100));

    const subcategory = subcategories.find(s => s._id === subcategoryId);
    setSelectedSubcategory(subcategory);
    // Make sure to load existing FAQs properly
    setFaqs(Array.isArray(subcategory.faqs) ? subcategory.faqs : []);
    
    setLoadingFAQs(false);
  };

  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFAQ = (index) => {
    const newFAQs = [...faqs];
    newFAQs.splice(index, 1);
    setFaqs(newFAQs);
  };

  const handleFAQChange = (index, field, value) => {
    const newFAQs = [...faqs];
    newFAQs[index][field] = value;
    setFaqs(newFAQs);
  };

  const handleSaveFAQs = async () => {
    if (!selectedSubcategory) {
      setMessage('Please select a subcategory first');
      return;
    }

    setSaving(true);
    setMessage('');
    
    try {
      // Filter out empty FAQs
      const validFAQs = faqs.filter(faq => faq.question.trim() !== '' && faq.answer.trim() !== '');
      
      const payload = {
        faqs: validFAQs
      };

      const response = await editSubcategory(selectedSubcategory._id, payload);
      
      if (response.status === 200) {
        setMessage('FAQs saved successfully! Note: It may take up to 10 minutes for changes to appear on the website due to caching.');
        // Update the subcategory in the list
        setSubcategories(subcategories.map(s => 
          s._id === selectedSubcategory._id 
            ? { ...s, faqs: validFAQs } 
            : s
        ));
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('Error saving FAQs: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving FAQs:', error);
      setMessage('Error saving FAQs: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Show initial loading state
  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Subcategory FAQ Management</h2>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Subcategory FAQ Management</h2>
      
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
          disabled={loading || loadingFAQs}
        >
          <option value="">-- Select a Subcategory --</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory._id} value={subcategory._id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      {loadingFAQs && (
        <div className="flex justify-center items-center py-12 mb-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      )}

      {selectedSubcategory && !loadingFAQs && (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                FAQs for: <span className="text-teal-600 font-semibold">{selectedSubcategory.name}</span>
                <span className="text-sm text-gray-500 ml-2">({faqs.length} FAQ{faqs.length !== 1 ? 's' : ''} loaded)</span>
              </h3>
              <button
                onClick={handleAddFAQ}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Add FAQ
              </button>
            </div>

            <div className="space-y-4">
              {faqs.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No FAQs added yet. Click &quot;Add FAQ&quot; to get started.</p>
                </div>
              ) : (
                faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-700">FAQ #{index + 1}</h4>
                      <button
                        onClick={() => handleRemoveFAQ(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Enter question"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Enter answer"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveFAQs}
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
              ) : 'Save FAQs'}
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

export default SubcategoryFAQs;