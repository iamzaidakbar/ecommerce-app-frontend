"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ChevronDown, Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/man", label: "MAN" },
  { href: "/woman", label: "WOMAN" },
  { href: "/kids", label: "KIDS" },
  { href: "/view-all", label: "VIEW ALL" },
];

const userMenuItems = [
  { href: "/profile", label: "PROFILE" },
  { href: "/settings", label: "SETTINGS" },
  { label: "LOGOUT", action: true },
];

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-8"
    >
      <div className="flex items-center justify-between h-16">
        {/* Left side navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] font-light tracking-wider hover:opacity-70 transition-opacity relative group"
            >
              {link.label}
              <motion.div
                className="absolute -bottom-0.5 left-0 w-0 h-[0.5px] bg-current group-hover:w-full"
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link href="/" className="text-xl font-extralight tracking-[0.2em]">
          ZARA
        </Link>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          {/* Permanent Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-[200px] py-1 px-2 bg-transparent border-b border-gray-200/20 outline-none text-[12px] font-light focus:border-gray-200/40 transition-colors placeholder:text-gray-400"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>


          {/* Auth Links */}
          {!isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link
                href="/auth/login"
                className="text-[12px] font-light tracking-wider hover:opacity-70 transition-opacity relative group"
              >
                LOGIN
                <motion.div
                  className="absolute -bottom-0.5 left-0 w-0 h-[0.5px] bg-current group-hover:w-full"
                  transition={{ duration: 0.3 }}
                />
              </Link>
              <Link
                href="/auth/register"
                className="text-[12px] font-light tracking-wider hover:opacity-70 transition-opacity relative group"
              >
                REGISTER
                <motion.div
                  className="absolute -bottom-0.5 left-0 w-0 h-[0.5px] bg-current group-hover:w-full"
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </div>
          ) : (
            <div 
              className="relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <motion.button
                className="flex items-center space-x-1 hover:opacity-70 transition-opacity"
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-4 h-4" />
                <motion.div
                  animate={{ rotate: isHovering ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3 h-3" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scaleY: 0.5 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: 10, scaleY: 0.5 }}
                    transition={{ duration: 0.2 }}
                    style={{ transformOrigin: 'top' }}
                    className="absolute right-0 top-full mt-1 w-40 bg-white shadow-lg border border-gray-100 rounded-sm overflow-hidden"
                  >
                    {userMenuItems.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item.action ? (
                          <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2.5 text-[11px] font-light text-gray-700 hover:bg-black hover:text-white transition-colors"
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            href={item.href ?? ""}
                            className="block px-4 py-2.5 text-[11px] font-light text-gray-700 hover:bg-black hover:text-white transition-colors"
                          >
                            {item.label}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Favorites */}
          <Link href="/favorites" className="relative group flex items-center space-x-2">
            <Heart className="w-[18px] h-[18px]" />
            <p className="text-[12px] font-light">FAVORITES</p>
          </Link>

          {/* Shopping Bag */}
          <Link href="/cart" className="relative group flex items-center space-x-2">
            <ShoppingBag className="w-[18px] h-[18px]" />
            <p className="text-[12px] font-light">SHOPPING BAG</p>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}; 