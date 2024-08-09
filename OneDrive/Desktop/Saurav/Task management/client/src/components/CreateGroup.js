import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateGroup() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/find-users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`selected users  : ${selectedUsers}`)
    try {
      // Convert selectedUsers to an array of user IDs
      console.log(`name: ${name}, userIds : ${selectedUsers}`)
      const userIds = selectedUsers.map(userId => parseInt(userId)); // Ensure userIds are integers
      await axios.post('http://localhost:5000/group/create-group', {
        name: name,
        userIds: userIds, // Send user IDs to the backend
      }, {
        withCredentials: true // Include credentials in the request
      });
      // Handle success (e.g., show a success message or redirect)
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating group:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3">
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-medium mb-2">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-lg font-medium mb-2">Select Users</label>
          <select
            multiple
            value={selectedUsers}
            onChange={(e) =>
              setSelectedUsers([...e.target.selectedOptions].map(o => o.value))
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          >
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;
