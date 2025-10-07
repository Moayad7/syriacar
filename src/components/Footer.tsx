
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border/50 mt-20">
      <div className="container-custom py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-syria-terracotta">مركز</span>
                <span className="font-serif text-xl font-bold">السيارات السوري</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              سوق السيارات الرائد لشراء وبيع وتأجير المركبات في سوريا. تواصل مع الوكلاء والبائعين اليوم.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-syria-terracotta transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-syria-terracotta transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-syria-terracotta transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-syria-terracotta transition-colors" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { name: 'سيارات جديدة ومستعملة', path: '/car-listings' },
                { name: 'إيجار سيارات', path: '/rentals' },
                { name: 'قطع غيار', path: '/spare-parts' },
                { name: 'اعرف احتياجاتك', path: '/know-your-needs' },
                { name: 'بيع سيارتك', path: '/list-car' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground text-sm hover:text-syria-terracotta transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">معلومات</h3>
            <ul className="space-y-2">
              {[
                { name: 'من نحن', path: '/about' },
                { name: 'اتصل بنا', path: '/contact' },
                { name: 'سياسة الخصوصية', path: '/privacy' },
                { name: 'الشروط والأحكام', path: '/terms' },
                { name: 'الأسئلة الشائعة', path: '/faqs' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground text-sm hover:text-syria-terracotta transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">اتصل بنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-syria-terracotta mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  دمشق، سوريا
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="text-syria-terracotta mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  +963 11 123 4567
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="text-syria-terracotta mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  info@syrianautohub.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="separator" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
          <p className="text-muted-foreground text-sm text-center md:text-right">
            © {new Date().getFullYear()} مركز السيارات السوري. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              شروط الخدمة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
