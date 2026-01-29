import { Routes, Route } from 'react-router-dom';
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
import { Hammer, Truck, Paintbrush, Code, Camera, Laptop } from 'lucide-react';

const categories = [
  { name: 'Handyman', icon: Hammer, desc: 'Repairs, furniture assembly' },
  { name: 'Moving', icon: Truck, desc: 'Home and office moving' },
  { name: 'Cleaning', icon: Paintbrush, desc: 'Deep clean, regular clean' },
  { name: 'I.T. Services', icon: Laptop, desc: 'Tech support, setup' },
  { name: 'Design', icon: Code, desc: 'Web and graphic design' },
  { name: 'Photography', icon: Camera, desc: 'Events and products' }
];

const HomePage = () => (
  <>
    <Hero />
    <main>
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-offset)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>What do you need done?</h2>
            <p style={{ color: 'var(--text-muted)' }}>Browse popular categories or see all tasks</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, i) => (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'rgba(0, 143, 180, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <cat.icon size={30} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>View all categories</button>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>How Connected works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, marginBottom: '-1.5rem' }}>01</div>
              <h3 style={{ marginBottom: '1rem' }}>Post your task</h3>
              <p style={{ color: 'var(--text-muted)' }}>Tell us what you need. It's free and takes seconds.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, marginBottom: '-1.5rem' }}>02</div>
              <h3 style={{ marginBottom: '1rem' }}>Review offers</h3>
              <p style={{ color: 'var(--text-muted)' }}>Get bids from trusted taskers. Check reviews and profiles.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', opacity: 0.2, marginBottom: '-1.5rem' }}>03</div>
              <h3 style={{ marginBottom: '1rem' }}>Get it done</h3>
              <p style={{ color: 'var(--text-muted)' }}>Pay securely into escrow. Release funds when happy.</p>
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-task" element={<PostTask />} />
        <Route path="/browse" element={<BrowseTasks />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
