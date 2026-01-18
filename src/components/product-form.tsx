'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from './ui/separator';

const variantSchema = z.object({
    name: z.string().min(1, 'Variant name is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer'),
});

const formSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    basePrice: z.coerce.number().min(0, 'Base price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    imageId: z.string().min(1, 'Image ID is required'),
    variants: z.array(variantSchema).min(1, 'At least one product variant is required.'),
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
        defaultValues: {
            name: '',
            description: '',
            basePrice: 0,
            category: '',
            imageId: '',
            variants: [{ name: 'Default', price: 0, stock: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variants"
    });

    useEffect(() => {
        if (product) {
            form.reset({
                ...product,
                basePrice: product.basePrice || 0,
                variants: product.variants?.length ? product.variants : [{ name: 'Default', price: product.basePrice, stock: 0 }],
            });
        } else {
            form.reset({
                name: '',
                description: '',
                basePrice: 0,
                category: '',
                imageId: '',
                variants: [{ name: 'Default', price: 0, stock: 0 }],
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
                
                <Separator />

                <div>
                    <h3 className="text-lg font-medium">Pricing & Inventory</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage variants for this product.</p>
                    
                    <FormField
                        control={form.control}
                        name="basePrice"
                        render={({ field }) => (
                            <FormItem className="max-w-xs">
                                <FormLabel>Base Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="$9.99" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4 mt-4">
                        <Label>Variants</Label>
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-[1fr_100px_100px_auto] gap-2 items-start border p-3 rounded-lg">
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Small" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.stock`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Stock</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center h-full pt-6">
                                     <Button type="button" variant="ghost" size="icon" onClick={() => fields.length > 1 && remove(index)} disabled={fields.length <= 1}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => append({ name: '', price: form.getValues('basePrice'), stock: 0 })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Variant
                    </Button>
                     {form.formState.errors.variants && (
                        <p className="text-sm font-medium text-destructive mt-2">
                           {form.formState.errors.variants.message}
                        </p>
                    )}
                </div>


                <Button type="submit" disabled={isSaving} className="w-full">
                    {isSaving ? 'Saving...' : 'Save Product'}
                </Button>
            </form>
        </Form>
    );
}
