'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Briefcase, 
  Github,
  Linkedin,
  Twitter,
  Award,
  Code,
  Database,
  Cloud,
  Terminal as TerminalIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Star,
  Zap,
  Shield,
  Layers,
  Globe,
  FileText,
  MessageSquare,
  ArrowRight,
  Eye,
  Download,
  X
} from 'lucide-react';

// Types
interface DockApp {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface WindowProps {
  id: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  isMinimized?: boolean;
  onMinimize?: (minimized: boolean) => void;
}

// Enhanced Window Component with Modern Design
const Window: React.FC<WindowProps> = ({ id, title, onClose, children, initialPosition = { x: 100, y: 100 }, isMinimized = false, onMinimize }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [zIndex, setZIndex] = useState(10);
  const [useDOMPositioning, setUseDOMPositioning] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragDataRef = useRef({ offsetX: 0, offsetY: 0, isDragging: false, currentX: 0, currentY: 0 });
  const [preMaximizePosition, setPreMaximizePosition] = useState<{ x: number; y: number } | null>(null);

  // Bring window to front when clicked
  const bringToFront = () => {
    setZIndex(100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on control buttons or interactive elements
    if ((e.target as HTMLElement).closest('.window-control-btn') ||
        (e.target as HTMLElement).closest('button') ||
        (e.target as HTMLElement).closest('a') ||
        (e.target as HTMLElement).closest('input') ||
        (e.target as HTMLElement).closest('textarea') ||
        (e.target as HTMLElement).closest('select')) {
      return;
    }
    
    // Only start dragging if clicking on the header area specifically
    if (!(e.target as HTMLElement).closest('.window-header')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      dragDataRef.current = {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        isDragging: true
      };
      setIsDragging(true);
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      
      // Bring window to front
      setZIndex(100);
    }
  };

  // Direct DOM manipulation for instant dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragDataRef.current.isDragging && windowRef.current) {
        const newX = e.clientX - dragDataRef.current.offsetX;
        const newY = e.clientY - dragDataRef.current.offsetY;
        
        // Constrain to viewport
        const maxX = window.innerWidth - windowRef.current.offsetWidth;
        const maxY = window.innerHeight - windowRef.current.offsetHeight;
        
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));
        
        // Direct DOM manipulation for instant movement
        windowRef.current.style.left = `${constrainedX}px`;
        windowRef.current.style.top = `${constrainedY}px`;
        
