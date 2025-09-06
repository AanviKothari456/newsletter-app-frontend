import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const App = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedNewsletters, setSelectedNewsletters] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const newsletters = [
  { id: 1, name: 'Need2Know, by Cheddar', description: 'Daily news simplified, straight facts' },
  { id: 2, name: 'The Hustle', description: 'Sharp business news with humor' },
  { id: 3, name: 'We’re Here, Hank and John', description: 'Personal stories, humor, thoughtful insights' },
  { id: 4, name: 'Tim Ferriss', description: 'Tools, tactics, productivity, personal growth' },
  { id: 5, name: 'The Art and Science of Happiness', description: 'Psychology, wellbeing, happiness made practical' },
  { id: 6, name: 'Now I Know', description: 'Surprising facts explained, daily stories' },
  { id: 7, name: 'Morning Brew', description: 'Business, markets, tech in minutes' },
  { id: 8, name: 'Total Anarchy', description: 'Marketing tips, writing, creativity unleashed' },
  { id: 9, name: 'Vox Sentences', description: 'Top stories summarized in context' },
  { id: 10, name: 'Sahil Bloom’s Curiosity Chronicle', description: 'Ideas, frameworks, curiosities made simple' },
];


  const toggleNewsletter = (newsletterId) => {
    setSelectedNewsletters(prev =>
      prev.includes(newsletterId)
        ? prev.filter(id => id !== newsletterId)
        : [...prev, newsletterId]
    );
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!userName.trim() || !email.trim()) {
      alert('Please fill in both name and email fields.');
      return;
    }
    if (selectedNewsletters.length === 0) {
      alert('Please select at least one newsletter.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .upsert([
          {
            name: userName,
            email,
            newsletters: selectedNewsletters.map(
              id => newsletters.find(n => n.id === id).name
            )
          }
        ], { onConflict: ['email'] });

      if (error) throw error;
      setConfirmed(true);
    } catch (err) {
      console.error('Error submitting subscription:', err);
      alert('❌ Something went wrong. Try again later.');
    }
  };

  const CheckBox = ({ isSelected, onToggle, newsletter }) => (
    <div
      className={`checkbox-pill ${isSelected ? 'selected' : ''}`}
      onClick={onToggle}
    >
      <div className="pill-title">{newsletter.name}</div>
      <div className="pill-desc">{newsletter.description}</div>
    </div>
  );

  if (confirmed) {
    return (
      <div className="page">
        <div className="card">
          <div className="checkmark-circle">✓</div>
          <h1 className="main-title">You're Confirmed 🎉</h1>
          <p className="card-subtitle">
            Check your email tomorrow for your first digest.
          </p>
          <button className="primary-button" onClick={() => window.location.reload()}>
            Back to Home
          </button>
        </div>
        <style>{pageStyles}</style>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="main-title">Subscribe to Newsletters</h1>
        <p className="main-subtitle">Stay updated with fresh content every week</p>

        <form onSubmit={handleConfirm}>
          <input
            type="text"
            className="input"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="email"
            className="input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

      <div className="pill-section">
  <h2 className="main-subtitle">
    Select all the newsletters you want a digest of:
  </h2>

  <div className="card-grid">
    {newsletters.map((n) => (
      <div
        key={n.id}
        className={`newsletter-card ${selectedNewsletters.includes(n.id) ? 'selected' : ''}`}
        onClick={() => toggleNewsletter(n.id)}
      >
        <h3 className="card-title">{n.name}</h3>
        <p className="card-desc">{n.description}</p>
      </div>
    ))}
  </div>
</div>




          <button type="submit" className="primary-button">
            Confirm Subscription
          </button>
        </form>
      </div>
      <style>{pageStyles}</style>
    </div>
  );
};

const pageStyles = `
  .page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #000000ff, #000000ff);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    padding: 20px;
  }
.card {
  max-width: 900px;    /* much wider for desktops */
  width: 100%;
  padding: 40px;
  border-radius: 16px;
  text-align: left;    /* optional: left-align form content */
}
.main-title {
  font-size: 2.2rem;              /* bigger */
  font-weight: 700;                /* bolder */
  font-family: 'Poppins', sans-serif; /* fun, modern font */
  color: #ffffffff;                  /* vibrant green */
  margin-bottom: 16px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.2); /* subtle depth */
  letter-spacing: 1px;             /* adds some style */
}

  .main-subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 25px;
}


  .card-title {
    font-size: 1.8rem;
    font-weight: 400;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  .card-subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 25px;
}
  .input {
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 16px;
    border: 1px solid #ccd1d9;
    border-radius: 10px;
    font-size: 1rem;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52,152,219,0.15);
  }
  .pill-section {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .checkbox-pill {
    border: 1px solid #ccd1d9;
    border-radius: 10px;
    padding: 12px 16px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }
  .checkbox-pill:hover {
    background: #f8f9fa;
  }
  .checkbox-pill.selected {
    background: #3498db;
    border-color: #3498db;
    color: #fff;
  }
  .pill-title {
    font-size: 1rem;
    font-weight: 400;
  }
  .pill-desc {
    font-size: 0.85rem;
    opacity: 0.85;
  }
  .primary-button {
    background: #27ae60;
    color: #fff;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s, transform 0.1s;
  }
  .primary-button:hover {
    background: #219150;
  }
  .primary-button:active {
    transform: scale(0.98);
  }
  .checkmark-circle {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: #27ae60;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin: 0 auto 20px auto;
    box-shadow: 0 4px 10px rgba(39, 174, 96, 0.4);
    animation: pop 0.4s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

export default App;
