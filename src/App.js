import React, { useState } from 'react';
import supabase from './supabaseClient';
import { useTypewriter } from 'react-simple-typewriter';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'beta', 'newsletters', 'confirmed'
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedNewsletters, setSelectedNewsletters] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [preference, setPreference] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Waitlist + Beta access state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [betaCode, setBetaCode] = useState('');

  const images = {
    ycombinator: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/1200px-Y_Combinator_logo.svg.png',
    techcrunch: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScyrWdQdXdEbLIAZIPlZKzOHcrr5MGh907eQ&s',
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
    crawlsf: 'https://i0.wp.com/www.july4sf.com/wp-content/uploads/2024/02/St-Patricks-Day-Tickets-Pub-Crawl.jpeg?resize=394%2C394&ssl=1',
    eddies_list: 'https://substack-post-media.s3.amazonaws.com/public/images/1a3f96bf-3461-40ea-be77-14a03f5742e1_795x795.png',
    the_athletic: 'https://wp.theringer.com/wp-content/uploads/2022/01/NYT_Athletic_Ringer_v2.jpg',
    the_daily_stoic: 'https://i.scdn.co/image/ab6765630000ba8a8488dbb4b623f432a3b6a673',
    nyt: 'https://play-lh.googleusercontent.com/gfmioo4VBEtPucdVNIYAyaqruXFRWDCc0nsBLORfOS0_s9r5r00Bn_IpjhCumkEusg',
    the_contrarian: 'https://substackcdn.com/image/fetch/$s_!2bFp!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff036e142-cadf-4898-8289-f16bb428f7bb_1000x1000.png',
    tldr: 'https://pbs.twimg.com/profile_images/1069810843951411200/pNNOq5nL_400x400.jpg',
    al_jazeera: 'https://yt3.googleusercontent.com/TEkAt4v2DTqLiU_0pmLza5ZZndnaUXOjVuAFthuaGvwGyCYpO4H85KXOBxdMzrJ8cZu2DoECRA=s900-c-k-c0x00ffffff-no-rj',
    sahil_bloom: 'https://i.scdn.co/image/ab67656300005f1fe66c722d6c52b37b5000c73f',
    the_hustle: 'https://20627419.fs1.hubspotusercontent-na1.net/hubfs/20627419/The%20Hustle/Logos/The%20Hustle%20Logo.png',
    nowiknow: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/NowIKnow.png/250px-NowIKnow.png',
  }
  const newsletters = [
    { id: 1, name: 'Y-Combinator', description: 'Keep up with the latest news, launches, jobs, and events from the YC community.', color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.ycombinator, category: 'Tech' },
    { id: 2, name: 'TechCrunch', description: 'Global newspaper focusing on breaking news about tech, startups, and venture capital.', color: '#28A745', textColor: '#FFFFFF', isImage: true, icon: images.techcrunch, category: 'Tech' },
    { id: 3, name: 'Ben @ Next-play', description: 'Helping world-class talent discover what\'s next through next-play.', color: '#F0E5D8', textColor: '#2C3E50', isImage: true, icon: images.benatnextplay, category: 'Tech' },
    { id: 6, name: 'James Clear, Atomic Habits', description: '3-2-1 newsletter by the author of Atomic Habits.', isImage: true, icon: images.jamesclear, color: '#e7e8c9ff', textColor: '#000000ff', category: 'Wellness' },
    { id: 7, name: "We're Here, Hank and John", description: 'Fun and thoughtful commentary on culture and news.', isImage: true, icon: images.hankandjohn, color: '#5B6BF2', textColor: '#FFFFFF', category: 'Wellness' },
    { id: 8, name: 'Tim Ferriss', description: 'Productivity, lifestyle, and personal growth insights.', isImage: true, icon: images.timferriss, color: '#9B59B6', textColor: '#FFFFFF', category: 'Wellness' },
    { id: 9, name: 'The Art and Science of Happiness', description: 'Insights on mental health and well-being.', isImage: true, icon: images.artandscienceofhappiness,color: '#1ABC9C', textColor: '#FFFFFF', category: 'Wellness' },
    { id: 10, name: 'Now I Know', description: 'Interesting facts and trivia.', isImage: true, icon: images.nowiknow, color: '#F39C12', textColor: '#000000', category: 'Wellness' },
    { id: 11, name: 'Built by Berkeley', description: 'Updates and news from the Berkeley community.', isImage: true, icon: images.builtbyberkeley,color: '#306998', textColor: '#FFFFFF', category: 'Berkeley' },
    { id: 12, name: 'SCET', description: 'Updates and news from the Berkeley community.', isImage: true, icon: images.scet,color: '#306998', textColor: '#FFFFFF', category: 'Berkeley' },
    { id: 5, name: 'Need2Know, by Cheddar', description: 'Daily news and insights curated for you.', isImage: true, icon: images.need2know,color: '#F7C548', textColor: '#000000', category: 'Finance' },
    { id: 13, name: 'Axios Pro Rata', description: 'Daily finance insights and market news.', isImage: true, icon: images.axiosprorata,color: '#baf693ff', textColor: '#000000', category: 'Finance' },
    { id: 14, name: 'Motley Fool', description: 'Investment tips and financial news.', isImage: true, icon: images.motleyfool,color: '#807ee5ff', textColor: '#FFFFFF', category: 'Finance' },
    { id: 4, name: 'Morning Brew', description: 'Morning Brew delivers quick and insightful updates about the business world every day.', isImage: true, icon: images.morningbrew,color: '#3498DB', textColor: '#FFFFFF', category: 'Finance' },
    { id: 15, name: 'SF Crawl', description: 'Discover the best things to do in San Francisco.', color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.crawlsf, category: 'SF Life' },
    { id: 16, name: "Eddie's List", description: 'SF Local guide with weekly takes on things to do.', color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.eddies_list, category: 'SF Life' },
    { id: 17, name: "The Athletic", description: 'Unrivaled sports coverage across every team you care about and every league you follow. Get breaking news, powerful stories and smart analysis from the best.', color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.the_athletic, category: 'Sports' },
    { id: 18, name: "The Daily Stoic", description: "Showcasing the philosophy designed to make us more resilient, happier, more virtuous and more wise.", color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.the_daily_stoic, category: 'Wellness' },
    { id: 19, name: "The Contrarian", description: "Unflinching journalism in defense of democracy.", color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.the_contrarian, category: 'World News' },
    { id: 20, name: "New York Times", description: "The highly respected, global news publication known for its investigative journalism and coverage of world events.", color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.nyt, category: 'World News' },
    { id: 21, name: "TLDR", description: "The most interesting stories in startups, tech and programming!", color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.tldr, category: 'Tech' },
    { id: 22, name: "Al Jazeera", description: "News, analysis from the Middle East & worldwide.", color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.al_jazeera, category: 'World News'},
    { id: 23, name: "Sahil Bloom", description: "Actionable ideas to help you build a high-performing, healthy, wealthy life.", color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.sahil_bloom, category: 'Wellness'},
    { id: 24, name: "The Hustle", description: "Keeping 2M+ innovators in the loop with stories on business, tech, and the internet.", color: '#fc703dff', textColor: '#ffffffff', isImage: true, icon: images.the_hustle, category: 'Tech'},
  ];

  const [text] = useTypewriter({
    words: ["NewsKiller"],
    typeSpeed: 53,
    loop: 2,
  });
  const [youreSet] = useTypewriter({
    words: ["You're all Set!"],
    typeSpeed: 53,
    loop: 3,
  });

  const [categoriesText] = useTypewriter({
    words: ["Categories"],
    typeSpeed: 53, 
    loop: 3,
  });

  const [submitText] = useTypewriter({
    words: ["Submit"],
    typeSpeed: 53,
    loop: 333
  });

  const categories = ['All', 'Tech', 'Sports', 'World News', 'SF Life', 'Wellness', 'Berkeley', 'Finance'];

  const goToNewsletters = () => {
    setCurrentPage('newsletters');
  };

  const goToBeta = () => {
    setCurrentPage('beta');
  };

  const goBackToLanding = () => {
    setCurrentPage('landing');
  };

  const goBackToBeta = () => {
    setCurrentPage('beta');
  };

  const toggleNewsletter = (newsletterId) => {
    setSelectedNewsletters(prev =>
      prev.includes(newsletterId)
        ? prev.filter(id => id !== newsletterId)
        : [...prev, newsletterId]
    );
  };
  const TextTyping = (text) => {
    const [typedText] = useTypewriter({
      words: [text],
      typeSpeed: 53,
      loop: 3,
    });
    return typedText;
  }

  // Main submit handler for newsletter selection
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
        .from('main_emails')
        .upsert([
          {
            name: userName,
            email: email,
            newsletters: selectedNewsletters.map(
              id => newsletters.find(n => n.id === id).name
            ),
            profile: "Short and informative; focus on being objective",
          }
        ], { onConflict: ['email'] });

      if (error) throw error;
      setConfirmed(true);
    } catch (err) {
      console.error('Error submitting subscription:', err);
      alert('❌ Something went wrong. Try again later.');
    }
  };

  // Join waitlist handler
  const handleJoinWaitlist = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!waitlistEmail.trim() || !emailRegex.test(waitlistEmail)) {
      alert('Please enter a valid email to join the waitlist.');
      return;
    }
    try {
      const { error } = await supabase
        .from('waitlist_db')
        .upsert([
          { email: waitlistEmail }
        ], { onConflict: ['email'] });
      if (error) throw error;
      alert('🎉 Added to the waitlist!');
      setWaitlistEmail('');
    } catch (err) {
      console.error('Waitlist insert error:', err);
      alert('❌ Could not join the waitlist. Please try again later.');
    }
  };

  // Beta access handler
  const handleBetaAccess = () => {
    if (betaCode.trim().toLowerCase() === 'newskiller-beta') {
      setCurrentPage('newsletters');
    } else {
      alert('Incorrect beta code.');
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
            {youreSet}
          </h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Your personalized digest will arrive in your inbox tomorrow morning.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="group relative bg-gradient-to-r from-slate-900 to-slate-700 hover:from- text-white px-10 py-4 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="relative z-10">Start Over</span>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-600 hover:from-blue-600 hover:to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  // Preference submit handler for confirmed page
  const handlePreferenceSubmit = async () => {
    if (!preference.trim()) {
      alert('Please select or enter a preference.');
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({ user_profile: preference })
        .eq("email", email);

      if (error) {
        console.error("Supabase update error:", error.message);
        alert('❌ Something went wrong saving your preference.');
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error updating preference:', err);
      alert('❌ Something went wrong. Try again later.');
    }
  };

  if (currentPage === 'confirmed') {
    const options = [
      "Short and sweet; focus on AI",
      "Pure facts and minimal commentary",
      "Highlight startups that just raised and might be hiring"
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-slate-200 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-500  rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-500  rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-8 shadow-xl">
              ✓
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            You're All Set! 🎉
          </h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Your personalized digest will arrive in your inbox tomorrow morning.
          </p>

          {/* Optional preference form */}
          {!submitted ? (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-slate-700">
                Want to customize the tone of your summaries?
              </h2>
              <div className="grid gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPreference(opt)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      preference === opt
                        ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
                        : "bg-white text-slate-700 border-slate-300 hover:border-purple-500"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Or describe your style..."
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                className="w-full mt-2 p-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                rows={3}
              />
              <button
                onClick={handlePreferenceSubmit}
                className="w-full mt-4 bg-gradient-to-r from-gray-300 to-gray-500  text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition"
              >
                Save Preference
              </button>
            </div>
          ) : (
            <p className="text-emerald-600 font-medium mb-8">
              ✅ Saved your preference!
            </p>
          )}

          <button
            onClick={() => setCurrentPage('landing')}
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
        className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 bg-white min-w-0
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
          className="h-40 sm:h-48 md:h-52 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: newsletter.color }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10"></div>
          <div className="text-center relative z-10">
            {newsletter.isImage && newsletter.icon ? (
              <img 
                src={newsletter.icon} 
                alt={newsletter.name}
                className="w-25 h-[10rem] sm:w-20 sm:h-20 md:h-40 md:w-40 object-contain rounded-lg max-w-full shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <div className="text-6xl">{newsletter.icon || '📰'}</div>
            )}
            {/* Fallback emoji for broken images */}
            <div className="text-6xl hidden">📰</div>
          </div>
        </div>

        {/* Card content with improved typography */}
        <div className="bg-white p-6">
          <h3 className="font-bold text-xl text-slate-900 mb-3 leading-tight break-words line-clamp-2">{newsletter.name}</h3>
          <p className="text-slate-600 text-sm leading-relaxed break-words line-clamp-3">{newsletter.description}</p>
        </div>

        {/* Hover overlay */}
        {!isSelected && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
        )}
      </div>
    );
  };

  // Get filtered newsletters based on active category
  const getFilteredNewsletters = () => {
    if (activeCategory === 'All') {
      return newsletters;
    }
    return newsletters.filter(n => n.category === activeCategory);
  };

  // Beta Access Page
  if (currentPage === 'beta') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-slate-100 flex flex-col justify-center items-center relative overflow-hidden px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Back button */}
        <button
          onClick={goBackToLanding}
          className="absolute top-6 left-6 flex items-center text-slate-600 hover:text-slate-900 transition-colors group z-10"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l7-7m-7 7l7 7" />
          </svg>
          Back
        </button>

        {/* Main content */}
        <div className="text-center z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight leading-tight">
            Beta Access
          </h1>
          
          <div className="space-y-6 mb-12">
            <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed">
              Enter your beta access code to start using NewsKiller
            </p>
          </div>

          {/* Beta Access Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 text-center max-w-lg mx-auto mb-8 shadow-lg">
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Beta access code"
                value={betaCode}
                onChange={(e) => setBetaCode(e.target.value)}
                className="w-full px-4 py-3 text-base text-slate-900 placeholder-slate-500 bg-slate-50 rounded-lg border border-transparent focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 shadow-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleBetaAccess();
                  }
                }}
              />
              <button
                onClick={handleBetaAccess}
                className="w-full px-6 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow hover:shadow-md"
              >
                Access Beta
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              Don't have a beta code? Join our waitlist to get early access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Landing Page
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-slate-100 flex flex-col justify-center items-center relative overflow-hidden px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main content */}
        <div className="text-center z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-[4rem] md:text-[8rem] font-gideon font-black mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight leading-tight sm:leading-tight md:leading-none">
            {text}
          </h1>
          
          <div className="space-y-6 mb-12">
            <p className="text-2xl md:text-4xl font-bold text-slate-800 leading-tight">
              Turn 20 newsletters into 1.
            </p>
          </div>

          {/* Waitlist */}
          <div className=" rounded-2xl p-4 sm:p-6 border border-white/20 text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">Join Waitlist</h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <input
                type="email"
                placeholder="Email address"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className="min-w-0 w-full sm:w-auto flex-1 px-3 py-2 text-base text-slate-900 placeholder-slate-500 bg-slate-50 rounded-md border border-transparent focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 shadow-sm"
              />
              <button
                onClick={handleJoinWaitlist}
                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow hover:shadow-md"
              >
                Join
              </button>
            </div>
          </div>

          {/* Small beta access button */}
          <div className="max-w-2xl mx-auto mb-8">
            <button
              onClick={goToBeta}
              className="text-sm text-slate-600 hover:text-slate-800 underline transition-colors duration-200"
            >
              beta access
            </button>
          </div>

          {/* Removed Get Started button to simplify the landing */}
        </div>
      </div>
    );
  }

  // Newsletter Selection Page
  return (
    <div className="bg-gradient-to-br from-slate-200 via-white to-slate-100 min-h-screen">
      {/* Header with back button and top controls */}
      <div className="relative pt-8 pb-6">
        <button
          onClick={goBackToLanding}
          className="absolute left-6 top-8 flex items-center text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l7-7m-7 7l7 7" />
          </svg>
        </button>
      </div>

      {/* Top Controls Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-0 mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6 sm:gap-8">
          {/* Category Selection - Left Side */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">{categoriesText}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm border border-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="hidden lg:flex items-center">
            <div className="w-px h-full bg-slate-300"></div>
          </div>

          {/* User Info Form - Right Side */}
          <div className="flex-1 max-w-lg flex flex-col justify-center min-w-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow border border-white/20">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="min-w-0 w-full sm:w-auto flex-1 px-3 py-2 text-base text-slate-900 placeholder-slate-500 bg-slate-50 rounded-md border border-transparent focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 w-full sm:w-auto flex-1 px-3 py-2 text-base text-slate-900 placeholder-slate-500 bg-slate-50 rounded-md border border-transparent focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 shadow-sm"
                />
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-gray-400 to-gray-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all duration-300 shadow hover:shadow-md"
                >
                  {submitText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Cards - Left Aligned */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-0 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 min-w-0">
          {getFilteredNewsletters().map(renderNewsletterCard)}
        </div>
      </div>

      {/* Selected counter */}
      {selectedNewsletters.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pb-[env(safe-area-inset-bottom)]">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-xl backdrop-blur-sm max-w-[calc(100vw-2rem)] truncate">
            <span className="font-semibold">
              {selectedNewsletters.length} newsletter{selectedNewsletters.length === 1 ? '' : 's'} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;