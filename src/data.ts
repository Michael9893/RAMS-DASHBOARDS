import { DswdProgram, SearchResult, Application } from './types';

export const DSWD_PROGRAMS: DswdProgram[] = [
  {
    id: '4ps',
    name: {
      en: 'Pantawid Pamilyang Pilipino Program',
      fil: 'Pantawid Pamilyang Pilipino Program',
      ceb: 'Pantawid Pamilyang Pilipino Program'
    },
    acronym: '4Ps',
    tagline: {
      en: 'Bridging partnerships for the Filipino family’s health and education.',
      fil: 'Pagtulay ng samahan para sa kalusugan at edukasyon ng pampamilyang Pilipino.',
      ceb: 'Pagdugtong sa kaubanan para sa panglawas ug edukasyon sa pamilyang Pilipino.'
    },
    description: {
      en: 'The 4Ps is a human development measure of the national government that provides conditional cash transfers to poorer households, particularly of pregnant women and children aged 0-18.',
      fil: 'Ang 4Ps ay isang hakbang sa pagpapaunlad ng tao ng pambansang pamahalaan na nagbibigay ng kondisyonal na tulong pinansyal sa mga mahihirap na pamilya, lalo na sa mga buntis na kababaihan at mga bata na may edad 0-18.',
      ceb: 'Ang 4Ps kay usa ka pamaagi sa nasudnong kagamhanan sa pagpalambo sa tawo nga naghatag ug kondisyonal nga hinabang pinansyal sa mga kabus nga panimalay, ilabi na sa mga mabdos nga inahan ug mga bata nga nag-edad 0-18.'
    },
    benefits: {
      en: [
        'Health Grant: ₱750 per month per household',
        'Education Grant (Elementary): ₱300 per child per month (max 10 months/year)',
        'Education Grant (Junior High): ₱500 per child per month (max 10 months/year)',
        'Education Grant (Senior High): ₱700 per child per month (max 10 months/year)',
        'Rice Subsidy: ₱600 per month per household'
      ],
      fil: [
        'Tulong Pangkalusugan: ₱750 bawat buwan bawat pamilya',
        'Tulong sa Edukasyon (Elementarya): ₱300 bawat bata bawat buwan (max 10 buwan/taon)',
        'Tulong sa Edukasyon (Junior High): ₱500 bawat bata bawat buwan (max 10 buwan/taon)',
        'Tulong sa Edukasyon (Senior High): ₱700 bawat bata bawat buwan (max 10 buwan/taon)',
        'Subsidiya sa Bigas: ₱600 bawat buwan bawat pamilya'
      ],
      ceb: [
        'Hinabang Panglawas: ₱750 matag bulan kada pamilya',
        'Hinabang sa Edukasyon (Elementarya): ₱300 matag bata kada bulan (max 10 ka bulan/tuig)',
        'Hinabang sa Edukasyon (Junior High): ₱500 matag bata kada bulan (max 10 ka bulan/tuig)',
        'Hinabang sa Edukasyon (Senior High): ₱700 matag bata kada bulan (max 10 ka bulan/tuig)',
        'Sabsidi sa Bugas: ₱600 matag bulan kada pamilya'
      ]
    },
    eligibility: {
      en: [
        'Classified as poor or near-poor in the Listahanan database.',
        'Residing in poor areas identified in the National Household Targeting System.',
        'Must have children aged 0-18 or a pregnant household member.',
        'Agrees to meet co-responsibilities (e.g., school attendance, health checkups).'
      ],
      fil: [
        'Kabilang sa mahihirap sa database ng Listahanan (NHTS-PR).',
        'Nakatira sa mga mahihirap na lugar ayon sa pagtukoy ng pamahalaan.',
        'May mga anak na may edad 0-18 o may miyembrong buntis sa pamilya.',
        'Sumasang-ayon na gampanan ang mga kasunduan (tulad ng pagpasok sa paaralan at pagpapatingin sa doktor).'
      ],
      ceb: [
        'Nalista nga pobre sa Listahanan database (NHTS-PR).',
        'Nagpuyo sa mga dapit nga pobre sumala sa giila sa kagamhanan.',
        'Adunay mga anak nga nag-edad 0-18 o adunay mabdos nga miyembro sa pamilya.',
        'Mosugot nga motuman sa mga kondisyon (sama sa pag-eskwela ug pagpa-checkup sa doktor).'
      ]
    },
    requirements: {
      en: [
        'Valid Government-issued ID containing hometown address.',
        'Birth Certificate of children or medical certification of pregnancy.',
        'Certificate of School Enrollment/Registration of children.',
        'Barangay Clearance/Indigency Certificate.'
      ],
      fil: [
        'Validong ID ng Gobyerno na naglalaman ng address ng tirahan.',
        'Sertipiko ng Kapanganakan (Birth Certificate) ng mga bata o sertipiko ng pagkabuntis.',
        'Sertipiko ng Pagpapatala sa Paaralan (Enrollment Form) ng mga bata.',
        'Barangay Clearance o Sertipiko ng Pagka-indigent.'
      ],
      ceb: [
        'Valid ID sa Gobyerno nga nagpakita sa address sa panimalay.',
        'Birth Certificate sa mga bata o medical certificate sa pagkamabdos.',
        'Sertipiko sa Pagpa-enrol sa Eskwelahan sa mga bata.',
        'Barangay Clearance o Sertipiko sa Pag-indigent.'
      ]
    },
    steps: {
      en: [
        'Step 1: Wait for household assessment conducted by the Listahanan officers.',
        'Step 2: Validation of target households by community assemblies.',
        'Step 3: Registration of qualified households at local DSWD desk.',
        'Step 4: Attendance in pre-registration program orientation.',
        'Step 5: Release of Landbank Cash Card for conditional transfers.'
      ],
      fil: [
        'Hakbang 1: Maghintay para sa household assessment na isasagawa ng mga opisyal ng Listahanan.',
        'Hakbang 2: Pagpapatunay (Validation) ng mga napiling pampamilya ng mga asembleya ng komunidad.',
        'Hakbang 3: Pagpapatala ng mga kwalipikadong pamilya sa lokal na tanggapan ng DSWD.',
        'Hakbang 4: Pagdalo sa Oryentasyon bago ang pormal na pagpapatala.',
        'Hakbang 5: Paghahatid ng Landbank Cash Card para sa paglilipat ng pera.'
      ],
      ceb: [
        'Lakang 1: Hulata ang household assessment nga pagabuhaton sa mga opisyal sa Listahanan.',
        'Lakang 2: Balidasyon sa mga napiling pamilya pinaagi sa asembleya sa komunidad.',
        'Lakang 3: Pagparehistro sa mga kwalipikadong pamilya sa lokal nga opisina sa DSWD.',
        'Lakang 4: Pagtambong sa Oryentasyon sa dili pa ang pormal nga pagrehistro.',
        'Lakang 5: Pagdawat sa Landbank Cash Card para sa pagkuha sa hinabang.'
      ]
    },
    color: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'aics',
    name: {
      en: 'Assistance to Individuals in Crisis Situations',
      fil: 'Tulong sa mga Taong Nasalanta o nasa Krisis',
      ceb: 'Tabang sa mga Tawo sa Panahon sa Krisis'
    },
    acronym: 'AICS',
    tagline: {
      en: 'A social safety net serving as immediate rescue mechanism.',
      fil: 'Isang lambat-kaligtasan para sa mabilisang agarang tulong.',
      ceb: 'Usa ka pamaagi sa kaluwasan alang sa dinalian nga tabang.'
    },
    description: {
      en: 'AICS serves as a social safety net to support the recovery of individuals and families from unexpected crises, offering financial assistance for medical, burial, educational, transportation, food, or hygiene needs.',
      fil: 'Ang AICS ay nagsisilbing suporta upang matulungan ang pagbangon ng mga indibidwal at pamilya mula sa hindi inaasahang krisis, nag-aalok ng tulong pinansyal para sa medikal, libing, edukasyon, transportasyon, pagkain, o pangangailangan sa kalinisan.',
      ceb: 'Ang AICS nagsilbing suporta aron matabangan ang pagbangon sa mga indibidwal ug pamilya gikan sa kalit nga krisis, pinaagi sa paghatag ug hinabang pinansyal sa tambal, lubong, eskwela, plete, pagkaon, ug uban pa.'
    },
    benefits: {
      en: [
        'Medical Assistance: Up to ₱75,000 guarantee letter or cash for diagnostic tests, hospitalization, or medicine.',
        'Burial Assistance: Up to ₱50,000 to assist with coffin, wake, or cremation expenses.',
        'Educational Assistance: Range from ₱1,000 to ₱5,000 depending on study level (for indigents).',
        'Transportation/Food Support: Direct cash or vouchers for tickets, meal allowance during cross-province transitions.'
      ],
      fil: [
        'Tulong Medikal: Hanggang ₱75,000 na Guarantee Letter o cash para sa diagnostic tests, pagpapaospital, o gamot.',
        'Tulong sa Libing: Hanggang ₱50,000 upang makatulong sa gastos sa kabaong, burol, o kremasyon.',
        'Tulong sa Edukasyon: Mula ₱1,000 hanggang ₱5,000 depende sa antas ng pag-aaral (para sa mahihirap).',
        'Suporta sa Transportasyon/Pagkain: Direktang cash o voucher para sa pamasahe, bago lumipat ng lalawigan.'
      ],
      ceb: [
        'Hinabang Medikal: Kutub ₱75,000 nga Guarantee Letter o cash alang sa diagnostic tests, ospital, o tambal.',
        'Hinabang sa Lubong: Kutub ₱50,000 aron makatabang sa gasto sa lungon, haya, o kremasyon.',
        'Hinabang sa Edukasyon: Gikan ₱1,000 hangtod ₱5,000 depende sa lebel sa pag-eskwela (alang sa kabus).',
        'Suporta sa Plete/Pagkaon: Direktang cash o voucher alang sa plete sa pagbalhin ug probinsya.'
      ]
    },
    eligibility: {
      en: [
        'Individuals or families experiencing any life-crippling crisis (e.g., hospitalization, death in family, natural calamity).',
        'Certified as indigent by the local Barangay or Social Welfare Office.',
        'Passes the immediate assessment of the assigned DSWD social worker.'
      ],
      fil: [
        'Mga indibidwal o pamilya na nakararanas ng matinding krisis sa buhay (hal. pagkakaospital, pagkamatay ng pamilya, kalamidad).',
        'Pinatunayan bilang indigent ng lokal na Barangay o Tanggapan ng Kapakanan sa Lipunan.',
        'Pumasa sa mabilisang pagtatasa ng nakatalagang social worker ng DSWD.'
      ],
      ceb: [
        'Mga indibidwal o pamilya nga nakasugat ug grabeng krisis sa kinabuhi (sama sa ospital, kamatayon sa pamilya, kalamidad).',
        'Gisertipikahan nga indigent sa Barangay o Lokal nga Social Welfare Office.',
        'Naka-pasar sa pag-assess sa DSWD social worker.'
      ]
    },
    requirements: {
      en: [
        'Clinical Abstract / Medical Certificate / Hospital Bill (for Medical Assistance).',
        'Death Certificate / Funeral Contract (for Burial Assistance).',
        'Certificate of Enrollment / School ID (for Educational Assistance).',
        'Certificate of Indigency from Barangay.',
        'One (1) Valid ID of the applicant.'
      ],
      fil: [
        'Clinical Abstract o Medical Certificate o Hospital Bill (para sa Tulong Medikal).',
        'Sertipiko ng Kamatayan o Kontrata sa Libing (para sa Tulong sa Libing).',
        'Sertipiko ng Pagpapatala sa Paaralan o School ID (para sa Tulong sa Edukasyon).',
        'Sertipiko ng Pagka-indigent mula sa Barangay.',
        'Isang (1) Validong ID ng aplikante.'
      ],
      ceb: [
        'Clinical Abstract o Medical Certificate o Hospital Bill (alang sa Hinabang Medikal).',
        'Death Certificate o Kontrata sa Funeral (alang sa Hinabang sa Lubong).',
        'Sertipiko sa Pagpa-enrol sa Eskwelahan o School ID (alang sa Hinabang sa Edukasyon).',
        'Sertipiko sa Pagka-indigent gikan sa Barangay.',
        'Usa (1) ka Valid ID sa aplikante.'
      ]
    },
    steps: {
      en: [
        'Step 1: Get complete documents checklist for cash/GL assistance.',
        'Step 2: Present documents to DSWD Crisis Intervention Unit (CIU) intake desk.',
        'Step 3: Undergo a brief interview with the reviewing DSWD Social Worker.',
        'Step 4: Receive Voucher, Cash, or Guarantee Letter (GL) for the partner institution.'
      ],
      fil: [
        'Hakbang 1: Kunin ang kumpletong checklist ng mga dokumento para sa cash o GL na tulong.',
        'Hakbang 2: Ipresenta ang mga dokumento sa DSWD Crisis Intervention Unit (CIU) intake desk.',
        'Hakbang 3: Sumailalim sa maikling interbyu kasama ang nakatalagang DSWD Social Worker.',
        'Hakbang 4: Tanggapin ang Voucher, Cash, o Guarantee Letter (GL) para sa kaparehong institusyon.'
      ],
      ceb: [
        'Lakang 1: Kuhaa ang kompleto nga checklist sa mga dokumento alang sa cash o GL.',
        'Lakang 2: Ipakita ang mga dokumento sa DSWD Crisis Intervention Unit (CIU) intake desk.',
        'Lakang 3: Atubanga ang mubo nga interview uban sa DSWD Social Worker.',
        'Lakang 4: Dawata ang Voucher, Cash, o Guarantee Letter (GL) alang sa kaubang institusyon.'
      ]
    },
    color: 'from-rose-600 to-orange-500'
  },
  {
    id: 'socpen',
    name: {
      en: 'Social Pension for Indigent Senior Citizens',
      fil: 'Sosyal na Pension para sa mga Mahihirap na Nakatatanda',
      ceb: 'Sosyal nga Pensiyon para sa mga Kabus nga Senior Citizen'
    },
    acronym: 'SocPen',
    tagline: {
      en: 'Sustaining dignity and care for our indigent seniors.',
      fil: 'Pagpapanatili ng dignidad at pangangalaga sa ating mga nakatatanda.',
      ceb: 'Pagmintinar sa dignidad ug pag-amoma sa atong mga senior citizen.'
    },
    description: {
      en: 'A government program providing cash aid to elderly Filipinos to augment their daily subsistence and other medical needs, helping alleviate poverty and deprivation.',
      fil: 'Isang programa ng pamahalaan na nagbibigay ng pinansyal na tulong sa mga matatandang Pilipino upang madagdagan ang pambili ng kapakanan, pagkain, at gamot, upang maibsan ang gutom at kahirapan.',
      ceb: 'Usa ka programa sa gobyerno nga naghatag ug hinabang pinansyal sa mga tigulang nga Pilipino aron madugangan ang ilang pang-adlaw-adlaw nga pagkaon ug tambal.'
    },
    benefits: {
      en: [
        'Monthly Stipend: ₱1,000 per month (distributed semi-annually at ₱6,000 per semester).'
      ],
      fil: [
        'Buwanang Sustento: ₱1,000 bawat buwan (ipinapamahagi kada anim na buwan o ₱6,000 bawat semestre).'
      ],
      ceb: [
        'Bulanang Pensiyon: ₱1,000 matag bulan (i-apod-apod kausa matag unom ka bulan, o ₱6,000 matag semestre).'
      ]
    },
    eligibility: {
      en: [
        'Must be sixty (60) years old and above.',
        'Frail, sickly, or with disability.',
        'No permanent source of income, compensation, or financial support from relatives.',
        'No pension from SSS, GSIS, PVAO, or any private insurance company.'
      ],
      fil: [
        'May edad na animnapung (60) taong gulang at pataas.',
        'Madadaan sa sakit, mahina ang katawan, o may kapansanan.',
        'Walang permanenteng pinagkakakitaan, kompensasyon, o suportang pinansyal mula sa kamag-anak.',
        'Walang pensyon mula sa SSS, GSIS, PVAO, o iba pang pribadong kompanya.'
      ],
      ceb: [
        'Kinahanglan nag-edad og saysenta (60) anyos pataas.',
        'Luyat, masakitnon, o adunay kapansanan.',
        'Walang permanenteng kita, suweldo, o pinansyal nga tabang gikan sa kabanay.',
        'Walang pensiyon gikan sa SSS, GSIS, PVAO, o uban pang pribadong kompanya o seguro.'
      ]
    },
    requirements: {
      en: [
        'Valid Senior Citizen ID issued by OSCA (Office of Senior Citizens Affairs).',
        'Certificate of Indigency from the Barangay Welfare Committee.',
        'Affidavit of No Income or Pension support.'
      ],
      fil: [
        'Validong Senior Citizen ID na inisyu ng OSCA (Office of Senior Citizens Affairs).',
        'Sertipiko ng Pagkabawas-Kaya (Indigency Certificate) mula sa Barangay.',
        'Sinumpaang Sanaysay/Affidavit na walang ibang tinatanggap na Pension.'
      ],
      ceb: [
        'Valid Senior Citizen ID nga gi-isyu sa OSCA.',
        'Sertipiko sa Pagka-indigent gikan sa Barangay.',
        'Affidavit nga walay laing nadawat nga pensiyon o kita.'
      ]
    },
    steps: {
      en: [
        'Step 1: Submit your documents to the local Office of Senior Citizens Affairs (OSCA) or DSWD municipal desk.',
        'Step 2: Social Workers conduct a home visit and validation of status.',
        'Step 3: Verification with regional pension databases to prevent double-payouts.',
        'Step 4: Allocation and announcement of regional payout schedules.',
        'Step 5: Pick up your cash pension during barangay distribution assemblies.'
      ],
      fil: [
        'Hakbang 1: Isumite ang iyong mga dokumento sa lokal na Office of Senior Citizens Affairs (OSCA) o DSWD desk.',
        'Hakbang 2: Isasagawa ng Social Worker ang pagbisita sa tahanan upang patunayan ang katayuan.',
        'Hakbang 3: Pagsusuri sa panrehiyong database ng pensyon upang maiwasan ang dobleng benepisyo.',
        'Hakbang 4: Pag-anunsyo ng iskedyul ng pamamahagi ng pensyon bawat rehiyon.',
        'Hakbang 5: Kunin ang pinansyal na pensyon sa iskedyul ng barangay assembly.'
      ],
      ceb: [
        'Lakang 1: Isumite ang imong mga dokumento sa OSCA o lokal nga opisina sa DSWD.',
        'Lakang 2: Ang Social Worker mobisita sa inyong balay aron tun-an ang imong sitwasyon.',
        'Lakang 3: Pag-check sa database sa pension aron malikayan ang doble nga bayad.',
        'Lakang 4: Pag-anunsyo sa iskedyul sa dawat sa pensiyon matag distrito.',
        'Lakang 5: Kuhaa ang imong pension sa gitakdang adlaw sa barangay hall.'
      ]
    },
    color: 'from-amber-600 to-yellow-500'
  },
  {
    id: 'slp',
    name: {
      en: 'Sustainable Livelihood Program',
      fil: 'Programa para sa Sustenableng Kabuhayan',
      ceb: 'Programa para sa Sustenableng Kabuhayan (SLP)'
    },
    acronym: 'SLP',
    tagline: {
      en: 'Fostering micro-enterprise and employment across communities.',
      fil: 'Pagtataguyod ng micro-negosyo at trabaho sa komunidad.',
      ceb: 'Pagpasiugda sa micro-negosyo ug trabaho sa mga barangay.'
    },
    description: {
      en: 'SLP is a community-based capacity building program that aims to improve the socio-economic status of poor, vulnerable, and marginalized households by providing access to micro-enterprise development and employment facilitation.',
      fil: 'Ang SLP ay isang programa sa pagpapalago ng kakayanan na naglalayong maiangat ang sosyo-ekonomikong kalagayan ng mga mahihirap sa pamamagitan ng pagbibigay ng puhunan para sa micro-negosyo o pagtulong sa paghahanap ng trabaho.',
      ceb: 'Ang SLP kay usa ka programa sa pagpalambo sa katakus sa komunidad nga nagtumong sa pagpataas sa kahimtang sa mga kabus pinaagi sa paghatag ug negosyo o pagpasulod sa trabaho.'
    },
    benefits: {
      en: [
        'Micro-Enterprise Development: Seed Capital Fund of up to ₱15,000 per associate.',
        'Employment Facilitation: Financial assistance for job-seeking requirements (NBI clearance, IDs, short skills training).',
        'Skills Training: Direct technical and vocational skills education sponsored by DSWD and TESDA.'
      ],
      fil: [
        'Pagsisimula ng Negosyo: Panimulang Puhunan (Seed Capital) na hanggang ₱15,000 bawat kasapi.',
        'Tulong sa Trabaho: Pinansyal na suporta para sa mga requirement mag-apply (NBI clearance, ID, seminar).',
        'Pagsasanay sa Kasanayan: Direktang teknikal at bokasyonal na klase sa pamamagitan ng DSWD at TESDA.'
      ],
      ceb: [
        'Pagsugod sa Negosyo: Sinugdanang Puhunan (Seed Capital) nga muabot ug ₱15,000 kada miyembro.',
        'Hinabang sa Trabaho: Pinansyal nga suporta alang sa mga rekisito sa pag-apply (NBI clearance, ID).',
        'Pagbansay sa Katakus: Direktang teknikal nga klase nga gi-sponsor sa DSWD ug TESDA.'
      ]
    },
    eligibility: {
      en: [
        'Member of a poor household identified by Listahanan or classified as indigent.',
        'At least 18 years old eager to engage in enterprise development or employment.',
        'A resident member of the organized Sustainable Livelihood Association.'
      ],
      fil: [
        'Kasapi ng mahirap na pamilyang tinukoy ng Listahanan o napatunayang mahirap.',
        'May edad na hindi bababa sa 18 taong gulang na nais magtrabaho o magnegosyo.',
        'Isang residenteng miyembro ng binuong Livelihood Association sa barangay.'
      ],
      ceb: [
        'Miyembro sa pamilyang giila nga kabus sa Listahanan o certified indigent.',
        'Nag-edad og labing minus 18 anyos nga andam moapil sa pagnegosyo o pagtrabaho.',
        'Miyembro sa narehistro nga Sustainable Livelihood Association.'
      ]
    },
    requirements: {
      en: [
        'Participant Profile form signed with photo.',
        'Barangay Certification of Residency and Indigency.',
        'Valid ID containing proof of birthdate.',
        'Approved Micro-Enterprise Proposal (designed during DSWD workshops).'
      ],
      fil: [
        'Participant Profile form na may pirma at litrato.',
        'Barangay Certification ng Tirahan at Pagka-indigent.',
        'Validong ID na nagpapatunay ng edad.',
        'Inaprubahang Panukalang Negosyo (binubuo sa workshops ng DSWD).'
      ],
      ceb: [
        'Participant Profile form nga adunay pirma ug litrato.',
        'Barangay Certificate sa Pagpuyo ug Pag-indigent.',
        'Valid ID nga nagpakita sa edad.',
        'Gi-aprubahang Livelihood Proposal (buhaton kauban sa DSWD sa workshops).'
      ]
    },
    steps: {
      en: [
        'Step 1: Participate in community assembly and SLP orientation in the barangay.',
        'Step 2: Form groups with other beneficiaries (SLA Formation).',
        'Step 3: Attend business management and skills capability training.',
        'Step 4: Prepare and submit the Micro-Enterprise project proposal.',
        'Step 5: Funding approval, release of seed capital, and start of community enterprise monitoring.'
      ],
      fil: [
        'Hakbang 1: Lumahok sa pagpupulong ng komunidad at oryentasyon ng SLP sa barangay.',
        'Hakbang 2: Mag-grupo kasama ang iba pang benepisyaryo (SLA Formation).',
        'Hakbang 3: Dumalo sa pagsasanay sa pamamahala ng negosyo.',
        'Hakbang 4: Ihanda at isumite ang panukalang negosyo.',
        'Hakbang 5: Pag-apruba ng pondo, pamamahagi ng puhunan, at pagsisimula ng negosyo.'
      ],
      ceb: [
        'Lakang 1: Pag-apil sa assembly sa Barangay ug oryentasyon sa SLP.',
        'Lakang 2: Pagtukod og grupo uban sa ubang benepisyaryo (SLA Formation).',
        'Lakang 3: Pagtambong sa pagbansay sa pagdumala sa negosyo.',
        'Lakang 4: Pag-andam ug pagsumite sa plano sa negosyo.',
        'Lakang 5: Pag-apruba sa pundo, paghatag sa seed capital, ug pagsugod sa negosyo.'
      ]
    },
    color: 'from-emerald-600 to-teal-500'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    programId: '4ps',
    programName: '4Ps Cash Transfer',
    applicantName: 'Amara Santos Delgado',
    age: 34,
    location: 'District 4, Quezon City',
    status: 'Approved',
    date: '2026-05-12',
    referenceCode: 'DSWD-4PS-2026-9821'
  },
  {
    id: 'app-002',
    programId: 'aics',
    programName: 'AICS Medical Assistance',
    applicantName: 'Bernardo Cruz Reyes',
    age: 48,
    location: 'Sinait, Ilocos Sur',
    status: 'Disbursed',
    date: '2026-06-02',
    referenceCode: 'DSWD-AICS-2026-0391'
  },
  {
    id: 'app-003',
    programId: 'socpen',
    programName: 'Senior Citizen Pension',
    applicantName: 'Estrella Gomez Macaraeg',
    age: 72,
    location: 'Carcar, Cebu',
    status: 'Under Review',
    date: '2026-06-04',
    referenceCode: 'DSWD-SOCPEN-2026-7264'
  }
];

