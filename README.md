# macOS-Style Interactive Portfolio

A stunning, interactive portfolio website designed to look and feel like a real macOS desktop environment. Built with Next.js, TypeScript, and Framer Motion.

## 🌟 Features

- **macOS-Inspired Design**: Authentic macOS look with glassmorphism effects, realistic shadows, and smooth animations
- **Interactive Desktop**: Draggable and resizable windows, functional dock, and menu bar
- **Portfolio Apps**:
  - 👤 About Me - Personal information and system details
  - 💼 Projects - Showcase of work with interactive cards
  - ⚙️ Skills - Interactive skill visualization with progress bars
  - 🏢 Experience - Timeline view of work history
  - ✉️ Contact - Contact form and social links
  - 🖥️ Terminal - Interactive CLI experience
- **Responsive Design**: Works beautifully on all devices
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Port
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Customization

### Personal Information

Update the following files with your personal information:

1. **About Me App** (`src/components/apps/AboutApp.tsx`):

   - Replace placeholder name, role, and bio
   - Update system information
   - Modify interests and hobbies

2. **Projects App** (`src/components/apps/ProjectsApp.tsx`):

   - Add your actual projects
   - Update project descriptions, technologies, and links
   - Replace placeholder images with project screenshots

3. **Skills App** (`src/components/apps/SkillsApp.tsx`):

   - Update skill levels and categories
   - Add or remove technologies
   - Modify learning goals

4. **Experience App** (`src/components/apps/ExperienceApp.tsx`):

   - Replace with your work experience
   - Update company names, positions, and descriptions
   - Modify education section

5. **Contact App** (`src/components/apps/ContactApp.tsx`):

   - Update contact information
   - Replace social media links
   - Modify availability status

6. **Terminal App** (`src/components/apps/TerminalApp.tsx`):
   - Customize command responses
   - Add new commands if desired
   - Update personal information in responses

### Styling

- **Colors**: Modify the color palette in `tailwind.config.ts`
- **Fonts**: Update font imports in `src/app/globals.css`
- **Animations**: Adjust animation timings in component files

### App Configuration

Modify `src/utils/appsConfig.ts` to:

- Change app icons
- Adjust default window sizes and positions
- Add or remove apps

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🛠️ Built With

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Interactions**: React Draggable, React Resizable

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📞 Support

If you have any questions or need help customizing the portfolio, feel free to reach out!

---

**Made with ❤️ and lots of ☕**
