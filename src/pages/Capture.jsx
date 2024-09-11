import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Capture() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading
  const backendUrl = 'http://192.168.1.72:8800';
  const navigate = useNavigate();

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
    setUploadStatus('');
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError('');
    setUploadStatus('');
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select an image before uploading.');
    } else {
      setLoading(true); // Set loading to true when starting the upload
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('accessToken');

      axios
        .post(`${backendUrl}/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          console.log(res);
          setUploadStatus('File uploaded successfully');
          setError('');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          setError('Upload failed. Please try again.');
          setUploadStatus('');
        })
        .finally(() => {
          setLoading(false); // Set loading back to false after completion
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Take a Photo
      </h2>

      {!preview && (
        <input
          type="file"
          onChange={handleFile}
          accept="image/*"
          capture="environment"
          className="block text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4 file:rounded-md
                   file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:ring-opacity-50 mb-4"
        />
      )}

      {preview && (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Selected"
            className="w-full max-w-xs h-auto mb-4 rounded-md shadow-md"
          />
          <button
            onClick={handleRemove}
            className="px-4 py-2 mb-4 text-white bg-red-600 rounded-md hover:bg-red-700
                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Remove
          </button>
        </div>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {uploadStatus && <p className="text-green-600 mb-4">{uploadStatus}</p>}

      <button
        onClick={handleUpload}
        disabled={loading} // Disable button when loading
        className={`px-6 py-2 text-white bg-blue-600 rounded-md 
                  ${
                    loading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default Capture;
