import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
// @ts-ignore
import ramsLogo from '../assets/images/rams_logo_1780695275933.png';

interface MascotAndLogoProps {
  lang: Language;
  onSearchQuery: (query: string) => void;
}

export default function MascotAndLogo({ lang, onSearchQuery }: MascotAndLogoProps) {
  const [bubbleText, setBubbleText] = useState<string>('');
  const [showBubble, setShowBubble] = useState(false);

  const welcomeMessages: Record<Language, string[]> = {
    en: [
      "Hello! I am Michael Baniqued. Try searching for '4Ps' or 'AICS' to see if you can receive cash grants!",
      "Tip: Click my camera icon on the search bar to scan your documents for eligibility!",
      "I am Michael Baniqued, here to guide you to DSWD social benefits. Try typing 'senior pension'!",
      "Did you know? AICS provides burial, medical, and school emergency cash assistance!",
      "Mabuhay! I am Michael Baniqued. We offer Sustainable Livelihood Program (SLP) microfinance too. Try searching 'SLP'!"
    ],
    fil: [
      "Sana masaya ang araw mo! Ako si Michael Baniqued. Subukang hanapin ang '4Ps' o 'AICS' para sa tulong pinansyal!",
      "Tip: I-click ang camera icon sa search bar para i-scan ang Barangay Certificate mo!",
      "Ako si Michael Baniqued at narito ako para gabayan ka sa mga benepisyo ng DSWD. Subukang i-type ang 'senior'!",
      "Alam mo ba? Ang AICS ay nagbibigay ng tulong medikal, panlibing, at pang-eskwela!",
      "Mabuhay! Ako si Michael Baniqued. Mayroon din tayong puhunan para sa micro-negosyo. I-search ang 'SLP kabuhayan'!"
    ],
    ceb: [
      "Kumusta! Ako si Michael Baniqued. Sulayi pagpangita sa '4Ps' o 'AICS' aron makakuha og tabang pinansyal!",
      "Tip: I-klik ang camera icon sa search bar aron ma-scan ang imong Barangay Certificate!",
      "Ako si Michael Baniqued ug ania ako aron mogiya kanimo sa mga benepisyo sa DSWD. Sulayi pag-type ang 'pension'!",
      "Nahibal-an ba nimo? Ang AICS naghatag og tabang sa ospital, lubong, ug pag-eskwela!",
      "Mabuhay! Ako si Michael Baniqued. Naa pud mi puhunan para sa micro-negosyo. Sulayi pagpangita ang 'livelihood'!"
    ]
  };

  useEffect(() => {
    // Show a random initial welcome bubble after 1 second
    const timer = setTimeout(() => {
      const messages = welcomeMessages[lang];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setBubbleText(randomMsg);
      setShowBubble(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [lang]);

  const handleMascotClick = () => {
    const messages = welcomeMessages[lang];
    const currentIndex = messages.indexOf(bubbleText);
    let nextIndex = Math.floor(Math.random() * messages.length);
    if (nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % messages.length;
    }
    setBubbleText(messages[nextIndex]);
    setShowBubble(true);

    // Auto-fill an suggestion if they click
    const match = messages[nextIndex].match(/'([^']+)'/);
    if (match && match[1]) {
      // Just hint, don't auto-search to let them feel in control,
      // or we can animate a bubble.
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative mt-6 mb-2 select-none w-full max-w-lg mx-auto">
      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute -top-16 md:-top-14 left-1/2 transform -translate-x-1/2 bg-white text-slate-800 border-2 border-red-500 rounded-2xl px-4 py-2 text-xs md:text-sm font-medium shadow-lg z-20 w-[280px] md:w-[320px] text-center"
          >
            <div className="relative">
              {bubbleText}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBubble(false);
                }}
                className="absolute -top-2 -right-3 text-red-500 hover:text-red-700 font-bold px-1"
                id="close-bubble-btn"
              >
                ×
              </button>
              {/* Little down triangle */}
              <div className="absolute top-[34px] left-[138px] w-4 h-4 bg-white border-r-2 border-b-2 border-red-500 transform rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Logo & Mascot wrapper (matches the image layout side by side) */}
      <div className="flex flex-row items-center justify-center space-x-2 md:space-x-4 h-48 relative overflow-visible">
        
        {/* Vector representation of DSWD Official Seal Logo */}
        <motion.div 
          whileHover={{ scale: 1.03, rotate: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 cursor-pointer"
          title="Department of Social Welfare and Development Logo"
        >
          <svg viewBox="0 0 200 200" className="w-[100%] h-[100%] drop-shadow-md" id="dswd-seal-svg">
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
        </motion.div>

        {/* Friendly Mascot Boy giving double thumbs up */}
        <motion.div 
          onClick={handleMascotClick}
          whileTap={{ scale: 0.95 }}
          className="relative w-36 h-36 md:w-44 md:h-44 cursor-pointer flex-shrink-0"
          title="Click to interact with Michael Baniqued, your helpful DSWD assistant"
        >
          <svg viewBox="0 0 200 200" className="w-[100%] h-[100%] overflow-visible" id="dswd-mascot-svg">
            <defs>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#252528" />
                <stop offset="100%" stopColor="#0c0c0d" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffdbb5" />
                <stop offset="100%" stopColor="#f3bd8c" />
              </linearGradient>
            </defs>

            {/* Thumbs Up Left (Hand and sleeve) */}
            <motion.g 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.1 }}
              className="origin-bottom-left"
              id="mascot-left-hand"
            >
              {/* Arm/Wrist sleeve */}
              <path d="M 40 140 L 48 120 L 60 128 L 50 145 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
              {/* Thumbs up fist */}
              <path d="M 45 100 C 40 100, 38 105, 38 112 C 38 118, 42 122, 48 122 C 54 122, 58 118, 58 112 L 56 100 Z" fill="#ffdbb5" stroke="#000000" strokeWidth="1.5" />
              {/* Folded fingers */}
              <path d="M 42 108 C 42 105, 48 105, 48 108" fill="none" stroke="#2a221b" strokeWidth="1.5" />
              <path d="M 42 112 C 42 109, 48 109, 48 112" fill="none" stroke="#2a221b" strokeWidth="1.5" />
              <path d="M 43 116 C 43 113, 48 113, 48 116" fill="none" stroke="#2a221b" strokeWidth="1.5" />
              {/* Active thumb sticking straight up */}
              <path d="M 48 104 C 48 90, 56 80, 56 94 C 56 100, 52 105, 48 105 Z" fill="#ffdbb5" stroke="#000000" strokeWidth="1.5" />
            </motion.g>

            {/* Thumbs Up Right (Hand and sleeve) */}
            <motion.g 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.5 }}
              className="origin-bottom-right"
              id="mascot-right-hand"
            >
              {/* Arm/Wrist sleeve */}
              <path d="M 160 140 L 152 120 L 140 128 L 150 145 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
              {/* Thumbs up fist */}
              <path d="M 155 100 C 160 100, 162 105, 162 112 C 162 118, 158 122, 152 122 C 146 122, 142 118, 142 112 L 144 100 Z" fill="#ffdbb5" stroke="#000000" strokeWidth="1.5" />
              {/* Folded fingers */}
              <path d="M 158 108 C 158 105, 152 105, 152 108" fill="none" stroke="#2a221b" strokeWidth="1.5" />
              <path d="M 158 112 C 158 109, 152 109, 152 112" fill="none" stroke="#2a221b" strokeWidth="1.5" />
              <path d="M 157 116 C 157 113, 152 113, 152 116" fill="none" stroke="#2a221b" strokeWidth="1.5" />
              {/* Active thumb sticking straight up */}
              <path d="M 152 104 C 152 90, 144 80, 144 94 C 144 100, 148 105, 152 105 Z" fill="#ffdbb5" stroke="#000000" strokeWidth="1.5" />
            </motion.g>

            {/* Neck */}
            <path d="M 88 128 L 88 150 L 112 150 L 112 128 Z" fill="url(#skinGrad)" stroke="#000000" strokeWidth="1.5" />

            {/* Face/Head */}
            <motion.path 
              whileHover={{ rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.5 }}
              d="M 68 100 C 68 68, 132 68, 132 100 C 132 132, 120 144, 100 144 C 80 144, 68 132, 68 100 Z" 
              fill="url(#skinGrad)" 
              stroke="#000000" 
              strokeWidth="1.8" 
              id="mascot-face"
            />

            {/* Cheerful Black Hair with neat side-parting */}
            <path d="M 66 94 C 64 80, 72 65, 88 56 C 102 50, 114 52, 126 58 C 134 64, 136 78, 132 94 C 128 88, 124 84, 118 84 C 98 84, 94 90, 76 94 C 72 94, 68 94, 66 94 Z" fill="url(#hairGrad)" stroke="#000000" strokeWidth="1.5" />
            <path d="M 76 94 Q 70 80, 80 72 Q 95 62, 110 75" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />

            {/* Ears */}
            <circle cx="65" cy="104" r="9" fill="url(#skinGrad)" stroke="#000000" strokeWidth="1.5" />
            <circle cx="135" cy="104" r="9" fill="url(#skinGrad)" stroke="#000000" strokeWidth="1.5" />

            {/* Friendly Eyebrows */}
            <path d="M 78 88 Q 84 81, 90 85" fill="none" stroke="#120e0d" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 122 88 Q 116 81, 110 85" fill="none" stroke="#120e0d" strokeWidth="2.5" strokeLinecap="round" />

            {/* Left Eye / Blinking Right Eye */}
            <g id="eyes">
              {/* Left Eye */}
              <circle cx="85" cy="98" r="4.5" fill="#120e0d" />
              <circle cx="86.5" cy="96.5" r="1.5" fill="#ffffff" />

              {/* Right Eye */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                  times: [0, 0.9, 0.92, 0.94, 1]
                }}
                className="origin-center"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                <circle cx="115" cy="98" r="4.5" fill="#120e0d" />
                <circle cx="116.5" cy="96.5" r="1.5" fill="#ffffff" />
              </motion.g>
            </g>

            {/* Cute Nose */}
            <path d="M 98 106 Q 100 110, 102 106" fill="none" stroke="#ab774c" strokeWidth="2" strokeLinecap="round" />

            {/* Broad Smile */}
            <g id="mouth">
              {/* Back Mouth */}
              <path d="M 84 116 Q 100 134, 116 116 Z" fill="#711b1b" stroke="#000000" strokeWidth="1.5" />
              {/* Teeth */}
              <path d="M 87 117 H 113 Q 100 123, 87 117 Z" fill="#ffffff" stroke="none" />
              {/* Tongue */}
              <path d="M 92 125 C 92 125, 100 119, 108 125 C 108 125, 100 132, 92 125 Z" fill="#d95e5e" stroke="none" />
            </g>

            {/* Rosy Cheeks */}
            <ellipse cx="73" cy="110" rx="4" ry="2.5" fill="#f87171" opacity="0.4" />
            <ellipse cx="127" cy="110" rx="4" ry="2.5" fill="#f87171" opacity="0.4" />

            {/* Body Shirt */}
            <g id="shirt" transform="translate(0, 1)">
              <path d="M 70 150 L 55 190 Q 100 195, 145 190 L 130 150 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
              
              {/* Red Collar details */}
              <path d="M 82 150 L 68 165 L 86 168 L 94 150 Z" fill="#c2252c" stroke="#000000" strokeWidth="1.5" />
              <path d="M 118 150 L 132 165 L 114 168 L 106 150 Z" fill="#c2252c" stroke="#000000" strokeWidth="1.5" />

              {/* Red Placket center */}
              <path d="M 97 150 H 103 V 178 H 97 Z" fill="#c2252c" stroke="none" />
              <line x1="100" y1="150" x2="100" y2="178" stroke="#000000" strokeWidth="1.2" />
              <circle cx="100" cy="160" r="1.8" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
              <circle cx="100" cy="170" r="1.8" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />

              {/* Small Badge on left chest */}
              <g transform="translate(120, 168) scale(0.12)" id="shirt-badge">
                <path d="M 0 -20 L 15 -10 L 15 15 C 15 25, 0 35, 0 35 C 0 35, -15 25, -15 15 L -15 -10 Z" fill="#ffffff" stroke="#000000" strokeWidth="4" />
                <circle cx="0" cy="0" r="12" fill="#252f63" />
                <path d="M 0 -5 C -2 -9, -8 -8, -8 -3 C -8 3, 0 9, 0 9 C 0 9, 8 3, 8 -3 C 8 -8, 2 -9, 0 -5 Z" fill="#c2252c" />
                <text x="0" y="22" textAnchor="middle" className="font-extrabold text-[12px] fill-[#252f63]">DSWD</text>
              </g>
            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
