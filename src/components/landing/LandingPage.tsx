import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  CreditCard,
  Download,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Brand } from "./Brand";
import { DemoDashboard } from "./DemoDashboard";
import { GoalCalculator } from "./GoalCalculator";
import { money } from "./money";
import { ThemeToggle } from "./ThemeToggle";
import "./landing.css";

const links = [
  ["Recursos", "#recursos"],
  ["No celular", "#mobile"],
  ["Cartões", "#cartoes"],
  ["Assistente de IA", "#assistente"],
  ["Segurança", "#seguranca"],
];
const year = new Date().getFullYear();

function StartButton({ children = "Comece agora" }: { children?: React.ReactNode }) {
  return (
    <a className="ff-button" href="#demonstracao">
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}

function AccountAccess({
  href,
  onNavigate,
  onOpenDialog,
}: {
  href?: string;
  onNavigate?: () => void;
  onOpenDialog?: () => void;
}) {
  if (href) {
    return (
      <a className="ff-account-link" href={href} onClick={onNavigate}>
        Acessar minha conta
        <ArrowUpRight size={15} />
      </a>
    );
  }
  return (
    <button
      type="button"
      className="ff-account-link"
      onClick={() => {
        onNavigate?.();
        onOpenDialog?.();
      }}
    >
      Acessar minha conta
      <ArrowUpRight size={15} />
    </button>
  );
}

function Navbar({ accountHref }: { accountHref?: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
        return;
      }
      if (event.key === "Tab" && mobileNav.current && menuButton.current) {
        const focusables = [
          menuButton.current,
          ...Array.from(
            mobileNav.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => el.getClientRects().length > 0),
        ];
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !mobileNav.current?.contains(target) && !menuButton.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 1024) setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return (
    <header className="ff-header">
      <nav className="ff-navbar ff-container" aria-label="Navegação principal">
        <Brand />
        <div className="ff-nav-links">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
        <div className="ff-nav-actions">
          <ThemeToggle />
          <AccountAccess href={accountHref} onOpenDialog={() => dialog.current?.showModal()} />
          <button
            ref={menuButton}
            type="button"
            className="ff-icon-button ff-menu-button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="ff-mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="ff-mobile-backdrop">
          <nav
            ref={mobileNav}
            id="ff-mobile-nav"
            className="ff-mobile-nav"
            aria-label="Navegação móvel"
          >
            <div className="ff-mobile-nav-links">
              {links.map(([label, href]) => (
                <a href={href} key={href} onClick={() => setOpen(false)}>
                  {label}
                  <ChevronRight size={18} />
                </a>
              ))}
            </div>
            <div className="ff-mobile-nav-footer">
              <div className="ff-mobile-theme-row">
                <span>Aparência</span>
                <ThemeToggle />
              </div>
              <AccountAccess
                href={accountHref}
                onNavigate={() => setOpen(false)}
                onOpenDialog={() => dialog.current?.showModal()}
              />
            </div>
          </nav>
        </div>
      )}
      {!accountHref && (
        <dialog ref={dialog} className="ff-account-dialog" aria-labelledby={titleId}>
          <form method="dialog">
            <button type="submit" className="ff-icon-button" aria-label="Fechar acesso à conta">
              <X size={20} />
            </button>
          </form>
          <span className="ff-feature-icon">
            <Wallet size={22} />
          </span>
          <h2 id={titleId}>Seu próximo passo começa por aqui.</h2>
          <p>
            O acesso à conta ainda não está disponível nesta página. Enquanto preparamos essa etapa,
            você pode conhecer o FinFlow em uma demonstração gratuita, sem cadastro.
          </p>
          <button
            className="ff-button"
            type="button"
            onClick={() => {
              dialog.current?.close();
              document.getElementById("demonstracao")?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              });
            }}
          >
            Explorar demonstração
            <ArrowUpRight size={17} />
          </button>
        </dialog>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="ff-hero ff-container" id="inicio">
      <div className="ff-hero-copy">
        <h1>
          O controle total do seu dinheiro, com a{" "}
          <span className="ff-hero-emphasis">simplicidade</span> que você sempre quis.
        </h1>
        <p>
          Organize contas, antecipe faturas de cartão e acompanhe metas financeiras. E se você usa
          inteligência artificial, conecte seu agente favorito para gerenciar tudo por você.
        </p>
        <div className="ff-hero-actions">
          <StartButton />
          <a className="ff-secondary-link" href="#mobile">
            Veja como funciona
            <ArrowRight size={17} />
          </a>
        </div>
        <ul className="ff-hero-proof">
          <li>
            <Check size={15} />
            Sem cadastro
          </li>
          <li>
            <Check size={15} />
            Sem cartão de crédito
          </li>
          <li>
            <Check size={15} />
            No computador e no celular
          </li>
        </ul>
      </div>
      <div className="ff-hero-preview">
        <DemoDashboard />
        <p className="ff-preview-note">
          <ShieldCheck size={14} />
          Dados ilustrativos. Nenhuma conta bancária é acessada.
        </p>
      </div>
    </section>
  );
}

