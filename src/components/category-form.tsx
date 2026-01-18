'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Category } from '@/lib/types';
import { useEffect } from 'react';
import type { CategoryFormData } from '@/lib/category-actions';

const formSchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and contain no spaces'),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    category?: Category | null;
    onSave: (data: CategoryFormValues) => void;
    isSaving: boolean;
}

export function CategoryForm({ category, onSave, isSaving }: CategoryFormProps) {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: category ? { ...category } : { name: '', slug: '' },
    });

    useEffect(() => {
        if (category) {
            form.reset(category);
        } else {
            form.reset({ name: '', slug: '' });
        }
    }, [category, form]);
    
    const watchedName = form.watch('name');
    useEffect(() => {
        if (!category) { // only auto-generate slug for new categories
            const slug = watchedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            form.setValue('slug', slug, { shouldValidate: true });
        }
    }, [watchedName, form, category]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Organic Foods" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. organic-foods" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSaving} className="w-full">
                    {isSaving ? 'Saving...' : 'Save Category'}
                </Button>
            </form>
        </Form>
    );
}
