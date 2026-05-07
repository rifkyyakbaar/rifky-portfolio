"use client";

import { useEffect, useState, useRef } from 'react';
import { Briefcase, GraduationCap, ChevronRight, ChevronLeft, Edit2, Check, X, Users, Brain, MessageSquare, RefreshCw, Clock, Zap, Star, Mail, Phone, Save } from 'lucide-react';
import Image from 'next/image';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// Fallback Icon for dynamic rendering
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

type Data = {
  profile: any;
  softSkills: string[];
  techSkills: { name: string, icon: string }[];
  experiences: any[];
  projects: any[];
};

const TechMarquee = ({ techSkills }: { techSkills: { name: string, icon: string }[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const xPos = useRef(0);
  const requestRef = useRef<number>(0);
  const speed = useRef(1.5);

  useEffect(() => {
    const animate = () => {
      if (containerRef.current) {
        // Smooth slowdown logic
        const targetSpeed = isHovered.current ? 0.2 : 1.5;
        speed.current += (targetSpeed - speed.current) * 0.05;
        
        xPos.current -= speed.current;
        
        // Reset position when half of the duplicated content is scrolled
        if (Math.abs(xPos.current) >= containerRef.current.scrollWidth / 2) {
          xPos.current = 0;
        }
        
        containerRef.current.style.transform = `translateX(${xPos.current}px)`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="tech-marquee-container" style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', position: 'relative', display: 'flex', padding: '48px 0', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <div 
        ref={containerRef}
        style={{ display: 'flex', gap: '32px', willChange: 'transform' }}
      >
        {[...techSkills, ...techSkills].map((tech, idx) => (
          <div 
            key={idx} 
            className="tech-icon-wrapper"
            style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onMouseEnter={() => isHovered.current = true}
            onMouseLeave={() => isHovered.current = false}
          >
            <div className="tech-tooltip" style={{ position: 'absolute', top: '-35px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              {tech.name}
            </div>
            <div className="tech-pill glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s' }}>
              <img 
                src={tech.icon || `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${tech.name.toLowerCase().replace(/\s+/g, '').replace(/\./g, 'dot')}.svg`} 
                alt={tech.name}
                style={{ width: '32px', height: '32px', filter: tech.name.toLowerCase() === 'github' || tech.name.toLowerCase() === 'next.js' ? 'invert(1)' : 'none' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .tech-icon-wrapper:hover .tech-tooltip { opacity: 1 !important; transform: translateY(-5px); }
        .tech-icon-wrapper:hover .tech-pill { border-color: var(--primary); box-shadow: 0 0 20px var(--primary-glow); transform: scale(1.1); }
      `}</style>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState<Data | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [selectedExp, setSelectedExp] = useState<any>(null);
  const [currentExpImageIndex, setCurrentExpImageIndex] = useState(0);

  useEffect(() => {
    fetchData();
    setIsAdmin(localStorage.getItem('adminMode') === 'true');
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const json = await response.json();
      
      // Data Migration: Convert legacy social object to array if needed
      if (json.profile && json.profile.social && !Array.isArray(json.profile.social)) {
        const socialArray = [];
        if (json.profile.social.github) socialArray.push({ platform: 'GitHub', url: json.profile.social.github });
        if (json.profile.social.linkedin) socialArray.push({ platform: 'LinkedIn', url: json.profile.social.linkedin });
        if (json.profile.social.instagram) socialArray.push({ platform: 'Instagram', url: json.profile.social.instagram });
        json.profile.social = socialArray;
      }
      
      setData(json);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    if (isEditing && data) {
      if (isEditing === 'techSkills') {
        setFormData([...data.techSkills]);
      } else if (isEditing === 'softSkills') {
        setFormData([...data.softSkills]);
      } else if (isEditing === 'experiences') {
        setFormData([...data.experiences]);
      } else if (isEditing.startsWith('profile-')) {
        setFormData({ ...data.profile });
      }
    }
  }, [isEditing, data]);

  const handleSave = async (section: string) => {
    if (!data) return;
    
    let newData;
    if (section.startsWith('profile-')) {
      newData = { ...data, profile: formData };
    } else {
      newData = { ...data, [section]: formData };
    }

    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    
    setData(newData);
    setIsEditing(null);
  };

  const startEdit = (section: string, currentData: any) => {
    setIsEditing(section);
    setFormData(JSON.parse(JSON.stringify(currentData))); // Deep copy
  };

  if (!data) return <div className="section container text-center">Loading...</div>;

  return (
    <main>
      {/* Hero Section */}
      <section id="hero" className="section container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="blob" style={{ top: '20%', left: '10%', width: '400px', height: '400px' }}></div>
        <div className="blob" style={{ bottom: '10%', right: '10%', width: '300px', height: '300px', animationDelay: '-5s' }}></div>
        
        {isAdmin && isEditing !== 'profile-hero' && (
          <button className="btn btn-outline" style={{ position: 'absolute', top: '100px', right: '20px' }} onClick={() => startEdit('profile-hero', data.profile)}>
            <Edit2 size={16} /> Edit Hero
          </button>
        )}

        {isEditing === 'profile-hero' ? (
          <div className="glass-panel admin-form" style={{ padding: '32px', width: '100%', maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '16px' }}>Edit Hero Section</h3>
            <input className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" />
            <input className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" />
            <textarea className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Hero Description" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={() => handleSave('profile-hero')}><Check size={16}/> Save</button>
              <button className="btn btn-outline" onClick={() => setIsEditing(null)}><X size={16}/> Cancel</button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px' }}>
            
            {/* Open to Work Pill */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '6px 16px', borderRadius: '100px', 
              border: '1px solid var(--glass-border)', 
              background: 'rgba(255,255,255,0.03)',
              marginBottom: '24px',
              fontSize: '0.85rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
              Available for New Opportunities
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
              Hi, I'm <span className="text-gradient">{data.profile.name}</span>
            </h1>
            <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 500 }}>
              {data.profile.title}
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '600px' }}>
              {data.profile.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href="#contact" className="btn btn-outline">Contact Me</a>
            </div>

            {/* Social Icons Hero */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '48px' }}>
              {Array.isArray(data.profile.social) && data.profile.social.map((s: any, idx: number) => (
                <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="social-icon-link" style={{ color: 'var(--text-muted)', transition: 'all 0.3s ease' }}>
                  <img 
                    src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${s.platform.toLowerCase().replace(/\s+/g, '')}.svg`}
                    style={{ width: '24px', height: '24px', filter: 'invert(1)' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="section container">
        <div className="section-title">
          <h2>About Me</h2>
          <div className="section-title-line"></div>
        </div>
        
        {isAdmin && isEditing !== 'profile-about' && (
          <button className="btn btn-outline" style={{ float: 'right' }} onClick={() => startEdit('profile-about', data.profile)}>
            <Edit2 size={16} /> Edit About
          </button>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {isEditing === 'profile-about' ? (
            <div className="glass-panel admin-form" style={{ padding: '32px', gridColumn: '1 / -1' }}>
              <textarea className="input-field" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} rows={6} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button className="btn btn-primary" onClick={() => handleSave('profile-about')}><Check size={16}/> Save</button>
                <button className="btn btn-outline" onClick={() => setIsEditing(null)}><X size={16}/> Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="glass-panel animate-on-scroll" style={{ padding: '40px' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: data.profile.about }} />
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href={data.profile.resumeLink || '#'} target="_blank" rel="noreferrer" className="btn btn-primary">Download Resume</a>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                  <Users size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>10+</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Team Projects</div>
                </div>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                  <Brain size={32} style={{ color: 'var(--secondary)', marginBottom: '12px' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>5+</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Certifications</div>
                </div>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                  <MessageSquare size={32} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>100%</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reliability</div>
                </div>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                  <RefreshCw size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Fast</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Learner</div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Soft Skills Section */}
      <section id="skills" className="section container">
        <div className="section-title">
          <h2>My Skills</h2>
          <div className="section-title-line"></div>
        </div>

        {isAdmin && isEditing !== 'softSkills' && (
          <button className="btn btn-outline" style={{ float: 'right', marginBottom: '16px' }} onClick={() => startEdit('softSkills', data.softSkills)}>
            <Edit2 size={16} /> Edit Soft Skills
          </button>
        )}

        {isEditing === 'softSkills' ? (
          <div className="glass-panel admin-form" style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {formData.map((skill: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <input className="input-field" value={skill} onChange={e => { const newF = [...formData]; newF[i] = e.target.value; setFormData(newF); }} placeholder="Skill" />
                  <button className="btn btn-outline" style={{ color: '#ff4444' }} onClick={() => setFormData(formData.filter((_: any, idx: number) => idx !== i))}>✕</button>
                </div>
              ))}
            </div>
            <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => setFormData([...formData, 'New Skill'])}>+ Add Soft Skill</button>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={() => handleSave('softSkills')}><Check size={16}/> Save</button>
              <button className="btn btn-outline" onClick={() => setIsEditing(null)}><X size={16}/> Cancel</button>
            </div>
          </div>
        ) : (
          <div className="soft-skills-grid animate-fade-in delay-2">
            {data.softSkills?.map((skill, idx) => (
              <div key={idx} className="soft-skill-cell">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></span>
                <span style={{ fontWeight: 500 }}>{skill}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tech Stack Marquee Section */}
      <section className="section" style={{ overflow: 'hidden', padding: '60px 0', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Tools I Use Daily</h2>
            {isAdmin && isEditing !== 'techSkills' && (
              <button className="btn btn-outline" onClick={() => startEdit('techSkills', data.techSkills)}>
                <Edit2 size={16} /> Edit Stack
              </button>
            )}
          </div>
        </div>

        {isEditing === 'techSkills' ? (
          <div className="container glass-panel admin-form" style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {formData.map((skill: any, i: number) => (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <input className="input-field" style={{ flex: 1 }} value={skill.name} onChange={e => { const newF = [...formData]; newF[i].name = e.target.value; setFormData(newF); }} placeholder="Skill Name" />
                  <input className="input-field" style={{ flex: 2 }} value={skill.icon || ''} onChange={e => { const newF = [...formData]; newF[i].icon = e.target.value; setFormData(newF); }} placeholder="DevIcon SVG URL (Optional)" />
                  <button className="btn btn-outline" style={{ color: '#ff4444', padding: '12px' }} onClick={() => setFormData(formData.filter((_: any, idx: number) => idx !== i))}>✕</button>
                </div>
              ))}
            </div>
            <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => setFormData([...formData, { name: 'New Skill', icon: '' }])}>+ Add Skill</button>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={() => handleSave('techSkills')}><Check size={16}/> Save</button>
              <button className="btn btn-outline" onClick={() => setIsEditing(null)}><X size={16}/> Cancel</button>
            </div>
          </div>
        ) : (
          <TechMarquee techSkills={data.techSkills} />
        )}
      </section>

      {/* Experience Section */}
      <section id="experience" className="section container">
        <div className="section-title">
          <h2>Work Experience</h2>
          <div className="section-title-line"></div>
        </div>

        {isAdmin && isEditing !== 'experiences' && (
          <button className="btn btn-outline" style={{ float: 'right' }} onClick={() => startEdit('experiences', data.experiences)}>
            <Edit2 size={16} /> Edit Experiences
          </button>
        )}

        {isEditing === 'experiences' ? (
          <div className="glass-panel admin-form" style={{ padding: '32px' }}>
              {formData.map((exp: any, i: number) => (
                <div key={i} className="glass-panel" style={{ padding: '20px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <input className="input-field" value={exp.role} onChange={e => { const newF = [...formData]; newF[i].role = e.target.value; setFormData(newF); }} placeholder="Role" />
                    <input className="input-field" value={exp.company} onChange={e => { const newF = [...formData]; newF[i].company = e.target.value; setFormData(newF); }} placeholder="Company" />
                    <input className="input-field" value={exp.duration} onChange={e => { const newF = [...formData]; newF[i].duration = e.target.value; setFormData(newF); }} placeholder="Duration" />
                    
                    <div style={{ position: 'relative', height: '40px' }}>
                      <button className="btn btn-outline" style={{ width: '100%' }}>{exp.image ? 'Change Logo' : 'Upload Logo'}</button>
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const newF = [...formData];
                            newF[i].image = reader.result as string;
                            setFormData(newF);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                    </div>
                  </div>

                  <textarea className="input-field" value={exp.description} onChange={e => { const newF = [...formData]; newF[i].description = e.target.value; setFormData(newF); }} placeholder="Description" rows={4} />
                </div>
              ))}
             <button className="btn btn-outline" onClick={() => setFormData([...formData, {id: Date.now().toString(), role: 'New Role', company: 'New Company', duration: '2025 - Present', description: '', image: ''}])}>+ Add Experience</button>
             <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
               <button className="btn btn-primary" onClick={() => handleSave('experiences')}><Save size={18}/> Save Changes</button>
               <button className="btn btn-secondary" onClick={() => setIsEditing(null)}><X size={18}/> Cancel</button>
             </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', paddingLeft: '24px' }}>
            <div style={{ position: 'absolute', left: '7px', top: '16px', bottom: '16px', width: '2px', background: 'var(--glass-border)' }}></div>
            {data.experiences.map((exp) => {
              const isActive = selectedExp?.id === exp.id;
              return (
                <div key={exp.id} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setSelectedExp(exp); setCurrentExpImageIndex(0); }}>
                  <div style={{ 
                    position: 'absolute', left: '-29px', top: '24px', width: '12px', height: '12px', borderRadius: '50%', 
                    background: isActive ? 'var(--primary)' : 'var(--bg-color)', 
                    border: `3px solid ${isActive ? 'var(--primary)' : 'var(--text-muted)'}`, 
                    zIndex: 2,
                    boxShadow: isActive ? '0 0 10px var(--primary-glow)' : 'none',
                    transition: 'all 0.3s ease'
                  }}></div>
                  <div className="glass-panel" style={{ padding: '24px', transition: 'all 0.3s ease', opacity: (selectedExp && !isActive) ? 0.5 : 1, transform: isActive ? 'scale(1.02)' : 'scale(1)', border: isActive ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }} onMouseEnter={e => !isActive && (e.currentTarget.style.transform = 'scale(1.01)')} onMouseLeave={e => !isActive && (e.currentTarget.style.transform = 'scale(1)')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{exp.role} <span style={{ color: 'var(--primary)' }}>@ {exp.company}</span></h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{exp.duration}</p>
                      </div>
                      <ChevronRight style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.3s' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal for Experience */}
      {selectedExp && (
        <div className="modal-backdrop open" onClick={() => setSelectedExp(null)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ padding: '32px', maxWidth: '700px' }}>
            
            {/* Experience Image Slider */}
            <div style={{ position: 'relative', height: '300px', width: '100%', marginBottom: '24px', borderRadius: '16px', overflow: 'hidden' }}>
                <img 
                  src={selectedExp.image || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop'} 
                  alt={selectedExp.company}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{selectedExp.role}</h2>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '16px' }}>{selectedExp.company}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{selectedExp.duration}</p>
            
            <div style={{ color: 'var(--text-main)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {selectedExp.description}
            </div>

            <button className="btn btn-outline" style={{ marginTop: '32px', width: '100%' }} onClick={() => setSelectedExp(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <section id="projects" className="section container">
        <div className="section-title">
          <h2>Featured Projects</h2>
          <div className="section-title-line"></div>
        </div>

        {isAdmin && isEditing !== 'projects' && (
          <button className="btn btn-outline" style={{ float: 'right', marginBottom: '16px' }} onClick={() => startEdit('projects', data.projects || [])}>
            <Edit2 size={16} /> Edit Projects
          </button>
        )}

        {isEditing === 'projects' ? (
          <div className="glass-panel admin-form" style={{ padding: '32px' }}>
            {formData.map((proj: any, i: number) => (
              <div key={i} className="glass-panel" style={{ padding: '20px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <input className="input-field" value={proj.title} onChange={e => { const newF = [...formData]; newF[i].title = e.target.value; setFormData(newF); }} placeholder="Project Title" />
                  <input className="input-field" value={proj.link} onChange={e => { const newF = [...formData]; newF[i].link = e.target.value; setFormData(newF); }} placeholder="Project URL (Optional)" />
                  <div style={{ position: 'relative', height: '40px' }}>
                    <button className="btn btn-outline" style={{ width: '100%' }}>{proj.image ? 'Change Image' : 'Upload Image'}</button>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const newF = [...formData];
                          newF[i].image = reader.result as string;
                          setFormData(newF);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  </div>
                </div>
                <textarea className="input-field" value={proj.description} onChange={e => { const newF = [...formData]; newF[i].description = e.target.value; setFormData(newF); }} placeholder="Short Description" rows={2} />
              </div>
            ))}
            <button className="btn btn-outline" onClick={() => setFormData([...formData, { id: Date.now().toString(), title: 'New Project', description: '', image: '', link: '' }])}>+ Add Project</button>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={() => handleSave('projects')}><Save size={18}/> Save Changes</button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(null)}><X size={18}/> Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {data.projects?.map((proj) => (
              <div key={proj.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '200px', width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  {proj.image ? (
                    <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Image</div>
                  )}
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{proj.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', flex: 1 }}>{proj.description}</p>
                  <a href={`/projects/${proj.id}`} className="btn btn-outline" style={{ width: '100%' }}>View Project Details</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="section container" style={{ paddingBottom: '100px' }}>
        <div className="section-title">
          <h2>Get in Touch</h2>
          <div className="section-title-line"></div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
          
          {/* Left: 3D SVG Envelope */}
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div className="floating-envelope" style={{ position: 'relative' }}>
              <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="20" width="220" height="140" rx="16" fill="var(--glass-bg)" stroke="var(--primary)" strokeWidth="4"/>
                <path d="M10 36L120 100L230 36" stroke="var(--primary)" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M10 144L85 100" stroke="var(--primary)" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M230 144L155 100" stroke="var(--primary)" strokeWidth="4" strokeLinejoin="round"/>
                <circle cx="120" cy="100" r="16" fill="var(--bg-color)" stroke="var(--primary)" strokeWidth="4"/>
                <path d="M112 100L118 106L128 94" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="glass-panel animate-fade-in delay-2" style={{ padding: '40px' }}>
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:${data.profile.email}`; }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Your Name</label>
                <input required className="input-field" placeholder="John Doe" style={{ background: 'rgba(0,0,0,0.2)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Your Email</label>
                <input required type="email" className="input-field" placeholder="john@example.com" style={{ background: 'rgba(0,0,0,0.2)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Message</label>
                <textarea required className="input-field" placeholder="Hello Rifky, I'd like to work with you..." rows={4} style={{ background: 'rgba(0,0,0,0.2)' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                <Mail size={20} /> Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Footer Configuration Area */}
        <div style={{ position: 'relative', marginTop: '100px' }}>
          {isAdmin && isEditing !== 'profile-footer' && (
            <button className="btn btn-outline" style={{ position: 'absolute', right: '16px', top: '-40px', padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => startEdit('profile-footer', data.profile)}>
              <Edit2 size={12} /> Edit Footer
            </button>
          )}

          {isEditing === 'profile-footer' ? (
            <div className="glass-panel admin-form" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '24px' }}>Edit Identity & Links</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '24px' }}>
                {/* Column 1: Identity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Identity</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Footer Avatar</label>
                    {formData.footerImage && (
                      <img src={formData.footerImage} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', marginBottom: '8px' }} />
                    )}
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({...formData, footerImage: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }} style={{ fontSize: '0.8rem' }} />
                  </div>
                  <input className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" />
                  <input className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resume Link (Used in About section)</label>
                    <input className="input-field" value={formData.resumeLink} onChange={e => setFormData({...formData, resumeLink: e.target.value})} placeholder="https://..." />
                  </div>
                </div>

                {/* Column 2: Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Contact Info</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email</label>
                    <input className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone/WhatsApp</label>
                    <input className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                {/* Column 3: Social Media */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Social Media Links</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Array.isArray(formData.social) ? formData.social.map((s: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                          <img 
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${s.platform.toLowerCase().replace(/\s+/g, '')}.svg`}
                            style={{ width: '16px', height: '16px', filter: 'invert(1)' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                            }}
                          />
                        </div>
                        <input 
                          className="input-field" 
                          style={{ flex: 1 }}
                          value={s.platform} 
                          placeholder="Platform (e.g. GitHub)"
                          onChange={e => {
                            const newSocial = [...formData.social];
                            newSocial[idx].platform = e.target.value;
                            setFormData({...formData, social: newSocial});
                          }} 
                        />
                        <input 
                          className="input-field" 
                          style={{ flex: 2 }}
                          value={s.url} 
                          placeholder="URL"
                          onChange={e => {
                            const newSocial = [...formData.social];
                            newSocial[idx].url = e.target.value;
                            setFormData({...formData, social: newSocial});
                          }} 
                        />
                        <button 
                          onClick={() => {
                            const newSocial = formData.social.filter((_: any, i: number) => i !== idx);
                            setFormData({...formData, social: newSocial});
                          }}
                          style={{ padding: '8px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    )) : null}
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: '100%', marginTop: '8px', padding: '10px', fontSize: '0.85rem' }}
                      onClick={() => {
                        const currentSocial = Array.isArray(formData.social) ? formData.social : [];
                        setFormData({
                          ...formData, 
                          social: [...currentSocial, { platform: '', url: '' }]
                        });
                      }}
                    >
                      + Add Social Link
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-primary" onClick={() => handleSave('profile-footer')}>
                  <Save size={18} /> Save Changes
                </button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(null)}>
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel animate-fade-in delay-4" style={{ padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <img src={data.profile.footerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{data.profile.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{data.profile.title}</p>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
                       <a href={`mailto:${data.profile.email}`} className="footer-link" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Email</a>
                       <a href={`https://wa.me/${data.profile.phone.replace(/\D/g, '')}`} className="footer-link" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> WhatsApp</a>
                    </div>
                  </div>
               </div>

               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
                {data.profile.email && (
                  <a href={`mailto:${data.profile.email}`} className="btn btn-outline" style={{ padding: '12px', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={20} />
                  </a>
                )}
                {data.profile.phone && (
                  <a href={`https://wa.me/${data.profile.phone.replace(/\D/g, '')}`} className="btn btn-outline" style={{ padding: '12px', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={20} />
                  </a>
                )}
                {Array.isArray(data.profile.social) && data.profile.social.map((s: any, idx: number) => (
                  <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '12px', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${s.platform.toLowerCase().replace(/\s+/g, '')}.svg`}
                      style={{ width: '20px', height: '20px', filter: 'invert(1)' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1-4-10z"></path></svg>';
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
