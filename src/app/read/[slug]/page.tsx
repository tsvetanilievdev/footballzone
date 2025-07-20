'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Article } from '@/types'
import { 
  UserIcon, 
  ClockIcon, 
  CalendarIcon, 
  TagIcon, 
  ShareIcon,
  BookmarkIcon,
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import Image from 'next/image'

// Масив от всички статии (в реален проект ще се взема от API)
const allArticles: Article[] = [
  {
    id: '0',
    title: 'Футболна философия на Антонио Конте: Дисциплина, Идентичност, Интензитет',
    slug: 'filosofiya-antonio-conte-distsiplina-identichnost-intenzitet',
    excerpt: 'Открийте какви са треньорските принципи на Антонио Конте – интензитет, дисциплина и тактическа идентичност.',
    content: `
      <p>Знаете ли, че Антонио Конте кара играчите си да правят до 4 тренировки на ден в предсезонната подготовка? Това не е каприз, а отражение на философията му – безусловна отдаденост, контрол и интензивност във всичко.</p>

      <p>За много треньори Конте е вдъхновение, но и предизвикателство. Той съчетава военна дисциплина с модерна тактическа яснота, което го прави уникален в съвременния футбол. Какво го прави толкова ефективен?</p>

      <p>В тази статия ще разкрием основните елементи от неговата философия – тези, които оформят начина, по който води отборите си към успех.</p>

      <h2>🔥 Принцип 1: Всичко започва с интензитет</h2>
      
      <blockquote>"Ако не можеш да тичаш, не можеш да играеш за мен" – една от най-често цитираните реплики на Конте.</blockquote>
      
      <p>За него интензитетът не е резултат от добрата форма, а от менталната нагласа. На тренировка се тренира така, както се играе. Това не е просто слоган – това е начин на живот.</p>

      <h3>Как се измерва интензитета при Конте:</h3>
      <ul>
        <li><strong>GPS данни:</strong> Всеки играч носи GPS устройство за проследяване на скорост, разстояние и ускорения</li>
        <li><strong>Сърдечен ритъм:</strong> Постоянно наблюдение на пулса по време на тренировка</li>
        <li><strong>Визуална оценка:</strong> Конте лично наблюдава езика на тялото и ангажираността</li>
        <li><strong>Ментална реакция:</strong> Как играчите реагират при грешки и под натиск</li>
      </ul>

      <h3>Практически примери от Челси (2016-2017):</h3>
      <p>През първия си сезон в Челси, Конте въведе революционен тренировъчен режим:</p>
      <ul>
        <li>Тренировки с продължителност до 2.5 часа (срещу стандартните 90 минути)</li>
        <li>Физическа подготовка интегрирана с техническа работа</li>
        <li>Играчи като Маркос Алонсо подобриха спринтовите си показатели с 15%</li>
        <li>Цезар Азпиликуета изтича 13% повече разстояние за сезон спрямо предишната година</li>
      </ul>

      <p><strong>💡 Съвет за треньори:</strong> Създавайте "зони на дискомфорт" в тренировката. Интензитетът не означава само бягане – означава максимална концентрация във всяко докосване на топката.</p>

      <h2>🧭 Принцип 2: Колективна идентичност</h2>
      
      <blockquote>"Играчите не са индивидуалности. Те са елементи на един механизъм" – Конте вярва в тактическата идентичност.</blockquote>
      
      <p>Всеки играч има ясно дефинирана роля, а целият отбор действа в синхрон. Това не потиска индивидуалността, а я канализира към колективната цел.</p>

      <h3>Как се изгражда колективната идентичност:</h3>
      <ol>
        <li><strong>Унифицирана терминология:</strong> Всички използват едни и същи термини за движения и позиции</li>
        <li><strong>Автоматизми:</strong> Повтаряне на движения до пълно усвояване</li>
        <li><strong>Взаимозаменяемост:</strong> Всеки знае ролята на съотборника си</li>
        <li><strong>Колективна отговорност:</strong> Грешката на един е грешка на всички</li>
      </ol>

      <h3>Пример от Ювентус (2011-2014):</h3>
      <p>При Конте, Ювентус спечели 3 поредни титли без да загуби нито един мач в първия сезон (49 мача без загуба). Ключът беше:</p>
      <ul>
        <li><strong>Еднаква интерпретация:</strong> Всички защитници реагираха еднакво при офсайд капани</li>
        <li><strong>Синхронни движения:</strong> Целият отбор се движеше като "едно тяло"</li>
        <li><strong>Ментална връзка:</strong> Играчите "четяха" намеренията един на друг</li>
      </ul>

      <p>Андреа Пирло споделя: "При Конте, аз знаех къде ще бъде всеки съотборник преди той самият да го знае."</p>

      <p><strong>💡 Съвет за треньори:</strong> Работете със "сценарии". Създавайте ситуации в тренировката и изисквайте еднаква реакция от всички играчи.</p>

      <h2>⛓ Принцип 3: Желязна дисциплина</h2>
      
      <p>Конте не допуска компромис. Той поставя рамки още в първите дни – не като диктатор, а като лидер, който знае че дисциплината освобождава креативността.</p>

      <h3>Структурата на дисциплината при Конте:</h3>
      
      <h4>🕐 Времева дисциплина:</h4>
      <ul>
        <li>Закъснение с 1 минута = глоба 500 евро</li>
        <li>Отсъствие от тренировка без причина = отстраняване за седмица</li>
        <li>Мобилни телефони се оставят в кабинките преди тренировка</li>
      </ul>

      <h4>🍎 Хранителна дисциплина:</h4>
      <ul>
        <li>Стриктно меню, одобрено от нутриционисти</li>
        <li>Забрана за алкохол дори в свободните дни</li>
        <li>Задължителни кръвни изследвания всеки месец</li>
      </ul>

      <h4>🧠 Ментална дисциплина:</h4>
      <ul>
        <li>Анализ на всяка грешка с видео</li>
        <li>Самокритика пред групата при сериозни пропуски</li>
        <li>Положителна реакция при критика</li>
      </ul>

      <h3>Историята на Диего Коща в Челси:</h3>
      <p>През 2017 г., Диего Коща влезе в конфликт с Конте заради дисциплинарни проблеми:</p>
      <ul>
        <li>Коща закъсня на тренировка за 15 минути</li>
        <li>Не се появи на задължителния физически тест</li>
        <li>Конте го изключи от състава за 2 месеца</li>
        <li>Въпреки че Коща беше топ голмайстор, принципът беше по-важен</li>
      </ul>

      <blockquote>"Тренирам главите на играчите, преди краката им" – подчертава Конте.</blockquote>
      
      <p>За него психологията е също толкова важна, колкото физиката. Дисциплината не ограничава – тя дава структура, в която таланта може да процъфти.</p>

      <p><strong>💡 Съвет за треньори:</strong> Установете ясни правила от първия ден. Бъдете последователни. Обяснете "защо" зад всяко правило.</p>

      <h2>📈 Резултатите говорят сами</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg my-6">
        <h3 className="font-bold mb-4">Статистика при Конте:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">78%</div>
            <div className="text-sm text-gray-600">Процент победи като треньор</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-sm text-gray-600">Шампионски титли</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">49</div>
            <div className="text-sm text-gray-600">Мача без загуба (рекорд)</div>
          </div>
        </div>
      </div>

      <h2>📣 Заключение</h2>
      
      <p>Както видяхме, философията на Антонио Конте не е просто тактика – тя е цялостна система на интензитет, дисциплина и яснота, която се прилага във всеки детайл на тренировъчния процес и управлението на отбора.</p>

      <p>Неговият подход може да изглежда твърде стриктен за съвременния футбол, но резултатите говорят сами. От Барии до Челси, от Ювентус до Интер – навсякъде, където стъпи, Конте оставя трайни следи.</p>

      <p><strong>Той не просто тренира футболисти – той ги трансформира в победители.</strong></p>

      <h3>🔑 Ключови уроци за всеки треньор:</h3>
      <ol>
        <li>Интензитетът е нагласа, не физическо състояние</li>
        <li>Колективността не убива индивидуалността, а я усилва</li>
        <li>Дисциплината създава свобода за творчество</li>
        <li>Последователността е основата на авторитета</li>
        <li>Всеки детайл има значение за големия резултат</li>
      </ol>

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
    featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop',
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
    excerpt: 'Разбери как Антонио Конте структурира своята подготовка – физическо натоварване, тактически блокове и военна дисциплина.',
    content: `
      <p>При Конте е като в армията – спиш, ядеш и тренираш. Как да структурираме подготовка, която изгражда тяло, тактика и дух? Предсезонната подготовка при Конте не е просто физическа кондиция – това е трансформация на играчите в машина за победи.</p>

      <p>Ще разгледаме макроцикъл, дневна структура и методи, които използва Конте за да създаде отбори, които доминират през целия сезон.</p>

      <h2>📅 Макроцикъл: От натоварване към автоматизъм</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">6-седмичен план на Конте</h3>
        <p className="text-blue-700">Всяка фаза има специфична цел и се изгражда върху предишната.</p>
      </div>

      <h3>Фаза 1 – Физическа доминация (Седмици 1-2)</h3>
      <p><strong>Цел:</strong> Изграждане на физическа база и ментална издръжливост</p>
      
      <h4>🏃‍♂️ Физическа подготовка (60% от времето):</h4>
      <ul>
        <li><strong>Аеробна база:</strong> 45-минутни бягания с пулс 70-80% от максималния</li>
        <li><strong>Интервални серии:</strong> 8x400м с 90 секунди почивка</li>
        <li><strong>Силова работа:</strong> Приседания, изтласквания, планк до изнемога</li>
        <li><strong>Plyometric упражнения:</strong> Скокове, ускорения, промени на посока</li>
      </ul>

      <h4>⚽ Техническа работа (40% от времето):</h4>
      <ul>
        <li>Жонгльорство под натоварване (след физически упражнения)</li>
        <li>Точни пасове на кратки разстояния</li>
        <li>Първо докосване под пресинг</li>
      </ul>

      <p><strong>Ключово правило:</strong> Никога не се тренира техника в комфорт – винаги под физическо или ментално натоварване.</p>

      <h3>Фаза 2 – Тактическа структура (Седмици 3-4)</h3>
      <p><strong>Цел:</strong> Въвеждане на игрови принципи и автоматизми</p>

      <h4>🎯 Тактически блокове:</h4>
      <ul>
        <li><strong>Build-up 11v0:</strong> 30 минути ежедневно – изграждане от защита без противник</li>
        <li><strong>Позиционна игра:</strong> 7v7 в ограничено пространство с правила</li>
        <li><strong>Преходи:</strong> Специфични сценарии за загуба/възвръщане на топката</li>
        <li><strong>Статични положения:</strong> Всички стандартни ситуации</li>
      </ul>

      <h4>📊 Измерване на прогреса:</h4>
      <div className="bg-gray-50 p-4 rounded-lg my-4">
        <ul>
          <li><strong>Брой правилни решения на минута</strong> в позиционна игра</li>
          <li><strong>Време за прехвърляне от защита в атака</strong> (цел: под 6 секунди)</li>
          <li><strong>Процент точни пасове</strong> под пресинг (цел: над 85%)</li>
          <li><strong>Синхронност на движенията</strong> – визуална оценка от Конте</li>
        </ul>
      </div>

      <h3>Фаза 3 – Игрови интензитет (Седмици 5-6)</h3>
      <p><strong>Цел:</strong> Довеждане до мачов ритъм и финализиране на подготовката</p>

      <h4>🔥 Интензитет като в мач:</h4>
      <ul>
        <li><strong>11v11 игри:</strong> 3x30 минути с пълен интензитет</li>
        <li><strong>Контролни мачове:</strong> Срещу силни противници</li>
        <li><strong>Специфични сценарии:</strong> Как се играе при 1:0, при 0:1, при равенство</li>
        <li><strong>Финални тестове:</strong> Физически и технически измервания</li>
      </ul>

      <h2>⏰ Типичен ден в подготовката</h2>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
        <h3 className="font-bold mb-4">Дневна програма при Конте:</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">07:00</span>
            <span>Събуждане и лек закуска</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">08:30</span>
            <span>Медицински преглед и стречинг</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">09:30</span>
            <span>Първа тренировка (физика + техника)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">12:00</span>
            <span>Обяд и почивка</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">16:00</span>
            <span>Втора тренировка (тактика + игра)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">18:30</span>
            <span>Физиотерапия и рехабилитация</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">20:00</span>
            <span>Вечеря и видео анализ</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">22:00</span>
            <span>Задължителна почивка</span>
          </div>
        </div>
      </div>

      <h2>💪 Методи и психология</h2>
      
      <h3>Уникални тренировъчни методи на Конте:</h3>
      
      <h4>🔄 "Carousel Training":</h4>
      <p>Играчите се движат между 6 станции на всеки 8 минути:</p>
      <ol>
        <li>Техническа прецизност</li>
        <li>Физическа сила</li>
        <li>Тактически сценарии</li>
        <li>Ментална концентрация</li>
        <li>Сърдечно-съдова издръжливост</li>
        <li>Координация и баланс</li>
      </ol>

      <h4>⚡ "Pressure Cooker":</h4>
      <p>Всяко упражнение се прави под изкуствен натиск:</p>
      <ul>
        <li>Ограничено време за изпълнение</li>
        <li>Физическа умора преди техническо упражнение</li>
        <li>Последици при грешки (допълнителни упражнения)</li>
        <li>Постоянни инструкции и корекции от Конте</li>
      </ul>

      <h3>🧠 Психологическа подготовка:</h3>
      
      <blockquote>"Моите отбори трябва да страдат заедно, за да побеждават заедно" – Антонио Конте</blockquote>
      
      <p>Конте използва предсезонната подготовка не само за физическа, но и за ментална трансформация:</p>

      <ul>
        <li><strong>Колективно страдание:</strong> Всички преминават през еднакви трудности</li>
        <li><strong>Взаимна зависимост:</strong> Упражнения, където един играч влияе на целия отбор</li>
        <li><strong>Преодоляване на граници:</strong> Постоянно повишаване на изискванията</li>
        <li><strong>Положителна агресия:</strong> Канализиране на фрустрацията в мотивация</li>
      </ul>

      <h3>📈 Резултати от подготовката на Челси (2016):</h3>
      <div className="bg-blue-50 p-4 rounded-lg my-4">
        <h4 className="font-bold mb-2">Измерими подобрения:</h4>
        <ul className="space-y-1">
          <li>• Средно изтичано разстояние: +8% спрямо предишния сезон</li>
          <li>• Спринтове над 25 км/ч: +12% увеличение</li>
          <li>• Точност на пасовете: от 82% на 89%</li>
          <li>• Загубени топки: -15% намаление</li>
          <li>• Наранявания: -25% по-малко контузии</li>
        </ul>
      </div>

      <h2>🎯 Практически съвети за треньори</h2>
      
      <h3>Как да адаптираме методите на Конте:</h3>
      
      <h4>За аматьорски отбори:</h4>
      <ul>
        <li>Съкратете продължителността, но запазете интензитета</li>
        <li>Фокус върху колективните упражнения</li>
        <li>Използвайте видео анализ дори с телефон</li>
        <li>Създайте вътрешни правила и ги спазвайте</li>
      </ul>

      <h4>За младежки отбори:</h4>
      <ul>
        <li>Повече игрови форми, по-малко монотонни упражнения</li>
        <li>Акцент върху техническото развитие под натоварване</li>
        <li>Обяснете "защо" зад всяко упражнение</li>
        <li>Включете елементи на състезание в тренировката</li>
      </ul>

      <p>Фокусът е върху страдание и култура. Предсезонната подготовка на Конте е път към физическа доминация и колективна идентичност, който започва с дисциплина и завършва с автоматизъм.</p>

      <blockquote>"В предсезонната подготовка се печелят шампионатите" – Антонио Конте</blockquote>

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
    excerpt: 'Научи как протича тренировъчната седмица на Антонио Конте – баланс между физика, тактика и възстановяване.',
    content: `
      <p>Всеки ден трябва да има функция. Всеки детайл има значение.</p>

      <h2>📅 Типична седмица</h2>
      <ul>
        <li><strong>Понеделник</strong> – Ниско натоварване: възстановяване + анализ</li>
        <li><strong>Вторник</strong> – Средно-високо: физика + тактика</li>
        <li><strong>Сряда</strong> – Високо: 11v11, преходи</li>
      </ul>

      <h2>🎯 Индивидуализация</h2>
      <blockquote>"Тренирам отбора, но коригирам всеки играч поотделно." – Антонио Конте</blockquote>

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
    excerpt: 'Разгледай как Антонио Конте изгражда атаката си чрез двете основни формации.',
    content: `
      <p>Конте използва 3 защитници, но атакува с 7 играчи. Как го прави?</p>

      <h2>⚽ 3-5-2: Контрол и ротации</h2>
      <ul>
        <li><strong>2v1 по фланг</strong> – Числено превъзходство</li>
        <li><strong>Асиметрични нападатели</strong> – Различни роли</li>
      </ul>

      <h2>🎯 3-4-3: Широчина и вътрешни връзки</h2>
      <ul>
        <li><strong>Inside forward + overlapping WB</strong> – Комбинации по фланг</li>
        <li><strong>Високи CM в поддръжка</strong> – Втори етаж на атаката</li>
      </ul>

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
    excerpt: 'Открий как Антонио Конте структурира преходите между фази и прилага интелигентна преса.',
    content: `
      <p>Моментът след загуба на топка е най-опасен – и за теб, и за съперника.</p>

      <h2>🔄 Принципи на прехода</h2>
      <h3>Защитен преход:</h3>
      <ul>
        <li><strong>Натиск в рамките на 5 секунди</strong> – Бърза реакция</li>
        <li><strong>Прегрупиране и затваряне на пространства</strong> – Организация</li>
      </ul>

      <h2>🎯 Тригери и организация на пресата</h2>
      <ul>
        <li>Слаб бек под натиск</li>
        <li>Слаб вратар с топка</li>
        <li>Аут в опасна зона</li>
      </ul>

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
  }
]

// Функция за намиране на статия по slug
const findArticleBySlug = (slug: string): Article | null => {
  return allArticles.find(article => article.slug === slug) || null
}

// Fallback статия ако не се намери
const defaultArticle: Article = allArticles[0]

export default function ArticleTemplatePage() {
  const params = useParams()
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'magazine' | null>(null)

  // Взема статията по slug от URL параметъра
  const slug = params.slug as string
  const article = findArticleBySlug(slug) || defaultArticle

  if (selectedTemplate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          {selectedTemplate === 'classic' && <ClassicTemplate article={article} />}
          {selectedTemplate === 'modern' && <ModernTemplate article={article} />}
          {selectedTemplate === 'magazine' && <MagazineTemplate article={article} />}
          
          {/* Back to templates button */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Read Zone */}
          <div className="mb-8">
            <Link
              href="/read"
              className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Назад към Read Zone
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Избери темплейт за статия
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Разгледай 3-те различни темплейта за показване на статии и избери този, който най-добре отговаря на нуждите ти.
            </p>
          </div>

          {/* Template Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Classic Template Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Image
                  src={article.featuredImage}
                  alt="Classic Template"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">Класически</h3>
                  <p className="text-sm opacity-90">Традиционен и елегантен дизайн</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center"><UserIcon className="w-4 h-4 mr-1" /> Автор</span>
                    <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1" /> {article.readTime} мин</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedTemplate('classic')}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Прегледай Класически
                </button>
              </div>
            </div>

            {/* Modern Template Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Image
                  src={article.featuredImage}
                  alt="Modern Template"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">Модерен</h3>
                  <p className="text-sm opacity-90">Съвременен и интерактивен</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-green-100 rounded-full w-16 animate-pulse"></div>
                    <div className="h-6 bg-green-100 rounded-full w-20 animate-pulse"></div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedTemplate('modern')}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Прегледай Модерен
                </button>
              </div>
            </div>

            {/* Magazine Template Preview */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Image
                  src={article.featuredImage}
                  alt="Magazine Template"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold">Списание</h3>
                  <p className="text-sm opacity-90">Стил на съвременно списание</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="text-sm text-green-600 font-semibold">КАТЕГОРИЯ</div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse mt-1"></div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedTemplate('magazine')}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Прегледай Списание
                </button>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Сравнение на функционалности
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 font-semibold text-gray-900">Функционалност</th>
                      <th className="text-center py-4 font-semibold text-green-600">Класически</th>
                      <th className="text-center py-4 font-semibold text-green-600">Модерен</th>
                      <th className="text-center py-4 font-semibold text-green-600">Списание</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-4 text-gray-700">Четим дизайн</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-gray-700">Интерактивни елементи</td>
                      <td className="text-center py-4">⭐</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">⭐</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-gray-700">Боковa лента</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">❌</td>
                      <td className="text-center py-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-gray-700">Социални функции</td>
                      <td className="text-center py-4">⭐</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">⭐</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-gray-700">Мобилна оптимизация</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">✅</td>
                      <td className="text-center py-4">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                ✅ Пълна поддръжка | ⭐ Основна поддръжка | ❌ Не се поддържа
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

// Classic Template Component
function ClassicTemplate({ article }: { article: Article }) {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              {/* Header */}
              <header className="mb-8">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {article.category}
                  </span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>{article.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>{new Intl.DateTimeFormat('bg-BG').format(article.publishedAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{article.readTime} минути четене</span>
                  </div>
                </div>
              </header>
              
              {/* Featured Image */}
              <div className="mb-8">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  width={800}
                  height={320}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Content */}
              <div className="prose prose-lg max-w-none prose-green">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              
              {/* Tags */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Свързани статии
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        Примерна свързана статия {i}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">5 мин четене</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modern Template Component
function ModernTemplate({ article }: { article: Article }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(42)
  
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px]">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">{article.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{article.readTime} мин</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span>1,234 прегледа</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-full shadow-lg px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setIsLiked(!isLiked)
                setLikes(isLiked ? likes - 1 : likes + 1)
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="font-medium">{likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="font-medium">12</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <article className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="prose prose-lg max-w-none prose-green">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Тагове</h3>
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

// Magazine Template Component
function MagazineTemplate({ article }: { article: Article }) {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article>
              {/* Header */}
              <header className="mb-12">
                <div className="mb-6">
                  <span className="text-green-600 text-sm font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                  {article.title}
                </h1>
                
                <div className="border-l-4 border-green-600 pl-6 mb-8">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between py-6 border-t border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {article.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{article.author.name}</p>
                      <p className="text-sm text-gray-500">Автор</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Intl.DateTimeFormat('bg-BG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).format(article.publishedAt)}
                    </p>
                    <p className="text-sm text-gray-500">{article.readTime} минути четене</p>
                  </div>
                </div>
              </header>
              
              {/* Featured Image */}
              <div className="mb-12">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  width={1200}
                  height={384}
                  className="w-full h-96 object-cover rounded-none shadow-2xl"
                />
              </div>
              
              {/* Content */}
              <div className="prose prose-xl max-w-none prose-gray">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Съдържание
                </h3>
                <nav className="space-y-2">
                  <a href="#" className="block text-sm text-gray-600 hover:text-green-600 transition-colors">
                    Принцип 1: Интензитет
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-green-600 transition-colors">
                    Принцип 2: Идентичност
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-green-600 transition-colors">
                    Принцип 3: Дисциплина
                  </a>
                </nav>
              </div>
              
              {/* Tags */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Тагове
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-xs font-medium bg-white text-gray-600 border border-gray-200 rounded hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-green-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2">
                  Абонирай се
                </h3>
                <p className="text-sm text-green-100 mb-4">
                  Получавай най-новите статии и анализи директно в пощата си.
                </p>
                <input
                  type="email"
                  placeholder="Твоят имейл"
                  className="w-full px-3 py-2 text-gray-900 rounded mb-3 text-sm"
                />
                <button className="w-full bg-white text-green-600 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors">
                  Абонирай се
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 