export const SEARCH_RESULTS: SearchResult[] = [
  {
    id: 'r1',
    title: {
      en: 'Pantawid Pamilyang Pilipino Program (4Ps) Guide | DSWD',
      fil: 'Gabay Para sa Pantawid Pamilyang Pilipino Program (4Ps) | DSWD',
      ceb: 'Giya Alang sa Pantawid Pamilyang Pilipino Program (4Ps) | DSWD'
    },
    url: 'https://www.dswd.gov.ph/programs/4ps',
    snippet: {
      en: 'Official guide on 4Ps cash grants, qualifications, benefits, for education and health of children 0-18. Learn how listing in Listahanan is required for registration.',
      fil: 'Opisyal na gabay sa tulong pinansyal ng 4Ps para sa edukasyon at kalusugan ng pamilya. Alamin kung paano kailangang mapabilang sa Listahanan para makarehistro.',
      ceb: 'Opisyal nga giya sa hinabang pinansyal sa 4Ps alang sa edukasyon ug panglawas sa pamilya. Alamin kon unsaon pagpasulod sa Listahanan aron makaparehistro.'
    },
    category: 'programs',
    tags: ['4ps', 'assistance', 'cash grant', 'health', 'education', 'pantawid'],
    faqs: [
      {
        question: {
          en: 'How do I apply for 4Ps online?',
          fil: 'Paano mag-apply sa 4Ps online?',
          ceb: 'Unsaon pag-apply sa 4Ps online?'
        },
        answer: {
          en: 'There is no online application for 4Ps. Households are selected through the nationwide Listahanan (NHTS-PR) house-to-house enumeration survey. You must wait for the official DSWD assessors to visit your area.',
          fil: 'Walang online application para sa 4Ps. Ang mga pamilya ay pinipili sa pamamagitan ng nationwide Listahanan na pagsusuri sa inyong tahanan. Maghintay para sa pagbisita ng mga opisyal ng DSWD.',
          ceb: 'Walay online application alang sa 4Ps. Ang mga pamilya pilion pinaagi sa nationwide Listahanan nga house-to-house survey. Hulata ang opisyal nga pagbisita sa mga evaluator sa DSWD.'
        }
      },
      {
        question: {
          en: 'How much does a 4Ps beneficiary receive monthly?',
          fil: 'Magkano ang natatanggap ng miyembro ng 4Ps buwan-buwan?',
          ceb: 'Pila ang madawat sa miyembro sa 4Ps matag bulan?'
        },
        answer: {
          en: 'A household can receive up to ₱3,400+ monthly depending on school children counts. It contains: ₱750 health grant, ₱600 rice, and ₱300 to ₱700 educational grant depending on grades.',
          fil: 'Ang pamilya ay makatatanggap ng hanggang ₱3,400+ buwan-buwan depende sa bilang ng nag-aaral. Binubuo ito ng: ₱750 health grant, ₱600 subsidiya, at ₱300 hanggang ₱700 na tulong pang-edukasyon.',
          ceb: 'Ang pamilya makadawat ug kutub ₱3,400+ matag bulan depende sa gidaghanon sa nag-eskwela. Gilangkuban kini sa: ₱750 health grant, ₱600 sabsidi sa bugas, ug ₱300 hangtod ₱700 alang sa eskwela.'
        }
      }
    ]
  },
  {
    id: 'r2',
    title: {
      en: 'AICS Crisis Cash Assistance - Eligibility, Requirements | DSWD',
      fil: 'AICS Tulong Pinansyal sa Oras ng Krisis - Pagka-Kwalipikado | DSWD',
      ceb: 'AICS Dinalian nga Hinabang sa Panahon sa Krisis | DSWD'
    },
    url: 'https://www.dswd.gov.ph/services/aics',
    snippet: {
      en: 'Get immediate financial cash assistance for hospitalization bills, coffin funding, burial costs, transportation and schooling emergency. Apply at DSWD Crisis Intervention Centers.',
      fil: 'Kumuha ng agarang tulong pinansyal para sa hospital bills, pagpapalibing, medisina, pamasahe sa lalawigan, o emergency sa paaralan. Mag-apply sa pinakamalapit na DSWD CIU branch.',
      ceb: 'Pagdawat og dinalian nga tabang pinansyal sa ospital, lubong, tambal, plete, o eskwelahan. Mag-apply sa pinakaduol nga Crisis Intervention Center sa DSWD.'
    },
    category: 'requirements',
    tags: ['aics', 'hospital assistance', 'burial', 'medicine bill', 'emergency', 'indigent'],
    faqs: [
      {
        question: {
          en: 'What are the main requirements for DSWD medical assistance?',
          fil: 'Anu-ano ang pangunahing dokumento para sa tulong-medikal?',
          ceb: 'Unsa ang mga nag-unang rekisito alang sa medical assistance?'
        },
        answer: {
          en: 'You must provide: Clinical abstract or Medical certificate, hospital bill or prescription voucher, Certificate of Indigency from Barangay, and a valid ID of the relative submitting the claim.',
          fil: 'Dapat ihanda ang: Medical certificate o abstract, hospital bill o reseta ng gamot, Sertipiko ng Pagiging Mahirap (Indigency) mula sa Barangay, at valid ID ng nag-aapply.',
          ceb: 'Kinahanglan i-andam ang: Medical Cert o clinical abstract, hospital bill o reseta sa tambal, Sertipiko sa Pagka-indigent gikan sa Barangay, ug valid ID sa miyembro sa pamilya.'
        }
      }
    ]
  },
  {
    id: 'r3',
    title: {
      en: 'Indigent Senior Citizens Social Pension Distribution Schedule | DSWD',
      fil: 'Iskedyul ng Pamamahagi ng Social Pension sa mga Nakatanda | DSWD',
      ceb: 'Iskedyul sa Sosyal nga Pensiyon alang sa mga Tigulang | DSWD'
    },
    url: 'https://www.dswd.gov.ph/programs/social-pension',
    snippet: {
      en: 'Details regarding the ₱1,000 monthly Social Pension for qualified indigent senior citizens (60+ yo). Distributed semi-annually through local OSCA desks or payroll teams.',
      fil: 'Impormasyon ukid sa ₱1,000 buwanang Pension para sa mahihirap na nakatatanda (60 gulang pataas). Ipinapamahagi bawat anim na buwan sa inyong Barangay o OSCA office.',
      ceb: 'Impormasyon bahin sa ₱1,000 nga bulan nga pensiyon para sa mga kabus nga tigulang (60 anyos pataas). I-apod-apod kausa matag unom ka bulan sa inyong Barangay.'
    },
    category: 'news',
    tags: ['pension', 'senior citizen', 'stipend', 'osca', 'cash', 'indigent senior'],
    faqs: [
      {
        question: {
          en: 'Who is eligible for the DSWD Social Pension?',
          fil: 'Sino ang kwalipikado sa DSWD Social Pension?',
          ceb: 'Kinsa ang kwalipikado alang sa Social Pension?'
        },
        answer: {
          en: 'Senior citizens aged 60+ who are sick, frail, or have disabilities; have no pension from SSS/GSIS/PVAO; and receive no regular financial support from working children or family members.',
          fil: 'Mga nakatatanda na may edad 60 pataas na mahina, may sakit, o may kapansanan; walang tinatanggap na pension sa SSS/GSIS/PVAO; at walang regular na sustentong pera gikan sa pamilya.',
          ceb: 'Mga tigulang nga nag-edad og 60 pataas, luya o masakiton, walay pensiyon gikan sa SSS/GSIS/PVAO, ug walay regular nga suportang pinansiyal gikan sa mga anak.'
        }
      }
    ]
  },
  {
    id: 'r4',
    title: {
      en: 'How to check if you are registered in Listahanan Database | DSWD Portal',
      fil: 'Paano malalaman kung ikaw ay nakalista sa Listahanan Database | DSWD',
      ceb: 'Unsaon pagtan-aw kon nakalista ba ka sa Listahanan Database | DSWD'
    },
    url: 'https://listahanan.dswd.gov.ph/query',
    snippet: {
      en: 'Check your family listing on the National Household Targeting System (NHTS-PR) Listahanan. The database ensures objective identification of poor households in the Philippines.',
      fil: 'Suriin ang talaan ng pamilya sa National Household Targeting System (NHTS-PR) o Listahanan upang madama ang pondo ng kairapan. Alamin ang katayuan sa inyong lokal na DSWD desk.',
      ceb: 'Susiha kon nakalista ba ang inyong pamilya sa Listahanan sa DSWD aron makasalud sa mga programa sa gobyerno. Duola ang inyong lokal nga DSWD social worker.'
    },
    category: 'requirements',
    tags: ['listahanan', 'nhts', 'database', 'check family', 'status', 'poor list'],
  },
  {
    id: 'r5',
    title: {
      en: 'Sustainable Livelihood Program (SLP) Seed Capital Grants | DSWD',
      fil: 'Programa sa Sustenableng Kabuhayan (SLP) Tulong Puhunan | DSWD',
      ceb: 'Tulong Puhunan sa Livelihood (SLP) hangtod ₱15,000 | DSWD'
    },
    url: 'https://www.dswd.gov.ph/programs/slp',
    snippet: {
      en: 'Empower communities through micro-enterprise seed funding (up to ₱15,000) and skills management training. Facilitating local business startups and jobs across provinces.',
      fil: 'Pagpapalakas sa pamayanan gamit ang seed capital (hanggang ₱15,000) at pagsasanay sa pagnenegosyo. Sumali sa Sustainable Livelihood Association sa inyong barangay.',
      ceb: 'Paghatag og kahigayonan sa pagnegosyo pinaagi sa pag-apud-apod sa ₱15,000 nga puhunan ug training. Apil sa local Sustainable Livelihood Association.'
    },
    category: 'programs',
    tags: ['slp', 'seed capital', 'livelihood', 'pagnenegosyo', 'capital grant', 'tesda'],
  }
];

