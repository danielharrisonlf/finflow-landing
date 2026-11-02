# FinFlow · O dinheiro organizado. A cabeça mais leve.

Landing pública do FinFlow para pessoas que querem organizar contas, antecipar faturas e planejar metas com tranquilidade.

**Produção:** https://finflow-landing-umber.vercel.app/

## Experiência

- Conteúdo sobre contas, cartões, orçamentos, metas e registro por mensagem.
- Assistente apresentado por conversas: **Conecte seu agente de IA via CLI ou MCP**.
- Demonstração de dashboard com períodos, cartões, despesa reversível e download CSV.
- Prévia de próximas faturas, conversa Telegram e calculadora de metas.
- Light e Dark Mode com paletas semânticas, preferência do sistema, alternância manual, persistência e retorno ao sistema.
- Inicialização do tema no `<head>`, antes do React, para evitar troca de cores durante o carregamento. A preferência acompanha alterações do sistema e de outras abas; armazenamento bloqueado não impede o uso.
- Geist hospedada localmente com licença OFL em `public/fonts/`, ícones Lucide e fotografia editorial Unsplash.

## Estado do produto e acesso

O produto permanece privado. A abertura está planejada, sem data anunciada. Este repositório contém somente a landing e suas demonstrações.

Nenhuma conta bancária é acessada, nenhum pagamento é realizado e os valores da demonstração não são enviados a um servidor. Não há cadastro ou conta online nesta landing. Somente a preferência de tema é persistida no navegador, quando permitido. Exportações são criadas localmente.

`VITE_APP_URL` é opcional: configure uma URL verificada da aplicação para habilitar o destino de **Acessar minha conta**. Sem ela, o botão explica a disponibilidade e oferece a demonstração. A integração no app usa a rota existente `/`, que conserva seu controle de autenticação.

As ferramentas de IA e o Telegram dependem de configuração na instalação do produto. A conversa apresentada aqui é ilustrativa. Não se anuncia conexão automática a bancos ou Open Finance.

## Desenvolvimento e validação

Node 24 e pnpm 10.11.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm test:e2e
node scripts/verify-production.mjs
```

Os testes usam Chromium, Playwright e axe. Na primeira instalação, se necessário, execute `pnpm exec playwright install chromium`. Screenshots e relatórios são locais e ignorados pelo Git em `test-results/`. `node scripts/capture.mjs` gera referências de ambos os temas e a imagem de compartilhamento; `CAPTURE_URL` permite conferir outra instância sem regenerar o asset público.

## Integração no app

A fonte canônica é `src/components/landing/`. Ela não depende de APIs privadas ou de imports entre repositórios. A cópia no monorepo fica em `apps/web/src/components/landing/`, renderizada pela página `apps/web/src/pages/landing.tsx` em `/inicio`, fora da árvore autenticada.

Para sincronizar os oito arquivos portáveis, a fonte e o bootstrap do tema com o monorepo irmão:

```sh
node scripts/sync-app.mjs
```

Para outra localização, defina `FINFLOW_WEB_DIR` com o caminho absoluto de `apps/web`. O script valida a existência da aplicação antes de escrever. A integração inicial também adiciona a rota, tokens semânticos em `styles.css` e seletores de tema no painel e login. Alterações futuras de conteúdo devem partir da fonte canônica.

## Publicação

O projeto Vercel dedicado usa `vercel.json` e está conectado ao GitHub. A branch `main` publica a landing; o monorepo privado é separado.

```sh
vercel link --project finflow-landing --yes
vercel --prod --yes
```

Não inclua credenciais ou arquivos da aplicação privada. O fonte desta landing é publicamente visível; uma licença de redistribuição do código ainda não foi definida. A fonte Geist mantém sua licença OFL.

## Decisões e evidências

Validação concluída em 2 de novembro de 2026: typecheck, build e lint passaram nos dois projetos. A landing passou em 9 testes de navegador; a suíte completa do frontend do monorepo passou em 44 testes, incluindo os 12 cenários novos de integração. O axe não encontrou violações WCAG 2.1 AA nos estados verificados de ambos os temas após as transições. Screenshots em 390 e 1440 px foram inspecionados. A revisão independente não encontrou defeitos materiais pendentes.

O reposicionamento prioriza a vida financeira cotidiana e preserva a IA como opção adicional. Os dois temas usam tokens de superfície, texto, borda, entrada, saída e alerta; o app migra consumidores para esses tokens, sem inverter a paleta zinc globalmente. Nenhuma biblioteca de temas foi adicionada.

O histórico anterior à primeira reconstrução permanece no backup local `../finflow-landing-before-redesign.bundle`. As alterações preexistentes do monorepo foram preservadas. Semantica está indisponível nesta sessão; as decisões ficam registradas neste README e na documentação do app.

Referências: [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode), [Vercel CLI](https://vercel.com/docs/cli/deploy).
