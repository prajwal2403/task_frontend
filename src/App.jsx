import React, { useState, useEffect } from 'react';

const TaskManagement = () => {
  const [tasks, setTasks] = useState({});
  const [isSaturday, setIsSaturday] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'student' or 'task'
  const [newStudent, setNewStudent] = useState({ id: '', name: '' });
  const [newTask, setNewTask] = useState({ id: '', name: '', baseValue: '' });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://task-backend-5.onrender.com/tasks');
      const data = await response.json();
      setTasks(data);

      const satResponse = await fetch('https://task-backend-5.onrender.com/is-saturday');
      const satData = await satResponse.json();
      setIsSaturday(satData.is_saturday);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateTasks = async () => {
    try {
      setLoading(true);
      await fetch('https://task-backend-5.onrender.com/update-tasks', { method: 'POST' });
      await fetchTasks();
    } catch (err) {
      setError('Failed to update tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      const response = await fetch('https://task-backend-5.onrender.com/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(newStudent.id),
          name: newStudent.name,
        }),
      });
      if (!response.ok) throw new Error('Failed to add student');
      await fetchTasks();
      setShowAddModal(false);
      setNewStudent({ id: '', name: '' });
    } catch (err) {
      setError('Failed to add student. Please try again.');
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch('https://task-backend-5.onrender.com/add-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(newTask.id),
          name: newTask.name,
          baseValue: parseInt(newTask.baseValue),
        }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      await fetchTasks();
      setShowAddModal(false);
      setNewTask({ id: '', name: '', baseValue: '' });
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Task Management Dashboard</h1>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateTasks}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                ↻ Reassign Tasks
              </button>
              <button
                onClick={() => {
                  setModalType('student');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                + Add Student
              </button>
              <button
                onClick={() => {
                  setModalType('task');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                + Add Task
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <span>⏰</span>
            <span>Tasks are automatically reassigned every Saturday</span>
            {isSaturday && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                It's Saturday!
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Assigned Task
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tasks).map(([student, task]) => (
                  <tr key={student} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {student}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {task}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'student' ? 'Add New Student' : 'Add New Task'}
            </h2>
            {modalType === 'student' ? (
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Student ID"
                  value={newStudent.id}
                  onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Student Name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddStudent}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Student
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Task ID"
                  value={newTask.id}
                  onChange={(e) => setNewTask({ ...newTask, id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Task Name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Base Value"
                  value={newTask.baseValue}
                  onChange={(e) => setNewTask({ ...newTask, baseValue: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;