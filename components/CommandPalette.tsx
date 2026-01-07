'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMode } from '@/contexts/ModeContext';
import Card from './Card';

interface Command {
  id: string;
  label: string;
  href: string;
  category: string;
  keywords: string[];
  mode?: 'estado' | 'mes' | 'fondo' | 'detalle';
}

const commands: Command[] = [
  { id: 'estado', label: 'Estado', href: '/', category: 'Modos', keywords: ['estado', 'patrimonio', 'total'], mode: 'estado' },
  { id: 'mes', label: 'Mes', href: '/vida-mensual', category: 'Modos', keywords: ['mes', 'mensual', 'vida', 'gastos', 'ingresos'], mode: 'mes' },
  { id: 'fondo', label: 'Fondo', href: '/emma', category: 'Modos', keywords: ['fondo', 'emma', 'ahorro'], mode: 'fondo' },
  { id: 'detalle-activos', label: 'Detalle - Activos', href: '/activos', category: 'Modos', keywords: ['activos', 'bienes', 'propiedades'], mode: 'detalle' },
  { id: 'detalle-inversiones', label: 'Detalle - Inversiones', href: '/investments', category: 'Modos', keywords: ['inversiones', 'inversión', 'portfolio'], mode: 'detalle' },
  { id: 'projections', label: 'Proyecciones', href: '/projections', category: 'Análisis', keywords: ['proyecciones', 'futuro', 'simulación'] },
  { id: 'futurologia', label: 'Futurología', href: '/futurologia', category: 'Análisis', keywords: ['futurología', 'escenarios'] },
  { id: 'flows', label: 'Flujos', href: '/flows', category: 'Análisis', keywords: ['flujos', 'movimientos', 'dinero'] },
  { id: 'bitacora', label: 'Bitácora', href: '/bitacora', category: 'Análisis', keywords: ['bitácora', 'historial', 'log'] },
  { id: 'vista-contador', label: 'Vista Contador', href: '/vista-contador', category: 'Análisis', keywords: ['contador', 'contabilidad'] },
  { id: 'settings', label: 'Ajustes', href: '/settings', category: 'Configuración', keywords: ['ajustes', 'configuración', 'settings', 'config'] },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { setMode, setDetailTarget } = useMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filtrar comandos según búsqueda
  const filteredCommands = search
    ? commands.filter(cmd => 
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
      )
    : commands;

  // Agrupar por categoría
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abrir con ⌘K (Mac) o Ctrl+K (Windows/Linux) o /
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      }

      // Cerrar con Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
      }

      // Navegar con flechas
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          handleSelect(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, search, selectedIndex, filteredCommands]);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Scroll al item seleccionado
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.querySelectorAll('[data-command-index]');
      const selectedItem = items[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (cmd: Command) => {
    if (cmd.mode) {
      setMode(cmd.mode);
      if (cmd.id === 'detalle-activos') {
        setDetailTarget('activos');
      } else if (cmd.id === 'detalle-inversiones') {
        setDetailTarget('inversiones');
      }
    }
    router.push(cmd.href);
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - capa base oscura */}
      <div 
        className="fixed inset-0 z-[200] backdrop-blur-md transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={() => {
          setIsOpen(false);
          setSearch('');
          setSelectedIndex(0);
        }}
      />

      {/* Command Palette */}
      <div className="fixed inset-0 z-[201] flex items-start justify-center pt-[20vh] px-4">
        <Card padding="normal" className="w-full max-w-2xl">
          {/* Input */}
          <div className="mb-4">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Buscar sección o comando..."
              className="w-full px-4 py-3 rounded-input text-body transition-colors duration-fast"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#B59A6A';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
            />
          </div>

          {/* Lista de comandos */}
          <div 
            ref={listRef}
            className="max-h-[400px] overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(181, 154, 106, 0.3) transparent',
            }}
          >
            {Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="mb-6">
                <div className="text-caption text-text-secondary uppercase tracking-wider mb-2 px-2 opacity-60">
                  {category}
                </div>
                <div className="space-y-1">
                  {cmds.map((cmd, idx) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    const isSelected = globalIndex === selectedIndex;
                    const isActive = pathname === cmd.href || (cmd.href !== '/' && pathname.startsWith(cmd.href + '/'));

                    return (
                      <button
                        key={cmd.id}
                        data-command-index={globalIndex}
                        onClick={() => handleSelect(cmd)}
                        className="w-full text-left px-4 py-2.5 rounded-button text-body transition-colors duration-fast"
                        style={{
                          // Capa translúcida con luz cálida en foco
                          backgroundColor: isSelected 
                            ? 'rgba(181, 154, 106, 0.12)' 
                            : isActive
                            ? 'rgba(181, 154, 106, 0.06)'
                            : 'transparent',
                          backgroundImage: isSelected 
                            ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.15) 0%, transparent 70%)'
                            : 'none',
                          color: '#F5F2EC',
                          border: isSelected 
                            ? '1px solid rgba(181, 154, 106, 0.3)'
                            : '1px solid transparent',
                          backdropFilter: isSelected ? 'blur(10px)' : 'none',
                          boxShadow: isSelected
                            ? 'inset 0 0 10px rgba(181, 154, 106, 0.1), 0 2px 8px rgba(0, 0, 0, 0.2)'
                            : 'none',
                        }}
                        onMouseEnter={(e) => {
                          setSelectedIndex(globalIndex);
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.08)';
                            e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.1) 0%, transparent 70%)';
                            e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = isActive ? 'rgba(181, 154, 106, 0.06)' : 'transparent';
                            e.currentTarget.style.backgroundImage = 'none';
                            e.currentTarget.style.borderColor = 'transparent';
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{cmd.label}</span>
                          {isActive && (
                            <span className="text-caption text-text-secondary opacity-60">Actual</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="text-center py-8 text-body text-text-secondary">
                No se encontraron resultados
              </div>
            )}
          </div>

          {/* Ayuda */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
            <div className="flex items-center justify-between text-caption text-text-secondary opacity-60">
              <span>↑↓ Navegar</span>
              <span>↵ Seleccionar</span>
              <span>Esc Cerrar</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

