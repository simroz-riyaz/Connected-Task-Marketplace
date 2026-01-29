import { Search, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" className="logo">
                        <div className="logo-icon">C</div>
                        <span>Connected</span>
                    </Link>

                    <div className="nav-links">
                        <Link to="/post-task">Post a task</Link>
                        <Link to="/browse">Browse tasks</Link>
                    </div>
                </div>

                <div className="navbar-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Search tasks..." />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                    <UserIcon size={20} />
                                    <span>{user.name}</span>
                                </Link>
                                <button onClick={logout} style={{ background: 'transparent', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Log in</Link>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
