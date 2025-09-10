import React, { useState } from 'react';
import supabase from './supabaseClient';

const App = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedNewsletters, setSelectedNewsletters] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const newsletters = [
    // Tech
    { id: 1, name: 'Y-Combinator', description: 'Keep up with the latest news, launches, jobs, and events from the YC community.', color: '#fc703dff', textColor: '#ffffffff', icon: 'Y', category: 'Tech' },
    { id: 2, name: 'TechCrunch', description: 'Global newspaper focusing on breaking news about tech, startups, and venture capital', color: '#28A745', textColor: '#FFFFFF', icon: 'TC', category: 'Tech' },
    { id: 3, name: 'Ben @ next-play', description: 'Helping world-class talent discover what\'s next through next-play', color: '#F0E5D8', textColor: '#2C3E50', icon: '👨‍💼', isImage: true, category: 'Tech' },
    { id: 4, name: 'MorningBrew', description: 'Morning Brew delivers quick and insightful updates about the business world every day', color: '#3498DB', textColor: '#FFFFFF', icon: '☕', category: 'Tech' },

    // Wellness
    { id: 5, name: 'Need2Know, by Cheddar', description: 'Daily news and insights curated for you', color: '#F7C548', textColor: '#000000', icon: '📰', category: 'Wellness' },
    { id: 6, name: 'James Clear', description: '3-2-1 newsletter by the author of Atomic Habits', color: '#e7e8c9ff', textColor: '#000000ff', icon: 'JC', category: 'Wellness' },
    { id: 7, name: 'We’re Here, Hank and John', description: 'Fun and thoughtful commentary on culture and news', color: '#5B6BF2', textColor: '#FFFFFF', icon: '📈', category: 'Wellness' },
    { id: 8, name: 'Tim Ferriss', description: 'Productivity, lifestyle, and personal growth insights', color: '#9B59B6', textColor: '#FFFFFF', icon: 'TF', category: 'Wellness' },
    { id: 9, name: 'The Art and Science of Happiness', description: 'Insights on mental health and well-being', color: '#1ABC9C', textColor: '#FFFFFF', icon: '🌱', category: 'Wellness' },
    { id: 10, name: 'Now I Know', description: 'Interesting facts and trivia', color: '#F39C12', textColor: '#000000', icon: '💡', category: 'Wellness' },

    // Berkeley
    { id: 11, name: 'Built by Berkeley', description: 'Updates and news from the Berkeley community', color: '#306998', textColor: '#FFFFFF', icon: '🏫', category: 'Berkeley' },
    
    //Finance
    { id: 12, name: 'Morning Money', description: 'Daily finance insights and market news', color: '#baf693ff', textColor: '#000000', icon: '💰', category: 'Finance' },
    { id: 13, name: 'Investopedia Daily', description: 'Investment tips and financial news', color: '#807ee5ff', textColor: '#FFFFFF', icon: '📈', category: 'Finance' },

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

  // Filter newsletters by active category
  const filteredNewsletters = activeCategory === 'All'
    ? newsletters
    : newsletters.filter(n => n.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-5xl font-bold text-black mb-2">NewsKiller</h1>
        <p className="text-gray-600 text-lg">Turn up to 20 Newsletters into 1</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mb-12">
        <div className="flex space-x-8">
          {['All', 'Tech', 'Wellness', 'Berkeley', 'Finance'].map(cat => (
            <button
              key={cat}
              className={`font-medium pb-1 transition-colors ${activeCategory === cat
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-black'
                }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter Cards */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNewsletters.map((newsletter) => (
            <div
              key={newsletter.id}
              onClick={() => toggleNewsletter(newsletter.id)}
              className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 ${selectedNewsletters.includes(newsletter.id)
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
        <div className="space-x-4 flex flex-col md:flex-row justify-center items-center gap-4">
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
