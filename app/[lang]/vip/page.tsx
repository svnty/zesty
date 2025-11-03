

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh*0.55)] items-center justify-center p-4 mb-5 mt-5">
      <div className="text-center space-y-6">
        <svg 
          fill="currentColor" 
          className="w-24 h-24 mx-auto text-muted-foreground" 
          viewBox="0 0 24 24" 
          id="Layer_1" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>{`
              .cls-1 {
                fill: none;
                stroke: currentColor;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 1.5px;
              }
            `}</style>
          </defs>
          <polygon className="cls-1" points="9.13 22.54 5.29 22.54 5.29 6.25 5.29 1.46 9.13 1.46 9.13 22.54" />
          <polygon className="cls-1" points="1.46 6.25 22.54 6.25 22.54 5.29 9.13 1.46 5.29 1.46 1.46 5.29 1.46 6.25" />
          <line className="cls-1" x1="23.5" y1="22.54" x2="0.5" y2="22.54" />
          <path className="cls-1" d="M20.62,6.25V9.64a1.82,1.82,0,0,0,.9,1.63A1.92,1.92,0,1,1,18.71,13" />
          <line className="cls-1" x1="9.13" y1="16.79" x2="5.29" y2="20.63" />
          <line className="cls-1" x1="5.29" y1="12" x2="9.13" y2="15.83" />
          <line className="cls-1" x1="9.13" y1="7.21" x2="5.29" y2="11.04" />
        </svg>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Under Construction</h1>
          <p className="text-muted-foreground text-lg">This VIP section is currently being built. Check back soon!</p>
        </div>
      </div>
    </div>
  );
}