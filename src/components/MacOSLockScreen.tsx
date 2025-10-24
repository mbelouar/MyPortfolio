'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface MacOSLockScreenProps {
  onUnlock: () => void;
  userName?: string;
  userImage?: string;
}

const MacOSLockScreen: React.FC<MacOSLockScreenProps> = ({ 
  onUnlock, 
  userName = "Mohammed Belouarraq",
  userImage = "/images/profile-placeholder.svg"
}) => {
  const [password, setPassword] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const passwordRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Format name with lastname in uppercase (like macOS)
  const formatUserName = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ').toUpperCase();
      return `${firstName} ${lastName}`;
    }
    return name;
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Focus password field when it appears
  useEffect(() => {
    if (showPasswordField && passwordRef.current) {
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 100);
    }
  }, [showPasswordField]);

  // Handle global key press for Enter
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !showPasswordField && !isUnlocking) {
        setShowPasswordField(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showPasswordField, isUnlocking]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && password.length > 0) {
      handleUnlock();
    }
  };

  const handleUnlock = () => {
    if (password.length > 0) {
      setIsUnlocking(true);
      setTimeout(() => {
        onUnlock();
      }, 800);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ 
          opacity: 0, 
          scale: 1.08, 
          y: 30,
          rotateX: 5,
          filter: "blur(10px)"
        }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          rotateX: 0,
          filter: "blur(0px)"
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.95, 
          y: -30,
          rotateX: -8,
          filter: "blur(15px)",
          transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8, ease: "easeOut" },
          scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
          rotateX: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
          filter: { duration: 0.9, ease: "easeOut" }
        }}
        className="fixed inset-0 z-[9999]"
        style={{
          backgroundImage: 'url(/macos.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* macOS Lock Screen Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"
          initial={{ 
            opacity: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%)"
          }}
          animate={{ 
            opacity: 1,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)"
          }}
          transition={{ 
            duration: 1.0, 
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
            background: { duration: 1.2, ease: "easeOut" }
          }}
        />
        
        {/* Time Display - Top Center */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center text-white flex flex-col items-center">
          <motion.div
            initial={{ 
              opacity: 0, 
              y: 40, 
              scale: 0.8,
              rotateX: 15,
              filter: "blur(5px)"
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)"
            }}
            transition={{ 
              delay: 0.5, 
              duration: 1.3, 
              ease: [0.16, 1, 0.3, 1],
              scale: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
              rotateX: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 1.0, ease: "easeOut" }
            }}
            className="text-9xl font-thin tracking-tight text-center"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 100,
              textShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 80px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em'
            }}
          >
            {formatTime(currentTime)}
          </motion.div>
          <motion.div
            initial={{ 
              opacity: 0, 
              y: 35, 
              scale: 0.85,
              rotateX: 10,
              filter: "blur(3px)"
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)"
            }}
            transition={{ 
              delay: 0.7, 
              duration: 1.1, 
              ease: [0.16, 1, 0.3, 1],
              scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              rotateX: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 0.8, ease: "easeOut" }
            }}
            className="text-2xl font-light mt-6 opacity-95 text-center w-full"
            style={{ 
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 300,
              textShadow: '0 0 25px rgba(0,0,0,0.6), 0 0 50px rgba(0,0,0,0.3)',
              letterSpacing: '0.01em'
            }}
          >
            {formatDate(currentTime)}
          </motion.div>
        </div>

        {/* User Profile Section - Bottom Center - Only show when password field is not visible */}
        {!showPasswordField && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Profile Picture */}
              <div className="relative mb-4">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="w-28 h-28 rounded-full overflow-hidden shadow-2xl"
                  style={{
                    border: '3px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 0 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Image
                    src={userImage}
                    alt={userName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
                              <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
                            </linearGradient>
                          </defs>
                          <circle cx="56" cy="56" r="56" fill="url(#profileGradient)"/>
                          <circle cx="56" cy="42" r="18" fill="rgba(255,255,255,0.9)"/>
                          <path d="M24 94c0-18 14.5-32.5 32.5-32.5S89 76 89 94" fill="rgba(255,255,255,0.9)"/>
                          <text x="56" y="105" text-anchor="middle" fill="white" font-family="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="300">MB</text>
                        </svg>
                      `)}`;
                    }}
                  />
                </motion.div>
              </div>

              {/* User Name */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="text-2xl font-normal text-white mb-6"
                style={{ 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  textShadow: '0 0 20px rgba(0,0,0,0.5)'
                }}
              >
                {formatUserName(userName)}
              </motion.h2>

              {/* Instruction Text */}
              <motion.p
                initial={{ opacity: 1, y: 0 }}
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  delay: 1.5,
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
                className="text-white/70 text-xs font-normal"
                style={{ 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  textShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}
              >
                Touch ID or Enter Password
              </motion.p>
            </motion.div>
          </div>
        )}

        {/* Top Right Status Bar */}
        <motion.div
          initial={{ 
            opacity: 0, 
            y: -40, 
            scale: 0.85,
            rotateX: -10,
            filter: "blur(4px)"
          }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)"
          }}
          transition={{ 
            delay: 0.3, 
            duration: 1.0, 
            ease: [0.16, 1, 0.3, 1],
            scale: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
            rotateX: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 0.7, ease: "easeOut" }
          }}
          className="absolute top-3 right-3 flex items-center space-x-3 text-white/95"
        >
          {/* Caps Lock Indicator */}
          <div className="flex items-center">
            <div className="w-5 h-3 border border-white rounded-sm flex items-center justify-center">
              <span className="text-xs font-medium">A</span>
            </div>
          </div>

          {/* Keyboard Layout */}
          <span className="text-sm font-normal" style={{ fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            ABC
          </span>

          {/* Battery */}
          <div className="flex items-center">
            <svg width="18" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
              <line x1="23" y1="13" x2="23" y2="11" />
              <rect x="3" y="8" width="14" height="8" rx="1" ry="1" fill="currentColor" />
            </svg>
          </div>

          {/* WiFi */}
          <div className="flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8.5a16 16 0 0 1 20 0" />
              <path d="M5 12.5a11 11 0 0 1 14 0" />
              <path d="M8.5 16.5a6 6 0 0 1 7 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>

          {/* Date and Time */}
          <span className="text-sm font-normal" style={{ fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            })} {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
            })}
          </span>
        </motion.div>

        {/* Password Field Overlay with Blur Background */}
        <AnimatePresence>
          {showPasswordField && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative flex flex-col items-center"
              >
                {/* Profile Picture */}
                <div className="relative mb-4">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="w-24 h-24 rounded-full overflow-hidden shadow-2xl"
                    style={{
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Image
                      src={userImage}
                      alt={userName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,${encodeURIComponent(`
                          <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
                              </linearGradient>
                            </defs>
                            <circle cx="56" cy="56" r="56" fill="url(#profileGradient)"/>
                            <circle cx="56" cy="42" r="18" fill="rgba(255,255,255,0.9)"/>
                            <path d="M24 94c0-18 14.5-32.5 32.5-32.5S89 76 89 94" fill="rgba(255,255,255,0.9)"/>
                            <text x="56" y="105" text-anchor="middle" fill="white" font-family="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="300">MB</text>
                          </svg>
                        `)}`;
                      }}
                    />
                  </motion.div>
                </div>

                {/* User Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-2xl font-normal text-white mb-6"
                  style={{ 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 400,
                    textShadow: '0 0 20px rgba(0,0,0,0.5)'
                  }}
                >
                  {formatUserName(userName)}
                </motion.h2>

                {/* Password Input Field */}
                <div className="relative">
                  <input
                    ref={passwordRef}
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Password"
                    disabled={isUnlocking}
                    className="w-56 px-3 py-2.5 bg-white/20 backdrop-blur-2xl border border-white/40 rounded-full text-white placeholder-white/60 text-sm font-normal focus:outline-none focus:ring-3 focus:ring-white/30 focus:border-white/60 transition-all duration-300 text-center"
                    style={{ 
                      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      letterSpacing: '0.03em',
                      fontSize: '13px',
                      fontWeight: '400',
                      lineHeight: '1.3'
                    }}
                  />
                  
                  {/* Left Arrow Icon */}
                  <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-md">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </div>
                  
                  {/* Right Question Mark Icon */}
                  <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-md">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                </div>
                
                {/* Instruction Text */}
                <motion.p
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ 
                    y: [0, -8, 0],
                  }}
                  transition={{ 
                    delay: 0.3,
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                  className="text-white/70 text-xs mt-4 font-normal text-center"
                  style={{ 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 400,
                    textShadow: '0 0 10px rgba(0,0,0,0.5)'
                  }}
                >
                  Touch ID or Enter Password
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unlocking Animation Overlay */}
        <AnimatePresence>
          {isUnlocking && (
            <motion.div
              initial={{ 
                opacity: 0,
                backdropFilter: "blur(0px)",
                backgroundColor: "rgba(0,0,0,0)"
              }}
              animate={{ 
                opacity: 1,
                backdropFilter: "blur(20px)",
                backgroundColor: "rgba(0,0,0,0.7)"
              }}
              exit={{ 
                opacity: 0,
                backdropFilter: "blur(40px)",
                backgroundColor: "rgba(0,0,0,0.9)",
                scale: 1.1
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                exit: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ 
                  scale: 0.7, 
                  opacity: 0,
                  y: 20,
                  rotateX: 10
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: 0,
                  rotateX: 0
                }}
                exit={{ 
                  scale: 1.3, 
                  opacity: 0,
                  y: -30,
                  rotateX: -15,
                  filter: "blur(10px)"
                }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  exit: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
                }}
                className="text-white text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: 360
                  }}
                  transition={{ 
                    scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.5, ease: "easeOut" },
                    rotate: { duration: 1.2, repeat: Infinity, ease: "linear" }
                  }}
                  className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full mx-auto mb-8 relative"
                  style={{
                    boxShadow: "0 0 30px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.1)"
                  }}
                >
                  {/* Inner glow effect */}
                  <motion.div
                    className="absolute inset-2 border border-white/20 rounded-full"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-2xl font-light" 
                  style={{ 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 300,
                    textShadow: "0 0 20px rgba(255,255,255,0.5)"
                  }}
                >
                  Unlocking...
                </motion.p>
                
                {/* Progress dots */}
                <motion.div 
                  className="flex justify-center space-x-2 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white/60 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default MacOSLockScreen;