import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const App = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedNewsletters, setSelectedNewsletters] = useState([]);

  const newsletters = [
    { id: 1, name: 'Daily Tech News', description: 'Latest technology updates' },
    { id: 2, name: 'Weekly Startup Digest', description: 'Entrepreneurship and business insights' },
    { id: 3, name: 'Health & Wellness', description: 'Tips for healthy living' },
    { id: 4, name: 'Finance Weekly', description: 'Investment and money management' },
    { id: 5, name: 'Design Inspiration', description: 'Creative design trends and tutorials' },
    { id: 6, name: 'Food & Recipes', description: 'Delicious recipes and cooking tips' },
  ];

  const toggleNewsletter = (newsletterId) => {
    setSelectedNewsletters(prev =>
      prev.includes(newsletterId)
        ? prev.filter(id => id !== newsletterId)
        : [...prev, newsletterId]
    );
  };

  const handleConfirm = async (e) => {
    e.preventDefault(); // prevents page reload

    if (!userName.trim() || !email.trim()) {
      alert('Please fill in both username and email fields.');
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
      const { data, error } = await supabase
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
      alert('✅ Subscription saved! Check your email tomorrow.');
      setUserName('');
      setEmail('');
      setSelectedNewsletters([]);
    } catch (err) {
      console.error('Error submitting subscription:', err);
      alert('❌ Something went wrong. Try again later.');
    }
  };

  const CheckBox = ({ isSelected, onToggle, newsletter }) => (
    <div className="checkbox-container" onClick={onToggle}>
      <div className={`checkbox ${isSelected ? 'checkbox-selected' : ''}`}>
        {isSelected && <span className="checkmark">✓</span>}
      </div>
      <div className="newsletter-info">
        <div className="newsletter-name">{newsletter.name}</div>
        <div className="newsletter-description">{newsletter.description}</div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Newsletter Subscription</h1>
        <p className="subtitle">Stay updated with our latest content</p>

        <form onSubmit={handleConfirm}>
          <div className="input-section">
            <label className="label">Username</label>
            <input
              type="text"
              className="text-input"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <label className="label">Email</label>
            <input
              type="email"
              className="text-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="newsletter-section">
            <h2 className="section-title">Select Newsletters</h2>
            {newsletters.map((newsletter) => (
              <CheckBox
                key={newsletter.id}
                newsletter={newsletter}
                isSelected={selectedNewsletters.includes(newsletter.id)}
                onToggle={() => toggleNewsletter(newsletter.id)}
              />
            ))}
          </div>

          <button type="submit" className="confirm-button">
            Confirm Subscription
          </button>
        </form>
      </div>

      <style>{`
        .container { min-height: 100vh; background-color: #f8f9fa; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
        .content { max-width: 600px; margin: 0 auto; padding: 20px; }
        .title { font-size: 2rem; font-weight: bold; color: #2c3e50; text-align: center; margin-bottom: 8px; }
        .subtitle { font-size: 1rem; color: #7f8c8d; text-align: center; margin-bottom: 30px; }
        .input-section { margin-bottom: 30px; }
        .label { display: block; font-size: 1rem; font-weight: 600; color: #34495e; margin-bottom: 8px; margin-top: 15px; }
        .text-input { width: 100%; border: 1px solid #bdc3c7; border-radius: 8px; padding: 12px; font-size: 1rem; background-color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); box-sizing: border-box; }
        .text-input:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); }
        .newsletter-section { margin-bottom: 30px; }
        .section-title { font-size: 1.25rem; font-weight: bold; color: #2c3e50; margin-bottom: 15px; }
        .checkbox-container { display: flex; align-items: flex-start; padding: 12px 16px; background-color: #fff; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); cursor: pointer; transition: background-color 0.2s; }
        .checkbox-container:hover { background-color: #f8f9fa; }
        .checkbox { width: 24px; height: 24px; border: 2px solid #bdc3c7; border-radius: 4px; margin-right: 12px; margin-top: 2px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .checkbox-selected { background-color: #3498db; border-color: #3498db; }
        .checkmark { color: #fff; font-size: 1rem; font-weight: bold; }
        .newsletter-info { flex: 1; }
        .newsletter-name { font-size: 1rem; font-weight: 600; color: #2c3e50; margin-bottom: 4px; }
        .newsletter-description { font-size: 0.875rem; color: #7f8c8d; line-height: 1.3; }
        .confirm-button { background-color: #27ae60; color: #fff; padding: 16px 24px; border: none; border-radius: 8px; font-size: 1.125rem; font-weight: bold; cursor: pointer; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: background-color 0.2s; }
        .confirm-button:hover { background-color: #229954; }
        .confirm-button:active { transform: translateY(1px); }
      `}</style>
    </div>
  );
};

export default App;
