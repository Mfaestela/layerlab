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

const PAYMENT_METHODS = [
  "PIX",
  "Cartao de Credito",
  "Cartao de Debito",
  "Dinheiro",
  "Transferencia",
  "A Combinar",
];

const CATALOG_CATEGORIES = [
  "Decoracao",
  "Miniatura",
  "Funcional",
  "Personalizado",
  "Jogo & RPG",
  "Infantil",
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

// Fonte display moderna para titulos e numeros
const DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const BODY = "'Inter', 'Segoe UI', sans-serif";

const s = {
  page: {
    minHeight: "100dvh",
    background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bg2} 100%)`,
    color: C.text,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
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
  return (
    <img
      src="/logo.png"
      alt="LayerLab"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        display: "block",
        filter: "drop-shadow(0 0 12px rgba(155,109,197,0.5))",
      }}
    />
  );
}

// ============================================================
// NAV BAR
// ============================================================
const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Inicio" },
  { id: "calc", icon: "🧮", label: "Calc" },
  { id: "orders", icon: "📋", label: "Pedidos" },
  { id: "clients", icon: "👤", label: "Clientes" },
  { id: "catalog", icon: "🗂️", label: "Catalogo" },
  { id: "supplies", icon: "📦", label: "Insumos" },
  { id: "services", icon: "🎨", label: "Servicos" },
  { id: "finance", icon: "📊", label: "Financeiro" },
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
          <span style={{ fontSize: 18 }}>{item.icon}</span>
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
        <span style={{ fontSize: 18 }}>🚪</span>
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

  const statusCount = (st) => orders.filter((o) => o.status === st).length;
  const recent = orders.slice(0, 4);

  // Botoes de navegacao compactos (icone + label curto)
  const tiles = [
    { id: "calc", icon: "🧮", label: "Calcular" },
    { id: "orders", icon: "📋", label: "Pedidos" },
    { id: "clients", icon: "👤", label: "Clientes" },
    { id: "catalog", icon: "🗂️", label: "Catalogo" },
    { id: "supplies", icon: "📦", label: "Insumos" },
    { id: "services", icon: "🎨", label: "Servicos" },
    { id: "finance", icon: "📊", label: "Financas" },
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

      {/* Financial hero card */}
      <div
        style={{
          borderRadius: 18,
          padding: "18px 20px",
          marginBottom: 14,
          background: profit >= 0
            ? "linear-gradient(135deg, rgba(105,240,174,0.12), rgba(123,79,166,0.18))"
            : "linear-gradient(135deg, rgba(255,138,128,0.12), rgba(123,79,166,0.18))",
          border: `1px solid ${profit >= 0 ? "rgba(105,240,174,0.3)" : "rgba(255,138,128,0.3)"}`,
        }}
      >
        <p style={{ color: C.textSoft, fontSize: 11, margin: "0 0 2px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Lucro Real
        </p>
        <p
          style={{
            fontFamily: DISPLAY,
            fontSize: 34,
            fontWeight: 700,
            margin: "0 0 2px",
            color: profit >= 0 ? "#69F0AE" : "#FF8A80",
            letterSpacing: "-1px",
          }}
        >
          {fmtBRL(profit)}
        </p>
        {profit < 0 ? (
          <p style={{ color: "#FF8A80", fontSize: 12, margin: 0 }}>
            Faltam {fmtBRL(Math.abs(profit))} pra empatar
          </p>
        ) : (
          <p style={{ color: C.textSoft, fontSize: 12, margin: 0 }}>
            Receita {fmtBRL(received)}
          </p>
        )}
      </div>

      {/* Status pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {miniStatus.map((item) => (
          <button
            key={item.status}
            onClick={() => setPage("orders")}
            style={{
              flex: 1,
              background: C.card,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 14,
              padding: "12px 4px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, margin: 0, color: item.color }}>
              {statusCount(item.status)}
            </p>
            <p style={{ fontSize: 10, color: C.textSoft, margin: "2px 0 0" }}>{item.label}</p>
          </button>
        ))}
      </div>

      {/* Quick actions - icon grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 22,
        }}
      >
        {tiles.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              background: C.card,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 16,
              padding: "14px 4px 10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span style={{ fontSize: 10, color: C.textSoft, fontWeight: 500 }}>{item.label}</span>
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
function CalcPage() {
  const [form, setForm] = useState({
    filamentPrice: 0,
    grams: 0,
    hours: 0,
    energyPerHour: 0,
    wearPerHour: 0,
    laborHours: 0,
    laborRate: 0,
    extras: 0,
    margin: 30,
  });
  const [result, setResult] = useState(null);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function calc() {
    const filament = (form.filamentPrice / 1000) * form.grams;
    const energy = form.energyPerHour * form.hours;
    const wear = form.wearPerHour * form.hours;
    const labor = form.laborRate * form.laborHours;
    const extras = form.extras;
    const total = filament + energy + wear + labor + extras;
    const profit = total * (form.margin / 100);
    const price = total + profit;
    setResult({ filament, energy, wear, labor, extras, total, profit, price });
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

  return (
    <div style={s.content}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "16px 0 12px" }}>🧮 Calculadora</h2>

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
        <Field label="Horas de Impressao">
          <input
            style={s.input}
            inputMode="decimal"
            value={form.hours || ""}
            onChange={(e) => set("hours", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </Field>
        {numField("Energia por Hora (R$/h)", "energyPerHour", "0,00")}
        {numField("Desgaste da Maquina por Hora (R$/h)", "wearPerHour", "0,00")}
        <Field label="Horas de Mao de Obra">
          <input
            style={s.input}
            inputMode="decimal"
            value={form.laborHours || ""}
            onChange={(e) => set("laborHours", parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </Field>
        {numField("Valor por Hora da Mao de Obra (R$/h)", "laborRate", "0,00")}
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
            ["Mao de Obra", result.labor],
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
    order_date: toBR(order.order_date) || toBR(new Date().toISOString().split("T")[0]),
    delivery_date: toBR(order.delivery_date) || "",
    payment_method: order.payment_method || "PIX",
    status: order.status || "Pedido Recebido",
    paid: order.paid || false,
    notes: order.notes || "",
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

  const [tab, setTab] = useState("info");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
  const grandTotal = totalProducts + totalServices;

  async function handleSave() {
    if (form.status === "Entregue" && !form.paid) {
      setError("Marque o pagamento como recebido antes de definir como Entregue.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        order_date: toISO(form.order_date),
        delivery_date: toISO(form.delivery_date),
        final_price: grandTotal,
        products: JSON.stringify(selProducts),
        services: JSON.stringify(selServices),
      };
      await db.update("orders", order.id, payload);
      onSave();
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
    const lines = [
      `Ola ${form.client_name}! Segue seu resumo de pedido:`,
      "",
      `Descricao: ${form.description || form.product_name || "—"}`,
      "",
      "--- Produtos ---",
      ...selProducts.map((i) => `• ${i.name} x${i.qty}: ${fmtBRL(i.price * i.qty)}`),
      "",
      "--- Servicos ---",
      ...selServices.map((i) => `• ${i.name} x${i.qty}: ${fmtBRL(i.price * i.qty)}`),
      "",
      `*Total: ${fmtBRL(grandTotal)}*`,
      `Forma de pagamento: ${form.payment_method}`,
    ];
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
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>Ordem de Servico</h2>
        <button onClick={statusWhatsApp} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>📲</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.cardBorder}`, background: "rgba(20,10,48,0.5)" }}>
        {[
          { id: "info", label: "📋 Informacoes" },
          { id: "products", label: "🖨️ Produtos" },
          { id: "services", label: "🎨 Servicos" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              borderBottom: tab === t.id ? `2px solid ${C.lilac}` : "2px solid transparent",
              color: tab === t.id ? C.lilac : C.textSoft,
              padding: "12px 4px",
              fontSize: 12,
              fontWeight: tab === t.id ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ ...s.content, paddingTop: 12 }}>
        {error && (
          <div style={{ background: "rgba(198,40,40,0.15)", border: "1px solid #C6282855", borderRadius: 8, padding: 10, marginBottom: 12, color: "#FF8A80", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* INFO TAB */}
        {tab === "info" && (
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
                  style={s.input}
                  placeholder="dd/mm/aaaa"
                  value={form.order_date}
                  onChange={(e) => setForm((f) => ({ ...f, order_date: e.target.value }))}
                />
              </Field>
              <Field label="Prazo de Entrega">
                <input
                  style={s.input}
                  placeholder="dd/mm/aaaa"
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

            <Field label="Observacoes Internas">
              <textarea
                style={{ ...s.input, minHeight: 60, resize: "vertical" }}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Notas internas..."
              />
            </Field>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Subtotal Produtos</p>
              <p style={{ margin: 0, color: "#69F0AE", fontWeight: 700 }}>{fmtBRL(totalProducts)}</p>
            </div>
            <CatalogPicker
              items={catalog}
              selected={selProducts}
              onToggle={toggleProduct}
              type="produto"
            />
          </div>
        )}

        {/* SERVICES TAB */}
        {tab === "services" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Subtotal Servicos</p>
              <p style={{ margin: 0, color: "#69F0AE", fontWeight: 700 }}>{fmtBRL(totalServices)}</p>
            </div>
            <CatalogPicker
              items={services}
              selected={selServices}
              onToggle={toggleService}
              type="servico"
            />
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
          zIndex: 150,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: C.textSoft, fontSize: 12 }}>Total do Pedido</span>
          <span style={{ fontWeight: 700, color: "#69F0AE" }}>{fmtBRL(grandTotal)}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleWhatsApp} style={{ ...s.btn, background: "#1B5E20", flex: 1, justifyContent: "center" }}>
            🧾 Faturar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ ...s.btn, flex: 1, justifyContent: "center" }}
          >
            💾 {saving ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={onBack} style={{ ...s.btnGhost, padding: "10px 14px" }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS PAGE
// ============================================================
function OrdersPage({ clients, catalog, services: svcList }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showNew, setShowNew] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const [newForm, setNewForm] = useState({
    client_name: "",
    product_name: "",
    description: "",
    order_date: toBR(new Date().toISOString().split("T")[0]),
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

  const filtered = filterStatus === "Todos"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  async function createOrder() {
    setSaving(true);
    try {
      const [res] = await db.insert("orders", {
        ...newForm,
        order_date: toISO(newForm.order_date),
        delivery_date: toISO(newForm.delivery_date),
        status: "Pedido Recebido",
        paid: false,
        final_price: 0,
      });
      setShowNew(false);
      setNewForm({ client_name: "", product_name: "", description: "", order_date: toBR(new Date().toISOString().split("T")[0]), delivery_date: "", notes: "" });
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
    load();
  }

  async function togglePaid(order) {
    await db.update("orders", order.id, { paid: !order.paid });
    load();
  }

  if (editOrder) {
    return (
      <OrderEdit
        order={editOrder}
        clients={clients}
        catalog={catalog}
        services={svcList}
        onSave={() => { setEditOrder(null); load(); }}
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
                <input style={s.input} placeholder="dd/mm/aaaa" value={newForm.order_date} onChange={(e) => setNewForm((f) => ({ ...f, order_date: e.target.value }))} />
              </Field>
              <Field label="Prazo">
                <input style={s.input} placeholder="dd/mm/aaaa" value={newForm.delivery_date} onChange={(e) => setNewForm((f) => ({ ...f, delivery_date: e.target.value }))} />
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
                    Prazo: {order.delivery_date}
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
  const [form, setForm] = useState({ name: "", description: "", price: 0, category: "Outro", in_stock: 0, image_url: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await db.list("catalog");
    setItems(data);
  }, []);

  useEffect(() => { load(); }, [load]);

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
      setForm({ name: "", description: "", price: 0, category: "Outro", in_stock: 0, image_url: "" });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  function generatePortfolio() {
    const lines = ["🖨️ *Catalogo LayerLab*", ""];
    const byCategory = {};
    items.forEach((i) => {
      if (!byCategory[i.category]) byCategory[i.category] = [];
      byCategory[i.category].push(i);
    });
    Object.entries(byCategory).forEach(([cat, its]) => {
      lines.push(`*${cat}*`);
      its.forEach((i) => {
        lines.push(`• ${i.name} — ${fmtBRL(i.price)}`);
        if (i.description) lines.push(`  ${i.description}`);
      });
      lines.push("");
    });
    lines.push("Entre em contato para encomendar! 🐱");
    navigator.clipboard.writeText(lines.join("\n")).then(() => alert("Portfolio copiado!"));
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "", price: item.price || 0, category: item.category || "Outro", in_stock: item.in_stock || 0, image_url: item.image_url || "" });
    setShowNew(true);
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>🗂️ Catalogo</h2>
        <button style={{ ...s.btnGhost, marginRight: 8 }} onClick={generatePortfolio}>📄 Portfolio</button>
        <button style={s.btn} onClick={() => { setEditing(null); setForm({ name: "", description: "", price: 0, category: "Outro", in_stock: 0, image_url: "" }); setShowNew(true); }}>+ Novo</button>
      </div>

      <div style={s.content}>
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
            <Field label="Estoque">
              <input style={s.input} inputMode="numeric" value={form.in_stock} onChange={(e) => setForm((f) => ({ ...f, in_stock: parseInt(e.target.value) || 0 }))} />
            </Field>
            <Field label="URL da Imagem">
              <input style={s.input} type="url" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
            </Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.btn, flex: 1, justifyContent: "center" }} disabled={saving} onClick={save}>{saving ? "Salvando..." : "Salvar"}</button>
              <button style={s.btnGhost} onClick={() => { setShowNew(false); setEditing(null); }}>Cancelar</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {items.map((item) => (
            <div key={item.id} style={{ ...s.card, padding: 0, overflow: "hidden" }}>
              {item.image_url && (
                <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 120, objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
              )}
              <div style={{ padding: 10 }}>
                <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: C.textSoft }}>{item.category}</p>
                <p style={{ margin: "0 0 8px", fontSize: 14, color: "#69F0AE", fontWeight: 700 }}>{fmtBRL(item.price)}</p>
                <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
                  <button onClick={() => openEdit(item)} style={{ ...s.btnGhost, flex: 1, padding: "4px 0", fontSize: 12, textAlign: "center" }}>✏️</button>
                  <button onClick={async () => { if (!confirm("Deletar?")) return; await db.delete("catalog", item.id); load(); }} style={{ ...s.btnDanger, padding: "4px 8px", fontSize: 12 }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && !showNew && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ color: C.textSoft }}>Catalogo vazio.</p>
            <button style={s.btn} onClick={() => setShowNew(true)}>+ Adicionar Produto</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SUPPLIES PAGE
// ============================================================
function SuppliesPage() {
  const [items, setItems] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Outro", price: 0, quantity: 1, notes: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await db.list("supplies");
    setItems(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const total = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        await db.update("supplies", editing.id, form);
      } else {
        await db.insert("supplies", form);
      }
      setEditing(null);
      setShowNew(false);
      setForm({ name: "", category: "Outro", price: 0, quantity: 1, notes: "" });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ name: item.name, category: item.category || "Outro", price: item.price || 0, quantity: item.quantity || 1, notes: item.notes || "" });
    setShowNew(true);
  }

  const byCategory = {};
  items.forEach((i) => {
    const cat = i.category || "Outro";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(i);
  });

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1, fontFamily: DISPLAY }}>📦 Insumos</h2>
        <button style={s.btn} onClick={() => { setEditing(null); setForm({ name: "", category: "Outro", price: 0, quantity: 1, notes: "" }); setShowNew(true); }}>+ Novo</button>
      </div>

      <div style={s.content}>
        {/* Total invested banner */}
        <div style={{ ...s.card, background: "rgba(198,40,40,0.12)", border: "1px solid #C6282855", marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 12, color: C.textSoft }}>Total Investido</p>
          <p style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 700, fontFamily: DISPLAY, letterSpacing: "-0.5px", color: "#FF8A80" }}>{fmtBRL(total)}</p>
        </div>

        {showNew && (
          <div style={{ ...s.card, border: `1px solid ${C.purple}55`, marginBottom: 12 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>{editing ? "Editar Insumo" : "Novo Insumo"}</h3>
            <Field label="Nome *"><input style={s.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Categoria">
              <select style={s.input} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {SUPPLY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
                <button onClick={async () => { if (!confirm("Deletar?")) return; await db.delete("supplies", item.id); load(); }} style={{ ...s.btnDanger, padding: "5px 10px" }}>🗑️</button>
              </div>
            ))}
          </div>
        ))}

        {items.length === 0 && !showNew && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ color: C.textSoft }}>Nenhum insumo cadastrado.</p>
            <button style={s.btn} onClick={() => setShowNew(true)}>+ Adicionar Insumo</button>
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
${debtors.map((o) => `<tr><td>${o.client_name || "—"}</td><td>${fmtBRL(o.final_price)}</td><td>${o.delivery_date || "—"}</td></tr>`).join("")}
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
          const days = daysOverdue(o.delivery_date);
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
                    Prazo: {o.delivery_date || "—"}
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
        return <CalcPage />;
      case "orders":
        return <OrdersPage clients={clients} catalog={catalog} services={services} />;
      case "clients":
        return <ClientsPage />;
      case "catalog":
        return <CatalogPage />;
      case "supplies":
        return <SuppliesPage />;
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
