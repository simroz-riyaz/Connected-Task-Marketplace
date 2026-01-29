import React from 'react';
import { Search } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section className="section-padding" style={{
            background: 'linear-gradient(rgba(0, 143, 180, 0.05), rgba(0, 143, 180, 0.1)), url("/hero_background_tasker.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '500px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <div className="container">
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                    To-do list full? <br />
                    <span style={{ color: 'var(--primary)' }}>Get it done with Connected</span>
                </h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--text-muted)', maxWidth: '700px', marginInline: 'auto' }}>
                    Connect with trusted taskers for anything you need done, from home repairs to digital services.
                </p>

                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    backgroundColor: 'white',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '1.5rem', gap: '0.75rem' }}>
                        <Search color="var(--primary)" size={24} />
                        <input
                            type="text"
                            placeholder="What do you need help with?"
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1.1rem' }}
                        />
                    </div>
                    <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                        Get started
                    </button>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>10k+</div>
                        <div style={{ color: 'var(--text-muted)' }}>Tasks Posted</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>4.8/5</div>
                        <div style={{ color: 'var(--text-muted)' }}>Average Rating</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>100%</div>
                        <div style={{ color: 'var(--text-muted)' }}>Secure Payments</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
