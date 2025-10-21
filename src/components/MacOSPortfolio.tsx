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
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
    <div className="flex items-start gap-6">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
        MB
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-white mb-2">BEL OUARRAQ MOHAMMED</h3>
        <p className="text-lg text-slate-300 mb-4">Final-year Computer Engineering Student</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p><strong className="text-white">📍 Location:</strong> <span className="text-slate-300">Morocco</span></p>
            <p><strong className="text-white">📞 Phone:</strong> <span className="text-slate-300">+212 688 191 812</span></p>
            <p><strong className="text-white">📧 Email:</strong> <span className="text-slate-300">medbelouarraq@gmail.com</span></p>
          </div>
          <div className="space-y-2">
            <p><strong className="text-white">🎓 Education:</strong> <span className="text-slate-300">National School of Applied Sciences</span></p>
            <p><strong className="text-white">🏢 Institution:</strong> <span className="text-slate-300">UM6P - 1337 MED</span></p>
            <p><strong className="text-white">🌐 Languages:</strong> <span className="text-slate-300">Arabic (Native), French & English (Professional)</span></p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
      <h4 className="text-lg font-semibold text-white mb-3">Professional Profile</h4>
      <p className="text-slate-300 leading-relaxed">
        DevOps & Cloud enthusiast with a strong foundation in technology and programming, developed through hands-on training and projects. 
        Skilled in problem-solving, teamwork, and project management, and always eager to explore new tools and practices in the DevOps & Cloud ecosystem. 
        Open to internship opportunities to apply and expand my skills in real-world IT environments.
      </p>
    </div>
  </div>
);

