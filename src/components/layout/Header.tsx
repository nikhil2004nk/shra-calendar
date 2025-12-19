
import { useState, useEffect } from 'react';
import { Menu, X, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-slate-900/90'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back button - only show on non-home pages */}
          {!isHomePage && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-slate-800/50 transition-colors md:hidden"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6 text-pink-400" />
            </button>
          )}
          
          {/* Logo/Title - centered on mobile when back button is present */}
          <h1 className={`text-xl font-bold text-pink-400 ${!isHomePage ? 'mx-auto md:mx-0' : ''}`}>
            Shraddha Kapoor
          </h1>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2 rounded-full hover:bg-slate-800/50 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-pink-400" />
              ) : (
                <Menu className="h-6 w-6 text-pink-400" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a 
                  href="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/' ? 'text-pink-400' : 'text-slate-300 hover:text-white'
                  } transition-colors`}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/movies" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/movies' ? 'text-pink-400' : 'text-slate-300 hover:text-white'
                  } transition-colors`}
                >
                  Movies
                </a>
              </li>
              <li>
                <a 
                  href="/calendar" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/calendar' ? 'text-pink-400' : 'text-slate-300 hover:text-white'
                  } transition-colors`}
                >
                  Calendar
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/' ? 'bg-slate-800 text-pink-400' : 'text-slate-300 hover:bg-slate-800/50'
                  } transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/movies" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/movies' ? 'bg-slate-800 text-pink-400' : 'text-slate-300 hover:bg-slate-800/50'
                  } transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  Movies
                </a>
              </li>
              <li>
                <a 
                  href="/calendar" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/calendar' ? 'bg-slate-800 text-pink-400' : 'text-slate-300 hover:bg-slate-800/50'
                  } transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  Calendar
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
