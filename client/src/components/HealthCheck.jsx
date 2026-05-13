import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getApiPath } from '../utils/api';

export default function HealthCheck() {
  const [serverStatus, setServerStatus] = useState('checking');
  const [details, setDetails] = useState('');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const healthUrl = getApiPath('/api/health');
        console.log(`Checking server health at ${healthUrl}`);
        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setServerStatus('online');
          setDetails(JSON.stringify(data, null, 2));
        } else {
          setServerStatus('error');
          setDetails(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        setServerStatus('offline');
        setDetails(err.message);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">CampusCare - Server Health Check</h1>

        {/* Server Status Card */}
        <div className={`p-6 rounded-lg border-2 mb-6 ${
          serverStatus === 'online'
            ? 'bg-green-900 border-green-700'
            : serverStatus === 'checking'
            ? 'bg-blue-900 border-blue-700'
            : 'bg-red-900 border-red-700'
        }`}>
          <div className="flex items-center gap-3">
            {serverStatus === 'checking' && (
              <Loader className="w-6 h-6 text-blue-400 animate-spin" />
            )}
            {serverStatus === 'online' && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
            {serverStatus !== 'checking' && serverStatus !== 'online' && (
              <AlertCircle className="w-6 h-6 text-red-400" />
            )}
            
            <div>
              <h2 className="text-xl font-bold text-white">
                {serverStatus === 'online'
                  ? '✅ Server is ONLINE'
                  : serverStatus === 'checking'
                  ? '⏳ Checking Server...'
                  : '❌ Server is OFFLINE'}
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                {serverStatus === 'online'
                  ? 'Backend is running and ready for requests'
                  : serverStatus === 'checking'
                  ? `Connecting to ${getApiPath('/api/health').replace('/api/health', '')}...`
                  : 'Cannot connect to backend server'}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Server Response:</h3>
          <pre className="bg-slate-900 p-4 rounded text-green-400 text-sm overflow-auto max-h-48">
            {details || 'Waiting...'}
          </pre>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">If Server is Offline:</h3>
          <ol className="text-gray-300 space-y-3 list-decimal list-inside">
            <li>Make sure MongoDB is running:
              <code className="bg-slate-900 px-2 py-1 rounded text-green-400 ml-2">mongosh</code>
            </li>
            <li>Start the backend server in a separate terminal:
              <code className="bg-slate-900 px-2 py-1 rounded text-green-400 ml-2">cd server && npm run dev</code>
            </li>
            <li>Wait for the message: <span className="text-green-400">✅ CampusCare API running on port 5000</span></li>
            <li>Then refresh this page (F5)</li>
          </ol>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-white font-semibold mb-3">Quick Start Command:</h4>
            <code className="bg-slate-900 p-4 rounded text-green-400 text-sm block">
              cd server && npm run dev
            </code>
          </div>
        </div>

        {/* Return to Login */}
        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
