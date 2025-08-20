# Mayur Dhavan - Portfolio

My personal portfolio website showcasing my projects, skills, and professional experience.

## 🚀 Features

- Responsive design optimized for all device sizes
- Server-side rendering for improved performance and SEO
- Interactive UI components with modern design
- Contact form with serverless API integration
- Newsletter subscription via Mailchimp integration
- Progressive Web App (PWA) capabilities

## 🛠️ Technology Stack

### Core
- **Framework**: Next.js
- **Languages**: 
  - JavaScript (65.4%)
  - TypeScript (17.5%)
  - CSS (17.1%)
- **Styling**: TailwindCSS with PostCSS
- **Deployment**: Netlify/Vercel

### Key Technologies
- **Frontend**: React.js with Next.js
- **Type Safety**: TypeScript
- **API**: Serverless functions (Next.js API routes)
- **External Integrations**: Mailchimp for newsletter
- **Performance Optimization**: Server-side rendering, static site generation
- **Developer Experience**: Modern ES6+, React Hooks

## 📦 Installation

Clone the repository:
```bash
git clone https://github.com/mayur-dhavan/mayur-portfolio.git
cd mayur-portfolio
```

Install dependencies:
```bash
npm install
```

## 🖥️ Usage

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 📂 Project Structure

```
mayur-portfolio/
├── .next/                    # Next.js build output
├── pages/                    # Next.js pages
│   ├── _app.tsx              # Custom App component
│   ├── _document.tsx         # Custom Document component
│   ├── index.tsx             # Homepage
│   └── api/                  # API routes
│       └── contact.ts        # Contact form handler
├── public/                   # Static assets
│   ├── assets/               # Images, fonts, etc.
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt            # SEO robots file
│   ├── sitemap.xml           # SEO sitemap
│   └── webmanifest.json      # Web app manifest
├── src/
│   ├── components/           # React components
│   │   └── MailchimpForm.js  # Newsletter subscription component
│   ├── App.js                # Legacy CRA App component
│   ├── index.js              # Legacy CRA entry point
│   └── assets/               # Legacy assets
├── styles/
│   └── tailwind.css          # TailwindCSS styles
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── server.js                 # Custom server configuration
├── netlify.toml              # Netlify deployment configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

> Note: This project represents a transition from Create React App to Next.js, with some legacy code still present.

## 📸 Screenshot

![Portfolio Screenshot](https://raw.githubusercontent.com/mayur-dhavan/mayur-portfolio/master/image.png)

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop screens
- Tablets
- Mobile devices
- Various screen orientations

## ⚡ Performance

Optimized for performance with:
- Server-side rendering
- Static site generation where appropriate
- Code splitting
- Image optimization
- Efficient asset loading

## 🔒 Contact

You can reach me through:
- **Email**: mayurdhavan2244@gmail.com
- **LinkedIn**: [Mayur Dhavan](linkedin.com/in/mayur-dhavan-50902922b) 
- **GitHub**: [mayur-dhavan](https://github.com/mayur-dhavan)

## 🌐 Live Site

Visit my portfolio at: [https://mayur-dhavan.netlify.app](https://mayur-dhavan.netlify.app) <!-- Replace with your actual URL -->

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

_Last updated: 2025-08-20_
