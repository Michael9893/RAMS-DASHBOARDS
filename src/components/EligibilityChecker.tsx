import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, ChevronRight, RotateCcw, Award, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface EligibilityCheckerProps {
  lang: Language;
  onApplyForProgram: (programId: string) => void;
}

export default function EligibilityChecker({ lang, onApplyForProgram }: EligibilityCheckerProps) {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number | ''>('');
  const [isIndigent, setIsIndigent] = useState<boolean | null>(null);
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [isPregnant, setIsPregnant] = useState<boolean | null>(null);
  const [hasPension, setHasPension] = useState<boolean | null>(null);
  const [hasCrisis, setHasCrisis] = useState<boolean | null>(null);
  const [hasLivelihoodInterest, setHasLivelihoodInterest] = useState<boolean | null>(null);

  const reset = () => {
    setStep(1);
    setAge('');
    setIsIndigent(null);
    setHasChildren(null);
    setIsPregnant(null);
    setHasPension(null);
    setHasCrisis(null);
    setHasLivelihoodInterest(null);
  };

  // Determine eligible programs
  const getResults = () => {
    const qualified: { id: string; name: string; matchReason: string; benefit: string }[] = [];
    const ageNum = Number(age);

    // 1. Social Pension
    if (ageNum >= 60 && isIndigent === true && hasPension === false) {
      qualified.push({
        id: 'socpen',
        name: lang === 'en' ? 'Social Pension for Indigent Seniors' : lang === 'fil' ? 'Social Pension para sa Mahihirap na Elder' : 'Sosyal nga Pensiyon para sa Tigulang',
        benefit: '₱1,000 / month cash stipend',
        matchReason: lang === 'en' ? 'You are 60+ years old, indigent, and do not receive other GSIS/SSS pensions.' : lang === 'fil' ? 'Ikaw ay may edad 60+ gulang, indigent, at walang tinatanggap na ibang pension.' : 'Ikaw nag-edad og 60+ anyos, indigent, ug walay nadawat nga laing pensiyon.'
      });
    }

    // 2. 4Ps
    if (isIndigent === true && (hasChildren === true || isPregnant === true)) {
      qualified.push({
        id: '4ps',
        name: lang === 'en' ? 'Pantawid Pamilyang Pilipino Program (4Ps)' : 'Pantawid Pamilyang Pilipino Program (4Ps)',
        benefit: 'Up to ₱3,400+ monthly cash for health & schooling',
        matchReason: lang === 'en' ? 'You are registered/qualified as indigent with pregnant family members or school-aged children (0-18).' : lang === 'fil' ? 'Ikaw ay kwalipikado bilang pamilyang mahirap na may buntis o nag-aaral na mga anak (0-18).' : 'Ikaw giila nga kabus nga adunay mabdos o nag-eskwela nga mga anak (0-18).'
      });
    }

    // 3. AICS Crisis program
    if (hasCrisis === true) {
      qualified.push({
        id: 'aics',
        name: lang === 'en' ? 'Assistance to Individuals in Crisis Situations (AICS)' : lang === 'fil' ? 'Tulong sa Oras ng Krisis (AICS)' : 'Tabang sa Oras sa Krisis (AICS)',
        benefit: 'Direct medical, burial, study, or transportation cash assistance',
        matchReason: lang === 'en' ? 'You answered yes to experiencing an unexpected medical, emergency or bereavement crisis.' : lang === 'fil' ? 'Nakararanas ka ng hindi inaasahang krisis na nangangailangan ng mabilisang tawid pangkalusugan o pondo.' : 'Naka-sugat ka og kalit nga kalisod o dinalian nga medikal o lubong.'
      });
    }

    // 4. SLP program
    if (hasLivelihoodInterest === true && isIndigent === true) {
      qualified.push({
        id: 'slp',
        name: lang === 'en' ? 'Sustainable Livelihood Program (SLP)' : lang === 'fil' ? 'Programa sa Sustenableng Kabuhayan (SLP)' : 'Sustainable Livelihood Program (SLP)',
        benefit: 'Up to ₱15,000 Seed Capital + business coaching',
        matchReason: lang === 'en' ? 'You are an indigent adult willing to undergo skills training or startup a local micro-enterprise.' : lang === 'fil' ? 'Ikaw ay nasa edad na gustong magsimula ng sariling negosyo o sumailalim sa vocational skills training.' : 'Gusto nimo magpasiugda og kaugalingon negosyo o moapil sa pagbansay sa trabaho.'
      });
    }

    return qualified;
  };

  const results = getResults();

  const headings: Record<Language, string> = {
    en: "DSWD Eligibility Assessment Tool",
    fil: "Pagtatasa ng Pangangailangan sa DSWD",
    ceb: "Susi sa Kwalipikasyon alang sa DSWD"
  };

  const subheadings: Record<Language, string> = {
    en: "Answer a few questions to find out which social protection grants you qualify for.",
    fil: "Sagutin ang mga mabilis na tanong upang malaman kung anong tulong pinansyal ang maaari mong makuha.",
    ceb: "Tubaga ang pipila ka pangutana aron mahibal-an kon unsa nga programa ang imong madawat."
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-white/10 p-5 md:p-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-indigo-600/10 text-indigo-455 text-indigo-400 rounded-2xl border border-indigo-500/20">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight">{headings[lang]}</h3>
          <p className="text-xs text-slate-400 font-sans">{subheadings[lang]}</p>
        </div>
      </div>

      {/* Progress Line */}
      {step < 5 && (
        <div className="w-full bg-slate-800 h-1 rounded-full mb-6 relative overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      )}

      {/* Interactive Questionnaire Steps */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <label className="block text-sm md:text-base font-semibold text-slate-200 font-sans">
            1. {lang === 'en' ? "Please enter your age:" : lang === 'fil' ? "Pakisulat ang iyong edad:" : "Palihug isulat ang imong edad:"}
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => {
              const val = e.target.value;
              setAge(val === '' ? '' : Number(val));
            }}
            placeholder="e.g. 64"
            className="w-full border border-white/10 rounded-xl px-4 py-3 bg-slate-950/80 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-sans"
            id="eligibility-age-input"
          />
          <button
            onClick={() => age !== '' && setStep(2)}
            disabled={age === '' || Number(age) < 0 || Number(age) > 130}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors duration-150 flex items-center justify-center font-sans mt-2 shadow-lg shadow-indigo-650/20"
            id="eligibility-step1-btn"
          >
            {lang === 'en' ? 'Continue' : lang === 'fil' ? 'Ipagpatuloy' : 'Padayon'}
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <label className="block text-sm md:text-base font-semibold text-slate-200 font-sans">
            2. {lang === 'en' ? "Are you/your household certified or classified as poor or low-income?" : lang === 'fil' ? "Ikaw ba o ang iyong pamilya ay itinuturing na mahirap o may mababang kita?" : "Ikaw o ang inyong pamilya giila ba nga kabus o adunay ubos nga kita?"}
          </label>
          <div className="grid grid-cols-2 gap-3" id="indigent-grid-opts">
            <button
              onClick={() => { setIsIndigent(true); setStep(3); }}
              className={`p-4 border-2 rounded-xl font-medium font-sans text-center transition-all ${
                isIndigent === true ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/10 hover:bg-slate-900'
              }`}
            >
              {lang === 'en' ? 'Yes' : lang === 'fil' ? 'Oo' : 'Oo'}
            </button>
            <button
              onClick={() => { setIsIndigent(false); setStep(3); }}
              className={`p-4 border-2 rounded-xl font-medium font-sans text-center transition-all ${
                isIndigent === false ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/10 hover:bg-slate-900'
              }`}
            >
              {lang === 'en' ? 'No / Middle Income' : lang === 'fil' ? 'Hindi / Sapat ang Kita' : 'Dili / Sakto ang Kita'}
            </button>
          </div>
          <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-300 text-xs flex items-center font-medium mt-2" id="back-step1">
            ← {lang === 'en' ? 'Back' : lang === 'fil' ? 'Bumalik' : 'Balik'}
          </button>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <label className="block text-sm md:text-base font-semibold text-slate-200 font-sans">
            3. {lang === 'en' ? "Which of these apply to your family or household?" : lang === 'fil' ? "Alin sa mga sumusunod ang angkop sa iyong pamilya?" : "Hain sa mga mosunod ang nagpakita sa sitwasyon sa panimalay?"}
          </label>
          <div className="space-y-2" id="household-scenario-opts">
            <button
              onClick={() => { setHasChildren(true); setHasPension(false); setStep(4); }}
              className="w-full text-left p-3.5 border border-white/5 bg-slate-950/40 rounded-xl hover:bg-slate-900 font-sans font-medium text-xs md:text-sm text-slate-200 flex items-center justify-between transition-colors"
            >
              <span>{lang === 'en' ? "We have children aged 0 to 18 currently studying" : lang === 'fil' ? "Mayroon kaming mga anak na may edad 0 hanggang 18 na nag-aaral" : "Adunay pamilya nga nag-edad og 0 hangtod 18 nga nag-eskwela"}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => { setIsPregnant(true); setHasPension(false); setStep(4); }}
              className="w-full text-left p-3.5 border border-white/5 bg-slate-950/40 rounded-xl hover:bg-slate-900 font-sans font-medium text-xs md:text-sm text-slate-200 flex items-center justify-between transition-colors"
            >
              <span>{lang === 'en' ? "A member of the family is currently pregnant" : lang === 'fil' ? "May miyembro ng pamilya na kasalukuyang buntis" : "Adunay miyembro sa pamilya nga mabdos"}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            {Number(age) >= 60 && (
              <button
                onClick={() => { setHasPension(false); setStep(4); }}
                className="w-full text-left p-3.5 border border-white/5 bg-slate-950/40 rounded-xl hover:bg-slate-900 font-sans font-medium text-xs md:text-sm text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>{lang === 'en' ? "I am a Senior with NO regular GSIS/SSS/private pension" : lang === 'fil' ? "Ako ay Senior na WALANG pension sa GSIS/SSS o iba pa" : "Usa ako ka Senior nga WALAY nadawat nga laing pensiyon"}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            )}
            <button
              onClick={() => {
                setHasChildren(false);
                setIsPregnant(false);
                setHasPension(true);
                setStep(4);
              }}
              className="w-full text-left p-3.5 border border-white/5 bg-slate-950/20 rounded-xl hover:bg-slate-900 font-sans font-medium text-xs md:text-sm text-slate-500 flex items-center justify-between transition-colors"
            >
              <span>{lang === 'en' ? "None of these / Other situations" : lang === 'fil' ? "Wala sa mga nabangit / Ibang kalagayan" : "Wala sa mga gihisgutan / Laing sitwasyon"}</span>
              <ChevronRight className="w-4 h-4 text-slate-650" />
            </button>
          </div>
          <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-300 text-xs flex items-center font-medium mt-2" id="back-step2">
            ← {lang === 'en' ? 'Back' : lang === 'fil' ? 'Bumalik' : 'Balik'}
          </button>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <label className="block text-sm md:text-base font-semibold text-slate-200 font-sans">
            4. {lang === 'en' ? "Do you have any immediate, heavy crises, such as hospital debts, bereavement (funeral aid), or require livelihood capital?" : lang === 'fil' ? "Mayroon ka bang matinding krisis ngayon tulong-medikal sa ospital, gastusin sa libing, o nangangailangan ng pampuhunan ng negosyo?" : "Adunay ba kamo dinalian nga kalisod sa ospital, lubong, o nanginahanglan og puhunan sa negosyo?"}
          </label>
          <div className="space-y-2" id="assistance-reasons-opts">
            <button
              onClick={() => { setHasCrisis(true); setStep(5); }}
              className="w-full text-left p-3.5 border border-white/5 bg-slate-950/40 rounded-xl hover:bg-slate-900 font-sans font-medium text-xs md:text-sm text-slate-200 flex items-center transition-colors"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-3 flex-shrink-0" />
              <span>{lang === 'en' ? "Yes, active medical bill, medicine, or funeral expense" : lang === 'fil' ? "Oo, may hospital bill, reseta, o gastusin sa pagpapalibing" : "Oo, aduna kami bayranan sa ospital, medisina, o lubong"}</span>
            </button>
            <button
              onClick={() => { setHasLivelihoodInterest(true); setStep(5); }}
              className="w-full text-left p-3.5 border border-white/5 bg-slate-950/40 rounded-xl hover:bg-slate-900 font-sans font-medium text-xs md:text-sm text-slate-200 flex items-center transition-colors"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 flex-shrink-0" />
              <span>{lang === 'en' ? "Yes, I want startup microfinance seed capital for local livelihood" : lang === 'fil' ? "Oo, gusto ko ng panimulang puhunan para sa maliit na negosyo" : "Oo, gusto nako og puhunan para sa gamay nga negosyo"}</span>
            </button>
            <button
              onClick={() => { setHasCrisis(false); setHasLivelihoodInterest(false); setStep(5); }}
              className="w-full text-left p-3.5 border border-white/5 bg-slate-950/20 rounded-xl hover:bg-slate-900 font-sans font-medium text-xs md:text-sm text-slate-400 flex items-center transition-colors"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-3 flex-shrink-0" />
              <span>{lang === 'en' ? "None, just looking for general social integration benefits" : lang === 'fil' ? "Wala naman, sapat lang o nagtatanong lamang" : "Wala, igo ra ko nagbasa-basa"}</span>
            </button>
          </div>
          <button onClick={() => setStep(3)} className="text-slate-500 hover:text-slate-350 text-xs flex items-center font-medium mt-2" id="back-step3">
            ← {lang === 'en' ? 'Back' : lang === 'fil' ? 'Bumalik' : 'Balik'}
          </button>
        </motion.div>
      )}

      {/* Assessment results step */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
          <div className="p-5 bg-emerald-950/10 rounded-2xl border border-emerald-500/20 text-center backdrop-blur-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-sans font-bold text-white text-base md:text-lg">
              {lang === 'en' ? "Assessment Completed!" : lang === 'fil' ? "Nakumpleto na ang Pagsusuri!" : "Nahuman na ang Pagtuki!"}
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              {lang === 'en' ? "Based on your inputs, you may qualify for the following programs:" : lang === 'fil' ? "Ayon sa iyong sagot, maaari kang magkwalipika sa mga sumusunod:" : "Sumala sa imong tubag, mahimo ka nga maapil sa mga mosunod:"}
            </p>
          </div>

          <div className="space-y-3.5" id="assessment-programs-results">
            {results.map((prog, idx) => (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 md:p-5 shadow-inner relative overflow-hidden group hover:border-indigo-500/30 transition-all"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-indigo-700" />
                <h5 className="font-bold text-white text-sm md:text-base font-sans flex items-center">
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full mr-2">
                    {prog.id.toUpperCase()}
                  </span>
                  {prog.name}
                </h5>
                <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center font-sans">
                  <span>💎 Est. Benefit: {prog.benefit}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans font-medium">
                  {prog.matchReason}
                </p>

                {/* Simulated action buttons */}
                <div className="mt-3.5 flex flex-row items-center space-x-2">
                  <button
                    onClick={() => onApplyForProgram(prog.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center transition-colors font-sans shadow-lg shadow-indigo-600/15"
                    id={`apply-btn-${prog.id}`}
                  >
                    <span>{lang === 'en' ? 'Submit Pre-Registration' : lang === 'fil' ? 'Isumite ang Aplikasyon' : 'Isumite ang Aplikasyon'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}

            {results.length === 0 && (
              <div className="p-4 border border-dashed border-white/10 rounded-xl text-center text-slate-400 font-sans text-xs leading-relaxed bg-slate-950/20">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                {lang === 'en' ? 
                  "We could not find any immediate program matching these exact answers. Try reviewing the general programs index or consulting a local DSWD Social Worker." : 
                 lang === 'fil' ? 
                  "Paumanhin, walang mabilisang programang tumugma sa iyong mga sagot. Subukang kontakin ang pinakamalapit na DSWD municipal desk para sa manual assessment." : 
                  "Pasensya kaayo, walay nakita nga programa nga sakto sa imong tubag. Palihug duola ang local DSWD desk sa inyong lungsod."}
              </div>
            )}
          </div>

          <button
            onClick={reset}
            className="w-full text-slate-400 hover:text-white text-xs py-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center font-bold tracking-tight font-sans mt-4 border border-white/5"
            id="assess-restart-btn"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            {lang === 'en' ? 'Restart Assessment' : lang === 'fil' ? 'Ulitin ang Pagtatasa' : 'Sulayan Pag-usab'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
