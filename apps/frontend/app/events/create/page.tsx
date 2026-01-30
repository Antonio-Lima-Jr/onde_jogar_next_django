'use client';

import TopNav from '@/app/components/ui/TopNav';
import { createEvent, fetchEventCategories } from '@/lib/api';
import { useRequireAuth } from '@/lib/use-require-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { EventCategory } from '@/types/event';
import {
    ErrorToast,
    FormActions,
    Step1Form,
    Step2Form,
    Step3Review,
    StepHeader,
} from './components';

type CreateEventPayload = {
    title: string;
    description: string;
    date: string;
    slots: number;
    category_id?: number;
    latitude?: number;
    longitude?: number;
};

const REVIEW_LOCK_MS = 600;

export default function CreateEventPage() {
    const router = useRouter();
    const { auth } = useRequireAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState(10);
    const [showValidation, setShowValidation] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [reviewLockUntil, setReviewLockUntil] = useState(0);

    const hasCoords = latitude !== null && longitude !== null;

    const selectedCategory = useMemo(
        () => categories.find((category) => category.id === selectedCategoryId) || null,
        [categories, selectedCategoryId]
    );

    const isStep1Valid =
        title.trim().length > 0 &&
        description.trim().length > 0 &&
        date.length > 0 &&
        slots >= 1 &&
        !!selectedCategoryId;

    const isStep2Valid = hasCoords;
    const canContinue = step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : false;
    const canSubmit = isStep1Valid && isStep2Valid && step === 3;

    useEffect(() => {
        let isMounted = true;
        fetchEventCategories()
            .then((data) => {
                if (!isMounted) return;
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategoryId(data[0].id);
                }
                setCategoriesLoading(false);
            })
            .catch((error) => {
                console.error('Failed to load categories', error);
                if (isMounted) {
                    setCategoriesLoading(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const lockReviewSubmit = () => {
        const unlockAt = Date.now() + REVIEW_LOCK_MS;
        setReviewLockUntil(unlockAt);
        setTimeout(() => setReviewLockUntil(0), REVIEW_LOCK_MS + 50);
    };

    const handleStepChange = (nextStep: number) => {
        if (nextStep === 3) {
            lockReviewSubmit();
        }
        setStep(nextStep);
    };

    const handleContinue = () => {
        if (!canContinue) {
            setShowValidation(true);
            return;
        }
        setShowValidation(false);
        setSubmitError(null);
        setStep((prev) => {
            const nextStep = Math.min(3, prev + 1);
            if (nextStep === 3) {
                lockReviewSubmit();
            }
            return nextStep;
        });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key !== 'Enter' || step === 3) return;
        const target = event.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!auth.token) return;

        if (step !== 3) {
            setShowValidation(true);
            return;
        }

        if (reviewLockUntil && Date.now() < reviewLockUntil) {
            return;
        }

        if (!isStep1Valid || !isStep2Valid) {
            setShowValidation(true);
            return;
        }

        setSubmitError(null);
        setLoading(true);
        const isoDate = date ? new Date(date).toISOString() : '';

        const data: CreateEventPayload = {
            title,
            description,
            date: isoDate,
            slots,
        };

        if (selectedCategoryId) {
            data.category_id = selectedCategoryId;
        }

        if (hasCoords) {
            data.latitude = latitude;
            data.longitude = longitude;
        }

        try {
            await createEvent(data, auth.token);
            router.push('/events');
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to create event';
            setSubmitError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[color:var(--color-background)] font-display text-[color:var(--color-text)]">
            <TopNav />
            <main className="max-w-[800px] mx-auto px-4 py-12">
                {submitError && <ErrorToast message={submitError} onDismiss={() => setSubmitError(null)} />}
                <StepHeader currentStep={step} onStepChange={handleStepChange} />

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={handleKeyDown}
                    className="bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8"
                >
                    {step === 1 && (
                        <Step1Form
                            title={title}
                            description={description}
                            date={date}
                            slots={slots}
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                            selectedCategoryId={selectedCategoryId}
                            showValidation={showValidation}
                            onTitleChange={setTitle}
                            onDescriptionChange={setDescription}
                            onDateChange={setDate}
                            onSlotsChange={setSlots}
                            onCategoryChange={setSelectedCategoryId}
                        />
                    )}

                    {step === 2 && (
                        <Step2Form
                            latitude={latitude}
                            longitude={longitude}
                            hasCoords={hasCoords}
                            showValidation={showValidation}
                            onSelectLocation={(lat, lng) => {
                                setLatitude(lat);
                                setLongitude(lng);
                            }}
                        />
                    )}

                    {step === 3 && (
                        <Step3Review
                            title={title}
                            description={description}
                            date={date}
                            slots={slots}
                            hasCoords={hasCoords}
                            latitude={latitude}
                            longitude={longitude}
                            categoryName={selectedCategory?.name ?? null}
                        />
                    )}

                    <FormActions
                        step={step}
                        loading={loading}
                        canSubmit={canSubmit}
                        reviewLockUntil={reviewLockUntil}
                        onBack={() => handleStepChange(Math.max(1, step - 1))}
                        onContinue={handleContinue}
                    />
                </form>
            </main>
        </div>
    );
}
