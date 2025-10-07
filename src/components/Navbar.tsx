
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Car, ShoppingBag, Clock, HelpCircle, PlusCircle, Settings, ShoppingBagIcon, LogIn, LogOut, ShoppingCart, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '../assets/22-03-DwLk1Z1i.png'
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const {toast} = useToast()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const handleLogOut = () => {localStorage.removeItem("token")
    navigate('/')
    window.location.reload();
    toast({
        title: "خطأ",
        description: "فشل تسجيل الدخول. تحقق من بيانات الاعتماد الخاصة بك.",
      });
  }

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'سيارات جديدة ومستعملة', path: '/car-listings', icon: <Car size={16} /> },
    { name: 'إيجار سيارات', path: '/rentals', icon: <Clock size={16} /> },
    // { name: 'قطع غيار', path: '/spare-parts', icon: <ShoppingBag size={16} /> },
    { name: 'الورشات', path: '/workshops', icon: <Wrench size={16} /> },
    { name: 'المتاجر', path: '/stores', icon: <ShoppingCart size={16} /> },
    { name: 'اعرف احتياجاتك', path: '/know-your-needs', icon: <HelpCircle size={16} /> },
    // { name: 'لوحة التحكم', path: '/user-dashboard', icon: <Settings size={16} /> }
  ];

  return (
    <header
      className={cn(
        'fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-md',
        scrolled || isOpen ? 'bg-background/90 shadow-sm border-b border-border/50' : 'bg-transparent'
      )}
    >
      <nav className="px-8 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2"
            onClick={closeMenu}
          >
            <img className='px-1' width="45px" src={logo} alt="" />
            <span className="hidden md:block text-xl font-bold text-syria-terracotta">مركز</span>
            <span className="hidden md:block text-xl font-bold">السيارات السوري</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex items-center gap-1.5 py-1 font-medium text-sm transition-colors',
                  location.pathname === link.path
                    ? 'text-syria-terracotta'
                    : 'text-foreground/80 hover:text-syria-terracotta'
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!token ? 
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-syria-terracotta transition-colors flex items-center gap-1"
            >
              <LogIn size={16} />
              تسجيل الدخول
            </Link>
            :
            <div className='grid lg:flex'>
            <Link
                key={'/user-dashboard'}
                to={'/user-dashboard'}
                className={cn(
                  'flex items-center gap-1.5 py-1 font-medium text-sm transition-colors',
                  location.pathname === '/user-dashboard'
                    ? 'text-syria-terracotta'
                    : 'text-foreground/80 hover:text-syria-terracotta'
                )}
              >
                <Settings size={16} />
                <span>لوحة التحكم</span>
              </Link>
            <button
            onClick={handleLogOut}
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-syria-terracotta transition-colors flex items-center gap-1"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
            </div>
            }
            
            <Link
              to="/add-car"
              className="button-primary text-sm flex items-center gap-1.5"
            >
              <PlusCircle size={16} />
              <span>أضف سيارتك</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center text-foreground"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/50 shadow-md animate-fade-in">
            <div className="container-custom py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center gap-2 py-2 font-medium transition-colors',
                    location.pathname === link.path
                      ? 'text-syria-terracotta'
                      : 'text-foreground/80'
                  )}
                  onClick={closeMenu}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                {!token ? 
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-syria-terracotta transition-colors flex items-center gap-1"
            >
              <LogIn size={16} />
              تسجيل الدخول
            </Link>
            :
            <div className='grid lg:flex'>
            <Link
                key={'/user-dashboard'}
                to={'/user-dashboard'}
                className={cn(
                  'flex items-center gap-1.5 py-1 font-medium text-sm transition-colors',
                  location.pathname === '/user-dashboard'
                    ? 'text-syria-terracotta'
                    : 'text-foreground/80 hover:text-syria-terracotta'
                )}
              >
                <Settings size={16} />
                <span>لوحة التحكم</span>
              </Link>
            <button
            onClick={handleLogOut}
              className="py-2 text-sm font-medium text-foreground/80 hover:text-syria-terracotta transition-colors flex items-center gap-1"
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
            </div>
            }
                <Link
                  to="/add-car"
                  className="button-primary flex items-center gap-2 justify-center"
                  onClick={closeMenu}
                >
                  <PlusCircle size={16} />
                  <span>أضف سيارتك</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
