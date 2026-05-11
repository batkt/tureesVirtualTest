import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
const GuidedTour = ({ steps, isOpen, onClose, currentStep: externalStep, onStepChange }) => {
  const { t } = useTranslation();
  const [internalStep, setInternalStep] = useState(0);
  const currentStep = externalStep !== undefined ? externalStep : internalStep;
  const setCurrentStep = (step) => {
    if (onStepChange) onStepChange(step);
    else setInternalStep(step);
  };

  const [spotlightRect, setSpotlightRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const updateSpotlight = useCallback(() => {
    if (!isOpen || !steps[currentStep]) return;

    const target = document.getElementById(steps[currentStep].targetId);
    if (target) {
      const rect = target.getBoundingClientRect();
      const padding = 16;
      
      const paddedRect = {
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        bottom: rect.bottom + padding,
        right: rect.right + padding
      };

      setSpotlightRect(paddedRect);

      // Handle parent overflows
      let currentParent = target.parentElement;
      while (currentParent && currentParent !== document.body) {
        const style = window.getComputedStyle(currentParent);
        if (style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowY === 'hidden') {
          currentParent.classList.add('tutorial-parent-overflow-visible');
        }
        currentParent = currentParent.parentElement;
      }

      // Position tooltip
      let tTop = rect.bottom + 30;
      let tLeft = rect.left + rect.width / 2 - 160;

      const tooltipHeight = 220;
      const tooltipWidth = 320;

      // Vertical auto-positioning
      if (tTop + tooltipHeight > window.innerHeight - 20) {
          tTop = rect.top - tooltipHeight - 30;
      }
      
      // Clamp to viewport
      tTop = Math.max(20, Math.min(tTop, window.innerHeight - tooltipHeight - 20));
      tLeft = Math.max(20, Math.min(tLeft, window.innerWidth - tooltipWidth - 20));

      setTooltipPos({ top: tTop, left: tLeft });
      
      // Target element zoom effect
      target.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      target.style.zIndex = '100001';
      target.style.position = 'relative'; 
      target.classList.add('tutorial-active-element');
    }
  }, [isOpen, steps, currentStep]);

  const cleanupTutorialStyles = useCallback(() => {
    steps.forEach(step => {
      const target = document.getElementById(step.targetId);
      if (target) {
        target.style.zIndex = '';
        target.style.position = '';
        target.style.transform = '';
        target.classList.remove('tutorial-active-element');
        
        let currentParent = target.parentElement;
        while (currentParent && currentParent !== document.body) {
          currentParent.classList.remove('tutorial-parent-overflow-visible');
          currentParent = currentParent.parentElement;
        }
      }
    });
  }, [steps]);

  useEffect(() => {
    if (isOpen) {
      updateSpotlight();
      const handleUpdate = () => {
          updateSpotlight();
      };
      window.addEventListener('resize', handleUpdate);
      window.addEventListener('scroll', handleUpdate);
    } else {
      cleanupTutorialStyles();
    }
    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
    };
  }, [isOpen, updateSpotlight, cleanupTutorialStyles]);

  useEffect(() => {
      if (isOpen) {
          cleanupTutorialStyles();
          const target = document.getElementById(steps[currentStep]?.targetId);
          if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Update spotlight position during and after scroll
              let scrollInterval = setInterval(updateSpotlight, 30);
              const timeout = setTimeout(() => {
                  clearInterval(scrollInterval);
                  updateSpotlight();
              }, 800);

              return () => {
                  clearInterval(scrollInterval);
                  clearTimeout(timeout);
              };
          }
      }
      updateSpotlight();
  }, [currentStep, steps, updateSpotlight, isOpen, cleanupTutorialStyles]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !isOpen || !spotlightRect) return null;
  const step = steps[currentStep];

  const { top, left, right, bottom } = spotlightRect;
  // Create a polygon that covers the whole screen but has a hole in it
  const clipPath = `polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px ${top}px)`;

  const content = (
    <div className="fixed inset-0 z-[200000] pointer-events-none">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px] pointer-events-auto transition-all duration-300"
        style={{ clipPath, WebkitClipPath: clipPath }}
        onClick={onClose}
      />
      
      <div 
        className="fixed bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[340px] pointer-events-auto z-[200001] border border-emerald-500/30"
        style={{ top: tooltipPos.top, left: tooltipPos.left, transition: 'all 0.2s ease-out' }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="bg-emerald-500/10 px-2.5 py-1 rounded-lg">
            <h3 className="text-emerald-500 font-black text-[11px] uppercase tracking-widest">{step.title}</h3>
          </div>
          <Button type="text" size="small" icon={<CloseOutlined className="text-gray-400 group-hover:text-emerald-500" />} onClick={onClose} className="hover:bg-emerald-500/10 rounded-lg" />
        </div>
        
        <p className="text-slate-700 dark:text-slate-200 text-[14px] leading-relaxed mb-6 font-medium">
          {step.description}
        </p>

        <div className="flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-950/20 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-emerald-100 dark:border-emerald-900/30">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'bg-emerald-500 w-5' : 'bg-slate-300 dark:bg-slate-700'}`} />
            ))}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button size="small" onClick={() => setCurrentStep(prev => prev - 1)} className="rounded-lg font-bold border-none bg-slate-200/50 dark:bg-slate-800 dark:text-gray-400">
                {t("Буцах")}
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button type="primary" size="small" onClick={() => setCurrentStep(prev => prev + 1)} className="bg-emerald-500 hover:bg-emerald-400 border-none rounded-lg font-bold shadow-lg shadow-emerald-500/20">
                {t("Дараах")} <RightOutlined className="text-[10px]" />
              </Button>
            ) : (
              <Button type="primary" size="small" onClick={onClose} className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-lg font-bold shadow-lg shadow-emerald-600/20">
                {t("Дуусгах")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .tutorial-active-element {
          transform: scale(1.03) !important;
          box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.7) !important;
          z-index: 100001 !important;
          pointer-events: none !important;
          position: relative !important;
        }
        .tutorial-parent-overflow-visible {
          overflow: visible !important;
          z-index: 99999 !important;
          position: relative !important;
        }
      `}</style>
    </div>
  );

  return createPortal(content, document.body);
};

export default GuidedTour;
