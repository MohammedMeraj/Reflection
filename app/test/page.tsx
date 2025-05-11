// app/page.tsx
import React from 'react';

export default function Page() {
  // Replace 15551234567 with your full international number, no plus or symbols
  const phone = '1111111111';
  const text  = encodeURIComponent('sMPLWWED');
  const href  = `whatsapp://send?phone=${phone}&text=${text}`;

  return (
    <div>
      <a
        href={href}                     // native scheme
        target="_blank"                 // signals external navigation
        rel="noopener noreferrer"       // security best practice
        style={{ textDecoration: 'none' }}
      >
        <button>Send via WhatsApp</button>
      </a>
    </div>
  );
}
