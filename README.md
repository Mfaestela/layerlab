# LayerLab

App de gestao de impressao 3D. React + Vite + Supabase, PWA pronto para iPhone.

## Estrutura

```
layerlab/
├── App.jsx          codigo principal do app
├── main.jsx         entry point React
├── index.html       html com meta tags PWA + fontes
├── package.json     dependencias
├── vite.config.js   config do Vite
├── .gitignore
└── public/          arquivos servidos diretamente (NAO MOVER)
    ├── logo.png
    ├── icon-192.png
    ├── icon-512.png
    ├── apple-touch-icon.png
    ├── manifest.json
    └── sw.js
```

> Importante: tudo que esta em `public/` precisa continuar la. O Vite serve
> esses arquivos pelo caminho raiz (ex: `/logo.png`). Se mover para a raiz do
> projeto, a logo e os icones param de aparecer no build.

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar no Vercel

1. Suba este projeto para um repositorio no GitHub.
2. No Vercel, importe o repositorio.
3. O Vercel detecta o Vite automaticamente (build: `npm run build`, output: `dist`).
4. Deploy.

## Banco de dados (Supabase)

As credenciais ja estao em `App.jsx`. As tabelas necessarias sao:
`clients`, `orders`, `catalog`, `supplies`, `services`. Veja o SQL do projeto
para criar as tabelas e as policies de RLS.
