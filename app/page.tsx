import DarkModeAwareContent from '../components/DarkModeAwareContent';
import React from 'react';
import { DarkModeProvider } from '../context/DarkModeContext';

// page.tsx als Server Component, die Provider einsetzt und Client Component einbettet
export default function Page() {
  return (
    <DarkModeProvider>
      <DarkModeAwareContent />
    </DarkModeProvider>
  );
}
