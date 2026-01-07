'use client';

import { useState, useEffect } from 'react';

export default function CommandPaletteHint() {
  const [showHint, setShowHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Mostrar hint solo si el usuario no ha interactuado aún
    const interacted = localStorage.getItem('pulley-has-interacted');
    if (!interacted) {
      // Mostrar después de 3 segundos
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setHasInteracted(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowHint(false);
    setHasInteracted(true);
    localStorage.setItem('pulley-has-interacted', 'true');
  };

  if (!showHint || hasInteracted) return null;

  return (
    <div className="fixed bottom-24 left-8 z-[148]">
      <div 
        className="rounded-container p-4 max-w-xs"
        style={{
          backgroundColor: 'rgba(31, 42, 51, 0.95)',
          border: '1px solid rgba(181, 154, 106, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="text-body text-text-primary mb-2">
          Presiona <kbd className="px-2 py-1 rounded text-caption" style={{ backgroundColor: 'rgba(181, 154, 106, 0.2)' }}>⌘K</kbd> o <kbd className="px-2 py-1 rounded text-caption" style={{ backgroundColor: 'rgba(181, 154, 106, 0.2)' }}>/</kbd> para navegar
        </div>
        <button
          onClick={handleDismiss}
          className="text-caption text-text-secondary hover:text-text-primary transition-colors duration-fast"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

