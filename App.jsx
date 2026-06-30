import { useState, useEffect, useCallback } from "react";

// ============================================================
// SUPABASE CONFIG
// ============================================================
const SUPA_URL = "https://jforxecmnsflbzvxdfsr.supabase.co";
const SUPA_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmb3J4ZWNtbnNmbGJ6dnhkZnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjgxMDQsImV4cCI6MjA5NzkwNDEwNH0.2BjpATxVU_qQLYyLib3Akwt6JnkEFBNyxMgSJhG1SLs";

const headers = () => ({
  "Content-Type": "application/json",
  apikey: SUPA_KEY,
  Authorization: `Bearer ${SUPA_KEY}`,
  Prefer: "return=representation",
});

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

const db = {
  list: (table, query = "") => sbFetch(`${table}?${query}&order=created_at.desc`),
  get: (table, id) => sbFetch(`${table}?id=eq.${id}`).then((r) => r[0]),
  insert: (table, data) =>
    sbFetch(table, { method: "POST", body: JSON.stringify(data) }),
  update: (table, id, data) =>
    sbFetch(`${table}?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (table, id) =>
    sbFetch(`${table}?id=eq.${id}`, { method: "DELETE" }),
};

// ============================================================
// STORAGE (upload de imagens no bucket "catalogo")
// ============================================================
const BUCKET = "catalogo";

async function uploadImage(file) {
  // gera nome unico
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const res = await fetch(`${SUPA_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
    method: "POST",
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      "Content-Type": file.type || "image/jpeg",
      "x-upsert": "true",
    },
    body: file,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error("Falha no upload: " + t);
  }
  // URL publica
  return `${SUPA_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

// Redimensiona a imagem no navegador antes de subir (economiza espaco)
function resizeImage(file, maxSize = 1000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Erro ao processar imagem"));
            const out = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
            resolve(out);
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => reject(new Error("Imagem invalida"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

// ============================================================
// AUTH
// ============================================================
async function signIn(email, password) {
  const res = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPA_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Erro ao fazer login");
  return data;
}

async function signOut(token) {
  await fetch(`${SUPA_URL}/auth/v1/logout`, {
    method: "POST",
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${token}` },
  });
}

// ============================================================
// HELPERS
// ============================================================
function fmtBRL(val) {
  const n = parseFloat(val) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseMoney(str) {
  if (!str) return 0;
  const cleaned = String(str).replace(/[^\d]/g, "");
  return parseFloat(cleaned) / 100 || 0;
}

function formatMoneyInput(raw) {
  const digits = String(raw).replace(/[^\d]/g, "");
  const num = parseFloat(digits) / 100 || 0;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

function toISO(brDate) {
  if (!brDate) return "";
  const [d, m, y] = brDate.split("/");
  if (!d || !m || !y) return brDate;
  return `${y}-${m}-${d}`;
}

function toBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function whatsappLink(phone, msg) {
  const n = String(phone || "").replace(/\D/g, "");
  const full = n.startsWith("55") ? n : `55${n}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(msg)}`;
}

function daysOverdue(deliveryDate) {
  if (!deliveryDate) return null;
  const d = new Date(toISO(deliveryDate));
  const today = new Date();
  const diff = Math.floor((today - d) / 86400000);
  return diff;
}

// Dias ate a entrega (negativo = atrasado). Aceita ISO (aaaa-mm-dd) ou BR (dd/mm/aaaa)
function daysUntil(dateStr) {
  if (!dateStr) return null;
  let iso = dateStr;
  if (dateStr.includes("/")) iso = toISO(dateStr);
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

const STATUS_LIST = [
  "Pedido Recebido",
  "Em Producao",
  "Acabamento",
  "Finalizado",
  "Entregue",
];

const STATUS_EMOJI = {
  "Pedido Recebido": "📥",
  "Em Producao": "⚙️",
  Acabamento: "✨",
  Finalizado: "✅",
  Entregue: "📦",
};

const STATUS_COLOR = {
  "Pedido Recebido": "#7B4FA6",
  "Em Producao": "#1565C0",
  Acabamento: "#6A1B9A",
  Finalizado: "#2E7D32",
  Entregue: "#4527A0",
};

const PAYMENT_METHODS = ["PIX", "Dinheiro"];

const CATALOG_CATEGORIES = [
  "Decoracao",
  "Miniatura",
  "Funcional",
  "Personalizado",
  "Jogo & RPG",
  "Infantil",
  "Outro",
];

// Categorias de Equipamentos (duram - patrimonio)
const EQUIPMENT_CATEGORIES = [
  "Impressora",
  "Ferramentas",
  "Organizacao",
  "Pinceis",
  "Equipamento",
  "Outro",
];

// Categorias de Consumiveis (acabam na producao)
const CONSUMABLE_CATEGORIES = [
  "Filamento",
  "Tinta & Primer",
  "Canetinhas",
  "Embalagem",
  "Acabamento",
  "Outro",
];

const SUPPLY_CATEGORIES = [
  "Impressora",
  "Filamento",
  "Tinta & Primer",
  "Ferramentas",
  "Embalagem",
  "Acabamento",
  "Equipamento",
  "Outro",
];

// ============================================================
// STYLES
// ============================================================
const C = {
  bg: "#1E1040",
  bg2: "#2A1658",
  purple: "#7B4FA6",
  lilac: "#9B6DC5",
  dark: "#3D2066",
  text: "#EEE8FF",
  textSoft: "#C9A8FF",
  card: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(201,168,255,0.15)",
  success: "#2E7D32",
  danger: "#C62828",
  warn: "#E65100",
};

// Fontes: Sora para titulos/numeros, Manrope para corpo
const DISPLAY = "'Sora', 'Segoe UI', sans-serif";
const BODY = "'Manrope', 'Segoe UI', sans-serif";

const s = {
  page: {
    minHeight: "100dvh",
    background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bg2} 100%)`,
    color: C.text,
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    borderBottom: `1px solid ${C.cardBorder}`,
    background: "rgba(20,10,48,0.9)",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  content: {
    padding: "16px",
    maxWidth: 480,
    margin: "0 auto",
  },
  card: {
    background: C.card,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 8,
    color: C.text,
    padding: "10px 12px",
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
  },
  dateInput: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 8,
    color: C.text,
    padding: "0 12px",
    height: 44,
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
    WebkitAppearance: "none",
    appearance: "none",
    textAlign: "left",
    minWidth: 0,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: C.textSoft,
    marginBottom: 4,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  btn: {
    background: C.purple,
    color: C.text,
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  btnDanger: {
    background: "#3B0000",
    color: "#FF8A80",
    border: `1px solid #7f0000`,
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
  btnGhost: {
    background: "transparent",
    color: C.textSoft,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
  tag: (color) => ({
    display: "inline-block",
    background: `${color}33`,
    color: color,
    border: `1px solid ${color}55`,
    borderRadius: 20,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 600,
  }),
};

// ============================================================
// MONEY FIELD
// ============================================================
function MoneyField({ label, value, onChange, placeholder }) {
  const [display, setDisplay] = useState(
    value ? formatMoneyInput(String(Math.round(value * 100))) : ""
  );

  useEffect(() => {
    if (value === 0 || value === "") {
      setDisplay("");
    } else {
      setDisplay(formatMoneyInput(String(Math.round(parseFloat(value || 0) * 100))));
    }
  }, [value]);

  function handleChange(e) {
    const digits = e.target.value.replace(/[^\d]/g, "");
    const numeric = parseFloat(digits) / 100 || 0;
    setDisplay(formatMoneyInput(digits));
    onChange(numeric);
  }

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={s.label}>{label}</label>}
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: C.textSoft,
            fontSize: 14,
            pointerEvents: "none",
          }}
        >
          R$
        </span>
        <input
          inputMode="numeric"
          style={{ ...s.input, paddingLeft: 32 }}
          value={display}
          onChange={handleChange}
          placeholder={placeholder || "0,00"}
        />
      </div>
    </div>
  );
}

// ============================================================
// TIME FIELD (mascara 00:00 -> armazena horas decimais)
// ============================================================
function hoursToHHMM(decimal) {
  const total = Math.round((parseFloat(decimal) || 0) * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function digitsToHours(digits) {
  const d = digits.replace(/\D/g, "").slice(-4).padStart(4, "0");
  let h = parseInt(d.slice(0, 2), 10);
  let m = parseInt(d.slice(2), 10);
  if (m > 59) m = 59;
  return h + m / 60;
}

function formatTimeInput(digits) {
  const d = digits.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}

function TimeField({ label, value, onChange, placeholder }) {
  const [display, setDisplay] = useState(value ? hoursToHHMM(value) : "");

  useEffect(() => {
    if (!value) setDisplay("");
    else setDisplay(hoursToHHMM(value));
  }, [value]);

  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      setDisplay("");
      onChange(0);
      return;
    }
    setDisplay(formatTimeInput(digits));
    onChange(digitsToHours(digits));
  }

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={s.label}>{label}</label>}
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: C.textSoft,
            fontSize: 12,
            pointerEvents: "none",
          }}
        >
          h:min
        </span>
        <input
          inputMode="numeric"
          style={s.input}
          value={display}
          onChange={handleChange}
          placeholder={placeholder || "00:00"}
        />
      </div>
    </div>
  );
}

// ============================================================
// FIELD
// ============================================================
function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: 12, ...style }}>
      {label && <label style={s.label}>{label}</label>}
      {children}
    </div>
  );
}

// ============================================================
// LOGO (icone neon)
// ============================================================
function Logo({ size = 32 }) {
  const src = `${import.meta.env.BASE_URL}logo.png`;
  return (
    <img
      src={src}
      alt="LayerLab"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        display: "block",
        objectFit: "cover",
        filter: "drop-shadow(0 0 12px rgba(155,109,197,0.5))",
      }}
    />
  );
}

// ============================================================
// ICONES SVG (linha, modernos)
// ============================================================
function Icon({ name, size = 24, color = "currentColor", stroke = 1.8 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "home":
      return (
        <svg {...p}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V20h14V9.5" />
          <path d="M9.5 20v-6h5v6" />
        </svg>
      );
    case "calc":
      return (
        <svg {...p}>
          <rect x="4" y="2.5" width="16" height="19" rx="3" />
          <line x1="8" y1="6.5" x2="16" y2="6.5" />
          <line x1="8" y1="11" x2="8.01" y2="11" />
          <line x1="12" y1="11" x2="12.01" y2="11" />
          <line x1="16" y1="11" x2="16.01" y2="11" />
          <line x1="8" y1="14.5" x2="8.01" y2="14.5" />
          <line x1="12" y1="14.5" x2="12.01" y2="14.5" />
          <line x1="16" y1="14.5" x2="16" y2="18" />
          <line x1="8" y1="18" x2="12" y2="18" />
        </svg>
      );
    case "orders":
      return (
        <svg {...p}>
          <path d="M9 3h6a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2V4a1 1 0 0 1 1-1Z" />
          <path d="M9 3.5h6V6H9z" />
          <line x1="8" y1="11" x2="16" y2="11" />
          <line x1="8" y1="15" x2="13" y2="15" />
        </svg>
      );
    case "clients":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
        </svg>
      );
    case "catalog":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="9" x2="9" y2="20" />
        </svg>
      );
    case "supplies":
      return (
        <svg {...p}>
          <path d="M21 8 12 3 3 8l9 5 9-5Z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <line x1="12" y1="13" x2="12" y2="21" />
        </svg>
      );
    case "services":
      return (
        <svg {...p}>
          <path d="M12 3a9 9 0 0 0 0 18c1 0 1.5-.8 1.5-1.6 0-.5-.2-.8-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-7.3-9-7.3Z" />
          <circle cx="7.5" cy="11" r="1" fill={color} stroke="none" />
          <circle cx="12" cy="7.5" r="1" fill={color} stroke="none" />
          <circle cx="16" cy="11" r="1" fill={color} stroke="none" />
        </svg>
      );
    case "finance":
      return (
        <svg {...p}>
          <line x1="4" y1="20" x2="20" y2="20" />
          <rect x="6" y="12" width="3" height="6" rx="0.5" />
          <rect x="11" y="8" width="3" height="10" rx="0.5" />
          <rect x="16" y="4" width="3" height="14" rx="0.5" />
        </svg>
      );
    case "logout":
      return (
        <svg {...p}>
          <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
          <path d="M9 12h11" />
          <path d="m13 8 4 4-4 4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M12 3 2 20h20L12 3Z" />
          <line x1="12" y1="9" x2="12" y2="14" />
          <line x1="12" y1="17.5" x2="12.01" y2="17.5" />
        </svg>
      );
    default:
      return null;
  }
}

