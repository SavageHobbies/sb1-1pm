import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import LocalMockupUpload from './LocalMockupUpload';
import { fetchMockupTemplates } from '../services/mockupApi';

interface MockupTemplateSelectionProps {
  product: string;
  onSelect: (templates: string[]) => void;
}

interface Mockup {
  id: string;
  name: string;
  image: string;
}

const MockupTemplateSelection: React.FC<MockupTemplateSelectionProps> = ({ product, onSelect }) => {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMockupTemplates = async () => {
      try {
        const templates = await fetchMockupTemplates(product);
        setMockups(templates);
        setLoading(false);
      } catch (err) {
        console.error('Error loading mockup templates:', err);
        setError('Failed to load mockup templates. Please try again.');
        setLoading(false);
      }
    };

    loadMockupTemplates();
  }, [product]);

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId].slice(0, 10)
    );
  };

  const handleSubmit = () => {
    onSelect(selectedTemplates);
  };

  const handleLocalMockupUpload = (localMockups: Mockup[]) => {
    setMockups((prevMockups) => [...prevMockups, ...localMockups]);
  };

  if (loading) {
    return <div>Loading mockup templates...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Select Mockup Templates</h2>
      <LocalMockupUpload onUpload={handleLocalMockupUpload} />
      {mockups.length > 0 && (
        <>
          <p className="mb-4 text-gray-600">Choose up to 10 mockup templates for your {product}.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {mockups.map((mockup) => (
              <div
                key={mockup.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden ${
                  selectedTemplates.includes(mockup.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => toggleTemplate(mockup.id)}
              >
                <img src={mockup.image} alt={mockup.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-center font-semibold">{mockup.name}</p>
                </div>
                {selectedTemplates.includes(mockup.id) && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <button
        onClick={handleSubmit}
        disabled={selectedTemplates.length === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue with {selectedTemplates.length} selected template{selectedTemplates.length !== 1 ? 's' : ''}
      </button>
    </div>
  );
};

export default MockupTemplateSelection;