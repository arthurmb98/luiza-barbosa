# Perfil Saúde

Aplicação web para divulgação de profissionais de saúde — psicologia, estética e áreas relacionadas. Cada profissional tem uma página com foto, especializações, texto sobre, registro profissional (CRP, CRM, COREN, RNTP etc.) e contato via WhatsApp.

O projeto é um template reutilizável: os dados de cada profissional ficam em arquivos separados e a mesma interface monta a página automaticamente.

## Requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- npm (incluído no Node)
- [nvm](https://github.com/nvm-sh/nvm) (recomendado para gerenciar a versão do Node)

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/arthurmb98/perfil-saude.git
cd perfil-saude

# Usar a versão do Node definida no projeto
nvm use

# Instalar dependências
npm install
```

## Como executar

Ambiente de desenvolvimento:

```bash
npm run dev
```

Abra o endereço exibido no terminal (em geral `http://localhost:5173`).

Build de produção:

```bash
npm run build
npm run preview
```

## Scripts disponíveis

| Comando         | Descrição                          |
|-----------------|------------------------------------|
| `npm run dev`   | Sobe o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção           |
| `npm run preview` | Visualiza a build localmente     |
| `npm run lint`  | Executa o linter                   |

## Estrutura principal

- `src/data/profiles/` — dados de cada profissional
- `src/pages/` — home (lista) e página de perfil
- `src/components/` — seções da landing e formulário de contato
- `src/services/leads/` — gravação local de leads (cache no navegador)
- `public/photos/` — fotos dos profissionais

## Como adicionar um profissional

1. Crie um arquivo em `src/data/profiles/` (ex.: `seu-nome.ts`).
2. Preencha nome, profissão, especializações, sobre, registro, WhatsApp e contatos.
3. Coloque a foto em `public/photos/` e aponte o campo `photo` (ex.: `/photos/seu-nome.jpg`).
4. Registre o perfil em `src/data/profiles/index.ts`.
5. Acesse `http://localhost:5173/seu-slug`.

Exemplo mínimo:

```ts
export const profile = {
  slug: 'seu-slug',
  name: 'Nome Completo',
  profession: 'Psicóloga',
  specialties: ['Psicanálise', 'Psicoterapia'],
  about: '...',
  photo: '/photos/seu-slug.jpg',
  registry: { type: 'CRP', number: '06/000000' },
  whatsapp: '5511999999999',
  whatsappMessage: 'Olá! Vi seu perfil e gostaria de agendar.',
}
```

Tipos de registro suportados: `CRP`, `CRM`, `COREN`, `RNTP`, `CRO`, `CRF`, `CREFITO`, `OUTRO`.

## Contato e leads

Ao clicar em **Falar no WhatsApp**, o visitante preenche nome e telefone. A data e hora do envio são registradas automaticamente. Em seguida o WhatsApp é aberto com mensagem pré-preenchida.

Na versão atual, os leads ficam salvos no `localStorage` do navegador (`perfil-saude:leads`), prontos para integração futura com um backend.

## Rotas

- `/` — lista de profissionais
- `/:slug` — página do profissional

## Stack

- Vite
- React + TypeScript
- Tailwind CSS
- React Router
- Componentes de UI (estilo shadcn/ui)
