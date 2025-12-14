import React, { useState, useEffect } from 'react';
import { FaSearch, FaMicrophone } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const {
    transcript,
    listening,
    resetTranscript, // <--- Ensure this is imported
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // 1. Sync voice transcript with the search input (Visual only)
  useEffect(() => {
    if (listening && transcript) {
      setQuery(transcript);
    }
  }, [transcript, listening]);

  // 2. *** FIXED: Auto-submit when voice stops listening ***
  useEffect(() => {
    if (!listening && transcript) {
        onSearch(transcript);
        resetTranscript(); // <--- 🛑 THIS LINE STOPS THE INFINITE LOOP
    }
  }, [listening, transcript, onSearch, resetTranscript]);

  const handleVoiceStart = () => {
    resetTranscript();
    setQuery(''); // Optional: Clear previous text when starting new voice search
    SpeechRecognition.startListening({ continuous: false, language: 'en-IN' }); 
  };

  const handleManualSearch = () => {
    if(query){
        onSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query) {
        onSearch(query);
    }
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="flex items-center w-full h-full border rounded-lg bg-slate-100 px-3 py-1 focus-within:border-yellow-400 focus-within:bg-white transition-all overflow-hidden">
      
      <button onClick={handleManualSearch} className='text-neutral-500 mr-2 hover:text-green-600'>
         <FaSearch size={18}/>
      </button>

      <input 
        type="text" 
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search 'milk'..."
        className="w-full h-full bg-transparent outline-none text-base text-neutral-700 placeholder:text-neutral-400"
      />
      
      <button 
        onClick={handleVoiceStart}
        className={`ml-2 p-2 rounded-full transition-all ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-neutral-500 hover:text-green-600'}`}
      >
        <FaMicrophone size={18}/>
      </button>

    </div>
  );
};

export default SearchBar;