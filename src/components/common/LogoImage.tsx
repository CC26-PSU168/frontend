"use client";

import { useEffect, useState } from 'react';
// Try importing the asset from project `asset/` folder (frontend/asset)
import logoAsset from '../../../asset/logo-dbs-capstone.png';

type Props = {
  className?: string;
  alt?: string;
};

export default function LogoImage({ className = 'w-8 h-8', alt = 'Budgetly logo' }: Props) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [errored, setErrored] = useState<boolean>(false);

  // Resolve URL from imported asset (Next will provide an object with .src or a string)
  const resolvedUrl = (logoAsset as any)?.src || (logoAsset as unknown as string) || '/logo-dbs-capstone.png';

  useEffect(() => {
    const img = new Image();
    img.src = resolvedUrl;
    img.onload = () => setLoaded(true);
    img.onerror = () => setErrored(true);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [resolvedUrl]);

  if (errored) {
    return (
      <span className="material-symbols-outlined text-[#BCFF4F]" aria-hidden>
        account_balance_wallet
      </span>
    );
  }

  return (
    <div
      aria-label={alt}
      role="img"
      className={`${className} bg-center bg-no-repeat bg-contain transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`}
      style={{ backgroundImage: loaded ? `url('${resolvedUrl}')` : undefined }}
    />
  );
}

