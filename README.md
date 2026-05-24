# PanicLog Analyzer 📱🛠️

Sistema web desenvolvido como projeto acadêmico de Engenharia de Software para auxiliar técnicos na análise inicial de logs Panic Full de iPhones.

## 📝 Descrição

PanicLog Analyzer é um sistema web em React + Vite para auxiliar técnicos na análise inicial de logs Panic Full de iPhones, identificando termos importantes, possíveis falhas, severidade e modelo provável do aparelho. 📱🛠️

## 🚀 Demonstração

Após hospedar o projeto na Vercel, adicione aqui o link final:

```txt
https://seu-projeto.vercel.app
```

## 📌 Sobre o projeto

O PanicLog Analyzer permite que o usuário cole um log Panic Full do iPhone e receba uma triagem técnica inicial com base em palavras-chave e padrões encontrados no texto.

O sistema pode identificar indícios relacionados a:

- Sensores térmicos;
- Baseband, modem ou sinal;
- Watchdog e travamentos de processo;
- Áudio, microfone ou periféricos;
- Câmera, flash ou conectores;
- Reinicializações críticas;
- Modelo provável do iPhone a partir de códigos como `iPhone12,1`.

> Importante: o sistema não substitui uma análise técnica completa. Ele funciona como ferramenta de apoio e triagem inicial para técnicos.

## 🧰 Tecnologias utilizadas

- React
- Vite
- JavaScript
- CSS
- Lucide React
- Vercel

## ✅ Funcionalidades

- Campo para colar logs Panic Full;
- Análise automática por palavras-chave;
- Exibição dos termos encontrados;
- Diagnóstico provável;
- Classificação por nível de severidade;
- Recomendação técnica inicial;
- Identificação aproximada do modelo do iPhone;
- Interface responsiva;
- Execução local;
- Hospedagem gratuita na Vercel.

## 📁 Estrutura do projeto

```txt
paniclog-analyzer
├── src
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## 💻 Como instalar e rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/paniclog-analyzer.git
```

### 2. Entrar na pasta do projeto

```bash
cd paniclog-analyzer
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Rodar o projeto

```bash
npm run dev
```

### 5. Abrir no navegador

Acesse:

```txt
http://localhost:5173
```

## 🌐 Como hospedar gratuitamente na Vercel

### Opção recomendada: GitHub + Vercel

1. Suba o projeto para um repositório no GitHub.
2. Acesse sua conta na Vercel.
3. Clique em `Add New Project`.
4. Importe o repositório do GitHub.
5. Confira as configurações do projeto:

```txt
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

6. Clique em `Deploy`.

Ao finalizar, a Vercel irá gerar um link público para acessar o sistema.

## 🧪 Como testar

Cole no campo de análise um trecho de log semelhante a:

```txt
panic-full
Product: iPhone12,1
panicString: missing sensor TG0B
thermalmonitord timeout
```

Resultado esperado:

- Modelo provável: iPhone 11;
- Possível falha relacionada a sensor térmico;
- Severidade alta ou média, conforme os termos encontrados;
- Recomendação técnica inicial para verificação de bateria, flex, conectores e sensores.

## 📦 Scripts disponíveis

### Rodar em desenvolvimento

```bash
npm run dev
```

### Gerar versão de produção

```bash
npm run build
```

### Visualizar build de produção localmente

```bash
npm run preview
```

## 🧑‍💻 Autor

**Gabriel Felipe dos Santos Louback**  
