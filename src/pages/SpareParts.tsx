
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Search, Filter, ChevronDown, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const categories = [
  { id: 1, name: 'محرك', icon: '🔧' },
  { id: 2, name: 'فرامل', icon: '🛑' },
  { id: 3, name: 'تعليق', icon: '🔩' },
  { id: 4, name: 'كهرباء', icon: '⚡' },
  { id: 5, name: 'مكيف هواء', icon: '❄️' },
  { id: 6, name: 'إضاءة', icon: '💡' },
  { id: 7, name: 'زيوت وفلاتر', icon: '🧴' },
  { id: 8, name: 'عجلات وإطارات', icon: '🛞' },
];

const brands = ['تويوتا', 'هوندا', 'هيونداي', 'كيا', 'مرسيدس', 'بي إم دبليو', 'فولكسفاغن', 'شيفروليه'];

const spareParts = [
  {
    id: 1,
    name: 'فلتر زيت تويوتا الأصلي',
    brand: 'تويوتا',
    category: 'زيوت وفلاتر',
    price: 15,
    compatibility: ['كورولا', 'كامري', 'راف فور'],
    image: 'https://images.unsplash.com/photo-1635784063388-e29f0a717a1e?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    isOriginal: true,
  },
  {
    id: 2,
    name: 'مجموعة وسادات فرامل أمامية',
    brand: 'بوش',
    category: 'فرامل',
    price: 45,
    compatibility: ['هوندا أكورد', 'هوندا سيفيك'],
    image: 'https://images.unsplash.com/photo-1635700420661-0e8aaa1477bb?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    isOriginal: false,
  },
  {
    id: 3,
    name: 'شمعات إشعال إيريديوم',
    brand: 'دينسو',
    category: 'محرك',
    price: 28,
    compatibility: ['كيا سبورتاج', 'هيونداي توسان'],
    image: 'https://images.unsplash.com/photo-1635700420615-762e17402faf?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    isOriginal: false,
  },
  {
    id: 4,
    name: 'مصابيح LED أمامية',
    brand: 'فيليبس',
    category: 'إضاءة',
    price: 55,
    compatibility: ['مرسيدس الفئة C', 'مرسيدس الفئة E'],
    image: 'https://images.unsplash.com/photo-1621347311949-73129c18d1d8?auto=format&fit=crop&q=80&w=400',
    inStock: false,
    isOriginal: false,
  },
  {
    id: 5,
    name: 'مكثف مكيف هواء',
    brand: 'دينسو',
    category: 'مكيف هواء',
    price: 120,
    compatibility: ['تويوتا كامري', 'تويوتا أفالون'],
    image: 'https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    isOriginal: true,
  },
  {
    id: 6,
    name: 'مساعدات تعليق خلفية',
    brand: 'مونرو',
    category: 'تعليق',
    price: 85,
    compatibility: ['بي إم دبليو الفئة 3', 'بي إم دبليو الفئة 5'],
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    isOriginal: false,
  },
  {
    id: 7,
    name: 'بطارية 60 أمبير',
    brand: 'فارتا',
    category: 'كهرباء',
    price: 95,
    compatibility: ['فولكسفاغن جولف', 'فولكسفاغن باسات'],
    image: 'https://images.unsplash.com/photo-1615584241035-e591cae69337?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    isOriginal: false,
  },
  {
    id: 8,
    name: 'مجموعة إطارات ميشلان 16 إنش',
    brand: 'ميشلان',
    category: 'عجلات وإطارات',
    price: 480,
    compatibility: ['هوندا أكورد', 'تويوتا كامري', 'هيونداي سوناتا'],
    image: 'https://images.unsplash.com/photo-1614226114960-4e7ade978d7a?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    isOriginal: true,
  },
];

