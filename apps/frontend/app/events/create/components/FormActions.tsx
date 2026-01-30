'use client';

type FormActionsProps = {
    step: number;
    loading: boolean;
    canSubmit: boolean;
    reviewLockUntil: number;
    onBack: () => void;
    onContinue: () => void;
};

export default function FormActions({
    step,
    loading,
    canSubmit,
    reviewLockUntil,
    onBack,
    onContinue,
}: FormActionsProps) {
    return (
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
            <button
                type="button"
                onClick={onBack}
                disabled={step === 1 || loading}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text)] font-bold tracking-wide hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
            >
                Back
            </button>

            {step < 3 ? (
                <button
                    type="button"
                    onClick={onContinue}
                    className="w-full sm:w-auto bg-primary hover:brightness-105 text-[color:var(--color-on-primary)] font-black px-8 py-3 rounded-full transition-all shadow-lg shadow-primary/20"
                >
                    Continue
                </button>
            ) : (
                <button
                    type="submit"
                    disabled={loading || !canSubmit || (reviewLockUntil && Date.now() < reviewLockUntil)}
                    className="w-full sm:w-auto bg-primary hover:brightness-105 text-[color:var(--color-on-primary)] text-lg font-black px-8 py-3 rounded-full transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Publishing...' : 'Create event'}
                    <span className="material-symbols-outlined">bolt</span>
                </button>
            )}
        </div>
    );
}