        // Store position for final state update
        dragDataRef.current.currentX = constrainedX;
        dragDataRef.current.currentY = constrainedY;
      }
    };

    const handleMouseUp = () => {
      if (dragDataRef.current.isDragging) {
        dragDataRef.current.isDragging = false;
        setIsDragging(false);
        
        // Get the exact DOM position and sync with React state
        if (windowRef.current) {
          const rect = windowRef.current.getBoundingClientRect();
          const finalPosition = { 
            x: rect.left, 
            y: rect.top 
          };
          
          // Update React state with the exact DOM position
          setPosition(finalPosition);
          
          // Keep using DOM positioning permanently to prevent drift
          // setUseDOMPositioning stays true
        }
        
        // Restore normal cursor and text selection
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Cleanup effect to restore cursor and text selection
  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ 
        opacity: isMinimized ? 0 : 1, 
        scale: isMinimized ? 0.8 : 1, 
        y: isMaximized ? 0 : (isMinimized ? window.innerHeight + 100 : undefined),
        x: isMaximized ? 0 : undefined,
        width: isMaximized ? '100vw' : '800px',
        height: isMaximized ? '100vh' : 'auto',
        maxHeight: isMaximized ? '100vh' : '700px'
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0 }}
      className={`fixed overflow-hidden cursor-default ${
        isMaximized ? 'rounded-none flex flex-col maximized-window' : 'glass-card rounded-2xl shadow-2xl'
      } ${isDragging ? 'window-dragging' : ''}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        right: isMaximized ? 0 : 'auto',
        bottom: isMaximized ? 0 : 'auto',
        width: isMaximized ? '100vw' : '800px',
        maxWidth: isMaximized ? '100vw' : '95vw',
        height: isMaximized ? '100vh' : 'auto',
        maxHeight: isMaximized ? '100vh' : '700px',
        minHeight: isMaximized ? '100vh' : 'auto',
        zIndex: isMaximized ? 999 : zIndex,
        margin: 0,
        padding: 0,
        boxShadow: isMaximized ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(0, 0, 0, 0.8)',
        border: isMaximized ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
        position: 'fixed'
      }}
      onClick={(e) => {
        if (isMinimized) {
          e.stopPropagation();
          onMinimize?.(false);
        } else {
          bringToFront();
        }
      }}
    >
      {/* Dark macOS Window Header */}
      <div
        className="window-header flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800/90 to-gray-900/80 backdrop-blur-xl border-b border-gray-700/30 cursor-grab hover:from-gray-700/90 hover:to-gray-800/80 transition-all duration-200 select-none"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Instant close with minimal animation
                onClose();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="window-control-btn close group"
              title="Close"
            >
              <div className="window-control-icon close" />
            </button>
            
            {/* Minimize Button */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Direct minimize action
                onMinimize?.(!isMinimized);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="window-control-btn minimize group"
              title="Minimize"
            >
              <div className="window-control-icon minimize" />
            </button>
            
            {/* Maximize Button */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!isMaximized) {
                  // Store current position before maximizing
                  setPreMaximizePosition({ x: position.x, y: position.y });
                  // Add smooth transition for maximize
                  if (windowRef.current) {
                    windowRef.current.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    // Clean up transition after animation completes
                    setTimeout(() => {
                      if (windowRef.current) {
                        windowRef.current.style.transition = '';
                      }
                    }, 600);
                  }
                  setIsMaximized(true);
                } else {
                  // Restore to previous position with smooth transition
                  if (preMaximizePosition) {
                    setPosition(preMaximizePosition);
                  }
                  if (windowRef.current) {
                    windowRef.current.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    // Clean up transition after animation completes
                    setTimeout(() => {
                      if (windowRef.current) {
                        windowRef.current.style.transition = '';
                      }
                    }, 600);
                  }
                  setIsMaximized(false);
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`window-control-btn maximize group ${isMaximized ? 'maximized' : 'restored'}`}
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <div className="window-control-icon maximize" />
            </button>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-200 tracking-wide">{title}</span>
        </div>
      </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-gray-500/60" />
          <div className="w-1 h-1 rounded-full bg-gray-500/60" />
          <div className="w-1 h-1 rounded-full bg-gray-500/60" />
        </div>
      </div>
      
      {/* Dark Window Content */}
      <div className={`bg-gradient-to-br from-gray-900/20 to-transparent overflow-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent select-text ${
        isMaximized ? 'flex-1 p-6 window-content' : 'max-h-[calc(700px-100px)] p-8'
      }`} style={{ pointerEvents: 'auto' }}>
        <div className="space-y-6">
        {children}
        </div>
      </div>
    </motion.div>
  );
};

// Modern About App Component
const AboutApp = () => {
  const [showCV, setShowCV] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-8"
      >
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-32 h-32 mx-auto mb-6 rounded-3xl overflow-hidden shadow-glow-lg pulse-glow"
      >
        <Image
          src="/images/med.png"
          alt="Mohammed Bel Ouarraq"
          width={128}
          height={128}
          className="w-full h-full object-cover"
          priority
        />
      </motion.div>
      <h1 className="text-4xl font-bold text-foreground mb-2">BEL OUARRAQ MOHAMMED</h1>
      <p className="text-xl text-muted-foreground mb-4">Final-year Computer Engineering Student</p>
      <div className="flex items-center justify-center gap-2 text-sm text-primary">
        <MapPin className="w-4 h-4" />
        <span>Morocco</span>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
        <span>Available for Internships</span>
      </div>
          
          {/* CV Button */}
          <div className="mt-8 flex justify-center">
            <motion.button
              onClick={() => setShowCV(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-500 transition-all duration-300 group"
            >
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              View CV
            </motion.button>
          </div>
          </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-6 rounded-2xl hover:shadow-glass-hover transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Professional Profile</h3>
      </div>
      
      <p className="text-muted-foreground leading-relaxed">
        <span className="text-foreground font-medium">DevOps & Cloud enthusiast</span> with a strong foundation in technology and programming, developed through hands-on training and projects. 
        Skilled in problem-solving, teamwork, and project management, and always eager to explore new tools and practices in the DevOps & Cloud ecosystem. 
        <span className="text-primary font-medium">Open to internship opportunities</span> to apply and expand my skills in real-world IT environments.
      </p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">DevOps</span>
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">Cloud</span>
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">Problem Solving</span>
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">Teamwork</span>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Education & Academic Journey
      </h3>
  <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg p-1">
            <img 
              src="/images/ensate.png" 
              alt="École Nationale des Sciences Appliquées de Tétouan"
              className="w-full h-full object-contain scale-125"
            />
      </div>
      <div className="flex-1">
            <h4 className="text-lg font-semibold text-foreground mb-1">National School of Applied Sciences</h4>
            <p className="text-primary font-medium mb-2">Computer Science Engineering Student</p>
            <p className="text-sm text-muted-foreground mb-2">Specialized in Software Engineering, DevOps, and Cloud Computing</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">2020 - 2025</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Final Year</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg p-1">
            <img 
              src="/images/UM6P_1337.png" 
              alt="1337 CODING SCHOOL"
              className="w-full h-full object-contain scale-125"
            />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-foreground mb-1">UM6P - 1337 MED</h4>
            <p className="text-primary font-medium mb-2">Digital Technology Architect Program</p>
            <p className="text-sm text-muted-foreground mb-2">Advanced programming, software architecture, and modern development practices</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">2022 - 2025</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Specialized Program</span>
            </div>
          </div>
        </div>
        
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        Key Academic Achievements
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Strong foundation in Computer Science fundamentals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Hands-on experience with DevOps tools and practices</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Advanced programming and software architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Cloud computing and containerization expertise</span>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>

  {/* CV Modal */}
  <AnimatePresence>
    {showCV && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowCV(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.4, type: "spring", damping: 20 }}
          className="relative bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Curriculum Vitae</h2>
            </div>
            <button
              onClick={() => setShowCV(false)}
              className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* CV Display */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl overflow-hidden">
                {/* CV Header */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-4 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Mohammed Bel Ouarraq</h3>
                      <p className="text-sm text-gray-400">Curriculum Vitae</p>
                    </div>
                  </div>
                </div>
                
                {/* CV Content */}
                <div className="p-6">
                  {/* CV Preview/Embed */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
                    <iframe
                      src="/Belouarraq_CV.pdf#toolbar=0&navpanes=0&scrollbar=1"
                      className="w-full h-96 border-0"
                      title="CV Preview"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center">
                    <motion.a
                      href="/Belouarraq_CV.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-medium rounded-xl transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCV(false)}
                      className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium rounded-xl transition-all duration-300"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</>
);
};

// Modern Projects App Component
const ProjectsApp = () => {
  const projects = [
    { 
      name: 'SecureAuth - Final Year Project', 
      description: 'Designed and implemented an Identity and Access Management (IAM) platform supporting SSO, MFA (TOTP, WebAuthn/FIDO), and identity lifecycle management, deployed with Kubernetes (Minikube, K3s), Docker, and Helm for scalability and resilience.',
      tech: ['Kubernetes', 'Docker', 'Helm', 'k3s', 'Terraform', 'Prometheus', 'Grafana', 'ArgoCD', 'CI/CD', 'Django', 'REST API'],
      year: '2025',
      type: 'Final Year Project',
      status: 'Completed',
      icon: Shield,
      color: 'from-gray-800 to-gray-700',
      github: 'https://github.com/mbelouar/SecureAuth'
    },
    { 
      name: 'IoT - Lightweight Kubernetes Orchestration', 
      description: 'Demonstrated container orchestration using K3s with Vagrant and K3D with ArgoCD, creating and managing lightweight Kubernetes clusters across various environments, from multi-node setups to GitOps-driven CI/CD pipelines.',
      tech: ['K8s', 'k3s', 'k3d', 'Vagrant', 'Docker', 'CI/CD', 'ArgoCD', 'Scripting'],
      year: '2024',
      type: 'Academic Project',
      status: 'Completed',
      icon: Cloud,
      color: 'from-green-500 to-blue-500',
      github: 'https://github.com/mbelouar/IoT-K8s-Orchestration'
    },
    { 
      name: 'Transendence - Multiplayer Gaming Platform', 
      description: 'Developed a web application for a multiplayer gaming platform featuring user management, blockchain score storage, and AI opponents. Implemented cybersecurity measures, including two-factor authentication and GDPR compliance.',
      tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'ThreeJS', 'Django', 'Docker', 'Microservices', 'CI/CD', 'PostgreSQL'],
      year: '2024',
      type: 'Academic Project',
      status: 'Completed',
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      github: 'https://github.com/mbelouar/Transendence'
    },
    { 
      name: 'Inception - Containerized Multi-Service System', 
      description: 'Designed and implemented a secure, multi-service system using Docker containers for Nginx, WordPress, and MariaDB, orchestrated with Docker Compose. Ensured service isolation, seamless communication, and security.',
      tech: ['Docker', 'Docker Compose', 'Nginx', 'WordPress', 'MariaDB', 'Linux'],
      year: '2023',
      type: 'Academic Project',
      status: 'Completed',
      icon: Layers,
      color: 'from-orange-500 to-red-500',
      github: 'https://github.com/mbelouar/Inception'
    },
    { 
      name: 'NestTools - Community Tool-Rental Platform', 
      description: 'Developed a full-stack web application that connects DIY enthusiasts with local tool owners, enabling users to rent tools at a fraction of the purchase cost. Promotes cost-effective and sustainable access to equipment.',
      tech: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Laravel', 'Docker', 'Docker Compose'],
      year: '2023',
      type: 'Academic Project',
      status: 'Completed',
      icon: Database,
      color: 'from-teal-500 to-green-500',
      github: 'https://github.com/mbelouar/NestTools'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-12 relative"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        </div>
        
        {/* Header content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-6"
          >
            <Briefcase className="w-8 h-8 text-gray-400" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
          >
            Academic Projects
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Showcasing my technical expertise and innovation through hands-on development projects
          </motion.p>
          
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto mt-6 max-w-md"
          />
        </div>
      </motion.div>

    <div className="space-y-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group glass-card p-6 rounded-2xl hover:shadow-glass-hover transition-all duration-300"
          >
            <div className="flex items-start gap-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg"
              >
                <project.icon className="w-8 h-8 text-gray-400" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h3>
            </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">{project.year}</span>
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">{project.status}</span>
                    </div>
                  </div>
                  
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-500 group"
                  >
                    <Github className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm font-medium">View Code</span>
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: techIndex * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3 py-1 text-xs font-medium bg-gray-800/50 text-gray-300 rounded-full border border-gray-700/50 hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                    >
                  {tech}
                    </motion.span>
              ))}
            </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Modern Skills App Component
const SkillsApp = () => {
  const skillCategories = [
    {
      category: 'DevOps & Cloud Tools',
      icon: Cloud,
      color: 'from-gray-800 to-gray-700',
      skills: [
        { name: 'Kubernetes', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
        { name: 'Docker', level: 95, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Terraform', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
        { name: 'ArgoCD', level: 80, icon: 'https://argo-cd.readthedocs.io/en/stable/assets/logo.png' },
        { name: 'Prometheus', level: 85, icon: '/images/prometheus.png' },
        { name: 'Grafana', level: 80, icon: 'https://grafana.com/static/img/menu/grafana2.svg' },
        { name: 'CI/CD', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'Vagrant', level: 70, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vagrant/vagrant-original.svg' },
        { name: 'Linux/Unix', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' }
      ]
    },
    {
      category: 'Programming Languages',
      icon: Code,
      color: 'from-gray-800 to-gray-700',
      skills: [
        { name: 'Python', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'C/C++', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' }
      ]
    },
    {
      category: 'Frameworks & Databases',
      icon: Database,
      color: 'from-gray-800 to-gray-700',
      skills: [
        { name: 'Django', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
        { name: 'MySQL', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'MongoDB', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' }
      ]
    },
    {
      category: 'Tools & Technologies',
      icon: Zap,
      color: 'from-gray-800 to-gray-700',
      skills: [
        { name: 'Git/GitHub', level: 95, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'Docker Compose', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'k3s/k3d', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' }
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-12 relative"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        </div>
        
        {/* Header content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-6"
          >
            <Code className="w-8 h-8 text-gray-400" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
          >
            Technical Skills
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Comprehensive expertise across modern technologies and development practices
          </motion.p>
          
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto mt-6 max-w-md"
          />
        </div>
      </motion.div>
      
      {skillCategories.map((category, categoryIndex) => (
        <motion.div
          key={categoryIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg border border-white/20`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <category.icon className="w-7 h-7 text-white drop-shadow-sm" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                {category.category}
              </h3>
              <div className="h-0.5 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full mt-2"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.skills.map((skill, skillIndex) => (
              <motion.div
                key={skillIndex}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: (categoryIndex * 0.1) + (skillIndex * 0.1),
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group glass-card p-4 rounded-xl hover:shadow-glass-hover transition-all duration-300 border border-white/10 hover:border-blue-500/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div 
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 group-hover:border-blue-500/30 transition-all duration-300"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                {skill.name === 'Prometheus' ? (
                  <img
                    src="/images/prometheus.png"
                    alt="Prometheus logo"
                    className="w-10 h-10 object-contain border-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-10 h-10 flex items-center justify-center bg-orange-500/20 rounded-lg"><span class="text-lg font-bold text-orange-500">P</span></div>`;
                      }
                    }}
                  />
                ) : (
                  <img
                    src={skill.icon}
                    alt={`${skill.name} logo`}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const firstLetter = skill.name.charAt(0).toUpperCase();
                        parent.innerHTML = `<span class="text-lg font-bold text-gray-400">${firstLetter}</span>`;
                      }
                    }}
                  />
                )}
                  </motion.div>
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-foreground group-hover:text-gray-400 transition-colors">
                      {skill.name}
                    </h5>
                    <p className="text-xs text-muted-foreground">Expertise Level</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Proficiency</span>
                    <span className="text-sm font-bold text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-full relative overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ 
                        duration: 1.5, 
                        delay: (categoryIndex * 0.1) + (skillIndex * 0.1) + 0.3,
                        ease: "easeOut"
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center shadow-lg border border-white/20"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Globe className="w-7 h-7 text-white drop-shadow-sm" />
          </motion.div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-foreground bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Languages
            </h4>
            <div className="h-0.5 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full mt-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group glass-card p-4 rounded-xl hover:shadow-glass-hover transition-all duration-300 border border-white/10 hover:border-blue-500/30"
          >
            <div className="flex items-center gap-4 mb-4">
               <motion.div
                 className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-green-500/20 backdrop-blur-sm border border-white/10 group-hover:border-red-500/30 transition-all duration-300 relative overflow-hidden"
                 whileHover={{ rotate: 5, scale: 1.1 }}
               >
                 <div className="absolute inset-0 bg-green-600/90 rounded-xl border border-green-500/30"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-10 h-1 bg-white/95 rounded-full shadow-lg"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-1 h-8 bg-white/95 rounded-full shadow-lg"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-4 h-4 rounded-full bg-white/20 border border-white/30"></div>
                 </div>
               </motion.div>
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-foreground group-hover:text-gray-400 transition-colors">
                  Arabic
                </h5>
                <p className="text-xs text-muted-foreground">Native Speaker</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Proficiency</span>
                <span className="text-sm font-bold text-blue-400">100%</span>
              </div>
              <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                        className="h-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group glass-card p-4 rounded-xl hover:shadow-glass-hover transition-all duration-300 border border-white/10 hover:border-blue-500/30"
          >
            <div className="flex items-center gap-4 mb-4">
               <motion.div
                 className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 group-hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
                 whileHover={{ rotate: 5, scale: 1.1 }}
               >
                 <div className="absolute inset-0 flex">
                   <div className="w-1/3 bg-blue-600/80 rounded-l-xl border-r border-white/20"></div>
                   <div className="w-1/3 bg-white/90 border-r border-white/20"></div>
                   <div className="w-1/3 bg-red-600/80 rounded-r-xl"></div>
                 </div>
                 <div className="relative z-10 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-white shadow-lg"></div>
                 </div>
               </motion.div>
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-foreground group-hover:text-gray-400 transition-colors">
                  French
                </h5>
                <p className="text-xs text-muted-foreground">Professional Level</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Proficiency</span>
                <span className="text-sm font-bold text-blue-400">90%</span>
              </div>
              <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                        className="h-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group glass-card p-4 rounded-xl hover:shadow-glass-hover transition-all duration-300 border border-white/10 hover:border-blue-500/30"
          >
            <div className="flex items-center gap-4 mb-4">
               <motion.div
                 className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 group-hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
                 whileHover={{ rotate: 5, scale: 1.1 }}
               >
                 <div className="absolute inset-0 bg-white/80 rounded-xl border border-white/20"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-10 h-2 bg-red-600 rounded-full shadow-lg"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-10 bg-red-600 rounded-full shadow-lg"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-3 h-3 bg-red-600/20 rounded-full"></div>
                 </div>
               </motion.div>
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-foreground group-hover:text-gray-400 transition-colors">
                  English
                </h5>
                <p className="text-xs text-muted-foreground">Professional Level</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Proficiency</span>
                <span className="text-sm font-bold text-blue-400">90%</span>
              </div>
              <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                        className="h-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Modern Experience App Component
const ExperienceApp = () => {
  const experiences = [
    { 
      company: 'E2IP TECHNOLOGIES', 
      role: 'DevOps & IAM Intern', 
      period: 'July 2025 - September 2025',
      type: 'Internship',
      description: 'Assisted in deploying and maintaining cloud-native IAM solutions. Automated CI/CD pipelines and monitored system performance with Kubernetes, Docker, and Prometheus.',
      technologies: ['Kubernetes', 'Docker', 'Prometheus', 'CI/CD', 'IAM Solutions'],
      icon: Briefcase,
      color: 'from-gray-800 to-gray-700',
      status: 'Completed',
      logo: '/images/e2ip.png'
    },
    { 
      company: 'ADE (Student Association)', 
      role: 'President', 
      period: 'January 2024 - March 2025',
      type: 'Leadership',
      description: 'Led the student association representing 1,000+ students in academic and extracurricular initiatives. Organized events, managed budgets, and fostered partnerships with universities and sponsors.',
      technologies: ['Leadership', 'Project Management', 'Event Organization', 'Budget Management'],
      icon: User,
      color: 'from-green-500 to-teal-500',
      status: 'Completed',
      logo: '/images/ade.png'
    },
    { 
      company: 'BMCE GROUP', 
      role: 'Software Research Intern', 
      period: 'June 2023 - August 2023',
      type: 'Internship',
      description: 'Gained hands-on experience in document digitization and data management. Worked on software research projects and contributed to digital transformation initiatives.',
      technologies: ['Document Digitization', 'Data Management', 'Software Research'],
      icon: Code,
      color: 'from-orange-500 to-red-500',
      status: 'Completed',
      logo: '/images/bmce.png'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-12 relative"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        </div>
        
        {/* Header content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-6"
          >
            <Briefcase className="w-8 h-8 text-gray-400" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
          >
            Professional Experience
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Building expertise through hands-on experience and real-world projects
          </motion.p>
          
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto mt-6 max-w-md"
          />
        </div>
      </motion.div>

      <div className="space-y-6">
          {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group glass-card p-6 rounded-2xl hover:shadow-glass-hover transition-all duration-300"
          >
            <div className="flex items-start gap-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 rounded-2xl ${exp.logo ? 'bg-white shadow-lg border-2 border-gray-200' : `bg-gradient-to-br ${exp.color}`} flex items-center justify-center flex-shrink-0 shadow-glow`}
              >
                {exp.logo ? (
                  <img 
                    src={exp.logo} 
                    alt={`${exp.company} logo`}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <exp.icon className="w-8 h-8 text-white" />
                )}
              </motion.div>
              
                <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {exp.role}
                    </h3>
                    <p className="text-lg text-muted-foreground font-medium">{exp.company}</p>
                    <p className="text-sm text-primary">{exp.period}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                      {exp.type}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      exp.status === 'Current' ? 'bg-green-500/20 text-green-400' :
                      exp.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {exp.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full border border-border/50 hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
              </div>
            </div>
            </div>
          </motion.div>
          ))}
        </div>
    </motion.div>
  );
};

