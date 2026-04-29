# CLAUDE.md — Инструкции за Claude Code при изграждане на сайт

Този файл е template. Копирай го като `CLAUDE.md` в root-а на нов проект. Той казва на Claude Code как точно искам да изглежда и работи сайтът. Адаптирай секции маркирани с `// CUSTOMIZE` за конкретния бранд.

---

## За кого е сайтът

// CUSTOMIZE — пиши 2–3 изречения за бранда, аудиторията и целта на сайта (lead-gen, продажба, info и т.н.).

Всичко долу е default визия и UX. Следвай го стриктно, освен ако изрично не кажа друго в чата.

---

## Стек (без обсъждане)

- **Next.js** App Router + Turbopack
- **Tailwind v4**
- **TypeScript** strict
- **Vercel** deploy от GitHub `main` (auto-deploy)
- `next/image` за всички картинки
- Self-hosted primary шрифт (woff2) + async Google Fonts за вторичните

Не сменяй стек. Не добавяй CSS-in-JS библиотеки. Не въвеждай framer-motion освен ако анимацията наистина не може да се направи с CSS.

---

## Бранд палета (TypeScript обект)

Дефинирай палетата като константен обект в код (`DC` или подобно име) и **използвай само него** за цветове. Никакви ad-hoc hex стойности в JSX. Ако ти трябва нюанс, който го няма — добави го в обекта първо, после го използвай. (Имали сме build грешки от `DC.purple200` който не съществуваше — не повтаряй.)

Структура на палетата:
- `bg0` / `bg1` / `bg2` — тъмни фон градации (близо до черно)
- `fg` / `fgMuted` / `fgDim` — текст градации
- `accent500` / `accent600` / `accent700` / `accent800` — основен бранд цвят (CTA, glow)
- `accent2` — втори акцент (soft accents, FAQ "+", меки highlights)

// CUSTOMIZE — посочи реалните hex стойности за бранда.

---

## Типография

- **Primary** (headings, UI): self-hosted woff2 с `font-display: optional` + `size-adjust` / `ascent-override` / `descent-override` за нулев CLS.
- **Accent** за числа и специфични думи (напр. "AI", "10", "$10,000"): прилага се **inline** на конкретни срички с `style={{ fontFamily: "..." }}`.
- **Body**: Inter или подобен sans-serif, async-loaded през `<Script>` инжектиращ `<link>` (никога блокиращ `@import`).
- Само **1 woff2 preload** за primary шрифта.

---

## Стилови похвати по default

- **Тъмен фон** — близо до черно, не сив.
- **Glow / lamp ефекти**: divider-и във footer-а с downward light, inner glow на opt-in карти, CTA pulse animation.
- **Eyebrow надписи** над секции и колони ("навигация", "социални мрежи").
- **Pill бутони** за primary CTA с pulse animation.
- **Без emoji** като UI икони. SVG или нищо.
- **Без дълги тирета (—)** в видимия текст. Замени с точки, запетаи, нов ред.
- **Pink/мек акцент** за "+" бутоните на FAQ (не chevrons).

---

## Copywriting правила

- **Език** // CUSTOMIZE — български / английски.
- **Тон**: директен, лично адресиран ("ти", не "Вие"), без guru-овски клишета.
- **Валута**: € не $, "евро" не "долар" в copy. Запази "$10,000" само ако е директен цитат/пример.
- **Кратки изречения, разделени с точка**: "Без пари. Без аудитория. Без диплома."
- **All caps** за primary CTA labels: "ОТКЛЮЧИ ДОСТЪП", "БЕЗПЛАТНО ОБУЧЕНИЕ".
- **"Мигновен"** не "незабавен" достъп.
- **Брой редове е важен** — питай или приеми, че ще искам контрол. Default: heading-и 3 реда mobile / 2 реда desktop. Постига се с `<br className="md:hidden" />` и `<br className="hidden md:inline" />`. Ако Tailwind не сработи — explicit CSS media query.

---

## Layout patterns

### Hero
- Голям headline с акцентни думи в secondary шрифт (числа, brand keywords).
- Подзаглавие в `fgMuted`.
- Primary CTA pill с pulse + secondary action.
- Изображение/видео отдясно или отдолу с резервиран `aspect-ratio: 16/9`.

### Footer
- 3 колони: **лого / навигация / социални мрежи**.
- Eyebrow заглавия над колоните.
- Lamp-glow divider, който хвърля светлина надолу.
- Лого вертикално центрирано спрямо колоните, leko вдясно, една идея по-голямо от текста.
- Линкове към `/privacy` и `/terms` на дъното.

### FAQ
- Brand-accent "+" бутони.
- Heading 2 реда desktop / повече mobile.

### Opt-in modal
- Inner glow карта стил.
- Полета: **Име + Email**. Без "Отписване с 1 клик" badge.
- Заглавие all caps.
- Floating X close в **горен-десен ъгъл на viewport-а**, не на формата.
- **Body scroll lock на iOS Safari** със:
  ```js
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  // cleanup: restore + window.scrollTo(0, scrollY)
  ```
  Само `overflow: hidden` не работи на iOS — никога не го използвай сам.