type PhoneScreen = "inicio" | "lancamento" | "cartoes";

const mobileSteps: { id: PhoneScreen; title: string; text: string }[] = [
  {
    id: "inicio",
    title: "Saldo livre num relance",
    text: "Abra o app e veja quanto ainda pode gastar no mês, com cada orçamento em cores.",
  },
  {
    id: "lancamento",
    title: "Um gasto em três toques",
    text: "Toque no + da barra inferior, confirme valor e categoria e siga o seu dia.",
  },
  {
    id: "cartoes",
    title: "Faturas e metas no bolso",
    text: "Limite de cada cartão, próximas parcelas e o progresso da sua reserva.",
  },
];

function PhoneHome({ saved }: { saved: boolean }) {
  return (
    <div className="ff-phone-view">
      <div className="ff-phone-greeting">
        <span className="ff-phone-avatar">D</span>
        <div>
          <small>Bom dia,</small>
          <strong>Daniel</strong>
        </div>
        <span className="ff-phone-bell">
          <Bell size={16} />
        </span>
      </div>

      <div className="ff-phone-balance">
        <small>Saldo livre em novembro</small>
        <strong>{saved ? "R$ 6.388,00" : "R$ 6.420,00"}</strong>
        <span>
          <TrendingUp size={13} />
          +12,8% em relação a outubro
        </span>
      </div>

      <div className="ff-phone-quick">
        <span>
          <i>
            <ArrowDownLeft size={17} />
          </i>
          Receita
        </span>
        <span>
          <i>
            <ArrowUpRight size={17} />
          </i>
          Despesa
        </span>
        <span>
          <i>
            <ArrowLeftRight size={17} />
          </i>
          Transferir
        </span>
        <span>
          <i>
            <Target size={17} />
          </i>
          Metas
        </span>
      </div>

      <div className="ff-phone-card">
        <div className="ff-phone-card-head">
          <strong>Orçamentos</strong>
          <small>2 de 3 no ritmo</small>
        </div>
        <div className="ff-phone-budget">
          <div>
            <span>Alimentação</span>
            <span>{saved ? "67%" : "64%"}</span>
          </div>
          <div className="ff-progress">
            <span className="ff-income-bg" style={{ width: saved ? "67%" : "64%" }} />
          </div>
        </div>
        <div className="ff-phone-budget">
          <div>
            <span>Lazer</span>
            <span>82%</span>
          </div>
          <div className="ff-progress">
            <span className="ff-warning-bg" style={{ width: "82%" }} />
          </div>
        </div>
      </div>

      <div className="ff-phone-list">
        <strong className="ff-phone-list-title">Hoje</strong>
        {saved && (
          <div className="ff-phone-row is-new">
            <span className="ff-phone-row-icon">
              <Wallet size={15} />
            </span>
            <div>
              <strong>Padaria</strong>
              <small>Agora</small>
            </div>
            <strong>− R$ 32,00</strong>
          </div>
        )}
        <div className="ff-phone-row">
          <span className="ff-phone-row-icon">
            <ArrowLeftRight size={15} />
          </span>
          <div>
            <strong>Uber</strong>
            <small>08:45</small>
          </div>
          <strong>− R$ 28,90</strong>
        </div>
        {!saved && (
          <div className="ff-phone-row">
            <span className="ff-phone-row-icon income">
              <ArrowDownLeft size={15} />
            </span>
            <div>
              <strong>Reembolso Pix</strong>
              <small>07:12</small>
            </div>
            <strong className="ff-income">+ R$ 180,00</strong>
          </div>
        )}
      </div>
    </div>
  );
}

