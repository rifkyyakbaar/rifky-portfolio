"use client";

import { useEffect, useState } from 'react';
import { ExternalLink, Edit2, Plus, Check, X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  codeLink?: string;
  category?: string;
};

const CATEGORIES = ['All', 'Work', 'Organizational', 'Academic', 'Personal'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [fullData, setFullData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(d => {
        setFullData(d);
        setProjects(d.projects || []);
      });
    
    setIsAdmin(localStorage.getItem('adminMode') === 'true');
  }, []);

  const startEdit = () => {
    setIsEditing(true);
    setFormData(JSON.parse(JSON.stringify(projects)));
  };

  const handleSave = async () => {
    const newData = { ...fullData, projects: formData };
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setFullData(newData);
    setProjects(formData);
    setIsEditing(false);
  };

  const addProject = () => {
    setFormData([...formData, {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Project description...',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
      link: '',
      codeLink: '',
      category: 'Work'
    }]);
  };

  const removeProject = (id: string) => {
    setFormData(formData.filter(p => p.id !== id));
  };

  return (
    <main className="container section" style={{ paddingTop: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <h1 className="section-title text-gradient" style={{ marginBottom: 0 }}>My Projects</h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className="btn" 
              style={{ padding: '8px 16px', borderRadius: '100px', background: filter === cat ? 'var(--primary)' : 'var(--glass-bg)', border: filter === cat ? '1px solid var(--primary)' : '1px solid var(--glass-border)', color: filter === cat ? '#fff' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '0.9rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
        {isAdmin && !isEditing && (
          <button className="btn btn-outline" onClick={startEdit}>
            <Edit2 size={16} /> Edit Projects
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {formData.map((project, i) => (
              <div key={project.id} style={{ border: '1px solid var(--glass-border)', padding: '24px', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ position: 'absolute', top: '16px', right: '16px', padding: '8px', color: 'var(--accent)' }}
                  onClick={() => removeProject(project.id)}
                >
                  <Trash2 size={16} />
                </button>
                <div className="admin-form" style={{ marginTop: '16px' }}>
                  <input className="input-field" value={project.title} onChange={e => { const newF = [...formData]; newF[i].title = e.target.value; setFormData(newF); }} placeholder="Project Title" />
                  <select className="input-field" value={project.category || 'Work'} onChange={e => { const newF = [...formData]; newF[i].category = e.target.value; setFormData(newF); }} style={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input className="input-field" value={project.image} onChange={e => { const newF = [...formData]; newF[i].image = e.target.value; setFormData(newF); }} placeholder="Image URL(s), separate with commas for slider" />
                  <input className="input-field" value={project.link || ''} onChange={e => { const newF = [...formData]; newF[i].link = e.target.value; setFormData(newF); }} placeholder="Live Website Domain (Optional)" />
                  <input className="input-field" value={project.codeLink || ''} onChange={e => { const newF = [...formData]; newF[i].codeLink = e.target.value; setFormData(newF); }} placeholder="View Code / GitHub Link (Optional)" />
                  <input className="input-field" value={(project as any).techStack || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).techStack = e.target.value; setFormData(newF); }} placeholder="Tech Stack (comma separated, e.g. React, Node.js)" />
                  <textarea className="input-field" value={project.description} onChange={e => { const newF = [...formData]; newF[i].description = e.target.value; setFormData(newF); }} placeholder="Short Description" rows={3} />
                  <textarea className="input-field" value={(project as any).longDescription || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).longDescription = e.target.value; setFormData(newF); }} placeholder="Detailed Explanation (Long Description)" rows={6} />
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <button className="btn btn-outline" onClick={addProject}><Plus size={16} /> Add Project</button>
            <div style={{ flex: 1 }}></div>
            <button className="btn btn-primary" onClick={handleSave}><Check size={16} /> Save Changes</button>
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
          {projects.filter(p => filter === 'All' || p.category === filter || (!p.category && filter === 'Work')).map((project, index) => {
            const firstImage = project.image ? project.image.split(',')[0].trim() : '';
            const techStack = (project as any)?.techStack ? (project as any).techStack.split(',').map((t: string) => t.trim()) : [];
            return (
              <div key={project.id} className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', animationDelay: `${index * 0.1}s`, padding: '24px', gap: '32px', borderRadius: '24px' }}>
                <div style={{ flex: '1 1 350px', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: 'var(--glass-highlight)', minHeight: '280px' }}>
                  {firstImage && (
                    <img src={firstImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }} />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 400px', paddingTop: '12px' }}>
                  <h3 style={{ fontSize: '1.75rem', marginBottom: '16px', fontWeight: 700 }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>{project.description}</p>
                  
                  {techStack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
                      {techStack.map((tech: string) => {
                        const t = tech.toLowerCase().replace('.', '').replace(' ', '');
                        let iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${t}/${t}-original.svg`;
                        if (t === 'nextjs') iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg';
                        if (t === 'tailwindcss') iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg';
                        if (t === 'firebase') iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg';
                        
                        return (
                          <div key={tech} title={tech} style={{ padding: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px' }}>
                            <img 
                              src={iconUrl} 
                              alt={tech} 
                              style={{ 
                                width: '24px', 
                                height: '24px', 
                                filter: (t === 'nextjs' || t === 'github') ? 'var(--icon-filter)' : 'none' 
                              }} 
                              onError={(e) => { (e.target as any).style.display = 'none'; }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Link href={`/projects/${project.id}`} className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '8px', flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                      View Project Details <ExternalLink size={16} style={{ marginLeft: '8px' }} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {projects.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No projects added yet.</p>
          )}
        </div>
      )}

      {fullData?.profile && (
        <div className="glass-panel animate-fade-in delay-4" style={{ marginTop: '96px', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <img src={fullData.profile.footerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{fullData.profile.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{fullData.profile.title}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{fullData.profile.email}</p>
              </div>
           </div>
           
           <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href={`mailto:${fullData.profile.email}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '12px', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              </a>
              <a href={`https://wa.me/${fullData.profile.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '12px', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
              <a href={fullData.profile.social?.instagram} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '12px', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href={fullData.profile.social?.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '12px', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href={fullData.profile.social?.github} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '12px', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.39-3.5 5.03 5.03 0 0 0-.13-3.4s-1.13-.36-3.7 1.38a12.98 12.98 0 0 0-6.8 0C5.13 4.64 4 5 4 5a5.03 5.03 0 0 0-.13 3.4A5.2 5.2 0 0 0 2.5 12c0 5.23 3 6.42 6 6.76a4.8 4.8 0 0 0-1 3.24v4"></path><path d="M4 19c-3 0-3-3-3-3"></path></svg>
              </a>
           </div>
        </div>
      )}
    </main>
  );
}
