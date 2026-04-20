# AWN - عون 🌟
### A Premium, Minimalist Platform for Purposeful Volunteering
**منصة عون - للعمل التطوعي المتكامل والأثر المستدام**

---

## 📖 Overview | نظرة عامة

**AWN (عون)** is more than just a volunteer platform; it’s a premium, high-impact ecosystem designed to bridge the gap between passionate volunteers and impactful organizations. Built with a minimalist, state-of-the-art aesthetic, AWN focuses on creating a seamless, professional experience for both individuals and companies.

**عون** هي أكثر من مجرد منصة للتطوع؛ إنها منظومة متكاملة مصممة لسد الفجوة بين المتطوعين المتحمسين والمؤسسات المؤثرة. تم بناء "عون" بهوية بصرية راقية وبسيطة، تركز على تقديم تجربة احترافية وسلسة لكل من المتطوعين والشركات.

---

## ✨ Key Features | المميزات الرئيسية

### 🧑‍💻 For Volunteers | للمتطوعين
- **Bento UI Profile**: A premium, grid-based profile that showcases skills, achievements, and recent activity at a glance.
- **Smart Subscription System**: Multiple tiers (PRO, ELITE) with dynamic billing (Monthly/Annual) and smart upgrade paths.
- **Wallet & Funds**: A centralized wallet system to manage rewards, deposits, and financial transactions.
- **Verified Reviews**: Earn credit and build your reputation through verified ratings from organizations.
- **Localization**: Full support for Arabic and English with a perfectly adapted RTL/LTR layout.

### 🏢 For Companies | للشركات
- **Opportunity Management**: Create and manage impact-driven volunteering events with a professional interface.
- **Applicant Tracking**: Efficiently review and manage volunteer applications through a streamlined dashboard.
- **Dynamic Analytics**: Real-time insights into volunteer impact, event success, and engagement metrics.
- **Rating System**: Provide valuable feedback to volunteers and build a trusted community.

---

## 🛠️ Tech Stack | التقنيات المستخدمة

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: Lucide React & FontAwesome 6
- **UI Components**: SweetAlert2, Glassmorphism design tokens, Custom Mesh Gradients.

---

## 📁 Project Structure | هيكل المشروع

```text
awn-frontend/
├── app/                  # Next.js App Router root
│   ├── (protectedLayout) # Role-based layouts (Volunteer/Company/Admin)
│   ├── Context/          # Global state management
│   ├── Hooks/            # Custom reusable logic (Theme, Lang, etc.)
│   ├── components/       # Reusable UI components
│   ├── translations/     # Localization dictionary (AR/EN)
│   └── utils/            # API wrappers and helper functions
├── public/               # Static assets & branding
└── postcss.config.mjs    # Modern CSS processing
```

---

## 🚀 Getting Started | نظام البدء

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/awn-frontend.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env.local` file and add your backend API URL:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

---

## 🎨 Design Philosophy | فلسفة التصميم

AWN follows a **Premium Minimalist** approach. Every pixel is crafted to reduce cognitive load while maintaining a high-end feel. 
- **Atmospheric UI**: Using mesh gradients and blur effects (Glassmorphism).
- **Responsive & Alive**: Interactive elements with micro-animations for a fluid user experience.
- **Accessibility First**: Semantic HTML and intuitive navigation.

تعمل منصة عون وفق فلسفة الـ **Premium Minimalist**. تم تصميم كل عنصر بعناية لتقليل التشتت البصري مع الحفاظ على طابع الفخامة. استخدام التدرجات اللونية العصرية (Mesh Gradients) وتأثيرات الزجاج (Glassmorphism) تجعل الواجهة تبدو حية ومتفاعلة.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**AWN - Empovering Impact, One Volunteer at a Time.**
**عون - تمكين الأثر، متطوعًا تلو الآخر.**
