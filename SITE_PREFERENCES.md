# Предпочитания за сайтове — Венелин Йорданов

Обобщение от целия ден работа по `landing.aibrandscale.io`. Покрива дизайн, copywriting, UX, производителност и процес. Използвай като база при бъдещи сайтове.

---

## 1. Бранд и визуален език

### Цветове
- **Основен фон:** тъмно (близо до черно) — `bg0/bg1/bg2` градации.
- **Акцент:** brand-purple (purple500/600/700/800) — използва се за CTA, glow ефекти, hover states, FAQ "+", вътрешни glow карти.
- **Втори акцент:** brand-pink (pink100) — за по-меки akzenti, "+" бутоните на FAQ.
- **Текст:** `fg` (бяло) основен, `fgMuted` за подзаглавия, `fgDim` за дребен/secondary текст.
- Не въвеждай нови цветове извън `DC` палетата без причина — TypeScript ще се счупи (имали сме build error от `DC.purple200` който не съществува).

### Типография
- **Primary:** alfabet (self-hosted, woff2) — за headings и UI.
- **Secondary:** Manrope — за акцентни числа и думи като "AI", "10", "$10,000". Прилага се inline на конкретни срички с `style={{ fontFamily: "Manrope, sans-serif" }}`.
- **Body:** Inter (async през Google Fonts).
- `font-display: optional` + `size-adjust` / `ascent-override` / `descent-override` за нулев CLS от swap.
- Само 1 woff2 preload за primary шрифта (не 3+).

### Стилови похвати
- **Glow / lamp ефекти**: лампа във footer divider-а с downward light, purple inner glow на opt-in modal карти, CTA pulse animation.
- **Eyebrow надписи** над секции/колони ("навигация", "социални мрежи").
- **Pill бутони** (CTAPill) с pulse animation за primary actions.
- **Без emoji** като UI икони — SVG или нищо.
- **Без дълги тирета (—)** в визуалния текст. Замени с точки, запетаи или нов ред.

---

## 2. Copywriting на български

- **Тон:** директен, лично адресиран ("ти", не "Вие"), без guru-овски клишета.
- **Винаги € вместо $** и "евро" вместо "долар" в копи (но запазваме "$10,000" в реални цитати/примери ако е специфично).
- **Точки в края на изречения** в чек-лист елементи — но проверявай за consistency, понякога ги махаме за визуален баланс.
- **All caps** за ключови CTA labels: "ОТКЛЮЧИ ДОСТЪП", "БЕЗПЛАТНО ОБУЧЕНИЕ".
- **"Мигновен" вместо "незабавен"** достъп.
- **Брой редове** има значение — често искаме точен брой (3 на mobile, 2 на desktop) за headings. Постига се с `<br className="md:hidden" />` / `<br className="hidden md:inline" />` или explicit CSS media queries.
- **Кратки изречения, разделени с точка**, вместо дълги с "и": "Без пари. Без аудитория. Без диплома."
- Често ще се иска **централизиране** на конкретен блок текст и **двуредово** оформление за заглавия.

---

## 3. Layout patterns

### Footer
- 3-колонен layout: лого / навигация / социални мрежи.
- Текст центриран, колоните items-start.
- Лого вертикално центрирано спрямо колоните, leko вдясно, една идея по-голямо.
- Lamp-glow divider, който хвърля светлина надолу (отделя сектори).
- Eyebrow заглавия над колоните.
- Линкове към Privacy и Terms на дъното.

### Hero
- Голям headline с акцентни Manrope думи (числа, "AI").
- Sub-headline по-малък, fgMuted.
- Primary CTA (pulse pill) + secondary action.
- Изображение/видео отдясно или под, с reservирано aspect-ratio.

### FAQ
- Brand-pink "+" бутони (не chevrons).
- Heading на 2 реда от desktop, повече на mobile.

### Opt-in modal
- Purple inner glow card стил.
- Полета: Име + Email (без "Отписване с 1 клик" badge).
- Floating X close в горен-десен ъгъл на viewport-а, не на самата форма.
- Heading "ОТКЛЮЧИ ДОСТЪП" all caps.
- Заключва body scroll на iOS със `position: fixed; top: -scrollY` pattern.

### Announce bar
- Mobile: статичен, центриран текст (за четимост).
- Desktop: marquee animation.
- Implement през 2 различни компонента с explicit CSS media queries (Tailwind responsive понякога не сработва тук).

---

## 4. UX и поведение

