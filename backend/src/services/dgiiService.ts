import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DGII_URLS = {
  test: 'https://ecf.dgii.gov.do/testecf/recepcionfc', // Example URL, needs verification
  prod: 'https://ecf.dgii.gov.do/recepcionfc'
};

const getBaseUrl = () => {
  return process.env.DGII_ENV === 'prod' ? DGII_URLS.prod : DGII_URLS.test;
};

export const sendToDGII = async (signedXml: string) => {
  const url = `${getBaseUrl()}/api/ecf`; // Adjust endpoint path based on DGII docs
  
  try {
    const response = await axios.post(url, signedXml, {
      headers: {
        'Content-Type': 'application/xml',
        // Add auth headers if required (e.g. Bearer token or Certificate auth)
      },
      timeout: 30000
    });
    return response.data;
  } catch (error: any) {
    console.error('Error sending to DGII:', error.response?.data || error.message);
    throw new Error('Failed to send to DGII');
  }
};

export const checkStatusDGII = async (trackId: string) => {
  const url = `${getBaseUrl()}/api/status/${trackId}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Error checking status:', error.response?.data || error.message);
    throw new Error('Failed to check status');
  }
};
