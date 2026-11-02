import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bot,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Code2,
  Command,
  CreditCard,
  Download,
  Fingerprint,
  GitFork,
  Globe2,
  Landmark,
  LayoutDashboard,
  Menu,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { money, monthlyContribution } from "./lib/money";

const repository = "https://github.com/danielharrisonlf/finflow-landing";
const currentYear = new Date().getFullYear();
const navigation = [
  ["Recursos", "#recursos"],
  ["Interfaces", "#interfaces"],
  ["Arquitetura", "#arquitetura"],
  ["Casos de uso", "#depoimentos"],
  ["FAQ", "#faq"],
];
const photo = (id: string, width = 100) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="FinFlow, início">
      <span className="brand-icon">
        <AudioLines size={23} strokeWidth={2.5} />
      </span>
      finflow<span className="brand-dot">.</span>
    </a>
  );
}
function Button({
  children,
  href = "#demonstracao",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a className="button button-primary" href={href}>
      {children}
      <span className="button-icon">
        <ArrowUpRight size={17} />
      </span>
    </a>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
function SectionHeading({
  label,
  title,
  text,
}: {
  label: string;
  title: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="section-heading reveal">
      <Eyebrow>{label}</Eyebrow>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-wrap">
      <nav className="navbar" aria-label="Principal">
        <Brand />
        <div className="nav-links">
          {navigation.map(([name, href]) => (
            <a href={href} key={name}>
              {name}
            </a>
          ))}
        </div>
        <a className="nav-cta" href="#demonstracao">
          Experimentar
          <span>
            <ArrowUpRight size={15} />
          </span>
        </a>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div id="mobile-nav" className="mobile-nav">
          {navigation.map(([name, href]) => (
            <a href={href} key={name} onClick={() => setOpen(false)}>
              {name}
              <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

const initialTransactions = [
  {
    name: "Projeto freelance",
    category: "Receita · Trabalho",
    amount: 850000,
    icon: Code2,
    color: "green",
  },
  {
    name: "Mercado da semana",
    category: "Despesa · Alimentação",
    amount: -28690,
    icon: Wallet,
    color: "rose",
  },
  {
    name: "Assinatura de software",
    category: "Despesa · Tecnologia",
    amount: -8990,
    icon: Command,
    color: "violet",
  },
];
function Dashboard() {
  const [tab, setTab] = useState("Visão geral");
  const [period, setPeriod] = useState("Novembro");
  const [added, setAdded] = useState(false);
  const transactions = added
    ? [
        {
          name: "Café com a equipe",
          category: "Despesa · Alimentação",
          amount: -2450,
          icon: Wallet,
          color: "amber",
        },
        ...initialTransactions,
      ]
    : initialTransactions;
  const october = period === "Outubro";
  const balance = (october ? 2180300 : 2458650) - (added ? 2450 : 0);
  function exportCsv() {
    const content =
      "\uFEFFDescrição;Categoria;Valor\n" +
      transactions
        .map(
          (t) =>
            `${t.name};${t.category};${(t.amount / 100).toFixed(2).replace(".", ",")}`,
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "finflow-demonstracao.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="dashboard-bezel reveal" id="demonstracao">
      <div className="dashboard">
        <div className="app-sidebar">
          <Brand />
          <span className="workspace">
            <span className="workspace-avatar">D</span>Meu workspace
            <ChevronDown size={12} />
          </span>
          <span className="sidebar-label">WORKSPACE</span>
          {[
            { label: "Visão geral", icon: LayoutDashboard },
            { label: "Transações", icon: ArrowDownLeft },
            { label: "Cartões", icon: CreditCard },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`sidebar-link ${tab === label ? "selected" : ""}`}
              onClick={() => setTab(label)}
            >
              <Icon size={16} />
              {label}
              {label === "Visão geral" && <span className="shortcut">⌘1</span>}
            </button>
          ))}
          <a className="sidebar-link" href="#metas">
            <Target size={16} />
            Metas
            <ChevronRight size={13} />
          </a>
          <div className="sidebar-bottom">
            <ShieldCheck size={16} />
            <div>
              Seu dinheiro. Seu controle.<small>Ambiente de demonstração</small>
            </div>
          </div>
        </div>
        <div className="app-main">
          <div className="app-topbar">
            <span>
              <span className="breadcrumb">Workspace</span>
              <ChevronRight size={12} />
              {tab}
            </span>
            <span className="demo-tag">
              <span />
              DADOS ILUSTRATIVOS
            </span>
          </div>
          <div className="app-content">
            <div className="app-heading">
              <div>
                <span className="app-greeting">Tudo no seu lugar.</span>
                <h3>
                  {tab === "Visão geral"
                    ? "Seu dinheiro, com clareza."
                    : tab === "Cartões"
                      ? "Uma visão de cada fatura."
                      : "Cada movimento conta."}
                </h3>
              </div>
              <label className="period-select">
                <span className="sr-only">Período do dashboard</span>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option>Novembro</option>
                  <option>Outubro</option>
                </select>
                <ChevronDown size={12} />
              </label>
            </div>
            <div className="mobile-dashboard-tabs">
              {["Visão geral", "Transações", "Cartões"].map((t) => (
                <button
                  key={t}
                  className={tab === t ? "active" : ""}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="metric-grid">
              <div className="metric">
                <span>
                  <Wallet size={13} />
                  Saldo consolidado
                </span>
                <strong>{money(balance)}</strong>
                <small>
                  <TrendingUp size={12} />
                  {october ? "+8,2%" : "+12,8%"}
                  <span>em relação ao mês anterior</span>
                </small>
              </div>
              <div className="metric">
                <span>
                  <ArrowDownLeft size={13} />
                  Entradas do mês
                </span>
                <strong className="text-green">
                  {money(october ? 1080000 : 1250000)}
                </strong>
                <small className="muted">Receitas confirmadas</small>
              </div>
              <div className="metric">
                <span>
                  <ArrowUpRight size={13} />
                  Saídas do mês
                </span>
                <strong className="text-rose">
                  {money((october ? 612000 : 471350) + (added ? 2450 : 0))}
                </strong>
                <small className="muted">Despesas confirmadas</small>
              </div>
            </div>
            {tab === "Visão geral" ? (
              <div className="dashboard-middle">
                <div className="cashflow">
                  <div className="panel-heading">
                    <h4>Fluxo de caixa</h4>
                    <span>
                      <i />
                      Entradas <i className="expense-dot" />
                      Saídas
                    </span>
                  </div>
                  <div className="chart">
                    <div className="chart-labels">
                      <span>15 mil</span>
                      <span>10 mil</span>
                      <span>5 mil</span>
                      <span>0</span>
                    </div>
                    <svg
                      viewBox="0 0 600 155"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={`Gráfico ilustrativo de fluxo de caixa de ${period}`}
                    >
                      <defs>
                        <linearGradient
                          id="chart-fill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#34d399"
                            stopOpacity=".19"
                          />
                          <stop
                            offset="100%"
                            stopColor="#34d399"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      {[15, 55, 95, 135].map((y) => (
                        <line
                          key={y}
                          x1="0"
                          x2="600"
                          y1={y}
                          y2={y}
                          stroke="#ffffff0a"
                          strokeDasharray="3 5"
                        />
                      ))}
                      <path
                        d={
                          october
                            ? "M0 130 C60 130 75 100 130 106 S220 75 270 85 S350 30 400 44 S510 20 600 10 L600 155 L0 155Z"
                            : "M0 125 C40 125 50 112 80 115 S120 75 160 82 S200 58 240 65 S280 99 320 77 S360 83 400 43 S440 60 480 34 S550 45 600 10 L600 155 L0 155Z"
                        }
                        fill="url(#chart-fill)"
                      />
                      <path
                        d={
                          october
                            ? "M0 130 C60 130 75 100 130 106 S220 75 270 85 S350 30 400 44 S510 20 600 10"
                            : "M0 125 C40 125 50 112 80 115 S120 75 160 82 S200 58 240 65 S280 99 320 77 S360 83 400 43 S440 60 480 34 S550 45 600 10"
                        }
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M0 139 C45 140 55 127 95 133 S160 108 210 117 S280 100 330 109 S410 85 460 96 S550 74 600 80"
                        fill="none"
                        stroke="#fb7185"
                        strokeWidth="1.5"
                        strokeDasharray="4 5"
                      />
                    </svg>
                    <div className="chart-months">
                      {["01", "05", "10", "15", "20", "25", "30"].map((d) => (
                        <span key={d}>
                          {d} {october ? "out" : "nov"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="budget-panel">
                  <div className="panel-heading">
                    <h4>Orçamentos</h4>
                    <span>Este mês</span>
                  </div>
                  {[
                    {
                      name: "Alimentação",
                      value: added ? 72 : 70,
                      color: "amber",
                      amount: added ? 86450 : 84000,
                      limit: 120000,
                    },
                    {
                      name: "Lazer",
                      value: 82,
                      color: "amber",
                      amount: 41000,
                      limit: 50000,
                    },
                    {
                      name: "Tecnologia",
                      value: 35,
                      color: "violet",
                      amount: 28000,
                      limit: 80000,
                    },
                  ].map((b) => (
                    <div className="budget" key={b.name}>
                      <div>
                        <span>{b.name}</span>
                        <span>{b.value}%</span>
                      </div>
                      <div className="progress">
                        <span
                          className={b.color}
                          style={{ width: `${b.value}%` }}
                        />
                      </div>
                      <small>
                        {money(b.amount)} <span>de {money(b.limit)}</span>
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "Cartões" ? (
              <div className="invoice-view">
                {[
                  {
                    name: "Nubank Ultravioleta",
                    amount: 238450,
                    limit: 1000000,
                    color: "violet",
                  },
                  {
                    name: "XP Visa Infinite",
                    amount: 89000,
                    limit: 1500000,
                    color: "amber",
                  },
                ].map((c) => (
                  <div className={`credit-card ${c.color}`} key={c.name}>
                    <CreditCard size={25} />
                    <span>{c.name}</span>
                    <small>Fatura aberta · {period}</small>
                    <strong>{money(c.amount)}</strong>
                    <div className="progress">
                      <span
                        style={{ width: `${(c.amount / c.limit) * 100}%` }}
                      />
                    </div>
                    <small>
                      Limite disponível: {money(c.limit - c.amount)}
                    </small>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="transactions">
              <div className="panel-heading">
                <h4>Últimas transações</h4>
                <button onClick={exportCsv}>
                  <Download size={13} />
                  Exportar CSV
                </button>
              </div>
              {transactions.slice(0, tab === "Transações" ? 4 : 3).map((t) => (
                <div className="transaction" key={t.name}>
                  <span className={`transaction-icon ${t.color}`}>
                    <t.icon size={15} />
                  </span>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.category}</small>
                  </div>
                  <span className="transaction-date">
                    {october ? "28 out" : "02 nov"}
                  </span>
                  <strong className={t.amount > 0 ? "text-green" : ""}>
                    {t.amount > 0 ? "+ " : "− "}
                    {money(Math.abs(t.amount))}
                  </strong>
                </div>
              ))}
            </div>
            <div className="demo-controls">
              <span>
                <Fingerprint size={13} />
                Explore. Nenhum dado real é utilizado.
              </span>
              <button onClick={() => setAdded(!added)}>
                <Plus size={13} />
                {added ? "Desfazer despesa" : "Simular uma despesa"}
              </button>
            </div>
            <span className="sr-only" role="status">
              {added
                ? "Despesa de R$ 24,50 adicionada à demonstração."
                : "Demonstração pronta."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-copy">
        <a className="announcement" href="#interfaces">
          <span className="live-dot" />
          SEU NOVO COPILOTO FINANCEIRO
          <span className="announcement-divider" />
          Conheça o MCP
          <ArrowRight size={13} />
        </a>
        <h1>
          O controle financeiro que{" "}
          <br className="desktop-break" />
          pensa como um <span>desenvolvedor.</span>{" "}
          <br className="desktop-break" />E age como o seu CFO.
        </h1>
        <p>
          Precisão em cada centavo. Clareza em cada decisão.{" "}
          <br />
          Web, terminal, Telegram e agentes de IA. Suas finanças, na sua
          linguagem.
        </p>
        <div className="hero-actions">
          <Button>Explorar demonstração</Button>
          <a
            className="text-link"
            href={`${repository}#readme`}
            target="_blank"
            rel="noreferrer"
          >
            <GitFork size={17} />
            Conhecer o projeto
            <ArrowUpRight size={14} />
          </a>
        </div>
        <span className="click-trigger">
          Demonstração gratuita · Sem cadastro · Sem cartão de crédito
        </span>
      </div>
      <div className="hero-product container">
        <div className="demo-caption">
          <span>
            <span className="live-dot" />
            MENOS PLANILHAS. MAIS PERSPECTIVA.
          </span>
          <span>
            INTERAJA COM O DASHBOARD
            <ArrowDown size={12} />
          </span>
        </div>
        <Dashboard />
        <div className="product-proof">
          <span>
            <Check size={14} />
            Precisão de centavos inteiros
          </span>
          <span>
            <Check size={14} />4 interfaces, uma única API
          </span>
          <span>
            <Check size={14} />
            Seus dados exportáveis
          </span>
        </div>
      </div>
    </section>
  );
}

function TerminalDemo() {
  const [command, setCommand] = useState("compra");
  const [executed, setExecuted] = useState(false);
  return (
    <div className="terminal-window">
      <div className="window-bar">
        <span className="traffic-lights">
          <i />
          <i />
          <i />
        </span>
        <span>finflow — zsh</span>
        <Terminal size={12} />
      </div>
      <div className="terminal-body">
        <span className="code-comment">
          # Sua vida financeira, sem sair do fluxo.
        </span>
        <div className="command-line">
          <span>❯</span>
          <code>
            finflow{" "}
            {command === "compra" ? (
              <>
                compra <b>3500</b> notebook
                <br />
                <span className="code-indent">
                  --cartao ultravioleta --parcelas <b>10</b>
                </span>
              </>
            ) : command === "saldo" ? (
              "saldo"
            ) : (
              <>
                exportar --formato <b>ofx</b>
              </>
            )}
          </code>
        </div>
        {executed ? (
          <div className="terminal-output" role="status">
            <span>
              <Check size={14} />
              {command === "compra"
                ? "Compra registrada."
                : command === "saldo"
                  ? "Saldo consolidado"
                  : "Exportação concluída."}
            </span>
            <div>
              {command === "compra" ? (
                <>
                  Notebook<span>R$ 3.500,00</span>
                  <br />
                  10 parcelas de<span>R$ 350,00</span>
                  <br />
                  Cartão<span>Ultravioleta</span>
                </>
              ) : command === "saldo" ? (
                <>
                  Nubank<span>R$ 14.586,50</span>
                  <br />
                  XP<span>R$ 10.000,00</span>
                  <br />
                  Total<span>R$ 24.586,50</span>
                </>
              ) : (
                <>
                  Arquivo<span>extrato.ofx</span>
                  <br />
                  Formato<span>OFX 1.02</span>
                </>
              )}
            </div>
            <small>Resposta simulada · valores ilustrativos</small>
          </div>
        ) : (
          <div className="terminal-placeholder">
            <span className="cursor" />
            <span>Seu próximo comando está pronto.</span>
          </div>
        )}
      </div>
      <div className="terminal-toolbar">
        <label>
          <span className="sr-only">Comando do terminal</span>
          <select
            value={command}
            onChange={(e) => {
              setCommand(e.target.value);
              setExecuted(false);
            }}
          >
            <option value="compra">Registrar compra</option>
            <option value="saldo">Consultar saldo</option>
            <option value="exportar">Exportar OFX</option>
          </select>
          <ChevronDown size={12} />
        </label>
        <button onClick={() => setExecuted(true)}>
          Executar
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
function McpDemo() {
  const [done, setDone] = useState(false);
  return (
    <div className="mcp-demo">
      <div className="mcp-agent">
        <span>
          <Sparkles size={16} />
        </span>
        <div>
          Seu assistente de IA<small>com o contexto das suas finanças</small>
        </div>
        <span className="protocol-tag">MCP</span>
      </div>
      <div className="user-prompt">
        Exporte minhas transações do mês e mostre a fatura do cartão.
      </div>
      <div className="tool-call">
        <Code2 size={13} />
        <code>export_transactions</code>
        <Check size={13} />
      </div>
      <div className="tool-call">
        <Code2 size={13} />
        <code>{done ? "pay_invoice" : "list_card_invoices"}</code>
        <Check size={13} />
      </div>
      <p className="agent-answer">
        {done
          ? "Simulação concluída: a fatura de R$ 2.384,50 foi paga pela conta Nubank. O saldo foi atualizado na mesma operação."
          : "Seu extrato está pronto em CSV. A fatura do Ultravioleta está em R$ 2.384,50. Quer simular o pagamento?"}
      </p>
      <button
        className={`mcp-action ${done ? "done" : ""}`}
        onClick={() => setDone(!done)}
      >
        {done ? <Check size={14} /> : <ShieldCheck size={14} />}
        {done ? "Reiniciar demonstração" : "Simular pagamento autorizado"}
        <ArrowRight size={13} />
      </button>
      <small className="demo-note">
        Simulação local · nenhuma operação financeira real
      </small>
    </div>
  );
}
function TelegramDemo() {
  const [sent, setSent] = useState(false);
  return (
    <div className="telegram-demo">
      <div className="telegram-header">
        <span className="telegram-icon">
          <Send size={19} />
        </span>
        <div>
          FinFlow Bot<small>seu registro rápido</small>
        </div>
        <span>bot</span>
      </div>
      <div className="chat-content">
        <div className="chat-message outgoing">
          45,90 almoço #alimentacao
          <small>
            12:42
            <CheckCheck size={12} />
          </small>
        </div>
        <div className="chat-message incoming">
          <span>
            <Check size={13} />
            Despesa registrada
          </span>
          <strong>R$ 45,90</strong>
          <p>Almoço · Alimentação</p>
          <small>12:42</small>
        </div>
        {sent && (
          <>
            <div className="chat-message outgoing new-message">
              /saldo
              <small>
                12:43
                <CheckCheck size={12} />
              </small>
            </div>
            <div className="chat-message incoming new-message">
              <span>Seu saldo consolidado</span>
              <strong>R$ 24.586,50</strong>
              <small>Dados ilustrativos · 12:43</small>
            </div>
          </>
        )}
      </div>
      <button className="chat-input" onClick={() => setSent(!sent)}>
        <span>{sent ? "Reiniciar conversa" : "Experimentar /saldo"}</span>
        <Send size={15} />
      </button>
    </div>
  );
}
function InterfacesBento() {
  return (
    <section className="section container" id="interfaces">
      <SectionHeading
        label="UM SISTEMA. QUATRO POSSIBILIDADES."
        title={
          <>
            O seu dinheiro não vive
            <br />
            em uma aba só.
          </>
        }
        text="Uma API conecta tudo. Escolha a interface que combina com o seu momento, sem perder o contexto."
      />
      <div className="bento-grid">
        <article className="bento-card bento-cli reveal">
          <div className="bento-copy">
            <span className="feature-icon">
              <Terminal size={20} />
            </span>
            <span className="feature-number">01 / TERMINAL CLI</span>
            <h3>
              Menos cliques.
              <br />
              Mais comando.
            </h3>
            <p>
              Registre uma compra parcelada antes mesmo de tirar as mãos do
              teclado.
            </p>
          </div>
          <TerminalDemo />
          <div className="card-bottom">
            <span>Feito para o seu fluxo.</span>
            <kbd>⌘</kbd>
            <kbd>↵</kbd>
          </div>
        </article>
        <article className="bento-card bento-mcp reveal">
          <div className="bento-copy">
            <span className="feature-icon cyan">
              <Bot size={21} />
            </span>
            <span className="feature-number">02 / AGENTES DE IA</span>
            <h3>
              Seu agente ganhou
              <br />
              contexto financeiro.
            </h3>
            <p>
              Consulte, exporte e execute ações pela API com ferramentas MCP
              explícitas.
            </p>
          </div>
          <McpDemo />
        </article>
        <article className="bento-card bento-web reveal">
          <div className="bento-copy">
            <span className="feature-icon">
              <Globe2 size={20} />
            </span>
            <span className="feature-number">03 / WEB DASHBOARD</span>
            <h3>
              A visão completa.
              <br />
              Até o último centavo.
            </h3>
            <p>
              Contas, cartões, faturas e orçamentos. Cada decisão começa com uma
              boa visão.
            </p>
            <a className="inline-link" href="#demonstracao">
              Explorar dashboard
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="mini-cards">
            <div className="bank-card">
              <div>
                <span className="nu-logo">nu</span>
                <span>
                  Ultravioleta
                  <CreditCard size={18} />
                </span>
              </div>
              <small>FATURA ATUAL</small>
              <strong>
                R$ 2.384<span>,50</span>
              </strong>
              <div className="progress">
                <span style={{ width: "24%" }} />
              </div>
              <small>
                24% do limite utilizado<span>Aberta</span>
              </small>
            </div>
            <div className="bank-card bank-card-xp">
              <div>
                <b>XP</b>
                <span>
                  Visa Infinite
                  <CreditCard size={18} />
                </span>
              </div>
              <strong>
                R$ 890<span>,00</span>
              </strong>
              <small>
                Fatura aberta<span>Vence em 10 nov</span>
              </small>
            </div>
          </div>
        </article>
        <article className="bento-card bento-telegram reveal">
          <div className="bento-copy">
            <span className="feature-icon blue">
              <Send size={19} />
            </span>
            <span className="feature-number">04 / TELEGRAM BOT</span>
            <h3>
              Aconteceu.
              <br />
              Anotou. Seguiu.
            </h3>
            <p>
              Do café à compra do mês. Registre por texto no aplicativo que você
              já usa.
            </p>
          </div>
          <TelegramDemo />
        </article>
      </div>
    </section>
  );
}

const comparison = [
  {
    name: "Centavos inteiros de ponta a ponta",
    ours: "Nativo",
    app: "Depende do produto",
    sheet: "Depende da fórmula",
  },
  {
    name: "Web + CLI + MCP + Telegram",
    ours: "Uma única API",
    app: "Depende do produto",
    sheet: "Exige automação",
  },
  {
    name: "Faturas e compras parceladas",
    ours: "Regra integrada",
    app: "Depende do plano",
    sheet: "Configuração manual",
  },
  {
    name: "Exportação CSV e OFX",
    ours: "Nativa",
    app: "Depende do produto",
    sheet: "OFX exige conversão",
  },
];
function PrecisionComparison() {
  return (
    <section className="section architecture" id="arquitetura">
      <div className="container">
        <div className="architecture-intro">
          <SectionHeading
            label="CONFIANÇA SE CONSTRÓI NA BASE."
            title={
              <>
                Seu dinheiro merece
                <br />
                mais que um <span className="muted">≈</span>.
              </>
            }
            text="A interface é simples. A engenharia por trás dela leva cada centavo a sério."
          />
          <div className="precision-code reveal">
            <div className="code-comment">
              // Dinheiro não é ponto flutuante.
            </div>
            <code>
              <span className="text-rose">0.1 + 0.2</span>
              <span className="code-comment"> // 0.30000000000000004</span>
              <br />
              <span className="text-green">10 + 20</span>
              <span className="code-comment"> // 30 centavos. Exatos.</span>
            </code>
            <span className="precision-stamp">
              <ShieldCheck size={14} />
              INTEIROS. POR PRINCÍPIO.
            </span>
          </div>
        </div>
        <div className="architecture-features" id="recursos">
          {[
            {
              icon: Fingerprint,
              title: "Precisão por definição",
              text: "Valores em centavos inteiros. Parcelas distribuem o resto da divisão sem perder dinheiro pelo caminho.",
            },
            {
              icon: Landmark,
              title: "Consistência de verdade",
              text: "PostgreSQL relacional. O pagamento debita a conta e atualiza a fatura na mesma transação.",
            },
            {
              icon: Download,
              title: "Dados sem fronteiras",
              text: "CSV para o Excel em português. OFX para ferramentas financeiras compatíveis. A escolha continua sua.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div className="architecture-feature reveal" key={title}>
              <Icon size={23} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="comparison-heading">
          <h3>Quando você precisa de mais que uma planilha.</h3>
          <span>O que muda no seu dia a dia</span>
        </div>
        <div
          className="comparison-scroll reveal"
          tabIndex={0}
          role="region"
          aria-label="Comparação de alternativas, role horizontalmente em telas pequenas"
        >
          <table>
            <caption className="sr-only">
              Comparação entre FinFlow, aplicativos tradicionais e planilhas
            </caption>
            <thead>
              <tr>
                <th scope="col">O que importa</th>
                <th scope="col">
                  <AudioLines size={17} />
                  FinFlow
                </th>
                <th scope="col">Apps tradicionais</th>
                <th scope="col">Planilhas / Notion</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>
                    <Check size={14} />
                    {row.ours}
                  </td>
                  <td>{row.app}</td>
                  <td>{row.sheet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="comparison-note">
          Comparação de abordagens. Recursos de outros produtos variam por
          versão e plano.
        </p>
      </div>
    </section>
  );
}

function LiveCalculator() {
  const [target, setTarget] = useState(30000);
  const [saved, setSaved] = useState(6000);
  const [months, setMonths] = useState(12);
  const contribution = monthlyContribution(target * 100, saved * 100, months);
  const progress = Math.min(100, Math.round((saved / target) * 100));
  return (
    <section className="section container calculator-section" id="metas">
      <div className="calculator-copy reveal">
        <Eyebrow>DO PLANO AO PRIMEIRO APORTE.</Eyebrow>
        <h2>
          Seu próximo capítulo
          <br />
          começa com
          <br />
          <span>um número.</span>
        </h2>
        <p>
          A viagem. A reserva de emergência. A liberdade de escolher. Descubra
          quanto separar por mês para chegar lá.
        </p>
        <div className="calculator-benefit">
          <span>
            <Target size={19} />
          </span>
          <div>
            Uma meta. Um caminho claro.
            <small>O restante dividido pelo prazo, com precisão.</small>
          </div>
        </div>
        <span className="calculator-disclaimer">
          Simulação sem juros ou rendimentos.
          <br />
          Os valores são arredondados para cima em centavos.
        </span>
      </div>
      <div className="calculator-bezel reveal">
        <div className="calculator">
          <div className="calculator-header">
            <span className="feature-icon">
              <Target size={21} />
            </span>
            <div>
              <h3>Reserva de emergência</h3>
              <span>Vamos fazer acontecer.</span>
            </div>
            <span className="demo-tag">SIMULADOR</span>
          </div>
          <label className="range-label" htmlFor="goal-value">
            Quanto você quer guardar?<strong>{money(target * 100)}</strong>
          </label>
          <input
            id="goal-value"
            type="range"
            min="5000"
            max="100000"
            step="500"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
          <div className="range-limits">
            <span>R$ 5.000</span>
            <span>R$ 100.000</span>
          </div>
          <label className="range-label" htmlFor="saved-value">
            Quanto já tem guardado?<strong>{money(saved * 100)}</strong>
          </label>
          <input
            id="saved-value"
            type="range"
            min="0"
            max="100000"
            step="500"
            value={saved}
            onChange={(e) => setSaved(Number(e.target.value))}
          />
          <div className="months-label">
            <label htmlFor="goal-months">Em quanto tempo?</label>
            <span>
              <select
                id="goal-months"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              >
                {[1, 3, 6, 12, 18, 24, 36].map((m) => (
                  <option key={m} value={m}>
                    {m} {m === 1 ? "mês" : "meses"}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </span>
          </div>
          <div className="calculator-result" aria-live="polite">
            <span>
              {contribution === 0 ? "Você já chegou lá." : "Seu aporte mensal"}
            </span>
            <strong>
              {money(contribution)}
              <small>/ mês</small>
            </strong>
            <div className="progress">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div>
              <span>{progress}% do objetivo conquistado</span>
              <span>
                {months} {months === 1 ? "mês" : "meses"}
              </span>
            </div>
          </div>
          <a className="calculator-cta" href="#demonstracao">
            Conhecer o FinFlow
            <ArrowUpRight size={16} />
          </a>
          <small className="calculator-foot">
            <ShieldCheck size={12} />
            Sem cadastro. Faça as contas à vontade.
          </small>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="section container usecases" id="depoimentos">
      <SectionHeading
        label="FEITO PARA A VIDA FORA DA PLANILHA."
        title={
          <>
            Mais controle.
            <br />
            Mais espaço para o que importa.
          </>
        }
        text="Três formas de trazer suas finanças para o seu ritmo."
      />
      <div className="usecase-grid">
        {[
          {
            image: "photo-1497366811353-6870744d04b2",
            avatar: "photo-1472099645785-5658abf4ff4e",
            role: "Para quem desenvolve",
            title: "Continue no seu fluxo.",
            text: "Registre a assinatura de software pelo terminal e volte para o código. O dashboard acompanha.",
            tag: "CLI + WEB",
            icon: Terminal,
          },
          {
            image: "photo-1499750310107-5fef28a66643",
            avatar: "photo-1580489944761-15a19d654956",
            role: "Para quem empreende",
            title: "Planeje com perspectiva.",
            text: "Enxergue suas contas, organize os próximos aportes e dê um destino a cada entrada.",
            tag: "METAS + ORÇAMENTOS",
            icon: Target,
          },
          {
            image: "photo-1442512595331-e89e73853f31",
            avatar: "photo-1500648767791-00dcc994a43e",
            role: "Para quem está em movimento",
            title: "Não deixe para depois.",
            text: "Um almoço, uma mensagem no Telegram. A pequena despesa entra no controle enquanto você segue o dia.",
            tag: "TELEGRAM + WEB",
            icon: Send,
          },
        ].map((c) => (
          <article className="usecase reveal" key={c.title}>
            <div className="usecase-image">
              <img
                src={photo(c.image, 700)}
                alt={
                  c.role === "Para quem desenvolve"
                    ? "Ambiente de trabalho com luz natural"
                    : c.role === "Para quem empreende"
                      ? "Mesa de trabalho com caderno e computador"
                      : "Café servido durante uma pausa"
                }
                loading="lazy"
                width="700"
                height="450"
              />
              <span>
                <c.icon size={13} />
                {c.tag}
              </span>
            </div>
            <div className="usecase-body">
              <div className="persona">
                <img
                  src={photo(c.avatar)}
                  alt=""
                  loading="lazy"
                  width="28"
                  height="28"
                />
                <span>{c.role}</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="usecase-note">
        Cenários ilustrativos de uso. Fotografias editoriais; não representam
        depoimentos de clientes.
      </p>
    </section>
  );
}

const questions = [
  {
    q: "Preciso entender de programação para usar?",
    a: "Não para usar a interface web. Ela organiza contas, cartões, transações, orçamentos e metas visualmente. A CLI e o servidor MCP são opções para quem quer incorporar as finanças ao seu fluxo técnico. A instalação do produto ainda exige configuração do ambiente.",
  },
  {
    q: "Esta página já está conectada às minhas finanças?",
    a: "Não. Toda a demonstração funciona no seu navegador, com dados ilustrativos. Nenhuma conta bancária é acessada, nenhuma fatura real é paga e nenhum valor que você experimentar aqui é enviado para uma API financeira.",
  },
  {
    q: "O FinFlow é código aberto? Posso instalar agora?",
    a: "O produto ainda está em um repositório privado. A abertura do código está planejada, sem data anunciada. Este repositório público contém apenas a landing page e sua demonstração; não inclui a API, o dashboard completo, a CLI ou o servidor MCP.",
  },
  {
    q: "Meus dados ficam onde? Existe self-hosting?",
    a: "A arquitetura do produto permite executar a API e o PostgreSQL em um ambiente sob seu controle. Na instalação própria, você administra hospedagem, credenciais, backups e acesso. Esta landing não oferece cadastro, armazenamento de finanças ou uma instância cloud do produto.",
  },
  {
    q: "Funciona com Nubank, XP e bancos brasileiros?",
    a: "Você pode cadastrar e organizar manualmente contas e cartões de bancos brasileiros. A exportação CSV usa o formato do Excel em português e há saída OFX 1.02 para ferramentas compatíveis. Não há promessa de conexão automática com bancos ou Open Finance. As marcas do dashboard são exemplos ilustrativos.",
  },
  {
    q: "O que o agente de IA pode fazer com o MCP?",
    a: "O servidor fornece ferramentas de consulta e escrita para a mesma API: saldos, transações, faturas, metas, exportações e pagamento de fatura por pay_invoice. O acesso depende da configuração da sua instalação e do cliente de IA. O exemplo desta página é uma simulação local.",
  },
];
function FAQ() {
  return (
    <section className="section container faq-section" id="faq">
      <SectionHeading
        label="CLAREZA, ATÉ NAS PERGUNTAS."
        title={
          <>
            Bom controle começa
            <br />
            sem dúvidas.
          </>
        }
        text="O que você precisa saber antes do primeiro centavo."
      />
      <div className="faq-list">
        {questions.map((item, i) => (
          <details className="faq-item reveal" key={item.q}>
            <summary>
              <span className="faq-index">0{i + 1}</span>
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
      <section className="final-cta container reveal">
        <div className="final-glow" aria-hidden="true" />
        <span className="brand-icon">
          <AudioLines size={27} />
        </span>
        <Eyebrow>MENOS ATRITO. MAIS CONTROLE.</Eyebrow>
        <h2>
          A sua vida financeira.
          <br />
          <span>Finalmente, na sua linguagem.</span>
        </h2>
        <Button>Experimentar gratuitamente</Button>
        <p>
          Sem cadastro · Sem cartão · Uma demonstração, muitas possibilidades
        </p>
      </section>
      <footer className="container footer">
        <div className="footer-main">
          <div>
            <Brand />
            <p>
              Precisão para os números.
              <br />
              Liberdade para a vida.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <span>PRODUTO</span>
              <a href="#interfaces">Interfaces</a>
              <a href="#recursos">Recursos</a>
              <a href="#metas">Simulador de metas</a>
            </div>
            <div>
              <span>EXPLORE</span>
              <a href="#demonstracao">Demonstração</a>
              <a href={repository} target="_blank" rel="noreferrer">
                GitHub
                <ArrowUpRight size={12} />
              </a>
              <a href={`${repository}#readme`} target="_blank" rel="noreferrer">
                Documentação
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {currentYear} FinFlow. Cada centavo importa.</span>
          <span>
            <span className="live-dot" />
            Demonstração disponível
          </span>
          <a href="#inicio">
            De volta ao topo
            <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <InterfacesBento />
        <PrecisionComparison />
        <LiveCalculator />
        <SocialProof />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
