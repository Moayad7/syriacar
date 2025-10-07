import axiosInstance from '@/config/axiosConfig';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the car data
interface CarData {
  id: string;
  title?: string;
  location?: string;
  year?: number;
  price?: number;
  fuelType?: string;
  mileage?: number;
  imageUrl?: string;
  featured?: boolean;
  // Add any other relevant fields here
}

// Define the context type
interface CarContextType {
  cars: CarData[]; // Array of car data
  setCars: React.Dispatch<React.SetStateAction<CarData[]>>; // Setter for car data
  searchResults: CarData[]; // New field for search results
  setSearchResults: React.Dispatch<React.SetStateAction<CarData[]>>; // Setter for search results
  loading: boolean; // Loading state
  error: string | null; // Error state
//   fetchCars: (minPrice: number, maxPrice: number) => Promise<void>; // Function to fetch cars
}

// Create the context
const CarContext = createContext<CarContextType | undefined>(undefined);

// Create a provider component
export const CarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<CarData[]>([]); // Initialize car data as an empty array
  const [searchResults, setSearchResults] = useState<CarData[]>([]); // Initialize search results as an empty array
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Function to fetch car data based on price range
//   const fetchCars = async (minPrice: number, maxPrice: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.get(`/api/cars?price[min]=${minPrice}&price[max]=${maxPrice}&offer_type=sale`);
//       setCars(response.data.data);
//       setSearchResults(response.data.data); // Set search results to fetched cars
//     } catch (err) {
//       console.error("Error fetching cars:", err);
//       setError("حدث خطأ أثناء تحميل السيارات");
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <CarContext.Provider value={{ cars, setCars, searchResults, setSearchResults, loading, error }}>
      {children}
    </CarContext.Provider>
  );
};

// Create a custom hook to use the CarContext
export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error("useCarContext must be used within a CarProvider");
  }
  return context;
};
