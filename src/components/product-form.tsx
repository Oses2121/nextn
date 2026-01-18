'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Product } from '@/lib/types';
import { useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ProductFormData } from '@/lib/product-actions';

const formSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer'),
    category: z.string().min(1, 'Category is required'),
    imageId: z.string().min(1, 'Image ID is required'),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    product?: Product | null;
    categories: Category[];
    onSave: (data: ProductFormValues) => void;
    isSaving: boolean;
}

export function ProductForm({ product, categories, onSave, isSaving }: ProductFormProps) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: product ? {
            ...product,
        } : {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            category: '',
            imageId: '',
        },
    });

    useEffect(() => {
        if (product) {
            form.reset(product);
        } else {
            form.reset({
                name: '',
                description: '',
                price: 0,
                stock: 0,
                category: '',
                imageId: '',
            });
        }
    }, [product, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Organic Kale" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A detailed description of the product." {...field} rows={5} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="$9.99" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image ID</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an image" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PlaceHolderImages.map(img => (
                                            <SelectItem key={img.id} value={img.id}>{img.id}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isSaving} className="w-full">
                    {isSaving ? 'Saving...' : 'Save Product'}
                </Button>
            </form>
        </Form>
    );
}
