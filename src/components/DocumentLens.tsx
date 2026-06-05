import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, FileText, Check, AlertCircle, Eye, RefreshCw, Upload, Sparkles, X } from 'lucide-react';
import { Language } from '../types';

interface DocumentLensProps {
  lang: Language;
  onClose: () => void;
  onFilterByProgram?: (query: string) => void;
}

interface PresetDoc {
  id: string;
  name: Record<Language, string>;
  type: string;
  imageRep: string; // Gradient style representation of document
  detectedText: string[];
  findings: Record<Language, string>;
  matches: string[]; // Program acronyms it qualifies for
  isValid: boolean;
}

export default function DocumentLens({ lang, onClose, onFilterByProgram }: DocumentLensProps) {
  const [selectedDoc, setSelectedDoc] = useState<PresetDoc | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<PresetDoc | null>(null);
  const [customFile, setCustomFile] = useState<string | null>(null);

  const presets: PresetDoc[] = [
    {
      id: 'doc-indigency',
      name: {
        en: 'Barangay Certificate of Indigency',
        fil: 'Barangay Certificate of Indigency',
        ceb: 'Barangay Certificate sa Pagka-indigent'
      },
      type: 'Official Barangay Clearance',
      imageRep: 'from-blue-500/10 via-indigo-500/5 to-slate-500/10 border-blue-200',
      detectedText: ['REPUBLIC OF THE PHILIPPINES', 'OFFICE OF THE BARANGAY CHAIRMAN', 'TO WHOM IT MAY CONCERN', 'SUBJECT: CERTIFICATE OF INDIGENCY', 'APPLICANT: DELA CRUZ FAMILY', 'MONTHLY INCOME: BELOW THRESHOLD'],
      findings: {
        en: 'Validated indigent status. Ready for AICS financial rescue and 4Ps family target.',
        fil: 'Napatunayang kapos sa kita. Handa para sa AICS financial aid at pagtatasa sa 4Ps.',
        ceb: 'Gipamatud-an nga ubos og kita. Andam alang sa AICS ug 4Ps.'
      },
      matches: ['4ps', 'aics', 'slp'],
      isValid: true
    },
    {
      id: 'doc-senior',
      name: {
        en: 'OSCA Senior Citizen ID Card',
        fil: 'OSCA Senior Citizen ID Card',
        ceb: 'OSCA Senior Citizen ID Card'
      },
      type: 'National ID card',
      imageRep: 'from-amber-500/10 via-yellow-500/5 to-orange-500/10 border-amber-300',
      detectedText: ['OFFICE OF SENIOR CITIZENS AFFAIRS', 'REPUBLIC OF THE PHILIPPINES', 'SENIOR ID NO: OSCA-10291', 'NAME: SALVADOR MACARAEG', 'DATE OF BIRTH: MAY 12, 1963', 'AGE APPROVED: 63 YEARS OLD'],
      findings: {
        en: 'Verified age 63. Meets the 60+ requirements for Senior Social Pension Program.',
        fil: 'Na-verify ang edad na 63. Pasok sa 60+ eligibility para sa Social Pension ng Senior.',
        ceb: 'Na-verify ang edad nga 63. Pasok sa katuigang 60+ alang sa Sosyal nga Pensiyon.'
      },
      matches: ['socpen', 'aics'],
      isValid: true
    },
    {
      id: 'doc-medical',
      name: {
        en: 'Hospital Clinical Abstract / Medical Cert',
        fil: 'Hospital Clinical Abstract / Medical Cert',
        ceb: 'Clinical Abstract sa Ospital'
      },
      type: 'Certified Medical Record',
      imageRep: 'from-rose-500/10 via-pink-500/5 to-slate-500/10 border-rose-200',
      detectedText: ['METROPOLITAN GENERAL HOSPITAL', 'CLINICAL LAB REPORT & MEDICAL ABSTRACT', 'DIAGNOSIS: CORONARY ARTERY DISEASE', 'OPERATION REQUIRED: ANGIOPLASTY', 'REQUIRED MEDS: MAINTENANCE STEROIDS', 'TOTAL FEES ESTIMATED: PHP 85,000'],
      findings: {
        en: 'Detected medical emergency crisis detailing ₱85,000 estimated costs. Qualifies for DSWD-AICS Guarantee Letter (GL).',
        fil: 'May krisis pangkalusugan na may tinatayang halagang ₱85,000. Kwalipikado sa DSWD-AICS Guarantee Letter.',
        ceb: 'Adunay lisud nga medikal nga gastuson nga ₱85,000. Kwalipikado sa DSWD-AICS Guarantee Letter (GL).'
      },
      matches: ['aics'],
      isValid: true
    },
    {
      id: 'doc-invalid',
      name: {
        en: 'Meralco Electric Bill (High Usage)',
        fil: 'Kuryente Bill (Mataas na Kunsumo)',
        ceb: 'Balanon sa Sugas (Mero daku)'
      },
      type: 'Utility Spending Statement',
      imageRep: 'from-slate-500/20 via-slate-500/5 to-slate-850/20 border-red-200',
      detectedText: ['MANILA ELECTRIC COMPANY (MERALCO)', 'MONTHLY STATEMENT OF ACCOUNT', 'AIR-CONDITIONER LOAD: 3 CORNER SPLIT', 'TOTAL KWH CONSUMED: 840 KWH', 'TOTAL AMOUNT DUE: PHP 14,820.00', 'PAYMENT RECORD: DELIVERED BY APP'],
      findings: {
        en: 'Usage of 840 kWh / monthly cost of ₱14,820.00 is computed as high-expenditure. Might NOT meet indigent threshold guidelines.',
        fil: 'Ang nakonsumong 840 kWh at halagang ₱14,820 ay lagpas sa indigent status. Hindi pasok sa pamantayan ng kahirapan.',
        ceb: 'Ang konsumo nga 840 kWh ug balanon nga ₱14,820 sobra ra alang sa usa ka indigent. Dili kwalipikado sa cash grants.'
      },
      matches: [],
      isValid: false
    }
  ];

  const triggerScan = (doc: PresetDoc) => {
    setSelectedDoc(doc);
    setScanning(true);
    setScanResult(null);

    // Simulate scanning beam animation
    setTimeout(() => {
      setScanning(false);
      setScanResult(doc);
    }, 2200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFile(file.name);
      
      // Simulate scanning the custom file as if it was a custom indigency slip
      const mockCustomDoc: PresetDoc = {
        id: 'custom-uploaded',
        name: {
          en: `Uploaded: ${file.name}`,
          fil: `Uploaded: ${file.name}`,
          ceb: `Uploaded: ${file.name}`
        },
        type: 'Simulated Uploaded Document',
        imageRep: 'from-emerald-500/10 via-teal-500/5 to-slate-500/10 border-emerald-300',
        detectedText: ['SCANNING UPLOADED JPEG/PNG IMAGE', 'OCR ANALYZING WRITTEN INK CERTIFICATE', 'TIMESTAMP: JUNE 2026', 'LOCATIVE HEURISTIC: BRGY SECTOR OUTPOST', 'INDIGENT DECLARATION CONFIRMED BY TRUSTEE'],
        findings: {
          en: 'Document recognized as an Indigency Declaration. Qualifies household for 4Ps enrollment assessment or emergency AICS.',
          fil: 'Ang dokumento ay kinilala bilang Sertipiko ng Indigency. Kwalipikado sa 4Ps at emergency AICS.',
          ceb: 'Giila ang dokumento isip Barangay Clearance. Kwalipikado alang sa 4Ps ug dinalian nga tabang sa AICS.'
        },
        matches: ['4ps', 'aics', 'slp'],
        isValid: true
      };
      
      setSelectedDoc(mockCustomDoc);
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        setScanResult(mockCustomDoc);
      }, 2200);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 z-[9999] animate-in fade-in duration-350">
      <div className="bg-[#040815] rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full flex flex-col md:flex-row h-[92vh] md:h-auto max-h-[640px] border border-white/10">
        
        {/* Left Side: Live simulated viewfinder frame */}
        <div className="relative bg-slate-950 flex-1 flex flex-col justify-between p-4 text-white overflow-hidden select-none min-h-[220px] md:min-h-0">
          
          {/* Top header state */}
          <div className="flex items-center justify-between z-10">
            <span className="flex items-center text-[10px] md:text-xs font-mono bg-slate-900/80 px-2.5 py-1 rounded-full border border-white/5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
              {lang === 'en' ? 'DSWD DOCUMENT LENS (OCR)' : 'DSWD DOKUMENTO LENS'}
            </span>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors"
              id="close-lens-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="absolute inset-4 border border-white/15 rounded-2xl flex flex-col items-center justify-center pointer-events-none">
            {/* Viewfinder brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-md"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-md"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-md"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-md"></div>

            {/* Bounding vector boxes simulating OCR reading */}
            <AnimatePresence>
              {scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/20">
                  {/* Glowing Scanner Beam */}
                  <motion.div 
                    initial={{ y: -100 }}
                    animate={{ y: 100 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)] z-10"
                  />
                  
                  {/* Bouncing texts representing scanning data */}
                  <div className="space-y-1.5 text-[9px] font-mono text-emerald-400 tracking-wider">
                    <p className="animate-pulse">PARSING DOCUMENT HEADERS...</p>
                    <p className="opacity-75">INTERPRETING LOCAL STAMP VALUES...</p>
                    <p className="opacity-40 font-bold text-center">CHECKING TAX & INDIGENCY INDICATORS...</p>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {!selectedDoc && (
              <div className="text-center p-4">
                <FileText className="w-10 h-10 text-slate-700 mx-auto mb-2 animate-bounce" />
                <p className="text-xs text-slate-400 font-sans">
                  {lang === 'en' ? 'Select or Upload a document to scan...' : 'Pumili ng dokumento para i-scan...'}
                </p>
              </div>
            )}

            {selectedDoc && !scanning && !scanResult && (
              <div className="text-center p-4">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-pulse" />
                <p className="text-xs text-slate-300 font-sans font-medium">
                  {selectedDoc.name[lang]}
                </p>
                <button 
                  onClick={() => triggerScan(selectedDoc)} 
                  className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-4 rounded-full text-xs pointer-events-auto shadow transition-colors"
                  id="start-ocr-scan-btn"
                >
                  {lang === 'en' ? 'Analyze Document' : 'Suriin ang Dokumento'}
                </button>
              </div>
            )}

            {scanResult && !scanning && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-3 rounded-xl bg-slate-900/90 p-4 border border-emerald-500/30 flex flex-col justify-between overflow-y-auto pointer-events-auto"
              >
                <div>
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Check className="w-4 h-4 bg-emerald-500/20 rounded-full p-0.5" />
                    <span className="text-[10px] md:text-xs font-mono font-bold tracking-wider">{lang === 'en' ? 'RECOGNIZED DETAILS' : 'DETALYE NG DOKUMENTO'}</span>
                  </div>
                  <div className="mt-2.5 space-y-1 font-mono text-[9px] md:text-[10px] text-slate-300 text-left bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {scanResult.detectedText.map((t, i) => (
                      <p key={i} className="flex">
                        <span className="text-emerald-500 mr-1 bg-emerald-500/10 px-1 rounded">✓</span>
                        {t}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800">
                  <span className="text-[9px] font-bold uppercase text-slate-400 font-sans block">{lang === 'en' ? 'OCR Assistance Match' : 'Pagtutugma sa Program'}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scanResult.matches.map(m => (
                      <span key={m} className="bg-blue-600/20 text-blue-400 font-mono font-extrabold text-[9px] px-2 py-0.5 rounded border border-blue-600/30 uppercase">
                        {m} Eligible
                      </span>
                    ))}
                    {scanResult.matches.length === 0 && (
                      <span className="bg-red-500/20 text-red-400 font-mono text-[9px] px-2 py-0.5 rounded border border-red-500/30">
                        {lang === 'en' ? 'No clear program match' : 'Walang tugmang programa'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="z-10 pb-1 flex justify-center text-[10px] text-slate-500 font-sans">
            {lang === 'en' ? 'Hold document steady in front of your camera' : 'I-tutok ang kapirasong papel sa camera'}
          </div>
        </div>

        {/* Right Side: Select presetted files to scan */}
        <div className="flex-1 p-5 md:p-6 bg-slate-950 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-sans font-bold text-white text-sm md:text-base flex items-center">
                <Camera className="w-4 h-4 text-rose-500 mr-2" />
                {lang === 'en' ? 'Select Document to Scan' : 'Pumili ng Papeles'}
              </h4>
              
              {/* Reset view */}
              {(selectedDoc || customFile) && (
                <button 
                  onClick={() => { setSelectedDoc(null); setScanResult(null); setCustomFile(null); }}
                  className="text-slate-450 hover:text-white text-xs font-semibold flex items-center"
                  id="reset-scanner-view"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {lang === 'en' ? 'Reset' : 'Ulitin'}
                </button>
              )}
            </div>

            {/* List of preset simulated files */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1" id="preset-documents-list">
              {presets.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => triggerScan(doc)}
                  className={`w-full text-left p-3 border-2 rounded-xl transition-all font-sans flex items-center space-x-3 bg-slate-900/40 hover:bg-slate-900 ${
                    selectedDoc?.id === doc.id ? 'border-indigo-505 border-indigo-500 bg-indigo-500/10' : 'border-white/5'
                  }`}
                  id={`preset-${doc.id}`}
                >
                  <div className={`p-2 bg-gradient-to-br ${doc.imageRep} rounded-lg border flex-shrink-0`}>
                    <FileText className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs md:text-sm text-slate-200 truncate">{doc.name[lang]}</p>
                    <p className="text-[10px] text-slate-450 font-mono font-medium mt-0.5">{doc.type}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Simulated file upload block */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <label 
                className="flex items-center justify-center border-2 border-dashed border-white/10 hover:border-indigo-505 hover:border-indigo-500 bg-slate-900/20 hover:bg-slate-900/40 rounded-xl p-3 cursor-pointer text-xs font-semibold text-slate-300 hover:text-white font-sans transition-all"
                id="fake-file-upload-label"
              >
                <Upload className="w-4 h-4 mr-2 text-indigo-400" />
                <span>
                  {customFile ? `Uploaded: ${customFile}` : (lang === 'en' ? 'Upload Custom JPEG/PNG Slip' : 'I-upload ang sariling larawan')}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Bottom Results Board inside details list */}
          <div className="mt-4 pt-4 border-t border-white/10" id="scan-results-board">
            {scanResult ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  scanResult.isValid ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-950/10 border-rose-500/20 text-rose-300'
                }`}
              >
                <div>
                  <div className="flex items-center font-bold text-xs md:text-sm mb-1.5">
                    {scanResult.isValid ? (
                      <Check className="w-4 h-4 bg-emerald-500 text-white rounded-full p-0.5 mr-1.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 bg-rose-500 text-white rounded-full p-0.5 mr-1.5 flex-shrink-0" />
                    )}
                    <span>{lang === 'en' ? 'Lens Eligibility Verdict' : 'Hatol ng DSWD Lens'}</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed font-sans">{scanResult.findings[lang]}</p>
                </div>

                {scanResult.isValid && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
                    {onFilterByProgram && scanResult.matches.length > 0 && (
                      <button
                        onClick={() => {
                          onFilterByProgram(scanResult.matches[0]);
                          onClose();
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center transition-colors shadow-lg shadow-indigo-650/15"
                        id="apply-program-filter-btn"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        {lang === 'en' ? `Browse ${scanResult.matches[0].toUpperCase()} details` : `Tingnan ang detalye ng ${scanResult.matches[0].toUpperCase()}`}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="p-4 bg-slate-900/20 rounded-xl border border-dotted border-white/10 text-center text-[11px] md:text-xs text-slate-400 italic font-sans leading-normal">
                {lang === 'en' ? 'Select a mock certificate or OSCA Senior Card on the list above to simulate rapid OCR scan check.' : 'Pumili sa listahan sa itaas para masimula ang mabilis na automatic scanning ng mga dokumento.'}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
