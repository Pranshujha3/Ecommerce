import React, { useState, useEffect } from 'react';
import { FaSearch, FaMicrophone } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false); // Custom state for animation

  // Check if browser supports speech
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    // If user is not on Search Page, reset query
    if (location.pathname !== '/search') {
      setQuery('');
    }
  }, [location]);

  const handleVoiceStart = () => {
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Search. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    // Start Listening
    setIsListening(true);
    recognition.start();

    console.log("🎤 Voice search started...");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🗣️ User said:", transcript);
      setQuery(transcript);
      setIsListening(false);
      
      // Automatically navigate to search page
      navigate(`/search?q=${transcript}`);
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleManualSearch = () => {
    if (query) {
      navigate(`/search?q=${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className="flex items-center w-full h-full border rounded-lg bg-slate-100 px-3 py-1 focus-within:border-yellow-400 focus-within:bg-white transition-all overflow-hidden">
      
      <button onClick={handleManualSearch} className='text-neutral-500 mr-2 hover:text-green-600'>
         <FaSearch size={18}/>
      </button>

      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search 'milk'..."
        className="w-full h-full bg-transparent outline-none text-base text-neutral-700 placeholder:text-neutral-400"
      />
      
      {/* Only show Mic if browser supports it */}
      {SpeechRecognition && (
        <button 
          onClick={handleVoiceStart}
          className={`ml-2 p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-neutral-500 hover:text-green-600'}`}
        >
          <FaMicrophone size={18}/>
        </button>
      )}

    </div>
  );
};

export default SearchBar;