### Announce bar
- **Mobile**: статичен, центриран текст.
- **Desktop**: marquee animation.
- Implement през 2 различни компонента + explicit CSS media queries в `globals.css` с `!important`. Tailwind responsive (`md:hidden` / `hidden md:flex`) тук често не сработва.

---

## UX правила (без преговори)

- **`user-select: none`** на целия сайт. Изключение: `<input>`, `<textarea>`.
- **Right-click блокиран** глобално (запазен в input/textarea).
- **Touch targets ≥ 44×44px**.
- **Cursor: pointer** на всичко clickable.
- **Focus rings** видими.
- **Spacing на mobile стегнат**: `py-10 md:py-20`, не `py-14`.
- **iOS Reduce Motion** — много iOS юзъри го имат включен по default. **НЕ слагай** `@media (prefers-reduced-motion: reduce)` блокове, които спират ключови UI анимации (CTA pulse, lock animation). Иначе анимациите няма да работят на iPhone.

---

## Производителност (целеви метрики)

- **Lighthouse Desktop**: 100 / 100 / 100 / 100.
- **Lighthouse Mobile**: ≥ 87 (slow-4G има ±5–10 точки вариация — пускай 2–3 пъти преди да реагираш).
- **PageSpeed Insights** е референтният инструмент, не локален DevTools.

### Задължителни техники
- `next/image` с `fill` + `sizes` + `loading="lazy"` за всичко не-above-the-fold.
- Lazy-load на video/audio плеъри (Wistia, YouTube embed) — зарежди скриптовете чак след user interaction.
- Async CSS injection през `<Script>` + `<link>`, не блокиращ `<link rel="stylesheet">` или `@import`.
- `aspect-ratio` на всички embed/video wrapper-и.
- Без framer-motion освен ако наистина не може с CSS (~30 KB bundle).
- `font-display: optional` + size-adjust на custom шрифтове.

### Не прави
- `optimizeCss` / Critters — счупиха билда веднъж, не пробвай отново без причина.
- Множество woff2 preloads.
- Tracking скриптове в `<head>` блокиращо.

---

## Responsive стратегия

- Mobile-first.
- Tailwind responsive класове са **първи опит**.
- Ако `md:hidden` / `hidden md:flex` не сработва при превключване между показани/скрити блокове — премини на explicit CSS класове в `globals.css` с `@media (min-width: 768px)` и `!important`.
- Mobile и desktop понякога искат **различни компоненти** за един елемент (announce bar), не само стилови вариации.

---

## Задължителни страници

- `/` — landing
- `/privacy` — Privacy Policy (GDPR на български ако е BG сайт)
- `/terms` — Terms of Service
- 404 страница в брандов стил

Privacy/Terms линкни от footer-а.

---

## Конфигурация

- `next.config.mjs`: `images.remotePatterns` за всички външни image hosts (framerusercontent, wistia, cdn-и).
- TypeScript strict — оправяй type грешките веднага, не ги ignore-вай.

---

## Процес и комуникация

- **Бързи итерации**: фикс → push → чакай feedback → следващ фикс. Не правя batch.
- Аз ще пускам **screenshots + кратки инструкции** ("това на 2 реда", "централизирай", "този текст да стане → ..."). Прилагай точно това, не разширявай scope.
- Когато кажа **"оставяме така"** или **"не го прави"** — спираш да оптимизираш тази метрика/компонент.
- **Тествай на реален iPhone**, не само DevTools mobile emulation. iOS Safari има реални различия (scroll lock, Reduce Motion, font rendering).
- **Не добавяй features извън поисканото.** Без bonus refactors. Без "помислих си, че може и...".
- **Build грешки от TypeScript** често идват от: липсващи цветове в палетата, грешни ref types. Чети error log-а изцяло преди да fix-ваш.

---

## Чек-лист преди да кажеш "готово"

- [ ] Палета дефинирана като TS обект, използвана навсякъде
- [ ] Self-hosted primary шрифт + async secondary
- [ ] Footer 3 колони + lamp divider + eyebrow
- [ ] CTA pulse pill + brand glow
- [ ] Opt-in modal: име+email, floating X, iOS scroll lock
- [ ] FAQ "+" бутони
- [ ] Announce bar статичен mobile / marquee desktop
- [ ] `/privacy` + `/terms` готови и линкнати
- [ ] `next/image` на всички картинки
- [ ] Lazy-load на video/audio
- [ ] `font-display: optional` + size-adjust
- [ ] `aspect-ratio` на embed-и
- [ ] `user-select: none` + right-click блокиран
- [ ] Без `—` em-dash в видим текст
- [ ] € не $; "мигновен" не "незабавен"
- [ ] Брой редове проверен mobile + desktop
- [ ] All caps за primary CTAs
- [ ] Без `prefers-reduced-motion` блокове, които спират анимации
- [ ] Lighthouse Mobile ≥ 87, Desktop = 100 (2–3 runs)
- [ ] Тествано на реален iPhone
