import React from 'react';
import { BookOpen, ShieldCheck, PhoneCall, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

interface ResourcesGuideProps {
  lang: 'en' | 'hi';
}

export const ResourcesGuide: React.FC<ResourcesGuideProps> = ({ lang }) => {
  const isHi = lang === 'hi';

  const diseases = [
    {
      crop: isHi ? 'टमाटर (Tomato)' : 'Tomato (Solanum lycopersicum)',
      disease: isHi ? 'अगेती झुलसा (Early Blight)' : 'Early Blight (Alternaria solani)',
      pathogen: 'Fungal (Alternaria solani)',
      symptoms: isHi
        ? 'निचली पत्तियों पर गहरे भूरे रंग के संकेन्द्री छल्ले (Target spots) और पीला घेरा।'
        : 'Concentric dark brown target rings with prominent yellow chlorotic halo on mature leaflets.',
      sanitation: isHi
        ? 'संक्रमित पत्तियों को तोड़कर नष्ट करें। टपक सिंचाई (Drip) अपनाएं।'
        : 'Prune infected lower foliage immediately. Switch to drip irrigation to prevent foliar splashing.',
      reference: 'ICAR-IIHR Bangalore Technical Bulletin No. 18',
    },
    {
      crop: isHi ? 'धान / चावल (Rice)' : 'Rice / Paddy (Oryza sativa)',
      disease: isHi ? 'पत्ती झुलसा / ब्लास्ट (Blast Disease)' : 'Rice Blast (Magnaporthe oryzae)',
      pathogen: 'Fungal (Magnaporthe oryzae)',
      symptoms: isHi
        ? 'पत्ती पर आंख के आकार के या तकली जैसे धब्बे जिनका केंद्र राख जैसे धूसर रंग का होता है।'
        : 'Spindle-shaped / diamond lesions with ash-grey center and reddish-brown margin.',
      sanitation: isHi
        ? 'यूरिया की अत्यधिक खुराक से बचें। पोटाश का संतुलित प्रयोग करें।'
        : 'Avoid excessive split doses of Nitrogen (Urea); balance with Potash (MOP). Keep bunds weed-free.',
      reference: 'ICAR-NRRI Cuttack Blast Management Advisory',
    },
    {
      crop: isHi ? 'आलू (Potato)' : 'Potato (Solanum tuberosum)',
      disease: isHi ? 'पछेती झुलसा (Late Blight)' : 'Late Blight (Phytophthora infestans)',
      pathogen: 'Oomycete (Phytophthora infestans)',
      symptoms: isHi
        ? 'पत्तियों पर जल-सिक्त बड़े काले-भूरे धब्बे जो ठंडे-नम मौसम में तेजी से फैलते हैं।'
        : 'Rapidly expanding water-soaked dark purplish lesions with pale borders under humid conditions.',
      sanitation: isHi
        ? 'मिट्टी चढ़ाएं (Earthing-up) ताकि बीजाणु कंदों तक न पहुंचे। संक्रमित बेलों की कटाई करें।'
        : 'Perform thorough earthing-up (10cm barrier). Dehaulm vines 10 days before harvesting.',
      reference: 'ICAR-CPRI Shimla National Blight Advisory',
    },
    {
      crop: isHi ? 'कपास (Cotton)' : 'Cotton (Gossypium hirsutum)',
      disease: isHi ? 'पत्ती मरोड़ रोग (Leaf Curl Virus)' : 'Cotton Leaf Curl Begomovirus (CLCuV)',
      pathogen: 'Viral (Begomovirus / Whitefly vector)',
      symptoms: isHi
        ? 'पत्तियों का ऊपर की ओर मुड़ना, निचली सतह पर नसों का मोटा होना व उभार (Enations)।'
        : 'Upward curling of leaf margins with marked thickening of veins and enations.',
      sanitation: isHi
        ? 'शुरुआती 45 दिनों में रोगी पौधों को उखाड़कर नष्ट करें। पीले चिपचिपे ट्रैप लगाएं।'
        : 'Rogue infected plants early. Install 20 yellow sticky traps/ha for whitefly vector surveillance.',
      reference: 'ICAR-CICR Nagpur Vector Management Guidelines',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#80674733] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#245638]" />
            <h2 className="font-serif-title text-2xl font-bold text-[#245638]">
              {isHi ? 'कृषि रोग संदर्भ व मार्गदर्शन' : 'Agricultural Pathology & Guidance Reference'}
            </h2>
          </div>
          <p className="text-xs text-[#746C60] mt-1">
            {isHi
              ? 'आईसीएआर (ICAR) एवं राज्य कृषि विश्वविद्यालयों द्वारा प्रमाणित दिशानिर्देश।'
              : 'Integrated pest & disease management protocols aligned with ICAR and Agricultural Extension standards.'}
          </p>
        </div>

        {/* Emergency Extension Helplines */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#245638]" />
            <div>
              <span className="text-[10px] block font-semibold text-emerald-800">
                {isHi ? 'किसान कॉल सेंटर (निःशुल्क)' : 'Kisan Call Centre (Toll-Free)'}
              </span>
              <span className="font-bold text-xs">1800-180-1551</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diseases.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#80674733] shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#806747] uppercase tracking-wide">
                  {item.crop}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF6ED] text-[#245638] border border-[#80674722]">
                  {item.pathogen}
                </span>
              </div>
              <h3 className="font-serif-title text-lg font-bold text-[#245638] mt-1">
                {item.disease}
              </h3>

              <div className="mt-3 space-y-2 text-xs text-[#24342A]">
                <div>
                  <strong className="text-[#806747]">{isHi ? 'मुख्य लक्षण:' : 'Visual Symptoms:'}</strong>{' '}
                  {item.symptoms}
                </div>
                <div>
                  <strong className="text-[#478653]">{isHi ? 'खेत प्रबंधन:' : 'Agronomic Sanitation:'}</strong>{' '}
                  {item.sanitation}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#80674722] text-[11px] text-[#746C60] flex items-center justify-between">
              <span>{item.reference}</span>
              <ShieldCheck className="w-4 h-4 text-[#478653]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
