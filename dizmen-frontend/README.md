# Dizmen - Digital Menu Platform

A modern, real-time digital menu solution for restaurants built with Next.js, TypeScript, and shadcn/ui.

## 🎯 Problem & Solution

**Problem:** Restaurants struggle with menu items that are unavailable at certain hours. Waiters repeatedly apologize for unavailable items, leading to customer frustration.

**Solution:** Dizmen provides a digital menu platform where restaurant authorities can instantly update availability, schedule items for specific hours, and give customers a QR code to view the live menu.

## ✨ Key Features

### For Restaurant Authorities
- 📝 **Menu Management**: Create and manage menu items with name, description, price, images, and categories
- ⏰ **Time-Based Scheduling**: Set specific time ranges when items are available (e.g., breakfast items 8-11 AM)
- 🔄 **Instant Updates**: Hide/show items instantly when ingredients run out
- 📱 **QR Code Generation**: Get a unique QR code for your restaurant that customers can scan
- 🏪 **Restaurant Profile**: Manage restaurant details and information

### For Customers
- 📲 **Easy Access**: Scan QR code to view menu instantly - no app download required
- 🔴 **Live Updates**: See only items that are currently available
- 🖼️ **Rich Content**: View high-quality food images and detailed descriptions
- ⭐ **Item Reviews**: Leave reviews for specific items (not the whole restaurant)
- 🕐 **Time Awareness**: See when time-limited items are available

### For Super Admin
- 📊 **Platform Overview**: Monitor total restaurants, menu items, reviews, and ratings
- 🏢 **Restaurant Management**: View all registered restaurants
- 💬 **Review Moderation**: Monitor customer feedback across the platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 User Roles & Access

### 1. Restaurant Authority (Owner/Manager)
- Access: `/dashboard`
- Login with role: "Restaurant Owner"
- Capabilities:
  - Manage restaurant information
  - Create/edit/delete menu items
  - Set item availability and time schedules
  - Download QR code for customer access

### 2. Customer
- Access: `/menu/[restaurantId]` (via QR code)
- No login required
- Capabilities:
  - View available menu items
  - See item details and images
  - Read reviews from other customers
  - Leave reviews for items

### 3. Super Admin
- Access: `/admin`
- Login with role: "Super Admin"
- Capabilities:
  - View platform statistics
  - Monitor all restaurants
  - Review customer feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **QR Codes**: react-qr-code
- **Form Handling**: React Hook Form + Zod
- **Date Handling**: date-fns

## 📂 Project Structure

\`\`\`
dizmen-frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Restaurant authority dashboard
│   ├── admin/                # Super admin dashboard
│   ├── menu/[restaurantId]/  # Customer-facing menu view
│   └── layout.tsx            # Root layout with auth provider
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── menu-items-manager.tsx
│   ├── restaurant-info.tsx
│   ├── qr-code-section.tsx
│   └── review-dialog.tsx
└── lib/
    ├── auth-context.tsx      # Authentication & user management
    ├── types.ts              # TypeScript type definitions
    ├── mock-data.ts          # Sample data
    └── helpers.ts            # Utility functions
\`\`\`

## 🎨 Key Features Explained

### Time-Based Scheduling
Menu items can be restricted to specific time ranges:
- Breakfast items: 8:00 AM - 11:00 AM
- Lunch specials: 11:00 AM - 3:00 PM
- Dinner items: 5:00 PM - 10:00 PM

Items automatically show/hide based on current time.

### Real-Time Availability
Restaurant authorities can instantly toggle item availability with a switch. When an ingredient runs out, hide the item with one click. Customers immediately see the updated menu.

### Item-Specific Reviews
Unlike traditional restaurant reviews, customers can review individual items. This provides:
- More specific feedback
- Better insights for menu improvements
- Helps other customers choose dishes
- Increases engagement

### QR Code Access
Each restaurant gets a unique QR code. Benefits:
- No app installation required
- Works on any smartphone
- Place on tables, posters, or menus
- Direct link to live menu

## 🔐 Authentication

Currently uses mock authentication for demonstration. In production, integrate with:
- Auth0
- Firebase Authentication
- NextAuth.js
- Clerk
- Or your preferred authentication provider

## 📝 Future Enhancements

- [ ] Backend API integration (currently using mock data)
- [ ] Image upload functionality
- [ ] Multi-language support
- [ ] Order management system
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Payment integration
- [ ] Multi-restaurant support for chains
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

## 🤝 Contributing

This is a demonstration project showcasing modern web development practices with Next.js and TypeScript.

## 📄 License

MIT License - feel free to use this project as a reference or starting point for your own digital menu solution.

## 🙋‍♂️ Support

For questions or issues, please create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**
