import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/page";

Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

describe("AI Brand Scale landing page", () => {
  it("renders the verbatim hero copy from aibrandscale.io", () => {
    render(<Page />);
    expect(screen.getByText(/AI рекламното умение/)).toBeInTheDocument();
    expect(screen.getByText(/пред компютъра от 10 години/)).toBeInTheDocument();
    expect(screen.getByText(/обикновени хора изграждат/)).toBeInTheDocument();
    expect(screen.getByText(/изгледай видеото внимателно/)).toBeInTheDocument();
    expect(screen.getByText(/Заключено · 18:42/)).toBeInTheDocument();
  });

  it("renders all major section headings", () => {
    render(<Page />);
    expect(screen.getByText(/Старият път vs\. AI рекламата/)).toBeInTheDocument();
    expect(screen.getByText(/Какво ще откриеш вътре\?/)).toBeInTheDocument();
    expect(screen.getByText(/Защо точно сега/)).toBeInTheDocument();
    expect(screen.getByText(/изгради това от нулата/)).toBeInTheDocument();
    expect(screen.getByText(/8 модула до първия клиент/)).toBeInTheDocument();
    expect(screen.getByText(/Какво казват нашите студенти/)).toBeInTheDocument();
    expect(screen.getByText(/Често задавани въпроси/)).toBeInTheDocument();
  });

  it("includes Facebook/Meta legal disclaimer in footer", () => {
    render(<Page />);
    expect(
      screen.getByText(/Този сайт не е част от Facebook или Meta Platforms/)
    ).toBeInTheDocument();
  });

  it("renders trust pills (Начинаещи / 4.9/5 / Гледаш веднага)", () => {
    render(<Page />);
    expect(screen.getAllByText("Начинаещи").length).toBeGreaterThan(0);
    expect(screen.getByText(/Оценка 4\.9\/5/)).toBeInTheDocument();
    expect(screen.getByText(/Гледаш веднага/)).toBeInTheDocument();
  });

  it("opens opt-in modal when CTA is clicked and validates email", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const ctas = screen.getAllByRole("button", { name: /Отключи видеото/i });
    await user.click(ctas[0]);
    const dialog = await screen.findByRole("dialog");
    const u = within(dialog);

    await user.type(u.getByLabelText(/^Име$/), "Иван");
    await user.type(u.getByLabelText(/^Имейл$/), "not-an-email");
    fireEvent.click(u.getByRole("checkbox"));
    fireEvent.submit(u.getByLabelText(/^Имейл$/).closest("form")!);

    expect(await u.findByRole("alert")).toHaveTextContent(/Невалиден имейл/);
  });

  it("modal succeeds with valid input", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const ctas = screen.getAllByRole("button", { name: /Отключи видеото/i });
    await user.click(ctas[0]);
    const dialog = await screen.findByRole("dialog");
    const u = within(dialog);

    await user.type(u.getByLabelText(/^Име$/), "Иван");
    await user.type(u.getByLabelText(/^Имейл$/), "ivan@example.com");
    fireEvent.click(u.getByRole("checkbox"));
    fireEvent.submit(u.getByLabelText(/^Имейл$/).closest("form")!);

    expect(await u.findByText(/Готово!/, {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it("renders the Comparison section with old-way / new-way bullets", () => {
    render(<Page />);
    expect(screen.getByText(/\$1K–\$5K минимум/)).toBeInTheDocument();
    expect(screen.getByText(/Една промяна в алгоритъма/)).toBeInTheDocument();
    expect(screen.getByText(/AI премахна 10-годишния опит/)).toBeInTheDocument();
  });

  it("renders the Discover section with the 3 numbered items", () => {
    render(<Page />);
    expect(screen.getByText(/Рамката .{1,3}AI Edge/)).toBeInTheDocument();
    expect(screen.getByText(/Базови AI реклами/)).toBeInTheDocument();
    expect(screen.getByText(/Вътрешна информация/)).toBeInTheDocument();
  });

  it("renders the Why-now editorial section", () => {
    render(<Page />);
    expect(screen.getByText(/Малки бизнеси с AI реклами/)).toBeInTheDocument();
    expect(screen.getByText(/12.18 месеца/)).toBeInTheDocument();
    expect(screen.getByText(/97% от пазара/)).toBeInTheDocument();
  });

  it("expands FAQ items on click", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const q = screen.getByRole("button", { name: /Имам ли нужда от опит/ });
    expect(q).toHaveAttribute("aria-expanded", "false");
    await user.click(q);
    expect(q).toHaveAttribute("aria-expanded", "true");
  });

  it("has anchor targets for nav sections", () => {
    const { container } = render(<Page />);
    ["izborut", "kakvo-shte-otkriesh", "zashto-sega", "ot-kogo", "moduli", "rezultati", "chzv"].forEach((id) => {
      expect(container.querySelector(`#${id}`)).toBeTruthy();
    });
  });
});
