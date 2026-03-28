import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import PostTask from './pages/PostTask';
import BrowseTasks from './pages/BrowseTasks';
import TaskDetails from './pages/TaskDetails';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Link } from 'react-router-dom';
import {
    Hammer, Truck, Paintbrush, Laptop, BookOpen, Wrench,
    Utensils, Camera, Code, Scissors, ArrowRight, CheckCircle2, Lock, Star, Phone, Loader
} from 'lucide-react';

/* ── Role-based route guards ────────────────────────────────── */

/** Blocks clients from accessing tasker-only pages (e.g. /browse) */
const ClientBlockedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader size={32} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
    );
    // Clients get redirected to dashboard (they post tasks, not browse)
    if (user?.role === 'client') return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
};

/** Blocks taskers from accessing client-only pages (e.g. /post-task) */
const TaskerBlockedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader size={32} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
    );
    // Taskers get redirected to browse (they find tasks, not post)
    if (user?.role === 'tasker') return <Navigate to="/browse" replace />;
    return <>{children}</>;
};

/** Requires login */
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader size={32} color="#6C63FF" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
    );
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    return <>{children}</>;
};

/* ── Home page data ─────────────────────────────────────────── */

const categories = [
    { name: 'Handyman',        icon: Hammer,    desc: 'Plumbing, AC repair, electrical',    color: '#6C63FF' },
    { name: 'Packers & Movers',icon: Truck,     desc: 'Home & office relocation',           color: '#00D4FF' },
    { name: 'Cleaning',        icon: Paintbrush,desc: 'Deep clean, bathroom, kitchen',      color: '#10B981' },
    { name: 'I.T. Services',   icon: Laptop,    desc: 'Tech support, WiFi, PC setup',       color: '#A855F7' },
    { name: 'Tutoring',        icon: BookOpen,  desc: 'School, college & skill coaching',   color: '#F59E0B' },
    { name: 'Appliance Repair',icon: Wrench,    desc: 'Washing machine, fridge, TV',        color: '#EF4444' },
    { name: 'Catering',        icon: Utensils,  desc: 'Home chef, event catering',          color: '#06B6D4' },
    { name: 'Photography',     icon: Camera,    desc: 'Weddings, portraits, products',      color: '#EC4899' },
    { name: 'Web & Design',    icon: Code,      desc: 'Websites, apps, graphic design',     color: '#8B5CF6' },
    { name: 'Personal Care',   icon: Scissors,  desc: 'Haircut, salon at home',             color: '#14B8A6' },
];

const steps = [
    { num: '01', title: 'Post your task',       desc: 'Tell us what you need done. Free to post, takes only seconds.', icon: '📋' },
    { num: '02', title: 'Get quotes',           desc: 'Receive offers from verified Indian taskers. Compare profiles & reviews.', icon: '💬' },
    { num: '03', title: 'Pay securely (₹)',     desc: "Pay in INR via escrow. Funds released only when you're happy.", icon: '🔐' },
];

const trustItems = [
    { icon: CheckCircle2, color: '#10B981', title: 'Verified Taskers',     desc: 'All taskers undergo background checks and skill verification',   glowColor: 'rgba(16,185,129,0.15)' },
    { icon: Lock,         color: '#6C63FF', title: 'Secure INR Payments',  desc: 'Escrow system ensures your money is safe until the job is done',  glowColor: 'rgba(108,99,255,0.15)' },
    { icon: Star,         color: '#F59E0B', title: 'Reviewed Community',   desc: 'Read verified reviews from real customers before hiring',          glowColor: 'rgba(245,158,11,0.15)' },
    { icon: Phone,        color: '#00D4FF', title: '24/7 Support',         desc: 'Our India-based support team is always here to help you',          glowColor: 'rgba(0,212,255,0.15)' },
];

