import axios from 'axios';

const MOCKUP_API_BASE_URL = '/api/mockups';

export const fetchMockupTemplates = async (productType: string) => {
  try {
    const response = await axios.get(`${MOCKUP_API_BASE_URL}/templates`, {
      params: { productType }
    });
    return response.data.map((template: any) => ({
      ...template,
      image: template.image.replace('.psd', '_thumb.jpg')
    }));
  } catch (error: any) {
    console.error('Error fetching mockup templates:', error.response?.data || error.message);
    throw new Error('Failed to fetch mockup templates. Please try again.');
  }
};

export const generateMockup = async (templateId: string, designUrl: string) => {
  try {
    const response = await axios.post(`${MOCKUP_API_BASE_URL}/generate`, {
      templateId,
      designUrl
    });
    return response.data.mockupUrl;
  } catch (error: any) {
    console.error('Error generating mockup:', error.response?.data || error.message);
    throw new Error('Failed to generate mockup. Please try again.');
  }
};