// ============================================================
// NAV BAR
// ============================================================
const NAV_ITEMS = [
  { id: "home", icon: "home", label: "Inicio" },
  { id: "calc", icon: "calc", label: "Calc" },
  { id: "orders", icon: "orders", label: "Pedidos" },
  { id: "clients", icon: "clients", label: "Clientes" },
  { id: "catalog", icon: "catalog", label: "Catalogo" },
  { id: "supplies", icon: "supplies", label: "Insumos" },
  { id: "services", icon: "services", label: "Servicos" },
  { id: "finance", icon: "finance", label: "Financas" },
];

function NavBar({ page, setPage, onLogout }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(20,10,48,0.98)",
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${C.cardBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 200,
        overflowX: "auto",
      }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setPage(item.id)}
          style={{
            background: "none",
            border: "none",
            color: page === item.id ? C.lilac : "#7060A0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px 4px",
            fontSize: 10,
            fontWeight: page === item.id ? 700 : 400,
            cursor: "pointer",
            minWidth: 44,
            gap: 2,
            transition: "color 0.15s",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 20 }}>
            <Icon name={item.icon} size={20} color={page === item.id ? C.lilac : "#7060A0"} stroke={1.9} />
          </span>
          <span>{item.label}</span>
        </button>
      ))}
      <button
        onClick={onLogout}
        style={{
          background: "none",
          border: "none",
          color: "#7060A0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "8px 4px",
          fontSize: 10,
          cursor: "pointer",
          minWidth: 44,
          gap: 2,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 20 }}>
          <Icon name="logout" size={20} color="#7060A0" stroke={1.9} />
        </span>
        <span>Sair</span>
      </button>
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(() => localStorage.getItem("ll_email") || "");
  const [pass, setPass] = useState(() => localStorage.getItem("ll_pass") || "");
  const [remember, setRemember] = useState(!!localStorage.getItem("ll_email"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await signIn(email, pass);
      if (remember) {
        localStorage.setItem("ll_email", email);
        localStorage.setItem("ll_pass", pass);
      } else {
        localStorage.removeItem("ll_email");
        localStorage.removeItem("ll_pass");
      }
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bg2} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={96} />
          <h1
            style={{
              margin: "18px 0 4px",
              fontSize: 32,
              fontWeight: 700,
              fontFamily: DISPLAY,
              color: C.text,
              letterSpacing: "-0.5px",
            }}
          >
            LayerLab
          </h1>
          <p style={{ color: C.textSoft, fontSize: 14, margin: 0, letterSpacing: "0.02em" }}>
            Gestao de Impressao 3D
          </p>
        </div>

        <div style={s.card}>
          <form onSubmit={handleLogin}>
            <Field label="E-mail">
              <input
                style={s.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Senha">
              <input
                style={s.input}
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: C.purple }}
              />
              <label htmlFor="remember" style={{ color: C.textSoft, fontSize: 14 }}>
                Lembrar meus dados
              </label>
            </div>

            {error && (
              <p style={{ color: "#FF8A80", fontSize: 13, marginBottom: 12 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ ...s.btn, width: "100%", justifyContent: "center" }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HOME / DASHBOARD
// ============================================================
function HomePage({ setPage, orders, supplies }) {
  const received = orders.filter((o) => o.paid).reduce((s, o) => s + (o.final_price || 0), 0);
  const invested = supplies.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const profit = received - invested;

  // Lucro das vendas: soma do lucro (margem) de cada pedido pago
  const salesProfit = orders.filter((o) => o.paid).reduce((s, o) => s + (o.profit || 0), 0);
  // Movimentacao total: tudo que entrou em vendas + tudo que saiu em gastos
  const totalMovement = received + invested;

  const statusCount = (st) => orders.filter((o) => o.status === st).length;
  const recent = orders.slice(0, 4);

  // Prazos chegando: pedidos nao entregues com entrega ate 3 dias (ou atrasados)
  const upcoming = orders
    .filter((o) => o.status !== "Entregue" && o.delivery_date)
    .map((o) => ({ ...o, days: daysUntil(o.delivery_date) }))
    .filter((o) => o.days !== null && o.days <= 3)
    .sort((a, b) => a.days - b.days);

  // Botoes de navegacao centralizados focados no icone
  const tiles = [
    { id: "calc", icon: "calc", label: "Calc", tint: "#9B6DC5" },
    { id: "orders", icon: "orders", label: "Pedidos", tint: "#5B8DEF" },
    { id: "clients", icon: "clients", label: "Clientes", tint: "#4FC3F7" },
    { id: "catalog", icon: "catalog", label: "Catalogo", tint: "#FFB74D" },
    { id: "supplies", icon: "supplies", label: "Insumos", tint: "#FF8A80" },
    { id: "services", icon: "services", label: "Servicos", tint: "#C77DFF" },
    { id: "finance", icon: "finance", label: "Financas", tint: "#69F0AE" },
  ];

  const miniStatus = [
    { label: "Fila", status: "Pedido Recebido", color: C.lilac },
    { label: "Produzindo", status: "Em Producao", color: "#5B8DEF" },
    { label: "Acabando", status: "Acabamento", color: "#C77DFF" },
    { label: "Prontos", status: "Finalizado", color: "#69F0AE" },
  ];

  return (
    <div style={{ ...s.content }}>
      {/* Brand header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 2px 18px" }}>
        <Logo size={48} />
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: DISPLAY, letterSpacing: "-0.5px" }}>
            LayerLab
          </h2>
          <p style={{ color: C.textSoft, fontSize: 13, margin: 0 }}>Ola! 👋</p>
        </div>
      </div>

      {/* Movimentacao total */}
      <div style={{ ...s.card, marginBottom: 10, padding: "12px 16px" }}>
        <p style={{ color: C.textSoft, fontSize: 11, margin: "0 0 2px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Movimentacao Total
        </p>
        <p style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
          {fmtBRL(totalMovement)}
        </p>
        <p style={{ fontSize: 11, color: C.textSoft, margin: "2px 0 0" }}>
          Vendas {fmtBRL(received)} + Gastos {fmtBRL(invested)}
        </p>
      </div>

      {/* Dois indicadores de lucro lado a lado */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {/* Lucro Real */}
        <div
          style={{
            flex: 1,
            borderRadius: 18,
            padding: "16px",
            background: profit >= 0
              ? "linear-gradient(135deg, rgba(105,240,174,0.12), rgba(123,79,166,0.18))"
              : "linear-gradient(135deg, rgba(255,138,128,0.12), rgba(123,79,166,0.18))",
            border: `1px solid ${profit >= 0 ? "rgba(105,240,174,0.3)" : "rgba(255,138,128,0.3)"}`,
          }}
        >
          <p style={{ color: C.textSoft, fontSize: 10, margin: "0 0 4px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Lucro Real
          </p>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              color: profit >= 0 ? "#69F0AE" : "#FF8A80",
              letterSpacing: "-0.5px",
            }}
          >
            {fmtBRL(profit)}
          </p>
          <p style={{ fontSize: 10, color: C.textSoft, margin: "4px 0 0", lineHeight: 1.3 }}>
            {profit < 0 ? `Faltam ${fmtBRL(Math.abs(profit))} pra empatar` : "Vendas - investimento"}
          </p>
        </div>

        {/* Lucro das Vendas (margem) */}
        <div
          style={{
            flex: 1,
            borderRadius: 18,
            padding: "16px",
            background: "linear-gradient(135deg, rgba(105,240,174,0.1), rgba(123,79,166,0.16))",
            border: "1px solid rgba(105,240,174,0.25)",
          }}
        >
          <p style={{ color: C.textSoft, fontSize: 10, margin: "0 0 4px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Lucro das Vendas
          </p>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              color: "#69F0AE",
              letterSpacing: "-0.5px",
            }}
          >
            {fmtBRL(salesProfit)}
          </p>
          <p style={{ fontSize: 10, color: C.textSoft, margin: "4px 0 0", lineHeight: 1.3 }}>
            Margem somada por peca vendida
          </p>
        </div>
      </div>

      {/* Prazos chegando */}
      {upcoming.length > 0 && (
        <div
          style={{
            background: "rgba(255,183,77,0.10)",
            border: "1px solid rgba(255,183,77,0.35)",
            borderRadius: 18,
            padding: "14px 16px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Icon name="alert" size={18} color="#FFB74D" />
            <p style={{ fontSize: 12, color: "#FFB74D", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
              Prazos chegando
            </p>
          </div>
          {upcoming.map((o) => {
            const late = o.days < 0;
            const today = o.days === 0;
            const txt = late
              ? `${Math.abs(o.days)}d atrasado`
              : today
              ? "Entrega hoje!"
              : `em ${o.days}d`;
            return (
              <button
                key={o.id}
                onClick={() => setPage("orders")}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderTop: `1px solid rgba(255,183,77,0.15)`,
                  padding: "8px 0 6px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "left",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: "0 0 1px", fontWeight: 600, fontSize: 14, color: C.text }}>{o.client_name || "—"}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.textSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {o.product_name || o.description || "—"}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: late || today ? "#FF8A80" : "#FFB74D",
                    marginLeft: 10,
                    flexShrink: 0,
                  }}
                >
                  {txt}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Producao - bloco separado com titulo */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 18,
          padding: "14px 12px 12px",
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: 11, color: C.textSoft, margin: "0 0 12px 4px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
          Producao
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {miniStatus.map((item) => (
            <button
              key={item.status}
              onClick={() => setPage("orders")}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                padding: "4px 2px",
              }}
            >
              <p style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 700, margin: 0, color: item.color, lineHeight: 1 }}>
                {statusCount(item.status)}
              </p>
              <p style={{ fontSize: 10, color: C.textSoft, margin: "6px 0 0" }}>{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Acesso rapido - botoes centralizados focados no icone */}
      <p style={{ fontSize: 11, color: C.textSoft, margin: "0 0 12px 4px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
        Acesso Rapido
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 26,
        }}
      >
        {tiles.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              background: C.card,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 18,
              padding: "16px 4px 12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${item.tint}22, ${item.tint}0D)`,
                border: `1px solid ${item.tint}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={item.icon} size={26} color={item.tint} stroke={1.9} />
            </span>
            <span style={{ fontSize: 11, color: C.textSoft, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h3 style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, margin: 0 }}>Recentes</h3>
        <button
          onClick={() => setPage("orders")}
          style={{ background: "none", border: "none", color: C.lilac, fontSize: 12, cursor: "pointer", fontWeight: 500 }}
        >
          Ver todos →
        </button>
      </div>
      {recent.length === 0 && (
        <p style={{ color: C.textSoft, fontSize: 14 }}>Nenhum pedido ainda.</p>
      )}
      {recent.map((o) => (
        <button
          key={o.id}
          onClick={() => setPage("orders")}
          style={{
            width: "100%",
            background: C.card,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 8,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "left",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14, color: C.text }}>{o.client_name || "—"}</p>
            <p style={{ margin: 0, fontSize: 12, color: C.textSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {o.product_name || o.description || "—"}
            </p>
          </div>
          <span
            style={{
              fontSize: 18,
              marginLeft: 10,
              flexShrink: 0,
            }}
            title={o.status}
          >
            {STATUS_EMOJI[o.status]}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================================
// CALCULATOR
// ============================================================
// Estilo dos botoes de quantidade (+/-)
const qtyBtnStyle = {
  width: 28,
  height: 28,
  borderRadius: 7,
  background: C.dark,
  border: `1px solid ${C.cardBorder}`,
  color: C.text,
  fontSize: 16,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

function CalcPage({ services = [], reloadServices, orders = [], reloadOrders, clients = [], reloadClients, setPage }) {
  const [form, setForm] = useState({
    filamentPrice: 0,
    grams: 0,
    hours: 0,
    energyPerHour: 0,
    wearPerHour: 0,
    extras: 0,
    margin: 30,
    discount: 0,
  });
  // Servicos selecionados: [{ id, name, price, qty }]
  const [selServices, setSelServices] = useState([]);
  const [result, setResult] = useState(null);

  // Cadastro rapido de novo servico
  const [newSvc, setNewSvc] = useState(null); // null ou { name, description, price }
  const [savingSvc, setSavingSvc] = useState(false);

  // Vincular valor a um pedido
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState("");
  // Criar pedido novo direto da calculadora
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({ client_name: "", product_name: "" });
  // Carrega pedidos frescos do banco ao abrir a calculadora
  const [localOrders, setLocalOrders] = useState(orders);
  useEffect(() => {
    let active = true;
    db.list("orders").then((data) => { if (active) setLocalOrders(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addService(svc) {
    setSelServices((prev) => {
      const exists = prev.find((x) => x.id === svc.id);
      if (exists) return prev.map((x) => (x.id === svc.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { id: svc.id, name: svc.name, price: svc.price || 0, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setSelServices((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
    );
  }

  async function saveNewService() {
    if (!newSvc.name.trim()) {
      alert("Digite um nome para o servico.");
      return;
    }
    setSavingSvc(true);
    try {
      const [created] = await db.insert("services", {
        name: newSvc.name,
        description: newSvc.description || "",
        price: newSvc.price || 0,
      });
      if (reloadServices) await reloadServices();
      if (created) addService(created); // ja adiciona na calculadora
      setNewSvc(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingSvc(false);
    }
  }

  const servicesTotal = selServices.reduce((s, x) => s + x.price * x.qty, 0);

  function calc() {
    const filament = (form.filamentPrice / 1000) * form.grams;
    const energy = form.energyPerHour * form.hours;
    const wear = form.wearPerHour * form.hours;
    const labor = servicesTotal; // mao de obra agora vem dos servicos
    const extras = form.extras;
    const total = filament + energy + wear + labor + extras;
    const profit = total * (form.margin / 100);
    const priceBeforeDiscount = total + profit;
    const discount = form.discount || 0;
    const price = Math.max(0, priceBeforeDiscount - discount);
    setResult({ filament, energy, wear, labor, extras, total, profit, discount, priceBeforeDiscount, price });
    setLinkMsg("");
  }

  // Vincula o preco final calculado a um pedido existente
  async function linkToOrder(orderId) {
    if (!result) return;
    setLinking(true);
    try {
      // lucro da peca = lucro estimado menos o desconto dado
      const pieceProfit = Math.max(0, (result.profit || 0) - (result.discount || 0));
      // soma itens do catalogo ja existentes no pedido (pro total ficar certo)
      const ord = localOrders.find((o) => o.id === orderId);
      let itemsSum = 0;
      try {
        const prods = JSON.parse(ord?.products || "[]");
        itemsSum = prods.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
      } catch { itemsSum = 0; }
      await db.update("orders", orderId, { final_price: result.price + itemsSum, profit: pieceProfit });
      if (reloadOrders) await reloadOrders();
      setLinkMsg(`Valor ${fmtBRL(result.price)} vinculado ao pedido de ${ord?.client_name || "cliente"}!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLinking(false);
    }
  }

  // Cria um pedido novo (com cliente escolhido) e ja vincula o valor calculado
  async function createAndLink() {
    if (!result) return;
    if (!newOrderForm.client_name.trim()) { alert("Escolha ou digite o nome do cliente."); return; }
    setLinking(true);
    try {
      const pieceProfit = Math.max(0, (result.profit || 0) - (result.discount || 0));
      const [created] = await db.insert("orders", {
        client_name: newOrderForm.client_name.trim(),
        product_name: newOrderForm.product_name.trim() || "Pedido",
        description: "",
        status: "Pedido Recebido",
        paid: false,
        order_date: new Date().toISOString().split("T")[0],
        final_price: result.price,
        profit: pieceProfit,
      });
      if (reloadOrders) await reloadOrders();
      // atualiza lista local tambem
      const fresh = await db.list("orders");
      setLocalOrders(fresh);
      setLinkMsg(`Pedido criado para ${newOrderForm.client_name.trim()} com valor ${fmtBRL(result.price)}!`);
      setCreatingOrder(false);
      setNewOrderForm({ client_name: "", product_name: "" });
    } catch (err) {
      alert(err.message);
    } finally {
      setLinking(false);
    }
  }

  function numField(label, key, placeholder) {
    return (
      <MoneyField
        label={label}
        value={form[key]}
        onChange={(v) => set(key, v)}
        placeholder={placeholder}
      />
    );
  }

  // Servicos ainda nao adicionados (disponiveis no dropdown)
  const available = services.filter((s) => !selServices.find((x) => x.id === s.id));

  // Pedidos que ainda podem receber valor (nao entregues)
  const ordersOpen = localOrders.filter((o) => o.status !== "Entregue");

  return (
    <div style={s.content}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "16px 0 12px", fontFamily: DISPLAY }}>🧮 Calculadora</h2>

      <div style={s.card}>
        {numField("Preco do Filamento (R$/kg)", "filamentPrice", "0,00")}
        <Field label="Gramas Usadas (g)">
          <input
            style={s.input}
            inputMode="numeric"
            value={form.grams || ""}
            onChange={(e) => set("grams", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </Field>
        <TimeField
          label="Horas de Impressao"
          value={form.hours}
          onChange={(v) => set("hours", v)}
          placeholder="00:00"
        />
        {numField("Energia por Hora (R$/h)", "energyPerHour", "0,00")}
        {numField("Desgaste da Maquina por Hora (R$/h)", "wearPerHour", "0,00")}

        {/* ===== SERVICOS / MAO DE OBRA ===== */}
        <div
          style={{
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={{ ...s.label, margin: 0 }}>Servicos / Mao de Obra</label>
            <span style={{ color: "#69F0AE", fontWeight: 700, fontSize: 14 }}>{fmtBRL(servicesTotal)}</span>
          </div>

          {/* Selecionados */}
          {selServices.map((x) => (
            <div
              key={x.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: C.card,
                border: `1px solid ${C.cardBorder}`,
                borderRadius: 10,
                padding: "8px 10px",
                marginBottom: 6,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{x.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: C.textSoft }}>{fmtBRL(x.price)} cada</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => changeQty(x.id, -1)} style={qtyBtnStyle}>−</button>
                <span style={{ minWidth: 18, textAlign: "center", fontWeight: 700, fontSize: 14 }}>{x.qty}</span>
                <button onClick={() => changeQty(x.id, 1)} style={{ ...qtyBtnStyle, background: C.purple, borderColor: C.purple }}>+</button>
              </div>
            </div>
          ))}

          {selServices.length === 0 && !newSvc && (
            <p style={{ color: C.textSoft, fontSize: 12, margin: "0 0 10px" }}>
              Adicione servicos cadastrados ou crie um novo.
            </p>
          )}

          {/* Dropdown de servicos cadastrados */}
          {!newSvc && (
            <select
              style={{ ...s.input, marginBottom: 8 }}
              value=""
              onChange={(e) => {
                const svc = services.find((s) => s.id === e.target.value);
                if (svc) addService(svc);
                e.target.value = "";
              }}
            >
              <option value="">
                {available.length ? "+ Adicionar servico cadastrado..." : "Nenhum servico disponivel"}
              </option>
              {available.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {fmtBRL(s.price)}
                </option>
              ))}
            </select>
          )}

          {/* Cadastro rapido inline */}
          {newSvc ? (
            <div style={{ border: `1px solid ${C.purple}55`, borderRadius: 10, padding: 10, marginTop: 4 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 13 }}>🎨 Novo Servico</p>
              <input
                style={{ ...s.input, marginBottom: 8 }}
                placeholder="Nome (ex: Pintura)"
                value={newSvc.name}
                onChange={(e) => setNewSvc((f) => ({ ...f, name: e.target.value }))}
              />
              <MoneyField
                label={null}
                value={newSvc.price}
                onChange={(v) => setNewSvc((f) => ({ ...f, price: v }))}
                placeholder="Valor do servico"
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{ ...s.btn, flex: 1, justifyContent: "center", fontSize: 13 }}
                  disabled={savingSvc}
                  onClick={saveNewService}
                >
                  {savingSvc ? "Salvando..." : "Salvar e adicionar"}
                </button>
                <button style={{ ...s.btnGhost, fontSize: 13 }} onClick={() => setNewSvc(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              style={{ ...s.btnGhost, width: "100%", justifyContent: "center", fontSize: 13 }}
              onClick={() => setNewSvc({ name: "", description: "", price: 0 })}
            >
              ➕ Cadastrar novo servico
            </button>
          )}
        </div>

        {numField("Custos Extras (tinta, lixa, etc.)", "extras", "0,00")}
        <Field label="Margem de Lucro (%)">
          <input
            style={s.input}
            inputMode="numeric"
            value={form.margin || ""}
            onChange={(e) => set("margin", parseFloat(e.target.value) || 0)}
            placeholder="30"
          />
        </Field>

        <MoneyField
          label="Desconto (R$)"
          value={form.discount}
          onChange={(v) => set("discount", v)}
          placeholder="0,00"
        />

        <button style={{ ...s.btn, width: "100%", justifyContent: "center" }} onClick={calc}>
          Calcular
        </button>
      </div>

      {result && (
        <div style={{ ...s.card, marginTop: 8 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>Resultado</h3>
          {[
            ["Filamento", result.filament],
            ["Energia", result.energy],
            ["Desgaste", result.wear],
            ["Servicos / Mao de Obra", result.labor],
            ["Custos Extras", result.extras],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}
            >
              <span style={{ color: C.textSoft }}>{label}</span>
              <span>{fmtBRL(val)}</span>
            </div>
          ))}
          <div
            style={{
              borderTop: `1px solid ${C.cardBorder}`,
              marginTop: 8,
              paddingTop: 8,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
            }}
          >
            <span style={{ color: C.textSoft }}>Custo Total</span>
            <span style={{ fontWeight: 700 }}>{fmtBRL(result.total)}</span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 14 }}
          >
            <span style={{ color: C.textSoft }}>Lucro Estimado</span>
            <span style={{ color: "#69F0AE" }}>{fmtBRL(result.profit)}</span>
          </div>
          {result.discount > 0 && (
            <div
              style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 14 }}
            >
              <span style={{ color: C.textSoft }}>Desconto</span>
              <span style={{ color: "#FFB74D" }}>- {fmtBRL(result.discount)}</span>
            </div>
          )}
          <div
            style={{
              marginTop: 12,
              background: `linear-gradient(135deg, ${C.purple}, ${C.lilac})`,
              borderRadius: 10,
              padding: "12px 16px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0 0 2px", fontSize: 11, opacity: 0.8 }}>PRECO SUGERIDO DE VENDA</p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, fontFamily: DISPLAY, letterSpacing: "-1px" }}>{fmtBRL(result.price)}</p>
            {result.discount > 0 && (
              <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.7, textDecoration: "line-through" }}>
                {fmtBRL(result.priceBeforeDiscount)}
              </p>
            )}
          </div>

          {/* Vincular a um pedido */}
          <div style={{ marginTop: 14, borderTop: `1px solid ${C.cardBorder}`, paddingTop: 14 }}>
            <p style={{ fontSize: 12, color: C.textSoft, margin: "0 0 8px", fontWeight: 600 }}>
              🔗 Vincular este valor a um pedido
            </p>
            {linkMsg ? (
              <div
                style={{
                  background: "rgba(105,240,174,0.12)",
                  border: "1px solid rgba(105,240,174,0.3)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontSize: 13,
                  color: "#69F0AE",
                }}
              >
                ✅ {linkMsg}
                {setPage && (
                  <button
                    onClick={() => setPage("orders")}
                    style={{ ...s.btnGhost, marginTop: 8, width: "100%", justifyContent: "center", fontSize: 13 }}
                  >
                    Ver pedidos
                  </button>
                )}
              </div>
            ) : creatingOrder ? (
              /* Formulario de criar pedido novo */
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12 }}>
                <Field label="Cliente *">
                  {clients.length > 0 ? (
                    <select
                      style={s.input}
                      value={newOrderForm.client_name}
                      onChange={(e) => setNewOrderForm((f) => ({ ...f, client_name: e.target.value }))}
                    >
                      <option value="">Escolha um cliente...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      style={s.input}
                      value={newOrderForm.client_name}
                      onChange={(e) => setNewOrderForm((f) => ({ ...f, client_name: e.target.value }))}
                      placeholder="Nome do cliente"
                    />
                  )}
                </Field>
                <Field label="Produto / Descricao">
                  <input
                    style={s.input}
                    value={newOrderForm.product_name}
                    onChange={(e) => setNewOrderForm((f) => ({ ...f, product_name: e.target.value }))}
                    placeholder="Ex: Busto personalizado"
                  />
                </Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...s.btn, flex: 1, justifyContent: "center" }} disabled={linking} onClick={createAndLink}>
                    {linking ? "Criando..." : "Criar e vincular"}
                  </button>
                  <button style={s.btnGhost} onClick={() => { setCreatingOrder(false); setNewOrderForm({ client_name: "", product_name: "" }); }}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                {ordersOpen.length > 0 && (
                  <select
                    style={{ ...s.input, marginBottom: 8 }}
                    value=""
                    disabled={linking}
                    onChange={(e) => {
                      if (e.target.value) linkToOrder(e.target.value);
                      e.target.value = "";
                    }}
                  >
                    <option value="">{linking ? "Vinculando..." : "Vincular a um pedido existente..."}</option>
                    {ordersOpen.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.client_name || "Sem cliente"} — {o.product_name || o.description || "pedido"}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => setCreatingOrder(true)}
                  style={{ ...s.btnGhost, width: "100%", justifyContent: "center", fontSize: 13 }}
                >
                  + Criar novo pedido com este valor
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CATALOG PICKER (defined at root level)
// ============================================================
function CatalogPicker({ items, selected, onToggle, type }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter((i) =>
    (i.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        style={{ ...s.input, marginBottom: 10 }}
        placeholder={`Buscar ${type}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.map((item) => {
        const sel = selected.find((x) => x.id === item.id);
        const qty = sel ? sel.qty : 0;
        return (
          <div
            key={item.id}
            style={{
              ...s.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              marginBottom: 6,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600 }}>{item.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: C.textSoft }}>{fmtBRL(item.price)}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {qty > 0 && (
                <>
                  <button
                    onClick={() => onToggle(item, qty - 1)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: C.dark,
                      border: `1px solid ${C.cardBorder}`,
                      color: C.text,
                      fontSize: 16,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 20, textAlign: "center", fontWeight: 700 }}>{qty}</span>
                </>
              )}
              <button
                onClick={() => onToggle(item, qty + 1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: qty > 0 ? C.purple : C.dark,
                  border: `1px solid ${qty > 0 ? C.purple : C.cardBorder}`,
                  color: C.text,
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <p style={{ color: C.textSoft, fontSize: 13, textAlign: "center", padding: 16 }}>
          Nenhum item encontrado.
        </p>
      )}
    </div>
  );
}

// ============================================================
// ORDER EDIT PAGE
// ============================================================
function OrderEdit({ order, clients, catalog, services, onSave, onBack }) {
  const [form, setForm] = useState({
    client_name: order.client_name || "",
    product_name: order.product_name || "",
    description: order.description || "",
    order_date: order.order_date || new Date().toISOString().split("T")[0],
    delivery_date: order.delivery_date || "",
    payment_method: order.payment_method || "PIX",
    status: order.status || "Pedido Recebido",
    paid: order.paid || false,
    notes: order.notes || "",
    final_price: order.final_price || "",
  });

  const [selProducts, setSelProducts] = useState(() => {
    try {
      return JSON.parse(order.products || "[]");
    } catch {
      return [];
    }
  });

  const [selServices, setSelServices] = useState(() => {
    try {
      return JSON.parse(order.services || "[]");
    } catch {
      return [];
    }
  });

  // Valor calculado (vem da calculadora). Ao reabrir, deduz do total salvo menos itens.
  const [calcValue, setCalcValue] = useState(() => {
    let prods = [];
    try { prods = JSON.parse(order.products || "[]"); } catch { prods = []; }
    let svcs = [];
    try { svcs = JSON.parse(order.services || "[]"); } catch { svcs = []; }
    const itemsSum = prods.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
      + svcs.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
    const saved = order.final_price || 0;
    const cv = saved - itemsSum;
    return cv > 0 ? cv : (itemsSum === 0 ? saved : 0);
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedOk, setSavedOk] = useState(false);
  const [showCatalogPicker, setShowCatalogPicker] = useState(false);

  const [clientSearch, setClientSearch] = useState(order.client_name || "");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [newClientForm, setNewClientForm] = useState(null);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  function toggleProduct(item, qty) {
    setSelProducts((prev) => {
      if (qty === 0) return prev.filter((x) => x.id !== item.id);
      const exists = prev.find((x) => x.id === item.id);
      if (exists) return prev.map((x) => (x.id === item.id ? { ...x, qty } : x));
      return [...prev, { id: item.id, name: item.name, price: item.price, qty }];
    });
  }

  function toggleService(item, qty) {
    setSelServices((prev) => {
      if (qty === 0) return prev.filter((x) => x.id !== item.id);
      const exists = prev.find((x) => x.id === item.id);
      if (exists) return prev.map((x) => (x.id === item.id ? { ...x, qty } : x));
      return [...prev, { id: item.id, name: item.name, price: item.price, qty }];
    });
  }

  const totalProducts = selProducts.reduce((s, i) => s + i.price * i.qty, 0);
  const totalServices = selServices.reduce((s, i) => s + i.price * i.qty, 0);
  // Total do pedido = valor calculado (da calculadora) + itens do catalogo
  const orderTotal = (calcValue || 0) + totalProducts + totalServices;
  const grandTotal = orderTotal; // mantido para compatibilidade

  async function handleSave(stayOnScreen) {
    if (form.status === "Entregue" && !form.paid) {
      setError("Marque o pagamento como recebido antes de definir como Entregue.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        order_date: form.order_date,
        delivery_date: form.delivery_date,
        final_price: orderTotal,
        products: JSON.stringify(selProducts),
        services: JSON.stringify(selServices),
      };
      await db.update("orders", order.id, payload);
      if (stayOnScreen) {
        setSavedOk(true);
        setTimeout(() => setSavedOk(false), 2000);
      } else {
        onSave();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleWhatsApp() {
    const client = clients.find((c) => c.name === form.client_name);
    if (!client || !client.whatsapp) {
      alert("Cliente sem WhatsApp cadastrado.");
      return;
    }
    const finalValue = orderTotal;
    const lines = [
      `Ola ${form.client_name}! Segue o resumo do seu pedido:`,
      "",
      `${form.product_name || form.description || "Pedido"}`,
    ];
    if (selProducts.length) {
      lines.push("", "Produtos:");
      selProducts.forEach((i) => lines.push(`- ${i.name} x${i.qty}: ${fmtBRL(i.price * i.qty)}`));
    }
    if (selServices.length) {
      lines.push("", "Servicos:");
      selServices.forEach((i) => lines.push(`- ${i.name} x${i.qty}: ${fmtBRL(i.price * i.qty)}`));
    }
    lines.push(
      "",
      `*Valor total: ${fmtBRL(finalValue)}*`,
      `Status: ${STATUS_EMOJI[form.status] || ""} ${form.status}`,
      `Pagamento: ${form.payment_method} ${form.paid ? "(recebido)" : "(a receber)"}`,
      "",
      "Qualquer duvida e so chamar! 🐱"
    );
    window.open(whatsappLink(client.whatsapp, lines.join("\n")), "_blank");
  }

  function statusWhatsApp() {
    const client = clients.find((c) => c.name === form.client_name);
    if (!client || !client.whatsapp) {
      alert("Cliente sem WhatsApp cadastrado.");
      return;
    }
    const msgs = {
      "Pedido Recebido": `Oi ${form.client_name}! Seu pedido foi recebido e esta na fila de producao. 📥`,
      "Em Producao": `Oi ${form.client_name}! Seu pedido entrou em producao agora. ⚙️`,
      Acabamento: `Oi ${form.client_name}! Seu pedido esta na fase de acabamento. ✨`,
      Finalizado: `Oi ${form.client_name}! Seu pedido esta pronto! Combinamos a entrega? ✅`,
      Entregue: `Oi ${form.client_name}! Pedido entregue com sucesso. Obrigada pela preferencia! 📦`,
    };
    window.open(whatsappLink(client.whatsapp, msgs[form.status] || "Oi! Novidades sobre seu pedido."), "_blank");
  }

  // Aviso de pedido confirmado: valor + prazo de entrega de uma vez
  function confirmOrderWhatsApp() {
    const client = clients.find((c) => c.name === form.client_name);
    if (!client || !client.whatsapp) {
      alert("Cliente sem WhatsApp cadastrado.");
      return;
    }
    const finalValue = orderTotal;
    const lines = [
      `Oi ${form.client_name}! Tudo certo, seu pedido foi cadastrado. 🐱`,
      "",
      `${form.product_name || form.description || "Pedido"}`,
      "",
      `Valor: ${fmtBRL(finalValue)}`,
      `Pagamento: ${form.payment_method}`,
    ];
    if (form.delivery_date) {
      lines.push(`Prazo de entrega: ${toBR(form.delivery_date)}`);
    } else {
      lines.push("Prazo de entrega: a combinar");
    }
    lines.push(
      "",
      "Assim que finalizar a producao eu te aviso! Qualquer duvida e so chamar. 💜"
    );
    window.open(whatsappLink(client.whatsapp, lines.join("\n")), "_blank");
  }

  return (
    <div
      style={{
        ...s.page,
        paddingBottom: "calc(130px + env(safe-area-inset-bottom))",
      }}
    >
      {/* Header */}
      <div style={s.header}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.textSoft, fontSize: 22, cursor: "pointer", marginRight: 8 }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>Pedido</h2>
        <button onClick={statusWhatsApp} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>📲</button>
      </div>

      <div style={{ ...s.content, paddingTop: 12, paddingBottom: 160 }}>
        {error && (
          <div style={{ background: "rgba(198,40,40,0.15)", border: "1px solid #C6282855", borderRadius: 8, padding: 10, marginBottom: 12, color: "#FF8A80", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* INFO (tela unica, sem abas) */}
        {true && (
          <div>
            {/* Client search */}
            <Field label="Cliente">
              <div style={{ position: "relative" }}>
                <input
                  style={s.input}
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setForm((f) => ({ ...f, client_name: e.target.value }));
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  placeholder="Nome do cliente"
                />
                {showClientDropdown && clientSearch && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "#1a0d40",
                      border: `1px solid ${C.cardBorder}`,
                      borderRadius: 8,
                      zIndex: 50,
                      maxHeight: 180,
                      overflowY: "auto",
                    }}
                  >
                    {filteredClients.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setClientSearch(c.name);
                          setForm((f) => ({ ...f, client_name: c.name }));
                          setShowClientDropdown(false);
                        }}
                        style={{ padding: "10px 12px", cursor: "pointer", borderBottom: `1px solid ${C.cardBorder}`, fontSize: 14 }}
                      >
                        {c.name}
                      </div>
                    ))}
                    {filteredClients.length === 0 && (
                      <div style={{ padding: 10 }}>
                        <p style={{ color: C.textSoft, fontSize: 13, margin: "0 0 8px" }}>Nao encontrado</p>
                        <button
                          style={{ ...s.btn, fontSize: 12, padding: "6px 12px" }}
                          onClick={() => {
                            setNewClientForm({ name: clientSearch, whatsapp: "", email: "" });
                            setShowClientDropdown(false);
                          }}
                        >
                          ➕ Cadastrar como novo cliente
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Field>

            {/* Inline new client form */}
            {newClientForm && (
              <div style={{ ...s.card, border: `1px solid ${C.purple}55`, marginBottom: 12 }}>
                <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 14 }}>➕ Novo Cliente</p>
                <Field label="Nome">
                  <input
                    style={s.input}
                    value={newClientForm.name}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </Field>
                <Field label="WhatsApp">
                  <input
                    style={s.input}
                    inputMode="numeric"
                    value={newClientForm.whatsapp}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, whatsapp: e.target.value.replace(/\D/g, "") }))}
                    placeholder="11999999999"
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    style={s.input}
                    type="email"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={{ ...s.btn, flex: 1, justifyContent: "center" }}
                    onClick={async () => {
                      try {
                        await db.insert("clients", newClientForm);
                        setClientSearch(newClientForm.name);
                        setForm((f) => ({ ...f, client_name: newClientForm.name }));
                        setNewClientForm(null);
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                  >
                    Salvar Cliente
                  </button>
                  <button style={s.btnGhost} onClick={() => setNewClientForm(null)}>Cancelar</button>
                </div>
              </div>
            )}

            <Field label="Descricao do Pedido">
              <input
                style={s.input}
                value={form.product_name}
                onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))}
                placeholder="Ex: Funko Pop Personalizado"
              />
            </Field>
            <Field label="Detalhes">
              <textarea
                style={{ ...s.input, minHeight: 70, resize: "vertical" }}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Detalhes adicionais..."
              />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Data do Pedido">
                <input
                  type="date"
                  style={s.dateInput}
                  value={form.order_date}
                  onChange={(e) => setForm((f) => ({ ...f, order_date: e.target.value }))}
                />
              </Field>
              <Field label="Prazo de Entrega">
                <input
                  type="date"
                  style={s.dateInput}
                  value={form.delivery_date}
                  onChange={(e) => setForm((f) => ({ ...f, delivery_date: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Status">
              <select
                style={{ ...s.input }}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {STATUS_LIST.map((st) => (
                  <option key={st} value={st}>{STATUS_EMOJI[st]} {st}</option>
                ))}
              </select>
            </Field>
            {/* Valor calculado (vem da calculadora, somente leitura) */}
            <div
              style={{
                background: "rgba(155,109,197,0.08)",
                border: "1px solid rgba(155,109,197,0.3)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Valor calculado (calculadora)
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700, fontFamily: DISPLAY, color: calcValue > 0 ? C.text : C.textSoft }}>
                {calcValue > 0 ? fmtBRL(calcValue) : "Nao vinculado"}
              </p>
              <p style={{ margin: "4px 2px 0", fontSize: 11, color: C.textSoft }}>
                Vem da calculadora quando voce vincula o pedido.
              </p>
            </div>

            {/* Adicionar item do catalogo (botao que abre busca e fecha ao escolher) */}
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => setShowCatalogPicker((v) => !v)}
                style={{
                  ...s.btnGhost,
                  width: "100%",
                  justifyContent: "space-between",
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 14px",
                }}
              >
                <span>+ Adicionar item do catalogo</span>
                <span style={{ color: "#69F0AE", fontWeight: 700 }}>
                  {totalProducts > 0 ? fmtBRL(totalProducts) : ""}
                </span>
              </button>
              {showCatalogPicker && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ margin: "0 0 10px", fontSize: 12, color: C.textSoft }}>
                    Escolha um item. A busca fecha ao adicionar.
                  </p>
                  <CatalogPicker
                    items={catalog}
                    selected={selProducts}
                    onToggle={(item, qty) => { toggleProduct(item, qty); setShowCatalogPicker(false); }}
                    type="produto"
                  />
                </div>
              )}
              {/* Itens ja adicionados (resumo) */}
              {selProducts.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {selProducts.map((p) => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: C.text, padding: "4px 2px" }}>
                      <span>{p.name} x{p.qty}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#69F0AE" }}>{fmtBRL(p.price * p.qty)}</span>
                        <button
                          onClick={() => toggleProduct(p, 0)}
                          style={{ background: "none", border: "none", color: "#FF8A80", cursor: "pointer", fontSize: 16, padding: "0 4px" }}
                          title="Remover"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Forma de pagamento */}
            <Field label="Forma de Pagamento">
              <select
                style={{ ...s.input }}
                value={form.payment_method}
                onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value }))}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>

            {/* Payment toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                ...s.card,
                marginBottom: 12,
                cursor: "pointer",
              }}
              onClick={() => setForm((f) => ({ ...f, paid: !f.paid }))}
            >
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>Pagamento</p>
                <p style={{ margin: 0, fontSize: 12, color: form.paid ? "#69F0AE" : "#FF8A80" }}>
                  {form.paid ? "✅ Recebido" : "💰 Aguardando"}
                </p>
              </div>
              <div
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  background: form.paid ? "#2E7D32" : C.dark,
                  border: `1px solid ${form.paid ? "#69F0AE" : C.cardBorder}`,
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    top: 3,
                    left: form.paid ? 24 : 3,
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </div>

            {/* Total do Pedido (calculado + itens, somente leitura) */}
            <div
              style={{
                background: "rgba(105,240,174,0.08)",
                border: "1px solid rgba(105,240,174,0.3)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 11, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Total do Pedido
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: C.textSoft }}>
                  Calculado {fmtBRL(calcValue)} + itens {fmtBRL(totalProducts)}
                </p>
              </div>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: DISPLAY, color: "#69F0AE" }}>
                {fmtBRL(orderTotal)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(20,10,48,0.98)",
          backdropFilter: "blur(12px)",
          borderTop: `1px solid ${C.cardBorder}`,
          padding: "10px 16px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
          zIndex: 300,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
          <span style={{ color: C.textSoft, fontSize: 12 }}>Valor do Pedido</span>
          <span style={{ fontWeight: 700, color: "#69F0AE" }}>
            {fmtBRL(orderTotal)}
          </span>
        </div>
        {savedOk && (
          <div style={{ textAlign: "center", marginBottom: 8, color: "#69F0AE", fontSize: 13, fontWeight: 600 }}>
            ✅ Alteracoes salvas!
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleWhatsApp} style={{ ...s.btn, background: "#1B5E20", flex: 1, justifyContent: "center" }}>
            🧾 Faturar
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            style={{ ...s.btn, flex: 1.4, justifyContent: "center" }}
          >
            💾 {saving ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={() => handleSave(false)} disabled={saving} style={{ ...s.btnGhost, padding: "10px 14px" }} title="Salvar e voltar">
            ✓ Sair
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS PAGE
// ============================================================
function OrdersPage({ clients, catalog, services: svcList, reloadOrders }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showNew, setShowNew] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const [newForm, setNewForm] = useState({
    client_name: "",
    product_name: "",
    description: "",
    order_date: new Date().toISOString().split("T")[0],
    delivery_date: "",
    notes: "",
  });
  const [clientSearch, setClientSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [inlineClient, setInlineClient] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await db.list("orders");
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Recarrega a lista local E avisa o dashboard/financeiro
  async function refreshAll() {
    await load();
    if (reloadOrders) reloadOrders();
  }

  const filtered = filterStatus === "Todos"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  async function createOrder() {
    // Cliente obrigatorio: precisa existir na lista de clientes cadastrados
    const clientName = (newForm.client_name || "").trim();
    if (!clientName) {
      alert("Selecione ou cadastre um cliente para criar o pedido.");
      return;
    }
    const exists = clients.find(
      (c) => c.name.toLowerCase() === clientName.toLowerCase()
    );
    if (!exists) {
      // abre o cadastro inline ja preenchido com o nome digitado
      setInlineClient({ name: clientName, whatsapp: "", email: "" });
      setShowDrop(false);
      alert("Cliente nao cadastrado. Cadastre o cliente para continuar.");
      return;
    }

    setSaving(true);
    try {
      const [res] = await db.insert("orders", {
        ...newForm,
        client_name: exists.name,
        order_date: newForm.order_date,
        delivery_date: newForm.delivery_date,
        status: "Pedido Recebido",
        paid: false,
        final_price: 0,
      });
      setShowNew(false);
      setNewForm({ client_name: "", product_name: "", description: "", order_date: new Date().toISOString().split("T")[0], delivery_date: "", notes: "" });
      setClientSearch("");
      await load();
      setEditOrder(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteOrder(id) {
    if (!confirm("Deletar este pedido?")) return;
    await db.delete("orders", id);
    refreshAll();
  }

  async function togglePaid(order) {
    await db.update("orders", order.id, { paid: !order.paid });
    refreshAll();
  }

  if (editOrder) {
    return (
      <OrderEdit
        order={editOrder}
        clients={clients}
        catalog={catalog}
        services={svcList}
        onSave={() => { setEditOrder(null); refreshAll(); }}
        onBack={() => setEditOrder(null)}
      />
    );
  }

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>📋 Pedidos</h2>
        <button style={s.btn} onClick={() => setShowNew(true)}>+ Novo</button>
      </div>

      <div style={s.content}>
        {/* Filter bar */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, paddingBottom: 4 }}>
          {["Todos", ...STATUS_LIST].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                background: filterStatus === st ? C.purple : C.dark,
                border: `1px solid ${filterStatus === st ? C.purple : C.cardBorder}`,
                color: C.text,
                borderRadius: 20,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: filterStatus === st ? 700 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {st === "Todos" ? "Todos" : `${STATUS_EMOJI[st]} ${st}`}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: C.textSoft, textAlign: "center" }}>Carregando...</p>}

        {/* New Order Modal */}
        {showNew && (
          <div style={{ ...s.card, marginBottom: 16, border: `1px solid ${C.purple}55` }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>Novo Pedido</h3>

            <Field label="Cliente">
              <div style={{ position: "relative" }}>
                <input
                  style={s.input}
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setNewForm((f) => ({ ...f, client_name: e.target.value }));
                    setShowDrop(true);
                  }}
                  onFocus={() => setShowDrop(true)}
                  placeholder="Nome do cliente"
                />
                {showDrop && clientSearch && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a0d40", border: `1px solid ${C.cardBorder}`, borderRadius: 8, zIndex: 50, maxHeight: 160, overflowY: "auto" }}>
                    {filteredClients.map((c) => (
                      <div key={c.id} onClick={() => { setClientSearch(c.name); setNewForm((f) => ({ ...f, client_name: c.name })); setShowDrop(false); }} style={{ padding: "10px 12px", cursor: "pointer", borderBottom: `1px solid ${C.cardBorder}`, fontSize: 14 }}>
                        {c.name}
                      </div>
                    ))}
                    {filteredClients.length === 0 && (
                      <div style={{ padding: 10 }}>
                        <p style={{ color: C.textSoft, fontSize: 13, margin: "0 0 8px" }}>Nao encontrado</p>
                        <button style={{ ...s.btn, fontSize: 12, padding: "6px 12px" }} onClick={() => { setInlineClient({ name: clientSearch, whatsapp: "", email: "" }); setShowDrop(false); }}>
                          ➕ Cadastrar como novo cliente
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Field>

            {inlineClient && (
              <div style={{ ...s.card, border: `1px solid ${C.purple}55`, marginBottom: 12 }}>
                <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 14 }}>➕ Novo Cliente</p>
                <Field label="Nome"><input style={s.input} value={inlineClient.name} onChange={(e) => setInlineClient((f) => ({ ...f, name: e.target.value }))} /></Field>
                <Field label="WhatsApp"><input style={s.input} inputMode="numeric" value={inlineClient.whatsapp} onChange={(e) => setInlineClient((f) => ({ ...f, whatsapp: e.target.value.replace(/\D/g, "") }))} placeholder="11999999999" /></Field>
                <Field label="E-mail"><input style={s.input} type="email" value={inlineClient.email} onChange={(e) => setInlineClient((f) => ({ ...f, email: e.target.value }))} /></Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...s.btn, flex: 1, justifyContent: "center" }} onClick={async () => { try { await db.insert("clients", inlineClient); setClientSearch(inlineClient.name); setNewForm((f) => ({ ...f, client_name: inlineClient.name })); setInlineClient(null); } catch (err) { alert(err.message); } }}>Salvar Cliente</button>
                  <button style={s.btnGhost} onClick={() => setInlineClient(null)}>Cancelar</button>
                </div>
              </div>
            )}

            <Field label="Descricao">
              <input style={s.input} value={newForm.product_name} onChange={(e) => setNewForm((f) => ({ ...f, product_name: e.target.value }))} placeholder="Ex: Funko Pop Personalizado" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Data do Pedido">
                <input type="date" style={s.dateInput} value={newForm.order_date} onChange={(e) => setNewForm((f) => ({ ...f, order_date: e.target.value }))} />
              </Field>
              <Field label="Prazo">
                <input type="date" style={s.dateInput} value={newForm.delivery_date} onChange={(e) => setNewForm((f) => ({ ...f, delivery_date: e.target.value }))} />
              </Field>
            </div>
            <Field label="Observacoes">
              <textarea style={{ ...s.input, minHeight: 60, resize: "vertical" }} value={newForm.notes} onChange={(e) => setNewForm((f) => ({ ...f, notes: e.target.value }))} />
            </Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.btn, flex: 1, justifyContent: "center" }} disabled={saving} onClick={createOrder}>
                {saving ? "Criando..." : "Criar Pedido"}
              </button>
              <button style={s.btnGhost} onClick={() => setShowNew(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {filtered.map((order) => (
          <div key={order.id} style={{ ...s.card, cursor: "pointer" }} onClick={() => setEditOrder(order)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15 }}>{order.client_name || "—"}</p>
                <p style={{ margin: 0, fontSize: 13, color: C.textSoft }}>{order.product_name || order.description || "—"}</p>
                {order.delivery_date && (
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: C.textSoft }}>
                    Prazo: {toBR(order.delivery_date)}
                  </p>
                )}
              </div>
              <span style={s.tag(STATUS_COLOR[order.status] || C.purple)}>
                {STATUS_EMOJI[order.status]} {order.status}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => togglePaid(order)}
                style={{
                  ...s.tag(order.paid ? "#2E7D32" : "#C62828"),
                  cursor: "pointer",
                  background: order.paid ? "rgba(46,125,50,0.15)" : "rgba(198,40,40,0.15)",
                }}
              >
                {order.paid ? "✅ Pago" : "💰 Em aberto"}
              </button>
              {order.final_price > 0 && (
                <span style={{ fontSize: 13, color: C.textSoft }}>{fmtBRL(order.final_price)}</span>
              )}
              <div style={{ flex: 1 }} />
              {(() => {
                const client = clients.find((c) => c.name === order.client_name);
                return client?.whatsapp ? (
                  <button
                    onClick={() => {
                      const msgs = {
                        "Pedido Recebido": `Oi ${order.client_name}! Seu pedido foi recebido. 📥`,
                        "Em Producao": `Oi ${order.client_name}! Seu pedido esta em producao. ⚙️`,
                        Acabamento: `Oi ${order.client_name}! Acabamento em andamento. ✨`,
                        Finalizado: `Oi ${order.client_name}! Pedido pronto! ✅`,
                        Entregue: `Oi ${order.client_name}! Pedido entregue. Obrigada! 📦`,
                      };
                      window.open(whatsappLink(client.whatsapp, msgs[order.status] || "Ola!"), "_blank");
                    }}
                    style={{ ...s.btnGhost, padding: "4px 10px", fontSize: 14 }}
                  >
                    💬
                  </button>
                ) : null;
              })()}
              <button
                onClick={() => deleteOrder(order.id)}
                style={{ ...s.btnDanger, padding: "4px 10px", fontSize: 13 }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ color: C.textSoft, fontSize: 15 }}>Nenhum pedido encontrado.</p>
            <button style={s.btn} onClick={() => setShowNew(true)}>+ Criar Pedido</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CLIENTS PAGE
// ============================================================
function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [sorted, setSorted] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await db.list("clients");
    setClients(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  let display = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.whatsapp || "").includes(search)
  );
  if (sorted) display = [...display].sort((a, b) => a.name.localeCompare(b.name));

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        await db.update("clients", editing.id, form);
      } else {
        await db.insert("clients", form);
      }
      setEditing(null);
      setShowNew(false);
      setForm({ name: "", whatsapp: "", email: "", notes: "" });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!confirm("Deletar este cliente?")) return;
    await db.delete("clients", id);
    load();
  }

  function openEdit(c) {
    setEditing(c);
    setForm({ name: c.name, whatsapp: c.whatsapp || "", email: c.email || "", notes: c.notes || "" });
    setShowNew(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: "", whatsapp: "", email: "", notes: "" });
    setShowNew(true);
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>👤 Clientes</h2>
        <button style={{ ...s.btnGhost, marginRight: 8, fontWeight: sorted ? 700 : 400 }} onClick={() => setSorted(!sorted)}>
          A→Z
        </button>
        <button style={s.btn} onClick={openNew}>+ Novo</button>
      </div>

      <div style={s.content}>
        <input
          style={{ ...s.input, marginBottom: 12 }}
          placeholder="Buscar por nome ou WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {showNew && (
          <div style={{ ...s.card, border: `1px solid ${C.purple}55`, marginBottom: 12 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>
              {editing ? "Editar Cliente" : "Novo Cliente"}
            </h3>
            <Field label="Nome *">
              <input style={s.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="WhatsApp (so numeros)">
              <input style={s.input} inputMode="numeric" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value.replace(/\D/g, "") }))} placeholder="11999999999" />
            </Field>
            <Field label="E-mail">
              <input style={s.input} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </Field>
            <Field label="Observacoes">
              <textarea style={{ ...s.input, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.btn, flex: 1, justifyContent: "center" }} disabled={saving} onClick={save}>
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button style={s.btnGhost} onClick={() => { setShowNew(false); setEditing(null); }}>Cancelar</button>
            </div>
          </div>
        )}

        {display.map((c) => (
          <div key={c.id} style={{ ...s.card, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => openEdit(c)}>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15 }}>{c.name}</p>
                {c.whatsapp && <p style={{ margin: 0, fontSize: 12, color: C.textSoft }}>📱 {c.whatsapp}</p>}
                {c.email && <p style={{ margin: 0, fontSize: 12, color: C.textSoft }}>✉️ {c.email}</p>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {c.whatsapp && (
                  <button
                    onClick={() => window.open(whatsappLink(c.whatsapp, `Oi ${c.name}!`), "_blank")}
                    style={{ ...s.btnGhost, padding: "6px 10px", fontSize: 16 }}
                  >
                    💬
                  </button>
                )}
                <button onClick={() => del(c.id)} style={{ ...s.btnDanger, padding: "6px 10px", fontSize: 14 }}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {display.length === 0 && !showNew && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ color: C.textSoft }}>Nenhum cliente ainda.</p>
            <button style={s.btn} onClick={openNew}>+ Cadastrar Cliente</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CATALOG PAGE
// ============================================================
function CatalogPage() {
  const [items, setItems] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, category: "Outro", in_stock: 0, weight: 0, image_url: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("cards"); // cards | gallery | list
  const [genPdf, setGenPdf] = useState(false);
  const [preview, setPreview] = useState(null); // item sendo exibido em tela cheia
  const [sortBy, setSortBy] = useState("none"); // none | az | price

  const load = useCallback(async () => {
    const data = await db.list("catalog");
    setItems(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Item sem estoque quando in_stock <= 0
  const isOut = (item) => (item.in_stock || 0) <= 0;

  // Lista ordenada conforme o botao escolhido
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "az") return (a.name || "").localeCompare(b.name || "", "pt", { sensitivity: "base" });
    if (sortBy === "price") return (a.price || 0) - (b.price || 0);
    if (sortBy === "category") {
      const cat = (a.category || "").localeCompare(b.category || "", "pt", { sensitivity: "base" });
      // dentro da mesma categoria, ordena por nome
      return cat !== 0 ? cat : (a.name || "").localeCompare(b.name || "", "pt", { sensitivity: "base" });
    }
    return 0;
  });

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        await db.update("catalog", editing.id, form);
      } else {
        await db.insert("catalog", form);
      }
      setEditing(null);
      setShowNew(false);
      setForm({ name: "", description: "", price: 0, category: "Outro", in_stock: 0, weight: 0, image_url: "" });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const resized = await resizeImage(file, 1000);
      const url = await uploadImage(resized);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      alert("Nao foi possivel enviar a imagem. " + err.message);
    } finally {
      setUploading(false);
      e.target.value = ""; // permite re-subir o mesmo arquivo
    }
  }

  // Carrega uma URL de imagem e devolve { dataUrl, w, h }
  function loadImageData(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.8), w: img.naturalWidth, h: img.naturalHeight });
        } catch (e) {
          resolve(null); // falha de CORS etc -> segue sem imagem
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  async function generatePortfolioPDF() {
    if (!items.length) {
      alert("Cadastre produtos no catalogo primeiro.");
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("Gerador de PDF ainda carregando, tente de novo em instantes.");
      return;
    }
    setGenPdf(true);
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 40;

      // Pre-carrega todas as imagens
      const imageMap = {};
      await Promise.all(
        items.map(async (i) => {
          if (i.image_url) {
            const data = await loadImageData(i.image_url);
            if (data) imageMap[i.id] = data;
          }
        })
      );

      // Cabecalho
      doc.setFillColor(30, 16, 64);
      doc.rect(0, 0, pageW, 90, "F");
      doc.setTextColor(201, 168, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("LayerLab", margin, 50);
      doc.setFontSize(12);
      doc.setTextColor(180, 160, 220);
      doc.setFont("helvetica", "normal");
      doc.text("Catalogo de Produtos", margin, 70);
      let y = 115;

      const cardH = 130; // altura de cada ficha de produto
      const imgSize = 110;

      sortedItems.forEach((i) => {
        // nova pagina se nao couber
        if (y + cardH > pageH - 50) { doc.addPage(); y = margin; }

        const out = (i.in_stock || 0) <= 0;

        // moldura da ficha
        doc.setDrawColor(220, 210, 240);
        doc.setFillColor(out ? 240 : 248, out ? 240 : 245, out ? 242 : 252);
        doc.roundedRect(margin, y, pageW - margin * 2, cardH, 8, 8, "FD");

        const pad = 12;
        const imgX = margin + pad;
        const imgY = y + (cardH - imgSize) / 2;

        // imagem (ou placeholder)
        const imgData = imageMap[i.id];
        if (imgData) {
          // mantem proporcao dentro de um quadrado imgSize
          let w = imgSize, h = imgSize;
          const ratio = imgData.w / imgData.h;
          if (ratio > 1) { h = imgSize / ratio; } else { w = imgSize * ratio; }
          const ox = imgX + (imgSize - w) / 2;
          const oy = imgY + (imgSize - h) / 2;
          doc.addImage(imgData.dataUrl, "JPEG", ox, oy, w, h);
        } else {
          doc.setFillColor(230, 225, 240);
          doc.roundedRect(imgX, imgY, imgSize, imgSize, 6, 6, "F");
          doc.setTextColor(180, 170, 200);
          doc.setFontSize(10);
          doc.text("sem foto", imgX + imgSize / 2, imgY + imgSize / 2, { align: "center" });
        }

        // textos a direita da imagem
        const tx = imgX + imgSize + 16;
        const tw = pageW - margin - pad - tx;
        let ty = y + 24;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(40, 30, 60);
        doc.text(i.name || "Produto", tx, ty);
        if (out) {
          const nameW = doc.getTextWidth(i.name || "Produto");
          doc.setFontSize(8);
          doc.setTextColor(200, 60, 50);
          doc.text("SEM ESTOQUE", tx + nameW + 10, ty);
        }
        ty += 16;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(123, 79, 166);
        doc.text(i.category || "", tx, ty);
        ty += 16;

        if (i.description) {
          doc.setTextColor(100, 90, 120);
          doc.setFontSize(10);
          const lines = doc.splitTextToSize(i.description, tw);
          // limita a 3 linhas pra caber na ficha
          lines.slice(0, 3).forEach((ln) => {
            doc.text(ln, tx, ty);
            ty += 13;
          });
          ty += 2;
        }

        // peso e preco na base
        const baseY = y + cardH - 16;
        if (i.weight > 0) {
          doc.setTextColor(110, 100, 130);
          doc.setFontSize(11);
          doc.text(`Peso: ${i.weight}g`, tx, baseY);
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(34, 139, 80);
        const priceStr = fmtBRL(i.price);
        doc.text(priceStr, pageW - margin - pad - doc.getTextWidth(priceStr), baseY);

        y += cardH + 12;
      });

      // rodape
      const total = doc.internal.getNumberOfPages();
      for (let p = 1; p <= total; p++) {
        doc.setPage(p);
        doc.setFontSize(9);
        doc.setTextColor(160, 150, 180);
        doc.text(`LayerLab - Catalogo - pagina ${p}/${total}`, margin, pageH - 20);
      }

      doc.save("catalogo-layerlab.pdf");
    } catch (err) {
      alert("Erro ao gerar PDF: " + err.message);
    } finally {
      setGenPdf(false);
    }
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "", price: item.price || 0, category: item.category || "Outro", in_stock: item.in_stock || 0, weight: item.weight || 0, image_url: item.image_url || "" });
    setShowNew(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: "", description: "", price: 0, category: "Outro", in_stock: 0, weight: 0, image_url: "" });
    setShowNew(true);
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>Catalogo</h2>
        <button style={{ ...s.btnGhost, marginRight: 8 }} disabled={genPdf} onClick={generatePortfolioPDF}>
          {genPdf ? "Gerando..." : "📄 PDF"}
        </button>
        <button style={s.btn} onClick={openNew}>+ Novo</button>
      </div>

      <div style={s.content}>
        {/* Seletor de modo de visualizacao */}
        {!showNew && items.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 14, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 4 }}>
            {[
              { id: "cards", label: "Cards" },
              { id: "gallery", label: "Imagens" },
              { id: "list", label: "Lista" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                style={{
                  flex: 1,
                  background: viewMode === m.id ? C.purple : "transparent",
                  color: viewMode === m.id ? C.text : C.textSoft,
                  border: "none",
                  borderRadius: 9,
                  padding: "8px 4px",
                  fontSize: 13,
                  fontWeight: viewMode === m.id ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* Botoes de ordenacao */}
        {!showNew && items.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.textSoft }}>Ordenar:</span>
            {[
              { id: "az", label: "A-Z" },
              { id: "price", label: "Valor" },
              { id: "category", label: "Categoria" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setSortBy((cur) => (cur === o.id ? "none" : o.id))}
                style={{
                  background: sortBy === o.id ? C.purple : "transparent",
                  color: sortBy === o.id ? C.text : C.textSoft,
                  border: `1px solid ${sortBy === o.id ? C.purple : C.cardBorder}`,
                  borderRadius: 20,
                  padding: "5px 14px",
                  fontSize: 12,
                  fontWeight: sortBy === o.id ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        {showNew && (
          <div style={{ ...s.card, border: `1px solid ${C.purple}55`, marginBottom: 12 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>{editing ? "Editar Produto" : "Novo Produto"}</h3>
            <Field label="Nome *"><input style={s.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Descricao"><textarea style={{ ...s.input, minHeight: 60, resize: "vertical" }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></Field>
            <MoneyField label="Preco" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
            <Field label="Categoria">
              <select style={s.input} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATALOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Estoque">
                <input style={s.input} inputMode="numeric" value={form.in_stock} onChange={(e) => setForm((f) => ({ ...f, in_stock: parseInt(e.target.value) || 0 }))} />
              </Field>
              <Field label="Peso (g)">
                <input style={s.input} inputMode="numeric" value={form.weight || ""} onChange={(e) => setForm((f) => ({ ...f, weight: parseFloat(e.target.value) || 0 }))} placeholder="0" />
              </Field>
            </div>

            {/* Upload de imagem */}
            <Field label="Foto do Produto">
              {form.image_url ? (
                <div style={{ position: "relative", marginBottom: 8 }}>
                  <img src={form.image_url} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }} />
                  <button
                    onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}
                  >
                    Trocar
                  </button>
                </div>
              ) : (
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    height: 110,
                    border: `1.5px dashed ${C.cardBorder}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    color: C.textSoft,
                    fontSize: 13,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {uploading ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 28 }}>📷</span>
                      <span>Tocar para enviar foto</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </Field>

            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.btn, flex: 1, justifyContent: "center" }} disabled={saving || uploading} onClick={save}>{saving ? "Salvando..." : "Salvar"}</button>
              <button style={s.btnGhost} onClick={() => { setShowNew(false); setEditing(null); }}>Cancelar</button>
            </div>
          </div>
        )}

        {/* CARDS (default, igual print) */}
        {!showNew && viewMode === "cards" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {sortedItems.map((item) => (
              <div key={item.id} style={{ ...s.card, padding: 0, overflow: "hidden", opacity: isOut(item) ? 0.85 : 1 }}>
                <div style={{ cursor: "pointer", position: "relative" }} onClick={() => setPreview(item)}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 120, objectFit: "cover", display: "block", filter: isOut(item) ? "grayscale(1)" : "none" }} onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div style={{ height: 120, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.textSoft, filter: isOut(item) ? "grayscale(1)" : "none" }}>📦</div>
                  )}
                  {isOut(item) && (
                    <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.04em" }}>SEM ESTOQUE</span>
                  )}
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ cursor: "pointer" }} onClick={() => setPreview(item)}>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: C.textSoft }}>{item.category}</p>
                    <p style={{ margin: "0 0 8px", fontSize: 14, color: "#69F0AE", fontWeight: 700 }}>{fmtBRL(item.price)}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
                    <button onClick={() => openEdit(item)} style={{ ...s.btnGhost, flex: 1, padding: "4px 0", fontSize: 12, textAlign: "center" }}>✏️</button>
                    <button onClick={async () => { if (!confirm("Deletar?")) return; await db.delete("catalog", item.id); load(); }} style={{ ...s.btnDanger, padding: "4px 8px", fontSize: 12 }}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GALLERY (so imagens) */}
        {!showNew && viewMode === "gallery" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {sortedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setPreview(item)}
                style={{ position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer", aspectRatio: "1", background: C.card, border: `1px solid ${C.cardBorder}` }}
              >
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: isOut(item) ? "grayscale(1)" : "none" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 30, color: C.textSoft, filter: isOut(item) ? "grayscale(1)" : "none" }}>📦</div>
                )}
                {isOut(item) && (
                  <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 5, letterSpacing: "0.04em" }}>SEM ESTOQUE</span>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "16px 8px 6px" }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#fff" }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#69F0AE", fontWeight: 700 }}>{fmtBRL(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIST (detalhes) */}
        {!showNew && viewMode === "list" && (
          <div>
            {sortedItems.map((item) => (
              <div key={item.id} style={{ ...s.card, padding: 12, display: "flex", gap: 12, alignItems: "center", opacity: isOut(item) ? 0.85 : 1 }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0, filter: isOut(item) ? "grayscale(1)" : "none" }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, filter: isOut(item) ? "grayscale(1)" : "none" }}>📦</div>
                )}
                <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => setPreview(item)}>
                  <p style={{ margin: "0 0 1px", fontWeight: 700, fontSize: 15 }}>
                    {item.name}
                    {isOut(item) && <span style={{ fontSize: 9, fontWeight: 700, color: "#FF8A80", border: "1px solid #FF8A8055", borderRadius: 5, padding: "1px 5px", marginLeft: 6, verticalAlign: "middle" }}>SEM ESTOQUE</span>}
                  </p>
                  <p style={{ margin: "0 0 1px", fontSize: 11, color: C.textSoft }}>{item.category}</p>
                  {item.description && <p style={{ margin: 0, fontSize: 12, color: C.textSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description}</p>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ margin: "0 0 6px", fontSize: 15, color: "#69F0AE", fontWeight: 700 }}>{fmtBRL(item.price)}</p>
                  <button onClick={async () => { if (!confirm("Deletar?")) return; await db.delete("catalog", item.id); load(); }} style={{ ...s.btnDanger, padding: "4px 8px", fontSize: 12 }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length === 0 && !showNew && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ color: C.textSoft }}>Catalogo vazio.</p>
            <button style={s.btn} onClick={openNew}>+ Adicionar Produto</button>
          </div>
        )}
      </div>

      {/* Modal de visualizacao em tela cheia */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,5,25,0.96)",
            backdropFilter: "blur(8px)",
            zIndex: 500,
            display: "flex",
            flexDirection: "column",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Botao fechar */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
            <button
              onClick={() => setPreview(null)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: `1px solid ${C.cardBorder}`,
                color: C.text,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Conteudo (clique nao fecha) */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            {preview.image_url ? (
              <div style={{ position: "relative", width: "100%", maxWidth: 420, marginBottom: 18 }}>
                <img
                  src={preview.image_url}
                  alt={preview.name}
                  style={{ width: "100%", borderRadius: 16, display: "block", filter: (preview.in_stock || 0) <= 0 ? "grayscale(1)" : "none" }}
                />
                {(preview.in_stock || 0) <= 0 && (
                  <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.78)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8, letterSpacing: "0.04em" }}>SEM ESTOQUE</span>
                )}
              </div>
            ) : (
              <div style={{ width: "100%", maxWidth: 420, height: 280, borderRadius: 16, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, marginBottom: 18 }}>📦</div>
            )}

            <div style={{ width: "100%", maxWidth: 420 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, fontFamily: DISPLAY }}>{preview.name}</h2>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: C.textSoft }}>{preview.category}</p>

              <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.06em" }}>Preco</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#69F0AE", fontFamily: DISPLAY }}>{fmtBRL(preview.price)}</p>
                </div>
                {preview.weight > 0 && (
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.06em" }}>Peso</p>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: DISPLAY }}>{preview.weight}g</p>
                  </div>
                )}
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.06em" }}>Estoque</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: DISPLAY, color: (preview.in_stock || 0) <= 0 ? "#FF8A80" : C.text }}>
                    {(preview.in_stock || 0) <= 0 ? "Esgotado" : preview.in_stock}
                  </p>
                </div>
              </div>

              {preview.description && (
                <p style={{ margin: "0 0 18px", fontSize: 15, color: C.text, lineHeight: 1.5 }}>{preview.description}</p>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => { const it = preview; setPreview(null); openEdit(it); }}
                  style={{ ...s.btn, flex: 1, justifyContent: "center" }}
                >
                  ✏️ Editar
                </button>
                <button onClick={() => setPreview(null)} style={s.btnGhost}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUPPLIES PAGE
// ============================================================
function SuppliesPage({ reloadSupplies }) {
  const [items, setItems] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("equipamento"); // equipamento | consumivel
  const [form, setForm] = useState({ name: "", category: "Outro", price: 0, quantity: 1, notes: "", kind: "equipamento" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await db.list("supplies");
    setItems(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Recarrega a lista local E avisa o dashboard/financeiro
  async function refreshAll() {
    await load();
    if (reloadSupplies) reloadSupplies();
  }

  // Itens da aba ativa (kind ausente = consumivel por padrao do banco)
  const tabItems = items.filter((i) => (i.kind || "consumivel") === activeTab);

  const totalEquip = items.filter((i) => (i.kind || "consumivel") === "equipamento").reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const totalConsum = items.filter((i) => (i.kind || "consumivel") === "consumivel").reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const totalGeral = totalEquip + totalConsum;

  const categories = activeTab === "equipamento" ? EQUIPMENT_CATEGORIES : CONSUMABLE_CATEGORIES;

  async function save() {
    if (!form.name.trim()) { alert("Digite o nome."); return; }
    setSaving(true);
    try {
      const payload = { ...form, kind: activeTab };
      if (editing) {
        await db.update("supplies", editing.id, payload);
      } else {
        await db.insert("supplies", payload);
      }
      setEditing(null);
      setShowNew(false);
      setForm({ name: "", category: "Outro", price: 0, quantity: 1, notes: "", kind: activeTab });
      refreshAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ name: item.name, category: item.category || "Outro", price: item.price || 0, quantity: item.quantity || 1, notes: item.notes || "", kind: item.kind || "consumivel" });
    setShowNew(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: "", category: categories[0] || "Outro", price: 0, quantity: 1, notes: "", kind: activeTab });
    setShowNew(true);
  }

  // Agrupa itens da aba por categoria
  const byCategory = {};
  tabItems.forEach((i) => {
    const cat = i.category || "Outro";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(i);
  });

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>Insumos</h2>
        <button style={s.btn} onClick={openNew}>+ Novo</button>
      </div>

      <div style={s.content}>
        {/* Total geral investido (soma tudo) */}
        <div style={{ ...s.card, background: "rgba(198,40,40,0.12)", border: "1px solid #C6282855", marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 12, color: C.textSoft }}>Total Investido</p>
          <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 700, fontFamily: DISPLAY, letterSpacing: "-0.5px", color: "#FF8A80" }}>{fmtBRL(totalGeral)}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
              <p style={{ margin: 0, fontSize: 10, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>Equipamentos</p>
              <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: C.text }}>{fmtBRL(totalEquip)}</p>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
              <p style={{ margin: 0, fontSize: 10, color: C.textSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>Consumiveis</p>
              <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: C.text }}>{fmtBRL(totalConsum)}</p>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 4 }}>
          {[
            { id: "equipamento", label: "Equipamentos" },
            { id: "consumivel", label: "Consumiveis" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setShowNew(false); setEditing(null); }}
              style={{
                flex: 1,
                background: activeTab === t.id ? C.purple : "transparent",
                color: activeTab === t.id ? C.text : C.textSoft,
                border: "none",
                borderRadius: 9,
                padding: "9px 4px",
                fontSize: 13,
                fontWeight: activeTab === t.id ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Resumo individual da aba ativa */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 2px" }}>
          <span style={{ fontSize: 12, color: C.textSoft }}>
            Subtotal {activeTab === "equipamento" ? "Equipamentos" : "Consumiveis"}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FF8A80", fontFamily: DISPLAY }}>
            {fmtBRL(activeTab === "equipamento" ? totalEquip : totalConsum)}
          </span>
        </div>

        {/* Explicacao da aba */}
        <p style={{ fontSize: 12, color: C.textSoft, margin: "0 0 12px 2px" }}>
          {activeTab === "equipamento"
            ? "O que dura: impressora, ferramentas, organizadores, pinceis."
            : "O que acaba na producao: filamento, tinta, canetinhas, embalagem."}
        </p>

        {showNew && (
          <div style={{ ...s.card, border: `1px solid ${C.purple}55`, marginBottom: 12 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>
              {editing ? "Editar" : "Novo"} {activeTab === "equipamento" ? "Equipamento" : "Consumivel"}
            </h3>
            <Field label="Nome *"><input style={s.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Categoria">
              <select style={s.input} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <MoneyField label="Preco Unitario" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
            <Field label="Quantidade">
              <input style={s.input} inputMode="decimal" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: parseFloat(e.target.value) || 1 }))} />
            </Field>
            <Field label="Observacoes">
              <textarea style={{ ...s.input, minHeight: 50, resize: "vertical" }} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.btn, flex: 1, justifyContent: "center" }} disabled={saving} onClick={save}>{saving ? "Salvando..." : "Salvar"}</button>
              <button style={s.btnGhost} onClick={() => { setShowNew(false); setEditing(null); }}>Cancelar</button>
            </div>
          </div>
        )}

        {Object.entries(byCategory).map(([cat, its]) => (
          <div key={cat}>
            <p style={{ color: C.textSoft, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "12px 0 6px" }}>{cat}</p>
            {its.map((item) => (
              <div key={item.id} style={{ ...s.card, padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => openEdit(item)}>
                  <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.textSoft }}>
                    {fmtBRL(item.price)} x {item.quantity} = {fmtBRL((item.price || 0) * (item.quantity || 1))}
                  </p>
                </div>
                <button onClick={async () => { if (!confirm("Deletar?")) return; await db.delete("supplies", item.id); refreshAll(); }} style={{ ...s.btnDanger, padding: "5px 10px" }}>🗑️</button>
              </div>
            ))}
          </div>
        ))}

        {tabItems.length === 0 && !showNew && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ color: C.textSoft }}>
              Nenhum {activeTab === "equipamento" ? "equipamento" : "consumivel"} cadastrado.
            </p>
            <button style={s.btn} onClick={openNew}>+ Adicionar</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SERVICES PAGE
