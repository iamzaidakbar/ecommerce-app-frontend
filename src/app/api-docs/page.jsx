"use client";

import React, { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_DOCS = [
  {
    category: 'Authentication',
    endpoints: [
      {
        name: 'Register',
        url: '/auth/register',
        method: 'POST',
        body: {
          email: 'user@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        },
        description: 'Creates a new account and sends a verification email.',
      },
      {
        name: 'Login',
        url: '/auth/login',
        method: 'POST',
        body: {
          email: 'user@example.com',
          password: 'password123',
        },
        description: 'Logs you in and gives you a token to stay logged in.',
      },
    ],
  },
  {
    category: 'Products',
    endpoints: [
      {
        name: 'Get All Products',
        url: '/products',
        method: 'GET',
        description: 'Fetches a list of all available products.',
      },
      {
        name: 'Get Product Details',
        url: '/products/:id',
        method: 'GET',
        description: 'Fetches detailed information about a specific product.',
      },
      {
        name: 'Create Product',
        url: '/products',
        method: 'POST',
        body: {
          name: 'New Product',
          price: 99.99,
          description: 'Product description',
          category: 'Electronics',
        },
        description: 'Creates a new product.',
      },
    ],
  },
  {
    category: 'Orders',
    endpoints: [
      {
        name: 'Get All Orders',
        url: '/orders',
        method: 'GET',
        description: 'Fetches a list of all orders for the authenticated user.',
      },
      {
        name: 'Create Order',
        url: '/orders',
        method: 'POST',
        body: {
          productId: '123',
          quantity: 2,
        },
        description: 'Creates a new order.',
      },
      {
        name: 'Get Order Details',
        url: '/orders/:id',
        method: 'GET',
        description: 'Fetches detailed information about a specific order.',
      },
    ],
  },
  {
    category: 'Users',
    endpoints: [
      {
        name: 'Get User Profile',
        url: '/users/profile',
        method: 'GET',
        description: 'Fetches the profile information of the authenticated user.',
      },
      {
        name: 'Update Profile',
        url: '/users/profile',
        method: 'PUT',
        body: {
          firstName: 'Updated Name',
          lastName: 'Updated Last Name',
          email: 'updated.email@example.com',
        },
        description: 'Updates the profile information of the authenticated user.',
      },
    ],
  },
  {
    category: 'Cart',
    endpoints: [
      {
        name: 'Get Cart Items',
        url: '/cart',
        method: 'GET',
        description: 'Fetches all items in the user’s cart.',
      },
      {
        name: 'Add to Cart',
        url: '/cart',
        method: 'POST',
        body: {
          productId: '123',
          quantity: 1,
        },
        description: 'Adds a product to the cart.',
      },
      {
        name: 'Remove from Cart',
        url: '/cart/:id',
        method: 'DELETE',
        description: 'Removes a product from the cart.',
      },
    ],
  },
];

const ApiDocsPage = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [response, setResponse] = useState(null);

  const handleTestApi = async (endpoint) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const { data } = await axios({
        url: `${baseUrl}${endpoint.url}`,
        method: endpoint.method,
        data: endpoint.body,
      });
      setResponse(data);
    } catch (error) {
      console.error('API Error:', error);
      setResponse(error.response ? error.response.data : 'Error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">E-Commerce API Documentation</h1>

        <Suspense fallback={<div className="text-center">Loading API Docs...</div>}>
          {API_DOCS.map((category, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.endpoints.map((endpoint, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-lg"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium text-lg">{endpoint.name}</h3>
                      <button
                        className="bg-blue-500 text-white py-1 px-4 rounded"
                        onClick={() => setSelectedEndpoint(endpoint)}
                      >
                        Test
                      </button>
                    </div>
                    <p className="text-gray-600 mt-2">{endpoint.description}</p>
                    <p className="text-sm text-gray-400">{endpoint.method} {endpoint.url}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </Suspense>
      </motion.div>

      {selectedEndpoint && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setSelectedEndpoint(null);
                setResponse(null);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Test API - {selectedEndpoint.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedEndpoint.description}</p>
            <div className="bg-gray-100 rounded-md p-4 mb-4">
              <pre className="text-sm">{JSON.stringify(selectedEndpoint.body, null, 2)}</pre>
            </div>
            <button
              onClick={() => handleTestApi(selectedEndpoint)}
              className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
            >
              Send Request
            </button>
            {response && (
              <div className="bg-gray-50 mt-4 rounded-md p-4 overflow-auto max-h-40">
                <pre className="text-sm text-gray-700">{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ApiDocsPage;
