"use client";
import { Building2 } from "lucide-react";
import AddProductModal from "./AddProduct";

export default function EmptyState({ isSearchResult = false, searchTerm = "", setSearchTerm = () => {} }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Building2 size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isSearchResult ? "No companies found" : "No companies yet"}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {isSearchResult
          ? `No companies match your search "${searchTerm}". Try adjusting your search terms.`
          : "You haven't added any companies yet. Create your first company to get started."}
      </p>
      {!isSearchResult && (
        <div className="flex justify-center">
          <AddProductModal />
        </div>
      )}
      {isSearchResult && (
        <button
          onClick={() => setSearchTerm("")}
          className="inline-flex items-center px-4 py-2 bg-[#1e9e9a] text-white rounded-lg transition-colors"
        >
          Clear search
        </button>
      )}
    </div>
  );
}