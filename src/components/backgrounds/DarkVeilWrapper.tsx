'use client';
import DarkVeil from './DarkVeil';

export default function DarkVeilWrapper() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <DarkVeil />
    </div>
  );
}