// Modern Certifications App Component
const CertificationsApp = () => {
  const certifications = [
    {
      name: 'Kubernetes and Cloud Native Associate (KCNA)',
      issuer: 'The Linux Foundation',
      issued: 'September 2025',
      description: 'Comprehensive certification covering Kubernetes fundamentals, cloud-native concepts, and container orchestration.',
      skills: ['Kubernetes', 'Cloud Native', 'Container Orchestration', 'DevOps'],
      logo: '/images/KCNA-Logo.png',
      color: 'from-white to-gray-100',
      verified: true,
      credlyUrl: 'https://www.credly.com/badges/your-kcna-badge-id'
    },
    {
      name: 'Docker Foundations Professional Certificate',
      issuer: 'Docker, Inc',
      issued: 'June 2025',
      description: 'Professional certification demonstrating expertise in Docker containerization, image management, and container orchestration.',
      skills: ['Docker', 'Containerization', 'Image Management', 'Container Orchestration'],
      logo: '/images/docker2.png',
      color: 'from-white to-gray-100',
      verified: true,
      credlyUrl: 'https://www.credly.com/badges/your-docker-badge-id'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-12 relative"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        </div>
        
        {/* Header content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-6"
          >
            <Award className="w-8 h-8 text-gray-400" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
          >
            Certifications
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Industry-recognized credentials validating technical expertise and professional growth
          </motion.p>
          
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto mt-6 max-w-md"
          />
        </div>
      </motion.div>

      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group glass-card p-6 rounded-2xl hover:shadow-glass-hover transition-all duration-300"
          >
            <div className="flex items-start gap-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center flex-shrink-0 shadow-glow p-3`}
              >
                <img 
                  src={cert.logo} 
                  alt={`${cert.name} logo`}
                  className={`w-full h-full object-contain ${cert.name.includes('Kubernetes') || cert.name.includes('Docker') ? '' : 'filter brightness-0 invert'}`}
                />
              </motion.div>
              
                <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {cert.name}
                      </h3>
                      <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                        Verified
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium">{cert.issuer}</p>
                    <p className="text-sm text-primary">Issued: {cert.issued}</p>
                    
                    {/* Credly Badge Button - Under Verified status */}
                    <motion.a
                      href={cert.credlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-500 group mt-3 w-fit"
                    >
                      <Award className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-medium">View Badge</span>
                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {cert.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full border border-border/50 hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Certification Benefits
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Industry-recognized credentials</span>
          </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Validated technical expertise</span>
          </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Enhanced professional credibility</span>
          </div>
        </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Up-to-date with latest technologies</span>
      </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Competitive advantage in job market</span>
    </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Continuous learning commitment</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Modern Contact App Component
const ContactApp = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="space-y-8"
  >
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-center mb-12 relative"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>
      </div>
      
      {/* Header content */}
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-6"
        >
          <Mail className="w-8 h-8 text-gray-400" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
        >
          Get In Touch
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Let's connect and discuss opportunities for collaboration and growth
        </motion.p>
        
        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto mt-6 max-w-md"
        />
      </div>
    </motion.div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-foreground font-medium">+212 688 191 812</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">medbelouarraq@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
               <p className="text-foreground font-medium">Casablanca, Morocco</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-primary" />
          Social Links
        </h3>
        <div className="space-y-4">
           <motion.a 
             href="https://www.linkedin.com/in/mohammed-bel-ouarraq-554057218/" 
             target="_blank" 
             rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Linkedin className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-foreground font-medium">LinkedIn</p>
              <p className="text-sm text-muted-foreground">MOHAMMED BEL OUARRAQ</p>
            </div>
          </motion.a>
          <motion.a 
            href="https://github.com/mbelouar" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center group-hover:bg-gray-500/20 transition-colors">
              <Github className="w-6 h-6 text-gray-400" />
        </div>
            <div>
              <p className="text-foreground font-medium">GitHub</p>
              <p className="text-sm text-muted-foreground">@mbelouar</p>
      </div>
          </motion.a>
        </div>
      </motion.div>
    </div>

     {/* Contact Form */}
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, delay: 0.3 }}
       className="glass-card p-8 rounded-3xl group hover:shadow-2xl transition-all duration-500"
     >
       <div className="flex items-center gap-4 mb-8">
         <motion.div
           className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center shadow-lg border border-white/20"
           whileHover={{ scale: 1.05, rotate: 5 }}
           transition={{ duration: 0.3 }}
         >
           <Mail className="w-7 h-7 text-gray-400 drop-shadow-sm" />
         </motion.div>
         <div className="flex-1">
           <h3 className="text-2xl font-bold text-foreground bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
             Send Message
           </h3>
           <div className="h-0.5 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full mt-2"></div>
         </div>
       </div>
       
       <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.4 }}
           >
             <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
               <User className="w-4 h-4 text-gray-400" />
               Full Name
             </label>
             <input
               type="text"
               className="w-full px-6 py-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl text-foreground placeholder-muted-foreground focus:border-gray-600 focus:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-600/20 transition-all duration-300 hover:bg-gray-800/40"
               placeholder="Enter your full name"
             />
           </motion.div>
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.5 }}
           >
             <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
               <Mail className="w-4 h-4 text-gray-400" />
               Email Address
             </label>
             <input
               type="email"
               className="w-full px-6 py-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl text-foreground placeholder-muted-foreground focus:border-gray-600 focus:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-600/20 transition-all duration-300 hover:bg-gray-800/40"
               placeholder="your.email@example.com"
             />
           </motion.div>
         </div>
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.6 }}
         >
           <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
             <FileText className="w-4 h-4 text-gray-400" />
             Subject
           </label>
           <input
             type="text"
             className="w-full px-6 py-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl text-foreground placeholder-muted-foreground focus:border-gray-600 focus:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-600/20 transition-all duration-300 hover:bg-gray-800/40"
             placeholder="What's this message about?"
           />
         </motion.div>
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.7 }}
         >
           <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
             <MessageSquare className="w-4 h-4 text-gray-400" />
             Message
           </label>
           <textarea
             className="w-full px-6 py-4 bg-gray-800/30 border border-gray-700/50 rounded-2xl text-foreground placeholder-muted-foreground focus:border-gray-600 focus:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-600/20 transition-all duration-300 resize-none hover:bg-gray-800/40"
             rows={6}
             placeholder="Tell me about your project, collaboration idea, or any questions you have..."
           />
         </motion.div>
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.8 }}
           className="flex justify-center"
         >
           <motion.button 
             type="submit"
             whileHover={{ scale: 1.05, y: -2 }}
             whileTap={{ scale: 0.95 }}
             className="px-12 py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-500 transition-all duration-300 flex items-center gap-3 group"
           >
             <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
             Send Message
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
           </motion.button>
         </motion.div>
       </form>
     </motion.div>
  </motion.div>
);