const SpareParts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  return (
    <MainLayout>
      <div className="container-custom py-28">
        <div className="text-center mb-12">
          <h1 className="heading-2 mb-4">قطع غيار السيارات</h1>
          <p className="subtitle mx-auto">تسوق من تشكيلة واسعة من قطع الغيار الأصلية والبديلة لكافة موديلات السيارات. شحن سريع ودعم فني متخصص.</p>
        </div>
        
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                  selectedCategory === category.name
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-white hover:border-primary/30 hover:bg-primary/5'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث عن قطع غيار..."
                className="w-full pr-10 py-2 pl-4 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>فلترة</span>
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border/50">
              <div>
                <h3 className="font-medium mb-3">ماركة السيارة</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الماركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">موديل السيارة</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الموديل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corolla">كورولا</SelectItem>
                    <SelectItem value="camry">كامري</SelectItem>
                    <SelectItem value="accord">أكورد</SelectItem>
                    <SelectItem value="civic">سيفيك</SelectItem>
                    <SelectItem value="sportage">سبورتاج</SelectItem>
                    <SelectItem value="tucson">توسان</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">النوع</h3>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="original">أصلي</TabsTrigger>
                    <TabsTrigger value="replacement">بديل</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          )}
        </div>
        
        {/* Parts Listing */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {spareParts
            .filter(part => !selectedCategory || part.category === selectedCategory)
            .map((part) => (
            <div 
              key={part.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg border border-border/30"
            >
              <div className="relative h-48">
                <img src={part.image} alt={part.name} className="h-full w-full object-cover" />
                {part.isOriginal && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-syria-deepred text-white">أصلي</Badge>
                  </div>
                )}
                {!part.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold">غير متوفر حاليًا</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{part.brand}</span>
                  <span className="text-sm text-muted-foreground">{part.category}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{part.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-primary font-bold">${part.price}</span>
                  <span className={`text-sm ${part.inStock ? 'text-green-600' : 'text-red-500'}`}>
                    {part.inStock ? 'متوفر' : 'غير متوفر'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <span>يناسب: </span>
                  {part.compatibility.join('، ')}
                </div>
                <Button 
                  variant={part.inStock ? "default" : "outline"} 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!part.inStock}
                >
                  <ShoppingCart size={16} />
                  <span>{part.inStock ? 'أضف إلى السلة' : 'غير متوفر'}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SpareParts;



// import React, { useEffect, useState } from 'react';
// import MainLayout from '../layouts/MainLayout';
// import { Search, Filter, ChevronDown, ShoppingCart } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import axios from '../config/axiosConfig'; // Import the Axios instance

// const SpareParts = () => {
//   const [spareParts, setSpareParts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
//   // Fetch spare parts data from the API
//   useEffect(() => {
//     const fetchSpareParts = async () => {
//       try {
//         const response = await axios.get('/spare-parts'); // Adjust the endpoint as necessary
//         setSpareParts(response.data);
//       } catch (err) {
//         console.error("Error fetching spare parts:", err);
//         setError("حدث خطأ أثناء تحميل قطع الغيار");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSpareParts();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Show loading state
//   }

//   if (error) {
//     return <div>{error}</div>; // Show error message
//   }

//   return (
//     <MainLayout>
//       <div className="container-custom py-28">
//         <div className="text-center mb-12">
//           <h1 className="heading-2 mb-4">قطع غيار السيارات</h1>
//           <p className="subtitle mx-auto">تسوق من تشكيلة واسعة من قطع الغيار الأصلية والبديلة لكافة موديلات السيارات. شحن سريع ودعم فني متخصص.</p>
//         </div>
        
//         {/* Categories */}
//         <div className="mb-12">
//           <h2 className="text-xl font-bold mb-6">تصفح حسب الفئة</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
//                   selectedCategory === category.name
//                     ? 'border-primary bg-primary/5 text-primary'
//                     : 'border-border bg-white hover:border-primary/30 hover:bg-primary/5'
//                 }`}
//                 onClick={() => setSelectedCategory(category.name)}
//               >
//                 <span className="text-2xl mb-2">{category.icon}</span>
//                 <span className="text-sm font-medium">{category.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>
        
//         {/* Search and Filters */}
//         <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="ابحث عن قطع غيار..."
//                 className="w-full pr-10 py-2 pl-4 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
//             </div>
//             <Button 
//               variant="outline" 
//               className="flex items-center gap-2"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter size={18} />
//               <span>فلترة</span>
//               <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//             </Button>
//           </div>
          
//           {showFilters && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border/50">
//               <div>
//                 <h3 className="font-medium mb-3">ماركة السيارة</h3>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="اختر الماركة" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {brands.map((brand) => (
//                       <SelectItem key={brand} value={brand}>{brand}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div>
//                 <h3 className="font-medium mb-3">موديل السيارة</h3>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="اختر الموديل" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="corolla">كورولا</SelectItem>
//                     <SelectItem value="camry">كامري</SelectItem>
//                     <SelectItem value="accord">أكورد</SelectItem>
//                     <SelectItem value="civic">سيفيك</SelectItem>
//                     <SelectItem value="sportage">سبورتاج</SelectItem>
//                     <SelectItem value="tucson">توسان</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div>
//                 <h3 className="font-medium mb-3">النوع</h3>
//                 <Tabs defaultValue="all">
//                   <TabsList className="grid w-full grid-cols-3">
//                     <TabsTrigger value="all">الكل</TabsTrigger>
//                     <TabsTrigger value="original">أصلي</TabsTrigger>
//                     <TabsTrigger value="replacement">بديل</TabsTrigger>
//                   </TabsList>
//                 </Tabs>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Parts Listing */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {spareParts
//             .filter(part => !selectedCategory || part.category === selectedCategory)
//             .map((part) => (
//             <div 
//               key={part.id} 
//               className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg border border-border/30"
//             >
//               <div className="relative h-48">
//                 <img src={part.image} alt={part.name} className="h-full w-full object-cover" />
//                 {part.isOriginal && (
//                   <div className="absolute top-3 right-3">
//                     <Badge variant="secondary" className="bg-syria-deepred text-white">أصلي</Badge>
//                   </div>
//                 )}
//                 {!part.inStock && (
//                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                     <span className="text-white font-bold">غير متوفر حاليًا</span>
//                   </div>
//                 )}
//               </div>
//               <div className="p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-muted-foreground">{part.brand}</span>
//                   <span className="text-sm text-muted-foreground">{part.category}</span>
//                 </div>
//                 <h3 className="font-bold text-lg mb-2">{part.name}</h3>
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="text-primary font-bold">${part.price}</span>
//                   <span className={`text-sm ${part.inStock ? 'text-green-600' : 'text-red-500'}`}>
//                     {part.inStock ? 'متوفر' : 'غير متوفر'}
//                   </span>
//                 </div>
//                 <div className="text-sm text-muted-foreground mb-4">
//                   <span>يناسب: </span>
//                   {part.compatibility.join('، ')}
//                 </div>
//                 <Button 
//                   variant={part.inStock ? "default" : "outline"} 
//                   className="w-full"
//                   disabled={!part.inStock}
//                 >
//                   <ShoppingCart size={16} />
//                   <span>{part.inStock ? 'أضف إلى السلة' : 'غير متوفر'}</span>
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default SpareParts;