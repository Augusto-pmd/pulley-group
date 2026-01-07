'use client';

import { useEffect } from 'react';
import Card from './Card';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card padding="large" className="max-w-md w-full">
          <h2 className="text-heading-2 text-text-primary mb-4">
            {title}
          </h2>
          
          <p className="text-body text-text-secondary mb-2">
            {message}
          </p>
          
          {itemName && (
            <p className="text-body-large text-text-primary font-medium mb-6">
              "{itemName}"
            </p>
          )}
          
          <div className="text-body-small text-text-secondary mb-6">
            Esta acción no se puede deshacer.
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-button text-body transition-colors duration-fast"
              style={{ 
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-button text-body font-medium transition-colors duration-fast"
              style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1F2A33'}
            >
              Eliminar
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}

