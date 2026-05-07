"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Globe } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  codeLink?: string;
};

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setFullData(data);
        const found = data.projects?.find((p: Project) => p.id === unwrappedParams.id);
        if (found) {
          setProject(found);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [unwrappedParams.id]);

  const images = project?.image ? project.image.split(',').map(u => u.trim()).filter(u => u) : [];
  const techStack = (project as any)?.techStack ? (project as any).techStack.split(',').map((t: string) => t.trim()) : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <main className="container section animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '120px', minHeight: '100vh' }}>
      
      {/* Top Bar with Back Button */}
      <div style={{ marginBottom: '48px', maxWidth: '1000px', margin: '0 auto 48px auto' }}>
        <Link href="/projects" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 24px', borderRadius: '8px', fontSize: '0.9rem' }}>
          <ChevronLeft size={18} /> Back
        </Link>
      </div>

      {/* Header Section */}
      <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 64px auto' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2, marginBottom: '24px', fontWeight: 800 }}>
          {project.title}
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {project.codeLink && project.codeLink.trim() !== '' && (
            <a href={project.codeLink} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.39-3.5 5.03 5.03 0 0 0-.13-3.4s-1.13-.36-3.7 1.38a12.98 12.98 0 0 0-6.8 0C5.13 4.64 4 5 4 5a5.03 5.03 0 0 0-.13 3.4A5.2 5.2 0 0 0 2.5 12c0 5.23 3 6.42 6 6.76a4.8 4.8 0 0 0-1 3.24v4"></path><path d="M4 19c-3 0-3-3-3-3"></path></svg> View Code
            </a>
          )}
          {project.link && project.link.trim() !== '' && project.link !== '#' && (
            <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px' }}>
              <Globe size={20} /> Live Website
            </a>
          )}
        </div>

        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-main)', textAlign: 'center', marginBottom: '40px' }}>
          {project.description}
        </p>

        {techStack.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {techStack.map((tech: string) => {
              const t = tech.toLowerCase().replace('.', '').replace(' ', '');
              let iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${t}/${t}-original.svg`;
              if (t === 'nextjs') iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg';
              if (t === 'tailwindcss') iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg';
              if (t === 'firebase') iconUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg';
              
              return (
                <div key={tech} title={tech} style={{ padding: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px' }}>
                  <img 
                    src={iconUrl} 
                    alt={tech} 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      filter: (t === 'nextjs' || t === 'github') ? 'var(--icon-filter)' : 'none' 
                    }} 
                    onError={(e) => { (e.target as any).style.display = 'none'; }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Slider Section */}
      {images.length > 0 && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ position: 'relative', width: '100%', height: 'auto', minHeight: '300px', overflow: 'hidden' }}>
            <img 
              src={images[currentImageIndex]} 
              alt={project.title} 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }} 
            />
            
            {images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button 
                  onClick={() => setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1)} 
                  style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
                >
                  <ChevronLeft size={24} />
                </button>
                
                {/* Right Arrow */}
                <button 
                  onClick={() => setCurrentImageIndex(i => i === images.length - 1 ? 0 : i + 1)} 
                  style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
                >
                  <ChevronLeft size={24} style={{ transform: 'rotate(180deg)' }} />
                </button>
                
                {/* Dots */}
                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 10, background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: '24px', backdropFilter: 'blur(4px)' }}>
                  {images.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)}
                      style={{ width: '10px', height: '10px', borderRadius: '50%', background: idx === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0 }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Long Description / Detailed Explanation */}
      {(project as any)?.longDescription && (
        <div style={{ maxWidth: '1000px', margin: '64px auto 0 auto', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '48px', backdropFilter: 'blur(12px)' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>Behind the Project</h2>
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
            {(project as any).longDescription}
          </div>
        </div>
      )}

      {fullData?.profile && (
        <div className="glass-panel animate-fade-in delay-4" style={{ marginTop: '96px', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px', maxWidth: '1000px', margin: '96px auto 0 auto' }}>
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
