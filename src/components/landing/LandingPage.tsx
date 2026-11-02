import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  CheckCheck,
  CreditCard,
  Download,
  HeartHandshake,
  LockKeyhole,
  Menu,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
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
  ["Controle de Cartões", "#cartoes"],
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

function AccountAccess({ href }: { href?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      {href ? (
        <a className="ff-account-link" href={href}>
          Acessar minha conta
          <ArrowUpRight size={15} />
        </a>
      ) : (
        <button
          type="button"
          className="ff-account-link"
          onClick={() => dialog.current?.showModal()}
        >
          Acessar minha conta
          <ArrowUpRight size={15} />
        </button>
      )}
      <dialog ref={dialog} className="ff-account-dialog" aria-labelledby={titleId}>
        <form method="dialog">
          <button type="submit" className="ff-icon-button" aria-label="Fechar acesso à conta">
            <X size={20} />
          </button>
        </form>
        <span className="ff-feature-icon">
          <Wallet size={24} />
        </span>
        <h2 id={titleId}>
          Seu próximo passo
          <br />
          começa por aqui.
        </h2>
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
    </>
  );
}

function Navbar({ accountHref }: { accountHref?: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
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
          <AccountAccess href={accountHref} />
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
        <nav id="ff-mobile-nav" className="ff-mobile-nav" aria-label="Navegação móvel">
          {links.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={16} />
            </a>
          ))}
          <AccountAccess href={accountHref} />
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="ff-hero ff-container" id="inicio">
      <div className="ff-hero-copy">
        <span className="ff-kicker">
          <span className="ff-status-dot" />
          MENOS PREOCUPAÇÃO. MAIS VIDA.
        </span>
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
          <a className="ff-secondary-link" href="#recursos">
            Veja como funciona
            <ArrowRight size={17} />
          </a>
        </div>
        <p className="ff-hero-microcopy">
          <Check size={14} />
          Explore a demonstração. Sem cadastro, sem cartão.
        </p>
        <div className="ff-hero-note">
          <span>
            <HeartHandshake size={20} />
          </span>
          <p>
            O dinheiro organizado.
            <br />
            <strong>A cabeça mais leve.</strong>
          </p>
        </div>
      </div>
      <div className="ff-hero-preview">
        <div className="ff-preview-label">
          <span className="ff-status-dot" />
          EXPERIMENTE COM DADOS ILUSTRATIVOS<span>Feito para a vida real</span>
        </div>
        <DemoDashboard />
        <div className="ff-preview-note">
          <ShieldCheck size={13} />
          Apenas uma demonstração. Nenhuma conta bancária é acessada.
        </div>
      </div>
    </section>
  );
}

