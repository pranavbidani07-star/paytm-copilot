import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { useData } from '../../context/DataContext';

export function TickerBar() {
  const { t, language } = useI18n();
  const { isDataInserted } = useData();

  const dataAnnouncements = {
    en: [
      'Inundated Area: 3,420 sq. km',
      'Affected Citizens: 142,500',
      'Affected Settlements: 1,280 villages',
      'Stranded Victims Detected: 1,840',
      'Critical Priority Queue: 12 cases',
      'Active Relief Camps: 245',
      'NDRF/SDRF Teams Deployed: 38 teams',
      'District Nodes Online: 35/35',
      'Emergency Hotline: 1070 / 1079 (Toll-Free)'
    ],
    hi: [
      'बाढ़ग्रस्त क्षेत्र: 3,420 वर्ग किमी',
      'प्रभावित नागरिक: 142,500',
      'प्रभावित गांव: 1,280 बस्तियां',
      'पहचाने गए पीड़ित: 1,840 लोग',
      'गंभीर बचाव मामले: 12 केस',
      'सक्रिय राहत शिविर: 245 केंद्र',
      'एनडीआरएफ/एसडीआरएफ टीम: 38 दल',
      'जिला नोड्स: 35/35 ऑनलाइन',
      'आपत्कालीन हेल्पलाइन: 1070 / 1079 (टोल-फ्री)'
    ],
    as: [
      'বানপানী হোৱা অঞ্চল: ৩,৪২০ বৰ্গ কিমি',
      'প্ৰভাৱিত নাগৰিক: ১৪২,৫০০ জন',
      'প্ৰভাৱিত গাওঁ: ১,২৮০ খন',
      'চিনাক্ত কৰা ভুক্তভোগী: ১,৮৪০ জন',
      'জৰুৰী উদ্ধাৰ কেছ: ১২ টা',
      'সক্ৰিয় সাহায্য শিবিৰ: ২৪৫ টা',
      'উদ্ধাৰকাৰী দল: ৩৮ টা এনডিআৰএফ/এছডিআৰএফ দল',
      'জিলা নোড: ৩৫/৩৫ সক্ৰিয়',
      'জৰুৰীকালীন হেল্পলাইন: ১০৭০ / ১০৭৯ (টোল-ফ্ৰী)'
    ]
  };

  const standbyAnnouncements = {
    en: [
      'District Nodes Operational: 35/35',
      'Active Helpline: 1070 / 1079 (Toll-Free 24/7)',
      'Drone Surveillance Feeds: 08 channels ready',
      'SEOC Response Nodes: 100% operational'
    ],
    hi: [
      'जिला नोड परिचालन: 35/35 सक्रिय',
      'आपत्कालीन हेल्पलाइन: 1070 / 1079 (24/7 टोल-फ्री)',
      'ड्रोन निगरानी फीड: 08 चैनल तैयार',
      'एसईओसी प्रतिक्रिया नोड: 100% परिचालन'
    ],
    as: [
      'জিলা নোড পৰিচালনা: ৩৫/৩৫ সক্ৰিয়',
      'জৰুৰীকালীন হেল্পলাইন: ১০৭০ / ১০৭৯ (২৪/৭ টোল-ফ্ৰী)',
      'ড্ৰোন নিৰীক্ষণ ফিড: ০৮ টা চেনেল প্ৰস্তুত',
      'SEOC পৰিচালনা নোড: ১০০% কাৰ্যক্ষম'
    ]
  };

  const currentList = isDataInserted 
    ? (dataAnnouncements[language as keyof typeof dataAnnouncements] || dataAnnouncements.en)
    : (standbyAnnouncements[language as keyof typeof standbyAnnouncements] || standbyAnnouncements.en);

  return (
    <div className="bg-teal-950 border-b border-teal-900 text-[11px] text-teal-100 flex items-center shrink-0 h-8 relative z-30 overflow-hidden shadow-sm">
      <div className="bg-gov-saffron text-white px-3 md:px-4 h-full flex items-center font-bold tracking-wider relative z-10 shadow-[4px_0_12px_rgba(0,0,0,0.6)] uppercase shrink-0 text-[10px] md:text-xs">
        {t('overview.latestUpdates') || 'Latest Updates'}
      </div>
      <div className="flex-1 overflow-hidden relative flex items-center h-full cursor-default">
        <div className="animate-marquee gap-10 pl-6 text-xs font-mono">
          {currentList.concat(currentList).map((text, idx) => (
            <span key={idx} className="whitespace-nowrap flex items-center gap-2 font-semibold">
              <span className="text-gov-saffron font-bold text-sm">•</span> {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
