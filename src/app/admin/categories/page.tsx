'use client';

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CategoryFormData } from "@/lib/category-actions";
import { CategoryForm } from "@/components/category-form";
import { deleteCategory, saveCategory } from "@/lib/category-actions";

function CategoriesTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function AdminCategoriesPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const categoriesQuery = useMemoFirebase(() => collection(firestore, 'categories'), [firestore]);
    const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const handleAddNew = () => {
        setCategoryToEdit(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (category: Category) => {
        setCategoryToEdit(category);
        setIsSheetOpen(true);
    };

    const handleDeleteRequest = (category: Category) => {
        setCategoryToDelete(category);
        setIsAlertOpen(true);
    };

    const handleSaveCategory = async (data: CategoryFormData) => {
        setIsSaving(true);
        try {
            await saveCategory(firestore, data, categoryToEdit?.id);
            toast({ title: "Success", description: `Category ${categoryToEdit ? 'updated' : 'created'} successfully.` });
            setIsSheetOpen(false);
            setCategoryToEdit(null);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "There was a problem saving the category." });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(firestore, categoryToDelete.id);
            toast({ title: "Success", description: "Category deleted successfully." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "There was a problem deleting the category." });
        } finally {
            setIsAlertOpen(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Categories</CardTitle>
                            <CardDescription>Manage your product categories.</CardDescription>
                        </div>
                        <Button onClick={handleAddNew}>Add Category</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? <CategoriesTableSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories?.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => handleEdit(category)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleDeleteRequest(category)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                {!isLoading && categories && (
                    <CardFooter>
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>1-{categories.length}</strong> of <strong>{categories.length}</strong> categories
                        </div>
                    </CardFooter>
                )}
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md w-[90vw] overflow-y-auto">
                    <SheetHeader className="px-6 pt-6">
                        <SheetTitle>{categoryToEdit ? 'Edit Category' : 'Add New Category'}</SheetTitle>
                        <SheetDescription>
                            {categoryToEdit ? 'Update the details of your category.' : 'Fill in the details to add a new category.'}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="p-6">
                        <CategoryForm 
                            category={categoryToEdit} 
                            onSave={handleSaveCategory}
                            isSaving={isSaving}
                        />
                    </div>
                </SheetContent>
            </Sheet>
            
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category
                            &quot;{categoryToDelete?.name}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
