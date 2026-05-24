import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, ClipboardPaste, FileText, Smartphone, Wrench, Trash2, CheckCircle2 } from 'lucide-react';
import './styles.css';

const RULES = [
  {
    name: 'Sensor térmico / linha de temperatura',
    severity: 'Alta',
    terms: ['thermalmonitord', 'missing sensor', 'TG0B', 'TG0V', 'TG0P', 'TG0D', 'TG1B', 'TG1V'],
    diagnosis: 'Possível falha em sensor térmico, bateria, flex associado ou comunicação de sensores na placa.',
    recommendation: 'Verificar bateria, flexes conectados, oxidação, conectores e histórico de troca de peças.'
  },
  {
    name: 'Baseband / modem / sinal',
    severity: 'Alta',
    terms: ['baseband', 'modem', 'cellular', 'radio', 'bb'],
    diagnosis: 'Indício de falha relacionada a rede, modem/baseband ou comunicação com circuito de sinal.',
    recommendation: 'Testar sinal, IMEI, firmware/modem, consumo e histórico de queda/impacto.'
  },
  {
    name: 'Watchdog / travamento de processo',
    severity: 'Média',
    terms: ['watchdog', 'userspace watchdog timeout', 'service exited due to SIGKILL', 'timeout'],
    diagnosis: 'O sistema reiniciou por travamento ou demora de resposta de algum processo crítico.',
    recommendation: 'Atualizar/restaurar o iOS quando possível e investigar se o log aponta periféricos ou sensores específicos.'
  },
  {
    name: 'Áudio / dock / microfone',
    severity: 'Média',
    terms: ['audio', 'mic1', 'mic2', 'speaker', 'codec', 'i2s'],
    diagnosis: 'Possível falha em flex de carga, microfone, circuito de áudio, alto-falante ou comunicação de áudio.',
    recommendation: 'Testar dock/carga, microfones, flexes, limpeza de conectores e histórico de troca de tela/carcaça.'
  },
  {
    name: 'Câmera / flash / periférico',
    severity: 'Média',
    terms: ['camera', 'backboardd', 'flash', 'avcapture', 'isp'],
    diagnosis: 'Possível falha relacionada ao conjunto de câmera, flash, periférico ou comunicação com câmera.',
    recommendation: 'Testar câmeras, flash, conectores, flexes e possíveis danos por queda ou umidade.'
  },
  {
    name: 'Kernel panic / reinicialização crítica',
    severity: 'Baixa',
    terms: ['panic-full', 'panicString', 'kernel', 'panic(cpu'],
    diagnosis: 'O arquivo indica uma reinicialização crítica registrada pelo sistema.',
    recommendation: 'Ler os trechos principais do panicString e cruzar com sintomas apresentados pelo cliente.'
  }
];


const IPHONE_MODELS = {
  'iPhone10,3': 'iPhone X', 'iPhone10,6': 'iPhone X',
  'iPhone11,2': 'iPhone XS', 'iPhone11,4': 'iPhone XS Max', 'iPhone11,6': 'iPhone XS Max', 'iPhone11,8': 'iPhone XR',
  'iPhone12,1': 'iPhone 11', 'iPhone12,3': 'iPhone 11 Pro', 'iPhone12,5': 'iPhone 11 Pro Max', 'iPhone12,8': 'iPhone SE 2ª geração',
  'iPhone13,1': 'iPhone 12 mini', 'iPhone13,2': 'iPhone 12', 'iPhone13,3': 'iPhone 12 Pro', 'iPhone13,4': 'iPhone 12 Pro Max',
  'iPhone14,4': 'iPhone 13 mini', 'iPhone14,5': 'iPhone 13', 'iPhone14,2': 'iPhone 13 Pro', 'iPhone14,3': 'iPhone 13 Pro Max', 'iPhone14,6': 'iPhone SE 3ª geração',
  'iPhone14,7': 'iPhone 14', 'iPhone14,8': 'iPhone 14 Plus', 'iPhone15,2': 'iPhone 14 Pro', 'iPhone15,3': 'iPhone 14 Pro Max',
  'iPhone15,4': 'iPhone 15', 'iPhone15,5': 'iPhone 15 Plus', 'iPhone16,1': 'iPhone 15 Pro', 'iPhone16,2': 'iPhone 15 Pro Max',
  'iPhone17,3': 'iPhone 16', 'iPhone17,4': 'iPhone 16 Plus', 'iPhone17,1': 'iPhone 16 Pro', 'iPhone17,2': 'iPhone 16 Pro Max', 'iPhone17,5': 'iPhone 16e'
};

function detectDeviceModel(text) {
  if (!text.trim()) return { identifier: 'Não informado', model: 'Não identificado', confidence: 'Baixa' };

  const direct = text.match(/iPhone\d{2},\d/);
  if (direct) {
    const identifier = direct[0];
    return {
      identifier,
      model: IPHONE_MODELS[identifier] || 'iPhone identificado fora da base cadastrada',
      confidence: IPHONE_MODELS[identifier] ? 'Alta' : 'Média'
    };
  }

  const modelLine = text.match(/(?:product|model|device|hw\.model|hardware model|productType)\s*[:=]\s*([A-Za-z0-9,\-\s]+)/i);
  if (modelLine) {
    const raw = modelLine[1].trim().split(/[\n\r]/)[0];
    const identifier = raw.match(/iPhone\d{2},\d/);
    if (identifier) {
      return { identifier: identifier[0], model: IPHONE_MODELS[identifier[0]] || 'iPhone identificado fora da base cadastrada', confidence: 'Média' };
    }
    return { identifier: raw, model: raw, confidence: 'Média' };
  }

  const marketing = text.match(/iPhone\s?(?:X|XR|XS|SE|11|12|13|14|15|16)(?:\s?(?:mini|Plus|Pro|Pro Max|Max|2ª geração|3ª geração))?/i);
  if (marketing) {
    return { identifier: 'Modelo comercial informado no log', model: marketing[0].replace(/\s+/g, ' '), confidence: 'Média' };
  }

  return { identifier: 'Não encontrado no log', model: 'Não identificado automaticamente', confidence: 'Baixa' };
}

