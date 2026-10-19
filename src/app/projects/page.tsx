"use client";

import { useEffect, useState } from 'react';
import { ExternalLink, Edit2, Plus, Check, X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

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
    <main>
      <div className="container section" style={{ paddingTop: '120px' }}>
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
                  <input className="input-field" value={(project as any).context || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).context = e.target.value; setFormData(newF); }} placeholder="Project Context (e.g. Work Assignment (Internship))" />
                  <input className="input-field" value={(project as any).year || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).year = e.target.value; setFormData(newF); }} placeholder="Year Accomplished (e.g. 2026 (February - April))" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input className="input-field" value={(project as any).position || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).position = e.target.value; setFormData(newF); }} placeholder="Position / Role (e.g. Full-Stack Developer)" />
                    <input className="input-field" value={(project as any).memberCount || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).memberCount = e.target.value; setFormData(newF); }} placeholder="Team Size (e.g. 1 for solo)" />
                  </div>
                  <input className="input-field" value={(project as any).techStack || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).techStack = e.target.value; setFormData(newF); }} placeholder="Tech Stack (comma separated, e.g. React, Node.js)" />
                  <textarea className="input-field" value={(project as any).features || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).features = e.target.value; setFormData(newF); }} placeholder="Features (comma-separated, e.g. Real-time tracking, File upload, Dashboard)" rows={3} />
                  <input className="input-field" value={(project as any).publicationLink || ''} onChange={e => { const newF = [...formData]; (newF[i] as any).publicationLink = e.target.value; setFormData(newF); }} placeholder="Publication / Repo Link (e.g. https://github.com/...)" />
                  <input className="input-field" value={project.image} onChange={e => { const newF = [...formData]; newF[i].image = e.target.value; setFormData(newF); }} placeholder="Image URLs (up to 3, comma-separated): img1.jpg, img2.jpg, img3.jpg" />
                  <input className="input-field" value={project.link || ''} onChange={e => { const newF = [...formData]; newF[i].link = e.target.value; setFormData(newF); }} placeholder="Live Website URL (Optional)" />
                  <input className="input-field" value={project.codeLink || ''} onChange={e => { const newF = [...formData]; newF[i].codeLink = e.target.value; setFormData(newF); }} placeholder="View Code / GitHub Link (Optional)" />
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
          {projects.filter(p => filter === 'All' || p.category === filter || (!p.category && filter === 'Work')).map((project, index) => {
            const allImages = project.image
              ? project.image.split(',').map((u: string) => u.trim()).filter((u: string) => u).slice(0, 3)
              : [];
            while (allImages.length < 3) allImages.push('');
            const featuredImg = allImages[0];
            const thumb1 = allImages[1];
            const thumb2 = allImages[2];
            const techStack = (project as any)?.techStack ? (project as any).techStack.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
            const featureList = (project as any)?.features ? (project as any).features.split(',').map((f: string) => f.trim()).filter(Boolean) : [];
            const emptySlot = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%231c1f26' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='13' font-family='sans-serif'%3ENo+Image%3C/text%3E%3C/svg%3E`;

            return (
              <div key={project.id} className="glass-panel animate-fade-in project-card-template" style={{ animationDelay: `${index * 0.1}s`, padding: '32px', borderRadius: '24px', overflow: 'hidden' }}>

                {/* ── 3-column layout: meta | images | description ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '32px', alignItems: 'start' }} className="project-card-grid">

                  {/* LEFT: Structured metadata */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
                    <ProjectCardMeta label="Project Title" value={project.title} />
                    {(project as any).context && <ProjectCardMeta label="Project Context" value={(project as any).context} />}
                    {(project as any).year && <ProjectCardMeta label="Year Accomplished" value={(project as any).year} />}
                    {((project as any).position || (project as any).memberCount) && (
                      <ProjectCardMeta
                        label={`Position${(project as any).memberCount ? ` (${(project as any).memberCount} member${Number((project as any).memberCount) !== 1 ? 's' : ''})` : ''}`}
                        value={(project as any).position || '—'}
                      />
                    )}
                    {techStack.length > 0 && (
                      <ProjectCardMeta label="Tech Stack" value={techStack.join(', ')} />
                    )}
                    {featureList.length > 0 && (
                      <div>
                        <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-main)', marginBottom: '8px' }}>Features</span>
                        <ul style={{ margin: 0, paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {featureList.map((f: string, i: number) => (
                            <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {((project as any).publicationLink || project.codeLink) && (
                      <div>
                        <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-main)', marginBottom: '6px' }}>Publication Link</span>
                        <a
                          href={(project as any).publicationLink || project.codeLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: '0.78rem', color: 'var(--primary-light)', wordBreak: 'break-all', lineHeight: 1.6 }}
                        >
                          {(project as any).publicationLink || project.codeLink}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* CENTER: 3-panel image grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 0.55fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: '8px',
                    height: 'clamp(220px, 22vw, 340px)',
                  }}>
                    {/* Featured */}
                    <div style={{ gridColumn: '1', gridRow: '1 / 3', borderRadius: '14px', overflow: 'hidden', background: '#1c1f26', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                      <img src={featuredImg || emptySlot} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    {/* Thumb 1 */}
                    <div style={{ gridColumn: '2', gridRow: '1', borderRadius: '10px', overflow: 'hidden', background: '#1c1f26', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                      <img src={thumb1 || emptySlot} alt={`${project.title} 2`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    {/* Thumb 2 */}
                    <div style={{ gridColumn: '2', gridRow: '2', borderRadius: '10px', overflow: 'hidden', background: '#1c1f26', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                      <img src={thumb2 || emptySlot} alt={`${project.title} 3`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  </div>

                  {/* RIGHT: Description + CTA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-main)', marginBottom: '10px' }}>Description</span>
                      <p style={{ fontSize: '0.88rem', lineHeight: 1.85, color: 'var(--text-muted)' }}>
                        {project.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '12px' }}>
                      <Link
                        href={`/projects/${project.id}`}
                        className="btn btn-primary"
                        style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        View Details <ExternalLink size={14} />
                      </Link>
                      {project.link && project.link.trim() !== '' && project.link !== '#' && (
                        <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-outline"
                          style={{ padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Live <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
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
      </div>

      {fullData?.profile && (
        <Footer profile={fullData.profile} />
      )}
    </main>
  );
}