// ============================================================
function ServicesPage() {
  const [items, setItems] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await db.list("services");
    setItems(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        await db.update("services", editing.id, form);
      } else {
        await db.insert("services", form);
      }
      setEditing(null);
      setShowNew(false);
      setForm({ name: "", description: "", price: 0 });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "", price: item.price || 0 });
    setShowNew(true);
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>🎨 Servicos</h2>
        <button style={s.btn} onClick={() => { setEditing(null); setForm({ name: "", description: "", price: 0 }); setShowNew(true); }}>+ Novo</button>
      </div>

      <div style={s.content}>
        {showNew && (
          <div style={{ ...s.card, border: `1px solid ${C.purple}55`, marginBottom: 12 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>{editing ? "Editar Servico" : "Novo Servico"}</h3>
            <Field label="Nome do Servico *"><input style={s.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ex: Lixamento, Pintura..." /></Field>
            <Field label="Descricao"><textarea style={{ ...s.input, minHeight: 60, resize: "vertical" }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></Field>
            <MoneyField label="Valor (R$)" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.btn, flex: 1, justifyContent: "center" }} disabled={saving} onClick={save}>{saving ? "Salvando..." : "Salvar"}</button>
              <button style={s.btnGhost} onClick={() => { setShowNew(false); setEditing(null); }}>Cancelar</button>
            </div>
          </div>
        )}

        {items.map((item) => (
          <div key={item.id} style={{ ...s.card, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => openEdit(item)}>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15 }}>{item.name}</p>
                {item.description && <p style={{ margin: "0 0 2px", fontSize: 13, color: C.textSoft }}>{item.description}</p>}
                <p style={{ margin: 0, fontSize: 14, color: "#69F0AE", fontWeight: 700 }}>{fmtBRL(item.price)}</p>
              </div>
              <button onClick={async () => { if (!confirm("Deletar?")) return; await db.delete("services", item.id); load(); }} style={{ ...s.btnDanger, padding: "6px 10px" }}>🗑️</button>
            </div>
          </div>
        ))}

        {items.length === 0 && !showNew && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ color: C.textSoft }}>Nenhum servico cadastrado.</p>
            <button style={s.btn} onClick={() => setShowNew(true)}>+ Adicionar Servico</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// FINANCE PAGE
