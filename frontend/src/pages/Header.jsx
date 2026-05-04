import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="navbar bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl px-6">
      
      {/* Logo / Brand */}
      <div className="flex-1">
        <NavLink 
          to="/" 
          className="text-2xl font-bold tracking-wide hover:scale-105 transition-transform duration-200"
        >
          ⚡ CodeForge
        </NavLink>
      </div>

    

       

        {/* User Dropdown */}
        {user && (
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              className="btn btn-ghost text-white border border-white/30 rounded-full px-4 hover:bg-white/10"
            >
              👤 {user.firstName}
            </div>

            <ul className="mt-3 p-2 shadow-xl menu menu-sm dropdown-content bg-white text-black rounded-xl w-52">
              
            

              {user.role === 'admin' && (
                <li>
                  <NavLink to="/admin">Admin Panel</NavLink>
                </li>
              )}

              <li>
                <button 
                  onClick={handleLogout}
                  className="text-red-500"
                >
                  Logout
                </button>
              </li>

            </ul>
          </div>
        )}

    </nav>
  );
};

export default Navbar;