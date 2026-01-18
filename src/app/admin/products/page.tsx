'use client';

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Category, Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ProductForm } from "@/components/product-form";
import { deleteProduct, saveProduct } from "@/lib/product-actions";
import { useToast } from "@/hooks/use-toast";
import type { ProductFormData } from "@/lib/product-actions";


function ProductsTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Stock</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden sm:table-cell">
                            <Skeleton className="aspect-square rounded-md h-16 w-16" />
                        </TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}


export default function AdminProductsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    // Data fetching
    const productsQuery = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
    const { data: products, isLoading: areProductsLoading } = useCollection<Product>(productsQuery);
    const categoriesQuery = useMemoFirebase(() => collection(firestore, 'categories'), [firestore]);
    const { data: categories, isLoading: areCategoriesLoading } = useCollection<Category>(categoriesQuery);

    // State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);


    // Handlers
    const handleAddNew = () => {
        setProductToEdit(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (product: Product) => {
        setProductToEdit(product);
        setIsSheetOpen(true);
    };

    const handleDeleteRequest = (product: Product) => {
        setProductToDelete(product);
        setIsAlertOpen(true);
    };

    const handleSaveProduct = async (data: ProductFormData) => {
        setIsSaving(true);
        try {
            await saveProduct(firestore, data, productToEdit?.id);
            toast({ title: "Success", description: `Product ${productToEdit ? 'updated' : 'created'} successfully.` });
            setIsSheetOpen(false);
            setProductToEdit(null);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "There was a problem saving the product." });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(firestore, productToDelete.id);
            toast({ title: "Success", description: "Product deleted successfully." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "There was a problem deleting the product." });
        } finally {
            setIsAlertOpen(false);
            setProductToDelete(null);
        }
    };
    
    const isLoading = areProductsLoading || areCategoriesLoading;

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your products and view their sales performance.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>Add Product</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <ProductsTableSkeleton /> : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products?.map((product) => {
                    const productImage = PlaceHolderImages.find(img => img.id === product.imageId);
                    return (
                        <TableRow key={product.id}>
                            <TableCell className="hidden sm:table-cell">
                            {productImage && (
                                <Image
                                    alt={product.name}
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={productImage.imageUrl}
                                    width="64"
                                    data-ai-hint={productImage.imageHint}
                                />
                            )}
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                                <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                </Badge>
                            </TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
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
                                <DropdownMenuItem onSelect={() => handleEdit(product)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDeleteRequest(product)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
        )}
      </CardContent>
      {!isLoading && products && (
        <CardFooter>
            <div className="text-xs text-muted-foreground">
            Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> products
            </div>
        </CardFooter>
      )}
    </Card>

    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
            <SheetHeader className="px-6 pt-6">
                <SheetTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</SheetTitle>
                <SheetDescription>
                    {productToEdit ? 'Update the details of your product.' : 'Fill in the details to add a new product.'}
                </SheetDescription>
            </SheetHeader>
            <div className="p-6">
                <ProductForm 
                    product={productToEdit} 
                    categories={categories || []}
                    onSave={handleSaveProduct}
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
                    This action cannot be undone. This will permanently delete the product
                    &quot;{productToDelete?.name}&quot;.
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
