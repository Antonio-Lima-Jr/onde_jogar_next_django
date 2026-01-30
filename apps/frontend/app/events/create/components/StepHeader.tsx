'use client';

type StepHeaderProps = {
    currentStep: number;
    onStepChange: (nextStep: number) => void;
};

const STEPS = ['Details', 'Location', 'Review'] as const;

export default function StepHeader({ currentStep, onStepChange }: StepHeaderProps) {
    return (
        <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-[color:var(--color-text)] mb-8">Create New Event</h1>
            <div className="relative flex items-center justify-between max-w-md mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[color:var(--color-border)]"></div>
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                ></div>
                {STEPS.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;
                    const isDone = currentStep > stepNumber;
                    return (
                        <button
                            key={label}
                            type="button"
                            onClick={() => onStepChange(stepNumber)}
                            className="relative flex flex-col items-center group"
                        >
                            <div
                                className={`size-4 rounded-full transition-all ${isDone || isActive
                                    ? 'bg-primary shadow-[0_0_10px_rgba(89,242,13,0.3)]'
                                    : 'bg-[color:var(--color-border)]'
                                    }`}
                            ></div>
                            <span
                                className={`text-[10px] font-bold mt-2 uppercase transition-colors ${isActive || isDone
                                    ? 'text-[color:var(--color-text)]'
                                    : 'text-[color:var(--color-muted)]'
                                    }`}
                            >
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
