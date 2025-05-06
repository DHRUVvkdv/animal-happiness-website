# Animal Happiness Website

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Overview

The Animal Happiness Website provides a real-time dashboard for viewing and analyzing dairy cow affective state data collected from the Animal Happiness system. This frontend application displays cow interaction data, including response types (optimistic or pessimistic) and timestamps, enabling researchers and farm personnel to monitor animal welfare remotely.

## Features

- **Live Data Display**: Shows cow interactions with automatic 30-second refresh
- **Data Sorting**: Sort by any column (cow ID, response type, time, entry ID)
- **Pagination**: "Load More" functionality to view historical data
- **Visual Indicators**: Color-coded response types (green for optimistic, orange for pessimistic)
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Framework**: Next.js (React)
- **Hosting**: Vercel
- **Styling**: CSS Modules
- **API Integration**: Fetch API with environment-based configuration

## Getting Started

### Prerequisites

- Node.js (18.x or newer)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ahidvt/animal-happiness-website.git
   cd animal-happiness-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   NEXT_PUBLIC_API_URL=your_backend_api_url
   NEXT_PUBLIC_API_KEY=your_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Deployment

The website is automatically deployed to Vercel whenever changes are pushed to the main branch.

- **Current Team URL**: [https://animal-happiness-web.vercel.app/](https://animal-happiness-web.vercel.app/)

The following development URLs were used during Spring 2025 but are no longer maintained:

- [https://animal-happiness-website.vercel.app/](https://animal-happiness-website.vercel.app/)
- [https://animal-happiness-website.dhruvv.dev/](https://animal-happiness-website.dhruvv.dev/)

## Project Structure

- `src/app/page.js`: Main dashboard component
- `src/app/page.module.css`: Dashboard styling
- `src/app/globals.css`: Global styles
- `src/app/layout.js`: Layout wrapper

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Run production build locally
- `npm run lint`: Run ESLint checks

## Troubleshooting

- If data isn't loading, check that the backend API URL and key are correctly set in your `.env` file
- Verify network connectivity in browser developer tools
- Check browser console for JavaScript errors

## Contributors

Developed by Dhruv Varshney of the Animal Happiness Team at Virginia Tech as part of the Interdisciplinary Design Capstone (IDC) Spring 2025.

For questions, contact dhruvvarshney@vt.edu or message on LinkedIn: https://www.linkedin.com/in/dvar/
