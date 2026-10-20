# Dashboard de Custos Rurais

Painel web que lê planilhas de custos (Excel/CSV) de propriedades rurais e transforma os lançamentos em indicadores: total gasto, custo por categoria, **rateio entre soja e arroz**, **custo por hectare**, maiores gastos e busca em todos os lançamentos.

Roda 100% no navegador: os dados da planilha **não são enviados para nenhum servidor**.

> **Projeto desenvolvido com IA:** todo o código foi criado em conversa com o [Claude](https://claude.ai) (Anthropic), pelo claude.ai. Veja a seção [Desenvolvimento com IA](#desenvolvimento-com-ia).

<!-- Adicione um print em docs/screenshot.png e descomente a linha abaixo -->
[Painel de custos](docs/screenshot.png)

**Demo:** [Acessar painel online](https://tiagomilbradtt.github.io/dashboard_custos_rurais/) — usa dados fictícios gerados na hora.

## Funcionalidades

- Leitura de planilhas `.xlsx`, `.xls` e `.xlsm`, com detecção automática da linha de cabeçalho e das colunas
- **Visão geral:** KPIs, gasto por categoria, ranking e subcategorias com maior gasto
- **Por cultura:** divisão do gasto entre soja e arroz e custo de cada cultura em cada categoria
- **Por hectare:** custo por hectare e participação percentual de cada categoria e subcategoria
- **Maiores gastos** e **busca** em todos os lançamentos (várias palavras, com paginação)
- Filtros por período e categoria
- Exportação para Excel e impressão em PDF
- Modo claro/escuro e layout responsivo
- Modo demonstração com dados fictícios (o botão "Gerar novos dados de exemplo" cria um conjunto diferente a cada clique)

## Regra de alocação por cultura

Cada lançamento é dividido entre soja e arroz assim:

1. Se a coluna **Cultura** indica só uma cultura, 100% do valor vai para ela.
2. Se indica as duas culturas (ou está vazia), aplica-se o **rateio da categoria**, definido na aba "Informações Variáveis".
3. Lançamentos de **Investimentos** (que não têm cultura) usam sempre o rateio da própria categoria.
4. Sem rateio para a categoria, o lançamento fica como "não alocado".

## Formato esperado da planilha

| Aba | Colunas | Obrigatória |
|---|---|---|
| Entrada de Dados | Data, Valor, Descrição, Cultura, Categoria, Subcategoria, Beneficiário, Documento | Sim |
| Investimentos | Data, Valor, Descrição, Beneficiário, Documento | Não |
| Comissões | Data, Valor, Descrição, Cultura, Recebedor | Não |
| Pró-labores | Data, Valor | Não |
| Informações Variáveis | Tabela de rateio por categoria (colunas Arroz e Soja, em fração ou %) e bloco "ÁREA TOTAL" com os hectares de cada cultura | Não |

Os nomes das abas e colunas ignoram acentos e maiúsculas/minúsculas.

## Como rodar

O projeto usa módulos ES, então precisa ser servido por HTTP (abrir o `index.html` com duplo clique não funciona):

```bash
python3 -m http.server 8080
# ou: npx serve
```

Depois acesse <http://localhost:8080>. O painel abre com dados de exemplo; para usar uma planilha sua, clique em **Abrir planilha** ou arraste o arquivo para a janela.

## Estrutura

```
├── index.html            Marcação da página
├── css/styles.css        Componentes visuais e estilos de impressão
├── js/
│   ├── main.js           Ponto de entrada e eventos
│   ├── loader.js         Carrega planilhas ou dados de exemplo
│   ├── parser.js         Leitura das abas extras e de rateio
│   ├── allocation.js     Regras de rateio entre culturas (lógica pura)
│   ├── calc.js           Filtros e agregações
│   ├── views.js          Renderização de cada aba
│   ├── charts.js         Gráficos (Chart.js)
│   ├── tables.js         Tabelas
│   ├── export.js         Exportação para Excel
│   ├── demo-data.js      Gerador de dados fictícios
│   ├── state.js          Estado e paleta de cores
│   └── utils.js          Conversão e formatação (números, datas, moeda)
└── tests/                Testes automatizados
```

## Testes

Requer Node.js 20 ou superior, sem instalar dependências:

```bash
npm test
```

Cobrem a conversão de números e datas no formato brasileiro, as regras de rateio e um teste de integração que executa o painel inteiro (todas as abas, busca, exportação e leitura de planilha).

## Publicar no GitHub Pages

No repositório: **Settings → Pages → Deploy from a branch → `main` / `(root)`**. O painel fica disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Tecnologias

HTML, CSS e JavaScript (ES modules) · [Tailwind CSS](https://tailwindcss.com) · [Chart.js](https://www.chartjs.org) · [SheetJS](https://sheetjs.com), todos via CDN.

## Desenvolvimento com IA

Este projeto foi construído por mim usando o **claude.ai**, o assistente de IA da Anthropic, em um processo iterativo de conversa:

- **Eu defini** o problema, as regras de negócio (alocação por cultura, rateio por categoria, custo por hectare), a estrutura da planilha e quais análises o painel deveria ter.
- **O Claude escreveu o código** a partir desses requisitos, e eu testei com planilhas e dados de exemplo, pedi ajustes e aprovei cada versão.
- **A organização final do repositório** (módulos, testes, README) também foi feita com o Claude, a partir da versão que eu já havia aprovado.

## Limitações conhecidas

- As culturas (soja e arroz) estão fixas no código.
- Tailwind, Chart.js e SheetJS são carregados por CDN, então é preciso ter internet.
- A lógica de leitura de planilha ainda mistura parte da interface; separar o parsing em uma função pura facilitaria mais testes.

## Licença

[MIT](LICENSE)
