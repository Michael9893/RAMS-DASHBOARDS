import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, Search, HelpCircle, User, Mic, Sparkles, 
  MapPin, HelpCircle as HelpIcon, ChevronDown, ListTodo, FileSpreadsheet, 
  BookOpen, ExternalLink, Calendar, CheckSquare, RefreshCw, X, Play, Volume2,
  Plus, Trash2, Globe, Link as LinkIcon, Pin, Lock, Unlock,
  Image as ImageIcon, Download, Upload, ChevronLeft, ChevronRight, Pause, Camera, Clock,
  Music, Youtube, Smile, FileText, File, UploadCloud
} from 'lucide-react';

import { collection, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import { Language, SearchResult, DswdProgram, Application } from './types';
import { DSWD_PROGRAMS, SEARCH_RESULTS, GENERAL_SEARCH_FALLBACK, COMMON_SEARCHES } from './data';
import MascotAndLogo from './components/MascotAndLogo';
import SearchBox from './components/SearchBox';
// @ts-ignore
import ramsLogo from './assets/images/rams_logo_1780695275933.png';
import EligibilityChecker from './components/EligibilityChecker';
import DocumentLens from './components/DocumentLens';
import ApplicationStatus from './components/ApplicationStatus';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'programs' | 'requirements' | 'eligibility' | 'news'>('all');
  
  // Live Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);
  
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
      
      // Attempt to recover what the user had set in their local storage for RAMS Guidelines, RAMS Process Tracker & RAMSYNC
      const existingGuidelines = Array.isArray(loaded) ? loaded.find((p: any) => p && p.label && p.label.toUpperCase().includes('RAMS GUIDELINES')) : null;
      const existingTracker = Array.isArray(loaded) ? loaded.find((p: any) => p && p.label && (p.label.toUpperCase().includes('PROCESS TRACKER') || p.label.toUpperCase().includes('RAMS PROCESS'))) : null;
      const existingRamsync = Array.isArray(loaded) ? loaded.find((p: any) => p && p.label && p.label.toUpperCase().includes('RAMSYNC')) : null;
      
      // Override with new permanent Vercel link if guidelines is empty or still using the old default placeholder
      const guidelinesUrl = (existingGuidelines && existingGuidelines.url && existingGuidelines.url !== 'https://fo1.dswd.gov.ph/') 
        ? existingGuidelines.url 
        : 'https://record-and-archives-management-sect.vercel.app/';
      const trackerUrl = (existingTracker && existingTracker.url && existingTracker.url !== 'https://fo1.dswd.gov.ph/')
        ? existingTracker.url
        : 'https://rams-process-tracker.vercel.app/';
      const ramsyncUrl = (existingRamsync && existingRamsync.url)
        ? existingRamsync.url
        : 'https://ramsync.vercel.app/';

      // Establish RAMS GUIDELINES, RAMS PROCESS TRACKER, and RAMSYNC as our permanent defaults
      const defaultPortals = [
        { id: 'rams-guidelines', label: 'RAMS GUIDELINES', url: guidelinesUrl, emoji: '🌐' },
        { id: 'rams-tracker', label: 'RAMS PROCESS TRACKER', url: trackerUrl, emoji: '🌐' },
        { id: 'ramsync', label: 'RAMSYNC', url: ramsyncUrl, emoji: '🌐' }
      ];

      // Retrieve any additional custom user links that are NOT the old default keys or the RAMS keys
      const otherPortals = Array.isArray(loaded) ? loaded.filter((p: any) => 
        p && p.label &&
        !p.label.toUpperCase().includes('RAMS GUIDELINES') && 
        !p.label.toUpperCase().includes('PROCESS TRACKER') &&
        !p.label.toUpperCase().includes('RAMS PROCESS') &&
        !p.label.toUpperCase().includes('RAMSYNC') &&
        p.id !== 'rams-guidelines' && 
        p.id !== 'rams-tracker' &&
        p.id !== 'ramsync' &&
        p.id !== 'pres-assist' && 
        p.id !== 'gov-portal'
      ) : [];

      return [...defaultPortals, ...otherPortals];
    } catch {
      return [
        { id: 'rams-guidelines', label: 'RAMS GUIDELINES', url: 'https://record-and-archives-management-sect.vercel.app/', emoji: '🌐' },
        { id: 'rams-tracker', label: 'RAMS PROCESS TRACKER', url: 'https://rams-process-tracker.vercel.app/', emoji: '🌐' },
        { id: 'ramsync', label: 'RAMSYNC', url: 'https://ramsync.vercel.app/', emoji: '🌐' }
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
      if (p.id === 'ramsync' && !p.url) {
        changed = true;
        url = 'https://ramsync.vercel.app/';
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
    const isRamsync = normalizedLabel.includes('RAMSYNC');

    if (isGuidelines || isTracker || isRamsync) {
      const targetId = isGuidelines ? 'rams-guidelines' : (isTracker ? 'rams-tracker' : 'ramsync');
      const cleanLabel = isGuidelines ? 'RAMS GUIDELINES' : (isTracker ? 'RAMS PROCESS TRACKER' : 'RAMSYNC');
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

  // =========================================================
  // 📌 RAMS STICKY WORKING NOTES ENGINE STATE & HANDLERS
  // =========================================================
  interface RAMSNote {
    id: string;
    text: string;
    color: string;
    x: number;
    y: number;
    createdAt: string;
    musicTitle?: string;
    youtubeUrl?: string;
    noteEmoji?: string;
  }

  const boardRef = useRef<HTMLDivElement>(null);
  
  const [notes, setNotes] = useState<RAMSNote[]>([]);

  const [noteInput, setNoteInput] = useState('');
  const [noteColor, setNoteColor] = useState('bg-amber-500/10 text-amber-200 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50');
  const [noteMusicTitle, setNoteMusicTitle] = useState('');
  const [noteYoutubeUrl, setNoteYoutubeUrl] = useState('');
  const [noteEmoji, setNoteEmoji] = useState('');
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);

  // Quick select presets for user memos
  const presetEmojis = ['📌', '⚠️', '📂', '📝', '💡', '🎵', '🔥', '🚀', '👍', '😎', '😄', '🎉', '🏢', '📋', '🔒', '🕒'];
  const presetEmotes = ['(•_•)', '(°o°)', '(ಠ_ಠ)', '(≖_≖)', '(͡° ͜ʖ ͡°)', '(★_★)', '(•‿•)', '(^_^)', '¯\\_(ツ)_/¯', '(=^·^=)', '(>_<)', '(T_T)'];

  // Modern note theme color presets
  const noteColors = [
    {
      name: 'Amber Gold',
      class: 'bg-amber-500/10 text-amber-200 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50',
      dot: 'bg-amber-400'
    },
    {
      name: 'Emerald Green',
      class: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50',
      dot: 'bg-emerald-400'
    },
    {
      name: 'Cyan Ocean',
      class: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50',
      dot: 'bg-cyan-400'
    },
    {
      name: 'Lavender Purple',
      class: 'bg-purple-500/10 text-purple-200 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-505/50',
      dot: 'bg-purple-400'
    },
    {
      name: 'Rose Blush',
      class: 'bg-rose-500/10 text-rose-200 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-505/50',
      dot: 'bg-rose-400'
    }
  ];

  // Synchronously fetch and bind live notes in Firestore Real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
      const list: RAMSNote[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as RAMSNote);
      });
      // Sort to prevent flashing layout sequence order
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setNotes(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'notes');
    });
    return () => unsubscribe();
  }, []);

  // Determine if a note was created on the current calendar day
  const isCreatedToday = (createdAtISO: string) => {
    const createdDate = new Date(createdAtISO);
    const today = new Date();
    return (
      createdDate.getFullYear() === today.getFullYear() &&
      createdDate.getMonth() === today.getMonth() &&
      createdDate.getDate() === today.getDate()
    );
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    const bRect = boardRef.current ? boardRef.current.getBoundingClientRect() : null;
    const boardWidth = bRect ? bRect.width : 576;
    const boardHeight = bRect ? bRect.height : 360;

    const count = notes.length;
    // Offset each newly added note so they don't stack coordinates instantly
    const defaultX = Math.min(20 + (count * 30) % (boardWidth - 220), boardWidth - 220);
    const defaultY = Math.min(20 + (count * 25) % (boardHeight - 160), boardHeight - 160);

    const noteId = `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNote: RAMSNote = {
      id: noteId,
      text: noteInput.trim(),
      color: noteColor,
      x: Math.max(0, defaultX),
      y: Math.max(0, defaultY),
      createdAt: new Date().toISOString()
    };

    if (noteMusicTitle.trim()) {
      newNote.musicTitle = noteMusicTitle.trim();
    }
    if (noteYoutubeUrl.trim()) {
      let url = noteYoutubeUrl.trim();
      // Basic validation or protocol addition
      if (url && !/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      newNote.youtubeUrl = url;
    }
    if (noteEmoji) {
      newNote.noteEmoji = noteEmoji;
    }

    try {
      await setDoc(doc(db, 'notes', noteId), newNote);
      setNoteInput('');
      setNoteMusicTitle('');
      setNoteYoutubeUrl('');
      setNoteEmoji('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `notes/${noteId}`);
    }
  };

  const handleRemoveNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `notes/${id}`);
    }
  };

  // Draggable pointer capturing math keeping nodes fully bound
  const handleNoteDragStart = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const noteElement = e.currentTarget.parentElement;
    if (!noteElement || !boardRef.current) return;

    const rect = noteElement.getBoundingClientRect();
    const boardRect = boardRef.current.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const targetNote = notes.find(n => n.id === id);
    if (!targetNote) return;

    let newX = targetNote.x;
    let newY = targetNote.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      newX = moveEvent.clientX - boardRect.left - offsetX;
      newY = moveEvent.clientY - boardRect.top - offsetY;

      const maxLimitX = boardRect.width - rect.width;
      const maxLimitY = boardRect.height - rect.height;

      newX = Math.max(0, Math.min(newX, maxLimitX));
      newY = Math.max(0, Math.min(newY, maxLimitY));

      setNotes(prev => prev.map(n => n.id === id ? { ...n, x: newX, y: newY } : n));
    };

    const handlePointerUp = async () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      try {
        await setDoc(doc(db, 'notes', id), {
          ...targetNote,
          x: newX,
          y: newY
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `notes/${id}`);
      }
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  // =========================================================
  // 📸 RAMS OFFICERS PHOTO ALBUM STATE & ENGINE
  // =========================================================
  interface RAMSPhoto {
    id: string;
    url: string;
    title: string;
    createdAt: string;
    downloads: number;
    description?: string;
  }

  // Real-time Photos listener inside App.tsx
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'photos'), (snapshot) => {
      const list: RAMSPhoto[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as RAMSPhoto);
      });
      // Sort descending by creation date
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPhotos(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'photos');
    });
    return () => unsubscribe();
  }, []);

  // =========================================================
  // 📁 IMPORTANT FILES FOR RECORDS AND ARCHIVES STATE & ENGINE
  // =========================================================
  interface RAMSFile {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    title: string;
    createdAt: string;
    downloads: number;
  }

  const [ramsFiles, setRamsFiles] = useState<RAMSFile[]>([]);
  const [isFileSectionExpanded, setIsFileSectionExpanded] = useState(false); // Collapsed by default as requested to save space
  const [fileUploadTitle, setFileUploadTitle] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time Files listener under RAMS Quick Portals
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rams_files'), (snapshot) => {
      const list: RAMSFile[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as RAMSFile);
      });
      // Sort descending by creation date
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRamsFiles(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'rams_files');
    });
    return () => unsubscribe();
  }, []);

  const handleUploadFile = (file: File) => {
    if (!file) return;

    if (file.size > 800 * 1024) {
      setFileUploadError('File size exceeds the 800 KB cloud sync limit. Please compress or optimize the file.');
      return;
    }

    setIsUploadingFile(true);
    setFileUploadError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileId = `rams_file_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newFileDoc: RAMSFile = {
          id: fileId,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          url: event.target?.result as string,
          title: fileUploadTitle.trim() || file.name.substring(0, file.name.lastIndexOf('.')) || 'DSWD-RAMS Archival File',
          createdAt: new Date().toISOString(),
          downloads: 0
        };

        await setDoc(doc(db, 'rams_files', fileId), newFileDoc);
        setFileUploadTitle('');
        setIsUploadingFile(false);
        // Clear input element
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        setIsUploadingFile(false);
        handleFirestoreError(err, OperationType.CREATE, `rams_files`);
      }
    };
    reader.onerror = () => {
      setFileUploadError('Failed to read the file.');
      setIsUploadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadFile = async (ramsFile: RAMSFile) => {
    try {
      await setDoc(doc(db, 'rams_files', ramsFile.id), {
        ...ramsFile,
        downloads: (ramsFile.downloads || 0) + 1
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `rams_files/${ramsFile.id}`);
    }

    const link = document.createElement('a');
    link.href = ramsFile.url;
    link.download = ramsFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveFile = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'rams_files', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `rams_files/${id}`);
    }
  };

  // Pre-populate with high-fidelity archival records images (Clean slate)
  const defaultAlbumPhotos: RAMSPhoto[] = [];

  const [photos, setPhotos] = useState<RAMSPhoto[]>([]);

  const [photoUploadTitle, setPhotoUploadTitle] = useState('');
  const [photoUploadError, setPhotoUploadError] = useState('');
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  // Slideshow State
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);

  // Lightbox Zoom state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Slideshow auto-transition trigger
  useEffect(() => {
    let timer: any = null;
    const itemsCount = Math.min(photos.length, 10);
    if (isSlideshowPlaying && itemsCount > 1) {
      timer = setInterval(() => {
        setActiveSlideIdx(prev => (prev + 1) % itemsCount);
      }, 5000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSlideshowPlaying, photos]);

  // Compile 10 most recent photos (or photos of the day)
  const getSlideshowPhotos = (): RAMSPhoto[] => {
    // Sort descending by creation date
    const sorted = [...photos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted.slice(0, 10);
  };

  const slideshowPhotos = getSlideshowPhotos();
  const safeSlideIdx = activeSlideIdx < slideshowPhotos.length ? activeSlideIdx : 0;
  const currentSlide = slideshowPhotos.length > 0 ? (slideshowPhotos[safeSlideIdx] || slideshowPhotos[0]) : null;

  // Compress and store image upload safely on the shared server
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoUploadError('Please select a valid image file (.jpg, .png, .webp).');
      return;
    }

    setPhotoUploadError('');
    setIsCompressingPhoto(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        // Downscale proportionally to fit within server and storage footprint safely
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Downscale quality to 0.7 for extremely space-efficient base64 string
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

          const photoId = `rams-img-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const newPhoto: RAMSPhoto = {
            id: photoId,
            url: compressedDataUrl,
            title: photoUploadTitle.trim() || file.name.substring(0, file.name.lastIndexOf('.')) || 'Uploaded RAMS Archive',
            createdAt: new Date().toISOString(),
            downloads: 0,
            description: `Uploaded on ${new Date().toLocaleDateString()}`
          };

          // Save to Firestore cloud database
          setDoc(doc(db, 'photos', photoId), newPhoto)
            .then(() => {
              setPhotoUploadTitle('');
              setIsCompressingPhoto(false);
              setActiveSlideIdx(0); // Reset slideshow to newly added item
            })
            .catch(err => {
              handleFirestoreError(err, OperationType.CREATE, `photos/${photoId}`);
            });
        }
      };
      img.onerror = () => {
        setPhotoUploadError('Failed to parse image file.');
        setIsCompressingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setPhotoUploadError('Failed to read file.');
      setIsCompressingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  // Browser safe file downloader
  const handleDownloadPhoto = async (photo: RAMSPhoto) => {
    // Notify database to increment download metric counts
    try {
      await setDoc(doc(db, 'photos', photo.id), {
        ...photo,
        downloads: (photo.downloads || 0) + 1
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `photos/${photo.id}`);
    }

    // For base64 directly trigger browser download
    if (photo.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = photo.url;
      const cleanTitle = photo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `rams_archive_${cleanTitle}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For Unsplash CORS URLs, we open in a clean tab configured to let the user save or we download via blob
      fetch(photo.url)
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          const cleanTitle = photo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          link.download = `rams_archive_${cleanTitle}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        })
        .catch(() => {
          // Absolute failover: simply open the image url in a safe new tab for saving
          window.open(photo.url, '_blank');
        });
    }
  };

  const handleRemovePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'photos', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `photos/${id}`);
    }
    if (lightboxIndex !== null) {
      setLightboxIndex(null);
    }
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
              <div className="flex items-center justify-center animate-pulse">
                <img
                  src={ramsLogo}
                  alt="RAMS Records and Archives Logo"
                  referrerPolicy="no-referrer"
                  className="max-h-40 object-contain select-none"
                />
              </div>

              {/* Bold golden bar */}
              <div className="w-full h-0.5 bg-amber-400 opacity-80"></div>

              {/* Subheading */}
              <div className="text-center space-y-1 select-none">
                <div className="text-[12px] sm:text-[14px] font-black tracking-wide uppercase text-[#1e3a8a] leading-tight">
                  RECORDS AND ARCHIVES MANAGEMENT SECTION
                </div>
                <div className="text-[9px] font-sans font-bold text-slate-400 tracking-widest uppercase">
                  Republic of the Philippines
                </div>
              </div>

              {/* Loader Slider */}
              <div className="w-full max-w-[240px] pt-1.5">
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
              RAMS FAM Portal
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HOMEPAGE VIEW */}
      {!isSearching ? (
        <div className="flex flex-col flex-1">
          {/* Header Bar */}
          <header className="bg-slate-950/60 backdrop-blur-md border-b border-white/5 py-3 px-6 md:px-8 flex flex-col items-center justify-center text-xs font-semibold select-none gap-1">
            <div className="flex items-center space-x-2.5 justify-center">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-white font-black tracking-wider text-[10px] sm:text-[11px] md:text-xs uppercase font-sans">
                RECORDS AND ARCHIVES MANAGEMENT SECTION
              </span>
            </div>
            
            {/* Live Clock */}
            <div className="flex items-center space-x-1.5 text-[9px] md:text-[10px] font-mono text-indigo-300 bg-indigo-950/35 px-2.5 py-0.5 rounded-full border border-indigo-500/10">
              <Clock className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
              <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-slate-600 select-none">•</span>
              <span className="font-bold tabular-nums text-white text-[10px] sm:text-[11px]">{currentTime.toLocaleTimeString()}</span>
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
                🏢 RECORDS AND ARCHIVES MANAGEMENT SECTION QUICK PORTALS
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
                    {portal.id !== 'rams-guidelines' && portal.id !== 'rams-tracker' && portal.id !== 'ramsync' && (
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
            {/* 📁 IMPORTANT FILES FOR RECORDS & ARCHIVES MANAGEMENT       */}
            {/* ========================================================= */}
            <div className="w-full max-w-xl mx-auto mb-10 text-left animate-in fade-in-50 duration-700">
              <div className="text-[10px] font-bold text-slate-550 uppercase tracking-widest mb-3.5 select-none text-center">
                📁 IMPORTANT FILES FOR RECORDS AND ARCHIVES MANAGEMENT
              </div>
              
              <div className="bg-slate-950/40 rounded-2xl border border-indigo-550/10 p-4 backdrop-blur-sm shadow-md transition-all hover:border-indigo-550/20">
                {/* Collapsible Trigger Header */}
                <button
                  type="button"
                  onClick={() => setIsFileSectionExpanded(!isFileSectionExpanded)}
                  className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <FileText className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
                          RAMS Document Archive Port
                        </h3>
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full text-[9px] font-black select-none">
                          {ramsFiles.length} {ramsFiles.length === 1 ? 'FILE' : 'FILES'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-tight mt-0.5 select-none">
                        {isFileSectionExpanded ? 'Real-time shared catalog for templates and guidelines.' : 'Click to expand upload form & files catalog.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold text-indigo-400/70 group-hover:text-indigo-400 uppercase select-none tracking-wider">
                      {isFileSectionExpanded ? 'Hide' : 'Show'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-450 group-hover:text-white transition-transform duration-300 ${
                      isFileSectionExpanded ? 'rotate-180' : ''
                    }`} />
                  </div>
                </button>

                {/* Collapsible Body */}
                {isFileSectionExpanded && (
                  <div className="mt-4 pt-4 border-t border-indigo-500/10 animate-in fade-in duration-300">
                    {/* Upload Section Form */}
                    <div className="space-y-3 mb-5 p-4 rounded-xl bg-slate-950/60 border border-white/5">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
                          Descriptive File Name / Title (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. RAMS Guidelines v2, 2026 Archive Log..."
                          value={fileUploadTitle}
                          onChange={(e) => setFileUploadTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
                        />
                      </div>

                      {/* Drag and Drop Zone */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleUploadFile(file);
                        }}
                        className="border border-dashed border-slate-700 hover:border-indigo-500/40 hover:bg-indigo-950/10 transition-all rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer group-inner"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFile(file);
                          }}
                          className="hidden"
                        />
                        <UploadCloud className="w-6 h-6 text-indigo-400 group-inner-hover:scale-110 transition-transform mb-2" />
                        <span className="text-[11px] font-bold text-slate-300">
                          Drag & Drop file here or <span className="text-indigo-400 underline animate-pulse">Browse</span>
                        </span>
                        <span className="text-[9px] text-slate-500 mt-1">
                          Max file size: 800 KB for direct real-time sync syncing
                        </span>
                      </div>

                      {/* Error & Upload state info */}
                      {fileUploadError && (
                        <p className="text-[10px] text-red-400 font-semibold bg-red-950/20 px-2.5 py-1.5 rounded-lg border border-red-500/10 animate-in fade-in-50 duration-200">
                          ⚠️ {fileUploadError}
                        </p>
                      )}

                      {isUploadingFile && (
                        <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold">
                          <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                          <span>Compressing and uploading data to RAMS cloud...</span>
                        </div>
                      )}
                    </div>

                    {/* Shared File List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {ramsFiles.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-white/5 rounded-xl select-none">
                          <File className="w-6 h-6 text-slate-650 mx-auto mb-1 opacity-45" />
                          <p className="text-[10px] font-semibold text-slate-500">No official documents cataloged in this portal.</p>
                          <p className="text-[8px] text-slate-600 mt-0.5">Upload templates to instantly synchronize everyone's terminals.</p>
                        </div>
                      ) : (
                        ramsFiles.map((file) => {
                          const sizeInKb = (file.size / 1024).toFixed(1);
                          const isPdf = file.type.includes('pdf') || file.name.endsWith('.pdf');
                          const isExcel = file.type.includes('excel') || file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                          
                          return (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-slate-950/30 hover:bg-slate-950/60 hover:border-indigo-500/10 transition-all text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                <span className={`p-2 rounded-lg flex-shrink-0 ${
                                  isPdf ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
                                  isExcel ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10'
                                }`}>
                                  {isPdf ? (
                                    <FileText className="w-4 h-4 text-red-400" />
                                  ) : isExcel ? (
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <File className="w-4 h-4 text-indigo-400" />
                                  )}
                                </span>
                                <div className="min-w-0">
                                  <p className="font-extrabold text-slate-200 truncate leading-snug" title={file.title}>
                                    {file.title}
                                  </p>
                                  <div className="flex items-center gap-1 text-[8px] text-slate-500 mt-0.5 truncate uppercase tracking-wider font-semibold">
                                    <span className="truncate text-[8px] text-slate-450">{file.name}</span>
                                    <span>•</span>
                                    <span>{sizeInKb} KB</span>
                                    <span>•</span>
                                    <span>{file.downloads} DL</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(file)}
                                  title="Download document"
                                  className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-indigo-500/10"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveFile(file.id, e)}
                                  title="Remove document permanently"
                                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition-all cursor-pointer flex items-center justify-center border border-red-500/10"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================= */}
            {/* 📌 RAMS ACTIVE WORKING NOTES BOARD                        */}
            {/* ========================================================= */}
            <div className="w-full max-w-2xl mx-auto mt-8 mb-10 text-left animate-in fade-in-50 slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 select-none px-1">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                    <Pin className="w-4 h-4 text-indigo-400" />
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-sans">
                      RAMS Officers Bulletin Board
                    </h2>
                    <p className="text-[10px] text-slate-450 leading-tight">
                      Draft, drag, and pin temporary operational notes & archives updates.
                    </p>
                  </div>
                </div>

                {/* Info badge */}
                <div className="text-[9px] px-2.5 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/15 text-indigo-300 font-semibold self-start sm:self-auto select-none">
                  🛡️ Permanent Local Storage Active
                </div>
              </div>

              {/* Note creator bar */}
              <form onSubmit={handleAddNote} className="bg-slate-950/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 mb-5 flex flex-col gap-4 shadow-lg text-left">
                {/* Main input Row */}
                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Pin className="w-3 h-3 text-indigo-400" />
                    Confidential Memo Content:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={130}
                    placeholder="Draft confidential memo, archiving reminder, or note... (max 130 chars)"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner font-medium"
                  />
                </div>

                {/* Options Toggles */}
                <div className="flex flex-wrap gap-2 items-center bg-slate-900/30 p-2 rounded-xl border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 select-none">
                    Configure:
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setShowEmojiPanel(!showEmojiPanel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black tracking-wider transition-all cursor-pointer ${showEmojiPanel ? 'bg-indigo-600/25 border-indigo-500/40 text-white shadow-sm ring-1 ring-indigo-500/10' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                  >
                    <Smile className="w-3.5 h-3.5 text-indigo-400" />
                    <span>EMOJIS & STAMP BADGE</span>
                    {noteEmoji ? (
                      <span className="bg-indigo-500/30 text-indigo-300 text-[9px] px-1 rounded-md ml-0.5 border border-indigo-400/20">{noteEmoji}</span>
                    ) : null}
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showEmojiPanel ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMusicPanel(!showMusicPanel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black tracking-wider transition-all cursor-pointer ${showMusicPanel ? 'bg-indigo-600/25 border-indigo-500/40 text-white shadow-sm ring-1 ring-indigo-500/10' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                  >
                    <Music className="w-3.5 h-3.5 text-indigo-400" />
                    <span>BACKGROUND MUSIC</span>
                    {(noteMusicTitle || noteYoutubeUrl) ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block ml-0.5" />
                    ) : null}
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showMusicPanel ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Emojis & Emote Quick Insertions Bar & Memo Badge Selection */}
                {showEmojiPanel && (
                  <div className="flex flex-col gap-3 bg-slate-900/40 p-3 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {/* Append Emojis/Emotes Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Smile className="w-3 h-3 text-indigo-300" />
                        Quick Insert Emojis:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {presetEmojis.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setNoteInput(prev => {
                              if (prev.length + emoji.length <= 130) {
                                return prev + emoji;
                              }
                              return prev;
                            })}
                            className="hover:scale-125 transition-transform text-xs p-0.5 cursor-pointer select-none"
                            title="Click to insert at end of memo text"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-2">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        (^_^) Quick Insert Emotes:
                      </span>
                      <div className="flex flex-wrap gap-1 font-mono text-[9px]">
                        {presetEmotes.map(emote => (
                          <button
                            key={emote}
                            type="button"
                            onClick={() => setNoteInput(prev => {
                              if (prev.length + emote.length <= 130) {
                                return prev + (prev ? ' ' : '') + emote;
                              }
                              return prev;
                            })}
                            className="hover:bg-slate-800/80 hover:text-white transition-colors duration-150 px-1.5 py-0.5 rounded bg-slate-905 text-indigo-300 border border-white/5 cursor-pointer flex-shrink-0"
                            title="Click to insert emote into memo text"
                          >
                            {emote}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Memo Sticker Badge selection */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-2">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        🏷️ Sticky Note Sticker Badge:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setNoteEmoji('')}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${!noteEmoji ? 'bg-indigo-600/25 border border-indigo-500/40 text-white' : 'bg-slate-950/40 border border-white/5 text-slate-400 hover:text-slate-200'}`}
                          title="No emoji badge"
                        >
                          None
                        </button>
                        {['📌', '💡', '🎵', '🔥', '🚀', '👍', '⚠️', '📂', '🔒', '🕒'].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setNoteEmoji(emoji)}
                            className={`hover:scale-115 transition-all text-xs p-1 rounded-md cursor-pointer ${noteEmoji === emoji ? 'bg-indigo-600/35 border border-indigo-500/60 ring-1 ring-indigo-500/20' : 'bg-slate-950/30 border border-white/5 opacity-75 hover:opacity-100'}`}
                            title={`Select '${emoji}' badge`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Music Integration Row */}
                {showMusicPanel && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/30 p-3 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1 flex-row">
                        <Music className="w-2.5 h-2.5 text-indigo-400" />
                        Optional Music Title:
                      </label>
                      <input
                        type="text"
                        maxLength={40}
                        placeholder="e.g. Archives Sync Anthem (Lofi)"
                        value={noteMusicTitle}
                        onChange={(e) => setNoteMusicTitle(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/5 rounded-lg py-1.5 px-2.5 text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 transition-all font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1 flex-row">
                        <Youtube className="w-2.5 h-2.5 text-red-500" />
                        YouTube Stream URL:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. youtube.com/watch?v=..."
                        value={noteYoutubeUrl}
                        onChange={(e) => setNoteYoutubeUrl(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/5 rounded-lg py-1.5 px-2.5 text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 transition-all font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Submit and Color Selection row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Card Theme Color:
                    </span>
                    <div className="flex gap-1.5 items-center bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
                      {noteColors.map((col) => (
                        <button
                          key={col.class}
                          type="button"
                          onClick={() => setNoteColor(col.class)}
                          title={col.name}
                          className={`w-5.5 h-5.5 rounded-full ${col.dot} border transition-all relative flex items-center justify-center cursor-pointer ${noteColor === col.class ? 'border-white scale-110 shadow-md ring-2 ring-indigo-500/30' : 'border-transparent opacity-80 hover:opacity-100'}`}
                        >
                          {noteColor === col.class && (
                            <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 select-none cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 animate-pulse" />
                    <span>Pin Note to Board</span>
                  </button>
                </div>
              </form>

              {/* Bulletin Workspace Board */}
              <div 
                ref={boardRef} 
                className="relative w-full h-[380px] sm:h-[420px] bg-slate-950/40 backdrop-blur-md rounded-2xl border border-dashed border-indigo-500/25 overflow-hidden shadow-2xl select-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"
              >
                {/* Board grid/mesh watermark */}
                <span className="absolute bottom-3 right-4 font-mono text-[9px] text-slate-650 uppercase tracking-widest select-none pointer-events-none opacity-30">
                  RAMS Digital Workspace Grid
                </span>

                {/* Empty State */}
                {notes.length === 0 && (
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 pointer-events-none select-none">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-950/30 border border-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3 animate-pulse">
                      <Pin className="w-5 h-5 rotate-45 text-indigo-455" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider select-none">
                      Board Empty
                    </h3>
                    <p className="text-[10px] text-slate-500 max-w-sm mt-1 select-none">
                      Type a memo or update above and click "Pin Note" to pin it to this live workspace.
                    </p>
                  </div>
                )}

                {/* Render Draggable Sticky Notes */}
                <AnimatePresence>
                  {notes.map((note) => {
                    return (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        style={{
                          left: `${note.x}px`,
                          top: `${note.y}px`,
                          position: 'absolute'
                        }}
                        className={`w-48 sm:w-52 p-3 rounded-xl border backdrop-blur-md shadow-lg flex flex-col justify-between ${note.color} z-10`}
                      >
                        {/* Note Drag/Grab Handle bar */}
                        <div 
                          onPointerDown={(e) => handleNoteDragStart(note.id, e)}
                          className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/5 cursor-grab active:cursor-grabbing text-[9px] font-bold tracking-widest select-none"
                          title="Click and drag here to move note"
                        >
                          <span className="flex items-center gap-1 opacity-70">
                            <Pin className="w-2.5 h-2.5 text-indigo-400 rotate-45" />
                            RAMS MEMO
                          </span>
                          
                          <span className="text-emerald-400 flex items-center gap-0.5 font-bold" title="Unlocked: Delete allowed anytime, anyday.">
                            <Unlock className="w-2.5 h-2.5 text-emerald-400" />
                            ACTIVE
                          </span>
                        </div>

                        {/* Note text box content with optional sticker badge */}
                        <div className="flex items-start gap-1.5">
                          {note.noteEmoji && (
                            <span className="text-base select-none bg-black/25 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border border-white/5 shadow-inner" title="Memo Status Sticker">
                              {note.noteEmoji}
                            </span>
                          )}
                          <p className="text-[10px] font-medium leading-relaxed break-words text-left select-text max-h-24 overflow-y-auto pr-1 flex-1">
                            {note.text}
                          </p>
                        </div>

                        {/* Optional Music Integration Badge */}
                        {(note.musicTitle || note.youtubeUrl) && (
                          <div className="mt-2.5 px-2 py-1 rounded bg-black/35 border border-white/5 flex items-center justify-between text-[8px] font-medium font-mono text-indigo-300">
                            <div className="flex items-center gap-1 overflow-hidden select-none">
                              <Music className="w-2.5 h-2.5 text-indigo-400 animate-pulse flex-shrink-0" />
                              <span className="truncate max-w-[110px]" title={note.musicTitle || "Music Stream"}>
                                {note.musicTitle || "Music Stream"}
                              </span>
                            </div>
                            {note.youtubeUrl && (
                              <a 
                                href={note.youtubeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[8px] text-red-405 hover:text-red-300 transition-colors flex items-center gap-0.5 font-bold cursor-pointer select-none bg-red-950/45 px-1.5 py-0.5 rounded border border-red-500/10"
                                title="Play stream on YouTube"
                              >
                                <Youtube className="w-2.5 h-2.5 text-red-500" />
                                PLAY
                              </a>
                            )}
                          </div>
                        )}

                        {/* Note footer and security triggers */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[8px] font-semibold select-none">
                          <span className="opacity-45 scale-95 origin-left">
                            {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveNote(note.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/30 px-1.5 py-0.5 rounded border border-red-500/10 cursor-pointer flex items-center gap-0.5 font-bold transition-colors"
                            title="Delete this note permanently"
                          >
                            <Trash2 className="w-2 h-2" />
                            DELETE
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* ========================================================= */}
            {/* 📸 RAMS OFFICERS PHOTO ALBUM & LIVE SLIDESHOW             */}
            {/* ========================================================= */}
            <div className="w-full max-w-2xl mx-auto mt-8 mb-10 text-left animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 select-none px-1">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-sans">
                      RAMS Officers Photo Album
                    </h2>
                    <p className="text-[10px] text-slate-450 leading-tight">
                      Store snapshots permanently, preview archives, & download records files.
                    </p>
                  </div>
                </div>

                {/* Counter indicator */}
                <div className="text-[10px] text-indigo-300 font-mono font-bold bg-indigo-950/40 border border-indigo-550/15 px-2.5 py-1 rounded-full">
                  🗂️ {photos.length} Snapshots Saved
                </div>
              </div>

              {/* 1. DYNAMIC SLIDESHOW - 10 RECENT PICTURES OF THE DAY */}
              {slideshowPhotos.length > 0 && currentSlide ? (
                <div className="relative w-full h-[260px] sm:h-[300px] bg-slate-950 rounded-2xl border border-white/5 overflow-hidden shadow-2xl mb-6 group">
                  {/* Backdrop Slide Image */}
                  <div className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out">
                    <img
                      src={currentSlide.url}
                      alt={currentSlide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-60 backdrop-brightness-50"
                    />
                    {/* Shadow layer gradient for extreme text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 pointer-events-none" />
                  </div>

                  {/* Slideshow Top Badges Bar */}
                  <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 select-none">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[8px] font-extrabold tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        Featured recents
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 font-mono">
                        Slideshow Engine
                      </span>
                    </div>

                    <div className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-white/5 text-slate-400">
                      {safeSlideIdx + 1} of {slideshowPhotos.length}
                    </div>
                  </div>

                  {/* Carousel Left/Right navigation over-hover arrows */}
                  {slideshowPhotos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSlideshowPlaying(false);
                          setActiveSlideIdx(prev => (prev - 1 + slideshowPhotos.length) % slideshowPhotos.length);
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-800 text-white rounded-full border border-white/5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSlideshowPlaying(false);
                          setActiveSlideIdx(prev => (prev + 1) % slideshowPhotos.length);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-800 text-white rounded-full border border-white/5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Playback Controls & Captions Overlay bottom strip */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10">
                    <div className="space-y-1 max-w-[70%] text-left">
                      <h4 className="text-[12px] sm:text-xs font-black text-white uppercase tracking-wider drop-shadow-md truncate font-sans">
                        {currentSlide.title}
                      </h4>
                      <p className="text-[9px] sm:text-[10px] text-slate-300 line-clamp-1 opacity-90">
                        {currentSlide.description || 'Permanent photographic snapshot record.'}
                      </p>
                      <span className="text-[8px] font-mono font-bold text-slate-400 block pb-1">
                        🗓️ Snapshot: {new Date(currentSlide.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Controls strip */}
                      <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
                        {/* Play/Pause toggle */}
                        <button
                          type="button"
                          onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                          className="p-1 hover:text-white transition-colors cursor-pointer text-indigo-400"
                          title={isSlideshowPlaying ? 'Pause Slideshow' : 'Start Slideshow'}
                        >
                          {isSlideshowPlaying ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                          )}
                        </button>

                        <div className="h-3 w-px bg-white/10" />

                        {/* Direct view in lightbox */}
                        <button
                          type="button"
                          onClick={() => {
                            // Find real index in parent photos array
                            const realIdx = photos.findIndex(p => p.id === currentSlide.id);
                            if (realIdx !== -1) setLightboxIndex(realIdx);
                          }}
                          className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Open Fullscreen Lens"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>

                        {/* Download slide button */}
                        <button
                          type="button"
                          onClick={() => handleDownloadPhoto(currentSlide)}
                          className="p-1 text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
                          title="Download photo record"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Tick progression dots */}
                      {slideshowPhotos.length > 1 && (
                        <div className="flex gap-1.5 py-1">
                          {slideshowPhotos.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={() => {
                                setIsSlideshowPlaying(false);
                                setActiveSlideIdx(dotIdx);
                              }}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${safeSlideIdx === dotIdx ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-650 hover:bg-slate-500'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-44 bg-slate-950/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-4 shadow-inner mb-6">
                  <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
                  <span className="text-xs text-slate-400 font-bold">No slideshow photos available</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Upload records below to build the slideshow gallery.</span>
                </div>
              )}

              {/* 2. PHOTO DIGITIZE / UPLOAD FORM */}
              <div className="bg-slate-950/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row gap-4 items-end shadow-xl">
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest select-none">
                    Snapshot Label / Description
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="Enter records folder name, date, tag... (Optional)"
                    value={photoUploadTitle}
                    onChange={(e) => setPhotoUploadTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                  />
                </div>

                <div className="w-full sm:w-auto flex flex-col gap-2 flex-shrink-0">
                  {photoUploadError && (
                    <span className="text-[9px] text-red-400 font-bold font-sans self-start">
                      ⚠️ {photoUploadError}
                    </span>
                  )}

                  {/* Hidden Input File */}
                  <input
                    type="file"
                    id="rams-album-picker"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isCompressingPhoto}
                  />

                  <label
                    htmlFor="rams-album-picker"
                    className={`bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 select-none cursor-pointer ${isCompressingPhoto ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isCompressingPhoto ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Compressing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo To Album</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* 3. ALBUM PHOTO CATALOG GRID */}
              <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 min-h-[160px]">
                <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest mb-3.5 select-none pl-1">
                  📸 Digital Snapshot Roll Gallery ({photos.length} item files)
                </h3>

                {photos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <ImageIcon className="w-8 h-8 text-slate-700 mb-2 rotate-12" />
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tight">Gallery Empty</h4>
                    <p className="text-[9px] text-slate-550 mt-1 max-w-xs">Upload pictures of directories or archives above to start permanently filing records.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((photo, index) => {
                      return (
                        <div
                          key={photo.id}
                          onClick={() => setLightboxIndex(index)}
                          className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-900 group cursor-pointer shadow-md hover:border-indigo-505/30 hover:shadow-indigo-505/5 hover:scale-[1.02] transition-all"
                        >
                          {/* Image source */}
                          <img
                            src={photo.url}
                            alt={photo.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover select-none"
                          />

                          {/* Hover action banner overlay */}
                          <div className="absolute inset-0 bg-slate-950/85 flex flex-col justify-between p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Action Indicators */}
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[8px] font-mono text-indigo-300 font-black">
                                VIEW LENS
                              </span>
                              
                              <div className="flex items-center gap-1.5">
                                {/* Download Trigger */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadPhoto(photo);
                                  }}
                                  className="p-1 rounded bg-slate-900 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                  title="Download archive image"
                                >
                                  <Download className="w-2.5 h-2.5" />
                                </button>

                                {/* Delete Custom Uploaded Photo */}
                                <button
                                  type="button"
                                  onClick={(e) => handleRemovePhoto(photo.id, e)}
                                  className="p-1 rounded bg-slate-900 text-red-400 hover:text-red-300 border border-white/5 hover:border-red-500/10 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                  title="Delete snapshot"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>

                            {/* Caption details */}
                            <div className="text-left w-full space-y-0.5 pointer-events-none select-none">
                              <h5 className="text-[10px] font-bold text-white uppercase truncate tracking-wide">
                                {photo.title}
                              </h5>
                              <div className="flex items-center justify-between text-[7.5px] text-slate-400 font-mono">
                                <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                                <span className="bg-indigo-950 px-1 py-0.2 rounded text-[7px] text-indigo-300 border border-indigo-500/10">
                                  ⬇️ {photo.downloads} downloads
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Static bottom title bar (when NOT hovering) */}
                          <div className="absolute bottom-0 left-0 right-0 bg-slate-950/70 p-1.5 text-left border-t border-white/5 select-none pointer-events-none group-hover:hidden truncate">
                            <span className="text-[9px] font-bold text-slate-200 drop-shadow-sm uppercase block truncate">
                              {photo.title}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </main>

          {/* Footer bar */}
          <footer className="bg-slate-950/80 text-[11px] md:text-xs text-slate-400 border-t border-white/10 select-none">
            <div className="px-6 py-3.5 font-bold text-slate-350 flex items-center justify-center gap-3">

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
                  title="Return to RAMS FAM Portal Homepage"
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
                  <div className="flex flex-col text-left">
                    <h1 className="font-extrabold text-white font-sans text-[11px] sm:text-xs flex items-center tracking-wider gap-1.5 uppercase">
                      📂 Records and Archives Management Section
                    </h1>
                    <span className="text-[9px] sm:text-[10px] text-slate-450 block font-mono">Department of Social Welfare and Development</span>
                    <div className="flex items-center space-x-1.5 text-[9px] font-mono text-indigo-300 mt-1">
                      <Clock className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                      <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-slate-600 select-none">•</span>
                      <span className="font-bold tabular-nums text-white">{currentTime.toLocaleTimeString()}</span>
                    </div>
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

      {/* 📌 DIGITIZED PHOTO LENS / DETAIL LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center z-[10002] select-none"
            onClick={() => setLightboxIndex(null)}
          >
            <div 
              className="relative p-4 md:p-6 max-w-4xl w-full mx-4 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute -top-12 sm:top-2 right-2 p-2 bg-slate-900/90 hover:bg-red-950 text-slate-300 rounded-full border border-white/10 hover:text-red-400 transition-colors z-50 cursor-pointer shadow-lg"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev/Next Navigation arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIndex(prev => prev !== null ? (prev - 1 + photos.length) % photos.length : null);
                    }}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/85 hover:bg-slate-800 text-white rounded-full border border-white/10 transition-all z-10 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIndex(prev => prev !== null ? (prev + 1) % photos.length : null);
                    }}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/85 hover:bg-slate-800 text-white rounded-full border border-white/10 transition-all z-10 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Frame with responsive bound constraints */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 max-h-[60vh] sm:max-h-[70vh] flex items-center justify-center">
                <img
                  src={photos[lightboxIndex].url}
                  alt={photos[lightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] sm:max-h-[70vh] w-full object-contain pointer-events-none select-none"
                />
              </div>

              {/* Caption metadata card info overlay */}
              <div className="mt-4 bg-slate-900/90 border border-white/10 px-5 py-3.5 rounded-2xl w-full max-w-2xl text-center shadow-lg">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                  {photos[lightboxIndex].title}
                </h3>
                {photos[lightboxIndex].description && (
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    {photos[lightboxIndex].description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[10px] font-mono select-none">
                  <span className="text-slate-500 font-bold">
                    🛡️ RAMS SECURE SNAPSHOT
                  </span>
                  <span className="text-slate-350 font-semibold text-[9px]">
                    Pinned: {new Date(photos[lightboxIndex].createdAt).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadPhoto(photos[lightboxIndex])}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold border border-indigo-500/10 cursor-pointer shadow-sm transition-colors text-[9px] uppercase tracking-wide"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download photo</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
