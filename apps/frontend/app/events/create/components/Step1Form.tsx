'use client';

import type { EventCategory } from '@/types/event';

type Step1FormProps = {
    title: string;
    description: string;
    date: string;
    slots: number;
    categories: EventCategory[];
    categoriesLoading: boolean;
    selectedCategoryId: number | '';
    showValidation: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onSlotsChange: (value: number) => void;
    onCategoryChange: (value: number | '') => void;
};

export default function Step1Form({
    title,
    description,
    date,
    slots,
    categories,
    categoriesLoading,
    selectedCategoryId,
    showValidation,
    onTitleChange,
    onDescriptionChange,
    onDateChange,
    onSlotsChange,
    onCategoryChange,
}: Step1FormProps) {
    return (
        <div className="space-y-8">
            <div>
                <label htmlFor="title" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Event Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                    placeholder="e.g. Saturday Morning 3v3 Scrimmage"
                />
                {showValidation && title.trim().length === 0 && (
                    <p className="mt-2 text-xs font-semibold text-red-500">Title is required.</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Event Category</label>
                <select
                    id="category"
                    name="category"
                    required
                    value={selectedCategoryId}
                    onChange={(e) => {
                        const value = e.target.value;
                        onCategoryChange(value ? parseInt(value, 10) : '');
                    }}
                    disabled={categoriesLoading || categories.length === 0}
                    className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                >
                    {categoriesLoading && (
                        <option value="" disabled>
                            Loading categories...
                        </option>
                    )}
                    {!categoriesLoading && categories.length === 0 && (
                        <option value="" disabled>
                            No categories available
                        </option>
                    )}
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <p className="mt-2 text-xs font-semibold text-[color:var(--color-muted)]">
                    Choose the closest fit. Use “Other” for custom events.
                </p>
                {showValidation && !selectedCategoryId && (
                    <p className="mt-2 text-xs font-semibold text-red-500">Category is required.</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Description</label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none resize-none"
                    placeholder="What should people know before joining?"
                />
                {showValidation && description.trim().length === 0 && (
                    <p className="mt-2 text-xs font-semibold text-red-500">Description is required.</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="date" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Date & Time</label>
                    <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        required
                        value={date}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none [color-scheme:light]"
                    />
                    {showValidation && date.length === 0 && (
                        <p className="mt-2 text-xs font-semibold text-red-500">Date and time are required.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="slots" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Number of Slots</label>
                    <input
                        type="number"
                        id="slots"
                        name="slots"
                        required
                        min="1"
                        value={slots}
                        onChange={(e) => onSlotsChange(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                        placeholder="e.g., 10"
                    />
                    {showValidation && slots < 1 && (
                        <p className="mt-2 text-xs font-semibold text-red-500">Slots must be at least 1.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
