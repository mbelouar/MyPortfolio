'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';

// Types
interface DockApp {
  id: string;
  name: string;
  icon: string;
}

interface WindowProps {
  id: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
}

// Window Component
const Window: React.FC<WindowProps> = ({ id, title, onClose, children, initialPosition = { x: 100, y: 100 } }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
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

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        zIndex: 100
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-700 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
          </div>
          <span className="ml-4 text-sm font-medium text-white">{title}</span>
        </div>
      </div>
      <div className="p-6 overflow-auto text-white" style={{ maxHeight: 'calc(80vh - 60px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

// App Components
const AboutApp = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-white">About Me</h2>
    <div className="flex items-start gap-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white">BEL OUARRAQ MOHAMMED</h3>
        <p className="text-slate-300">Computer Engineering Student & DevOps Enthusiast</p>
        <div className="mt-4 space-y-2 text-sm text-slate-400">
          <p><strong className="text-white">Location:</strong> Morocco</p>
          <p><strong className="text-white">Education:</strong> Final-year Computer Engineering Student</p>
          <p><strong className="text-white">Specialization:</strong> DevOps, Cloud Computing, Kubernetes, Docker</p>
        </div>
      </div>
    </div>
    <p className="text-slate-300">
      Passionate about DevOps and cloud technologies with hands-on experience in containerization, 
      orchestration, and automation. I love building scalable infrastructure and solving complex deployment challenges.
    </p>
  </div>
);

const ProjectsApp = () => {
  const projects = [
    { name: 'Kubernetes Cluster Management', tech: 'Kubernetes, Docker, Terraform', year: '2024' },
    { name: 'CI/CD Pipeline Automation', tech: 'Jenkins, GitLab CI, Docker', year: '2024' },
    { name: 'Cloud Infrastructure Setup', tech: 'AWS, Terraform, Ansible', year: '2023' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Projects</h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-violet-500 transition-colors">
            <h3 className="font-semibold text-white">{project.name}</h3>
            <p className="text-sm text-slate-300 mt-1">{project.tech}</p>
            <p className="text-xs text-slate-400 mt-2">{project.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillsApp = () => {
  const skills = [
    { name: 'Kubernetes', level: 85 },
    { name: 'Docker', level: 90 },
    { name: 'Terraform', level: 80 },
    { name: 'AWS', level: 75 },
    { name: 'Jenkins', level: 85 },
    { name: 'GitLab CI', level: 80 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Skills</h2>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-white">{skill.name}</span>
              <span className="text-sm text-slate-400">{skill.level}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExperienceApp = () => {
  const experiences = [
    { company: 'DevOps Internship', role: 'DevOps Engineer Intern', period: '2024 - Present' },
    { company: 'University Projects', role: 'Computer Engineering Student', period: '2021 - 2025' },
    { company: 'Personal Projects', role: 'Cloud Infrastructure Developer', period: '2023 - Present' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Experience</h2>
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{exp.role}</h3>
              <p className="text-sm text-slate-300">{exp.company}</p>
              <p className="text-xs text-slate-400 mt-1">{exp.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactApp = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-white">Contact</h2>
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Message</label>
        <textarea
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
          rows={4}
          placeholder="Your message..."
        />
      </div>
      <button 
        type="submit"
        className="w-full px-6 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Send Message
      </button>
    </form>
    <div className="flex gap-4 pt-4 border-t border-slate-700">
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
        <Github className="w-6 h-6" />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
        <Linkedin className="w-6 h-6" />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
        <Twitter className="w-6 h-6" />
      </a>
    </div>
  </div>
);

const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['Welcome to Portfolio Terminal. Type "help" for commands.']);

  const handleCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let response = '';

    switch (command) {
      case 'help':
        response = 'Available commands: about, projects, skills, contact, clear';
        break;
      case 'about':
        response = 'Computer Engineering Student & DevOps Enthusiast with 3+ years of experience';
        break;
      case 'projects':
        response = 'Kubernetes Cluster Management, CI/CD Pipeline Automation, Cloud Infrastructure Setup';
        break;
      case 'skills':
        response = 'Kubernetes, Docker, Terraform, AWS, Jenkins, GitLab CI';
        break;
      case 'contact':
        response = 'Email: mohammed@example.com | GitHub: @mohammedbelouarraq';
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
    <div className="space-y-4">
      <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[300px]">
        {output.map((line, index) => (
          <div key={index} className="mb-1">{line}</div>
        ))}
        <div className="flex items-center gap-2">
          <span>$</span>
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
            className="flex-1 bg-transparent outline-none text-green-400"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

// Dock Component
const MacOSDock: React.FC<{
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps: string[];
}> = ({ apps, onAppClick, openApps }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-3 shadow-2xl">
        <div className="flex items-end gap-3">
          {apps.map((app, index) => (
            <div
              key={app.id}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <button
                onClick={() => {
                  console.log('Clicked app:', app.id);
                  onAppClick(app.id);
                }}
                className="relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-slate-700 hover:bg-slate-600"
                style={{
                  transform: hoveredIndex === index ? 'scale(1.1) translateY(-8px)' : 'scale(1)',
                }}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
              
              {/* App name tooltip */}
              {hoveredIndex === index && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900/95 text-white text-xs rounded whitespace-nowrap">
                  {app.name}
                </div>
              )}
              
              {/* Indicator dot for open apps */}
              {openApps.includes(app.id) && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Portfolio Component
const MacOSPortfolio: React.FC = () => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const apps: DockApp[] = [
    { id: 'about', name: 'About Me', icon: 'https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024' },
    { id: 'projects', name: 'Projects', icon: 'https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024' },
    { id: 'skills', name: 'Skills', icon: 'https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024' },
    { id: 'experience', name: 'Experience', icon: 'https://cdn.jim-nielsen.com/macos/1024/calendar-2021-04-29.png?rf=1024' },
    { id: 'contact', name: 'Contact', icon: 'https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024' },
    { id: 'terminal', name: 'Terminal', icon: 'https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024' },
  ];

  const handleAppClick = (appId: string) => {
    console.log('handleAppClick called with:', appId);
    if (!openWindows.includes(appId)) {
      setOpenWindows([...openWindows, appId]);
      console.log('Opening window:', appId);
    } else {
      console.log('Window already open:', appId);
    }
  };

  const handleCloseWindow = (appId: string) => {
    setOpenWindows(openWindows.filter(id => id !== appId));
  };

  const getAppComponent = (appId: string) => {
    switch (appId) {
      case 'about': return <AboutApp />;
      case 'projects': return <ProjectsApp />;
      case 'skills': return <SkillsApp />;
      case 'experience': return <ExperienceApp />;
      case 'contact': return <ContactApp />;
      case 'terminal': return <TerminalApp />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

      {/* Menu Bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 text-white text-sm z-50">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Portfolio</span>
          <span className="text-slate-400 cursor-default hover:text-white transition-colors">File</span>
          <span className="text-slate-400 cursor-default hover:text-white transition-colors">Edit</span>
          <span className="text-slate-400 cursor-default hover:text-white transition-colors">View</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">{time}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pb-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-light text-white text-center mb-8 leading-tight"
        >
          Welcome to my<br />
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Portfolio OS
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl text-slate-300 text-center mb-12 max-w-2xl"
        >
          Click on the apps in the dock below to explore my work, skills, and experience
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-slate-400 text-sm animate-pulse"
        >
          ↓ Open apps from the dock ↓
        </motion.div>
      </div>

      {/* Windows */}
      <AnimatePresence>
        {openWindows.map((appId, index) => {
          const app = apps.find(a => a.id === appId);
          return (
            <Window
              key={appId}
              id={appId}
              title={app?.name || ''}
              onClose={() => handleCloseWindow(appId)}
              initialPosition={{ x: 100 + index * 30, y: 100 + index * 30 }}
            >
              {getAppComponent(appId)}
            </Window>
          );
        })}
      </AnimatePresence>

      {/* Dock */}
      <MacOSDock
        apps={apps}
        onAppClick={handleAppClick}
        openApps={openWindows}
      />
    </div>
  );
};

export default MacOSPortfolio;