const ProjectsApp = () => {
  const projects = [
    {
      name: 'SecureAuth - Final Year Project',
      description: 'Designed and implemented an Identity and Access Management (IAM) platform supporting SSO, MFA (TOTP, WebAuthn/FIDO), and identity lifecycle management, deployed with Kubernetes (Minikube, K3s), Docker, and Helm for scalability and resilience.',
      tech: 'Kubernetes, Docker, Helm, k3s, Terraform, Prometheus, Grafana, ArgoCD, CI/CD, Django, REST API',
      year: '2025',
      type: 'Final Year Project',
      status: 'Completed'
    },
    {
      name: 'IoT - Lightweight Kubernetes Orchestration',
      description: 'Demonstrated container orchestration using K3s with Vagrant and K3D with ArgoCD, creating and managing lightweight Kubernetes clusters across various environments, from multi-node setups to GitOps-driven CI/CD pipelines.',
      tech: 'K8s, k3s, k3d, Vagrant, Docker, CI/CD, ArgoCD, Scripting',
      year: '2024',
      type: 'Academic Project',
      status: 'Completed'
    },
    {
      name: 'Transendence - Multiplayer Gaming Platform',
      description: 'Developed a web application for a multiplayer gaming platform featuring user management, blockchain score storage, and AI opponents. Implemented cybersecurity measures, including two-factor authentication and GDPR compliance.',
      tech: 'HTML, CSS, Bootstrap, JavaScript, ThreeJS, Django, Docker, Microservices, CI/CD, PostgreSQL',
      year: '2024',
      type: 'Academic Project',
      status: 'Completed'
    },
    {
      name: 'Inception - Containerized Multi-Service System',
      description: 'Designed and implemented a secure, multi-service system using Docker containers for Nginx, WordPress, and MariaDB, orchestrated with Docker Compose. Ensured service isolation, seamless communication, and security.',
      tech: 'Docker, Docker Compose, Nginx, WordPress, MariaDB, Linux',
      year: '2023',
      type: 'Academic Project',
      status: 'Completed'
    },
    {
      name: 'NestTools - Community Tool-Rental Platform',
      description: 'Developed a full-stack web application that connects DIY enthusiasts with local tool owners, enabling users to rent tools at a fraction of the purchase cost. Promotes cost-effective and sustainable access to equipment.',
      tech: 'React, Next.js, Tailwind CSS, TypeScript, Laravel, Docker, Docker Compose',
      year: '2023',
      type: 'Academic Project',
      status: 'Completed'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Academic Projects</h2>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="group p-6 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white group-hover:text-violet-400 transition-colors">
                    {project.name}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-violet-500/20 text-violet-300 rounded-full">
                    {project.type}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{project.year} • {project.status}</p>
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-4">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {project.tech.split(', ').map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-3 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-full border border-slate-600 hover:border-violet-500 hover:text-violet-300 transition-colors"
                >
                  {tech}
                </span>
              ))}
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
      category: 'DevOps & Cloud Tools',
      skills: [
        { name: 'Kubernetes', level: 90 },
        { name: 'Docker', level: 95 },
        { name: 'Terraform', level: 85 },
        { name: 'ArgoCD', level: 80 },
        { name: 'Prometheus', level: 85 },
        { name: 'Grafana', level: 80 },
        { name: 'CI/CD', level: 90 },
        { name: 'Helm', level: 75 },
        { name: 'Vagrant', level: 70 },
        { name: 'Linux/Unix', level: 90 }
      ]
    },
    {
      category: 'Programming Languages',
      skills: [
        { name: 'Python', level: 90 },
        { name: 'C/C++', level: 85 },
        { name: 'JavaScript', level: 80 },
        { name: 'TypeScript', level: 75 },
        { name: 'Bash Scripting', level: 85 }
      ]
    },
    {
      category: 'Frameworks & Databases',
      skills: [
        { name: 'Django', level: 90 },
        { name: 'React', level: 80 },
        { name: 'Next.js', level: 75 },
        { name: 'MySQL', level: 85 },
        { name: 'MongoDB', level: 80 },
        { name: 'PostgreSQL', level: 85 }
      ]
    },
    {
      category: 'Tools & Technologies',
      skills: [
        { name: 'Git/GitHub', level: 95 },
        { name: 'Docker Compose', level: 90 },
        { name: 'k3s/k3d', level: 85 },
        { name: 'Nginx', level: 80 },
        { name: 'WordPress', level: 75 },
        { name: 'MariaDB', level: 80 }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white mb-6">Technical Skills</h2>
      
      {skillCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">
            {category.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">{skill.name}</span>
                  <span className="text-sm text-slate-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-3">Languages</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🇲🇦</div>
            <p className="text-white font-medium">Arabic</p>
            <p className="text-slate-400 text-sm">Native</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🇫🇷</div>
            <p className="text-white font-medium">French</p>
            <p className="text-slate-400 text-sm">Professional</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🇬🇧</div>
            <p className="text-white font-medium">English</p>
            <p className="text-slate-400 text-sm">Professional</p>
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
      period: 'July 2025 - September 2025',
      type: 'Internship',
      description: 'Assisted in deploying and maintaining cloud-native IAM solutions. Automated CI/CD pipelines and monitored system performance with Kubernetes, Docker, and Prometheus.',
      technologies: ['Kubernetes', 'Docker', 'Prometheus', 'CI/CD', 'IAM Solutions'],
      icon: '🏢'
    },
    {
      company: 'ADE (Student Association)',
      role: 'President',
      period: 'January 2024 - March 2025',
      type: 'Leadership',
      description: 'Led the student association representing 1,000+ students in academic and extracurricular initiatives. Organized events, managed budgets, and fostered partnerships with universities and sponsors.',
      technologies: ['Leadership', 'Project Management', 'Event Organization', 'Budget Management'],
      icon: '👥'
    },
    {
      company: 'BMCE GROUP',
      role: 'Software Research Intern',
      period: 'June 2023 - August 2023',
      type: 'Internship',
      description: 'Gained hands-on experience in document digitization and data management. Worked on software research projects and contributed to digital transformation initiatives.',
      technologies: ['Document Digitization', 'Data Management', 'Software Research'],
      icon: '🔬'
    },
    {
      company: 'National School of Applied Sciences',
      role: 'Computer Engineering Student',
      period: '2020 - In Progress',
      type: 'Education',
      description: 'Pursuing Engineering degree in Computer Science with focus on DevOps, Cloud Computing, and Software Development. Maintaining strong academic performance while engaging in practical projects.',
      technologies: ['Computer Science', 'Engineering', 'Academic Projects', 'Research'],
      icon: '🎓'
    },
    {
      company: 'UM6P - 1337 MED',
      role: 'Digital Technology Architect',
      period: '2022 - 2025',
      type: 'Specialized Program',
      description: 'Enrolled in specialized program focusing on digital technology architecture, advanced programming, and modern software development practices.',
      technologies: ['Digital Architecture', 'Advanced Programming', 'Software Development'],
      icon: '🏛️'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Professional Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="group p-6 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xl flex-shrink-0">
                {exp.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-violet-400 transition-colors mb-1">
                      {exp.role}
                    </h3>
                    <p className="text-lg text-slate-300 font-medium">{exp.company}</p>
                    <p className="text-sm text-slate-400">{exp.period}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-violet-500/20 text-violet-300 rounded-full">
                    {exp.type}
                  </span>
                </div>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  {exp.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-full border border-slate-600 hover:border-violet-500 hover:text-violet-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CertificationsApp = () => {
  const certifications = [
    {
      name: 'Kubernetes and Cloud Native Associate (KCNA)',
      issuer: 'The Linux Foundation',
      issued: 'September 2025',
      description: 'Comprehensive certification covering Kubernetes fundamentals, cloud-native concepts, and container orchestration.',
      skills: ['Kubernetes', 'Cloud Native', 'Container Orchestration', 'DevOps'],
      icon: '☸️'
    },
    {
      name: 'Docker Foundations Professional Certificate',
      issuer: 'Docker, Inc',
      issued: 'June 2025',
      description: 'Professional certification demonstrating expertise in Docker containerization, image management, and container orchestration.',
      skills: ['Docker', 'Containerization', 'Image Management', 'Container Orchestration'],
      icon: '🐳'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Certifications</h2>
      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div key={index} className="group p-6 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl flex-shrink-0">
                {cert.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-violet-400 transition-colors mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-lg text-slate-300 font-medium">{cert.issuer}</p>
                    <p className="text-sm text-slate-400">Issued: {cert.issued}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full">
                    Verified
                  </span>
                </div>
                
                <p className="text-slate-300 leading-relaxed mb-4">
                  {cert.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-full border border-slate-600 hover:border-violet-500 hover:text-violet-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-3">Certification Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="space-y-2">
            <p>✅ Industry-recognized credentials</p>
            <p>✅ Validated technical expertise</p>
            <p>✅ Enhanced professional credibility</p>
          </div>
          <div className="space-y-2">
            <p>✅ Up-to-date with latest technologies</p>
            <p>✅ Competitive advantage in job market</p>
            <p>✅ Continuous learning commitment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactApp = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
    
    {/* Contact Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              📞
            </div>
            <div>
              <p className="text-white font-medium">Phone</p>
              <p className="text-slate-300">+212 688 191 812</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              📧
            </div>
            <div>
              <p className="text-white font-medium">Email</p>
              <p className="text-slate-300">medbelouarraq@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              📍
            </div>
            <div>
              <p className="text-white font-medium">Location</p>
              <p className="text-slate-300">Morocco</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">Social Links</h3>
        <div className="space-y-3">
          <a 
            href="https://linkedin.com/in/mohammed-bel-ouarraq" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group"
          >
            <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            <div>
              <p className="text-white font-medium">LinkedIn</p>
              <p className="text-slate-300 text-sm">MOHAMMED BEL OUARRAQ</p>
            </div>
          </a>
          <a 
            href="https://github.com/mbelouar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group"
          >
            <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
            <div>
              <p className="text-white font-medium">GitHub</p>
              <p className="text-slate-300 text-sm">@mbelouar</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    {/* Contact Form */}
    <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-4">Send Message</h3>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-slate-400"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-slate-400"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Subject</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-slate-400"
            placeholder="What's this about?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Message</label>
          <textarea
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-slate-400"
            rows={4}
            placeholder="Your message..."
          />
        </div>
        <button 
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Send Message
        </button>
      </form>
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
    { id: 'certifications', name: 'Certifications', icon: 'https://cdn.jim-nielsen.com/macos/1024/certificate-2021-04-29.png?rf=1024' },
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
      case 'certifications': return <CertificationsApp />;
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
          Final-year Computer Engineering Student & DevOps Enthusiast<br />
          Specialized in Kubernetes, Docker, and Cloud Infrastructure
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
