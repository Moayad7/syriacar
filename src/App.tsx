// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CarListings from "./pages/CarListings";
import Rentals from "./pages/Rentals";
import SpareParts from "./pages/SpareParts";
import KnowYourNeeds from "./pages/KnowYourNeeds";
import Login from "./pages/Login";
import CarDetails from "./pages/CarDetails";
import AddCar from "./pages/AddCar";
import UserDashboard from "./pages/UserDashboard";
import EditCar from "./pages/EditCar";
import AdminDashboard from "./adminDashboard";
import Users from "./adminDashboard/Users";
import Cars from "./adminDashboard/Cars";
import Stores_dash from "./adminDashboard/Stores";
import Stores from "./pages/Stores";
import Workshops from "./pages/Workshops";
import AddWorkshop from "./pages/AddWorkshop";
import AddWorkshopAd from "./pages/AddWorkshopAd";
import WarrantyInspectionForm from "./pages/WarrantyInspectionForm";
import { CarProvider } from "./components/CarProvider";
import SearchResults from "./pages/SearchResults";
import Categories from "./adminDashboard/Categories";
import Workshops_Admin from "./adminDashboard/Workshops_Admin";
import { AuthProvider } from './AuthContext'; // Import AuthProvider
import ProtectedRoute from './AuthContext/ProtectedRoute'; // Import ProtectedRoute
import AddStore from "./pages/AddStore";
import EditStore from "./pages/EditStore";
import EditWorkshop from "./pages/EditWorkshop";
import WorkshopDashboard from "./pages/WorkshopDashboard";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <CarProvider>
          <BrowserRouter>
          <AuthProvider> {/* Wrap with AuthProvider */}
            <Toaster />
            <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/car-listings" element={<CarListings />} />
                <Route path="/car/:id" element={<CarDetails />} />
                <Route path="/add-car" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
                <Route path="/rentals" element={<Rentals />} />
                <Route path="/spare-parts" element={<SpareParts />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/workshops" element={<Workshops />} />
                <Route path="/workshops-dashboard" element={<WorkshopDashboard />} />
                <Route path="/edit-workshop/:id" element={<ProtectedRoute><EditWorkshop /></ProtectedRoute>} />
                <Route path="/add-workshop" element={<ProtectedRoute><AddWorkshop /></ProtectedRoute>} />
                <Route path="/add-workshop-ad" element={<ProtectedRoute><AddWorkshopAd /></ProtectedRoute>} />
                <Route path="/know-your-needs" element={<KnowYourNeeds />} />
                <Route path="/add-store" element={<ProtectedRoute><AddStore /></ProtectedRoute>} />
                <Route path="/edit-store/:id" element={<ProtectedRoute><EditStore /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/edit-car/:id" element={<ProtectedRoute><EditCar /></ProtectedRoute>} />
                <Route path="/inspction" element={<ProtectedRoute><WarrantyInspectionForm /></ProtectedRoute>} />
                <Route path="/searchResults" element={<SearchResults />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
                  <Route path="users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                  <Route path="cars" element={<ProtectedRoute><Cars /></ProtectedRoute>} />
                  <Route path="stores" element={<ProtectedRoute><Stores_dash /></ProtectedRoute>} />
                  <Route path="categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                  <Route path="workshops" element={<ProtectedRoute><Workshops_Admin /></ProtectedRoute>} />
                </Route>
              </Routes>
          </AuthProvider>
           </BrowserRouter>
        </CarProvider>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