function analyzeLog(text) {
  const lower = text.toLowerCase();
  const matches = RULES.map(rule => {
    const foundTerms = rule.terms.filter(term => lower.includes(term.toLowerCase()));
    return { ...rule, foundTerms };
  }).filter(rule => rule.foundTerms.length > 0);

  const score = matches.reduce((total, item) => {
    if (item.severity === 'Alta') return total + 3;
    if (item.severity === 'Média') return total + 2;
    return total + 1;
  }, 0);

  let priority = 'Baixa';
  if (score >= 5) priority = 'Alta';
  else if (score >= 2) priority = 'Média';

  const device = detectDeviceModel(text);
  return { matches, score, priority, totalChars: text.length, device };
}

function sampleLog() {
  return `panic-full-2026-05-10.ips\nProduct: iPhone12,1\npanicString: userspace watchdog timeout: thermalmonitord not responding\nmissing sensor TG0B\nthermalmonitord: sensor read failed\n`; 
}

function App() {
  const [log, setLog] = useState('');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('panic-history') || '[]'));
  const result = useMemo(() => analyzeLog(log), [log]);

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setLog(String(e.target.result || ''));
    reader.readAsText(file);
  }

  function saveResult() {
    if (!log.trim()) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleString('pt-BR'),
      priority: result.priority,
      model: result.device.model,
      matches: result.matches.map(m => m.name).join(', ') || 'Sem padrão identificado'
    };
    const next = [item, ...history].slice(0, 5);
    setHistory(next);
    localStorage.setItem('panic-history', JSON.stringify(next));
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('panic-history');
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="badge"><Smartphone size={18}/> Assistência técnica inteligente</div>
        <h1>PanicLog Analyzer</h1>
        <p>Triagem inicial de logs Panic Full de iPhone por palavras-chave, prioridade e recomendações técnicas.</p>
      </section>

      <section className="grid">
        <div className="card input-card">
          <div className="card-title"><FileText/> Inserir log</div>
          <textarea
            value={log}
            onChange={e => setLog(e.target.value)}
            placeholder="Cole aqui o conteúdo do panic-full ou envie um arquivo .txt/.ips..."
          />
          <div className="actions">
            <label className="button secondary">
              Enviar arquivo
              <input type="file" accept=".txt,.ips,.log" onChange={handleFile} hidden />
            </label>
            <button className="button" onClick={() => setLog(sampleLog())}><ClipboardPaste size={16}/> Usar exemplo</button>
            <button className="button danger" onClick={() => setLog('')}><Trash2 size={16}/> Limpar</button>
          </div>
        </div>

        <div className="card result-card">
          <div className="card-title"><Wrench/> Resultado da análise</div>
          {!log.trim() ? (
            <div className="empty">Cole um log para iniciar a análise.</div>
          ) : (
            <>
              <div className={`priority ${result.priority.toLowerCase()}`}>Prioridade: {result.priority}</div>
              <p className="muted">Caracteres analisados: {result.totalChars}</p>
              <div className="device-box">
                <strong>Modelo do aparelho:</strong> {result.device.model}<br />
                <small>Identificador: {result.device.identifier} • Confiança: {result.device.confidence}</small>
              </div>
              {result.matches.length === 0 ? (
                <div className="alert"><AlertTriangle/> Nenhum padrão cadastrado foi identificado. Faça análise manual do panicString.</div>
              ) : result.matches.map((match, index) => (
                <div className="match" key={index}>
                  <h3>{match.name}</h3>
                  <p><strong>Termos encontrados:</strong> {match.foundTerms.join(', ')}</p>
                  <p><strong>Diagnóstico provável:</strong> {match.diagnosis}</p>
                  <p><strong>Recomendação:</strong> {match.recommendation}</p>
                </div>
              ))}
              <button className="button full" onClick={saveResult}><CheckCircle2 size={16}/> Salvar no histórico local</button>
            </>
          )}
        </div>
      </section>

      <section className="card history-card">
        <div className="card-title"><FileText/> Histórico local</div>
        {history.length === 0 ? <p className="muted">Nenhuma análise salva ainda.</p> : (
          <div className="history-list">
            {history.map(item => (
              <div className="history-item" key={item.id}>
                <strong>{item.date}</strong>
                <span>Prioridade: {item.priority}</span>
                <span>Modelo: {item.model || 'Não informado'}</span>
                <small>{item.matches}</small>
              </div>
            ))}
          </div>
        )}
        <button className="button danger small" onClick={clearHistory}>Apagar histórico</button>
      </section>

      <footer>LOUTECH • Projeto acadêmico de Engenharia de Software • Vercel</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
