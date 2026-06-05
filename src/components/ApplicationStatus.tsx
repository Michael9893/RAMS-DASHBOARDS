import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Search, FileSignature, CheckCircle2, AlertCircle, Clock, Check, HeartHandshake } from 'lucide-react';
import { Language, Application } from '../types';
import { DSWD_PROGRAMS, MOCK_APPLICATIONS } from '../data';

interface ApplicationStatusProps {
  lang: Language;
  preselectedProgramId?: string;
  onReferenceCodeFound?: (appl: Application) => void;
}

export default function ApplicationStatus({ lang, preselectedProgramId = '4ps', onReferenceCodeFound }: ApplicationStatusProps) {
  const [activeTab, setActiveTab] = useState<'track' | 'apply'>('track');
  
  // States for tracking
  const [trackCode, setTrackCode] = useState('');
  const [trackedApplication, setTrackedApplication] = useState<Application | null>(null);
  const [searchError, setSearchError] = useState('');

  // States for applying
  const [applicantName, setApplicantName] = useState('');
  const [applicantAge, setApplicantAge] = useState<number | ''>('');
  const [applicantRegion, setApplicantRegion] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(preselectedProgramId);
  const [successCode, setSuccessCode] = useState('');
  const [successAppl, setSuccessAppl] = useState<Application | null>(null);

  // Load applications from localStorage or defaults
  const [allApplications, setAllApplications] = useState<Application[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dswd_applications');
    if (saved) {
      try {
        setAllApplications(JSON.parse(saved));
      } catch (e) {
        setAllApplications(MOCK_APPLICATIONS);
      }
    } else {
      localStorage.setItem('dswd_applications', JSON.stringify(MOCK_APPLICATIONS));
      setAllApplications(MOCK_APPLICATIONS);
    }
  }, []);

  useEffect(() => {
    if (preselectedProgramId) {
      setSelectedProgram(preselectedProgramId);
    }
  }, [preselectedProgramId]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setTrackedApplication(null);

    const code = trackCode.trim().toUpperCase();
    if (!code) return;

    const found = allApplications.find(app => app.referenceCode === code || app.id === code);
    if (found) {
      setTrackedApplication(found);
      if (onReferenceCodeFound) {
        onReferenceCodeFound(found);
      }
    } else {
      setSearchError(
        lang === 'en' ? 'Reference Code not found. Please try "DSWD-4PS-2026-9821" or file a new claim below!' : 
        lang === 'fil' ? 'Hindi mahanap ang reference code. Gamitin ang "DSWD-4PS-2026-9821" o mag-file sa ibaba!' : 
        'Wala makit-i ang code. Gamita ang "DSWD-SOCPEN-2026-7264" o pag-rehistro sa ubos!'
      );
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantAge || !applicantRegion) return;

    const matchedProg = DSWD_PROGRAMS.find(p => p.id === selectedProgram);
    const code = `DSWD-${selectedProgram.toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      programId: selectedProgram,
      programName: matchedProg ? `${matchedProg.acronym} Support` : selectedProgram.toUpperCase(),
      applicantName,
      age: Number(applicantAge),
      location: applicantRegion,
      status: 'Submitted',
      date: new Date().toISOString().split('T')[0],
      referenceCode: code
    };

    const updated = [newApp, ...allApplications];
    localStorage.setItem('dswd_applications', JSON.stringify(updated));
    setAllApplications(updated);

    setSuccessCode(code);
    setSuccessAppl(newApp);

    // Clear form
    setApplicantName('');
    setApplicantAge('');
    setApplicantRegion('');
  };

  // Helper for tracking steps
  const getStatusStep = (status: Application['status']) => {
    switch (status) {
      case 'Submitted': return 1;
      case 'Under Review': return 2;
      case 'Approved': return 3;
      case 'Disbursed': return 4;
      default: return 1;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl" id="application-status-container">
      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-slate-950/80">
        <button
          onClick={() => { setActiveTab('track'); setSuccessCode(''); }}
          className={`flex-1 py-3.5 text-center text-xs md:text-sm font-bold font-sans flex items-center justify-center border-b-2 transition-all ${
            activeTab === 'track' ? 'border-indigo-500 text-indigo-400 bg-slate-900/10' : 'border-transparent text-slate-400 hover:text-white'
          }`}
          id="tab-track-application"
        >
          <Search className="w-4 h-4 mr-1.5" />
          {lang === 'en' ? 'Track Application Status' : lang === 'fil' ? 'Subaybayan ang Aplikasyon' : 'Susiha ang Imong Registro'}
        </button>
        <button
          onClick={() => { setActiveTab('apply'); setTrackedApplication(null); setSearchError(''); }}
          className={`flex-1 py-3.5 text-center text-xs md:text-sm font-bold font-sans flex items-center justify-center border-b-2 transition-all ${
            activeTab === 'apply' ? 'border-indigo-500 text-indigo-400 bg-slate-900/10' : 'border-transparent text-slate-400 hover:text-white'
          }`}
          id="tab-apply-application"
        >
          <FileSignature className="w-4 h-4 mr-1.5" />
          {lang === 'en' ? 'File Online Draft Intake' : lang === 'fil' ? 'Magpasa ng Pre-Registration' : 'Magpalista sa Internet'}
        </button>
      </div>

      <div className="p-5 md:p-7">
        {/* TRACK APPLICATION TAB */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder={lang === 'en' ? 'Enter Reference Code (e.g. DSWD-4PS-2026-9821)' : 'Ipasok ang Reference Code (e.g. DSWD-4PS-2026-9821)'}
                className="flex-1 border border-white/10 rounded-xl px-4 py-2.5 text-xs md:text-sm outline-none focus:border-indigo-505 focus:border-indigo-500 bg-slate-950 text-white font-mono font-medium focus:ring-1 focus:ring-indigo-500/20 transition-all"
                id="tracking-code-input"
              />
              <button
                type="submit"
                className="bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 text-white text-xs md:text-sm font-bold px-4 md:px-6 rounded-xl transition-all font-sans hover:shadow-lg shadow-indigo-600/15"
                id="submit-tracking-code"
              >
                {lang === 'en' ? 'Track' : 'Subaybayan'}
              </button>
            </form>

            {searchError && (
              <div className="p-3 bg-rose-950/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-start space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-455 text-rose-400 mt-0.5 flex-shrink-0" />
                <span className="leading-normal">{searchError}</span>
              </div>
            )}

            {trackedApplication ? (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 border border-white/5 rounded-2xl p-4 md:p-5 bg-slate-950/40">
                
                {/* Meta details */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-indigo-400 bg-indigo-500/15 px-2.5 py-0.5 rounded-full font-mono border border-indigo-500/10">
                      {trackedApplication.programName}
                    </span>
                    <h5 className="font-bold text-white text-sm md:text-base mt-2 font-sans">{trackedApplication.applicantName}</h5>
                    <p className="text-[11px] text-slate-405 text-slate-400 mt-0.5 font-sans font-medium">
                      {lang === 'en' ? `Age: ${trackedApplication.age} | Base Location: ${trackedApplication.location}` : `Edad: ${trackedApplication.age} | Lokasyon: ${trackedApplication.location}`}
                    </p>
                  </div>
                  <div className="text-right md:mt-0 mt-1">
                    <span className="text-[10px] block text-slate-500 font-mono font-bold tracking-tight">REF CODE</span>
                    <span className="font-mono text-xs md:text-sm font-bold text-indigo-300 bg-slate-950 border border-white/5 px-2.5 py-1 rounded-md">{trackedApplication.referenceCode}</span>
                    <span className="text-[10px] block text-slate-500 font-mono mt-1.5 font-medium">{lang === 'en' ? `Filed: ${trackedApplication.date}` : `Petsa: ${trackedApplication.date}`}</span>
                  </div>
                </div>

                {/* VISUAL STEP TIMELINE */}
                <div className="py-4 px-2">
                  <div className="relative flex items-center justify-between w-full">
                    {/* Background Progress bar */}
                    <div className="absolute left-6 right-6 top-[15px] h-1 bg-slate-800 -z-10 rounded-full" />
                    {/* Active Progress bar fill */}
                    <div 
                      className="absolute left-6 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                      style={{ 
                        width: trackedApplication.status === 'Disbursed' ? 'calc(100% - 48px)' :
                               trackedApplication.status === 'Approved' ? '66%' :
                               trackedApplication.status === 'Under Review' ? '33%' : '0%' 
                      }} 
                    />

                    {/* Step 1: Submitted */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-sm ${
                        getStatusStep(trackedApplication.status) >= 1 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}>
                        {getStatusStep(trackedApplication.status) >= 1 ? <Check className="w-4 h-4" /> : '1'}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-300 mt-2 text-center max-w-[70px] leading-tight">
                        {lang === 'en' ? 'Documents Received' : 'Natanggap na'}
                      </span>
                    </div>

                    {/* Step 2: Under Review */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-sm ${
                        getStatusStep(trackedApplication.status) >= 2 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}>
                        {getStatusStep(trackedApplication.status) >= 2 ? <Check className="w-4 h-4" /> : '2'}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-300 mt-2 text-center max-w-[75px] leading-tight">
                        {lang === 'en' ? 'Social Worker Assessment' : 'Sinusuri ng Social Worker'}
                      </span>
                    </div>

                    {/* Step 3: Approved */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-sm ${
                        getStatusStep(trackedApplication.status) >= 3 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}>
                        {getStatusStep(trackedApplication.status) >= 3 ? <Check className="w-4 h-4" /> : '3'}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-300 mt-2 text-center max-w-[70px] leading-tight">
                        {lang === 'en' ? 'Approved & Enrolled' : 'Inaprubahan'}
                      </span>
                    </div>

                    {/* Step 4: Disbursed */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-sm ${
                        getStatusStep(trackedApplication.status) >= 4 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}>
                        {getStatusStep(trackedApplication.status) >= 4 ? <Check className="w-4 h-4" /> : '4'}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-300 mt-2 text-center max-w-[70px] leading-tight">
                        {lang === 'en' ? 'Pecuniary Disbursed' : 'Naipamahagi na'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Log instructions */}
                <div className="p-3.5 bg-slate-950/30 border border-white/5 rounded-xl text-xs space-y-1 text-slate-300 leading-normal font-sans font-medium">
                  <span className="font-bold text-indigo-400 block">💬 Status Update Notes:</span>
                  {trackedApplication.status === 'Submitted' && (
                    <p>{lang === 'en' ? 'The system has logged your draft request. A regional evaluator will visit your address for structural verification within 3 to 10 days.' : 'Narehistro na ang iyong draft. Maghintay ng pagbisita ng evaluator sa iyong bahay sa loob ng 3-10 araw.'}</p>
                  )}
                  {trackedApplication.status === 'Under Review' && (
                    <p>{lang === 'en' ? 'Your claim is now assigned to a DSWD caseworker. Medical receipts and indigent records are being checked with civil lists.' : 'Sinusuri ng nakatalagang caseworker ang iyong reseta ng gamot o Barangay Certificate sa ating regional databases.'}</p>
                  )}
                  {trackedApplication.status === 'Approved' && (
                    <p>{lang === 'en' ? 'Payout authorized! You can present their reference code for immediate cash release in the next barangay distribution assembly.' : 'Aprubado na ang badyet! Maaari mong dalhin ang reference code na ito sa susunod na pamamahagi (payout) ng inyong barangay.'}</p>
                  )}
                  {trackedApplication.status === 'Disbursed' && (
                    <p>{lang === 'en' ? 'Funds have been delivered to your Landbank Cash Card or received directly via over-the-counter voucher.' : 'Matagumpay na naipadala ang pondo sa iyong Landbank Cash Card o natanggap na ng aplikante.'}</p>
                  )}
                </div>

              </motion.div>
            ) : (
              <div className="py-6 border border-dashed border-white/10 rounded-2xl text-center text-slate-450 text-xs font-sans italic bg-slate-950/20">
                {lang === 'en' ? 'Search suggestions: Type "DSWD-4PS-2026-9821" to view a processed timeline demo.' : 'Subukang hanapin ang code na "DSWD-4PS-2026-9821" para sa live timeline presentation.'}
              </div>
            )}
          </div>
        )}

        {/* FILE ONLINE DRAFT FORM TAB */}
        {activeTab === 'apply' && (
          <div className="space-y-4">
            {!successCode ? (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Selected Program Option */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{lang === 'en' ? 'Social Welfare Program' : 'Programa ng Tulong'}</label>
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="border border-white/10 rounded-xl px-3 py-2 bg-slate-950 text-slate-200 outline-none focus:border-indigo-500 text-xs md:text-sm font-semibold select-dark-custom"
                      id="apply-program-select"
                    >
                      {DSWD_PROGRAMS.map(p => (
                        <option key={p.id} value={p.id} className="bg-slate-950 text-white">{p.acronym} - {p.name[lang]}</option>
                      ))}
                    </select>
                  </div>

                  {/* Name field */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{lang === 'en' ? 'Full Applicant Name' : 'Kumpletong Pangalan ng Aplikante'}</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Maria Clara Santos"
                      className="border border-white/10 rounded-xl px-3 py-2 bg-slate-950 text-slate-100 outline-none focus:border-indigo-500 text-xs md:text-sm font-medium"
                      id="apply-name-input"
                    />
                  </div>

                  {/* Age field */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{lang === 'en' ? 'Age' : 'Edad'}</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="125"
                      value={applicantAge}
                      onChange={(e) => {
                        const val = e.target.value;
                        setApplicantAge(val === '' ? '' : Number(val));
                      }}
                      placeholder="e.g. 62"
                      className="border border-white/10 rounded-xl px-3 py-2 bg-slate-950 text-slate-100 outline-none focus:border-indigo-500 text-xs md:text-sm font-medium"
                      id="apply-age-input"
                    />
                  </div>

                  {/* Location field */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{lang === 'en' ? 'Hometown Residence / Region' : 'Lugar ng Tirahan / Lalawigan'}</label>
                    <input
                      type="text"
                      required
                      value={applicantRegion}
                      onChange={(e) => setApplicantRegion(e.target.value)}
                      placeholder="e.g. Carcar City, Cebu"
                      className="border border-white/10 rounded-xl px-3 py-2 bg-slate-950 text-slate-100 outline-none focus:border-indigo-500 text-xs md:text-sm font-medium"
                      id="apply-location-input"
                    />
                  </div>

                </div>

                <div className="text-[10px] text-slate-450 italic font-sans leading-normal">
                  ⚠️ {lang === 'en' ? 'Disclaimer: This online form is a mock intake draft for simulating requirements check within this AI Studio web workspace.' : 'Pansariling Paalala: Ang form na ito ay isang mock draft tool upang makita ang proseso ng pagpapatala.'}
                </div>

                <button
                  type="submit"
                  disabled={!applicantName || applicantAge === '' || !applicantRegion}
                  className="w-full bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm disabled:opacity-30 transition-all shadow-lg shadow-indigo-650/15 cursor-pointer"
                  id="submit-new-application"
                >
                  {lang === 'en' ? 'Register Draft Claim' : 'Isumite ang Pre-Registration'}
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 border border-emerald-500/20 bg-emerald-950/10 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-455 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-white text-base">{lang === 'en' ? 'Draft Filed Successfully!' : 'Matagumpay na Naipadala!'}</h5>
                  <p className="text-xs text-slate-400 mt-1.5 font-sans">
                    {lang === 'en' ? 'Your official tracking reference code has been generated. Use this code to trace review updates.' : 'Nagawa na ang inyong pampamilyang reference code. Maaari mo itong gamitin sa pagsubaybay.'}
                  </p>
                </div>

                <div className="bg-slate-950 border border-white/5 rounded-xl p-3 inline-block shadow-inner font-mono text-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">{lang === 'en' ? 'Tracking Reference Code' : 'Reference Code sa Pagsubaybay'}</span>
                  <span className="text-base font-extrabold text-indigo-400 tracking-wide">{successCode}</span>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => {
                      if (successAppl) {
                        setTrackCode(successCode);
                        setTrackedApplication(successAppl);
                        setActiveTab('track');
                        setSuccessCode('');
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center shadow-lg shadow-indigo-600/15 cursor-pointer"
                    id="simulate-track-of-new"
                  >
                    <Search className="w-3.5 h-3.5 mr-1" />
                    {lang === 'en' ? 'Track Progress now' : 'Subaybayan na'}
                  </button>
                  <button
                    onClick={() => setSuccessCode('')}
                    className="border border-white/5 bg-slate-900/45 text-slate-300 hover:bg-slate-900 text-xs font-bold py-1.5 px-4 rounded-lg transition-all"
                    id="simulate-apply-another"
                  >
                    {lang === 'en' ? 'File Another' : 'Magpasa Muli'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-950/50 px-5 py-3 border-t border-white/5 flex items-center justify-center text-[11px] text-slate-500 font-sans font-semibold">
        <HeartHandshake className="w-4 h-4 text-rose-500 mr-1.5" />
        {lang === 'en' ? 'Bawat Buhay Mahalaga sa DSWD - Always Serving the Nation with Integrity.' : 'Bawat Buhay Mahalaga sa DSWD - Tapat na Paglilingkod.'}
      </div>
    </div>
  );
}