function CardPreview() {
  const [future, setFuture] = useState(false);
  return (
    <div className="ff-card-preview">
      <div className="ff-physical-card">
        <span>
          Seu cartão
          <CreditCard size={24} />
        </span>
        <div className="ff-card-chip" />
        <span>
          •••• 4829<span>FinFlow</span>
        </span>
      </div>
      <div className="ff-invoice">
        <div>
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
          <ArrowRight size={14} />
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
          status: "Um pouco de atenção",
        },
        {
          title: "Transporte",
          amount: "R$ 580 de R$ 600",
          percent: 97,
          color: "danger",
          status: "Perto do limite",
        },
      ].map((b) => (
        <div key={b.title}>
          <div>
            <strong>{b.title}</strong>
            <span>{b.amount}</span>
          </div>
          <div className="ff-progress">
            <span className={`ff-${b.color}-bg`} style={{ width: `${b.percent}%` }} />
          </div>
          <span className={`ff-${b.color}`}>
            {b.percent}% utilizado · {b.status}
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
        <span className="ff-feature-icon">
          <Send size={20} />
        </span>
        <div>
          <strong>FinFlow no Telegram</strong>
          <small>O gasto anotado, a vida seguindo.</small>
        </div>
      </div>
      <div className="ff-chat-message ff-chat-outgoing">
        45,90 almoço #alimentacao
        <small>
          12:42
          <CheckCheck size={12} />
        </small>
      </div>
      <div className="ff-chat-message ff-chat-incoming">
        <span>
          <Check size={14} />
          Pronto, almoço registrado.
        </span>
        <strong>R$ 45,90</strong>
        <small>Alimentação · Dados ilustrativos</small>
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
      <div className="ff-section-heading">
        <div>
          <span className="ff-kicker">PARA O SEU DIA A DIA</span>
          <h2>
            Menos “para onde foi?”.
            <br />
            Mais “está tudo aqui”.
          </h2>
        </div>
        <p>
          Do café de hoje aos planos para o ano que vem. Um lugar para entender, organizar e seguir
          em frente.
        </p>
      </div>
      <div className="ff-features-grid">
        <article className="ff-feature-card ff-cards-feature" id="cartoes">
          <div className="ff-feature-copy">
            <span className="ff-feature-icon">
              <CreditCard size={22} />
            </span>
            <h3>
              Cartões e faturas
              <br />
              sem surpresa.
            </h3>
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
              <Wallet size={22} />
            </span>
            <h3>
              Seu limite.
              <br />
              No seu ritmo.
            </h3>
            <p>
              Veja quanto ainda pode gastar em cada categoria. Cores que ajudam a decidir, sem
              precisar fazer conta de cabeça.
            </p>
          </div>
          <BudgetPreview />
        </article>
        <article className="ff-feature-card ff-message-feature">
          <div className="ff-feature-copy">
            <span className="ff-feature-icon">
              <MessageCircle size={22} />
            </span>
            <h3>
              Aconteceu.
              <br />
              Anotou. Seguiu.
            </h3>
            <p>
              Lançou o gasto na hora, sem esquecer nada. Registre por texto no Telegram, mesmo no
              meio da correria.
            </p>
            <span className="ff-fineprint">Disponível nas instalações com o bot configurado.</span>
          </div>
          <TelegramPreview />
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
    value: "R$ 35,00 · Alimentação",
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
          <span className="ff-kicker">
            <Sparkles size={15} />
            UM NOVO JEITO DE CUIDAR DAS CONTAS
          </span>
          <h2>Conecte seu agente de IA via CLI ou MCP</h2>
          <p>
            Prefere conversar em vez de preencher formulários? Conecte seu assistente pessoal, como
            Claude ou agentes locais, para consultar saldos, registrar compras por linguagem natural
            e analisar gastos sem abrir planilhas.
          </p>
          <div className="ff-ai-benefit">
            <Check size={16} />O seu assistente. Com o contexto das suas finanças.
          </div>
          <div className="ff-ai-benefit">
            <Check size={16} />
            Você decide o que quer consultar ou registrar.
          </div>
          <p className="ff-fineprint">
            A conexão depende de um assistente compatível e de configuração na sua instalação. Os
            exemplos ao lado são simulações locais.
          </p>
        </div>
        <div className="ff-ai-chat">
          <div className="ff-chat-heading">
            <span className="ff-feature-icon">
              <Sparkles size={20} />
            </span>
            <div>
              <strong>Seu assistente financeiro</strong>
              <small>Uma conversa que traz clareza.</small>
            </div>
            <span className="ff-badge">Demonstração</span>
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
              <Sparkles size={17} />
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
        <span className="ff-kicker">O CONTROLE TAMBÉM É SEU</span>
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
          <Download size={17} />
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
              <Icon size={21} />
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
    a: "Não para organizar suas finanças pela interface visual. Você acompanha contas, cartões, orçamentos e metas sem usar comandos. A conexão com IA e o Telegram são opções extras que dependem de configuração.",
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
      <div>
        <span className="ff-kicker">PODE PERGUNTAR</span>
        <h2>
          Clareza desde
          <br />o primeiro passo.
        </h2>
      </div>
      <div>
        {questions.map((item) => (
          <details key={item.q}>
            <summary>
              {item.q}
              <Plus size={19} />
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
        <span className="ff-final-icon">
          <AudioLines size={30} />
        </span>
        <h2>
          Mais tranquilidade.
          <br />
          <span>Um passo de cada vez.</span>
        </h2>
        <p>Conheça um jeito mais simples de cuidar do seu dinheiro.</p>
        <StartButton>Comece agora</StartButton>
        <small>Demonstração gratuita. Sem cadastro, sem cartão.</small>
      </section>
      <footer className="ff-footer ff-container">
        <div>
          <Brand />
          <p>
            O dinheiro organizado.
            <br />
            Mais espaço para viver.
          </p>
        </div>
        <div className="ff-footer-links">
          <a href="#recursos">Recursos</a>
          <a href="#cartoes">Cartões</a>
          <a href="#assistente">Assistente de IA</a>
          <a href="#seguranca">Privacidade</a>
          <a href="#duvidas">Dúvidas</a>
        </div>
        <div className="ff-footer-bottom">
          <span>© {year} FinFlow. Feito para a vida real.</span>
          <span>Uma demonstração. Muitas possibilidades.</span>
          <a href="#inicio">
            De volta ao início
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
        <div className="ff-promise-strip ff-container">
          <span>
            <Check size={16} />
            Suas contas em um só lugar
          </span>
          <span>
            <Check size={16} />
            Faturas sob controle
          </span>
          <span>
            <Check size={16} />
            Um plano para suas metas
          </span>
        </div>
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
