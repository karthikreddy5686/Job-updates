'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, LogIn, UserPlus, Sun, Moon } from 'lucide-react';

function useThemeSafe() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  return { theme, toggleTheme, mounted };
}

const navLinks = [
  { label: 'Home', href: '/', icon: null },
  { label: 'Remote Jobs', href: '/remote', icon: null },
  { label: 'Application Tracker', href: '/job-updates/tracker', icon: null },
  { label: 'Deadline Alerts', href: '/job-updates/alerts', icon: null },
  { label: 'Referral Hub', href: '/job-updates/referral', icon: null },
  { label: 'Saved Jobs', href: '/job-updates/saved', icon: null },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const { theme, toggleTheme, mounted } = useThemeSafe();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get current pathname
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveLink(window.location.pathname);
    }
  }, []);

  // Close menu on link click
  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Mobile menu variants
  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.nav
      className={`fixed top-4 left-4 right-4 z-50 rounded-[1.75rem] border border-transparent bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:bg-slate-950/95 ${
        isScrolled
          ? 'glass border-slate-200 dark:border-slate-800'
          : 'border-slate-200 dark:border-slate-800'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-14 w-auto bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/logo.jpg" alt="Geonixa NextJob Logo" className="h-full w-auto object-contain" />
              </div>
              <span className="hidden sm:inline-block font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Geonixa NextJob
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <motion.div key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 relative ${
                    activeLink === link.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {link.label}
                  {activeLink === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-3 lg:left-4 right-3 lg:right-4 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-full"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {/* Search Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Login Button */}
            <Link href="/auth/login" passHref legacyBehavior>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary text-sm lg:text-base flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </motion.button>
            </Link>

            {/* Register Button */}
            <Link href="/auth/register" passHref legacyBehavior>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary text-sm lg:text-base flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Register</span>
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button & Right Actions */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle Mobile */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden pb-4 space-y-2"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={linkVariants}>
                  <Link
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      activeLink === link.href
                        ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Actions */}
              <motion.div variants={linkVariants} className="flex gap-2 pt-2">
                <Link href="/auth/login" className="flex-1">
                  <button className="w-full btn btn-secondary text-sm flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                </Link>
                <Link href="/auth/register" className="flex-1">
                  <button className="w-full btn btn-primary text-sm flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Register
                  </button>
                </Link>
              </motion.div>

              {/* Search Bar Mobile */}
              <motion.div variants={linkVariants} className="pt-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
