import React, { useState, useEffect } from 'react';
import { generateMockup } from '../services/mockupApi';

interface MockupGenerationProps {
  designFiles: File[];
  mockupTemplates: string[];
  onGenerate: (mockups: string[]) => void;
}

const MockupGeneration: React.FC<MockupGenerationProps> = ({ designFiles, mockupTemplates, onGenerate }) => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateMockups = async () => {
      setGenerating(true);
      setError(null);
      const generatedMockups: string[] = [];

      try {
        const totalOperations = designFiles.length * mockupTemplates.length;
        let completedOperations = 0;

        for (const designFile of designFiles) {
          for (const templateId of mockupTemplates) {
            try {
              const mockupUrl = await generateMockup(templateId, URL.createObjectURL(designFile));
              generatedMockups.push(mockupUrl);
            } catch (err) {
              console.error(`Failed to generate mockup for design ${designFile.name} and template ${templateId}:`, err);
            }

            completedOperations++;
            setProgress(Math.round((completedOperations / totalOperations) * 100));
          }
        }

        onGenerate(generatedMockups);
      } catch (err) {
        setError('Failed to generate some mockups. Please try again.');
        console.error('Error generating mockups:', err);
      } finally {
        setGenerating(false);
      }
    };

    generateMockups();
  }, [designFiles, mockupTemplates, onGenerate]);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generate Mockups</h2>
      {generating ? (
        <div>
          <p className="mb-2">Generating mockups... {progress}% complete</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <p className="text-green-500 mb-4">Mockups generated successfully!</p>
      )}
    </div>
  );
};

export default MockupGeneration;