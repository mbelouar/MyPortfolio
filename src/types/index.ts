// Types for MacOS Portfolio
export interface DockApp {
  id: string;
  name: string;
  icon: string;
  component?: React.ComponentType<any>;
}

export interface WindowProps {
  id: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
}

export interface Project {
  id: string;
  name: string;
  tech: string;
  year: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}
