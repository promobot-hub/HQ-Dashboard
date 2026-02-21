"use client";

import React, { useState } from 'react';

export default function MultiPlatformPostDemo() {
  const [status, setStatus] = useState('');

  const postToPlatforms = async () => {
    setStatus('Posting to Twitter, LinkedIn, and Email...');
    // Hier würdest du API calls anstoßen
    setTimeout(() => {
      setStatus('Posting succeeded on all platforms!');
    }, 2000);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Multi-Platform Post Demo</h2>
      <button
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        onClick={postToPlatforms}
      >
        Post Content
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
