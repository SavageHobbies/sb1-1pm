import React, { useState } from 'react';
import ProductSelection from './components/ProductSelection';
import DesignUpload from './components/DesignUpload';
import MockupTemplateSelection from './components/MockupTemplateSelection';
import ProductDetails from './components/ProductDetails';
import { ChevronRight } from 'lucide-react';

const steps = ['Product Selection', 'Design Upload', 'Mockup Template Selection', 'Product Details'];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ProductSelection onSelect={(product) => { setSelectedProduct(product); nextStep(); }} />;
      case 1:
        return <DesignUpload onUpload={(files) => { setDesignFiles(files); nextStep(); }} shopId="your-shop-id" />;
      case 2:
        return <MockupTemplateSelection product={selectedProduct} onSelect={(templates) => { setSelectedTemplates(templates); nextStep(); }} />;
      case 3:
        return (
          <ProductDetails
            onSubmit={(productId) => {
              console.log('Product created with ID:', productId);
              // Handle completion, e.g., show a success message or redirect
            }}
            shopId="your-shop-id"
            blueprintId={selectedProduct}
            printAreas={{}}
            productType={selectedProduct}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Printify Product Designer</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <nav className="flex items-center justify-center mb-8">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                    <span className={`rounded-full ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} px-3 py-1`}>{index + 1}</span>
                    <span className="ml-2 text-sm font-medium">{step}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />
                  )}
                </React.Fragment>
              ))}
            </nav>
            {renderStep()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;