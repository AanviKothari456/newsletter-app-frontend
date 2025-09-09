import React, { useState } from 'react';
import supabase from './supabaseClient';

const App = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedNewsletters, setSelectedNewsletters] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const newsletters = [
    { 
      id: 1, 
      name: 'Y-Combinator', 
      description: 'Keep up with the latest news, launches, jobs, and events from the YC community.',
      color: '#FF6B35',
      textColor: '#FFFFFF',
      icon: 'Y'
    },
    { 
      id: 2, 
      name: 'TechCrunch', 
      description: 'Global newspaper focusing on breaking news about tech, startups, and venture capital',
      color: '#00D35B',
      textColor: '#FFFFFF',
      icon: 'TC'
    },
    { 
      id: 3, 
      name: 'Ben @ next-play', 
      description: 'Helping world-class talent discover what\'s next through next-play',
      color: '#E8DDD4',
      textColor: '#2C3E50',
      icon: '👨‍💼',
      isImage: true
    },
    { 
      id: 4, 
      name: 'MorningBrew', 
      description: 'Morning Brew delivers quick and insightful updates about the business world every day',
      color: '#4A90E2',
      textColor: '#FFFFFF',
      icon: '☕'
    }
  ];

  const toggleNewsletter = (newsletterId) => {
    setSelectedNewsletters(prev =>
      prev.includes(newsletterId)
        ? prev.filter(id => id !== newsletterId)
        : [...prev, newsletterId]
    );
  };

  const handleSubmit = async () => {
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

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Confirmed 🎉</h1>
          <p className="text-gray-600 mb-8">
            Check your email tomorrow for your first digest.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-5xl font-bold text-black mb-2">NewsKiller</h1>
        <p className="text-gray-600 text-lg">Turn up to 20 NewsLetters into 1</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mb-12">
        <div className="flex space-x-8">
          <button className="text-black font-medium border-b-2 border-black pb-1">Tech</button>
          <button className="text-gray-500 font-medium hover:text-black transition-colors">Wellness</button>
          <button className="text-gray-500 font-medium hover:text-black transition-colors">Berkeley</button>
        </div>
      </div>

      {/* Newsletter Cards */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsletters.map((newsletter) => (
            <div
              key={newsletter.id}
              onClick={() => toggleNewsletter(newsletter.id)}
              className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 ${
                selectedNewsletters.includes(newsletter.id) 
                  ? 'ring-4 ring-blue-500 scale-105' 
                  : 'hover:scale-102'
              }`}
            >
              <div 
                className="h-48 flex items-center justify-center relative"
                style={{ backgroundColor: newsletter.color }}
              >
                <div className="text-center">
                  {newsletter.isImage ? (
                    <div className="text-6xl mb-2">{newsletter.icon}</div>
                  ) : (
                    <div 
                      className="text-6xl font-bold mb-2"
                      style={{ color: newsletter.textColor }}
                    >
                      {newsletter.icon}
                    </div>
                  )}
                </div>
                {selectedNewsletters.includes(newsletter.id) && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="bg-white p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{newsletter.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{newsletter.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 pb-12">
        <div className="space-x-4 flex flex-row justify-center items-center">
          <input
            type="text"
            placeholder="name:"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="email"
            placeholder="email:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;