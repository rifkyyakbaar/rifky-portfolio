"use client";

import { useEffect, useState } from 'react';
import { Award, Edit2, Plus, Check, X, Trash2 } from 'lucide-react';

type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
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
      date: new Date().getFullYear().toString()
    }]);
  };

  const removeCert = (id: string) => {
    setFormData(formData.filter(c => c.id !== id));
  };

  return (
    <main className="container section" style={{ paddingTop: '120px' }}>
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
                <div className="admin-form" style={{ flex: 1 }}>
                  <input className="input-field" value={cert.title} onChange={e => { const newF = [...formData]; newF[i].title = e.target.value; setFormData(newF); }} placeholder="Certification Title" />
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    <input className="input-field" value={cert.issuer} onChange={e => { const newF = [...formData]; newF[i].issuer = e.target.value; setFormData(newF); }} placeholder="Issuer" />
                    <input className="input-field" value={cert.date} onChange={e => { const newF = [...formData]; newF[i].date = e.target.value; setFormData(newF); }} placeholder="Date/Year" />
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {certs.map((cert, index) => (
            <div key={cert.id} className="glass-panel animate-fade-in" style={{ padding: '32px', display: 'flex', alignItems: 'flex-start', gap: '20px', animationDelay: `${index * 0.1}s` }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--glass-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={24} color="var(--primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{cert.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{cert.issuer}</p>
                <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>{cert.date}</span>
              </div>
            </div>
          ))}
          {certs.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No certifications added yet.</p>
          )}
        </div>
      )}
    </main>
  );
}
