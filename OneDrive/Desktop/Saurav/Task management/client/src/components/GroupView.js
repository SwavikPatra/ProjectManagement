import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GroupView() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [authFlag, setAuthFlag] = useState(false);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/group/group-view/${id}`, {
          withCredentials: true,
        });
        
        const groupData = response.data.group || {};
        setGroup(groupData);
        setMembers(response.data.members || []);
        setTasks(response.data.tasks || []);

        // Assuming user ID is available in the response or another state
        const loddgedinUserId = response.data.userId; // Update this line to get the current user ID
        
        if (groupData.creator_id === loddgedinUserId) {
          setAuthFlag(true);
        }
      } catch (error) {
        console.error('Error fetching group info:', error);
        setError('Error fetching group info.');
      }
    };

    fetchGroupInfo();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">{group ? group.name : 'Loading...'}</h1>
      <div className="flex w-full max-w-4xl">
        {/* Left Section */}
        <div className="w-1/3 bg-white shadow-md rounded-lg p-4 mr-4">
          <h2 className="text-2xl font-semibold mb-4">Group Members</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {members.length > 0 ? (
                members.map(member => (
                  <li key={member.user_id} className="border-b last:border-b-0 p-2">
                    {member.name}
                  </li>
                ))
              ) : (
                <li className="p-2">No members found.</li>
              )}
            </ul>
          )}
          {authFlag && (
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              <a href={`/group/${id}/create-task`}>Create Task</a>
            </button>
          )}
        </div>
        {/* Right Section */}
        <div className="w-2/3 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-4">Pending Tasks</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <li key={task.task_id} className="border-b last:border-b-0 p-2">
                    {task.title} - {task.assignee_id} - {task.status}
                  </li>
                ))
              ) : (
                <li className="p-2">No pending tasks found.</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupView;
