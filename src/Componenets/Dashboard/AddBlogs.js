"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { AddBlog } from "@/services/api";
import { toast } from "react-hot-toast";
import { handleApiError, showSuccess } from "@/utils/errorHandler";
import Image from "next/image";

const Addblogs = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("General");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const editor = useRef(null);

  // Predefined categories for better UX
  const predefinedCategories = [
    "Technology",
    "Business",
    "Marketing",
    "Sales",
    "Productivity",
    "Industry Trends",
    "Case Studies",
    "Best Practices",
    "General"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title || !body || !image) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("category", category);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("keywords", keywords);

    setLoading(true);

    try {
      const result = await AddBlog(formData);

      showSuccess("Blog post created successfully!");

      // Reset form
      setTitle("");
      setBody("");
      setDescription("");
      setImage(null);
      setPreview(null);
      setTags("");
      setCategory("General");
      setMetaTitle("");
      setMetaDescription("");
      setKeywords("");
    } catch (error) {
      handleApiError(error, 'Creating Blog Post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Header with Title and Publish Button */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          ✍️ Write New Blog
        </h1>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${
            loading
              ? "bg-[#1e9e9a] cursor-not-allowed opacity-70"
              : "bg-[#1e9e9a] hover:bg-[#17807d] cursor-pointer"
          } text-white px-6 py-3 rounded-lg text-lg font-semibold flex items-center gap-2 justify-center transition-all duration-200 shadow-lg`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4l-3 3-3-3h4z"
                ></path>
              </svg>
              Publishing...
            </>
          ) : (
            <>📝 Publish Blog</>
          )}
        </button>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Blog Title *
          </label>
          <input
            type="text"
            placeholder="Enter an engaging title for your blog..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-all duration-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Short Description *
          </label>
          <textarea
            placeholder="Write a compelling description that summarizes your blog..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-all duration-200 resize-vertical"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Meta Title */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Meta Title
          </label>
          <input
            type="text"
            placeholder="SEO meta title (60 characters max)..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-all duration-200"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={60}
          />
          <p className="text-sm text-gray-500 mt-1">
            Recommended length: 50-60 characters
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Meta Description
          </label>
          <textarea
            placeholder="SEO meta description (160 characters max)..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-all duration-200 resize-vertical"
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            maxLength={160}
          />
          <p className="text-sm text-gray-500 mt-1">
            Recommended length: 150-160 characters
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Tags
          </label>
          <input
            type="text"
            placeholder="Enter tags separated by commas..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-all duration-200"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Example: technology, marketing, sales
          </p>
        </div>

        {/* Keywords */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Keywords
          </label>
          <input
            type="text"
            placeholder="Enter keywords separated by commas..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-all duration-200"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Example: B2B, marketing strategy, lead generation
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Category
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {predefinedCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === cat
                    ? "bg-[#1e9e9a] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or enter a custom category"
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#1e9e9a] focus:border-[#1e9e9a] transition-all duration-200"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Cover Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1e9e9a] file:text-white file:cursor-pointer hover:file:bg-[#17807d] transition-all duration-200"
            required
          />
          {preview && (
            <div className="mt-4">
              <Image
                src={preview}
                alt="Cover image preview"
                width={400}
                height={250}
                className="rounded-lg max-h-64 w-full object-cover border-2 border-gray-200 shadow-md"
              />
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">
            Blog Content *
          </label>
          <div className="border-2 border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#1e9e9a] focus-within:border-[#1e9e9a] transition-all duration-200">
            <JoditEditor
              ref={editor}
              value={body}
              onChange={(newContent) => setBody(newContent)}
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span className="text-red-500">*</span>
          indicates required fields
        </p>
      </div>
    </div>
  );
};

export default Addblogs;