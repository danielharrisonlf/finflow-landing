# FinFlow · Landing page

Uma nova presença para o FinFlow: precisão em cada centavo, quatro interfaces e suas finanças na sua linguagem.

**Produção:** https://finflow-landing-umber.vercel.app/

## O que este repositório contém

Landing independente em React 19, TypeScript, Vite e Tailwind CSS 4. Fontes Geist e Geist Mono hospedadas junto ao site. Ícones Lucide e fotografias editoriais Unsplash com tamanhos e compressão definidos.

- Dashboard local: períodos, transações, cartões, simulação reversível de despesa e download CSV.
- Terminal com três comandos simulados.
- Demonstrações de interação MCP e Telegram.
- Calculadora de metas em centavos inteiros, com arredondamento para cima e tratamento de objetivo alcançado.
- FAQ nativo acessível, menu mobile, foco visível e suporte a movimento reduzido.

## Estado do produto

O produto FinFlow permanece privado. Sua abertura está planejada, sem data anunciada. Este repositório público contém **apenas a landing**, não a API, o dashboard completo, a CLI ou o servidor MCP.

As demonstrações usam dados ilustrativos no navegador. Não há cadastro, conexão bancária, pagamento real ou envio de valores financeiros para um servidor. Dados do simulador não persistem entre sessões. Casos de uso são ilustrativos e não representam depoimentos de clientes. Fotografias são editoriais do Unsplash.

As funcionalidades descritas do produto foram conferidas no README e no código do monorepo em 2 de novembro de 2026: centavos inteiros, exportação CSV/OFX, faturas e parcelamentos, metas, orçamentos, CLI, tools MCP `export_transactions`, `list_card_invoices` e `pay_invoice`. A integração real do Telegram depende da instalação e não é validada por este site. Não se anuncia integração Open Finance ou multi-tenancy sem evidência.

## Desenvolvimento

Requisitos: Node 24 e pnpm 10.11.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm lint
pnpm build
pnpm test:e2e
```

Os testes usam Chromium com Playwright e axe. Na primeira instalação, se necessário, execute `pnpm exec playwright install chromium`. Os relatórios e screenshots ficam em `test-results/`, ignorado pelo Git.

## Publicação

O projeto usa `vercel.json` para build Vite estático e cache de assets com hash. O repositório público e o projeto Vercel são dedicados à landing. Depois de autenticar o CLI:

```sh
vercel link --project finflow-landing --yes
vercel --prod --yes
```

Não são necessárias variáveis de ambiente. Nenhuma credencial ou arquivo do produto privado deve ser incluído. O código-fonte é publicamente visível; uma licença de redistribuição ainda não foi definida.

## Validação desta reconstrução

Em 2 de novembro de 2026, `pnpm lint` e `pnpm build` passaram. A suíte independente de Playwright passou em 13 de 13 cenários, incluindo layouts de 375, 768, 1024 e 1440 px, exportação CSV, demonstrações locais, cálculo de metas, teclado e movimento reduzido. A execução axe não encontrou violações críticas ou sérias. Os screenshots completos foram inspecionados e ficam em `test-results/screenshots/` após executar a suíte.

A revisão independente de código foi concluída e a legenda da lista de transações na visualização de cartões foi corrigida. As decisões foram registradas aqui porque Semantica não está disponível nesta sessão.

O histórico anterior foi preservado localmente em `../finflow-landing-before-redesign.bundle`. A exclusão remota foi recusada pelo GitHub por falta do escopo `delete_repo`; a reconstrução substitui a branch principal com um histórico novo no mesmo endereço público.

## Referências técnicas

- [Tailwind CSS com Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Publicação com Vercel CLI](https://vercel.com/docs/cli/deploy)
