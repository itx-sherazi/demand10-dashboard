"use client";
import { useState } from "react";
import Sidebar from "@/Componenets/Dashboard/Sidebar";
import Header from "@/Componenets/Dashboard/Header";
import AllBlogs from "@/Componenets/Dashboard/AllBlogs";
import AddBlogs from "@/Componenets/Dashboard/AddBlogs"; // Fixed import name
import DataRequest from "@/Componenets/Dashboard/DataRequest";
import AddUser from "@/Componenets/Dashboard/AddUser";
import AllUsers from "@/Componenets/Dashboard/Users"; // Fixed import path
import Categories from "@/Componenets/Dashboard/Categories";
import SubCategorySheet from "@/Componenets/Dashboard/Sheet";
import AllCompanies from "@/Componenets/Dashboard/AllCompanies";
import CompanyClaims from "@/Componenets/Dashboard/CompanyClaims";
import CompanyListings from "@/Componenets/Dashboard/CompanyListings";
import Reviews from "@/Componenets/Dashboard/Reviews";
import SubcategoryManagement from "@/Componenets/Dashboard/SubcategoryManagement"; // Updated import
import SubcategoryDetails from "@/Componenets/Dashboard/SubcategoryDetails"; // New import
import WebsiteUsers from "@/Componenets/Dashboard/WebsiteUsers"; // New import
import Badges from "@/Componenets/Dashboard/Badges"; // New import
import SubcategoryContent from "@/Componenets/Dashboard/SubcategoryContent";
import SubcategoryFAQs from "@/Componenets/Dashboard/SubcategoryFAQs"; // New import

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("blog");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "blog":
        return <AllBlogs />;
      case "Addblog":
        return <AddBlogs />; // Fixed component name
      case "DataRequest":
        return <DataRequest />;
      case "AddUser":
        return <AddUser />;
      case "Users":
        return <AllUsers />;
      case "WebsiteUsers": // New case
        return <WebsiteUsers />;
      case "Categories":
        return <Categories />;
      case "SubCategory":
        return <SubCategorySheet />;
      case "SubcategoryManagement": // New case
        return <SubcategoryManagement />;
      case "SubcategoryDetails": // New case
        return <SubcategoryDetails />;
        case "SubcategoryContent": // New case
        return <SubcategoryContent />;
      case "SubcategoryFAQs": // New case
        return <SubcategoryFAQs />;
      case "allCompanies":
        return <AllCompanies />;
      case "CompanyClaims":
        return <CompanyClaims />;
      case "CompanyListings":
        return <CompanyListings />;
      case "Reviews":
        return <Reviews />;
      case "Badges": // New case
        return <Badges />;
      default:
        return <AllBlogs />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}