- **Disabled user-select** и **disabled right-click** на целия сайт. Изключение: `<input>`, `<textarea>`.
- **Modal scroll lock** за iOS Safari: `position: fixed; top: -scrollY; width: 100%`. Само `overflow: hidden` не работи на iOS.
- **Анимациите трябва да работят на iPhone.** iOS юзърите често имат Reduce Motion включен по default — премахвай `@media (prefers-reduced-motion: reduce)` блокове ако спират ключови UI motion-и (бутон pulse, lock animation).
- **Spacing на mobile е по-стегнат**: `py-10 md:py-20` (не `py-14`).
- **Touch targets ≥ 44×44px**.
- **Cursor: pointer** на всичко clickable.
- **Focus rings** видими на интерактивни елементи.

---

## 5. Производителност

- **Цел:** Lighthouse Desktop 100/100/100/100, Mobile ≥ 87.
- **Mobile slow-4G** има ±5–10 точки вариация. Не паникьосвай при една по-ниска проба, пускай 2–3 пъти.
- **PageSpeed Insights** е референтният инструмент, не локалният DevTools.
- Не приемай регресии — `optimizeCss` / Critters ни счупиха билда, върнато.

### Конкретни техники
- `next/image` с `fill` + `sizes` + `loading="lazy"` за всички картинки.
- Lazy-load на тежки скриптове (Wistia `player.js` се зарежда чак след user click).
- CSS се инжектира async през `<Script>` + `<link>`, вместо блокиращ `@import` или `<link rel="stylesheet">`.
- `aspect-ratio: 16 / 9` на video/embed wrapper-и.
- Премахване на framer-motion когато не е критично (~30 KB bundle).
- Self-hosted шрифтове с `font-display: optional`.

---

## 6. Responsive стратегия

- **Tailwind responsive класове (`md:hidden`, `hidden md:flex`) понякога не работят надеждно** при breakpoint switches между видими/скрити блокове.
- В тези случаи — explicit CSS класове в `globals.css` с `@media (min-width: 768px)` и `!important`.
- Понякога mobile и desktop искат **различни компоненти** за един елемент (announce bar), не просто стилови варианти.

---

## 7. Технологичен стек (default)

- Next.js App Router (Turbopack), Tailwind v4.
- `next.config.mjs` с `images.remotePatterns` за външни image hosts.
- Self-hosted alfabet + async Google Fonts (Manrope, Inter).
- Деплой на Vercel, auto-deploy от GitHub `main`.
- `/privacy` и `/terms` като отделни страници, линкнати от footer.
- Cal.com embed за booking, ако е нужно.

---

## 8. Процес и комуникация

- **Бързи итерации**: фиксвай един проблем, push, чакай feedback.
- Реагирай на screenshot-и — потребителят често ще пуска screen + кратка инструкция ("това на 2 реда", "централизирай", "този текст да стане → ...").
- Когато юзърът каже **"оставяме така"** или **"не го прави"** — спираме да оптимизираме. Не пипай работещи неща.
- **Тествай на реален iPhone**, не само DevTools. iOS Safari има различия (scroll lock, Reduce Motion, font rendering).
- **Build грешки от TypeScript** често идват от: липсващи цветове в `DC` палетата, грешни ref types (`HTMLDivElement` vs `HTMLButtonElement`). Чети error log-а внимателно.
- **Не добавяй features извън поисканото.** Без bonus refactor.

---

## 9. Чек-лист за нов сайт

- [ ] Брандова палета дефинирана като TypeScript обект (`DC` или подобно)
- [ ] Self-hosted primary шрифт + async secondary
- [ ] Footer с 3 колони + lamp divider + eyebrow заглавия
- [ ] CTA pulse pill стил + brand glow ефекти
- [ ] Opt-in modal с име+email, floating X, body scroll lock (iOS pattern)
- [ ] FAQ с "+" вместо chevrons
- [ ] Announce bar: статичен mobile / marquee desktop
- [ ] `/privacy` и `/terms` страници, линкнати от footer
- [ ] `next/image` за всички изображения
- [ ] Lazy-load на video/audio плеъри
- [ ] `font-display: optional` + size-adjust
- [ ] `aspect-ratio` на embed контейнери
- [ ] `user-select: none` + блокиран `contextmenu` (без input/textarea)
- [ ] Без `—` (em-dash) в видим текст
- [ ] € не $; "мигновен" не "незабавен"
- [ ] Брой редове проверен mobile + desktop за всеки heading
- [ ] All caps за primary CTA labels
- [ ] Без `prefers-reduced-motion` блокове, които спират ключови анимации
- [ ] Lighthouse mobile ≥ 87, desktop = 100, тествано 2–3 пъти
- [ ] Тествано на реален iPhone