function PhoneQuickAdd({ saved, onToggle }: { saved: boolean; onToggle: () => void }) {
  return (
    <div className="ff-phone-view ff-phone-sheet-view">
      <div className="ff-phone-sheet-head">
        <strong>Nova despesa</strong>
        <span>Hoje, 09:41</span>
      </div>
      <div className="ff-phone-amount">
        <small>Valor</small>
        <strong>R$ 32,00</strong>
        <span>Padaria</span>
      </div>
      <div className="ff-phone-field">
        <small>Categoria</small>
        <div className="ff-phone-chips">
          <span className="active">Alimentação</span>
          <span>Transporte</span>
          <span>Lazer</span>
        </div>
      </div>
      <div className="ff-phone-field">
        <small>Pagar com</small>
        <div className="ff-phone-account">
          <CreditCard size={16} />
          <span>Cartão final 4829</span>
          <ChevronRight size={16} />
        </div>
      </div>
      <button type="button" className="ff-phone-confirm" onClick={onToggle}>
        {saved ? <CheckCheck size={17} /> : <Check size={17} />}
        {saved ? "Registrada. Toque para desfazer" : "Registrar despesa"}
      </button>
    </div>
  );
}

function PhoneCards() {
  return (
    <div className="ff-phone-view">
      <div className="ff-phone-sheet-head">
        <strong>Cartões</strong>
        <span>Novembro</span>
      </div>
      <div className="ff-phone-credit">
        <div>
          <span>FinFlow Black</span>
          <CreditCard size={18} />
        </div>
        <small>Fatura aberta</small>
        <strong>R$ 2.384,50</strong>
        <div className="ff-phone-credit-bar">
          <span style={{ width: "24%" }} />
        </div>
        <div>
          <small>Limite livre R$ 7.615,50</small>
          <small>Fecha dia 08</small>
        </div>
      </div>
      <div className="ff-phone-card">
        <div className="ff-phone-card-head">
          <strong>Próximas parcelas</strong>
          <small>3 compras</small>
        </div>
        <div className="ff-phone-installment">
          <span>Dezembro</span>
          <strong>R$ 350,00</strong>
        </div>
        <div className="ff-phone-installment">
          <span>Janeiro</span>
          <strong>R$ 350,00</strong>
        </div>
      </div>
      <div className="ff-phone-card">
        <div className="ff-phone-card-head">
          <strong>Reserva de emergência</strong>
          <small className="ff-income">84%</small>
        </div>
        <div className="ff-progress">
          <span className="ff-income-bg" style={{ width: "84%" }} />
        </div>
        <small className="ff-phone-goal-note">R$ 25.200 de R$ 30.000</small>
      </div>
    </div>
  );
}

