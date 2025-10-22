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
  Globe
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [zIndex, setZIndex] = useState(10);
  const windowRef = useRef<HTMLDivElement>(null);

  // Bring window to front when clicked
  const bringToFront = () => {
    setZIndex(100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    e.stopPropagation(); // Stop event bubbling
    
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Restore normal cursor and text selection
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ 
        opacity: isMinimized ? 0 : 1, 
        scale: isMinimized ? 0.8 : 1, 
        y: isMaximized ? 0 : (isMinimized ? window.innerHeight + 100 : position.y),
        x: isMaximized ? 0 : position.x,
        width: isMaximized ? '100vw' : '750px',
        height: isMaximized ? '100vh' : 'auto',
        maxHeight: isMaximized ? '100vh' : '90vh'
      }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ 
        type: "spring", 
        damping: 30, 
        stiffness: 400,
        duration: 0.5
      }}
      className="fixed glass-card rounded-2xl overflow-hidden shadow-2xl cursor-default"
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? '100vw' : '750px',
        maxWidth: '95vw',
        maxHeight: isMaximized ? '100vh' : '90vh',
        zIndex: zIndex,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
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
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800/90 to-gray-900/80 backdrop-blur-xl border-b border-gray-700/30 cursor-grab hover:from-gray-700/90 hover:to-gray-800/80 transition-all duration-200 select-none"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="window-control-btn close group"
              title="Close"
            >
              <div className="window-control-icon close" />
            </button>
            
            {/* Minimize Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMinimize?.(!isMinimized);
              }}
              className="window-control-btn minimize group"
              title="Minimize"
            >
              <div className="window-control-icon minimize" />
            </button>
            
            {/* Maximize Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(!isMaximized);
              }}
              className="window-control-btn maximize group"
              title="Maximize"
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
      <div className="p-8 bg-gradient-to-br from-gray-900/20 to-transparent overflow-auto max-h-[calc(90vh-100px)] scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent select-text">
        <div className="space-y-6">
        {children}
        </div>
      </div>
    </motion.div>
  );
};

// Modern About App Component
const AboutApp = () => (
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
          </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
          </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-foreground font-medium">+212 688 191 812</p>
          </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
        </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">medbelouarraq@gmail.com</p>
      </div>
    </div>
    </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Education
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-foreground font-medium">National School of Applied Sciences</p>
            <p className="text-sm text-muted-foreground">Engineering degree in Computer Science</p>
            <p className="text-xs text-primary">2020 - In Progress</p>
    </div>
          <div>
            <p className="text-foreground font-medium">UM6P - 1337 MED</p>
            <p className="text-sm text-muted-foreground">Digital Technology Architect</p>
            <p className="text-xs text-primary">2022 - 2025</p>
  </div>
        </div>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        Professional Profile
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        DevOps & Cloud enthusiast with a strong foundation in technology and programming, developed through hands-on training and projects. 
        Skilled in problem-solving, teamwork, and project management, and always eager to explore new tools and practices in the DevOps & Cloud ecosystem. 
        Open to internship opportunities to apply and expand my skills in real-world IT environments.
      </p>
    </motion.div>
  </motion.div>
);

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
      color: 'from-blue-500 to-purple-500'
    },
    { 
      name: 'IoT - Lightweight Kubernetes Orchestration', 
      description: 'Demonstrated container orchestration using K3s with Vagrant and K3D with ArgoCD, creating and managing lightweight Kubernetes clusters across various environments, from multi-node setups to GitOps-driven CI/CD pipelines.',
      tech: ['K8s', 'k3s', 'k3d', 'Vagrant', 'Docker', 'CI/CD', 'ArgoCD', 'Scripting'],
      year: '2024',
      type: 'Academic Project',
      status: 'Completed',
      icon: Cloud,
      color: 'from-green-500 to-blue-500'
    },
    { 
      name: 'Transendence - Multiplayer Gaming Platform', 
      description: 'Developed a web application for a multiplayer gaming platform featuring user management, blockchain score storage, and AI opponents. Implemented cybersecurity measures, including two-factor authentication and GDPR compliance.',
      tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'ThreeJS', 'Django', 'Docker', 'Microservices', 'CI/CD', 'PostgreSQL'],
      year: '2024',
      type: 'Academic Project',
      status: 'Completed',
      icon: Code,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Inception - Containerized Multi-Service System', 
      description: 'Designed and implemented a secure, multi-service system using Docker containers for Nginx, WordPress, and MariaDB, orchestrated with Docker Compose. Ensured service isolation, seamless communication, and security.',
      tech: ['Docker', 'Docker Compose', 'Nginx', 'WordPress', 'MariaDB', 'Linux'],
      year: '2023',
      type: 'Academic Project',
      status: 'Completed',
      icon: Layers,
      color: 'from-orange-500 to-red-500'
    },
    { 
      name: 'NestTools - Community Tool-Rental Platform', 
      description: 'Developed a full-stack web application that connects DIY enthusiasts with local tool owners, enabling users to rent tools at a fraction of the purchase cost. Promotes cost-effective and sustainable access to equipment.',
      tech: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Laravel', 'Docker', 'Docker Compose'],
      year: '2023',
      type: 'Academic Project',
      status: 'Completed',
      icon: Database,
      color: 'from-teal-500 to-green-500'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Academic Projects</h2>
        <p className="text-muted-foreground">Showcasing my technical expertise and innovation</p>
      </div>

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
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-glow`}
              >
                <project.icon className="w-8 h-8 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h3>
                      <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                        {project.type}
                </span>
            </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{project.year}</span>
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span className="text-success">{project.status}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
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

// Modern Skills App Component
const SkillsApp = () => {
  const skillCategories = [
    {
      category: 'DevOps & Cloud Tools',
      icon: Cloud,
      color: 'from-blue-500 to-purple-500',
      skills: [
        { name: 'Kubernetes', level: 90, icon: '☸️' },
        { name: 'Docker', level: 95, icon: '🐳' },
        { name: 'Terraform', level: 85, icon: '🏗️' },
        { name: 'ArgoCD', level: 80, icon: '🔄' },
        { name: 'Prometheus', level: 85, icon: '📊' },
        { name: 'Grafana', level: 80, icon: '📈' },
        { name: 'CI/CD', level: 90, icon: '⚡' },
        { name: 'Helm', level: 75, icon: '⛵' },
        { name: 'Vagrant', level: 70, icon: '📦' },
        { name: 'Linux/Unix', level: 90, icon: '🐧' }
      ]
    },
    {
      category: 'Programming Languages',
      icon: Code,
      color: 'from-green-500 to-teal-500',
      skills: [
        { name: 'Python', level: 90, icon: '🐍' },
        { name: 'C/C++', level: 85, icon: '⚙️' },
        { name: 'JavaScript', level: 80, icon: '🟨' },
        { name: 'TypeScript', level: 75, icon: '🔷' },
        { name: 'Bash Scripting', level: 85, icon: '💻' }
      ]
    },
    {
      category: 'Frameworks & Databases',
      icon: Database,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'Django', level: 90, icon: '🎯' },
        { name: 'React', level: 80, icon: '⚛️' },
        { name: 'Next.js', level: 75, icon: '▲' },
        { name: 'MySQL', level: 85, icon: '🗄️' },
        { name: 'MongoDB', level: 80, icon: '🍃' },
        { name: 'PostgreSQL', level: 85, icon: '🐘' }
      ]
    },
    {
      category: 'Tools & Technologies',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Git/GitHub', level: 95, icon: '📚' },
        { name: 'Docker Compose', level: 90, icon: '🐙' },
        { name: 'k3s/k3d', level: 85, icon: '☸️' },
        { name: 'Nginx', level: 80, icon: '🌐' },
        { name: 'WordPress', level: 75, icon: '📝' },
        { name: 'MariaDB', level: 80, icon: '🗃️' }
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Technical Skills</h2>
        <p className="text-muted-foreground">Comprehensive expertise across modern technologies</p>
      </div>
      
      {skillCategories.map((category, categoryIndex) => (
        <motion.div
          key={categoryIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
              <category.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{category.category}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.skills.map((skill, skillIndex) => (
              <motion.div
                key={skillIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{skill.icon}</span>
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                </div>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-progress"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                  />
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
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Languages
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🇲🇦</div>
            <p className="text-foreground font-medium">Arabic</p>
            <p className="text-sm text-muted-foreground">Native</p>
            </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🇫🇷</div>
            <p className="text-foreground font-medium">French</p>
            <p className="text-sm text-muted-foreground">Professional</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🇬🇧</div>
            <p className="text-foreground font-medium">English</p>
            <p className="text-sm text-muted-foreground">Professional</p>
            </div>
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
      color: 'from-blue-500 to-purple-500',
      status: 'Current'
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
      status: 'Completed'
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
      status: 'Completed'
    },
    {
      company: 'National School of Applied Sciences',
      role: 'Computer Engineering Student',
      period: '2020 - In Progress',
      type: 'Education',
      description: 'Pursuing Engineering degree in Computer Science with focus on DevOps, Cloud Computing, and Software Development. Maintaining strong academic performance while engaging in practical projects.',
      technologies: ['Computer Science', 'Engineering', 'Academic Projects', 'Research'],
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      status: 'Ongoing'
    },
    {
      company: 'UM6P - 1337 MED',
      role: 'Digital Technology Architect',
      period: '2022 - 2025',
      type: 'Specialized Program',
      description: 'Enrolled in specialized program focusing on digital technology architecture, advanced programming, and modern software development practices.',
      technologies: ['Digital Architecture', 'Advanced Programming', 'Software Development'],
      icon: Layers,
      color: 'from-teal-500 to-green-500',
      status: 'Ongoing'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Professional Experience</h2>
        <p className="text-muted-foreground">Building expertise through hands-on experience</p>
      </div>

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
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-glow`}
              >
                <exp.icon className="w-8 h-8 text-white" />
              </motion.div>
              
                <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                        {exp.type}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        exp.status === 'Current' ? 'bg-green-500/20 text-green-400' :
                        exp.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-muted/50 text-muted-foreground'
                      }`}>
                        {exp.status}
                    </span>
                  </div>
                    <p className="text-lg text-muted-foreground font-medium">{exp.company}</p>
                    <p className="text-sm text-primary">{exp.period}</p>
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
      icon: '☸️',
      color: 'from-blue-500 to-purple-500',
      verified: true
    },
    {
      name: 'Docker Foundations Professional Certificate',
      issuer: 'Docker, Inc',
      issued: 'June 2025',
      description: 'Professional certification demonstrating expertise in Docker containerization, image management, and container orchestration.',
      skills: ['Docker', 'Containerization', 'Image Management', 'Container Orchestration'],
      icon: '🐳',
      color: 'from-green-500 to-teal-500',
      verified: true
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Certifications</h2>
        <p className="text-muted-foreground">Industry-recognized credentials validating expertise</p>
      </div>

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
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center flex-shrink-0 shadow-glow text-3xl`}
              >
                {cert.icon}
              </motion.div>
              
                <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
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
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-2">Get In Touch</h2>
      <p className="text-muted-foreground">Let's connect and discuss opportunities</p>
    </div>
    
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
              <p className="text-foreground font-medium">Morocco</p>
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
            href="https://linkedin.com/in/mohammed-bel-ouarraq" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Linkedin className="w-6 h-6 text-blue-400" />
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
      className="glass-card p-6 rounded-2xl"
    >
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary" />
        Send Message
      </h3>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Name</label>
          <input
            type="text"
              className="w-full input-modern focus-ring"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
              className="w-full input-modern focus-ring"
            placeholder="your@email.com"
          />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
          <input
            type="text"
            className="w-full input-modern focus-ring"
            placeholder="What's this about?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Message</label>
          <textarea
            className="w-full input-modern focus-ring resize-none"
            rows={4}
            placeholder="Your message..."
          />
        </div>
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary"
        >
          Send Message
        </motion.button>
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
      <div className="glass-card p-6 rounded-2xl">
        <div className="bg-slate-950 text-green-400 p-6 rounded-xl font-mono text-sm min-h-[400px] shadow-inner">
          {output.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="mb-1"
            >
              {line}
            </motion.div>
          ))}
        <div className="flex items-center gap-2 mt-4">
            <span className="text-primary">$</span>
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
              className="flex-1 bg-transparent outline-none text-green-400 focus-ring"
            autoFocus
          />
        </div>
      </div>
    </div>
    </motion.div>
  );
};

// Enhanced Dock Component
const MacOSDock: React.FC<{
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps: string[];
}> = ({ apps, onAppClick, openApps }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed bottom-8 left-0 right-0 flex justify-center z-[9999]"
    >
      <div className="glass-card p-4 rounded-3xl shadow-glass-hover border-white/20">
        <div className="flex items-end gap-4 justify-center">
          {apps.map((app, index) => (
            <motion.div
            key={app.id}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
            onClick={() => onAppClick(app.id)}
                className={`relative w-16 h-16 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer glass-card hover:shadow-glow ${
                  app.id === 'certifications' ? 'ring-2 ring-white/60 shadow-glow-lg' : ''
                }`}
            style={{
                  transform: hoveredIndex === index ? 'scale(1.1) translateY(-8px)' : 'scale(1)',
            }}
                whileHover={{ rotate: 5 }}
          >
            <img
              src={app.icon}
              alt={app.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.button>
              
              {/* App name tooltip */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 glass-card text-white text-xs rounded-lg whitespace-nowrap shadow-glass z-10 ${
                      app.id === 'certifications' ? 'bg-white/20 border border-white/40' : ''
                    }`}
                  >
                    {app.name}
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                      app.id === 'certifications' ? 'border-t-white/40' : 'border-t-white/10'
                    }`} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Indicator dot for open apps */}
            {openApps.includes(app.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-glow" 
                />
              )}
            </motion.div>
          ))}
          </div>
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
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Interactive cursor effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setIsMouseMoving(true);
      
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      
      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, []);

  const apps: DockApp[] = [
    { id: 'about', name: 'About Me', icon: 'https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024', color: 'blue' },
    { id: 'certifications', name: 'Certifications', icon: 'https://cdn.jim-nielsen.com/macos/1024/messages-2021-05-25.png?rf=1024', color: 'yellow' },
    { id: 'projects', name: 'Projects', icon: 'https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024', color: 'green' },
    { id: 'skills', name: 'Skills', icon: 'https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024', color: 'purple' },
    { id: 'experience', name: 'Experience', icon: 'https://cdn.jim-nielsen.com/macos/1024/calendar-2021-04-29.png?rf=1024', color: 'orange' },
    { id: 'contact', name: 'Contact', icon: 'https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024', color: 'red' },
    { id: 'terminal', name: 'Terminal', icon: 'https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024', color: 'gray' },
  ];

  // Smart window positioning - centered and visible
  const getSmartPosition = (windowId: string) => {
    const basePositions = {
      about: { x: 50, y: 50 },
      certifications: { x: 100, y: 80 },
      projects: { x: 150, y: 110 },
      skills: { x: 200, y: 140 },
      experience: { x: 250, y: 170 },
      contact: { x: 300, y: 200 },
      terminal: { x: 350, y: 230 }
    };
    
    const basePos = basePositions[windowId as keyof typeof basePositions] || { x: 50, y: 50 };
    
    // Ensure windows stay within visible bounds with responsive sizing
    const windowWidth = Math.min(750, window.innerWidth - 100);
    const windowHeight = Math.min(600, window.innerHeight - 100);
    const maxX = Math.max(0, window.innerWidth - windowWidth);
    const maxY = Math.max(0, window.innerHeight - windowHeight);
    
    return {
      x: Math.min(basePos.x, maxX),
      y: Math.min(basePos.y, maxY)
    };
  };

  const handleAppClick = (appId: string) => {
    // If window is minimized, restore it
    if (minimizedWindows.includes(appId)) {
      setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
      return;
    }
    
    // If window is already open, bring it to front (do nothing as it's already visible)
    if (openWindows.includes(appId)) {
      return;
    }
    
    // Open new window
    setOpenWindows([...openWindows, appId]);
  };

  const handleCloseWindow = (appId: string) => {
    setOpenWindows(openWindows.filter(id => id !== appId));
    setMinimizedWindows(minimizedWindows.filter(id => id !== appId));
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
      transition={{ duration: 0.5 }}
    >
      {/* Interactive Background Elements */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      
      {/* Parallax Elements */}
      <div className="parallax-element"></div>
      <div className="parallax-element"></div>
      <div className="parallax-element"></div>
      
      {/* Light Waves */}
      <div className="light-wave"></div>
      <div className="light-wave"></div>
      <div className="light-wave"></div>
      
      {/* Interactive Cursor Glow */}
      <motion.div
        className="cursor-glow"
        style={{
          left: cursorPosition.x - 150,
          top: cursorPosition.y - 150,
        }}
        animate={{
          opacity: isMouseMoving ? 0.3 : 0,
          scale: isMouseMoving ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Interactive Cursor Trail */}
      {isMouseMoving && (
        <motion.div
          className="cursor-trail"
          style={{
            left: cursorPosition.x - 10,
            top: cursorPosition.y - 10,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
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
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-6 h-3 border border-white/60 rounded-sm relative cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="absolute right-0 top-0.5 w-0.5 h-2 bg-white/60 rounded-r-sm"></div>
            <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-500 rounded-sm"></div>
          </motion.div>
          
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
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
        const position = getSmartPosition(appId);
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

      {/* Enhanced Dock */}
      <MacOSDock
        apps={apps}
        onAppClick={handleAppClick}
        openApps={openWindows}
      />
    </motion.div>
  );
};

export default MacOSPortfolio;