const HomePage = () => (
    <>
        <Hero />
        <main>
            {/* ── Categories ─────────────────────────────── */}
            <section className="section-padding" style={{ background: 'rgba(26,26,43,0.5)', backdropFilter: 'blur(10px)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>What do you need <span className="text-gradient">done?</span></h2>
                        <p>Browse popular categories or search for any task across India</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem' }}>
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                to={`/browse?category=${encodeURIComponent(cat.name)}`}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1.125rem', textDecoration: 'none',
                                    padding: '1.25rem', background: 'rgba(30,30,47,0.7)', backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px',
                                    transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.transform = 'translateY(-4px)';
                                    el.style.borderColor = `${cat.color}30`;
                                    el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${cat.color}20`;
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.transform = 'translateY(0)';
                                    el.style.borderColor = 'rgba(255,255,255,0.07)';
                                    el.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '50px', height: '50px', flexShrink: 0,
                                    background: `${cat.color}18`, border: `1px solid ${cat.color}30`,
                                    borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color,
                                }}>
                                    <cat.icon size={22} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.25rem', color: '#e3e0f8', fontWeight: 600 }}>{cat.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#918fa1', lineHeight: 1.4 }}>{cat.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link to="/browse" className="btn btn-outline" style={{ gap: '0.5rem' }}>
                            View all tasks <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── How it works ───────────────────────────── */}
            <section className="section-padding">
                <div className="container">
                    <div className="section-header">
                        <h2>How <span className="text-gradient">Connected</span> works</h2>
                        <p>Simple, safe, and fast — hire a verified tasker in minutes</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                        {steps.map((step, i) => (
                            <div key={step.num} style={{
                                textAlign: 'center', padding: '2.5rem 2rem',
                                background: 'rgba(30,30,47,0.6)', backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', position: 'relative',
                            }}>
                                <div style={{
                                    position: 'absolute', top: '1.25rem', right: '1.5rem',
                                    fontSize: '3.5rem', fontWeight: 900, opacity: 0.12, lineHeight: 1,
                                    color: i === 0 ? '#6C63FF' : i === 1 ? '#00D4FF' : '#10B981',
                                }}>{step.num}</div>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{step.icon}</div>
                                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem', color: '#e3e0f8' }}>{step.title}</h3>
                                <p style={{ color: '#918fa1', lineHeight: 1.7, fontSize: '0.9rem' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Trust Us ───────────────────────────── */}
            <section className="section-padding" style={{ background: 'rgba(26,26,43,0.5)', backdropFilter: 'blur(10px)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Why Indians trust <span className="text-gradient">Connected</span></h2>
                        <p>We put safety, quality, and transparency at the core</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        {trustItems.map(({ icon: Icon, color, title, desc, glowColor }) => (
                            <div key={title} style={{
                                padding: '2rem 1.5rem', background: 'rgba(30,30,47,0.65)', backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', textAlign: 'center',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 30px ${glowColor}`; el.style.borderColor = `${color}30`; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                                <div style={{ width:'60px', height:'60px', margin:'0 auto 1.25rem', background: glowColor, border:`1px solid ${color}25`, borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', color }}>
                                    <Icon size={26} />
                                </div>
                                <h3 style={{ marginBottom: '0.625rem', fontSize: '1.05rem', color: '#e3e0f8' }}>{title}</h3>
                                <p style={{ color: '#918fa1', fontSize: '0.875rem', lineHeight: 1.65 }}>{desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Banner */}
                    <div style={{
                        marginTop: '4rem', padding: '3rem 2.5rem',
                        background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,255,0.08) 100%)',
                        backdropFilter: 'blur(20px)', border: '1px solid rgba(108,99,255,0.2)',
                        borderRadius: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', background:'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)', borderRadius:'50%' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '0.875rem', color: '#e3e0f8' }}>
                                Ready to get your task done?
                            </h2>
                            <p style={{ color: '#918fa1', marginBottom: '2rem' }}>Join 25,000+ Indians who trust Connected every day</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link to="/post-task" className="btn btn-primary btn-lg">Post a Task</Link>
                                <Link to="/browse"    className="btn btn-outline btn-lg">Browse Tasks</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
);

function App() {
    return (
        <div className="app">
            <Navbar />
            <Routes>
                {/* Public */}
                <Route path="/"         element={<HomePage />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Tasker-only: clients are redirected to /dashboard */}
                <Route path="/browse"     element={<ClientBlockedRoute><BrowseTasks /></ClientBlockedRoute>} />
                <Route path="/tasks/:id"  element={<TaskDetails />} />

                {/* Client-only: taskers are redirected to /browse */}
                <Route path="/post-task"  element={<TaskerBlockedRoute><PostTask /></TaskerBlockedRoute>} />

                {/* Authenticated */}
                <Route path="/dashboard"  element={<RequireAuth><Dashboard /></RequireAuth>} />
                <Route path="/admin"      element={<RequireAuth><AdminDashboard /></RequireAuth>} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