function MobileExperience() {
  const [screen, setScreen] = useState<PhoneScreen>("inicio");
  const [saved, setSaved] = useState(false);

  return (
    <section className="ff-section ff-container" id="mobile">
      <div className="ff-mobile-grid">
        <div className="ff-mobile-stage">
          <div className="ff-phone">
            <div className="ff-phone-screen">
              <span className="ff-phone-island" aria-hidden="true" />
              <div className="ff-phone-status" aria-hidden="true">
                <span>9:41</span>
                <span className="ff-phone-signal">
                  <i />
                  <i />
                  <i />
                  <b />
                </span>
              </div>
              <div className="ff-phone-body">
                {screen === "inicio" && <PhoneHome saved={saved} />}
                {screen === "lancamento" && (
                  <PhoneQuickAdd saved={saved} onToggle={() => setSaved(!saved)} />
                )}
                {screen === "cartoes" && <PhoneCards />}
              </div>
              <fieldset className="ff-phone-tabbar" aria-label="Navegação do aplicativo">
                <button
                  type="button"
                  className={screen === "inicio" ? "active" : ""}
                  onClick={() => setScreen("inicio")}
                >
                  <LayoutDashboard size={18} />
                  Início
                </button>
                <button type="button" onClick={() => setScreen("inicio")}>
                  <ArrowLeftRight size={18} />
                  Extrato
                </button>
                <button
                  type="button"
                  className="ff-phone-fab"
                  aria-label="Registrar despesa rápida"
                  onClick={() => setScreen("lancamento")}
                >
                  <Plus size={22} />
                </button>
                <button
                  type="button"
                  className={screen === "cartoes" ? "active" : ""}
                  onClick={() => setScreen("cartoes")}
                >
                  <CreditCard size={18} />
                  Cartões
                </button>
                <button type="button" onClick={() => setScreen("cartoes")}>
                  <Target size={18} />
                  Metas
                </button>
              </fieldset>
              <span className="ff-phone-home" aria-hidden="true" />
            </div>
          </div>
          <div className={`ff-phone-toast ${saved ? "is-visible" : ""}`} aria-live="polite">
            {saved && (
              <>
                <span>
                  <Check size={14} />
                </span>
                Despesa de R$ 32,00 registrada
              </>
            )}
          </div>
        </div>

        <div className="ff-mobile-copy">
          <h2>O FinFlow cabe no bolso.</h2>
          <p>
            No celular, a navegação fica embaixo, ao alcance do polegar, e o botão + registra um
            gasto antes de você guardar o troco.
          </p>
          <fieldset className="ff-mobile-steps" aria-label="Telas do aplicativo">
            {mobileSteps.map((step) => (
              <button
                key={step.id}
                type="button"
                className="ff-mobile-step"
                aria-pressed={screen === step.id}
                onClick={() => setScreen(step.id)}
              >
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </button>
            ))}
          </fieldset>
        </div>
      </div>
    </section>
  );
}

