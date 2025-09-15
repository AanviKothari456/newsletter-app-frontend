import React, { useState } from 'react';
import supabase from './supabaseClient';

const App = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedNewsletters, setSelectedNewsletters] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const images = {
    ycombinator: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/1200px-Y_Combinator_logo.svg.png',
    techcrunch: 'https://yt3.googleusercontent.com/ytc/AIdro_kCWnlG0S5KmFxBckuWUwXOaIsmZL7hBkuXa4CFY27vtk_y=s900-c-k-c0x00ffffff-no-rj',
    benatnextplay: 'https://media.licdn.com/dms/image/v2/D4D03AQG-j5fMe__BXA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719428900642?e=2147483647&v=beta&t=4qW0QM9AZzkfhHR3Yj8gYJkqjno2uSlNZ9_f_1x91UU',
    jamesclear: 'https://assets.penguinrandomhouse.com/wp-content/uploads/2019/05/18130129/PRH-James-Clear-Interview-Article-Header-1080x1080-1.png',
    hankandjohn: 'https://hankandjohn.com/wp-content/uploads/2021/10/Copyofhankandjohn.jpg',
    timferriss: 'https://yt3.googleusercontent.com/g0hMq-enawYpZxujT3GcjHHLos3QXgUpwfOS20eCDVmCPUpLbtSkgu1VEjq_YiCU5bpZCT6_ID8=s900-c-k-c0x00ffffff-no-rj',
    artandscienceofhappiness: 'https://criticspace.com/wp-content/uploads/2023/06/gajagsh.jpg',
    builtbyberkeley: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/c1a5df9a-4394-470d-bafe-9d2f0ede52ec/Original.png',
    scet: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSdjVt_cD482DB4pqxn1A2ZIPmZAOcPOv8Aw&s',
    need2know: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/publication/logo/b22e8cf2-0545-4bd2-903d-7c8cd0d69368/Need2Know_Logo_Pink_UPDATED.png',
    axiosprorata: 'https://megaphone.imgix.net/podcasts/d4edce68-0ed5-11e9-ae30-47e879b95561/image/53aa1a75b60e36e8a5daaa6f9fde44382b12e7d7db1ee809e53544ddb1cc2126a09b70662657dfa250798d6ffc0f75f332b7bc6e0a6d1fa3009a965dbab2920f.jpeg?ixlib=rails-4.3.1&w=400&h=400',
    motleyfool: 'https://www.nasdaq.com/sites/acquia.prod/files/2022/01/11/Untitled-1.jpg',
    morningbrew: 'https://yt3.googleusercontent.com/OyiAettVs75KkSwtJiEGG8AxJu4XZhP0YTz8w723i9gGWHssDhO-e6hpyqnEhr1nEWbc8OGJ1w=s900-c-k-c0x00ffffff-no-rj',
    crawlsf: 'https://i0.wp.com/www.july4sf.com/wp-content/uploads/2024/02/St-Patricks-Day-Tickets-Pub-Crawl.jpeg?resize=394%2C394&ssl=1'
  }
  const newsletters = [
    // Tech
    { id: 1, name: 'Y-Combinator', description: 'Keep up with the latest news, launches, jobs, and events from the YC community.', color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.ycombinator, category: 'Tech' },
    { id: 2, name: 'TechCrunch', description: 'Global newspaper focusing on breaking news about tech, startups, and venture capital', color: '#28A745', textColor: '#FFFFFF', isImage: true, icon: images.techcrunch, category: 'Tech' },
    { id: 3, name: 'Ben @ next-play', description: 'Helping world-class talent discover what\'s next through next-play', color: '#F0E5D8', textColor: '#2C3E50', icon: '👨‍💼', isImage: true, icon: images.benatnextplay, category: 'Tech' },
    
    // Wellness
    { id: 6, name: 'James Clear', description: '3-2-1 newsletter by the author of Atomic Habits', isImage: true, icon: images.jamesclear, color: '#e7e8c9ff', textColor: '#000000ff', category: 'Wellness' },
    { id: 7, name: "We're Here, Hank and John", description: 'Fun and thoughtful commentary on culture and news', isImage: true, icon: images.hankandjohn, color: '#5B6BF2', textColor: '#FFFFFF', category: 'Wellness' },
    { id: 8, name: 'Tim Ferriss', description: 'Productivity, lifestyle, and personal growth insights', isImage: true, icon: images.timferriss, color: '#9B59B6', textColor: '#FFFFFF', category: 'Wellness' },
    { id: 9, name: 'The Art and Science of Happiness', description: 'Insights on mental health and well-being', isImage: true, icon: images.artandscienceofhappiness,color: '#1ABC9C', textColor: '#FFFFFF', category: 'Wellness' },
    { id: 10, name: 'Now I Know', description: 'Interesting facts and trivia', isImage: true, icon: images.nowiknow, color: '#F39C12', textColor: '#000000', category: 'Wellness' },

    // Berkeley
    { id: 11, name: 'Built by Berkeley', description: 'Updates and news from the Berkeley community', isImage: true, icon: images.builtbyberkeley,color: '#306998', textColor: '#FFFFFF', category: 'Berkeley' },
    { id: 12, name: 'SCET', description: 'Updates and news from the Berkeley community', isImage: true, icon: images.scet,color: '#306998', textColor: '#FFFFFF', category: 'Berkeley' },

    //Finance
    { id: 5, name: 'Need2Know, by Cheddar', description: 'Daily news and insights curated for you', isImage: true, icon: images.need2know,color: '#F7C548', textColor: '#000000', category: 'Finance' },
    { id: 13, name: 'Axios Pro Rata', description: 'Daily finance insights and market news', isImage: true, icon: images.axiosprorata,color: '#baf693ff', textColor: '#000000', category: 'Finance' },
    { id: 14, name: 'Motley Fool', description: 'Investment tips and financial news', isImage: true, icon: images.motleyfool,color: '#807ee5ff', textColor: '#FFFFFF', category: 'Finance' },
    { id: 4, name: 'MorningBrew', description: 'Morning Brew delivers quick and insightful updates about the business world every day', isImage: true, icon: images.morningbrew,color: '#3498DB', textColor: '#FFFFFF', category: 'Finance' },
    { id: 15, name: 'CrawlSF', description: 'Keep up with the latest news, launches, jobs, and events from the YC community.', color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.crawlsf, category: 'SF Life' },
  ];

  const categories = ['Tech', 'SF Life', 'Wellness', 'Berkeley', 'Finance'];

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
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-slate-200 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-8 shadow-xl">
              ✓
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            You're All Set! 🎉
          </h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Your personalized digest will arrive in your inbox tomorrow morning.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="group relative bg-gradient-to-r from-slate-900 to-slate-700 text-white px-10 py-4 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="relative z-10">Start Over</span>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  const renderNewsletterCard = (newsletter) => {
    const isSelected = selectedNewsletters.includes(newsletter.id);

    return (
      <div
        key={newsletter.id}
        onClick={() => toggleNewsletter(newsletter.id)}
        className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 bg-white flex-shrink-0 w-80
          ${isSelected
            ? 'ring-4 ring-blue-500 shadow-2xl transform scale-105'
            : 'hover:shadow-xl hover:transform hover:scale-105 shadow-lg'
          }
        `}
        >
        {/* Background glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 rounded-2xl -z-10 blur-xl
          ${isSelected ? 'opacity-30' : 'group-hover:opacity-20'}
        `} style={{ backgroundColor: newsletter.color }}></div>

        {/* Icon area with improved gradients */}
        <div
          className="h-52 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: newsletter.color }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10"></div>
          <div className="text-center relative z-10">
              <img src={newsletter.icon} />
          </div>

          {/* Selected indicator with animation */}
          {isSelected && (
            <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Card content with improved typography */}
        <div className="bg-white p-6">
          <h3 className="font-bold text-xl text-slate-900 mb-3 leading-tight">{newsletter.name}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{newsletter.description}</p>
        </div>

        {/* Hover overlay */}
        {!isSelected && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-slate-100">
      {/* Header */}
      <div className="relative text-center pt-6 pb-6">
        <div className="absolute inset-0"></div>
        <div className="relative z-10">
          <h1 className="text-7xl font-gideon md:text-8xl font-black mb-1 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
            NewsKiller
          </h1>
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-2xl font-medium text-slate-700 mb-3">Turn 20 newsletters into 1.</p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Click your favorites and get a beautiful digest delivered to your inbox every morning.
            </p>
          </div>
        </div>
         
      </div>

      {/* User Info Form */}
      <div className="max-w-2xl mx-auto px-6 pb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-center px-4 py-3 bg-slate-50 rounded-lg text-slate-900 placeholder-slate-500 border-2 border-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm text-sm"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </div>

            <div className="relative group">
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 text-center py-3 bg-slate-50 rounded-lg text-slate-900 placeholder-slate-500 border-2 border-transparent focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm text-sm"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </div>

            <button
              onClick={handleSubmit}
              className="group bg-gradient-to-r from-blue-500 to-purple-500 relative text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            >
              <span className="relative z-10">submit</span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-600 rounded-lg opacity-0  transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Categories with Horizontal Scrolling */}
      <div className="pb-20">
        {categories.map((category) => {
          const categoryNewsletters = newsletters.filter(n => n.category === category);
          const needsScroll = categoryNewsletters.length > 3;
          
          return (
            <div key={category} className="mb-12">
              {/* Category Header - Centered */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-gideon font-bold mb-2">{category}</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
              </div>

              {/* Scrolling Container */}
              <div className="relative">
                {/* Fade edges - only show if content overflows */}
                {needsScroll && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
                  </>
                )}
                
                {/* Cards container */}
                <div className={`overflow-x-auto scrollbar-hide ${!needsScroll ? 'flex justify-center' : ''}`}>
                  <div 
                    className={`flex space-x-8 pb-4 ${needsScroll ? 'pl-12' : 'px-6'}`}
                    style={{ 
                      width: needsScroll ? 'max-content' : 'auto'
                    }}
                  >
                    {categoryNewsletters.map(renderNewsletterCard)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected counter */}
      {selectedNewsletters.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl backdrop-blur-sm">
            <span className="font-semibold">
              {selectedNewsletters.length} newsletter{selectedNewsletters.length === 1 ? '' : 's'} selected
            </span>
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;