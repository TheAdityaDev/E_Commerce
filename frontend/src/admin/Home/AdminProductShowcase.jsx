import React, { useState } from 'react';
import { useAppSelector } from '../../Redux Toolkit/store';
import HomeCategoryTable from './HomeCategoryTable';
import { useNavigate } from 'react-router-dom';

const AdminProductShowcase = () => {
  const navigate = useNavigate();
  
  // Fetch all data from Redux
  const homeCategories = useAppSelector(
    (store) => store?.homeCategory?.homeCategories || []
  );
  const deals = useAppSelector(
    (store) => store?.deal?.deals || []
  );
  const products = useAppSelector(
    (store) => store?.products?.products || []
  );

  const [activeTab, setActiveTab] = useState('overview');

  const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.category === categoryId || p.categoryId === categoryId);
  };

  const getCategoryStats = (categoryId) => {
    const categoryProducts = getProductsByCategory(categoryId);
    return {
      total: categoryProducts.length,
      active: categoryProducts.filter(p => p.status === 'ACTIVE').length,
      inactive: categoryProducts.filter(p => p.status === 'INACTIVE').length,
    };
  };

  const getDealStats = () => {
    return {
      total: deals.length,
      active: deals.filter(d => d.status === 'ACTIVE').length,
      inactive: deals.filter(d => d.status === 'INACTIVE').length,
    };
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Overview</h1>
        <p className="text-gray-600">Manage all products organized by categories and deals</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'categories', label: 'All Categories' },
          { id: 'deals', label: 'All Deals' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Total Products */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-2">Total Products</div>
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-2">Total Categories</div>
            <div className="text-2xl font-bold text-gray-900">{homeCategories.length}</div>
          </div>

          {/* All Deals */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <div className="text-sm text-gray-600 mb-2">Active Deals</div>
            <div className="text-2xl font-bold text-gray-900">{deals.length}</div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Product Categories</h2>
              <p className="text-gray-600">View and manage all product categories with their products</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {homeCategories && homeCategories.length > 0 ? (
                homeCategories.map(category => {
                  const stats = getCategoryStats(category.categoryId || category._id);
                  return (
                    <div
                      key={category._id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate(`/admin/products?category=${category.categoryId || category._id}`)}
                    >
                      <div className="flex items-start gap-4">
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{category.name || category.categoryName}</h3>
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Total: {stats.total}</p>
                            <p className="text-green-600">Active: {stats.active}</p>
                            <p className="text-red-600">Inactive: {stats.inactive}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No categories found
                </div>
              )}
            </div>

            {homeCategories && homeCategories.length > 0 && (
              <HomeCategoryTable categories={homeCategories} title="Categories Overview" />
            )}
          </div>
        </div>
      )}

      {/* Deals Tab */}
      {activeTab === 'deals' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Deals</h2>
              <p className="text-gray-600">Manage all active and inactive deals</p>
            </div>

            {/* Deal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="text-sm text-gray-600 mb-2">Total Deals</div>
                <div className="text-3xl font-bold text-orange-600">{getDealStats().total}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600 mb-2">Active Deals</div>
                <div className="text-3xl font-bold text-green-600">{getDealStats().active}</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <div className="text-sm text-gray-600 mb-2">Inactive Deals</div>
                <div className="text-3xl font-bold text-red-600">{getDealStats().inactive}</div>
              </div>
            </div>

            {/* Deals Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Deal Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">End Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deals && deals.length > 0 ? (
                    deals.map(deal => (
                      <tr key={deal._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{deal.title || deal.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{deal.productId || '-'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-orange-600">{deal.discountPercent || deal.discount || 0}%</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            deal.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {deal.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {deal.endDate ? new Date(deal.endDate).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No deals found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductShowcase;
