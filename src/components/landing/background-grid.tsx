'use client';

export function BackgroundGrid() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={
        {
          '--grid-color-light': 'rgba(15, 23, 42, 0.06)',
          '--grid-color-dark': 'rgba(248, 250, 252, 0.06)',
          '--grid-color': 'var(--grid-color-light)',
          backgroundImage: `
            linear-gradient(to bottom, transparent 1px, var(--grid-color) 1px),
            linear-gradient(to right, transparent 1px, var(--grid-color) 1px)
          `,
          backgroundSize: '2rem 2rem',
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--grid-color))]"></div>
      <style>{`.dark { --grid-color: var(--grid-color-dark); }`}</style>
    </div>
  );
}
