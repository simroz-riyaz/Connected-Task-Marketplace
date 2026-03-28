import { useState } from 'react';
import { Search, LogOut, User as UserIcon, PlusCircle, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(e as any);
        }
    };

    // Strict role-based nav:
    // - client: only "Post a Task"
    // - tasker: only "Browse Tasks"
    // - unauthenticated: show both
    const showPostTask = !user || user.role === 'client';
    const showBrowse   = !user || user.role === 'tasker';

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" className="logo">
                        <div className="logo-icon">C</div>
                        <span>Connected Task</span>
                    </Link>

                    <div className="nav-links">
                        {showPostTask && (
                            <Link to="/post-task" id="nav-post-task" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <PlusCircle size={16} />
                                Post a Task
                            </Link>
                        )}
                        {showBrowse && (
                            <Link to="/browse" id="nav-browse-tasks" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <LayoutGrid size={16} />
                                Browse Tasks
                            </Link>
                        )}
                    </div>
                </div>

                <div className="navbar-actions">
                    <form className="search-box" onSubmit={handleSearch} id="navbar-search-form">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKey}
                            id="navbar-search-input"
                        />
                        {searchQuery && (
                            <button type="submit" className="search-go-btn" title="Search">
                                →
                            </button>
                        )}
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <Link to="/dashboard" id="nav-dashboard-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                    <UserIcon size={20} />
                                    <span>{user.name}</span>
                                    <span className={`role-badge role-badge--${user.role}`}>{user.role}</span>
                                </Link>
                                <button onClick={logout} id="nav-logout-btn" style={{ background: 'transparent', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }} title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} id="nav-login-btn">Log in</Link>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} id="nav-register-btn">Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
