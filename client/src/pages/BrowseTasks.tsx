import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, IndianRupee, Filter, Loader, ArrowRight, Tag, RotateCcw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const categories = [
    'All Categories',
    'Handyman', 'Packers & Movers', 'Cleaning', 'I.T. Services',
    'Tutoring', 'Appliance Repair', 'Catering', 'Photography',
    'Web & Design', 'Personal Care', 'Other'
];

const categoryIcons: Record<string, string> = {
    'All Categories': '🗂️',
    'Handyman': '🔨', 'Packers & Movers': '🚛', 'Cleaning': '🧹',
    'I.T. Services': '💻', 'Tutoring': '📚', 'Appliance Repair': '🔧',
    'Catering': '🍽️', 'Photography': '📷', 'Web & Design': '🌐',
    'Personal Care': '✂️', 'Other': '📌',
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
    open:      { label: 'Open',        color: '#34D399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)',  dot: '#34D399' },
    assigned:  { label: 'In Progress', color: '#FBBF24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  dot: '#FBBF24' },
    completed: { label: 'Completed',   color: '#c4c0ff', bg: 'rgba(108,99,255,0.12)',  border: 'rgba(108,99,255,0.25)',  dot: '#c4c0ff' },
    cancelled: { label: 'Cancelled',   color: '#F87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   dot: '#F87171' },
};

const BrowseTasks = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [status, setStatus] = useState('open');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const q = searchParams.get('q') || '';
        const cat = searchParams.get('category') || '';
        setSearchQuery(q);
        setInputValue(q);
        setCategory(cat);
    }, [searchParams]);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    params: {
                        category: category || undefined,
                        status,
                        search: searchQuery || undefined,
                    },
                });
                setTasks(response.data);
            } catch (err) {
                console.error('Error fetching tasks', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [category, status, searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params: any = {};
        if (inputValue.trim()) params.q = inputValue.trim();
        if (category) params.category = category;
        setSearchParams(params);
    };

    const handleCategoryClick = (cat: string) => {
        const newCat = cat === 'All Categories' ? '' : cat;
        setCategory(newCat);
        const params: any = {};
        if (searchQuery) params.q = searchQuery;
        if (newCat) params.category = newCat;
        setSearchParams(params);
    };

    const handleReset = () => {
        setCategory('');
        setStatus('open');
        setInputValue('');
        setSearchParams({});
    };

    const sc = statusConfig[status] || statusConfig['open'];

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0A0A1A 0%, #0D0D2B 100%)',
            minHeight: 'calc(100vh - 68px)',
            padding: '2.5rem 0',
        }}>
            <div className="container">

                {/* Page header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: '#e3e0f8', fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Browse Tasks
                    </h1>
                    <p style={{ color: '#918fa1' }}>Find jobs that match your skills — across India</p>
                </div>

                {/* Top search bar */}
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <div style={{
                        flex: 1, minWidth: '260px', position: 'relative',
                        display: 'flex', alignItems: 'center',
                        background: 'rgba(51,51,69,0.7)', backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50px',
                        padding: '0 1.25rem', gap: '0.625rem',
                        transition: 'border-color 0.2s ease',
                    }}
                    onFocus={() => {}}
                    >
                        <Search size={17} color="#918fa1" />
                        <input
                            id="browse-search-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Search tasks by keyword..."
                            style={{
                                border: 'none', outline: 'none', flex: 1,
                                fontSize: '0.95rem', padding: '0.8rem 0',
                                background: 'transparent', color: '#e3e0f8',
                            }}
                        />
                    </div>
                    <button
                        id="browse-search-btn"
                        type="submit"
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 1.75rem' }}
                    >
                        Search
                    </button>
                </form>

                {/* Active filters chips */}
                {(searchQuery || category) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <span style={{ color: '#918fa1', fontSize: '0.875rem' }}>Filtering by:</span>
                        {searchQuery && (
                            <span style={{
                                background: 'rgba(108,99,255,0.12)', color: '#c4c0ff',
                                border: '1px solid rgba(108,99,255,0.25)',
                                borderRadius: '50px', padding: '3px 12px', fontSize: '0.82rem', fontWeight: 600,
                            }}>
                                "{searchQuery}"
                            </span>
                        )}
                        {category && (
                            <span style={{
                                background: 'rgba(0,212,255,0.1)', color: '#a2e7ff',
                                border: '1px solid rgba(0,212,255,0.2)',
                                borderRadius: '50px', padding: '3px 12px', fontSize: '0.82rem', fontWeight: 600,
                            }}>
                                {categoryIcons[category]} {category}
                            </span>
                        )}
                        <button
                            onClick={handleReset}
                            style={{
                                background: 'rgba(239,68,68,0.1)', color: '#F87171',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '50px', padding: '3px 12px',
                                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            ✕ Clear all
                        </button>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>

                    {/* ── Filters Sidebar ─────────────────── */}
                    <div style={{
                        background: 'rgba(26,26,43,0.8)', backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px',
                        padding: '1.75rem', position: 'sticky', top: '90px',
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            marginBottom: '1.5rem', paddingBottom: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <Filter size={17} color="#6C63FF" />
                            <h2 style={{ fontSize: '1rem', color: '#e3e0f8', fontWeight: 700 }}>Filters</h2>
                        </div>

                        {/* Category filter */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                marginBottom: '0.875rem', fontWeight: 700,
                                fontSize: '0.72rem', color: '#918fa1',
                                textTransform: 'uppercase', letterSpacing: '0.07em',
                            }}>
                                <Tag size={13} /> Category
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                {categories.map(c => {
                                    const isActive = c === 'All Categories' ? !category : category === c;
                                    return (
                                        <button
                                            key={c}
                                            id={`cat-btn-${c.replace(/\s+/g, '-').toLowerCase()}`}
                                            onClick={() => handleCategoryClick(c)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '0.5rem 0.875rem',
                                                borderRadius: '50px',
                                                border: isActive
                                                    ? '1px solid rgba(108,99,255,0.35)'
                                                    : '1px solid transparent',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: isActive ? 700 : 400,
                                                background: isActive
                                                    ? 'rgba(108,99,255,0.15)'
                                                    : 'rgba(255,255,255,0.03)',
                                                color: isActive ? '#c4c0ff' : '#918fa1',
                                                transition: 'all 0.18s ease',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                boxShadow: isActive ? '0 0 12px rgba(108,99,255,0.1)' : 'none',
                                            }}
                                            onMouseEnter={e => {
                                                if (!isActive) {
                                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                                                    (e.currentTarget as HTMLButtonElement).style.color = '#e3e0f8';
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (!isActive) {
                                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                                                    (e.currentTarget as HTMLButtonElement).style.color = '#918fa1';
                                                }
                                            }}
                                        >
                                            <span style={{ fontSize: '0.875rem' }}>{categoryIcons[c]}</span>
                                            {c}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Status filter */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{
                                display: 'block', marginBottom: '0.875rem',
                                fontWeight: 700, fontSize: '0.72rem', color: '#918fa1',
                                textTransform: 'uppercase', letterSpacing: '0.07em',
                            }}>
                                Status
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                {(['open', 'assigned', 'completed'] as const).map(s => {
                                    const cfg = statusConfig[s];
                                    const isActive = status === s;
                                    return (
                                        <button
                                            key={s}
                                            id={`status-btn-${s}`}
                                            onClick={() => setStatus(s)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '0.5rem 0.875rem',
                                                borderRadius: '50px',
                                                border: isActive
                                                    ? `1px solid ${cfg.border}`
                                                    : '1px solid transparent',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: isActive ? 700 : 400,
                                                background: isActive ? cfg.bg : 'rgba(255,255,255,0.03)',
                                                color: isActive ? cfg.color : '#918fa1',
                                                transition: 'all 0.18s ease',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                            }}
                                            onMouseEnter={e => {
                                                if (!isActive) {
                                                    (e.currentTarget as HTMLButtonElement).style.background = cfg.bg;
                                                    (e.currentTarget as HTMLButtonElement).style.color = cfg.color;
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (!isActive) {
                                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                                                    (e.currentTarget as HTMLButtonElement).style.color = '#918fa1';
                                                }
                                            }}
                                        >
                                            <span style={{
                                                width: '8px', height: '8px', borderRadius: '50%',
                                                background: isActive ? cfg.dot : '#464555',
                                                flexShrink: 0,
                                                boxShadow: isActive ? `0 0 6px ${cfg.dot}` : 'none',
                                                transition: 'all 0.18s ease',
                                            }} />
                                            {cfg.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reset button */}
                        <button
                            id="browse-reset-btn"
                            onClick={handleReset}
                            style={{
                                width: '100%', padding: '0.7rem',
                                border: '1px solid rgba(239,68,68,0.25)',
                                background: 'rgba(239,68,68,0.08)',
                                borderRadius: '50px',
                                fontWeight: 600, color: '#F87171',
                                fontSize: '0.875rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.25)';
                            }}
                        >
                            <RotateCcw size={14} /> Reset Filters
                        </button>
                    </div>

                    {/* ── Tasks Grid ──────────────────────── */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <span style={{ color: '#918fa1', fontSize: '0.875rem' }}>
                                {loading ? 'Searching...' : (
                                    <span>
                                        <strong style={{ color: '#c4c0ff' }}>{tasks.length}</strong>
                                        {' '}task{tasks.length !== 1 ? 's' : ''} found
                                        {category && <> in <strong style={{ color: '#a2e7ff' }}>{category}</strong></>}
                                    </span>
                                )}
                            </span>
                            {/* Active status chip */}
                            <span style={{
                                padding: '4px 14px', borderRadius: '50px',
                                background: sc.bg, color: sc.color,
                                border: `1px solid ${sc.border}`,
                                fontSize: '0.78rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: sc.dot, boxShadow: `0 0 6px ${sc.dot}` }} />
                                Showing: {sc.label}
                            </span>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                                <Loader size={36} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div style={{
                                background: 'rgba(26,26,43,0.7)', backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px',
                                padding: '4rem', textAlign: 'center',
                            }}>
                                <Search size={40} color="#464555" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem', color: '#e3e0f8' }}>No tasks found</h3>
                                <p style={{ color: '#918fa1', marginBottom: '1.75rem' }}>
                                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters.'}
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="btn btn-outline"
                                    style={{ gap: '6px' }}
                                >
                                    <RotateCcw size={15} /> Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {tasks.map((task) => {
                                    const taskStatus = statusConfig[task.status] || statusConfig['open'];
                                    return (
                                        <Link
                                            key={task.id}
                                            to={`/tasks/${task.id}`}
                                            style={{
                                                display: 'block',
                                                textDecoration: 'none',
                                                background: 'rgba(26,26,43,0.75)',
                                                backdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(255,255,255,0.07)',
                                                borderRadius: '20px',
                                                padding: '1.5rem',
                                                transition: 'all 0.25s ease',
                                            }}
                                            onMouseEnter={e => {
                                                const el = e.currentTarget as HTMLAnchorElement;
                                                el.style.borderColor = 'rgba(108,99,255,0.25)';
                                                el.style.transform = 'translateY(-2px)';
                                                el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(108,99,255,0.08)';
                                            }}
                                            onMouseLeave={e => {
                                                const el = e.currentTarget as HTMLAnchorElement;
                                                el.style.borderColor = 'rgba(255,255,255,0.07)';
                                                el.style.transform = 'translateY(0)';
                                                el.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                                                <div style={{ flex: 1, marginRight: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                                        {/* Category badge */}
                                                        <span style={{
                                                            fontSize: '0.72rem', fontWeight: 700,
                                                            padding: '3px 10px', borderRadius: '50px',
                                                            background: 'rgba(0,212,255,0.1)',
                                                            color: '#a2e7ff',
                                                            border: '1px solid rgba(0,212,255,0.2)',
                                                            textTransform: 'uppercase', letterSpacing: '0.05em',
                                                        }}>{task.category}</span>

                                                        {/* Status badge */}
                                                        <span style={{
                                                            fontSize: '0.72rem', fontWeight: 700,
                                                            padding: '3px 10px', borderRadius: '50px',
                                                            background: taskStatus.bg,
                                                            color: taskStatus.color,
                                                            border: `1px solid ${taskStatus.border}`,
                                                            display: 'flex', alignItems: 'center', gap: '5px',
                                                        }}>
                                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: taskStatus.dot, boxShadow: `0 0 5px ${taskStatus.dot}` }} />
                                                            {taskStatus.label}
                                                        </span>
                                                    </div>
                                                    <h3 style={{ fontSize: '1.1rem', color: '#e3e0f8', fontWeight: 600 }}>{task.title}</h3>
                                                </div>

                                                {/* Budget */}
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: '3px',
                                                        fontWeight: 800, fontSize: '1.25rem', color: '#a2e7ff',
                                                    }}>
                                                        <IndianRupee size={18} strokeWidth={2.5} />
                                                        {Number(task.budget).toLocaleString('en-IN')}
                                                    </div>
                                                    <div style={{ fontSize: '0.72rem', color: '#918fa1', marginTop: '2px' }}>budget</div>
                                                </div>
                                            </div>

                                            {/* Meta row */}
                                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#918fa1', fontSize: '0.85rem' }}>
                                                    <MapPin size={13} /> {task.location}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#918fa1', fontSize: '0.85rem' }}>
                                                    <Calendar size={13} />
                                                    {new Date(task.date_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>

                                            {/* Footer row */}
                                            <div style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <div style={{
                                                        width: '28px', height: '28px', borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 800, fontSize: '0.72rem', color: 'white',
                                                        boxShadow: '0 0 8px rgba(108,99,255,0.4)',
                                                    }}>
                                                        {task.client_name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#918fa1' }}>{task.client_name}</span>
                                                </div>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '5px',
                                                    color: '#c4c0ff', fontWeight: 600, fontSize: '0.875rem',
                                                }}>
                                                    View & Apply <ArrowRight size={15} />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseTasks;
