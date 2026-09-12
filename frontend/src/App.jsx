import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Frontend Restored!
        </h1>
        <p className="text-slate-400 text-sm">
          Aapka src folder successfully restore ho gaya hai aur Tailwind CSS working condition mein hai.
        </p>
      </div>
    </div>
  );
}