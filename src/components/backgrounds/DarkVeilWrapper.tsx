'use client';
import DarkVeil from './DarkVeil';

export default function DarkVeilWrapper() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ width: '100%', height: '100%', position: 'fixed' }}
    >
      <DarkVeil />
    </div>
  );
}