// ============================================================
function FinancePage({ orders, supplies }) {
  const received = orders.filter((o) => o.paid).reduce((s, o) => s + (o.final_price || 0), 0);
  const pending = orders.filter((o) => !o.paid && o.final_price > 0).reduce((s, o) => s + (o.final_price || 0), 0);
  const invested = supplies.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const profit = received - invested;
  const salesProfit = orders.filter((o) => o.paid).reduce((s, o) => s + (o.profit || 0), 0);
  const margin = received > 0 ? ((profit / received) * 100).toFixed(1) : 0;

  const debtors = orders.filter((o) => !o.paid && o.final_price > 0);
  const payers = {};
  orders.filter((o) => o.paid).forEach((o) => {
    const n = o.client_name || "Desconhecido";
    payers[n] = (payers[n] || 0) + (o.final_price || 0);
  });
  const payerList = Object.entries(payers).sort((a, b) => b[1] - a[1]);

  function generateReport() {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Relatorio LayerLab</title>
<style>
body { font-family: 'Segoe UI', sans-serif; background: #1E1040; color: #EEE8FF; padding: 24px; }
h1 { color: #C9A8FF; } h2 { color: #9B6DC5; border-bottom: 1px solid #3D2066; padding-bottom: 6px; }
.card { background: rgba(255,255,255,0.04); border: 1px solid rgba(201,168,255,0.15); border-radius: 10px; padding: 16px; margin-bottom: 12px; }
.green { color: #69F0AE; } .red { color: #FF8A80; }
table { width: 100%; border-collapse: collapse; }
th { color: #C9A8FF; font-size: 12px; text-align: left; padding: 6px 0; }
td { padding: 6px 0; border-bottom: 1px solid rgba(201,168,255,0.1); font-size: 14px; }
</style>
</head>
<body>
<h1>LayerLab — Relatorio Financeiro</h1>
<p style="color:#9B6DC5">Gerado em ${new Date().toLocaleDateString("pt-BR")}</p>
<div class="card">
<h2>Resumo Geral</h2>
<table>
<tr><th>Receita Total Recebida</th><td class="green">${fmtBRL(received)}</td></tr>
<tr><th>Em Aberto</th><td>${fmtBRL(pending)}</td></tr>
<tr><th>Total Investido</th><td class="red">${fmtBRL(invested)}</td></tr>
<tr><th>Lucro Real</th><td class="${profit >= 0 ? "green" : "red"}">${fmtBRL(profit)}</td></tr>
<tr><th>Margem de Lucro</th><td>${margin}%</td></tr>
</table>
</div>
<div class="card">
<h2>Devedores</h2>
<table>
<tr><th>Cliente</th><th>Valor</th><th>Prazo</th></tr>
${debtors.map((o) => `<tr><td>${o.client_name || "—"}</td><td>${fmtBRL(o.final_price)}</td><td>${o.delivery_date ? toBR(o.delivery_date) : "—"}</td></tr>`).join("")}
</table>
</div>
<div class="card">
<h2>Clientes que Pagaram</h2>
<table>
<tr><th>#</th><th>Cliente</th><th>Total Pago</th></tr>
${payerList.map(([name, val], i) => `<tr><td>${i + 1}</td><td>${name}</td><td class="green">${fmtBRL(val)}</td></tr>`).join("")}
</table>
</div>
<div class="card">
<h2>Insumos / Investimentos</h2>
<table>
<tr><th>Insumo</th><th>Categoria</th><th>Total</th></tr>
${supplies.map((s) => `<tr><td>${s.name}</td><td>${s.category || "—"}</td><td>${fmtBRL((s.price || 0) * (s.quantity || 1))}</td></tr>`).join("")}
</table>
</div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>📊 Financeiro</h2>
        <button style={s.btn} onClick={generateReport}>📄 Relatorio</button>
      </div>

      <div style={s.content}>
        {/* Profit status card */}
        <div
          style={{
            ...s.card,
            background: profit >= 0 ? "rgba(46,125,50,0.15)" : "rgba(198,40,40,0.15)",
            border: `1px solid ${profit >= 0 ? "#2E7D32" : "#C62828"}55`,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: 12, color: C.textSoft }}>
            {profit >= 0 ? "🟢 No Lucro" : "🔴 No Prejuizo"}
          </p>
          <p style={{ margin: "0 0 4px", fontSize: 30, fontWeight: 700, fontFamily: DISPLAY, letterSpacing: "-1px", color: profit >= 0 ? "#69F0AE" : "#FF8A80" }}>
            {fmtBRL(profit)}
          </p>
          {profit < 0 && (
            <p style={{ margin: 0, fontSize: 13, color: "#FF8A80" }}>
              Faltam {fmtBRL(Math.abs(profit))} pra empatar
            </p>
          )}
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Total Recebido", val: received, color: "#69F0AE" },
            { label: "Em Aberto", val: pending, color: "#FFB74D" },
            { label: "Total Investido", val: invested, color: "#FF8A80" },
            { label: "Lucro das Vendas", val: salesProfit, color: "#69F0AE" },
            { label: "Margem de Lucro", val: `${margin}%`, color: C.lilac, raw: true },
          ].map((item) => (
            <div key={item.label} style={s.card}>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: C.textSoft }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: item.color }}>
                {item.raw ? item.val : fmtBRL(item.val)}
              </p>
            </div>
          ))}
        </div>

        {/* Debtors */}
        <h3 style={{ color: C.textSoft, fontSize: 13, margin: "0 0 8px", textTransform: "uppercase", fontWeight: 600 }}>
          Devedores
        </h3>
        {debtors.length === 0 && (
          <p style={{ color: "#69F0AE", fontSize: 14, marginBottom: 16 }}>Nenhum devedor! 🎉</p>
        )}
        {debtors.map((o) => {
          const du = daysUntil(o.delivery_date); // negativo = atrasado
          const days = du === null ? null : -du; // dias de atraso (positivo se atrasado)
          const overdue = days !== null && days > 0;
          return (
            <div
              key={o.id}
              style={{
                ...s.card,
                border: `1px solid ${overdue ? "#C62828" : "#2E7D32"}55`,
                padding: 12,
                marginBottom: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>{o.client_name || "—"}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.textSoft }}>
                    Prazo: {o.delivery_date ? toBR(o.delivery_date) : "—"}
                    {days !== null && (
                      <span style={{ color: overdue ? "#FF8A80" : "#69F0AE", marginLeft: 6 }}>
                        {overdue ? `${days}d atrasado` : "No prazo"}
                      </span>
                    )}
                  </p>
                </div>
                <p style={{ margin: 0, fontWeight: 700, color: "#FFB74D", fontSize: 15 }}>
                  {fmtBRL(o.final_price)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Top payers */}
        <h3 style={{ color: C.textSoft, fontSize: 13, margin: "16px 0 8px", textTransform: "uppercase", fontWeight: 600 }}>
          Clientes que Pagaram
        </h3>
        {payerList.map(([name, val], i) => (
          <div key={name} style={{ ...s.card, padding: 10, display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ color: C.textSoft, fontWeight: 700, minWidth: 20 }}>{i + 1}</span>
            <p style={{ flex: 1, margin: 0, fontWeight: 600, fontSize: 14 }}>{name}</p>
            <p style={{ margin: 0, color: "#69F0AE", fontWeight: 700 }}>{fmtBRL(val)}</p>
          </div>
        ))}
        {payerList.length === 0 && (
          <p style={{ color: C.textSoft, fontSize: 14 }}>Nenhum pagamento registrado ainda.</p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("home");
  const [orders, setOrders] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [clients, setClients] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Auto-login
  useEffect(() => {
    const email = localStorage.getItem("ll_email");
    const pass = localStorage.getItem("ll_pass");
    if (email && pass) {
      signIn(email, pass).then((s) => setSession(s)).catch(() => {});
    }
  }, []);

  // Load shared data when session changes
  useEffect(() => {
    if (!session) return;
    setLoadingData(true);
    Promise.all([
      db.list("orders"),
      db.list("supplies"),
      db.list("clients"),
      db.list("catalog"),
      db.list("services"),
    ])
      .then(([o, su, cl, ca, sv]) => {
        setOrders(o);
        setSupplies(su);
        setClients(cl);
        setCatalog(ca);
        setServices(sv);
      })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, [session]);

  async function reloadServices() {
    try {
      const sv = await db.list("services");
      setServices(sv);
    } catch (e) {
      console.error(e);
    }
  }

  async function reloadOrders() {
    try {
      const o = await db.list("orders");
      setOrders(o);
    } catch (e) {
      console.error(e);
    }
  }

  async function reloadSupplies() {
    try {
      const su = await db.list("supplies");
      setSupplies(su);
    } catch (e) {
      console.error(e);
    }
  }

  async function reloadClients() {
    try {
      const cl = await db.list("clients");
      setClients(cl);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleLogout() {
    if (!logoutConfirm) { setLogoutConfirm(true); return; }
    try {
      await signOut(session?.access_token);
    } catch {}
    localStorage.removeItem("ll_email");
    localStorage.removeItem("ll_pass");
    setSession(null);
    setLogoutConfirm(false);
  }

  if (!session) return <LoginPage onLogin={setSession} />;

  if (logoutConfirm) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ ...s.card, textAlign: "center", maxWidth: 320 }}>
          <p style={{ fontSize: 40, margin: "0 0 8px" }}>🚪</p>
          <h3 style={{ margin: "0 0 8px" }}>Sair do LayerLab?</h3>
          <p style={{ color: C.textSoft, fontSize: 14, margin: "0 0 20px" }}>Tem certeza que deseja sair?</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button style={s.btn} onClick={handleLogout}>Sim, sair</button>
            <button style={s.btnGhost} onClick={() => setLogoutConfirm(false)}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  function renderPage() {
    switch (page) {
      case "home":
        return <HomePage setPage={setPage} orders={orders} supplies={supplies} />;
      case "calc":
        return <CalcPage services={services} reloadServices={reloadServices} orders={orders} reloadOrders={reloadOrders} clients={clients} reloadClients={reloadClients} setPage={setPage} />;
      case "orders":
        return <OrdersPage clients={clients} catalog={catalog} services={services} reloadOrders={reloadOrders} />;
      case "clients":
        return <ClientsPage />;
      case "catalog":
        return <CatalogPage />;
      case "supplies":
        return <SuppliesPage reloadSupplies={reloadSupplies} />;
      case "services":
        return <ServicesPage />;
      case "finance":
        return <FinancePage orders={orders} supplies={supplies} />;
      default:
        return null;
    }
  }

  return (
    <div style={s.page}>
      {loadingData && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.lilac})`, zIndex: 999, animation: "none" }} />
      )}
      {renderPage()}
      <NavBar page={page} setPage={setPage} onLogout={handleLogout} />
    </div>
  );
}
