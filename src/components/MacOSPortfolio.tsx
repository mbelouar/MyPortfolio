'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  Terminal, 
  Mail, 
  User, 
  Code, 
  Briefcase, 
  X,
  Minus,
  Maximize2,
  ChevronRight,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';

// Types
interface DockApp {
  id: string;
  name: string;
  icon: string;
  component?: React.ComponentType<any>;
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
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: '700px',
        maxWidth: '90vw',
        maxHeight: '85vh',
        zIndex: 50
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-600/50 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-110"
            />
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 hover:scale-110" />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 hover:scale-110" />
          </div>
          <span className="ml-4 text-sm font-semibold text-slate-200">{title}</span>
        </div>
      </div>
      <div className="p-8 overflow-auto bg-slate-900/50" style={{ maxHeight: 'calc(85vh - 80px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

// App Components
const AboutApp = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">About Me</h2>
    <div className="flex items-start gap-6">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
        <span className="text-4xl font-bold text-white">MB</span>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-foreground mb-2">BEL OUARRAQ MOHAMMED</h3>
        <p className="text-lg text-blue-400 font-medium mb-4">Final-year Computer Engineering Student</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-muted-foreground">Morocco</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-muted-foreground">National School of Applied Sciences</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-muted-foreground">UM6P – 1337 MED</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            <span className="text-muted-foreground">DevOps & Cloud Enthusiast</span>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-6 border border-slate-600/30">
      <p className="text-muted-foreground leading-relaxed">
        DevOps & Cloud enthusiast with a strong foundation in technology and programming. 
        Skilled in problem-solving, teamwork, and project management, I&apos;m eager to explore 
        new tools and practices in the DevOps & Cloud ecosystem. Open to internship 
        opportunities to apply and expand my skills in real-world IT environments.
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">Kubernetes</span>
      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">Docker</span>
      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">CI/CD</span>
      <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm border border-pink-500/30">Python</span>
      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">Terraform</span>
    </div>
  </div>
);

const ProjectsApp = () => {
  const projects = [
    { 
      name: 'SecureAuth - Final Year Project', 
      description: 'Identity and Access Management (IAM) platform supporting SSO, MFA, and identity lifecycle management',
      tech: 'Kubernetes, Docker, Helm, Terraform, Prometheus, Grafana, ArgoCD, Django',
      year: '2025',
      featured: true
    },
    { 
      name: 'IoT - Lightweight Kubernetes Orchestration', 
      description: 'Container orchestration using K3s with Vagrant and K3D with ArgoCD for lightweight Kubernetes clusters',
      tech: 'K8s, k3s, k3d, Vagrant, Docker, CI/CD, ArgoCD',
      year: '2024',
      featured: false
    },
    { 
      name: 'Transendence - Multiplayer Gaming Platform', 
      description: 'Web application for multiplayer gaming with user management, AI opponents, and cybersecurity measures',
      tech: 'Django, Docker, ThreeJS, PostgreSQL, Microservices',
      year: '2024',
      featured: false
    },
    { 
      name: 'Inception - Containerized Multi-Service System', 
      description: 'Secure multi-service system using Docker containers for Nginx, WordPress, and MariaDB',
      tech: 'Docker, Docker Compose, Nginx, WordPress, MariaDB',
      year: '2023',
      featured: false
    },
    { 
      name: 'NestTools - Community Tool-Rental Platform', 
      description: 'Full-stack web application connecting DIY enthusiasts with local tool owners',
      tech: 'React, Next.js, Tailwind CSS, TypeScript, Laravel',
      year: '2023',
      featured: false
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Academic Projects</h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className={`p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
            project.featured 
              ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30 shadow-lg' 
              : 'bg-slate-800/50 border-slate-600/30 hover:border-blue-400/30'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className={`font-bold text-lg ${project.featured ? 'text-blue-400' : 'text-foreground'}`}>
                {project.name}
              </h3>
              {project.featured && (
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-semibold">
                  FEATURED
                </span>
              )}
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tech.split(', ').map((tech, techIndex) => (
                <span key={techIndex} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs border border-slate-600/30">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{project.year}</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                  View Details
                </button>
                <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs border border-green-500/30 hover:bg-green-500/30 transition-colors">
                  GitHub
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillsApp = () => {
  const skillCategories = [
    {
      category: 'DevOps & Cloud',
      skills: [
        { name: 'Kubernetes', level: 90, color: 'from-blue-500 to-blue-600' },
        { name: 'Docker', level: 95, color: 'from-blue-400 to-blue-500' },
        { name: 'Terraform', level: 85, color: 'from-purple-500 to-purple-600' },
        { name: 'CI/CD', level: 90, color: 'from-green-500 to-green-600' },
        { name: 'ArgoCD', level: 80, color: 'from-indigo-500 to-indigo-600' },
        { name: 'Prometheus', level: 75, color: 'from-orange-500 to-orange-600' },
        { name: 'Grafana', level: 80, color: 'from-pink-500 to-pink-600' },
      ]
    },
    {
      category: 'Programming Languages',
      skills: [
        { name: 'Python', level: 90, color: 'from-yellow-500 to-yellow-600' },
        { name: 'C/C++', level: 85, color: 'from-blue-500 to-blue-600' },
        { name: 'JavaScript', level: 80, color: 'from-yellow-400 to-yellow-500' },
        { name: 'TypeScript', level: 75, color: 'from-blue-400 to-blue-500' },
      ]
    },
    {
      category: 'Frameworks & Tools',
      skills: [
        { name: 'Django', level: 85, color: 'from-green-600 to-green-700' },
        { name: 'React', level: 80, color: 'from-cyan-500 to-cyan-600' },
        { name: 'Next.js', level: 75, color: 'from-gray-500 to-gray-600' },
        { name: 'Laravel', level: 70, color: 'from-red-500 to-red-600' },
        { name: 'Git/GitHub', level: 90, color: 'from-gray-600 to-gray-700' },
        { name: 'Linux/Unix', level: 85, color: 'from-orange-600 to-orange-700' },
      ]
    },
    {
      category: 'Databases',
      skills: [
        { name: 'MySQL', level: 85, color: 'from-blue-500 to-blue-600' },
        { name: 'MongoDB', level: 80, color: 'from-green-500 to-green-600' },
        { name: 'PostgreSQL', level: 75, color: 'from-blue-600 to-blue-700' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Technical Skills</h2>
      
      {skillCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground border-b border-slate-600/30 pb-2">
            {category.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                  <span className="text-xs text-muted-foreground bg-slate-700/50 px-2 py-1 rounded-full">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Certifications */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/30">
        <h3 className="text-xl font-semibold text-foreground mb-4">Certifications</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div>
              <p className="font-medium text-foreground">Kubernetes and Cloud Native Associate (KCNA)</p>
              <p className="text-sm text-muted-foreground">The Linux Foundation • September 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="font-medium text-foreground">Docker Foundations Professional Certificate</p>
              <p className="text-sm text-muted-foreground">Docker, Inc • June 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExperienceApp = () => {
  const experiences = [
    { 
      company: 'E2IP TECHNOLOGIES', 
      role: 'DevOps & IAM Intern', 
      period: 'July 2025 – September 2025',
      description: 'Assisted in deploying and maintaining cloud-native IAM solutions. Automated CI/CD pipelines and monitored system performance with Kubernetes, Docker, and Prometheus.',
      type: 'internship'
    },
    { 
      company: 'ADE (Student Association)', 
      role: 'President', 
      period: 'January 2024 – March 2025',
      description: 'Led the student association representing 1,000+ students in academic and extracurricular initiatives. Organized events, managed budgets, and fostered partnerships with universities and sponsors.',
      type: 'leadership'
    },
    { 
      company: 'BMCE GROUP', 
      role: 'Software Research Intern', 
      period: 'June 2023 – August 2023',
      description: 'Gained hands-on experience in document digitization and data management.',
      type: 'internship'
    },
  ];

  const education = [
    {
      institution: 'National School of Applied Sciences',
      degree: 'Engineering degree in Computer Science',
      period: '2020 – In progress',
      type: 'education'
    },
    {
      institution: 'UM6P – 1337 MED',
      degree: 'Digital Technology Architect',
      period: '2022 – 2025',
      type: 'education'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Experience & Education</h2>
      
      {/* Professional Experience */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b border-slate-600/30 pb-2">Professional Experience</h3>
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="p-6 rounded-xl border border-slate-600/30 bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                  exp.type === 'internship' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg text-foreground">{exp.role}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      exp.type === 'internship' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {exp.type === 'internship' ? 'INTERNSHIP' : 'LEADERSHIP'}
                    </span>
                  </div>
                  <p className="text-blue-400 font-medium mb-2">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-3">{exp.period}</p>
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b border-slate-600/30 pb-2">Education</h3>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="p-6 rounded-xl border border-slate-600/30 bg-gradient-to-r from-green-500/5 to-blue-500/5 hover:from-green-500/10 hover:to-blue-500/10 transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-foreground mb-1">{edu.degree}</h4>
                  <p className="text-green-400 font-medium mb-2">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.period}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/30">
        <h3 className="text-xl font-semibold text-foreground mb-4">Languages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-foreground">Arabic - Native</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-foreground">French - Professional proficiency</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-foreground">English - Professional proficiency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactApp = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Get In Touch</h2>
    
    {/* Contact Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/30">
        <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">medbelouarraq@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-foreground font-medium">+212688191812</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-foreground font-medium">Morocco</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-400/30">
        <h3 className="text-lg font-semibold text-foreground mb-4">Social Links</h3>
        <div className="space-y-3">
          <a href="https://github.com/mbelouar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors group">
            <Github className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            <div>
              <p className="text-sm text-muted-foreground">GitHub</p>
              <p className="text-foreground font-medium">mbelouar</p>
            </div>
          </a>
          <a href="https://linkedin.com/in/mohammed-bel-ouaraq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors group">
            <Linkedin className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <div>
              <p className="text-sm text-muted-foreground">LinkedIn</p>
              <p className="text-foreground font-medium">MOHAMMED BEL OUARRAQ</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    {/* Contact Form */}
    <div className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30">
      <h3 className="text-lg font-semibold text-foreground mb-4">Send me a message</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors text-foreground placeholder-slate-400"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors text-foreground placeholder-slate-400"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors text-foreground placeholder-slate-400"
            placeholder="What's this about?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Message</label>
          <textarea
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors text-foreground placeholder-slate-400 resize-none"
            rows={4}
            placeholder="Tell me about your project or just say hello!"
          />
        </div>
        <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
          Send Message
        </button>
      </form>
    </div>
  </div>
);

const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([
    'Welcome to Mohammed\'s Portfolio Terminal! 🚀',
    'Type "help" to see available commands.',
    ''
  ]);

  const handleCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let response = '';

    switch (command) {
      case 'help':
        response = 'Available commands: about, projects, skills, experience, contact, education, clear';
        break;
      case 'about':
        response = 'Final-year Computer Engineering Student & DevOps & Cloud enthusiast from Morocco';
        break;
      case 'projects':
        response = 'SecureAuth (IAM Platform), IoT K8s Orchestration, Transendence Gaming Platform, Inception Container System, NestTools Rental Platform';
        break;
      case 'skills':
        response = 'Kubernetes, Docker, Terraform, CI/CD, Python, C/C++, Django, React, Git/GitHub, Linux/Unix, MySQL, MongoDB';
        break;
      case 'experience':
        response = 'DevOps & IAM Intern at E2IP TECHNOLOGIES, President at ADE Student Association, Software Research Intern at BMCE GROUP';
        break;
      case 'contact':
        response = 'Email: medbelouarraq@gmail.com | Phone: +212688191812 | GitHub: mbelouar | LinkedIn: MOHAMMED BEL OUARRAQ';
        break;
      case 'education':
        response = 'National School of Applied Sciences (Computer Engineering) & UM6P – 1337 MED (Digital Technology Architect)';
        break;
      case 'certifications':
        response = 'KCNA (Kubernetes and Cloud Native Associate) - Linux Foundation, Docker Foundations Professional Certificate - Docker Inc';
        break;
      case 'languages':
        response = 'Arabic (Native), French (Professional), English (Professional)';
        break;
      case 'whoami':
        response = 'BEL OUARRAQ MOHAMMED - Computer Engineering Student & DevOps Enthusiast';
        break;
      case 'pwd':
        response = '/home/mohammed/portfolio';
        break;
      case 'ls':
        response = 'about.txt  projects/  skills/  experience/  contact/  education/  certifications/';
        break;
      case 'clear':
        setOutput(['Terminal cleared. Type "help" for commands.']);
        return;
      default:
        response = `Command not found: ${cmd}. Type "help" for available commands.`;
    }

    setOutput([...output, `mohammed@portfolio:~$ ${cmd}`, response, '']);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Terminal</h2>
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-green-400 p-6 rounded-xl font-mono text-sm min-h-[400px] border border-slate-700/50 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-400 text-xs ml-4">mohammed@portfolio:~/portfolio</span>
        </div>
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {output.map((line, index) => (
            <div key={index} className={line.startsWith('mohammed@') ? 'text-blue-400' : 'text-green-400'}>
              {line}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-blue-400">mohammed@portfolio:~$</span>
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
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            autoFocus
            placeholder="Type a command..."
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
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <div
      ref={dockRef}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-slate-800/75 border border-white/15 rounded-2xl p-2 shadow-2xl flex gap-2 z-50"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {apps.map((app, index) => {
        const distance = mouseX !== null ? Math.abs(mouseX - (index * 72 + 36)) : 100;
        const scale = mouseX !== null ? Math.max(1, 1.5 - distance / 200) : 1;

        return (
          <div
            key={app.id}
            className="relative cursor-pointer flex flex-col items-center"
            onClick={() => onAppClick(app.id)}
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <img
              src={app.icon}
              alt={app.name}
              className="w-14 h-14 object-contain"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
            />
            {openApps.includes(app.id) && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white/80" />
            )}
          </div>
        );
      })}
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
    if (!openWindows.includes(appId)) {
      setOpenWindows([...openWindows, appId]);
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
      {/* Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

      {/* Menu Bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-slate-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 text-white text-sm z-40">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Portfolio</span>
          <span className="text-slate-400">File</span>
          <span className="text-slate-400">Edit</span>
          <span className="text-slate-400">View</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">{time}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              BEL OUARRAQ MOHAMMED
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-slate-300 font-light">
            Final-year Computer Engineering Student
          </p>
          <p className="text-lg text-blue-400 font-medium mt-2">
            DevOps & Cloud Enthusiast
          </p>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl text-slate-300 text-center mb-12 max-w-3xl leading-relaxed"
        >
          Welcome to my interactive portfolio! Click on the apps in the dock below to explore my 
          <span className="text-blue-400 font-medium"> academic projects</span>, 
          <span className="text-purple-400 font-medium"> technical skills</span>, 
          <span className="text-green-400 font-medium"> professional experience</span>, and more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="text-slate-400 text-sm animate-pulse">
            ↓ Open apps from the dock ↓
          </div>
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              Kubernetes
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
              Docker
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
              CI/CD
            </span>
          </div>
        </motion.div>
      </div>

      {/* Windows */}
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
