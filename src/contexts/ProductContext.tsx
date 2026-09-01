import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '@/data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  exportProductsAsCode: () => string;
}

const STORAGE_KEY = 'boom_products_v1';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading products from localStorage:', e);
    }
    return DEFAULT_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage:', e);
    }
  }, [products]);

  const addProduct = useCallback((newProd: Omit<Product, 'id'> & { id?: string }) => {
    const product: Product = {
      ...newProd,
      id: newProd.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      rating: newProd.rating || '4.5',
      inStock: newProd.inStock !== false,
    };
    setProducts((prev) => [product, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    setProducts(DEFAULT_PRODUCTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    } catch (e) {
      console.error('Error resetting products:', e);
    }
  }, []);

  const exportProductsAsCode = useCallback(() => {
    return `import { Product } from '@/types';\n\n// Static product catalog\nexport const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};\n`;
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
        exportProductsAsCode,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
