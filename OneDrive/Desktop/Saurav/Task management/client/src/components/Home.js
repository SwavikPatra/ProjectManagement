import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function Home() {
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchGroupsAndTasks = async () => {
      try {
        const groupResponse = await axios.get('http://localhost:5000/group/user-groups', {
          withCredentials: true, // Send cookies with the request
        });
        setGroups(groupResponse.data);

        const taskResponse = await axios.get('http://localhost:5000/group/user-tasks', {
          withCredentials: true, // Send cookies with the request
        });
        setTasks(taskResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data.');
      }
    };

    fetchGroupsAndTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.patch(`http://localhost:5000/group/user-tasks/${taskId}`, {
        status: newStatus,
      }, {
        withCredentials: true, // Send cookies with the request
      });
      
      // Update tasks state to reflect the change
      setTasks(tasks.map(task => task.task_id === taskId ? { ...task, status: newStatus } : task));
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Error updating task status.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex w-full max-w-6xl">
        {/* Left Section: Groups */}
        <div className="w-1/3 bg-white shadow-md rounded-lg p-4 mr-4">
          <h2 className="text-2xl font-semibold mb-4">Groups List</h2>
          <ul>
            {groups.length > 0 ? (
              groups.map(group => (
                <li key={group.id} className="border-b last:border-b-0 p-2">
                  <Link to={`/group/group-view/${group.id}`} className="text-blue-500 hover:underline">
                    {group.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-2">No groups found.</li>
            )}
          </ul>
        </div>

        {/* Right Section: Pending Tasks */}
        <div className="w-2/3 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-4">Pending Tasks</h2>
          {tasks.length > 0 ? (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Group ID</th>
                  <th className="py-2 px-4 border-b">Due Date</th>
                  <th className="py-2 px-4 border-b">Priority</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.filter(task => task.status === 'Pending').map(task => (
                  <tr key={task.task_id}>
                    <td className="py-2 px-4 border-b">{task.title}</td>
                    <td className="py-2 px-4 border-b">{task.group_id}</td>
                    <td className="py-2 px-4 border-b">{format(new Date(task.due_date), 'dd-MM-yyyy')}</td>
                    <td className="py-2 px-4 border-b">{task.priority}</td>
                    <td className="py-2 px-4 border-b">{task.status}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={selectedTask === task.task_id ? task.status : 'Pending'}
                        onChange={(e) => setSelectedTask(task.task_id)}>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button onClick={() => handleStatusChange(task.task_id, selectedTask)}>
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-2">No pending tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