function CardPreview() {
  const [future, setFuture] = useState(false);
  return (
    <div className="ff-card-preview">
      <div className="ff-physical-card" aria-hidden="true">
        <div>
          <span>FinFlow</span>
          <CreditCard size={20} />
        </div>
        <span className="ff-card-chip" />
        <div>
          <span>•••• 4829</span>
          <span>12/29</span>
        </div>
      </div>
      <div className="ff-invoice">
        <div className="ff-invoice-head">
          <span>Próxima fatura</span>
          <span className="ff-badge">{future ? "Dezembro" : "Novembro"}</span>
        </div>
        <strong>{money(future ? 35000 : 128450)}</strong>
        <div className="ff-invoice-row">
          <span>Compras do mês</span>
          <span>{money(future ? 0 : 93450)}</span>
        </div>
        <div className="ff-invoice-row">
          <span>Parcelas previstas</span>
          <span>{money(35000)}</span>
        </div>
        <button type="button" onClick={() => setFuture(!future)}>
          {future ? "Voltar à fatura atual" : "Ver o próximo mês"}
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function BudgetPreview() {
  return (
    <div className="ff-budget-preview">
      {[
        {
          title: "Alimentação",
          amount: "R$ 540 de R$ 900",
          percent: 60,
          color: "income",
          status: "Dentro do planejado",
        },
        {
          title: "Lazer",
          amount: "R$ 410 de R$ 500",
          percent: 82,
          color: "warning",
          status: "Pede atenção",
        },
        {
          title: "Transporte",
          amount: "R$ 580 de R$ 600",
          percent: 97,
          color: "danger",
          status: "Perto do limite",
        },
      ].map((b) => (
        <div className="ff-budget-item" key={b.title}>
          <div>
            <strong>{b.title}</strong>
            <span>{b.amount}</span>
          </div>
          <div className="ff-progress">
            <span className={`ff-${b.color}-bg`} style={{ width: `${b.percent}%` }} />
          </div>
          <span className={`ff-budget-status ff-${b.color}`}>
            {b.percent}% usado, {b.status.toLowerCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

function TelegramPreview() {
  const [sent, setSent] = useState(false);
  return (
    <div className="ff-telegram">
      <div className="ff-chat-heading">
        <span className="ff-chat-avatar">
          <Send size={17} />
        </span>
        <div>
          <strong>FinFlow no Telegram</strong>
          <small>bot conectado</small>
        </div>
      </div>
      <div className="ff-chat-message ff-chat-outgoing">
        45,90 almoço #alimentacao
        <small>
          12:42
          <CheckCheck size={13} />
        </small>
      </div>
      <div className="ff-chat-message ff-chat-incoming">
        <span>
          <Check size={14} />
          Pronto, almoço registrado.
        </span>
        <strong>R$ 45,90</strong>
        <small>Alimentação, dados ilustrativos</small>
      </div>
      {sent && (
        <div className="ff-chat-message ff-chat-incoming" role="status">
          <span>Seu saldo disponível</span>
          <strong>R$ 24.586,50</strong>
          <small>Consulta simulada</small>
        </div>
      )}
      <button type="button" className="ff-chat-input" onClick={() => setSent(!sent)}>
        {sent ? "Reiniciar conversa" : "Experimentar consulta de saldo"}
        <Send size={16} />
      </button>
    </div>
  );
}

function DailyFeatures() {
  return (
    <section className="ff-section ff-container" id="recursos">
      <div className="ff-section-head">
        <h2>
          Menos “para onde foi?”.
          <br />
          Mais “está tudo aqui”.
        </h2>
        <p>
          Do café de hoje aos planos para o ano que vem. Um lugar para entender, organizar e seguir
          em frente.
        </p>
      </div>
      <div className="ff-features-grid">
        <article className="ff-feature-card ff-cards-feature" id="cartoes">
          <div className="ff-feature-copy">
            <span className="ff-feature-icon">
              <CreditCard size={20} />
            </span>
            <h3>Cartões e faturas sem surpresa.</h3>
            <p>
              Saiba o que já comprou e o que ainda vem nas próximas parcelas. O fim do mês não
              precisa ser uma surpresa.
            </p>
          </div>
          <CardPreview />
        </article>
        <article className="ff-feature-card ff-budgets-feature">
          <div className="ff-feature-copy">
            <span className="ff-feature-icon">
              <Wallet size={20} />
            </span>
            <h3>Seu limite, no seu ritmo.</h3>
            <p>
              Veja quanto ainda pode gastar em cada categoria. Cores que ajudam a decidir, sem fazer
              conta de cabeça.
            </p>
          </div>
          <BudgetPreview />
        </article>
        <article className="ff-feature-card ff-message-feature">
          <div className="ff-feature-copy">
            <span className="ff-feature-icon">
              <MessageCircle size={20} />
            </span>
            <h3>Aconteceu. Anotou. Seguiu.</h3>
            <p>
              Lance o gasto na hora, sem esquecer nada. Registre por texto no Telegram, mesmo no
              meio da correria.
            </p>
            <span className="ff-fineprint">Disponível nas instalações com o bot configurado.</span>
          </div>
          <div className="ff-telegram-stage">
            <TelegramPreview />
          </div>
        </article>
      </div>
    </section>
  );
}

const prompts = [
  {
    question: "Quanto ainda posso gastar esta semana?",
    answer:
      "Neste exemplo, restam R$ 360 no seu orçamento de alimentação do mês. Para uma semana tranquila, você pode planejar até R$ 90 nessa categoria.",
    label: "Consultar orçamento",
    value: "R$ 360 disponíveis",
  },
  {
    question: "Adicione 35 reais de almoço.",
    answer:
      "Almoço de R$ 35,00 registrado em Alimentação. O orçamento do mês foi atualizado. Mais um gasto que não ficou para depois.",
    label: "Registrar uma despesa",
    value: "R$ 35,00 em Alimentação",
  },
  {
    question: "Me ajude a entender meus gastos.",
    answer:
      "Neste exemplo, Alimentação está dentro do planejado. Lazer já usou 82% do orçamento, e Transporte está perto do limite. Vale acompanhar essas duas categorias.",
    label: "Olhar o mês com clareza",
    value: "3 categorias analisadas",
  },
] as const;

function AIAssistant() {
  const [selected, setSelected] = useState(0);
  const sample = prompts[selected] ?? prompts[0];
  return (
    <section className="ff-section ff-container" id="assistente">
      <div className="ff-ai-panel">
        <div className="ff-ai-copy">
          <h2>Conecte seu agente de IA via CLI ou MCP</h2>
          <p>
            Prefere conversar em vez de preencher formulários? Conecte seu assistente pessoal, como
            Claude ou agentes locais, para consultar saldos, registrar compras por linguagem natural
            e analisar gastos sem abrir planilhas.
          </p>
          <ul className="ff-ai-benefits">
            <li>
              <Check size={16} />O seu assistente, com o contexto das suas finanças.
            </li>
            <li>
              <Check size={16} />
              Você decide o que quer consultar ou registrar.
            </li>
          </ul>
          <p className="ff-fineprint">
            A conexão depende de um assistente compatível e de configuração na sua instalação. Os
            exemplos ao lado são simulações locais.
          </p>
        </div>
        <div className="ff-ai-chat">
          <div className="ff-chat-heading">
            <span className="ff-chat-avatar">
              <Sparkles size={17} />
            </span>
            <div>
              <strong>Seu assistente financeiro</strong>
              <small>simulação local</small>
            </div>
          </div>
          <fieldset className="ff-prompt-options" aria-label="Exemplos de conversa">
            {prompts.map((p, i) => (
              <button
                key={p.label}
                type="button"
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                {p.label}
              </button>
            ))}
          </fieldset>
          <div className="ff-chat-message ff-chat-outgoing">{sample.question}</div>
          <div className="ff-ai-answer" aria-live="polite">
            <span className="ff-ai-answer-icon">
              <Sparkles size={15} />
            </span>
            <div>
              <p>{sample.answer}</p>
              <span className="ff-ai-answer-result">
                <Check size={13} />
                {sample.value}
              </span>
            </div>
          </div>
          <div className="ff-ai-chat-footer">
            <LockKeyhole size={13} />
            Você está explorando dados ilustrativos.
          </div>
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="ff-section ff-privacy ff-container" id="seguranca">
      <div className="ff-privacy-heading">
        <h2>
          Seu dinheiro.
          <br />
          Seus dados. Suas escolhas.
        </h2>
        <p>
          Tranquilidade também é entender onde suas informações estão e poder levá-las com você.
        </p>
        <a className="ff-text-link" href="#demonstracao">
          Experimente exportar seus dados
          <Download size={16} />
        </a>
      </div>
      <div className="ff-privacy-features">
        {[
          {
            icon: Download,
            title: "Leve seus dados com você",
            text: "Exporte para Excel em CSV ou para ferramentas compatíveis com OFX. Seu histórico pode acompanhar suas escolhas.",
          },
          {
            icon: LockKeyhole,
            title: "Você decide onde guardar",
            text: "Em uma instalação própria, os dados ficam no ambiente que você administra. Você escolhe quem tem acesso.",
          },
          {
            icon: ShieldCheck,
            title: "Clareza antes de qualquer ação",
            text: "Nesta demonstração, tudo acontece no navegador. Nenhuma conta é conectada, nenhum valor é enviado e nenhum pagamento real é feito.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <span className="ff-feature-icon">
              <Icon size={19} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const questions = [
  {
    q: "Preciso entender de tecnologia para usar?",
    a: "Não para organizar suas finanças pela interface visual. Você acompanha contas, cartões, orçamentos e metas no computador ou no celular, sem usar comandos. A conexão com IA e o Telegram são opções extras que dependem de configuração.",
  },
  {
    q: "O FinFlow se conecta automaticamente ao meu banco?",
    a: "Os exemplos mostram contas e cartões cadastrados manualmente. Não há conexão automática com bancos ou Open Finance anunciada nesta página. Você pode exportar seu histórico em CSV ou OFX para ferramentas compatíveis.",
  },
  {
    q: "Como faço para acessar minha conta?",
    a: "No app instalado, use Acessar minha conta para abrir o acesso existente. Esta landing pública ainda não oferece uma conta online. O produto permanece privado e sua abertura está planejada, sem data anunciada. Enquanto isso, explore a demonstração sem cadastro.",
  },
  {
    q: "O que acontece com os valores que eu testar aqui?",
    a: "Os números da demonstração e do simulador ficam apenas nesta página e desaparecem ao recarregar. Não enviamos esses valores para um servidor. A preferência de tema é salva no navegador, quando ele permite.",
  },
];

function FAQ() {
  return (
    <section className="ff-section ff-faq ff-container" id="duvidas">
      <h2>
        Clareza desde
        <br />o primeiro passo.
      </h2>
      <div>
        {questions.map((item) => (
          <details key={item.q}>
            <summary>
              {item.q}
              <Plus size={18} />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
      <section className="ff-final ff-container">
        <div className="ff-final-inner">
          <span className="ff-final-icon">
            <AudioLines size={26} strokeWidth={2.2} />
          </span>
          <h2>
            Mais tranquilidade.
            <br />
            <span>Um passo de cada vez.</span>
          </h2>
          <p>Conheça um jeito mais simples de cuidar do seu dinheiro.</p>
          <StartButton>Comece agora</StartButton>
          <small>Demonstração gratuita. Sem cadastro, sem cartão.</small>
        </div>
      </section>
      <footer className="ff-footer ff-container">
        <div>
          <Brand />
          <p>O dinheiro organizado. Mais espaço para viver.</p>
        </div>
        <div className="ff-footer-links">
          <a href="#recursos">Recursos</a>
          <a href="#mobile">No celular</a>
          <a href="#cartoes">Cartões</a>
          <a href="#assistente">Assistente de IA</a>
          <a href="#seguranca">Privacidade</a>
          <a href="#duvidas">Dúvidas</a>
        </div>
        <div className="ff-footer-bottom">
          <span>© {year} FinFlow. Feito para a vida real.</span>
          <a href="#inicio">
            Voltar ao início
            <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
    </>
  );
}

export function LandingPage({ accountHref }: { accountHref?: string }) {
  return (
    <div className="finflow-landing">
      <a className="ff-skip-link" href="#ff-content">
        Pular para o conteúdo
      </a>
      <Navbar accountHref={accountHref} />
      <main id="ff-content">
        <Hero />
        <MobileExperience />
        <DailyFeatures />
        <GoalCalculator />
        <AIAssistant />
        <Privacy />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
