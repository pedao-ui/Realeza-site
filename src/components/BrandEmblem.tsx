import {BUSINESS_INFO} from '../data/barbershop';

interface BrandEmblemProps {
  size?: 'sm' | 'lg';
}

export function BrandEmblem({size = 'sm'}: BrandEmblemProps) {
  const dimensions = size === 'sm' ? 'h-9 w-9' : 'h-14 w-14';

  return (
    <span
      className={`relative inline-block ${dimensions} shrink-0 overflow-hidden rounded-full border border-[#CDA77F]/55 bg-[#30395F]`}
    >
      <img
        src={BUSINESS_INFO.logoSrc}
        alt="Emblema Realeza Visagismo"
        width={size === 'sm' ? 36 : 56}
        height={size === 'sm' ? 36 : 56}
        loading={size === 'sm' ? 'eager' : 'lazy'}
        decoding={size === 'sm' ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        style={{transform: 'scale(1.48) translateY(-1.8%)'}}
        className="h-full w-full object-cover object-center"
      />
    </span>
  );
}
