# UI Overhaul Plan - Campus Operation HUB

The goal is to transform the current inconsistent and "basic" UI into a premium, state-of-the-art experience using a unified design system.

## 1. Design System & Global Styles
- **Typography**: Switch to "Outfit" or "Inter" for a more modern, premium feel.
- **Color Palette**:
  - **Backgrounds**: Slate-900/950 (Dark), Slate-50 (Light)
  - **Primary**: Indigo-600/700
  - **Secondary**: Violet-500
  - **Accents**: Cyan-400 (for highlights)
- **Global CSS**: Update `index.css` with:
  - Custom scrollbars.
  - Glassmorphic utility classes.
  - Gradient text and border utilities.
  - Smooth transitions.

## 2. Core Layout & Navigation
- **Navbar**: Create a modern, semi-transparent sticky navbar with backdrop-blur.
- **Sidebar**: (If applicable for Dashboards) Implement a collapsible, sleek sidebar with professional icons.
- **Footer**: Refine the footer to be more professional and information-rich.

## 3. Page Redesigns
- **Landing Page**: 
  - Hero section with a stunning gradient background and animated assets.
  - Feature cards with hover effects and glassmorphism.
  - Clearer CTA (Call to Action) buttons.
- **Auth Pages (Login/Signup)**:
  - Clean, centered cards or split-screen layouts with professional illustrations/gradients.
  - Improved input styling with focus rings and clear error states.
- **Dashboard**:
  - Bento-grid style layout for widgets.
  - Consistent card styling.
  - Improved data visualization (if applicable).

## 4. Components Overhaul
- **Buttons**: Premium buttons with subtle shadows, gradients, and hover animations.
- **Cards**: Soft borders, subtle shadows, and hover elevation.
- **Modals**: Smooth animations and backdrop-blur.
- **Inputs**: Modern, minimalist styling with floating labels or clear placeholders.

## 5. Animation (Framer Motion)
- **Page Transitions**: Subtle fade-in and slide-up effects.
- **Hover States**: Scaling and brightness adjustments.
- **Loading States**: Skeletons or custom loaders that match the brand.

## Next Steps
1.  **Update `tailwind.config.cjs`** with the new color palette and design tokens.
2.  **Overhaul `index.css`** for global aesthetics.
3.  **Refine the `App.jsx`** layout structure.
4.  **Redesign the Landing and Auth pages** as they are the first impression.
5.  **Standardize Dashboard components**.
