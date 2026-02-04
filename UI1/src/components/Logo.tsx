import { useMemo, useState } from 'react';

interface LogoProps {
  className?: string;
  alt?: string;
}

export function Logo({ className = 'h-8 w-auto select-none', alt = 'AssetVerify by Cencora' }: LogoProps) {
  const sources = useMemo(() => [
    // Prefer the final Cencora logo
    '/brand/cencora-logo%20(1).svg',
    // Other provided assets
    '/brand/Image%20(1).svg',
    '/brand/VisionHack%20ProDemo_1.svg',
    // Fallbacks
    '/brand/assetverify-official.svg',
    '/brand/assetverify-official.png',
    '/brand/assetverify-by-cencora.svg',
  ], []);

  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (index < sources.length - 1) {
      setIndex(index + 1);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div className="flex flex-col leading-tight" aria-label="AssetVerify by Cencora">
        <span className="font-bold text-lg text-[#461e96]">AssetVerify</span>
        <span className="text-[14px] italic text-[#461e96] ml-16">by Cencora</span>
      </div>
    );
  }

  return (
    <img
      src={sources[index]}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
