"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Globe, Edit2, Check, X, Upload, ExternalLink } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  codeLink?: string;
  // New structured fields
  context?: string;
  year?: string;
  position?: string;
  memberCount?: string;
  techStack?: string;
  features?: string;
  publicationLink?: string;
  longDescription?: string;
  category?: string;
};

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin: edit metadata fields inline
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [metaForm, setMetaForm] = useState<Partial<Project>>({});

  // 3 image slots
  const [imageSlots, setImageSlots] = useState<string[]>(['', '', '']);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [editingUrl, setEditingUrl] = useState('');

  useEffect(() => {
    setIsAdmin(localStorage.getItem('adminMode') === 'true');
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setFullData(data);
        const found = data.projects?.find((p: Project) => p.id === unwrappedParams.id);
        if (found) {
          setProject(found);
          const imgs: string[] = found.image
            ? found.image.split(',').map((u: string) => u.trim()).filter((u: string) => u).slice(0, 3)
            : [];
          while (imgs.length < 3) imgs.push('');
          setImageSlots(imgs);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [unwrappedParams.id]);

  // ── Image slot helpers ──────────────────────────────────────────────
  const persistSlots = async (newSlots: string[], updatedProject: Project) => {
    if (!fullData) return;
    const updated = { ...updatedProject, image: newSlots.filter(u => u).join(', ') };
    const newProjects = fullData.projects.map((p: Project) => p.id === updated.id ? updated : p);
    const newData = { ...fullData, projects: newProjects };
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newData) });
    setFullData(newData);
    setProject(updated);
  };

  const openEdit = (slotIdx: number) => { setEditingSlot(slotIdx); setEditingUrl(imageSlots[slotIdx]); };

  const handleSaveSlot = async () => {
    if (editingSlot === null || !project) return;
    const newSlots = [...imageSlots];
    newSlots[editingSlot] = editingUrl;
    setImageSlots(newSlots);
    setEditingSlot(null);
    await persistSlots(newSlots, project);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (editingSlot === null || !project) return;
      const url = reader.result as string;
      const newSlots = [...imageSlots];
      newSlots[editingSlot] = url;
      setImageSlots(newSlots);
      setEditingUrl(url);
      setEditingSlot(null);
      await persistSlots(newSlots, project);
    };
    reader.readAsDataURL(file);
  };

  // ── Meta edit helpers ───────────────────────────────────────────────
  const startEditMeta = () => {
    setMetaForm({ ...project });
    setIsEditingMeta(true);
  };

  const handleSaveMeta = async () => {
    if (!project || !fullData) return;
    const updated = { ...project, ...metaForm };
    const newProjects = fullData.projects.map((p: Project) => p.id === updated.id ? updated : p);
    const newData = { ...fullData, projects: newProjects };
    await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newData) });
    setFullData(newData);
    setProject(updated);
    setIsEditingMeta(false);
  };

  // ── Derived data ────────────────────────────────────────────────────
  const techStackList: string[] = project?.techStack
    ? project.techStack.split(',').map(t => t.trim()).filter(Boolean)
    : [];
  const featureList: string[] = project?.features
    ? project.features.split(',').map(f => f.trim()).filter(Boolean)
    : [];
  const thumbIndices = [0, 1, 2].filter(i => i !== featuredIndex);
  const emptySlot = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%231c1f26' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='18' font-family='sans-serif'%3E${isAdmin ? 'Click+to+add+image' : 'No+Image'}%3C/text%3E%3C/svg%3E`;

  if (loading) {
    return (
      <main className="container section" style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Loading Project...</div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="container section" style={{ paddingTop: '120px', minHeight: '100vh', textAlign: 'center' }}>
        <h1 className="section-title text-gradient">Project Not Found</h1>
        <Link href="/projects" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeft size={16} /> Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh' }}>

      {/* ── Back button ── */}
      <div className="container" style={{ marginBottom: '32px' }}>
        <Link href="/projects" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '8px', fontSize: '0.9rem' }}>
          <ChevronLeft size={18} /> Back
        </Link>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 280px) 1fr',
          gap: '48px',
          alignItems: 'start',
        }} className="project-detail-grid">

          {/* ══════════════════════════════════════════
              LEFT COLUMN — Structured metadata
          ══════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {isAdmin && !isEditingMeta && (
              <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }} onClick={startEditMeta}>
                <Edit2 size={13} /> Edit Info
              </button>
            )}

            {isEditingMeta ? (
              /* ── Admin: Edit meta form ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--primary)' }}>Edit Project Info</h3>

                {[
                  { label: 'Project Title', key: 'title' },
                  { label: 'Project Context', key: 'context', hint: 'e.g. Work Assignment (Internship)' },
                  { label: 'Year Accomplished', key: 'year', hint: 'e.g. 2026 (February - April)' },
                  { label: 'Position / Role', key: 'position', hint: 'e.g. Full-Stack Developer' },
                  { label: 'Team Size', key: 'memberCount', hint: 'e.g. 1 (solo), 3' },
                  { label: 'Publication / Repo Link', key: 'publicationLink', hint: 'https://github.com/...' },
                ].map(({ label, key, hint }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>{label}</label>
                    <input
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                      value={(metaForm as any)[key] || ''}
                      placeholder={hint || label}
                      onChange={e => setMetaForm({ ...metaForm, [key]: e.target.value })}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Features (comma-separated)</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    value={metaForm.features || ''}
                    placeholder="Real-time data, File upload, Dashboard analytics"
                    onChange={e => setMetaForm({ ...metaForm, features: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Description</label>
                  <textarea
                    className="input-field"
                    rows={5}
                    style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    value={metaForm.description || ''}
                    placeholder="Short project description..."
                    onChange={e => setMetaForm({ ...metaForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }} onClick={handleSaveMeta}>
                    <Check size={14} /> Save
                  </button>
                  <button className="btn btn-outline" style={{ padding: '10px 14px', fontSize: '0.85rem' }} onClick={() => setIsEditingMeta(false)}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* ── Display: Structured metadata ── */
              <>
                <MetaBlock label="Project Title" value={project.title} />
                {project.context && <MetaBlock label="Project Context" value={project.context} />}
                {project.year && <MetaBlock label="Year Accomplished" value={project.year} />}
                {(project.position || project.memberCount) && (
                  <MetaBlock
                    label={`Position${project.memberCount ? ` (${project.memberCount} member${Number(project.memberCount) !== 1 ? 's' : ''})` : ''}`}
                    value={project.position || '—'}
                  />
                )}
                {techStackList.length > 0 && (
                  <MetaBlock label="Tech Stack" value={techStackList.join(', ')} />
                )}
                {featureList.length > 0 && (
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-main)', marginBottom: '10px' }}>Features</span>
                    <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {featureList.map((f, i) => (
                        <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(project.publicationLink || project.codeLink) && (
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-main)', marginBottom: '8px' }}>Publication Link</span>
                    <a
                      href={project.publicationLink || project.codeLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.83rem', color: 'var(--primary-light)', wordBreak: 'break-all', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: '6px' }}
                    >
                      <ExternalLink size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                      {project.publicationLink || project.codeLink}
                    </a>
                  </div>
                )}
                {/* Live website button */}
                {project.link && project.link.trim() !== '' && project.link !== '#' && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', fontSize: '0.88rem', marginTop: '4px' }}>
                    <Globe size={16} /> Live Website
                  </a>
                )}
              </>
            )}
          </div>

          {/* ══════════════════════════════════════════
              RIGHT COLUMN — Description + 3-panel gallery
          ══════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Description */}
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Description</h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--text-muted)' }}>
                {project.description}
              </p>
            </div>

            {/* 3-Panel Gallery */}
            <div>
              {isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Edit2 size={12} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Admin: click any panel to change image</span>
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 0.55fr',
                gridTemplateRows: '1fr 1fr',
                gap: '10px',
                height: 'clamp(280px, 38vw, 460px)',
              }}>
                {/* Featured */}
                <div
                  onClick={() => isAdmin && openEdit(featuredIndex)}
                  style={{
                    gridColumn: '1', gridRow: '1 / 3',
                    position: 'relative', borderRadius: '18px', overflow: 'hidden',
                    background: '#1c1f26', cursor: isAdmin ? 'pointer' : 'default',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
                  }}
                >
                  <img
                    src={imageSlots[featuredIndex] || emptySlot}
                    alt={`${project.title} featured`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(.16,1,.3,1)' }}
                  />
                  {isAdmin && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(0,0,0,0)', opacity: 0, transition: 'all 0.25s' }}
                      onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(0,0,0,0.5)'; el.style.opacity = '1'; }}
                      onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(0,0,0,0)'; el.style.opacity = '0'; }}
                    >
                      <Upload size={26} color="white" />
                      <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', pointerEvents: 'none' }}>Change</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(59,130,246,0.9)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', pointerEvents: 'none' }}>
                    FEATURED
                  </div>
                </div>

                {/* Thumbnails */}
                {thumbIndices.map((slotIdx, pos) => (
                  <div
                    key={slotIdx}
                    tabIndex={0}
                    onClick={() => isAdmin ? openEdit(slotIdx) : setFeaturedIndex(slotIdx)}
                    onKeyDown={e => e.key === 'Enter' && (isAdmin ? openEdit(slotIdx) : setFeaturedIndex(slotIdx))}
                    style={{
                      gridColumn: '2', gridRow: `${pos + 1}`,
                      position: 'relative', borderRadius: '14px', overflow: 'hidden',
                      background: '#1c1f26', cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease', outline: 'none',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(59,130,246,0.35)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)'; }}
                  >
                    <img src={imageSlots[slotIdx] || emptySlot} alt={`${project.title} screenshot ${pos + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', opacity: 0, transition: 'all 0.25s' }}
                      onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(0,0,0,0.5)'; el.style.opacity = '1'; }}
                      onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(0,0,0,0)'; el.style.opacity = '0'; }}
                    >
                      <span style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', pointerEvents: 'none' }}>
                        {isAdmin ? '✎ Edit' : '⤢ View'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {!isAdmin && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '10px', fontStyle: 'italic' }}>
                  Click a thumbnail to feature it
                </p>
              )}
            </div>

            {/* Long Description */}
            {project.longDescription && (
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '32px' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 700 }}>Behind the Project</h2>
                <div style={{ fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{project.longDescription}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Admin Image Edit Modal ── */}
      {isAdmin && editingSlot !== null && (
        <div className="modal-backdrop" onClick={() => setEditingSlot(null)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ padding: '32px', maxWidth: '480px', width: '90%', borderRadius: '24px' }}>
            <h3 style={{ marginBottom: '6px', fontWeight: 700 }}>
              Edit {editingSlot === featuredIndex ? 'Featured' : `Thumbnail ${thumbIndices.indexOf(editingSlot) + 2}`} Image
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Paste a URL or upload from device.</p>
            {editingUrl && (
              <img src={editingUrl} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--panel-border)' }} />
            )}
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Image URL</label>
            <input className="input-field" value={editingUrl} onChange={e => setEditingUrl(e.target.value)} placeholder="https://..." style={{ marginBottom: '16px' }} />
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Upload from device</label>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <button className="btn btn-outline" style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', pointerEvents: 'none' }}>
                <Upload size={16} /> Choose File
              </button>
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveSlot}><Check size={16} /> Save</button>
              <button className="btn btn-outline" onClick={() => setEditingSlot(null)}><X size={16} /> Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Profile footer card ── */}
      {fullData?.profile && (
        <div className="container" style={{ maxWidth: '1100px', margin: '80px auto 0 auto' }}>
          <div className="glass-panel" style={{ padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src={fullData.profile.footerImage || 'https://via.placeholder.com/80'} alt="Profile" style={{ width: '72px', height: '72px', borderRadius: '14px', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '3px' }}>{fullData.profile.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2px' }}>{fullData.profile.title}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{fullData.profile.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {fullData.profile.email && (
                <a href={`mailto:${fullData.profile.email}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '10px', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </a>
              )}
              {fullData.profile.phone && (
                <a href={`https://wa.me/${fullData.profile.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '10px', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
              )}
              {Array.isArray(fullData.profile.social) && fullData.profile.social.map((s: any, idx: number) => (
                <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '10px', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${s.platform.toLowerCase().replace(/\s+/g, '')}.svg`} style={{ width: '16px', height: '16px', filter: 'invert(1)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} alt={s.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

// ── Helper component: Metadata block ────────────────────────────────────────
function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-main)', marginBottom: '5px' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}
