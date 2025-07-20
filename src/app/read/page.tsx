'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/ui/BlogCard'
import BlogSidebar from '@/components/ui/BlogSidebar'
import SearchAndCategories from '@/components/ui/SearchAndCategories'
import { Article } from '@/types'

// Примерни статии за Read Zone
const readArticles: Article[] = [
  {
    id: '0',
    title: 'Футболна философия на Антонио Конте: Дисциплина, Идентичност, Интензитет',
    slug: 'filosofiya-antonio-conte-distsiplina-identichnost-intenzitet',
    excerpt: 'Открийте какви са треньорските принципи на Антонио Конте – интензитет, дисциплина и тактическа идентичност. Научете как да приложите неговата философия в своя отбор.',
    content: `
      <p>Знаете ли, че Антонио Конте кара играчите си да правят до 4 тренировки на ден в предсезонната подготовка? Това не е каприз, а отражение на философията му – безусловна отдаденост, контрол и интензивност във всичко.</p>

      <p>За много треньори Конте е вдъхновение, но и предизвикателство. Той съчетава военна дисциплина с модерна тактическа яснота, което го прави уникален в съвременния футбол. Какво го прави толкова ефективен?</p>

      <p>В тази статия ще разкрием основните елементи от неговата философия – тези, които оформят начина, по който води отборите си към успех.</p>

      <h2>🔥 Принцип 1: Всичко започва с интензитет</h2>
      
      <blockquote>"Ако не можеш да тичаш, не можеш да играеш за мен" – една от най-често цитираните реплики на Конте.</blockquote>
      
      <p>За него интензитетът не е резултат от добрата форма, а от менталната нагласа. На тренировка се тренира така, както се играе.</p>

      <ul>
        <li>Във всяка сесия се изисква максимална ангажираност</li>
        <li>Без значение дали е пас, спринт или тактическо разиграване – всичко се прави на 100%</li>
        <li>Конте често използва "бутане до ръба", за да формира характер и издръжливост</li>
      </ul>

      <p><strong>📌 Съвет за треньори:</strong> Задайте темпо на всяка тренировка. Въведете вътрешно състезание. Не позволявайте на играчите да "пестят сили".</p>

      <h2>🧭 Принцип 2: Колективна идентичност</h2>
      
      <blockquote>"Играчите не са индивидуалности. Те са елементи на един механизъм" – Конте вярва в тактическата идентичност.</blockquote>
      
      <p>Всеки играч има ясно дефинирана роля, а целият отбор действа в синхрон.</p>

      <ul>
        <li>Всички знаят кога да пресират, кога да се оттеглят, как да покриват</li>
        <li>Независимо от схемата (3-5-2, 3-4-3), идентичността остава</li>
        <li>По думите на Лукаку: "Все едно играеш шах, но с тяло."</li>
      </ul>

      <p><strong>📌 Съвет за треньори:</strong> Работете с термини като "автоматизми", "тригери", "ротации". Повтаряйте движенията до съвършенство.</p>

      <h2>⛓ Принцип 3: Желязна дисциплина</h2>
      
      <p>Конте не допуска компромис. Той поставя рамки още в първите дни:</p>

      <ul>
        <li><strong>Стриктен режим</strong> – спане, хранене, тренировки</li>
        <li><strong>Лична отговорност</strong> – няма извинения</li>
        <li><strong>Йерархия и уважение</strong> – всеки знае мястото си</li>
      </ul>

      <blockquote>"Тренирам главите на играчите, преди краката им" – подчертава Конте.</blockquote>
      
      <p>За него психологията е също толкова важна, колкото физиката.</p>

      <p><strong>📌 Съвет за треньори:</strong> Изградете култура. Установете правила. Бъдете пример.</p>

      <h2>📣 Заключение</h2>
      
      <p>Както видяхме, философията на Антонио Конте не е просто тактика – тя е цялостна система на интензитет, дисциплина и яснота, която се прилага във всеки детайл на тренировъчния процес и управлението на отбора.</p>

      <p><strong>Той не просто тренира футболисти – той ги трансформира.</strong></p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-bold text-green-800 mb-3">🚀 Искаш ли достъп до премиум съдържание?</h3>
        <p className="text-green-700 mb-4">
          Получи достъп до тренировъчни планове, упражнения и анализи, вдъхновени от Конте в <strong>Coach Zone</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Абонирай се сега
          </button>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Регистрирай се безплатно
          </button>
        </div>
      </div>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop',
    author: { name: 'Спортен Анализатор', avatar: '/avatars/analyst.jpg' },
    category: 'tactics',
    tags: ['Конте', 'Философия', 'Лидерство', 'Тренировки', 'Дисциплина'],
    publishedAt: new Date('2024-11-26'),
    readTime: 6,
    isPremium: false,
  },
  {
    id: '1', 
    title: 'Предсезонната подготовка на Антонио Конте – Структура, цели и натоварване',
    slug: 'preseason-conte-structure',
    excerpt: 'Разбери как Антонио Конте структурира своята подготовка – физическо натоварване, тактически блокове и военна дисциплина. При Конте е като в армията – спиш, ядеш и тренираш.',
    content: `
      <p>При Конте е като в армията – спиш, ядеш и тренираш. Как да структурираме подготовка, която изгражда тяло, тактика и дух?</p>

      <p>Ще разгледаме макроцикъл, дневна структура и методи, които използва Конте.</p>

      <h2>📅 Макроцикъл: От натоварване към автоматизъм</h2>
      
      <h3>Фаза 1 – Физическа доминация (Седмици 1-2)</h3>
      <ul>
        <li>Интервални бягания</li>
        <li>Упражнения без топка</li>
        <li>Изграждане на основа</li>
      </ul>

      <h3>Фаза 2 – Въвеждане на тактически структури (Седмици 3-4)</h3>
      <ul>
        <li>Build-up упражнения</li>
        <li>11v11 тренировки</li>
        <li>Изграждане на автоматизми</li>
      </ul>

      <h3>Фаза 3 – Игрови ритъм и интензитет (Седмици 5-6)</h3>
      <ul>
        <li>Контролни срещи</li>
        <li>Активно възстановяване</li>
        <li>Финализиране на подготовката</li>
      </ul>

      <h2>⏰ Типичен ден в подготовката</h2>
      
      <ul>
        <li><strong>07:30</strong> – Закуска и анализ</li>
        <li><strong>09:00</strong> – Физическа тренировка</li>
        <li><strong>15:30</strong> – Тактическа сесия</li>
        <li><strong>19:00</strong> – Видео и разбор</li>
      </ul>

      <h2>💪 Методи и психология</h2>
      
      <h3>Тренировъчни методи:</h3>
      <ul>
        <li>Pyramid running</li>
        <li>4x4 интервали</li>
        <li>11v0 build-up</li>
      </ul>

      <blockquote>"Моите отбори трябва да страдат заедно, за да побеждават заедно" – Антонио Конте</blockquote>
      
      <p>Фокусът е върху страдание и култура. Предсезонната подготовка на Конте е път към физическа доминация и колективна идентичност.</p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-bold text-green-800 mb-3">🚀 Искаш ли достъп до премиум съдържание?</h3>
        <p className="text-green-700 mb-4">
          Вземи 6-седмичен план, вдъхновен от Антонио Конте в <strong>Coach Zone</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Абонирай се сега
          </button>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Регистрирай се безплатно
          </button>
        </div>
      </div>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Спортен Анализатор', avatar: '/avatars/analyst.jpg' },
    category: 'training',
    tags: ['Конте', 'Предсезонна подготовка', 'Натоварване', 'Макроцикъл'],
    publishedAt: new Date('2024-11-25'),
    readTime: 7,
    isPremium: false,
  },
  {
    id: '2',
    title: 'Микроцикълът на Антонио Конте – Ден по ден',
    slug: 'microcycle-conte',
    excerpt: 'Научи как протича тренировъчната седмица на Антонио Конте – баланс между физика, тактика и възстановяване. Всеки ден трябва да има функция. Всеки детайл има значение.',
    content: `
      <p>Всеки ден трябва да има функция. Всеки детайл има значение. Много треньори не структурират седмицата си логично – Конте показва как.</p>

      <p>Ще разгледаме структурата ден по ден, с акцент върху физика, тактика и автоматизъм.</p>

      <h2>📅 Типична седмица</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-3">Седмична структура:</h3>
        <ul className="space-y-2">
          <li><strong>Понеделник</strong> – Ниско натоварване: възстановяване + анализ</li>
          <li><strong>Вторник</strong> – Средно-високо: физика + тактика</li>
          <li><strong>Сряда</strong> – Високо: 11v11, преходи</li>
          <li><strong>Четвъртък</strong> – Средно: атака + скорост</li>
          <li><strong>Петък</strong> – Средно-ниско: статични положения</li>
          <li><strong>Събота</strong> – Ниско: разходка + активиране</li>
          <li><strong>Неделя</strong> – Мач: изпълнение</li>
        </ul>
      </div>

      <h2>⚽ Тактически блокове</h2>
      
      <ul>
        <li><strong>Build-up 11v0</strong> (30–45 мин) – Автоматизъм</li>
        <li><strong>Преходи</strong> (25–30 мин) – Реакция</li>
        <li><strong>Статични положения</strong> (20 мин) – Повторяемост</li>
        <li><strong>Флангове</strong> (30 мин) – Завършване</li>
        <li><strong>Физика</strong> (30 мин) – Спринтове</li>
      </ul>

      <h2>🎯 Индивидуализация</h2>
      
      <p>Конте използва GPS, видеоанализ и позиционни корекции за всеки играч.</p>
      
      <blockquote>"Тренирам отбора, но коригирам всеки играч поотделно." – Антонио Конте</blockquote>

      <p>Микроцикълът на Конте е дисциплинирана, контролирана и целенасочена програма за успех.</p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-bold text-green-800 mb-3">🚀 Искаш ли достъп до премиум съдържание?</h3>
        <p className="text-green-700 mb-4">
          Вземи микроцикъл по модел на Конте в <strong>Coach Zone</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Абонирай се сега
          </button>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Регистрирай се безплатно
          </button>
        </div>
      </div>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'Спортен Анализатор', avatar: '/avatars/analyst.jpg' },
    category: 'training',
    tags: ['Конте', 'Микроцикъл', 'Седмичен план', 'Тактика'],
    publishedAt: new Date('2024-11-24'),
    readTime: 6,
    isPremium: false,
  },
  {
    id: '3',
    title: 'Тактическите модели на Антонио Конте в атака: 3-5-2 и 3-4-3',
    slug: 'conte-attacking-models',
    excerpt: 'Разгледай как Антонио Конте изгражда атаката си чрез двете основни формации – 3-5-2 и 3-4-3. Ротации, широчина, роли и принципи. Конте използва 3 защитници, но атакува с 7 играчи.',
    content: `
      <p>Конте използва 3 защитници, но атакува с 7 играчи. Как го прави? Много треньори копират схемата, но не и принципите зад нея.</p>

      <p>Ще разгледаме как Конте структурира атаката си с 3-5-2 и 3-4-3.</p>

      <h2>⚽ 3-5-2: Контрол и ротации</h2>
      
      <h3>Основни принципи:</h3>
      <ul>
        <li><strong>2v1 по фланг</strong> – Численно превъзходство</li>
        <li><strong>Асиметрични нападатели</strong> – Различни роли</li>
        <li><strong>Вътрешни халфове между линиите</strong> – Създаване на връзки</li>
      </ul>

      <h2>🎯 3-4-3: Широчина и вътрешни връзки</h2>
      
      <h3>Ключови елементи:</h3>
      <ul>
        <li><strong>Inside forward + overlapping WB</strong> – Комбинации по фланг</li>
        <li><strong>Високи CM в поддръжка</strong> – Втори етаж на атаката</li>
        <li><strong>Смяна на фланг</strong> – Бърз преход между страните</li>
      </ul>

      <h2>🏗️ Build-up сценарии</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-3">Против различни формации:</h3>
        <ul>
          <li><strong>Срещу 4-4-2:</strong> Regista създава триъгълници</li>
          <li><strong>Срещу 4-3-3:</strong> Широки CB + dropping regista</li>
        </ul>
      </div>

      <h2>🎯 Завършване на атаката</h2>
      
      <h3>Принципи за финализация:</h3>
      <ul>
        <li><strong>Атака на слабата зона</strong> – Намиране на свободно пространство</li>
        <li><strong>1-2 комбинации</strong> – Бързи размени</li>
        <li><strong>Втори етаж от CM</strong> – Късни включвания</li>
      </ul>

      <p>Атаката на Конте е структурирана, многослойна и базирана на ротации и синхрон.</p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-bold text-green-800 mb-3">🚀 Искаш ли достъп до премиум съдържание?</h3>
        <p className="text-green-700 mb-4">
          Влез в <strong>Coach Zone</strong> за видео и упражнения от атаката на Конте.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Абонирай се сега
          </button>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Регистрирай се безплатно
          </button>
        </div>
      </div>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'Спортен Анализатор', avatar: '/avatars/analyst.jpg' },
    category: 'tactics',
    tags: ['Конте', 'Тактика', 'Атака', '3-5-2', '3-4-3'],
    publishedAt: new Date('2024-11-23'),
    readTime: 8,
    isPremium: false,
  },
  {
    id: '4',
    title: 'Пресиране и преходи при Антонио Конте – кога, как и защо',
    slug: 'conte-pressing-transitions',
    excerpt: 'Открий как Антонио Конте структурира преходите между фази и прилага интелигентна преса според контекста на мача. Моментът след загуба на топка е най-опасен – и за теб, и за съперника.',
    content: `
      <p>Моментът след загуба на топка е най-опасен – и за теб, и за съперника. Много отбори пресира хаотично. Конте го прави с логика.</p>

      <p>Ще разгледаме как Конте структурира прехода и пресира според сигнали и цели.</p>

      <h2>🔄 Принципи на прехода</h2>
      
      <h3>Защитен преход:</h3>
      <ul>
        <li><strong>Натиск в рамките на 5 секунди</strong> – Бърза реакция</li>
        <li><strong>Прегрупиране и затваряне на пространства</strong> – Организация</li>
        <li><strong>Fallback shape: 5-3-2 / 5-4-1</strong> – Компактност</li>
      </ul>

      <h3>Атакуващ преход:</h3>
      <ul>
        <li><strong>Пас напред към нападател</strong> – Директна атака</li>
        <li><strong>Пас встрани + напред</strong> – Изграждане на атака</li>
        <li><strong>Wing-back роля:</strong> Агресивно включване</li>
      </ul>

      <h2>🎯 Тригери и организация на пресата</h2>
      
      <h3>Тригери за преса:</h3>
      <ul>
        <li>Слаб бек под натиск</li>
        <li>Слаб вратар с топка</li>
        <li>Аут в опасна зона</li>
      </ul>

      <h3>Организация:</h3>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <ul>
          <li><strong>Нападатели:</strong> Пресиране на защитници</li>
          <li><strong>Wing-back:</strong> Излиза срещу бек/вратар</li>
          <li><strong>CM:</strong> Затваря диагонали</li>
        </ul>
      </div>

      <h2>🏃 Тренировка на преход и преса</h2>
      
      <h3>Методи:</h3>
      <ul>
        <li>11v11 със зададена загуба</li>
        <li>Тактически разбор със стоп кадри</li>
        <li>Двустранна игра с лимит 5 секунди за реакция</li>
      </ul>

      <p>Пресата и преходите на Конте са контролирани, координирани и базирани на тригери.</p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-bold text-green-800 mb-3">🚀 Искаш ли достъп до премиум съдържание?</h3>
        <p className="text-green-700 mb-4">
          Свали упражнение за преход и преса от <strong>Coach Zone</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Абонирай се сега
          </button>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Регистрирай се безплатно
          </button>
        </div>
      </div>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'Спортен Анализатор', avatar: '/avatars/analyst.jpg' },
    category: 'tactics',
    tags: ['Конте', 'Пресиране', 'Преход', 'Защита', 'Контраатака'],
    publishedAt: new Date('2024-11-22'),
    readTime: 7,
    isPremium: false,
  },
  {
    id: '5',
    title: 'Интервю с треньор на голям отбор по футбол',
    slug: 'interview-with-ceo-of-big-data-business',
    excerpt: 'Никой не отхвърля, не харесва или избягва удоволствието само по себе си, защото то е удоволствие, а защото тези, които не знаят как да преследват удоволствието рационално, се сблъскват с последици, които са изключително болезнени...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'interviews',
    tags: ['Интервюта', 'Треньори', 'Тактика'],
    publishedAt: new Date('2024-11-25'),
    readTime: 5,
    isPremium: false,
  },
  {
    id: '6',
    title: 'Тренировъчни методи за подобряване на скоростта',
    slug: 'training-methods-for-speed-improvement',
    excerpt: 'Скоростта е едно от най-важните качества в модерния футбол. Научете как да подобрите скоростните си показатели чрез специализирани тренировки...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'training',
    tags: ['Тренировки', 'Скорост', 'Фитнес'],
    publishedAt: new Date('2024-11-24'),
    readTime: 8,
    isPremium: false,
  },
  {
    id: '7',
    title: 'Анализ на тактиката 4-3-3 в съвременния футбол',
    slug: 'analysis-of-4-3-3-formation',
    excerpt: 'Формацията 4-3-3 е сред най-популярните в съвременния футбол. Анализираме предимствата и недостатъците на тази тактическа схема...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'tactics',
    tags: ['Тактика', 'Формации', 'Анализи'],
    publishedAt: new Date('2024-11-23'),
    readTime: 6,
    isPremium: false,
  },
  {
    id: '8',
    title: 'Новини от световния футбол - трансфери',
    slug: 'world-football-transfer-news',
    excerpt: 'Последните новини от трансферния пазар. Кои са най-горещите имена и какви са очакванията за зимния трансферен прозорец...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'news',
    tags: ['Новини', 'Трансфери', 'Играчи'],
    publishedAt: new Date('2024-11-22'),
    readTime: 9,
    isPremium: false,
  },
  {
    id: '9',
    title: 'Психологическа подготовка преди мач',
    slug: 'psychological-preparation-before-match',
    excerpt: 'Менталната подготовка е ключова за успеха на терена. Научете техники за справяне със стреса и подобряване на концентрацията...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'psychology',
    tags: ['Психология', 'Ментална подготовка', 'Играчи'],
    publishedAt: new Date('2024-11-21'),
    readTime: 7,
    isPremium: false,
  },
  {
    id: '10',
    title: 'Програма за хранене на младите футболисти',
    slug: 'nutrition-program-young-footballers',
    excerpt: 'Правилното хранене е основа за развитието на младите футболисти. Препоръки за балансирано хранене и хидратация...',
    content: 'Съдържание на статията...',
    featuredImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=450&fit=crop',
    author: { name: 'admin', avatar: '/avatars/admin.jpg' },
    category: 'nutrition',
    tags: ['Хранене', 'Младежки футбол', 'Здраве'],
    publishedAt: new Date('2024-11-20'),
    readTime: 4,
    isPremium: false,
  },
]

export default function ReadZonePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredArticles = useMemo(() => {
    return readArticles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section - Reduced height */}
      <section className="relative bg-black text-white pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=1920&h=300&fit=crop&crop=center"
            alt="Blog Header"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:px-8">
          <div className="text-center">
            <div className="mb-2">
              <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">BLOG</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Football Zone Blog
            </h1>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <SearchAndCategories 
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      {/* Main Content - Adjusted spacing */}
      <section className="py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Sidebar - Moved to left side */}
            <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
              <BlogSidebar />
            </div>

            {/* Main Content - Moved to right side */}
            <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <BlogCard 
                      key={article.id} 
                      article={article}
                      showVideo={index === 1 || index === 3}
                      showPhoto={index === 0 || index === 4}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">Няма намерени статии, които да отговарят на критериите.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors">
                  «
                </button>
                
                <button className="px-3 py-1 bg-green-600 text-white font-medium rounded shadow hover:bg-green-700 transition-colors">
                  1
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  2
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  3
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  4
                </button>
                
                <button className="px-3 py-1 text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  5
                </button>
                
                <button className="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors">
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 