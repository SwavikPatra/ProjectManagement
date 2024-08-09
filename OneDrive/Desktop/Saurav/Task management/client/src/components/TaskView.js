// src/components/TaskView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TaskView() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/task/${id}`, {
          withCredentials: true,
        });
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">{task.title}</h1>
      <p className="mb-4">Description: {task.description}</p>
      <p className="mb-4">Due Date: {task.due_date}</p>
      <p className="mb-4">Priority: {task.priority}</p>
      <p className="mb-4">Status: {task.status}</p>
      <p className="mb-4">Created by: {task.creator.name}</p>
      <p className="mb-4">Assigned to: {task.assignee.name}</p>
      <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Mark as Done
      </button>
    </div>
  );
}

export default TaskView;
