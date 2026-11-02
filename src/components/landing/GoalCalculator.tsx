import { ArrowUpRight, ChevronDown, Target } from "lucide-react";
import { useState } from "react";
import { money, monthlyContribution } from "./money";

export function GoalCalculator() {
  const [target, setTarget] = useState(30000);
  const [saved, setSaved] = useState(6000);
  const [months, setMonths] = useState(12);
  const contribution = monthlyContribution(target * 100, saved * 100, months);
  const progress = Math.min(100, Math.round((saved / target) * 100));
  return (
    <section className="ff-section ff-goals ff-container" id="metas">
      <div className="ff-goal-story">
        <h2>
          Seus planos merecem
          <br />
          sair do “um dia”.
        </h2>
        <p>
          A reserva para dormir melhor. A viagem em família. Escolha seu objetivo e descubra um
          passo possível para cada mês.
        </p>
        <div className="ff-goal-photo">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80"
            alt="Lago tranquilo entre montanhas, um destino para a próxima viagem"
            width="900"
            height="500"
            loading="lazy"
          />
          <span>
            <Target size={17} />
            Um pouco a cada mês.
            <br />
            <strong>Um novo horizonte pela frente.</strong>
          </span>
        </div>
      </div>
      <div className="ff-calculator">
        <div className="ff-calculator-title">
          <span className="ff-feature-icon">
            <Target size={22} />
          </span>
          <div>
            <h3>Sua reserva de emergência</h3>
            <p>Vamos encontrar o seu próximo passo.</p>
          </div>
        </div>
        <label className="ff-range-label" htmlFor="goal-value">
          Quanto quer guardar?<strong>{money(target * 100)}</strong>
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
        <div className="ff-range-limits">
          <span>R$ 5.000</span>
          <span>R$ 100.000</span>
        </div>
        <label className="ff-range-label" htmlFor="saved-value">
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
        <div className="ff-months">
          <label htmlFor="goal-months">Em quanto tempo?</label>
          <div>
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
            <ChevronDown size={15} />
          </div>
        </div>
        <div className="ff-calculator-result" aria-live="polite">
          <span>{contribution === 0 ? "Você já chegou lá." : "Para chegar lá, guarde"}</span>
          <strong>
            {money(contribution)}
            <small>por mês</small>
          </strong>
          <div className="ff-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div>
            <span>{progress}% do seu objetivo</span>
            <span>
              {months} {months === 1 ? "mês" : "meses"}
            </span>
          </div>
        </div>
        <a className="ff-text-link" href="#demonstracao">
          Conhecer o FinFlow
          <ArrowUpRight size={16} />
        </a>
        <p className="ff-fineprint">
          Simulação sem juros ou rendimentos. O valor mensal é arredondado para cima em centavos.
          Nenhum valor é enviado ou salvo.
        </p>
      </div>
    </section>
  );
}
