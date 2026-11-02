import {
  ArrowDownLeft,
  ArrowUpRight,
  BatteryCharging,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  Fingerprint,
  LayoutDashboard,
  Monitor,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Target,
  TrendingUp,
  Wallet,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { Brand } from "./Brand";
import { money } from "./money";

const initialTransactions = [
  {
    name: "Salário do mês",
    category: "Receita · Trabalho",
    amount: 850000,
    icon: BriefcaseBusiness,
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
    name: "Streaming e música",
    category: "Despesa · Lazer",
    amount: -8990,
    icon: ShoppingBag,
    color: "violet",
  },
];

export function DemoDashboard() {
  const [tab, setTab] = useState("Visão geral");
  const [period, setPeriod] = useState("Novembro");
  const [added, setAdded] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

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
        .map((t) => `${t.name};${t.category};${(t.amount / 100).toFixed(2).replace(".", ",")}`)
        .join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "finflow-demonstracao.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className={`dashboard-bezel reveal ${device === "mobile" ? "is-mobile-device" : ""}`}
      id="demonstracao"
    >
      <div className="dashboard">
        <aside className="app-sidebar" aria-label="Menu do aplicativo de demonstração">
          <div className="sidebar-brand-row">
            <Brand />
          </div>
          <span className="workspace">
            <span className="workspace-avatar">D</span>
            <span className="workspace-info">
              <strong>Minhas finanças</strong>
              <small>Plano pessoal</small>
            </span>
            <ChevronDown size={13} />
          </span>
          <span className="sidebar-label">MENU PRINCIPAL</span>
          {[
            { label: "Visão geral", icon: LayoutDashboard },
            { label: "Transações", icon: ArrowDownLeft },
            { label: "Cartões", icon: CreditCard },
          ].map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`sidebar-link ${tab === label ? "selected" : ""}`}
              onClick={() => setTab(label)}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
          <a className="sidebar-link" href="#metas">
            <Target size={15} />
            Metas
            <ChevronRight size={13} />
          </a>
          <div className="sidebar-bottom">
            <ShieldCheck size={15} />
            <div>
              <strong>Ambiente seguro</strong>
              <small>Simulação local interativa</small>
            </div>
          </div>
        </aside>

        <div className="app-main">
          <div className="mobile-phone-statusbar" aria-hidden="true">
            <span className="phone-time">09:41</span>
            <span className="phone-dynamic-island">
              <span className="phone-camera-dot" />
            </span>
            <span className="phone-status-icons">
              <Wifi size={12} />
              <BatteryCharging size={14} />
            </span>
          </div>

          <div className="app-topbar">
            <div className="topbar-left">
              <span className="window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="topbar-Crumb">
                <span className="breadcrumb">Minhas finanças</span>
                <ChevronRight size={12} />
                <strong>{tab}</strong>
              </span>
            </div>

            <div className="topbar-right">
              <fieldset className="device-switcher" aria-label="Modo de visualização">
                <button
                  type="button"
                  className={device === "desktop" ? "active" : ""}
                  aria-pressed={device === "desktop"}
                  onClick={() => setDevice("desktop")}
                >
                  <Monitor size={12} />
                  <span>Web</span>
                </button>
                <button
                  type="button"
                  className={device === "mobile" ? "active" : ""}
                  aria-pressed={device === "mobile"}
                  onClick={() => setDevice("mobile")}
                >
                  <Smartphone size={12} />
                  <span>Mobile</span>
                </button>
              </fieldset>
              <span className="demo-tag">
                <span />
                DADOS ILUSTRATIVOS
              </span>
            </div>
          </div>

          <div className="app-content">
            <div className="app-heading">
              <div>
                <span className="app-greeting">Tudo no seu lugar · Visão em tempo real</span>
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
                <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option>Novembro</option>
                  <option>Outubro</option>
                </select>
                <ChevronDown size={13} />
              </label>
            </div>

            <div className="mobile-dashboard-tabs">
              {["Visão geral", "Transações", "Cartões"].map((t) => (
                <button
                  type="button"
                  key={t}
                  aria-pressed={tab === t}
                  className={tab === t ? "active" : ""}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="metric-grid">
              <div className="metric metric-primary">
                <span>
                  <Wallet size={13} />
                  Saldo disponível
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
                <strong className="ff-income">{money(october ? 1080000 : 1250000)}</strong>
                <small className="muted">Receitas confirmadas</small>
              </div>
              <div className="metric">
                <span>
                  <ArrowUpRight size={13} />
                  Saídas do mês
                </span>
                <strong className="ff-expense">
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
                      <span>15k</span>
                      <span>10k</span>
                      <span>5k</span>
                      <span>0</span>
                    </div>
                    <svg
                      viewBox="0 0 600 155"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={`Gráfico ilustrativo de fluxo de caixa de ${period}`}
                    >
                      <defs>
                        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--ff-income)" stopOpacity=".24" />
                          <stop offset="100%" stopColor="var(--ff-income)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[15, 55, 95, 135].map((y) => (
                        <line
                          key={y}
                          x1="0"
                          x2="600"
                          y1={y}
                          y2={y}
                          stroke="var(--ff-border)"
                          strokeDasharray="3 5"
                          vectorEffect="non-scaling-stroke"
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
                        stroke="var(--ff-income)"
                        strokeWidth="2.5"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d="M0 139 C45 140 55 127 95 133 S160 108 210 117 S280 100 330 109 S410 85 460 96 S550 74 600 80"
                        fill="none"
                        stroke="var(--ff-expense)"
                        strokeWidth="1.75"
                        strokeDasharray="4 5"
                        vectorEffect="non-scaling-stroke"
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
                      name: "Transporte",
                      value: 35,
                      color: "violet",
                      amount: 28000,
                      limit: 80000,
                    },
                  ].map((b) => (
                    <div className="budget" key={b.name}>
                      <div>
                        <span>{b.name}</span>
                        <strong>{b.value}%</strong>
                      </div>
                      <div className="progress">
                        <span className={b.color} style={{ width: `${b.value}%` }} />
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
                    <CreditCard size={20} />
                    <span>{c.name}</span>
                    <small>Fatura aberta · {period}</small>
                    <strong>{money(c.amount)}</strong>
                    <div className="progress">
                      <span style={{ width: `${(c.amount / c.limit) * 100}%` }} />
                    </div>
                    <small>Limite disponível: {money(c.limit - c.amount)}</small>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="transactions">
              <div className="panel-heading">
                <h4>Últimas transações</h4>
                <button type="button" onClick={exportCsv}>
                  <Download size={13} />
                  Exportar CSV
                </button>
              </div>
              {transactions.slice(0, tab === "Transações" ? 4 : 3).map((t) => (
                <div className="transaction" key={t.name}>
                  <span className={`transaction-icon ${t.color}`}>
                    <t.icon size={14} />
                  </span>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.category}</small>
                  </div>
                  <span className="transaction-date">{october ? "28 out" : "02 nov"}</span>
                  <strong className={t.amount > 0 ? "ff-income" : ""}>
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
              <button type="button" onClick={() => setAdded(!added)}>
                <Plus size={13} />
                {added ? "Desfazer despesa" : "Simular uma despesa"}
              </button>
            </div>

            <div className="mobile-bottom-dock" aria-hidden="true">
              <span className={tab === "Visão geral" ? "active" : ""}>
                <LayoutDashboard size={15} />
                <small>Início</small>
              </span>
              <span className={tab === "Transações" ? "active" : ""}>
                <ArrowDownLeft size={15} />
                <small>Extrato</small>
              </span>
              <span className="mobile-dock-fab">
                <Plus size={17} />
              </span>
              <span className={tab === "Cartões" ? "active" : ""}>
                <CreditCard size={15} />
                <small>Cartões</small>
              </span>
              <span>
                <Target size={15} />
                <small>Metas</small>
              </span>
            </div>

            <span className="sr-only" role="status">
              {added ? "Despesa de R$ 24,50 adicionada à demonstração." : "Demonstração pronta."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