// Modern Terminal App Component
const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['Welcome to Portfolio Terminal. Type "help" for commands.']);

  const handleCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let response = '';

    switch (command) {
      case 'help':
        response = 'Available commands: about, projects, skills, experience, certifications, contact, clear';
        break;
      case 'about':
        response = 'Final-year Computer Engineering Student & DevOps Enthusiast. Phone: +212 688 191 812 | Email: medbelouarraq@gmail.com';
        break;
      case 'projects':
        response = 'SecureAuth (IAM Platform), IoT Kubernetes Orchestration, Transendence Gaming Platform, Inception Multi-Service System, NestTools Community Platform';
        break;
      case 'skills':
        response = 'DevOps: Kubernetes (90%), Docker (95%), Terraform (85%), ArgoCD (80%), Prometheus (85%) | Languages: Python (90%), C/C++ (85%), JavaScript (80%)';
        break;
      case 'experience':
        response = 'E2IP Technologies (DevOps Intern), ADE President (1000+ students), BMCE Group (Software Research), National School of Applied Sciences';
        break;
      case 'certifications':
        response = 'KCNA (Kubernetes & Cloud Native Associate) - Linux Foundation | Docker Foundations Professional Certificate - Docker Inc';
        break;
      case 'contact':
        response = 'Email: medbelouarraq@gmail.com | Phone: +212 688 191 812 | LinkedIn: MOHAMMED BEL OUARRAQ | GitHub: @mbelouar';
        break;
      case 'clear':
        setOutput([]);
        return;
      default:
        response = `Command not found: ${cmd}`;
    }

    setOutput([...output, `$ ${cmd}`, response]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-green-400 p-6 rounded-xl font-mono text-sm min-h-[400px] shadow-2xl border border-gray-800/50 relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-xs ml-4">portfolio-terminal</span>
        </div>
        
        {/* Terminal Content */}
        <div className="space-y-1">
          {output.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`mb-1 ${line.startsWith('$') ? 'text-blue-400' : line.includes('Command not found') ? 'text-red-400' : 'text-green-400'}`}
            >
              {line}
            </motion.div>
          ))}
        </div>
        
        {/* Terminal Input */}
        <div className="flex items-center gap-2 mt-4 pt-2 border-t border-gray-700/30">
          <span className="text-blue-400 font-bold">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(input);
                setInput('');
              }
            }}
            className="flex-1 bg-transparent outline-none text-green-400 placeholder-gray-500 focus:text-green-300 transition-colors"
            placeholder="Type a command..."
            autoFocus
          />
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-4 bg-green-400"
          />
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced macOS Dock Component with Authentic Styling
const MacOSDock: React.FC<{
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps: string[];
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ apps, onAppClick, openApps, isVisible, onMouseEnter, onMouseLeave }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 50,
        scale: isVisible ? 1 : 0.95
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="fixed bottom-6 left-0 right-0 flex justify-center z-[1000]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Authentic macOS Dock Background */}
      <div className="relative">
        {/* Dock Background with macOS styling */}
        <div className="relative dock-background rounded-2xl shadow-2xl">
          {/* Inner dock background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/10 rounded-2xl overflow-hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 rounded-2xl overflow-hidden"></div>
          
          {/* Dock container */}
          <div className="relative px-6 py-2">
            <div className="flex items-center justify-center gap-2">
              {apps.map((app, index) => {
                const isOpen = openApps.includes(app.id);
                const isHovered = hoveredIndex === index;
                const scale = isHovered ? 1.15 : isOpen ? 1.05 : 1;
                const translateY = isHovered ? -8 : 0;
                
                return (
                  <motion.div
                    key={app.id}
                    className="relative flex flex-col items-center group"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ scale: 1, y: 0 }}
                    animate={{ 
                      scale: scale,
                      y: translateY
                    }}
                    transition={{ 
                      duration: 0.25,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* App Icon Container */}
                    <motion.button
                      onClick={() => onAppClick(app.id)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                        isHovered ? 'dock-icon-glow' : ''
                      }`}
                      style={{
                        filter: isHovered ? 'brightness(1.1) saturate(1.2)' : 'brightness(1) saturate(1)',
                      }}
                    >
                      {/* Icon Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
                      
                      {/* App Icon */}
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-full h-full object-cover rounded-xl"
                        draggable={false}
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Reflection Effect */}
                      <div className="dock-icon-reflection"></div>
                    </motion.button>
                    
                    {/* Running App Indicator */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-sm"
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* App Name Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -top-10 left-0 right-0 flex justify-center"
                        >
                          <div className="relative px-2 py-1 glass-card text-white text-[10px] rounded-md whitespace-nowrap">
                            {app.name}
                            {/* Tooltip Triangle */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent" style={{ borderTopColor: 'rgba(255, 255, 255, 0.08)' }}></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Dock Bottom Reflection */}
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-b from-white/10 to-transparent rounded-b-2xl"></div>
        </div>
        
        {/* Dock Shadow */}
        <div className="absolute inset-0 bg-black/20 rounded-2xl blur-xl -z-10 scale-105"></div>
        
      </div>
    </motion.div>
  );
};

// Main Portfolio Component
const MacOSPortfolio: React.FC = () => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [time, setTime] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const [isDockHovered, setIsDockHovered] = useState(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced interactive cursor effects with smoother movement
  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Cancel previous animation frame for smoother updates
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      animationFrame = requestAnimationFrame(() => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
        setIsMouseMoving(true);
        
        if (mouseTimeoutRef.current) {
          clearTimeout(mouseTimeoutRef.current);
        }
        
        mouseTimeoutRef.current = setTimeout(() => {
          setIsMouseMoving(false);
        }, 150); // Slightly longer timeout for smoother feel
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // Handle window resize to recalculate positions with debouncing
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Force re-render to recalculate window positions
        setOpenWindows([...openWindows]);
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [openWindows]);

  // Dock auto-hide logic - hide instantly when windows are open, show on hover
  useEffect(() => {
    if (openWindows.length > 0 && !isDockHovered) {
      // Hide dock instantly when windows are open
      setIsDockVisible(false);
    } else {
      // Show dock when no windows are open or when hovered
      setIsDockVisible(true);
    }
  }, [openWindows.length, isDockHovered]);

  // Mouse movement detection for dock reveal - show dock even with maximized windows
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isNearBottom = e.clientY > window.innerHeight - 80; // 80px from bottom for faster response
      
      if (isNearBottom) {
        setIsDockVisible(true);
        setIsDockHovered(true);
        
        // Clear any existing timeout
        if (dockTimeoutRef.current) {
          clearTimeout(dockTimeoutRef.current);
        }
        
        // Set timeout to hide dock again when mouse moves away - faster hide
        dockTimeoutRef.current = setTimeout(() => {
          setIsDockHovered(false);
          if (openWindows.length > 0) {
            setIsDockVisible(false);
          }
        }, 1500); // Hide after 1.5 seconds of no hover (faster)
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (dockTimeoutRef.current) {
        clearTimeout(dockTimeoutRef.current);
      }
    };
  }, [openWindows.length]);

  const apps: DockApp[] = [
    { id: 'about', name: 'About Me', icon: 'https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024', color: 'blue' },
    { id: 'certifications', name: 'Certifications', icon: 'https://cdn.jim-nielsen.com/macos/1024/messages-2021-05-25.png?rf=1024', color: 'yellow' },
    { id: 'projects', name: 'Projects', icon: 'https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024', color: 'green' },
    { id: 'skills', name: 'Skills', icon: 'https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024', color: 'purple' },
    { id: 'experience', name: 'Experience', icon: 'https://cdn.jim-nielsen.com/macos/1024/calendar-2021-04-29.png?rf=1024', color: 'orange' },
    { id: 'contact', name: 'Contact', icon: 'https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024', color: 'red' },
    { id: 'terminal', name: 'Terminal', icon: 'https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024', color: 'gray' },
  ];

  // Enhanced window positioning - optimal placement and collision avoidance
  const getSmartPosition = (windowId: string) => {
    // Dock dimensions and positioning
    const dockHeight = 80;
    const dockBottomMargin = 32;
    const dockTotalHeight = dockHeight + dockBottomMargin;
    
    // Window dimensions with responsive sizing
    const windowWidth = Math.min(800, window.innerWidth - 120);
    const windowHeight = Math.min(700, window.innerHeight - dockTotalHeight - 120);
    
    // Available space calculation (excluding dock area and margins)
    const availableWidth = window.innerWidth - 120; // 60px margin on each side
    const availableHeight = window.innerHeight - dockTotalHeight - 120; // Exclude dock area and margins
    
    // Calculate optimal center position
    const centerX = Math.max(60, (availableWidth - windowWidth) / 2);
    const centerY = Math.max(60, (availableHeight - windowHeight) / 2);
    
    // Enhanced staggered positioning with better distribution
    const staggerOffset = 60;
    const verticalOffset = 80;
    
    const basePositions = {
      about: { x: centerX, y: centerY },
      certifications: { x: centerX + staggerOffset, y: centerY + verticalOffset },
      projects: { x: centerX - staggerOffset, y: centerY + verticalOffset * 1.5 },
      skills: { x: centerX + staggerOffset * 1.5, y: centerY - verticalOffset * 0.5 },
      experience: { x: centerX - staggerOffset * 1.5, y: centerY + verticalOffset * 2 },
      contact: { x: centerX + staggerOffset * 2, y: centerY + verticalOffset * 0.5 },
      terminal: { x: centerX - staggerOffset * 2, y: centerY + verticalOffset * 2.5 }
    };
    
    const basePos = basePositions[windowId as keyof typeof basePositions] || { x: centerX, y: centerY };
    
    // Enhanced boundary checking with better margins
    const minX = 60;
    const minY = 60;
    const maxX = Math.max(minX, availableWidth - windowWidth + 60);
    const maxY = Math.max(minY, availableHeight - windowHeight + 60);
    
    // Ensure windows stay within visible bounds with proper margins
    const finalX = Math.min(Math.max(basePos.x, minX), maxX);
    const finalY = Math.min(Math.max(basePos.y, minY), maxY);
    
    return {
      x: finalX,
      y: finalY
    };
  };

  // Simple and reliable window positioning with proper offset
  const getOptimalPosition = (windowId: string, existingWindows: string[]) => {
    const windowWidth = Math.min(800, window.innerWidth - 120);
    const windowHeight = Math.min(700, window.innerHeight - 112 - 120);
    
    // Get the index of current window in the open windows array
    const windowIndex = existingWindows.indexOf(windowId);
    
    // Define offset amounts for proper spacing
    const offsetX = 50;  // Horizontal offset between windows
    const offsetY = 50;  // Vertical offset between windows
    
    // Calculate position with all windows from 2nd onwards on same horizontal line
    let x, y;
    
    if (windowIndex === 0) {
      // First window: top-left position
      x = 50;
      y = 20;
    } else {
      // All other windows: same horizontal line
      const horizontalOffset = 50;
      x = 100 + ((windowIndex - 1) * horizontalOffset);
      y = 70; // All windows from 2nd onwards have same Y position
    }
    
    // Ensure position is within bounds - adjusted for higher and left positioning
    const maxX = Math.max(50, window.innerWidth - windowWidth - 50);
    const maxY = Math.max(20, window.innerHeight - 112 - windowHeight - 20);
    
    // If window would go off-screen, adjust position
    const finalX = x > maxX ? 50 : x;
    const finalY = y > maxY ? 20 : y;
    
    console.log(`Window ${windowId} (index: ${windowIndex}) positioned at:`, { x: finalX, y: finalY });
    
    return {
      x: Math.min(finalX, maxX),
      y: Math.min(finalY, maxY)
    };
  };

  const handleAppClick = (appId: string) => {
    // If window is minimized, restore it
    if (minimizedWindows.includes(appId)) {
      setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
      return;
    }
    
    // If window is already open, bring it to front
    if (openWindows.includes(appId)) {
      // Move to end of array to bring to front and reposition
      const otherWindows = openWindows.filter(id => id !== appId);
      setOpenWindows([...otherWindows, appId]);
      return;
    }
    
    // Open new window - it will be positioned with proper offset
    setOpenWindows([...openWindows, appId]);
  };

  const handleCloseWindow = (appId: string) => {
    const newOpenWindows = openWindows.filter(id => id !== appId);
    setOpenWindows(newOpenWindows);
    setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
    
    // Trigger repositioning of remaining windows
    setTimeout(() => {
      setOpenWindows([...newOpenWindows]);
    }, 100);
  };

  const getAppComponent = (appId: string) => {
    switch (appId) {
      case 'about': return <AboutApp />;
      case 'projects': return <ProjectsApp />;
      case 'skills': return <SkillsApp />;
      case 'experience': return <ExperienceApp />;
      case 'certifications': return <CertificationsApp />;
      case 'contact': return <ContactApp />;
      case 'terminal': return <TerminalApp />;
      default: return null;
    }
  };

  return (
    <motion.div 
      className="min-h-screen w-full relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ opacity: 1 }}
    >
      {/* Enhanced Interactive Background Elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      
      {/* Enhanced Parallax Elements */}
      <div className="parallax-element"></div>
      <div className="parallax-element"></div>
      <div className="parallax-element"></div>
      
      
      {/* Elegant Ambient Lighting */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-gradient-radial from-white/5 to-transparent pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-radial from-white/4 to-transparent pointer-events-none"
        animate={{
          scale: [1.05, 0.95, 1.05],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
      
      {/* Enhanced Interactive Cursor Glow */}
      <motion.div
        className="cursor-glow"
        style={{
          transform: `translate(${cursorPosition.x - 200}px, ${cursorPosition.y - 200}px)`,
        }}
        animate={{
          opacity: isMouseMoving ? 0.3 : 0,
          scale: isMouseMoving ? 1 : 0.8,
        }}
        transition={{ 
          duration: 0.2,
          ease: "easeOut",
          opacity: { duration: 0.3, ease: "easeInOut" },
          scale: { duration: 0.2, ease: "easeOut" }
        }}
      />
      
      {/* Enhanced Interactive Cursor Trail */}
      <AnimatePresence>
        {isMouseMoving && (
          <motion.div
            className="cursor-trail"
            style={{
              transform: `translate(${cursorPosition.x - 12}px, ${cursorPosition.y - 12}px)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: 0.1,
              ease: "easeOut",
              opacity: { duration: 0.15, ease: "easeInOut" },
              scale: { duration: 0.1, ease: "easeOut" }
            }}
          />
        )}
      </AnimatePresence>
      {/* Enhanced macOS Menu Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 h-8 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 text-white text-xs z-50"
      >
        <div className="flex items-center gap-6">
          {/* Apple Logo */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenWindows([])}
            className="w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-sm transition-colors"
            title="Close All Windows"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </motion.div>
          
          {/* App Name */}
          <span className="font-semibold text-sm text-white/90">Portfolio</span>
          
          {/* Menu Items */}
          <div className="flex items-center gap-5 text-white/70">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              File
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              Edit
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              Selection
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              View
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              Go
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              Run
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              Terminal
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              Window
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-sm hover:bg-white/10 font-medium"
            >
              Help
            </motion.span>
        </div>
        </div>

        {/* System Indicators */}
        <div className="flex items-center gap-3">
          {/* Control Center */}
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-sm transition-colors"
          >
            <div className="w-3 h-3 border border-white/60 rounded-sm"></div>
          </motion.div>
          
          {/* Wi-Fi */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/80">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
          </motion.div>
          
          {/* Battery */}
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <div className="relative">
              <svg width="16" height="10" viewBox="0 0 16 10" className="fill-current">
                <rect x="0.5" y="1.5" width="13" height="7" rx="1.5" ry="1.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                <rect x="14" y="3" width="1" height="4" rx="0.5" ry="0.5" fill="currentColor"/>
                <rect x="1" y="2" width="12" height="6" rx="1" ry="1" fill="currentColor" opacity="0.8"/>
              </svg>
            </div>
            <span className="text-[10px]">85%</span>
          </div>
          
          {/* Search */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/80">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </motion.div>
          
          {/* Time */}
          <span className="text-xs text-white/90 font-medium px-2 py-1 rounded-sm hover:bg-white/10 cursor-pointer transition-colors">
            {time}
          </span>
      </div>
      </motion.div>

      {/* Enhanced Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pb-32 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl"
        >
          <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
          >
            Welcome to my<br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Portfolio OS
            </span>
          </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-12 leading-relaxed"
          >
            Final-year Computer Engineering Student & DevOps Enthusiast<br />
            <span className="text-primary">Specialized in Kubernetes, Docker, and Cloud Infrastructure</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-muted-foreground text-sm animate-bounce-gentle"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Open apps from the dock below</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Windows */}
      <AnimatePresence>
      {openWindows.map((appId, index) => {
        const app = apps.find(a => a.id === appId);
        const position = getOptimalPosition(appId, openWindows);
        const isMinimized = minimizedWindows.includes(appId);
        return (
          <Window
            key={appId}
            id={appId}
            title={app?.name || ''}
            onClose={() => handleCloseWindow(appId)}
            initialPosition={position}
            isMinimized={isMinimized}
            onMinimize={(minimized) => {
              if (minimized) {
                setMinimizedWindows([...minimizedWindows, appId]);
              } else {
                setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
              }
            }}
          >
            {getAppComponent(appId)}
          </Window>
        );
      })}
      </AnimatePresence>

      {/* Enhanced Dock with Auto-Hide */}
      <MacOSDock
        apps={apps}
        onAppClick={handleAppClick}
        openApps={openWindows}
        isVisible={isDockVisible}
        onMouseEnter={() => setIsDockHovered(true)}
        onMouseLeave={() => setIsDockHovered(false)}
      />
    </motion.div>
  );
};

export default MacOSPortfolio;