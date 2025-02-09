import React, { useState, useEffect } from 'react';
import { RefreshCw, Lock, Unlock } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  const API_URL = 'https://task-backend-5.onrender.com'; // Replace with your Render backend URL

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/update-tasks`, {
        method: 'POST',
        headers: {
          'api-key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid API key');
      }

      await fetchTasks();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Roommate Task Distribution</h1>
            <div className="flex gap-2">
              <button
                onClick={fetchTasks}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Refresh Tasks"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowApiInput(!showApiInput)}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Toggle API Key Input"
              >
                {showApiInput ? (
                  <Unlock className="w-5 h-5 text-gray-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {showApiInput && (
            <div className="mb-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key"
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={updateTasks}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Update Tasks Manually
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Tasks List */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(tasks).map(([roommate, taskInfo]) => (
                <div
                  key={roommate}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{roommate}</h3>
                      <p className="text-blue-600">{taskInfo.task}</p>
                      {taskInfo.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {taskInfo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;