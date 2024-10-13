import React, { useState } from 'react';
import { createProduct } from '../services/printifyApi';
import axios from 'axios';

interface ProductDetailsProps {
  onSubmit: (title: string, description: string) => void;
  shopId: string;
  blueprintId: string;
  printAreas: { [key: string]: string };
  generatedMockups: string[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ onSubmit, shopId, blueprintId, printAreas, generatedMockups }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const productType = 'T-shirt'; // Replace with actual product type
      const designDescription = 'A unique and eye-catching design'; // Replace with actual design description
      const response = await axios.post('/api/claude/generate-product-details', {
        productType,
        designDescription
      });
      const generatedDetails = response.data;
      setTitle(generatedDetails.title);
      setDescription(generatedDetails.description);
    } catch (err) {
      setError('Failed to generate product details. Please try again.');
      console.error('Error generating product details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const productData = {
        title,
        description,
        blueprint_id: blueprintId,
        print_areas: printAreas,
        // Add other required fields based on Printify's API documentation
      };
      const result = await createProduct(shopId, productData);
      console.log('Product created:', result);
      onSubmit(title, description);
    } catch (err) {
      setError('Failed to create product. Please try again.');
      console.error('Error creating product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>
      {generatedMockups.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Generated Mockups:</h3>
          <div className="grid grid-cols-2 gap-4">
            {generatedMockups.map((mockup, index) => (
              <img key={index} src={mockup} alt={`Mockup ${index + 1}`} className="w-full rounded-md" />
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Product Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Product Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        <button
          type="button"
          onClick={handleGenerateDetails}
          disabled={isLoading}
          className="w-full mb-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Title and Description
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Product...' : 'Create Product Listing'}
        </button>
      </form>
    </div>
  );
};

export default ProductDetails;