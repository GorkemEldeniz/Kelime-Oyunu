# Kelime Oyunu (Word Game)

A modern, interactive word game built with Next.js and TypeScript. Test your vocabulary skills in this engaging Turkish word game!

## 🎮 About The Game

Kelime Oyunu is a Turkish word game where players need to guess words based on their definitions. The game features:

- Real-time feedback on guesses
- Score tracking and statistics
- User authentication
- Beautiful, responsive UI
- Dark/Light theme support

## 🚀 Technologies Used

- **Frontend Framework:**

  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Framer Motion (for animations)

- **Authentication & Security:**

  - NextAuth.js
  - bcryptjs
  - jose (for JWT handling)

- **Database:**

  - Prisma ORM
  - PostgreSQL

- **Form Handling & Validation:**

  - React Hook Form
  - Zod
  - Hookform Resolvers

- **UI Components:**
  - Radix UI
  - Lucide React (icons)
  - Sonner (toast notifications)
  - Next Themes

## 📁 Project Structure

```
src/
├── action/         # Server actions and API handlers
├── app/           # Next.js app router pages and layouts
├── components/    # Reusable React components
│   ├── auth/     # Authentication related components
│   ├── game/     # Game-specific components
│   └── ui/       # Common UI components
├── context/      # React context providers
├── constants/    # Application constants
├── helpers/      # Helper functions and utilities
├── lib/          # Library configurations and setup
│   └── validations/  # Zod validation schemas
├── types/        # TypeScript type definitions
└── middleware.ts # Next.js middleware configuration
```

## 🛠️ Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kelime-oyunu.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:

```bash
pnpm db:push
pnpm db:generate
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push database schema changes
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm seed` - Seed the database with game records

## 📞 Contact

For any questions or feedback, please reach out:

- **Developer**: Görkem Eldeniz
- **LinkedIn**: [LinkedIn Profile](https://www.linkedin.com/in/gorkemeldeniz/)
- **Email**: [Email](mailto:gorkemeldeniz30@gmail.com)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
