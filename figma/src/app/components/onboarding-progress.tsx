import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  step < currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step === currentStep
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground'
                }`}
              >
                {step < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span style={{ fontWeight: 600 }}>{step}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground mt-2">
                Step {step}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`w-16 h-0.5 mb-6 transition-colors ${
                  step < currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
