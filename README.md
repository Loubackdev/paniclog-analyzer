# PanicLog Analyzer

Projeto acadêmico de Engenharia de Software: aplicação web simples para triagem inicial de logs Panic Full de iPhone.

## Funcionalidades

- Colar log manualmente.
- Enviar arquivo `.txt`, `.ips` ou `.log`.
- Identificar palavras-chave relacionadas a sensores, baseband, áudio, câmera e watchdog.
- Exibir diagnóstico provável, prioridade e recomendação técnica.
- Salvar histórico local no navegador.

## Como rodar localmente

```bash
npm install
npm run dev
```

## Como publicar na Vercel

1. Criar uma conta gratuita em https://vercel.com.
2. Enviar este projeto para um repositório GitHub.
3. Na Vercel, clicar em **Add New Project**.
4. Importar o repositório.
5. Manter o comando de build como `npm run build`.
6. Publicar.

## Observação

A aplicação não substitui diagnóstico técnico completo. Ela realiza uma triagem inicial baseada em termos encontrados no log.


## Atualização

O app também tenta identificar o modelo do aparelho a partir de identificadores como `iPhone12,1`, `iPhone14,2`, `iPhone15,3` ou por linhas como `Product:` e `Model:` presentes no log.
