'use client';

type ErrorToastProps = {
    message: string;
    onDismiss: () => void;
};

export default function ErrorToast({ message, onDismiss }: ErrorToastProps) {
    return (
        <div className="fixed top-24 right-6 z-50 max-w-sm">
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-lg">
                <span className="material-symbols-outlined text-red-500">error</span>
                <div className="text-sm font-semibold">{message}</div>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="ml-auto text-red-500 hover:text-red-700"
                    aria-label="Dismiss error"
                >
                    <span className="material-symbols-outlined text-base">close</span>
                </button>
            </div>
        </div>
    );
}
