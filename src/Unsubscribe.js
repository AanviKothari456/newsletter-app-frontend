import React, { useState } from 'react';
import supabase from './supabaseClient'; 

const Unsubscribe = () => {
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email.trim()) {
      alert('Please enter your email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email.');
      return;
    }

    try {
      const { error } = await supabase
        .from('unsubscribed_emails_tbl')
        .upsert([{ email }], { onConflict: ['email'] }); // ensures unique by email

      if (error) throw error;
      setConfirmed(true);
    } catch (err) {
      console.error('Error unsubscribing:', err);
      alert('❌ Something went wrong. Try again later.');
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">You've been unsubscribed.</h1>
          <p className="text-gray-600">We're sorry to see you go :( </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold"> Manage Your Subscription</h1>
        <p className="text-gray-600">Type in your email to stop receiving NewsKiller newsletters</p>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleUnsubscribe}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Unsubscribe;