export const GENERAL_SEARCH_FALLBACK = (query: string): SearchResult => {
  return {
    id: `fallback-${Date.now()}`,
    title: {
      en: `Search results for "${query}" | DSWD Information Portal`,
      fil: `Mga resulta ng paghahanap para sa "${query}" | DSWD Portal`,
      ceb: `Mga resulta sa pagpangita alang sa "${query}" | DSWD Portal`
    },
    url: `https://www.dswd.gov.ph/search?q=${encodeURIComponent(query)}`,
    snippet: {
      en: `Here is the comprehensive index entry for your search query on DSWD social benefits. Explore 4Ps registration, AICS crisis aid, Senior Pension, and local centers.`,
      fil: `Narito ang komprehensibong tala para sa iyong hinanap tungkol sa mga serbisyo ng DSWD. Galugarin ang 4Ps, AICS krisis tulong, Pension ng Senior, at lokal na opisina.`,
      ceb: `Kini ang komprehensibong impormasyon alang sa imong gipangita sa DSWD. Susiha ang 4Ps, dinalian nga tabang sa AICS, Pensiyon sa Senior, ug mga lokal nga opisinang dapit.`
    },
    category: 'programs',
    tags: ['general', 'query', 'dswd', 'portal']
  };
};

export const COMMON_SEARCHES = [
  { text: 'Pantawid Pamilya (4Ps)', query: '4ps' },
  { text: 'Cash Assistance (AICS)', query: 'aics medical' },
  { text: 'Senior Citizen Pension', query: 'senior pension' },
  { text: 'Sustainable Livelihood (SLP)', query: 'livelihood slp' },
  { text: 'Listahanan Checklist', query: 'listahanan registered' },
  { text: 'Burial Cash Support', query: 'burial assistance' }
];
