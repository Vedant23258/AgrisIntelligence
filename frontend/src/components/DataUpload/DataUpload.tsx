import React, { useState } from 'react';
import { uploadRetailData, uploadMandiData } from '../../services/dataService';

interface DataUploadProps {
  onUploadSuccess?: () => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onUploadSuccess }) => {
  const [retailFile, setRetailFile] = useState<File | null>(null);
  const [mandiFile, setMandiFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleRetailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRetailFile(e.target.files[0]);
    }
  };

  const handleMandiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMandiFile(e.target.files[0]);
    }
  };

  const handleUploadRetail = async () => {
    if (!retailFile) {
      setUploadStatus('Please select a retail data file');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const result = await uploadRetailData(retailFile);
      console.log('Retail data uploaded:', result);
      setUploadStatus('Retail data uploaded successfully!');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error('Error uploading retail data:', error);
      setUploadStatus('Error uploading retail data: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadMandi = async () => {
    if (!mandiFile) {
      setUploadStatus('Please select a mandi data file');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const result = await uploadMandiData(mandiFile);
      console.log('Mandi data uploaded:', result);
      setUploadStatus('Mandi data uploaded successfully!');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error('Error uploading mandi data:', error);
      setUploadStatus('Error uploading mandi data: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Data Files</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Retail Data Upload */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Retail Sales Data</h4>
          <input
            type="file"
            accept=".csv"
            onChange={handleRetailFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              hover:file:bg-indigo-50"
          />
          <button
            onClick={handleUploadRetail}
            disabled={uploading || !retailFile}
            className={`mt-2 w-full py-2 px-4 rounded-md text-white font-medium ${
              uploading || !retailFile
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Retail Data'}
          </button>
        </div>

        {/* Mandi Data Upload */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Mandi Price Data</h4>
          <input
            type="file"
            accept=".csv"
            onChange={handleMandiFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              hover:file:bg-indigo-50"
          />
          <button
            onClick={handleUploadMandi}
            disabled={uploading || !mandiFile}
            className={`mt-2 w-full py-2 px-4 rounded-md text-white font-medium ${
              uploading || !mandiFile
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Mandi Data'}
          </button>
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div className={`mt-4 p-3 rounded-md ${
          uploadStatus.includes('successfully') 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {uploadStatus}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">Instructions:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Retail data should contain columns: date, product, sales_quantity, sales_value</li>
          <li>Mandi data should contain columns: date, product, price, location</li>
          <li>Files should be in CSV format</li>
        </ul>
      </div>
    </div>
  );
};

export default DataUpload;