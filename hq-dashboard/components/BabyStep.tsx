import React, { useEffect, useState } from 'react';

export default function BabyStep() {
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    fetch('/api/babyStepStatus')
      .then(res => res.json())
      .then(data => setCurrentStep(data.currentBabyStep));
  }, []);

  return <p>{currentStep}</p>;
}
