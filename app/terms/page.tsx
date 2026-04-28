import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Общи условия",
  description: "Общи условия за използване на услугите на AI Brand Scale — Република България.",
  alternates: { canonical: "https://aibrandscale.io/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "Април 2026 г.";
const CONTACT_EMAIL = "venelinyordanov@visionstudios.services";
const COMPANY = "AI Brand Scale";

const sectionWrap: React.CSSProperties = { marginTop: 44, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)" };
const sectionNum: React.CSSProperties = {
  fontFamily: "Manrope, sans-serif",
  fontSize: 11,
  letterSpacing: "0.18em",
  color: "rgba(255,255,255,0.4)",
  marginBottom: 10,
};
const h2Style: React.CSSProperties = {
  fontFamily: "alfabet, sans-serif",
  fontWeight: 800,
  fontSize: "clamp(22px, 2.4vw, 30px)",
  letterSpacing: "-0.01em",
  marginBottom: 16,
  color: "#F9F9F9",
};
const h3Style: React.CSSProperties = {
  fontFamily: "Manrope, sans-serif",
  fontWeight: 700,
  fontSize: 15,
  marginTop: 18,
  marginBottom: 8,
  color: "#F9F9F9",
};
const pStyle: React.CSSProperties = {
  fontFamily: "Manrope, sans-serif",
  fontSize: 15,
  lineHeight: 1.7,
  color: "#C8CAD0",
  margin: "10px 0",
};
const accent = { color: "#C49BD9" };

export default function TermsPage() {
  return (
    <main className="relative px-6 py-16 md:py-20">
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/" style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#C49BD9", textDecoration: "none" }}>
            ← Обратно към началото
          </Link>
        </div>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "Manrope, sans-serif",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#C49BD9",
          marginBottom: 18,
        }}>
          <span style={{ width: 18, height: 1, background: "#C49BD9" }} />
          Правна информация
        </div>

        <h1 style={{
          fontFamily: "alfabet, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(34px, 5vw, 56px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          margin: "0 0 14px",
          color: "#FFFFFF",
        }}>
          Общи условия
        </h1>
        <p style={{ ...pStyle, color: "#9DA0A8", marginBottom: 12 }}>
          Последна актуализация: {LAST_UPDATED}
        </p>

        <section style={{ ...sectionWrap, borderTop: "none", paddingTop: 8, marginTop: 24 }}>
          <div style={sectionNum}>01</div>
          <h2 style={h2Style}>Общи условия</h2>
          <p style={pStyle}>
            Този уебсайт („Сайтът") се управлява от {COMPANY} („Компанията", „ние", „нас" или „наш"). Като осъществявате достъп до или използвате Сайта, вие се съгласявате да бъдете обвързани с тези Общи условия и Политиката ни за поверителност.
          </p>
          <p style={pStyle}>
            Можем да актуализираме тези Условия по всяко време. Актуализациите ще бъдат публикувани тук. Продължаването на използването на Сайта след промените означава, че приемате актуализираните Условия.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>02</div>
          <h2 style={h2Style}>Права върху интелектуалната собственост</h2>
          <p style={pStyle}>
            Цялото съдържание на Сайта, включително видеа, текстове, графики, лога, изображения и материали за изтегляне, е собственост на {COMPANY} или на нашите партньори и лицензодатели. Това съдържание е защитено от законодателството за авторски права, търговски марки и друга интелектуална собственост.
          </p>
          <p style={pStyle}>
            Предоставяме ви ограничен, неизключителен, непрехвърляем лиценз за <strong style={{ color: "#F9F9F9" }}>лична, нетърговска употреба</strong>. Нямате право да възпроизвеждате, модифицирате, разпространявате или търговски да използвате нашето съдържание без предварителното писмено съгласие.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>03</div>
          <h2 style={h2Style}>Съдържание, подадено от потребители</h2>
          <p style={pStyle}>
            Когато подавате съдържание (напр. коментари, препоръки, качени файлове), вие ни предоставяте <strong style={{ color: "#F9F9F9" }}>световен, безвъзмезден, постоянен лиценз</strong> да го използваме, възпроизвеждаме, разпространяваме, показваме и адаптираме на тази платформа.
          </p>
          <p style={pStyle}>
            Вие декларирате, че притежавате необходимите права и че съдържанието ви не нарушава законни или права на трети страни.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>04</div>
          <h2 style={h2Style}>Отказ от отговорност за доходи</h2>
          <p style={pStyle}>
            Ние не даваме <strong style={{ color: "#F9F9F9" }}>никакви гаранции</strong> за доходи или конкретни резултати. Всички примери, препоръки или казуси не са типични и не обещават, че постигнете подобни резултати.
          </p>
          <p style={pStyle}>
            Вашият успех зависи от много фактори извън нашия контрол, включително усилия, опит и пазарни условия. Използвайте нашето съдържание на свой риск.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>05</div>
          <h2 style={h2Style}>Препоръки и отзиви</h2>
          <p style={pStyle}>
            Препоръките, показани на Сайта, представляват реален опит на клиенти, но <strong style={{ color: "#F9F9F9" }}>не са гаранция</strong> за постигане на същите или подобни резултати от ваша страна.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>06</div>
          <h2 style={h2Style}>Записване и участие в обучения</h2>
          <h3 style={h3Style}>Допустимост</h3>
          <p style={pStyle}>
            Като се записвате за наши обучения и събития, вие декларирате, че сте навършили 18 години или участвате със знанието и съгласието на родител или законен настойник. Безплатните обучения и събитията са за индивидуална употреба гостите и материалите не могат да бъдат споделяни. Запазваме си правото да откажем участие или оттеглим достъпи, когато е необходимо.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>07</div>
          <h2 style={h2Style}>Платени продукти и политика за възстановяване</h2>
          <p style={pStyle}>
            {COMPANY} се стреми към удовлетвореност на клиентите. При бъдещи платени продукти условията за възстановяване на суми ще бъдат посочени конкретно за всеки продукт.
          </p>
          <p style={pStyle}>
            За заявки за възстановяване се свържете с нас на <a href={`mailto:${CONTACT_EMAIL}`} style={accent}>{CONTACT_EMAIL}</a>, като посочвате вашето име и имейл адреса, с които сте направили покупката. Възстановяванията се извършват по оригинал начин на плащане. Сроковете за обработка зависят от вашата банка или доставчик на плащане (обикновено 5–10 работни дни).
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>08</div>
          <h2 style={h2Style}>Промоции и томболи</h2>
          <p style={pStyle}>
            От време на време можем да провеждаме промоции или томболи. Конкретните детайли ще бъдат обявени по време на съответното събитие. Участието в томболи е отворено за лица, навършили 18 години, с изключение там, където е забранено от закона.
          </p>
          <p style={pStyle}>
            Победителите се избират на случаен принцип сред отговарящите на условията участници. Решенията на {COMPANY} относно избора на победители са окончателни и задължителни.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>09</div>
          <h2 style={h2Style}>Правила на общността</h2>
          <p style={pStyle}>
            Можем да поддържаме частни групи, чатове или форуми. Изисква се уважително поведение. Запазваме си правото да отстраним всеки участник, който нарушава стандартите на общността, без право на възстановяване.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>10</div>
          <h2 style={h2Style}>Ограничаване на отговорността</h2>
          <p style={pStyle}>
            Нашият Сайт, продукти и услуги се предоставят „такъва, каквото са" без каквито и да е гаранции. Отхвърляме всякаква отговорност за преки, косвени, случайни или последствени щети.
          </p>
          <p style={pStyle}>
            Ние не предоставяме инвестиционни, правни, данъчни или финансови съвети. Всички материали са само с образователна цел. Консултирайте се с лицензирани специалисти, преди да вземете решения.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>11</div>
          <h2 style={h2Style}>Регистрация и сигурност</h2>
          <p style={pStyle}>
            Съгласявате се да предоставите точна информация при регистрация и да пазите данните си за вход в сигурност. Вие носите отговорност за всички дейности под вашия акаунт.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>12</div>
          <h2 style={h2Style}>Приложимо право и разрешаване на спорове</h2>
          <p style={pStyle}>
            Тези Условия се уреждат от законодателството на <strong style={{ color: "#F9F9F9" }}>Република България</strong> и приложимото законодателство на Европейския съюз. Всякакви спорове се решават чрез взаимно съгласие или пред компетентен съд в България, освен ако приложимото законодателство за защита на потребителите не предвижда друго.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>13</div>
          <h2 style={h2Style}>DMCA и авторски права</h2>
          <p style={pStyle}>
            Ако смятате, че съдържание на Сайта нарушава вашите авторски права, моля изпратете известие на <a href={`mailto:${CONTACT_EMAIL}`} style={accent}>{CONTACT_EMAIL}</a>.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>14</div>
          <h2 style={h2Style}>Контакт</h2>
          <p style={pStyle}>
            При въпроси относно тези Общи условия, пишете ни на <a href={`mailto:${CONTACT_EMAIL}`} style={accent}>{CONTACT_EMAIL}</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
