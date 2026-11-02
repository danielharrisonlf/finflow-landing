import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  AudioLines,
  BriefcaseBusiness,
  ChevronDown,
  CreditCard,
  Download,
  LayoutDashboard,
  Plus,
  Settings,
  ShoppingBag,
  Target,
  TrendingUp,
  Undo2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
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

const shortCategory = (category: string) => category.split(" · ")[1] ?? category;

export function DemoDashboard() {
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
  const income = october ? 1080000 : 1250000;
  const expenses = (october ? 612000 : 471350) + (added ? 2450 : 0);
  const budgets = [
    { name: "Alimentação", value: added ? 72 : 70, tone: "warning" },
    { name: "Lazer", value: 82, tone: "warning" },
    { name: "Transporte", value: 35, tone: "income" },
  ];

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
    <div className="dashboard-bezel" id="demonstracao">
      <div className="dashboard">
        <div className="app-rail" aria-hidden="true">
          <span className="app-rail-logo">
            <AudioLines size={16} strokeWidth={2.4} />
          </span>
          <span className="active">
            <LayoutDashboard size={16} />
          </span>
          <span>
            <ArrowLeftRight size={16} />
          </span>
          <span>
            <CreditCard size={16} />
          </span>
          <span>
            <Target size={16} />
          </span>
          <span className="app-rail-bottom">
            <Settings size={16} />
          </span>
        </div>

        <div className="app-main">
          <div className="app-topbar">
            <div className="app-title">
              <span>Minhas finanças</span>
              <strong>Visão geral</strong>
            </div>
            <div className="app-actions">
              <label className="period-select">
                <span className="sr-only">Período do dashboard</span>
                <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option>Novembro</option>
                  <option>Outubro</option>
                </select>
                <ChevronDown size={14} />
              </label>
              <button type="button" className="demo-add" onClick={() => setAdded(!added)}>
                {added ? <Undo2 size={14} /> : <Plus size={14} />}
                {added ? "Desfazer despesa" : "Simular uma despesa"}
              </button>
            </div>
          </div>

          <div className="app-content">
            <div className="app-summary">
              <div className="balance">
                <span className="app-label">Saldo disponível</span>
                <strong>{money(balance)}</strong>
                <span className="delta">
                  <TrendingUp size={13} />
                  {october ? "+8,2%" : "+12,8%"}
                  <span>em relação ao mês anterior</span>
                </span>
              </div>
              <div className="flows">
                <div>
                  <span className="app-label">
                    <ArrowDownLeft size={13} />
                    Entradas
                  </span>
                  <strong className="ff-income">{money(income)}</strong>
                </div>
                <div>
                  <span className="app-label">
                    <ArrowUpRight size={13} />
                    Saídas
                  </span>
                  <strong className="ff-expense">{money(expenses)}</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-middle">
              <div className="cashflow">
                <div className="panel-heading">
                  <h4>Fluxo de caixa</h4>
                  <span>
                    <i className="legend-dot" />
                    Entradas
                    <i className="legend-dot expense" />
                    Saídas
                  </span>
                </div>
                <div className="chart">
                  <svg
                    viewBox="0 0 600 155"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label={`Gráfico ilustrativo de fluxo de caixa de ${period}`}
                  >
                    <defs>
                      <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--ff-income)" stopOpacity=".28" />
                        <stop offset="100%" stopColor="var(--ff-income)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[40, 95, 150].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        x2="600"
                        y1={y}
                        y2={y}
                        stroke="var(--ff-border)"
                        strokeDasharray="2 6"
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
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M0 139 C45 140 55 127 95 133 S160 108 210 117 S280 100 330 109 S410 85 460 96 S550 74 600 80"
                      fill="none"
                      stroke="var(--ff-expense)"
                      strokeWidth="1.75"
                      strokeDasharray="5 5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="chart-months" aria-hidden="true">
                    {["01", "08", "15", "22", "30"].map((d) => (
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
                  <span>{period}</span>
                </div>
                {budgets.map((b) => (
                  <div className="budget" key={b.name}>
                    <div className="budget-row">
                      <span>{b.name}</span>
                      <strong>{b.value}%</strong>
                    </div>
                    <div className="progress">
                      <span className={`ff-${b.tone}-bg`} style={{ width: `${b.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="transactions">
              <div className="panel-heading">
                <h4>Últimas transações</h4>
                <button type="button" className="export-button" onClick={exportCsv}>
                  <Download size={13} />
                  Exportar CSV
                </button>
              </div>
              {transactions.slice(0, 3).map((t) => (
                <div className="transaction" key={t.name}>
                  <span className={`transaction-icon ${t.color}`}>
                    <t.icon size={14} />
                  </span>
                  <div className="transaction-name">
                    <strong>{t.name}</strong>
                    <small>{shortCategory(t.category)}</small>
                  </div>
                  <span className="transaction-date">{october ? "28 out" : "02 nov"}</span>
                  <strong className={`transaction-amount ${t.amount > 0 ? "ff-income" : ""}`}>
                    {t.amount > 0 ? "+ " : "− "}
                    {money(Math.abs(t.amount))}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="app-tabbar" aria-hidden="true">
            <span className="active">
              <LayoutDashboard size={18} />
              Início
            </span>
            <span>
              <ArrowLeftRight size={18} />
              Extrato
            </span>
            <span className="app-tabbar-fab">
              <Plus size={20} />
            </span>
            <span>
              <CreditCard size={18} />
              Cartões
            </span>
            <span>
              <Target size={18} />
              Metas
            </span>
          </div>
        </div>
      </div>
      <span className="sr-only" role="status">
        {added ? "Despesa de R$ 24,50 adicionada à demonstração." : "Demonstração pronta."}
      </span>
    </div>
  );
}
