import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, handleLogout }) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">
          Home
        </Link>
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
            <button
              onClick={handleLogout}
              className="text-white bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-600"
            >
              Logout
            </button>
            
              <Link
                to="/create-group"
                  className="text-white bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-600"
              > Create  Group

              </Link> 
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white bg-blue-500 px-3 py-2 rounded-md hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white bg-green-500 px-3 py-2 rounded-md hover:bg-green-600"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
