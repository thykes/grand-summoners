// src/components/BattlePlanDisplay.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BattlePlanDisplay({ plan, allUnits, onUnitClick }) {
  if (!plan) return null;

  const strategyRegex = /### Overall Strategy\s*([\s\S]*?)(?=###|$)/;
  const rolesRegex = /### Unit Roles & Loadout\s*([\s\S]*?)(?=###|$)/;
  const executionRegex = /### Execution\s*([\s\S]*)/;

  const strategyMatch = plan.match(strategyRegex);
  const rolesMatch = plan.match(rolesRegex);
  const executionMatch = plan.match(executionRegex);

  const Section = ({ title, content }) => {
    if (!content || !content[1] || content[1].trim() === '') return null;
    return (
        <div className="mt-8 first:mt-0">
            <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2 mb-4">{title}</h3>
            <div className="prose prose-invert max-w-none text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content[1].trim()}</ReactMarkdown>
            </div>
        </div>
    );
  };

  const UnitRolesSection = ({ content }) => {
    if (!content || !content[1] || content[1].trim() === '') return null;
    
    const parts = content[1].trim().split(/\n\s*(?=\*\*)/);
    
    return (
      <div className="mt-8 first:mt-0">
        <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2 mb-4">Unit Roles & Loadout</h3>
        <div className="space-y-6">
          {parts.map((part, index) => {
            if (!part.trim()) return null;

            const unitNameMatch = part.match(/^\*\*([A-Za-z0-9\s'()-]+)\*\*/);
            if (!unitNameMatch) {
              return <div key={index}><ReactMarkdown remarkPlugins={[remarkGfm]}>{part}</ReactMarkdown></div>;
            }
            
            const unitName = unitNameMatch[1];
            const unitData = allUnits.find(u => u.Unit_Name === unitName);
            const description = part.replace(unitNameMatch[0], "").trim();

            return (
              <div key={unitName} className="flex items-start gap-4">
                {unitData && (
                  <div className="flex flex-col items-center flex-shrink-0 w-20">
                    <img 
                      src={unitData.Thumbnail_URL} 
                      alt={unitName} 
                      className="w-14 h-14 rounded-lg cursor-pointer transition-transform hover:scale-105" 
                      onClick={() => onUnitClick(unitData)}
                    />
                    <span className="text-sm font-bold text-cyan-400 mt-1 text-center">{unitName}</span>
                  </div>
                )}
                <div className="prose prose-invert max-w-none text-gray-300 pt-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {strategyMatch && <Section title="Overall Strategy" content={strategyMatch} />}
      {rolesMatch && <UnitRolesSection content={rolesMatch} />}
      {executionMatch && <Section title="Execution" content={executionMatch} />}
    </div>
  );
}