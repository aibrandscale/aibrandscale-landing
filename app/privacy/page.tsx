import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика за поверителност · AI Brand Scale",
  description: "Как AI Brand Scale събира, използва и защитава личните ви данни.",
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
const ulStyle: React.CSSProperties = {
  margin: "10px 0",
  paddingLeft: 22,
  fontFamily: "Manrope, sans-serif",
  fontSize: 15,
  lineHeight: 1.75,
  color: "#C8CAD0",
};
const accent = { color: "#C49BD9" };

export default function PrivacyPage() {
  return (
    <main className="relative px-6 py-16 md:py-20">
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/" style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#C49BD9", textDecoration: "none" }}>
            ← Обратно към началото
          </Link>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "Manrope, sans-serif",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#C49BD9",
            marginBottom: 18,
          }}
        >
          <span style={{ width: 18, height: 1, background: "#C49BD9" }} />
          Правна информация
        </div>

        <h1
          style={{
            fontFamily: "alfabet, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(34px, 5vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 14px",
            color: "#FFFFFF",
          }}
        >
          Политика за поверителност
        </h1>
        <p style={{ ...pStyle, color: "#9DA0A8", marginBottom: 12 }}>
          Последна актуализация: {LAST_UPDATED}
        </p>

        <section style={{ ...sectionWrap, borderTop: "none", paddingTop: 8, marginTop: 24 }}>
          <div style={sectionNum}>01</div>
          <h2 style={h2Style}>Цел на тази политика</h2>
          <p style={pStyle}>
            {COMPANY} („ние", „нас" или „наш") уважава вашата поверителност и се ангажира да
            защитава личните ви данни. Тази политика обяснява как събираме, използваме и пазим
            информацията ви, когато посещавате нашия уебсайт <a href="https://aibrandscale.io" style={accent}>aibrandscale.io</a>, записвате се за наши обучения или по друг начин взаимодействате с нас.
          </p>
          <p style={pStyle}>
            Нашите услуги не са предназначени за деца. Ние не събираме съзнателно данни от лица под
            16 години и спазваме минималните изисквания за правна дееспособност в приложимите
            юрисдикции.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>02</div>
          <h2 style={h2Style}>Важна информация</h2>
          <p style={pStyle}>
            Тази политика се прилага за всички лични данни, събирани чрез уебсайта, събитията и
            услугите на {COMPANY}. Не събираме съзнателно лични данни от лица под 16 години. При
            установяване на такива данни без подходящо съгласие, ги изтриваме незабавно.
          </p>
          <p style={pStyle}>
            Имате право да подадете жалба до Комисията за защита на личните данни (КЗЛД) на
            България. Въпреки това бихме оценили възможността да разрешим проблема директно с вас,
            преди да се свържете с тях.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>03</div>
          <h2 style={h2Style}>Данни за контакт</h2>
          <p style={pStyle}>
            При въпроси относно тази политика или обработването на личните ви данни, свържете се с
            нас:
          </p>
          <ul style={ulStyle}>
            <li>Търговско наименование: {COMPANY}</li>
            <li>Имейл: <a href={`mailto:${CONTACT_EMAIL}`} style={accent}>{CONTACT_EMAIL}</a></li>
          </ul>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>04</div>
          <h2 style={h2Style}>Информацията, която събираме</h2>

          <h3 style={h3Style}>Информация, която предоставяте директно:</h3>
          <ul style={ulStyle}>
            <li>Имейл адрес при записване за обучения или събития.</li>
            <li>Име и информация за контакт при попълване на формуляри.</li>
            <li>Информация при попълване на анкети, формуляри за обратна връзка или заявки за поддръжка.</li>
          </ul>

          <h3 style={h3Style}>Информация, събирана автоматично:</h3>
          <ul style={ulStyle}>
            <li>IP адрес, тип и версия на браузър, операционна система.</li>
            <li>Данни за използване посетени страници, препращащи страници, активност в сесията.</li>
            <li>Аналитични данни чрез инструментите на трети страни (напр. Google Analytics) за подобряване на услугите.</li>
          </ul>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>05</div>
          <h2 style={h2Style}>Как използваме информацията ви</h2>
          <p style={pStyle}>
            Използваме личните данни, за да ви изпратим потвърждение за записване, да предоставим
            достъп до обучителното съдържание, да комуникираме актуализации и нови предложения, и
            да подобряваме нашия уебсайт и услуги.
          </p>
          <p style={pStyle}>
            Можем да обработваме данните ви и в спазване на законови задължения или в отговор на
            законни искания от страна на органите на властта.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>06</div>
          <h2 style={h2Style}>Правни основания за обработване</h2>
          <ul style={ulStyle}>
            <li><strong style={{ color: "#F9F9F9" }}>Изпълнение на договор</strong> за да ви предоставим достъп до услуги и обучения.</li>
            <li><strong style={{ color: "#F9F9F9" }}>Законово задължение</strong> данъчни, счетоводни и регулаторни изисквания.</li>
            <li><strong style={{ color: "#F9F9F9" }}>Легитимен интерес</strong> подобряване на услугите, предотвратяване на злоупотреби, поддържане на сигурността.</li>
            <li><strong style={{ color: "#F9F9F9" }}>Съгласие</strong> за маркетингови комуникации, когато се изисква от закона.</li>
          </ul>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>07</div>
          <h2 style={h2Style}>Маркетинг и комуникации</h2>
          <p style={pStyle}>
            Можем да използваме имейла ви, за да изпращаме информация за бъдещи обучения, AI ресурси
            и предложения, които могат да бъдат полезни.
          </p>
          <p style={pStyle}>
            Можете да се откажете от маркетинговите имейли по всяко време чрез линка за отписване в
            имейла или като се свържете с нас на <a href={`mailto:${CONTACT_EMAIL}`} style={accent}>{CONTACT_EMAIL}</a>. Отписването не засяга служебните комуникации (напр. потвърждения за записване).
          </p>
          <p style={pStyle}>
            Няма да споделяме личните ви данни с трети страни за маркетингови цели без изричното ви
            съгласие.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>08</div>
          <h2 style={h2Style}>Бисквитки (Cookies)</h2>
          <p style={pStyle}>
            Използваме бисквитки и подобни технологии за подобряване на потребителското изживяване,
            анализ на трафика и показване на релевантно съдържание. Можете да откажете или
            деактивирате бисквитките чрез настройките на браузъра си, въпреки че някои функции на
            сайта може да не работят правилно без тях.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>09</div>
          <h2 style={h2Style}>Споделяне на информацията ви</h2>
          <p style={pStyle}>Ние не продаваме личните ви данни. Можем да ги споделяме:</p>
          <ul style={ulStyle}>
            <li>С доставчици на услуги, подписващи задълженията ни, обвързани с договори за поверителност.</li>
            <li>В анонимизирана или агрегирана форма, която не може да ви идентифицира.</li>
            <li>Когато се изисква по законов или правен процес.</li>
            <li>За защита на правата, собствеността или безопасността на {COMPANY}, нашите потребители или трети страни.</li>
          </ul>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>10</div>
          <h2 style={h2Style}>Международни трансфери на данни</h2>
          <p style={pStyle}>
            При прехвърляне на лични данни извън ЕИП или ЕС, гарантираме наличието на подходящи
            защитни мерки, като <strong style={{ color: "#F9F9F9" }}>Стандартни договорни клаузи (SCC)</strong>, одобрени от Европейската комисия, или равностойни механизми
            съгласно приложимото законодателство.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>11</div>
          <h2 style={h2Style}>Сигурност и съхранение на данните</h2>
          <p style={pStyle}>
            Прилагаме технически и организационни мерки за защита на личните ви данни от
            неоторизиран достъп, промяна, разкриване или унищожаване.
          </p>
          <p style={pStyle}>
            Съхраняваме личните данни толкова дълго, колкото е необходимо за изпълнение на целите,
            посочени в тази политика. Когато данните вече не са необходими, ги изтриваме сигурно
            или анонимизираме.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>12</div>
          <h2 style={h2Style}>Вашите права за защита на данните</h2>
          <p style={pStyle}>Съгласно GDPR и приложимото българско законодателство имате право да:</p>
          <ul style={ulStyle}>
            <li>Получите достъп, коригирате или изтриете личните си данни.</li>
            <li>Възразите срещу или ограничите обработването на данните си.</li>
            <li>Поискате преносимост на данните.</li>
            <li>Оттеглите съгласието си по всяко време (без да засяга предходно законно обработване).</li>
            <li>Подадете жалба пред КЗЛД.</li>
          </ul>
          <p style={pStyle}>
            Ще отговорим на всички заявки в рамките на <strong style={{ color: "#F9F9F9" }}>един месец</strong>. Заявки можете да изпращате на <a href={`mailto:${CONTACT_EMAIL}`} style={accent}>{CONTACT_EMAIL}</a>.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>13</div>
          <h2 style={h2Style}>Поверителност на децата</h2>
          <p style={pStyle}>
            Не събираме съзнателно лични данни от лица под 16 години. При установяване на такива
            данни без подходящо съгласие, ги изтриваме незабавно.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>14</div>
          <h2 style={h2Style}>Връзки към трети страни</h2>
          <p style={pStyle}>
            Уебсайтът ни може да съдържа връзки към уебсайтове или услуги на трети страни. Ние не
            носим отговорност за практиките за поверителност на тези трети страни и използването им
            е на ваш риск.
          </p>
        </section>

        <section style={sectionWrap}>
          <div style={sectionNum}>15</div>
          <h2 style={h2Style}>Промени в тази политика</h2>
          <p style={pStyle}>
            {COMPANY} може да актуализира тази политика от време на време. Продължаването на
            използването на нашите услуги след промени означава приемане на актуализираната
            политика. Датата на последна актуализация винаги е посочена в началото на документа.
          </p>
        </section>

        <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ ...pStyle, fontSize: 13 }}>
            Ако имате въпроси, пишете ни на <a href={`mailto:${CONTACT_EMAIL}`} style={accent}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
