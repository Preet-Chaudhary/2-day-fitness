import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-profile">
      <div className="user-avatar">
        {getInitials(user.name)}
      </div>
      <div className="user-info">
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
      <button 
        className="logout-button"
        onClick={handleLogout}
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
