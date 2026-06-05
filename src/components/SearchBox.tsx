import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, HelpCircle, CornerDownLeft, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { COMMON_SEARCHES } from '../data';

interface SearchBoxProps {
  lang: Language;
  onSearch: (query: string) => void;
  onVoiceOpen: () => void;
  onLensOpen: () => void;
  initialQuery?: string;
  isResultPage?: boolean;
}

export default function SearchBox({
  lang,
  onSearch,
  onVoiceOpen,
  onLensOpen,
  initialQuery = '',
  isResultPage = false
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const placeholders: Record<Language, string> = {
    en: "Search DSWD social programs, cash transfer or requirements...",
    fil: "Maghanap ng tulong pinansyal, programang 4Ps, o mga kailangan...",
    ceb: "Pangitaa ang tabang pinansyal, serbisyo sa 4Ps, o rekisito..."
  };

  const getFilteredSuggestions = () => {
    if (!query) return COMMON_SEARCHES;
    return COMMON_SEARCHES.filter(s =>
      s.text.toLowerCase().includes(query.toLowerCase()) ||
      s.query.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  // Close suggestions on click outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const selectSuggestion = (selectedQuery: string) => {
    setQuery(selectedQuery);
    onSearch(selectedQuery);
    setShowSuggestions(false);
  };

  const clearQuery = () => {
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30">
      <div 
        className={`flex items-center bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-xl focus-within:shadow-indigo-500/10 focus-within:border-indigo-500/50 transition-all duration-200 px-4 rounded-full ${
          isResultPage ? 'py-2 text-sm' : 'py-3.5 text-base'
        }`}
        id="search-bar-wrapper"
      >
        {/* Search Icon */}
        <Search className="text-slate-400 w-5 h-5 mr-3 flex-shrink-0" />

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholders[lang]}
          className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 font-sans"
          id="search-input-field"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearQuery}
            className="text-slate-400 hover:text-slate-200 mr-2 p-1 text-xs"
            id="clear-query-btn"
          >
            ×
          </button>
        )}

        {/* Action icons right-side */}
        <div className="flex items-center space-x-3 ml-2 border-l border-white/10 pl-3 flex-shrink-0">
          
          {/* Green Status/Pulse Dot - Matches Image Exactly! */}
          <div className="relative group flex items-center justify-center cursor-help">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            {/* Tooltip */}
            <div className="absolute bottom-8 right-1/2 translate-x-1/2 bg-slate-900 border border-white/10 text-white text-[10px] rounded px-2 py-1 max-w-[150px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow">
              {lang === 'en' ? 'Portal Online' : lang === 'fil' ? 'Naka-online ang Portal' : 'Aktibo ang Portal'}
            </div>
          </div>

          {/* Voice Search (Mic) */}
          <button
            type="button"
            onClick={onVoiceOpen}
            className="text-slate-350 hover:text-indigo-400 transition-colors duration-150 p-1.5 rounded-full hover:bg-white/5 relative group"
            title={lang === 'en' ? 'Voice Search Assistant' : lang === 'fil' ? 'Tulong Boses' : 'Tingog Assistant'}
            id="mic-search-btn"
          >
            <Mic className="w-4.5 h-4.5 text-slate-300" />
            <div className="absolute bottom-8 right-1/2 translate-x-1/2 bg-slate-900 border border-white/10 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow">
              {lang === 'en' ? 'Voice Search' : lang === 'fil' ? 'Pagsasalita' : 'Tinggog'}
            </div>
          </button>

          {/* Lens Scan (Camera) */}
          <button
            type="button"
            onClick={onLensOpen}
            className="text-slate-350 hover:text-rose-400 transition-colors duration-150 p-1.5 rounded-full hover:bg-white/5 relative group"
            title={lang === 'en' ? 'Lens Document Scanner' : lang === 'fil' ? 'I-scan ang Dokumento' : 'I-scan ang Papeles'}
            id="lens-search-btn"
          >
            <Camera className="w-4.5 h-4.5 text-rose-455 text-rose-400" />
            <div className="absolute bottom-8 right-1/2 translate-x-1/2 bg-slate-900 border border-white/10 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow">
              {lang === 'en' ? 'Document Lens' : lang === 'fil' ? 'I-scan ang ID' : 'I-scan ang ID'}
            </div>
          </button>
        </div>
      </div>

      {/* Suggested Search Terms Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/90 border border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 text-slate-200 backdrop-blur-md animate-in fade-in duration-100">
          <div className="p-2.5 text-[11px] font-semibold text-slate-450 tracking-wider uppercase flex items-center px-4 bg-slate-900/50 border-b border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
            {lang === 'en' ? 'Suggested Queries / Quick Search' : lang === 'fil' ? 'Mga Inirerekomendang Hanapin' : 'Mga Sinugyot nga Pangutana'}
          </div>
          <ul className="divide-y divide-white/5 max-h-64 overflow-y-auto">
            {getFilteredSuggestions().map((item, idx) => (
              <li key={idx}>
                <button
                   type="button"
                   onClick={() => selectSuggestion(item.query)}
                   className="w-full text-left px-4 py-2.5 hover:bg-white/5 font-sans transition-colors duration-150 flex items-center justify-between text-xs md:text-sm text-slate-200"
                   id={`suggestion-${idx}`}
                >
                  <div className="flex items-center">
                    <Search className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                  <div className="flex items-center text-slate-400 text-[10px] whitespace-nowrap">
                    <span className="mr-1">Enter code</span>
                    <CornerDownLeft className="w-3 h-3" />
                  </div>
                </button>
              </li>
            ))}
            {getFilteredSuggestions().length === 0 && (
              <li className="px-4 py-3 text-sm text-slate-450 italic">
                {lang === 'en' ? 'Press enter to search details...' : lang === 'fil' ? 'Pindutin ang Enter para maghanap...' : 'Pindota ang Enter para mangita...'}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
