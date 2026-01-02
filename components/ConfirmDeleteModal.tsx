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
        className="fixed inset-0 bg-black/40 backdrop-blur-subtle z-50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card padding="large" className="max-w-md w-full">
          <h2 className="text-heading-2 text-gray-text-primary mb-4">
            {title}
          </h2>
          
          <p className="text-body text-gray-text-secondary mb-2">
            {message}
          </p>
          
          {itemName && (
            <p className="text-body-large text-gray-text-primary font-medium mb-6">
              "{itemName}"
            </p>
          )}
          
          <div className="text-body-small text-gray-text-tertiary mb-6">
            Esta acción no se puede deshacer.
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-border text-body text-gray-text-primary rounded-button hover:bg-gray-50 transition-colors duration-fast"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white text-body font-medium rounded-button hover:bg-red-700 transition-colors duration-fast"
            >
              Eliminar
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}

