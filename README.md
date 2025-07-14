# FootballZone.bg - Frontend

Образователна футболна платформа за играчи, треньори и родители.

## 🚀 Технологии

- **Next.js 14** - React framework с App Router
- **TypeScript** - Типизиран JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Достъпни React компоненти
- **Framer Motion** - Анимации
- **React Hook Form + Zod** - Форми и валидация
- **Lucide React** - Икони

## 📁 Структура на проекта

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Основен layout
│   ├── page.tsx           # Начална страница
│   ├── read/              # Read Zone страници
│   ├── coach/             # Coach Zone страници
│   ├── player/            # Player Zone страници
│   └── parent/            # Parent Zone страници
├── components/            # React компоненти
│   ├── layout/           # Layout компоненти
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/               # UI компоненти
│   │   ├── Button.tsx
│   │   └── ArticleCard.tsx
│   └── zones/            # Zone специфични компоненти
│       └── ZoneCard.tsx
├── lib/                  # Utility функции
│   └── utils.ts
└── types/                # TypeScript типове
    └── index.ts
```

## 🎯 Функционалности

### ✅ Имплементирани
- [x] Responsive дизайн
- [x] Навигация с мобилно меню
- [x] Hero секции за всяка зона
- [x] Карти за статии и зони
- [x] Филтри и търсене (UI)
- [x] Премиум съдържание индикатори
- [x] SEO оптимизация

### 🚧 В процес на разработка
- [ ] Потребителска автентикация
- [ ] Stripe интеграция за плащания
- [ ] CMS интеграция
- [ ] Видео плеър
- [ ] Коментари система
- [ ] Админ панел

## 🏃‍♂️ Стартиране на проекта

### Предварителни изисквания
- Node.js 18+ 
- npm или yarn

### Инсталация
```bash
# Клониране на репозиторията
git clone <repository-url>
cd football-zone-frontend

# Инсталиране на зависимости
npm install

# Стартиране на development сървъра
npm run dev
```

Приложението ще бъде достъпно на `http://localhost:3000`

### Други команди
```bash
# Build за production
npm run build

# Стартиране на production build
npm start

# Линт проверка
npm run lint

# TypeScript проверка
npm run type-check
```

## 🎨 Дизайн система

### Цветове
- **Primary**: Green (600-800) - за основни действия
- **Secondary**: Blue (600-700) - за Read Zone
- **Accent**: Purple (500) - за Player Zone
- **Warning**: Orange (500) - за Parent Zone

### Типография
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, различни размери
- **Body**: Regular, 16px base

### Компоненти
- **Button**: Различни варианти (default, outline, ghost)
- **Card**: За статии и зони
- **Header**: Responsive навигация
- **Footer**: Линкове и социални мрежи

## 📱 Responsive дизайн

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔒 Премиум съдържание

Системата поддържа:
- Индикатори за премиум съдържание
- Защитени зони
- Абонамент планове
- Роля базиран достъп

## 🚀 Следващи стъпки

### Phase 1: Backend API
- [ ] Node.js + Express сървър
- [ ] Prisma ORM за PostgreSQL
- [ ] MongoDB за съдържание
- [ ] JWT автентикация

### Phase 2: Интеграции
- [ ] Stripe за плащания
- [ ] Vimeo/YouTube API за видео
- [ ] Email маркетинг (MailerLite)
- [ ] Google Analytics

### Phase 3: Допълнителни функции
- [ ] Реално време уведомления
- [ ] Мобилно приложение
- [ ] AI персонализация
- [ ] Социални функции

## 🤝 Принос

1. Fork проекта
2. Създайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit промените (`git commit -m 'Add amazing feature'`)
4. Push към branch (`git push origin feature/amazing-feature`)
5. Отворете Pull Request

## 📄 Лиценз

Този проект е под MIT лиценз.

## 📞 Контакти

- **Email**: info@footballzone.bg
- **Website**: https://footballzone.bg
- **GitHub**: [repository-url]

---

Създадено с ❤️ за българския футбол
