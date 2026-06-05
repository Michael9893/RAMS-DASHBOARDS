import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, Search, HelpCircle, User, Mic, Sparkles, 
  MapPin, HelpCircle as HelpIcon, ChevronDown, ListTodo, FileSpreadsheet, 
  BookOpen, ExternalLink, Calendar, CheckSquare, RefreshCw, X, Play, Volume2,
  Plus, Trash2, Globe, Link as LinkIcon
} from 'lucide-react';

import { Language, SearchResult, DswdProgram, Application } from './types';
import { DSWD_PROGRAMS, SEARCH_RESULTS, GENERAL_SEARCH_FALLBACK, COMMON_SEARCHES } from './data';
import MascotAndLogo from './components/MascotAndLogo';
import SearchBox from './components/SearchBox';
import EligibilityChecker from './components/EligibilityChecker';
import DocumentLens from './components/DocumentLens';
import ApplicationStatus from './components/ApplicationStatus';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'programs' | 'requirements' | 'eligibility' | 'news'>('all');
  
  // Splash Loading Screen states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [progressText, setProgressText] = useState('Initializing Portal...');

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    const interval = 25; // ms
    
    progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setIsLoading(false);
          return 100;
        }
        
        const next = prev + Math.floor(Math.random() * 5) + 3;
        const val = next > 100 ? 100 : next;
        
        if (val < 25) {
          setProgressText('Initializing secure portal connections...');
        } else if (val < 55) {
          setProgressText('Structuring welfare program data...');
        } else if (val < 80) {
          setProgressText('Syncing dynamic interactive links...');
        } else {
          setProgressText('Portal ready to launch!');
        }
        
        return val;
      });
    }, interval);
    
    return () => clearInterval(progressTimer);
  }, []);
  
  // Custom interactive web-link portals
  const [customPortals, setCustomPortals] = useState<{ id: string; label: string; url: string; emoji: string }[]>(() => {
    try {
      const saved = localStorage.getItem('dswd_custom_portals');
      const loaded = saved ? JSON.parse(saved) : [];
      
      // Attempt to recover what the user had set in their local storage for RAMS Guidelines & RAMS Process Tracker
      const existingGuidelines = Array.isArray(loaded) ? loaded.find((p: any) => p && p.label && p.label.toUpperCase().includes('RAMS GUIDELINES')) : null;
      const existingTracker = Array.isArray(loaded) ? loaded.find((p: any) => p && p.label && (p.label.toUpperCase().includes('PROCESS TRACKER') || p.label.toUpperCase().includes('RAMS PROCESS'))) : null;
      
      // Override with new permanent Vercel link if guidelines is empty or still using the old default placeholder
      const guidelinesUrl = (existingGuidelines && existingGuidelines.url && existingGuidelines.url !== 'https://fo1.dswd.gov.ph/') 
        ? existingGuidelines.url 
        : 'https://record-and-archives-management-sect.vercel.app/';
      const trackerUrl = (existingTracker && existingTracker.url && existingTracker.url !== 'https://fo1.dswd.gov.ph/')
        ? existingTracker.url
        : 'https://rams-process-tracker.vercel.app/';

      // Establish RAMS GUIDELINES and RAMS PROCESS TRACKER as our permanent defaults
      const defaultPortals = [
        { id: 'rams-guidelines', label: 'RAMS GUIDELINES', url: guidelinesUrl, emoji: '🌐' },
        { id: 'rams-tracker', label: 'RAMS PROCESS TRACKER', url: trackerUrl, emoji: '🌐' }
      ];

      // Retrieve any additional custom user links that are NOT the old default keys or the RAMS keys
      const otherPortals = Array.isArray(loaded) ? loaded.filter((p: any) => 
        p && p.label &&
        !p.label.toUpperCase().includes('RAMS GUIDELINES') && 
        !p.label.toUpperCase().includes('PROCESS TRACKER') &&
        !p.label.toUpperCase().includes('RAMS PROCESS') &&
        p.id !== 'rams-guidelines' && 
        p.id !== 'rams-tracker' &&
        p.id !== 'pres-assist' && 
        p.id !== 'gov-portal'
      ) : [];

      return [...defaultPortals, ...otherPortals];
    } catch {
      return [
        { id: 'rams-guidelines', label: 'RAMS GUIDELINES', url: 'https://record-and-archives-management-sect.vercel.app/', emoji: '🌐' },
        { id: 'rams-tracker', label: 'RAMS PROCESS TRACKER', url: 'https://rams-process-tracker.vercel.app/', emoji: '🌐' }
      ];
    }
  });

  const [isAddingPortal, setIsAddingPortal] = useState(false);
  const [newPortalLabel, setNewPortalLabel] = useState('');
  const [newPortalUrl, setNewPortalUrl] = useState('');
  const [newPortalEmoji, setNewPortalEmoji] = useState('🌐');

  // Sync custom portals to local cache and self-heal any stale placeholder links in existing caches
  useEffect(() => {
    let changed = false;
    const cleaned = customPortals.map(p => {
      let url = p.url;
      if (p.id === 'rams-guidelines' && p.url === 'https://fo1.dswd.gov.ph/') {
        changed = true;
        url = 'https://record-and-archives-management-sect.vercel.app/';
      }
      if (p.id === 'rams-tracker' && p.url === 'https://fo1.dswd.gov.ph/') {
        changed = true;
        url = 'https://rams-process-tracker.vercel.app/';
      }
      if (changed) {
        return { ...p, url };
      }
      return p;
    });

    if (changed) {
      setCustomPortals(cleaned);
      localStorage.setItem('dswd_custom_portals', JSON.stringify(cleaned));
    } else {
      localStorage.setItem('dswd_custom_portals', JSON.stringify(customPortals));
    }
  }, [customPortals]);

  const handleAddPortal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortalLabel.trim() || !newPortalUrl.trim()) return;

    let targetUrl = newPortalUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const normalizedLabel = newPortalLabel.trim().toUpperCase();
    const isGuidelines = normalizedLabel.includes('RAMS GUIDELINES');
    const isTracker = normalizedLabel.includes('PROCESS TRACKER') || normalizedLabel.includes('RAMS PROCESS');

    if (isGuidelines || isTracker) {
      const targetId = isGuidelines ? 'rams-guidelines' : 'rams-tracker';
      const cleanLabel = isGuidelines ? 'RAMS GUIDELINES' : 'RAMS PROCESS TRACKER';
      setCustomPortals(prev => {
        const filtered = prev.filter(p => p.id !== targetId);
        return [{ id: targetId, label: cleanLabel, url: targetUrl, emoji: newPortalEmoji }, ...filtered];
      });
    } else {
      const newPortal = {
        id: Date.now().toString(),
        label: newPortalLabel.trim(),
        url: targetUrl,
        emoji: newPortalEmoji
      };
      setCustomPortals([...customPortals, newPortal]);
    }

    setNewPortalLabel('');
    setNewPortalUrl('');
    setNewPortalEmoji('🌐');
    setIsAddingPortal(false);
  };

  const handleRemovePortal = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCustomPortals(customPortals.filter(p => p.id !== id));
  };
  
  // Modals / Overlays triggers
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStep, setVoiceStep] = useState(0); // 0: listening, 1: processing, 2: matching
  const [voiceText, setVoiceText] = useState('');
  const [isLensActive, setIsLensActive] = useState(false);

  // Focus Programs
  const [currentSelectedProgram, setCurrentSelectedProgram] = useState<DswdProgram | null>(DSWD_PROGRAMS[0]);
  const [showLuckyOverlay, setShowLuckyOverlay] = useState(false);
  const [luckyIndex, setLuckyIndex] = useState(0);

  // Accordion lists for FAQs
  const [openFaqIdx, setOpenFaqIdx] = useState<string | null>(null);

  // Return list of searched results
  const getFilteredResults = (): SearchResult[] => {
    if (!query) return SEARCH_RESULTS;
    const lower = query.toLowerCase();
    
    // Find matching tags or title keywords
    const filtered = SEARCH_RESULTS.filter(item => 
      item.title[language].toLowerCase().includes(lower) ||
      item.snippet[language].toLowerCase().includes(lower) ||
      item.tags.some(t => lower.includes(t) || t.includes(lower))
    );

    if (filtered.length === 0) {
      return [GENERAL_SEARCH_FALLBACK(query)];
    }
    return filtered;
  };

  const currentResults = getFilteredResults();

  // Highlighted program match (Knowledge Panel target)
  useEffect(() => {
    if (query) {
      const lower = query.toLowerCase();
      const matched = DSWD_PROGRAMS.find(prog => 
        lower.includes(prog.acronym.toLowerCase()) || 
        prog.tags?.some((t: string) => lower.includes(t)) ||
        prog.name[language].toLowerCase().includes(lower)
      );
      if (matched) {
        setCurrentSelectedProgram(matched);
      }
    }
  }, [query, language]);

  // Handle click Search Button
  const handleMainSearch = (searchVal: string) => {
    const val = searchVal.trim();
    setQuery(val);
    if (val) {
      setIsSearching(true);
      // Track or reset tab to 'all'
      setActiveCategory('all');
    } else {
      // Trigger random option if empty
      const randomArr = ['4Ps pantawid cash', 'AICS emergency', 'Senior Pension OSCA', 'SLP livelihood capital'];
      const randomQuery = randomArr[Math.floor(Math.random() * randomArr.length)];
      setQuery(randomQuery);
      setIsSearching(true);
    }
  };

  // voice simulation
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;

    if (isVoiceActive) {
      setVoiceStep(0);
      setVoiceText('Listening...');
      
      const phrases: Record<Language, string[]> = {
        en: ["how to register for 4Ps cash program?", "AICS hospital medical cash assistance", "Social pension for indigent seniors"],
        fil: ["paano makakuha ng 4ps pantawid pamilya?", "tulong sa libing aics", "pension ng mga senior citizen"],
        ceb: ["unsaon pagpalista sa 4ps?", "tabang sa ospital dinalian", "pensiyon sa mga senior citizen"]
      };

      const selectedPhrase = phrases[language][Math.floor(Math.random() * phrases[language].length)];

      timer1 = setTimeout(() => {
        setVoiceStep(1);
        setVoiceText(`"${selectedPhrase}"`);
      }, 1500);

      timer2 = setTimeout(() => {
        setVoiceStep(2);
        setVoiceText('Analyzing match...');
      }, 3000);

      timer3 = setTimeout(() => {
        setIsVoiceActive(false);
        handleMainSearch(selectedPhrase);
      }, 4200);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVoiceActive]);

  // "I'm Feeling Lucky" action
  const handleLuckyClick = () => {
    // Select a random program and open it
    const randomIndex = Math.floor(Math.random() * DSWD_PROGRAMS.length);
    const luckItem = DSWD_PROGRAMS[randomIndex];
    setLuckyIndex(randomIndex);
    setShowLuckyOverlay(true);
    
    setTimeout(() => {
      setShowLuckyOverlay(false);
      setQuery(luckItem.acronym);
      setCurrentSelectedProgram(luckItem);
      setIsSearching(true);
      setActiveCategory('programs');
    }, 2500);
  };

  const getDocLensProgramFilter = (programId: string) => {
    const matched = DSWD_PROGRAMS.find(p => p.id === programId);
    if (matched) {
      setQuery(matched.acronym);
      setCurrentSelectedProgram(matched);
      setIsSearching(true);
      setActiveCategory('requirements');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-between selection:bg-indigo-500/20 text-slate-100 font-sans">
      
      {/* Splash Screen Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#020617] z-50 flex flex-col justify-center items-center p-4 select-none"
          >
            {/* White loading badge matching the user logo visual style */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(30,58,138,0.25)] flex flex-col items-center space-y-6 text-slate-900 border border-indigo-500/10"
            >
              <div className="flex items-center justify-center space-x-4 sm:space-x-5">
                {/* SVG official logo shape built with absolute pixel precision */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 animate-pulse">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                    {/* Official Gold Shield Layout */}
                    <path 
                      d="M 25, 20 H 175 V 135 A 40 40 0 0 1 135 175 H 65 A 40 40 0 0 1 25 135 Z" 
                      fill="white" 
                      stroke="#fbbf24" 
                      strokeWidth="11" 
                      strokeLinejoin="round" 
                    />
                    {/* Geometric Red Heart (Center) */}
                    <path 
                      d="M 100,115 L 135,80 V 42 L 124,31 H 111 L 100,42 L 89,31 H 76 L 65,42 V 80 Z" 
                      fill="#e11d48" 
                    />
                    {/* Dual Supportive Blue Hands / Arms */}
                    <path 
                      d="M 97,152 V 118 L 59,80 V 30 H 47 V 91 L 75,119 V 152 Z" 
                      fill="#1e3a8a" 
                    />
                    <path 
                      d="M 103,152 V 118 L 141,80 V 30 H 153 V 91 L 125,119 V 152 Z" 
                      fill="#1e3a8a" 
                    />
                  </svg>
                </div>
                
                {/* Text Logo Wordmark matches original exactly */}
                <span className="font-sans font-black tracking-tighter text-5xl sm:text-6xl text-[#1e3a8a]">
                  DSWD
                </span>
              </div>

              {/* Bold golden bar */}
              <div className="w-full h-0.5 bg-[#fbbf24] opacity-80"></div>

              {/* Subheading */}
              <div className="text-center space-y-1">
                <div className="text-[11px] sm:text-[13px] font-black tracking-wide uppercase text-[#1e3a8a] leading-tight">
                  Department of Social Welfare and Development
                </div>
                <div className="text-[9px] font-sans font-bold text-slate-400 tracking-widest uppercase">
                  Republic of the Philippines
                </div>
              </div>

              {/* Loader Slider */}
              <div className="w-full max-w-[240px] pt-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-100">
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#1e3a8a] rounded-full transition-all duration-100"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <div className="text-[9px] font-black text-indigo-950 mt-2.5 uppercase text-center tracking-normal truncate select-none">
                  {progressText}
                </div>
              </div>
            </motion.div>

            {/* Sub label representation */}
            <div className="mt-8 text-[9px] font-mono font-bold text-indigo-400/40 uppercase tracking-widest text-center select-none">
              Social Protection Interactive Portal
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HOMEPAGE VIEW */}
      {!isSearching ? (
        <div className="flex flex-col flex-1">
          {/* Header Bar */}
          <header className="bg-slate-950/60 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold select-none">
            <div className="flex items-center space-x-3">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span className="text-white font-black tracking-wider text-[11px] md:text-xs uppercase font-sans">
                RECORDS AND ARCHIVES MANAGEMENT SECTION
              </span>
            </div>

            <div className="flex items-center space-x-3.5">
              <span className="flex items-center bg-indigo-950/45 text-indigo-300 border border-indigo-500/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                🇵🇭 DSWD FO1
              </span>
              <div className="flex items-center space-x-1 border border-white/10 rounded-lg p-1 bg-slate-900/50 select-none text-[10px]">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${language === 'en' ? 'bg-indigo-600 font-extrabold text-white shadow-md shadow-indigo-600/15' : 'text-slate-400 hover:text-white'}`}
                >EN</button>
                <button 
                  onClick={() => setLanguage('fil')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${language === 'fil' ? 'bg-indigo-600 font-extrabold text-white shadow-md shadow-indigo-600/15' : 'text-slate-400 hover:text-white'}`}
                >FIL</button>
                <button 
                  onClick={() => setLanguage('ceb')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${language === 'ceb' ? 'bg-indigo-600 font-extrabold text-white shadow-md shadow-indigo-600/15' : 'text-slate-400 hover:text-white'}`}
                >CEB</button>
              </div>
            </div>
          </header>

          {/* Core Content */}
          <main className="flex-1 flex flex-col justify-center items-center px-4 md:px-8 py-8 md:py-16 text-center">
            
            {/* Logo and Mascot */}
            <MascotAndLogo lang={language} onSearchQuery={handleMainSearch} />

            {/* Google Styled Rounded Search Box */}
            <div className="w-full mt-4">
              <SearchBox 
                lang={language} 
                onSearch={handleMainSearch} 
                onVoiceOpen={() => setIsVoiceActive(true)}
                onLensOpen={() => setIsLensActive(true)}
                initialQuery={query}
              />
            </div>



            {/* Interactive DSWD Quick Action Buttons with custom link function */}
            <div className="w-full max-w-xl mx-auto mb-8 animate-in fade-in-50 duration-700">
              <div className="text-[10px] font-bold text-slate-550 uppercase tracking-widest mb-3.5 select-none text-center">
                🏢 DSWD INTERACTIVE QUICK PORTALS
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Custom User Portals */}
                {customPortals.map((portal) => (
                  <div key={portal.id} className="relative group">
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2.5 p-3 rounded-xl border border-indigo-505/10 bg-indigo-950/20 hover:bg-indigo-950/40 hover:border-indigo-505/30 transition-all font-sans font-bold text-xs text-indigo-200 text-left cursor-pointer block h-full pr-10"
                    >
                      <span className="text-base">{portal.emoji}</span>
                      <span className="truncate">{portal.label}</span>
                      <ExternalLink className="w-3 h-3 text-indigo-400 absolute right-3 top-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                    {/* Delete action button (hidden for permanent RAMS portals) */}
                    {portal.id !== 'rams-guidelines' && portal.id !== 'rams-tracker' && (
                      <button
                        onClick={(e) => handleRemovePortal(portal.id, e)}
                        title="Remove this portal link"
                        className="absolute right-2 top-2 p-1.5 rounded-lg bg-red-950/40 text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-red-900/60 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {/* "Add Custom Link" Button Action */}
                {!isAddingPortal && (
                  <button
                    onClick={() => setIsAddingPortal(true)}
                    className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-dashed border-slate-500/25 hover:border-indigo-500/40 bg-slate-950/20 hover:bg-slate-950/45 transition-all font-sans font-bold text-xs text-slate-400 hover:text-indigo-400 cursor-pointer select-none"
                  >
                    <Plus className="w-4 h-4 text-indigo-400" />
                    <span>Add Custom Portal Link</span>
                  </button>
                )}
              </div>

              {/* Dynamic Add Web Link Form Form */}
              <AnimatePresence>
                {isAddingPortal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden mt-4 bg-slate-950/70 rounded-2xl border border-indigo-500/20 p-5 text-left shadow-lg backdrop-blur-sm"
                  >
                    <form onSubmit={handleAddPortal} className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wider select-none">
                          <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                          ADD NEW EXTERNAL WEB LINK
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingPortal(false)}
                          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 select-none tracking-wider">
                            Portal Label / Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. DSWD Region IV-A Website"
                            value={newPortalLabel}
                            onChange={(e) => setNewPortalLabel(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 select-none tracking-wider">
                            Website Address (URL)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. https://fo4a.dswd.gov.ph"
                            value={newPortalUrl}
                            onChange={(e) => setNewPortalUrl(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 select-none tracking-wider">
                          Choose Icon / Emoji
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['🌐', '🇵🇭', '🏛️', '📰', '🤝', '📑', '💬', '❤️', '💸', '🏫', '📱', '🏢'].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setNewPortalEmoji(emoji)}
                              className={`w-8 h-8 flex items-center justify-center rounded-xl text-base border transition-all cursor-pointer ${newPortalEmoji === emoji ? 'bg-indigo-600 border-indigo-500 text-white shadow-md scale-105' : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/10'}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-3 border-t border-white/5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setIsAddingPortal(false)}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl transition-colors cursor-pointer select-none"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1.5 cursor-pointer select-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Portal Button</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </main>

          {/* Footer bar */}
          <footer className="bg-slate-950/80 text-[11px] md:text-xs text-slate-400 border-t border-white/10 select-none">
            <div className="px-6 py-3.5 font-bold text-slate-350 flex flex-col md:flex-row justify-between items-center gap-3">
              <div>
                {language === 'en' ? 'Republic of the Philippines' : 'Republika ng Pilipinas'} • {language === 'en' ? 'Social Protection Network' : 'Network ng Proteksyong Panlipunan'}
              </div>
              <div className="text-indigo-400 font-extrabold text-[12px] tracking-wide uppercase font-sans py-1.5 px-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg shadow-sm text-center">
                ALL RIGHT RESERVED BY MICHAEL BANIQUED JUNE 7, 2026
              </div>
            </div>
          </footer>
        </div>
      ) : (
        
        /* 2. SEARCH RESULTS VIEW (SERP) */
        <div className="flex flex-col flex-1 bg-[#020617] animate-in fade-in duration-200">
          
          {/* Top Sticky Header */}
          <header className="bg-slate-950/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-45 px-4 py-3 md:py-4 shadow-xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Logo / Mascot Back button */}
              <div className="flex items-center space-x-3 select-none flex-shrink-0">
                <button
                  onClick={() => { setIsSearching(false); setQuery(''); }}
                  className="flex items-center text-left hover:opacity-85 transition-opacity cursor-pointer"
                  title="Return to DSWD Search Homepage"
                  id="header-back-home"
                >
                  {/* Miniature seal icon */}
                  <div className="w-10 h-10 bg-slate-950 rounded-full flex items-center justify-center border border-indigo-500/20 overflow-hidden shadow-sm mr-2 select-none p-0.5">
                    <svg viewBox="0 0 200 200" className="w-[100%] h-[100%]">
                      {/* Official Gold Shield Layout (Matching Logo Image 1) */}
                      <path 
                        d="M 25, 20 H 175 V 135 A 40 40 0 0 1 135 175 H 65 A 40 40 0 0 1 25 135 Z" 
                        fill="white" 
                        stroke="#fbbf24" 
                        strokeWidth="11" 
                        strokeLinejoin="round" 
                      />

                      {/* Geometric Red Heart (Center) */}
                      <path 
                        d="M 100,115 L 135,80 V 42 L 124,31 H 111 L 100,42 L 89,31 H 76 L 65,42 V 80 Z" 
                        fill="#e11d48" 
                      />

                      {/* Dual Supportive Blue Hands / Arms */}
                      {/* Left Arm */}
                      <path 
                        d="M 97,152 V 118 L 59,80 V 30 H 47 V 91 L 75,119 V 152 Z" 
                        fill="#1e3a8a" 
                      />
                      {/* Right Arm */}
                      <path 
                        d="M 103,152 V 118 L 141,80 V 30 H 153 V 91 L 125,119 V 152 Z" 
                        fill="#1e3a8a" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="font-extrabold text-white font-sans text-[11px] sm:text-xs flex items-center tracking-wider gap-1.5 uppercase">
                      📂 Records and Archives Management Section
                    </h1>
                    <span className="text-[9px] sm:text-[10px] text-slate-450 block font-mono">Department of Social Welfare and Development</span>
                  </div>
                </button>
              </div>

              {/* Dynamic Search Box */}
              <div className="flex-1 max-w-2xl">
                <SearchBox
                  lang={language}
                  onSearch={handleMainSearch}
                  onVoiceOpen={() => setIsVoiceActive(true)}
                  onLensOpen={() => setIsLensActive(true)}
                  initialQuery={query}
                  isResultPage={true}
                />
              </div>

              {/* Language toggle top right */}
              <div className="flex items-center space-x-1 border border-white/10 rounded-lg p-1 bg-slate-900/50 select-none text-[10px] md:text-xs">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${language === 'en' ? 'bg-indigo-600 font-extrabold text-white shadow-md shadow-indigo-600/15' : 'text-slate-400 hover:text-white'}`}
                >EN</button>
                <button 
                  onClick={() => setLanguage('fil')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${language === 'fil' ? 'bg-indigo-600 font-extrabold text-white shadow-md shadow-indigo-600/15' : 'text-slate-400 hover:text-white'}`}
                >FIL</button>
                <button 
                  onClick={() => setLanguage('ceb')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${language === 'ceb' ? 'bg-indigo-600 font-extrabold text-white shadow-md shadow-indigo-600/15' : 'text-slate-400 hover:text-white'}`}
                >CEB</button>
              </div>

            </div>

            {/* Tab navigation categories list */}
            <div className="max-w-7xl mx-auto flex items-center space-x-6 font-sans text-xs font-semibold text-slate-400 overflow-x-auto mt-3 border-t border-white/10 pt-3 select-none flex-nowrap scrollbar-none scroll-smooth">
              <button
                onClick={() => { setActiveCategory('all'); }}
                className={`py-1 border-b-2 text-[11px] md:text-xs transition-colors tracking-tight flex-shrink-0 cursor-pointer ${activeCategory === 'all' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent hover:text-white'}`}
                id="search-tab-all"
              >
                🏷️ All results
              </button>
              <button
                onClick={() => { setActiveCategory('programs'); }}
                className={`py-1 border-b-2 text-[11px] md:text-xs transition-colors tracking-tight flex-shrink-0 cursor-pointer ${activeCategory === 'programs' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent hover:text-white'}`}
                id="search-tab-programs"
              >
                📂 Programs Guide
              </button>
            </div>
          </header>

          {/* Results Main Core */}
          <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
            
            {/* Left side (8 cols): Results listings and tabs */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Switchable category contents */}
              {activeCategory === 'all' && (
                <div className="space-y-6">
                  {/* Fast statistical metadata info */}
                  <div className="text-[11px] text-slate-500 font-sans select-none">
                    About {currentResults.length} interactive records found (0.12 seconds) • Query: "{query}"
                  </div>

                  {/* 1. If searching for a program keyword, show direct quick reference card */}
                  {currentSelectedProgram && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentSelectedProgram.color}`} />
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 mb-1 inline-block">
                            OFFICIAL DSWD PROGRAM MATCH
                          </span>
                          <h3 className="font-sans font-bold text-base md:text-lg text-white tracking-tight mt-1">
                            {currentSelectedProgram.name[language]} ({currentSelectedProgram.acronym})
                          </h3>
                        </div>
                        <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1 font-bold rounded-lg border border-emerald-500/20 uppercase tracking-tight">
                          {language === 'en' ? 'Active distribution' : 'Aktibong Programa'}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-slate-300 mt-3 leading-relaxed font-sans font-medium">
                        {currentSelectedProgram.description[language]}
                      </p>

                      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider font-sans mb-1.5">🎁 Estimated Benefits</h4>
                          <ul className="space-y-1">
                            {currentSelectedProgram.benefits[language].map((b, i) => (
                              <li key={i} className="text-xs text-slate-300 font-sans flex items-start font-medium">
                                <span className="text-emerald-500 mr-2">✦</span>
                                <span className="leading-normal">{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider font-sans mb-1.5">📃 Preliminary Requirements</h4>
                          <ul className="space-y-1">
                            {currentSelectedProgram.requirements[language].slice(0, 3).map((r, i) => (
                              <li key={i} className="text-xs text-slate-300 font-sans flex items-start font-medium">
                                <span className="text-indigo-400 mr-1.5 font-mono text-[9px] mt-0.5">[{i+1}]</span>
                                <span className="leading-normal">{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2.5">
                        <button
                          onClick={() => {
                            setActiveCategory('eligibility');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center shadow-lg shadow-indigo-650/15 cursor-pointer"
                          id="match-assess-btn-quick"
                        >
                          <ListTodo className="w-4 h-4 mr-1.5" />
                          {language === 'en' ? 'Check My Eligibility' : 'Suriin ang Aking Pagka-kwalipikado'}
                        </button>
                        <button
                          onClick={() => {
                            setActiveCategory('news');
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center border border-white/10 cursor-pointer"
                          id="trace-portal-quick"
                        >
                          <BookOpen className="w-4 h-4 mr-1.5 text-slate-400" />
                          {language === 'en' ? 'Filing Guide & Reference Tracker' : 'Gabay sa Pagpasa at Pag-track'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* 2. Interactive Google Structured snippet lists */}
                  <div className="space-y-5" id="serp-snippets-list">
                    {currentResults.map((result) => (
                      <div key={result.id} className="bg-slate-950/40 rounded-3xl border border-white/5 p-4 md:p-5 shadow-inner hover:border-white/10 transition-all">
                        <span className="text-[10px] text-slate-500 font-mono flex items-center mb-1">
                          {result.url}
                        </span>
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-base md:text-lg font-semibold text-indigo-400 hover:text-indigo-300 hover:underline font-sans tracking-tight block"
                        >
                          {result.title[language]}
                        </a>
                        <p className="text-xs md:text-sm text-slate-500 font-sans mt-2 leading-relaxed">
                          {result.snippet[language]}
                        </p>

                        {/* Associated FAQs under the Google link (highly polished) */}
                        {result.faqs && result.faqs.length > 0 && (
                          <div className="mt-4 pt-3.5 border-t border-white/5 space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans block mb-1">People also ask:</span>
                            {result.faqs.map((faq, fIdx) => {
                              const faqId = `${result.id}-${fIdx}`;
                              const isOpen = openFaqIdx === faqId;
                              return (
                                <div key={fIdx} className="border border-white/5 rounded-xl overflow-hidden bg-slate-950/40">
                                  <button
                                    onClick={() => setOpenFaqIdx(isOpen ? null : faqId)}
                                    className="w-full text-left px-4 py-2.5 font-sans font-bold text-xs md:text-sm text-slate-300 hover:bg-slate-900/60 flex items-center justify-between transition-colors cursor-pointer"
                                    id={`faq-btn-${faqId}`}
                                  >
                                    <span>❓ {faq.question[language]}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                                  </button>
                                  <AnimatePresence>
                                    {isOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-slate-950 border-t border-white/5 px-4 py-3 text-xs md:text-sm text-slate-300 leading-relaxed font-semibold"
                                      >
                                        {faq.answer[language]}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Programs tab panel */}
              {activeCategory === 'programs' && (
                <div className="space-y-4">
                  <h3 className="font-sans font-bold text-white text-lg md:text-xl flex items-center select-none pt-2">
                    📂 {language === 'en' ? 'Social Welfare Programs Catalog' : 'Index ng mga Program ng Tulong'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DSWD_PROGRAMS.map(prog => (
                      <div 
                        key={prog.id} 
                        onClick={() => setCurrentSelectedProgram(prog)}
                        className={`border rounded-2xl p-5 hover:bg-slate-900/40 cursor-pointer transition-all ${
                          currentSelectedProgram?.id === prog.id ? 'border-indigo-500 bg-slate-950/80 shadow-lg shadow-indigo-550/5' : 'border-white/10 bg-slate-900/10'
                        }`}
                        id={`program-card-${prog.id}`}
                      >
                        <span className="text-[10px] font-mono uppercase bg-slate-950 text-slate-300 px-2 py-0.5 rounded font-bold border border-white/5">
                          {prog.acronym}
                        </span>
                        <h4 className="font-bold text-white text-sm md:text-base mt-2 font-sans">{prog.name[language]}</h4>
                        <p className="text-xs text-slate-500 mt-1 italic font-medium font-sans truncate">{prog.tagline[language]}</p>
                        <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed font-sans">{prog.description[language]}</p>
                        <div className="mt-3 text-xs font-bold text-indigo-400 hover:underline flex items-center select-none pointer-events-none">
                          {language === 'en' ? 'Inspect checklist details' : 'Surrin ang listahan ng kailangan'} →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements tab panel */}
              {activeCategory === 'requirements' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl">
                    <h3 className="font-sans font-bold text-white text-base md:text-lg mb-2 flex items-center">
                      📜 {language === 'en' ? 'Document Verification Center' : 'Gabay sa mga Dokumento'}
                    </h3>
                    <p className="text-xs text-slate-350 font-sans leading-relaxed mb-4">
                      {language === 'en' ? 'For swift cash card releases and interview validation, examine the corresponding document lists below. Use our automated "Document Lens" camera scanner tool in the search bar to test your certificates.' : 'Ihanda ang mga validong ID at resertipikasyon bago pumila sa Intake. Maaari mong gamitin ang awtomatikong camera scanner tool "Document Lens" sa itaas para malaman kung tanggap ang Barangay Indigency o Senior Citizen card mo.'}
                    </p>

                    <div className="space-y-6" id="program-requirements-accordion">
                      {DSWD_PROGRAMS.map(prog => (
                        <div key={prog.id} className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/20">
                          <div className={`p-3.5 bg-gradient-to-r ${prog.color} text-white flex items-center justify-between`}>
                            <h4 className="font-bold text-xs md:text-sm font-sans flex items-center">
                              <span className="bg-white/20 text-white text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded mr-2 font-mono">
                                {prog.acronym}
                              </span>
                              {prog.name[language]}
                            </h4>
                            <button
                              onClick={() => {
                                setIsLensActive(true);
                              }}
                              className="bg-white/20 hover:bg-white/40 text-white font-semibold py-1 px-2.5 rounded-lg text-[10px] flex items-center space-x-1 border border-white/25 transition-all cursor-pointer"
                              id={`requirements-scanner-${prog.id}`}
                            >
                              <Mic className="w-3 h-3 text-white hidden" />
                              <span>📸 Verify Document with Lens</span>
                            </button>
                          </div>
                          
                          <div className="p-4 bg-slate-950/40 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5">
                            <div>
                              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-sans mb-1.5 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5" />
                                📚 CHECKLIST
                              </h5>
                              <ul className="space-y-1.5">
                                {prog.requirements[language].map((r, i) => (
                                  <li key={i} className="text-xs text-slate-350 font-sans flex items-start">
                                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-[11px] font-bold text-slate-505 text-slate-500 uppercase tracking-widest font-sans mb-1.5 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5" />
                                🛣️ PROCEDURE STEPS
                              </h5>
                              <ul className="space-y-1.5">
                                {prog.steps[language].map((s, i) => (
                                  <li key={i} className="text-xs text-slate-300 font-sans leading-normal flex items-start">
                                    <span className="bg-slate-900 border border-white/5 text-slate-400 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 font-mono">
                                      {i + 1}
                                    </span>
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Eligibility tab panel */}
              {activeCategory === 'eligibility' && (
                <div className="space-y-4">
                  <EligibilityChecker 
                    lang={language} 
                    onApplyForProgram={(progId) => {
                      // Navigate directly to Application filing Intake
                      setActiveCategory('news');
                      const matched = DSWD_PROGRAMS.find(p => p.id === progId);
                      if (matched) {
                        setQuery(matched.acronym);
                        setCurrentSelectedProgram(matched);
                      }
                    }}
                  />
                </div>
              )}

              {/* Applications statuses and Intake tab panel */}
              {activeCategory === 'news' && (
                <div className="space-y-4">
                  <ApplicationStatus 
                    lang={language} 
                    preselectedProgramId={currentSelectedProgram?.id || '4ps'}
                  />
                </div>
              )}

            </div>

            {/* Right side (4 cols): Google styled Knowledge Graph Profile panel */}
            <div className="lg:col-span-4 select-none">
              <AnimatePresence mode="wait">
                {currentSelectedProgram ? (
                  <motion.div
                    key={currentSelectedProgram.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    id="knowledge-graph-profile"
                    className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-5 lg:sticky lg:top-[160px]"
                  >
                    {/* Visual header */}
                    <div>
                      <div className={`w-full h-24 rounded-2xl bg-gradient-to-br ${currentSelectedProgram.color} p-4 flex flex-col justify-between text-white relative shadow-inner overflow-hidden`}>
                        {/* Decorative circle */}
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
                        <span className="bg-white/20 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-md w-fit border border-white/20 font-mono tracking-wider">
                          {currentSelectedProgram.acronym} Program Profile
                        </span>
                        <h4 className="font-sans font-bold text-white text-base truncate pr-1">
                          {currentSelectedProgram.acronym} Official Manual
                        </h4>
                      </div>
                      <h3 className="font-sans font-bold text-lg text-white mt-4 tracking-tight">
                        {currentSelectedProgram.name[language]}
                      </h3>
                      <p className="text-[11px] text-slate-500 italic font-sans font-semibold mt-0.5">
                        {currentSelectedProgram.tagline[language]}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-3.5">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-sans block mb-1">
                          Program Summary
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                          {currentSelectedProgram.description[language]}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-sans block mb-1">
                          Who qualifies?
                        </span>
                        <ul className="space-y-1 pl-1">
                          {currentSelectedProgram.eligibility[language].map((el, i) => (
                            <li key={i} className="text-xs text-slate-300 font-sans flex items-start leading-normal">
                              <span className="text-indigo-400 mr-2 font-bold">✓</span>
                              <span>{el}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-center font-mono select-none pt-2 border-t border-white/5">
                      <span>Source: DSWD National Database • 2026</span>
                    </div>

                  </motion.div>
                ) : (
                  <div className="p-5 border border-white/5 rounded-3xl bg-slate-950/30 text-center text-slate-500 font-sans italic text-xs leading-relaxed select-none">
                    Select any program thumbnail on the left to reveal the integrated executive DSWD knowledge catalog.
                  </div>
                )}
              </AnimatePresence>
            </div>

          </main>

        </div>
      )}

      {/* 3. SIMULATED VOICE SEARCH LISTENING MODAL OVERLAY */}
      <AnimatePresence>
        {isVoiceActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[10000] animate-in duration-300"
          >
            <div className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full mx-4 border border-white/10 shadow-2xl text-center space-y-6">
              
              <div className="flex justify-between items-center select-none">
                <span className="text-rose-500 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-2" />
                  DSWD Speech Agent
                </span>
                <button 
                  onClick={() => setIsVoiceActive(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                  id="close-speech-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pulsing microphone graphic waves */}
              <div className="relative py-6 flex items-center justify-center select-none" id="mic-pulsing-wave flex">
                <div className="absolute w-24 h-24 rounded-full bg-indigo-500/10 animate-ping" />
                <div className="absolute w-18 h-18 rounded-full bg-indigo-500/20 animate-pulse" />
                <div className="relative w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Speech subtitles state */}
              <div className="space-y-2 select-none">
                {voiceStep === 0 && (
                  <p className="text-slate-400 text-xs md:text-sm italic font-sans">{language === 'en' ? 'Listening carefully...' : 'Nakikinig ng maayos...'}</p>
                )}
                {voiceStep === 1 && (
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{language === 'en' ? 'DETECTED STATEMENT' : 'NATUKLASANG SALITA'}</p>
                )}
                <p className="font-sans font-extrabold text-base md:text-lg text-white leading-snug">
                  {voiceText}
                </p>
              </div>

              <div className="text-[10px] text-slate-500 font-sans select-none border-t border-white/5 pt-4">
                {language === 'en' ? 'Simulating speech recognition using high precision audio models.' : 'Ginagaya ang pagtukoy ng boses gamit ang audio models.'}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. DOCUMENT LENS MODAL OVERLAY */}
      <AnimatePresence>
        {isLensActive && (
          <DocumentLens 
            lang={language} 
            onClose={() => setIsLensActive(false)} 
            onFilterByProgram={getDocLensProgramFilter}
          />
        )}
      </AnimatePresence>

      {/* 5. "I'M FEELING LUCKY" OVERLAY CELEBRATORY BANNER */}
      <AnimatePresence>
        {showLuckyOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-[10001]"
          >
            <div className="text-center text-white p-6 max-w-sm w-full mx-4 space-y-6 select-none">
              
              {/* Animating roulette program badges */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t-4 border-l-4 border-dashed border-amber-500"
                />
                <div className="bg-slate-950 text-white rounded-full w-24 h-24 border-2 border-amber-500 flex items-center justify-center flex-col shadow-lg shadow-amber-500/25">
                  <span className="text-[10px] font-bold text-amber-500 uppercase font-mono">LUCKY WHEEL</span>
                  <span className="text-base font-extrabold font-sans mt-0.5 animate-pulse">
                    {DSWD_PROGRAMS[luckyIndex].acronym}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-sans font-black text-xl text-amber-500 flex items-center justify-center gap-1 tracking-tight">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Maswerteng Tuklas Selected!
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-normal">
                  {language === 'en' ? 'Michael Baniqued, our double-thumbs up mascot of DSWD, is custom matching a program catalog details for you...' : 'Ipinipila ni Michael Baniqued, ang ating DSWD mascot, ang isang gabay pangkabuhayan na babagay sa iyo...'}
                </p>
              </div>

              <p className="font-mono text-xs uppercase tracking-widest text-slate-300 font-bold bg-slate-900 px-4 py-2 rounded-xl border border-white/5">
                Opening Profile: {DSWD_PROGRAMS[luckyIndex].name[language]}
              </p>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
