"use client";

import { useEffect, useState } from 'react';
import { Award, Edit2, Plus, Check, X, Trash2 } from 'lucide-react';

import Footer from '@/components/Footer';

type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image?: string;
};

export default function Certifications() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [fullData, setFullData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Certification[]>([]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(d => {
        setFullData(d);
        setCerts(d.certifications || []);
      });
    
    setIsAdmin(localStorage.getItem('adminMode') === 'true');
  }, []);

  const startEdit = () => {
    setIsEditing(true);
    setFormData(JSON.parse(JSON.stringify(certs)));
  };

  const handleSave = async () => {
    const newData = { ...fullData, certifications: formData };
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
    setFullData(newData);
    setCerts(formData);
    setIsEditing(false);
  };

  const addCert = () => {
    setFormData([...formData, {
      id: Date.now().toString(),
      title: 'New Certification',
      issuer: 'Issuing Organization',
      date: new Date().getFullYear().toString(),
      image: ''
    }]);
  };

  const removeCert = (id: string) => {
    setFormData(formData.filter(c => c.id !== id));
  };

  return (
    <main>
      <div className="container section" style={{ paddingTop: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <h1 className="section-title text-gradient" style={{ marginBottom: 0 }}>Certifications</h1>
        {isAdmin && !isEditing && (
          <button className="btn btn-outline" onClick={startEdit}>
            <Edit2 size={16} /> Edit Certifications
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formData.map((cert, i) => (
              <div key={cert.id} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', position: 'relative', display: 'flex', gap: '16px' }}>
                <div className="admin-form" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input className="input-field" value={cert.title} onChange={e => { const newF = [...formData]; newF[i].title = e.target.value; setFormData(newF); }} placeholder="Certification Title" />
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input className="input-field" value={cert.issuer} onChange={e => { const newF = [...formData]; newF[i].issuer = e.target.value; setFormData(newF); }} placeholder="Issuer" />
                    <input className="input-field" value={cert.date} onChange={e => { const newF = [...formData]; newF[i].date = e.target.value; setFormData(newF); }} placeholder="Date/Year" />
                  </div>
                  <div style={{ position: 'relative', height: '100px', border: '1px dashed var(--glass-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {cert.image ? (
                      <img src={cert.image} alt="Cert" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload Certificate Image</span>
                    )}
                    <input type="file" accept="image/*" onChange={e => {
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
                <button 
                  className="btn btn-outline" 
                  style={{ height: 'fit-content', padding: '12px', color: 'var(--accent)' }}
                  onClick={() => removeCert(cert.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <button className="btn btn-outline" onClick={addCert}><Plus size={16} /> Add Certification</button>
            <div style={{ flex: 1 }}></div>
            <button className="btn btn-primary" onClick={handleSave}><Check size={16} /> Save Changes</button>
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
          {certs.map((cert, index) => (
            <div key={cert.id} className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '32px', animationDelay: `${index * 0.1}s`, borderRadius: '24px' }}>
              <div style={{ flex: '1 1 300px', borderRadius: '16px', overflow: 'hidden', background: 'var(--glass-highlight)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cert.image ? (
                  <img src={cert.image} alt={cert.title} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '100%', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={48} color="var(--glass-border)" />
                  </div>
                )}
              </div>
              <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Award size={24} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{cert.title}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '8px', lineHeight: 1.6 }}>{cert.issuer}</p>
                <span style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '100px', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, width: 'fit-content', marginTop: '12px' }}>{cert.date}</span>
              </div>
            </div>
          ))}
          {certs.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No certifications added yet.</p>
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
