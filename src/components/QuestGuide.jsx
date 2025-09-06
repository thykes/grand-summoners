// src/components/QuestGuide.jsx

import React from 'react';

const UnitMention = ({ unit, onUnitClick }) => {
    if (!unit) return null;

    return (
        <div 
            className="inline-flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/80 p-1 pr-3 rounded-full cursor-pointer transition-colors border border-gray-700"
            onClick={() => onUnitClick(unit)}
        >
            <img src={unit.Thumbnail_URL} alt={unit.Unit_Name} className="w-8 h-8 rounded-full object-cover" />
            <span className="font-semibold text-sm text-cyan-300">{unit.Unit_Name}</span>
        </div>
    );
};

// --- NEW: A dedicated component for styling the Gimmick list ---
const GimmickList = ({ items }) => {
    return (
        <ul className="list-none pl-0 space-y-4">
            {items.map((item, i) => {
                const parts = item.split(':');
                const title = parts[0] + ':';
                const description = parts.slice(1).join(':');
                return (
                    <li key={i} className="flex items-start">
                        <span className="text-cyan-400 text-xl mr-3 mt-1">•</span>
                        <div>
                            <strong className="text-white">{title}</strong>
                            {description}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};


export default function QuestGuide({ guideData, allUnits, onUnitClick }) {
    if (!guideData) {
        return (
            <div className="text-center text-gray-500 py-8">
                <p>No detailed guide available for this boss yet.</p>
            </div>
        );
    }

    const findUnit = (name) => allUnits.find(u => u.Unit_Name === name);

    return (
        <article className="prose prose-invert prose-lg max-w-none text-gray-300">
            {guideData.bannerImageUrl && (
                // --- FIX: Responsive banner image sizing ---
                <img 
                    src={guideData.bannerImageUrl} 
                    alt={`${guideData.title} Banner`} 
                    className="rounded-lg shadow-lg mb-8 w-full md:w-2/3 lg:w-1/2 mx-auto" 
                />
            )}
            
            <p className="lead mb-8">{guideData.introduction}</p>

            {guideData.sections.map((section, index) => {
                switch (section.type) {
                    case 'heading':
                        return <h2 key={index} className="text-cyan-400 border-b border-gray-700 pb-2 mt-10 mb-6">{section.content}</h2>;
                    case 'list_heading':
                         return <h4 key={index} className="text-white font-bold mt-8 mb-4">{section.content}</h4>
                    case 'paragraph':
                        return <p key={index} className="mb-6">{section.content}</p>;
                    case 'list':
                        // --- FIX: Use the new GimmickList for specific sections ---
                        if (section.title === "Key Gimmicks") {
                             return <GimmickList key={index} items={section.content} />;
                        }
                        return (
                            <ul key={index} className="mb-6">
                                {section.content.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        );
                    default:
                        return null;
                }
            })}

            <h2 className="text-cyan-400 border-b border-gray-700 pb-2 mt-12 mb-6">Recommended Units</h2>
            {guideData.recommendedUnits.map((rec, index) => (
                <div key={index} className="mb-8">
                    <h4 className="text-white font-bold">{rec.category}</h4>
                    <div className="flex flex-wrap gap-3 mt-3">
                        {rec.units.map(unitName => (
                            <UnitMention key={unitName} unit={findUnit(unitName)} onUnitClick={onUnitClick} />
                        ))}
                    </div>
                </div>
            ))}
        </article>
    );
}