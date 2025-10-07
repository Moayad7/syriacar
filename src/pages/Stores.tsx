import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "../components/SEO";
import Spinner from "@/components/ui/Spinner";
import axiosInstance from "../config/axiosConfig";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, X } from "lucide-react";

// Mock data for stores (للاحتياط عند فشل الاتصال بالAPI)
const storesMockData = [
  {
    id: 1,
    name: "My Car Store cars",
    description: "Best store for car parts",
    address: "Street XYZ",
    phone: "123456789",
    email: "storecar1@example.com",
    website: "http://yourdomain.com",
    logo: "https://backend.syriacarpro.com/storage/stores/logos/Nb4Y36UiF44a00soncazNViZSqTLks4DrFV95sHt.png",
    owner: {
      id: 42,
      name: "shop_manger",
      email: "shop_manger2@gmail.com",
    },
    status: "active",
  },
];

const Stores = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setSearching(searchTerm !== "");
      const response = await axiosInstance.get(`/api/stores?page=${currentPage}&per_page=${perPage}&search=${searchTerm}`);
      
      // إذا كان الرد يحتوي على بيانات pagination (Laravel-style)
      if (response.data.data && response.data.meta) {
        setStores(response.data.data);
        setLastPage(response.data.meta.last_page);
        setTotal(response.data.meta.total);
      } 
      // إذا كان الرد مباشرة مصفوفة (بدون pagination)
      else if (Array.isArray(response.data)) {
        setStores(response.data);
        setLastPage(1);
        setTotal(response.data.length);
      } 
      // إذا كان الرد يحتوي على pagination بأسلوب مختلف
      else if (response.data.stores) {
        setStores(response.data.stores);
        setLastPage(response.data.last_page || 1);
        setTotal(response.data.total || response.data.stores.length);
      }
      else {
        setStores(response.data.data || response.data);
        setLastPage(1);
        setTotal(response.data.length || 0);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("فشل في تحميل المتاجر. يتم عرض بيانات تجريبية.");
      // استخدام البيانات التجريبية في حالة فشل الاتصال
      setStores(storesMockData);
      setLastPage(1);
      setTotal(storesMockData.length);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [currentPage, searchTerm, perPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== searchTerm) {
        setSearchTerm(searchQuery);
        setCurrentPage(1);
      }
    }, 800); // تأخير 800 مللي ثانية قبل إجراء البحث

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchTerm]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // دالة للبحث المباشر عند الضغط على زر البحث أو Enter
  const handleDirectSearch = () => {
    setSearchTerm(searchQuery);
    setCurrentPage(1);
  };

  // مسح البحث
  const clearSearch = () => {
    setSearchQuery("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // إنشاء مصفوفة أرقام الصفحات لعرضها في Pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <MainLayout>
      <SEO
        title="المتاجر - أفضل متاجر قطع غيار السيارات"
        description="تصفح قائمة المتاجر المتخصصة في قطع غيار السيارات."
        canonicalUrl="/stores"
        keywords="متاجر قطع غيار السيارات, قطع غيار, متاجر سيارات"
      />
      <div className="container-custom py-28">
        <div className="mb-8">
          <h1 className="heading-2 mb-4">المتاجر</h1>
          <p className="text-muted-foreground max-w-3xl">
            تصفح قائمة المتاجر المتخصصة في قطع غيار السيارات.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="ابحث عن متجر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDirectSearch()}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={handleDirectSearch} disabled={searching}>
              {searching ? <Spinner className="h-4 w-4" /> : "بحث"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            اكتب اسم المتجر أو وصفه للبحث
          </p>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div>
          {loading ? (
            <div className="h-[500px] flex items-center justify-center">
              <Spinner />
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm
                  ? "لم يتم العثور على متاجر تطابق بحثك."
                  : "لا توجد متاجر متاحة حالياً."}
              </p>
              {searchTerm && (
                <Button variant="outline" className="mt-4" onClick={clearSearch}>
                  مسح البحث
                </Button>
              )}
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    عرض نتائج البحث عن: <span className="font-medium text-foreground">"{searchTerm}"</span>
                  </p>
                  <Button variant="ghost" onClick={clearSearch} className="text-sm">
                    مسح البحث
                  </Button>
                </div>
              )}
              
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {stores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < lastPage) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === lastPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}

              {/* معلومات Pagination */}
              <div className="text-center text-sm text-muted-foreground mt-4">
                عرض {stores.length} من أصل {total} متجر
                {searchTerm && ` للبحث عن: "${searchTerm}"`}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

const StoreCard = ({ store }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img
          src={imageError || !store.logo 
            ? "https://via.placeholder.com/300x200?text=صورة+المتجر" 
            : store.logo
          }
          alt={store.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
      </div>
      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{store.name}</h3>
        <p className="text-muted-foreground mb-4">{store.description}</p>
        
        <div className="space-y-2 mb-4">
          {store.phone && (
            <div className="flex items-center gap-2">
              <span className="text-sm">الهاتف: {store.phone}</span>
            </div>
          )}
          {store.email && (
            <div className="flex items-center gap-2">
              <span className="text-sm">البريد الإلكتروني: {store.email}</span>
            </div>
          )}
          {store.address && (
            <div className="flex items-center gap-2">
              <span className="text-sm">العنوان: {store.address}</span>
            </div>
          )}
          {store.website && (
            <div className="flex items-center gap-2">
              <span className="text-sm">
                الموقع:{" "}
                <a 
                  href={store.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {store.website}
                </a>
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-auto pt-4">
          <Button className="flex-1">اتصل الآن</Button>
          <Button variant="outline">زيارة المتجر</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stores;