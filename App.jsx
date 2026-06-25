import { useState } from "react";

// ── PALETA ──────────────────────────────────────────────
const C = {
  primary: "#7B4FA6",
  primaryLight: "#9B6DC5",
  primaryDark: "#3D2066",
  lavender: "#F0EAFF",
  lavenderMid: "#DDD0F5",
  white: "#FFFFFF",
  text: "#1E1030",
  textMid: "#5A4A7A",
  textLight: "#8B7AAA",
  success: "#5CB85C",
  warning: "#F0A500",
  danger: "#D9534F",
  bg: "#FAF8FF",
};

// ── ÍCONES SVG ───────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    calc: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    clients: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    orders: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    catalog: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    box: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
    whatsapp: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  };
  return (
    <svg width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
};

// ── LOGO LAYERLAB ────────────────────────────────────────
const Logo = ({ small, dark }) => {
  const s = small ? 36 : 48;
  const purple = dark ? "#C9A8FF" : "#9B6DC5";
  const purpleDark = dark ? "#A07AE0" : "#7B4FA6";
  const textDark = dark ? "#EEE8FF" : C.primaryDark;
  const textPurple = dark ? "#C9A8FF" : C.primary;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Corpo do Erlenmeyer */}
        <path d="M32 10 L32 32 L14 62 Q12 66 16 67 L64 67 Q68 66 66 62 L48 32 L48 10 Z"
          fill="none" stroke={purple} strokeWidth="3" strokeLinejoin="round" />
        {/* Tampa do Erlenmeyer */}
        <rect x="28" y="6" width="24" height="6" rx="3" fill={purple} />
        {/* Bico da impressora descendo */}
        <line x1="40" y1="12" x2="40" y2="38" stroke={purpleDark} strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="40" r="3" fill={purpleDark} />
        {/* Camadas empilhadas — lado direito do frasco */}
        {[0,1,2,3,4].map(i => (
          <line key={i}
            x1={50 + i * 2} y1={18 + i * 7}
            x2={62 + i * 2} y2={18 + i * 7}
            stroke={purple} strokeWidth="2.5" strokeLinecap="round"
            opacity={1 - i * 0.15}
          />
        ))}
        {/* Faíscas */}
        <path d="M24 18 L26 14 L28 18 L24 18Z" fill={purple} opacity="0.7" />
        <path d="M18 28 L20 24 L22 28 L18 28Z" fill={purple} opacity="0.5" />
        {/* Gato dentro do frasco */}
        {/* Orelha esquerda */}
        <path d="M26 52 L23 45 L30 48 Z" fill={purple} />
        {/* Orelha direita */}
        <path d="M54 52 L57 45 L50 48 Z" fill={purple} />
        {/* Cabeça */}
        <ellipse cx="40" cy="56" rx="14" ry="10" fill="white" stroke={purple} strokeWidth="2" />
        {/* Olhos */}
        <circle cx="35" cy="54" r="2" fill={purpleDark} />
        <circle cx="45" cy="54" r="2" fill={purpleDark} />
        {/* Brilho nos olhos */}
        <circle cx="36" cy="53" r="0.7" fill="white" />
        <circle cx="46" cy="53" r="0.7" fill="white" />
        {/* Nariz */}
        <path d="M39 57 L40 58.5 L41 57 Z" fill={purple} />
        {/* Boca */}
        <path d="M37 59 Q40 61.5 43 59" stroke={purple} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Bigodes */}
        <line x1="26" y1="56" x2="33" y2="57" stroke={purple} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <line x1="26" y1="58" x2="33" y2="58" stroke={purple} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <line x1="47" y1="57" x2="54" y2="56" stroke={purple} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <line x1="47" y1="58" x2="54" y2="58" stroke={purple} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </svg>
      {!small && (
        <span style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
          <span style={{ color: textDark }}>Layer</span>
          <span style={{ color: textPurple }}>Lab</span>
          <span style={{ color: textPurple, fontSize: 13 }}>✦</span>
        </span>
      )}
    </div>
  );
};

// ── LAYERS DECORATIVAS ───────────────────────────────────
const LayerDivider = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2, margin: "8px 0" }}>
    {[100, 85, 70, 55].map((w, i) => (
      <div key={i} style={{ height: 2, width: `${w}%`, background: `rgba(123,79,166,${0.12 - i*0.02})`, borderRadius: 1 }} />
    ))}
  </div>
);

// ── BADGE STATUS ─────────────────────────────────────────
const statusConfig = {
  "Pedido Recebido":  { color: "#7B4FA6", bg: "#EDE4FF", emoji: "📥" },
  "Em Produção":      { color: "#F0A500", bg: "#FFF3CD", emoji: "⚙️" },
  "Acabamento":       { color: "#0077CC", bg: "#D0ECFF", emoji: "✨" },
  "Finalizado":       { color: "#5CB85C", bg: "#D4EDDA", emoji: "✅" },
  "Entregue":         { color: "#888",    bg: "#EEE",    emoji: "📦" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig["Pedido Recebido"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: cfg.bg, color: cfg.color,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600
    }}>
      {cfg.emoji} {status}
    </span>
  );
};

// ── MODAL ────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(30,16,48,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16
  }}>
    <div style={{
      background: C.white, borderRadius: 16, padding: 28, width: "100%", maxWidth: 480,
      maxHeight: "90vh", overflowY: "auto",
      boxShadow: "0 20px 60px rgba(123,79,166,0.25)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, color: C.primaryDark, fontSize: 18, fontWeight: 700 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textLight }}>
          <Icon name="close" size={22} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ── CAMPO DE INPUT ───────────────────────────────────────
const Field = ({ label, type = "text", value, onChange, placeholder, step, min, style: sx }) => (
  <div style={{ marginBottom: 14, ...sx }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label}
    </label>
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} step={step} min={min}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: 10,
        border: `1.5px solid ${C.lavenderMid}`, fontSize: 14, color: C.text,
        background: C.bg, outline: "none", boxSizing: "border-box",
        fontFamily: "inherit", transition: "border .2s"
      }}
      onFocus={e => e.target.style.borderColor = C.primary}
      onBlur={e => e.target.style.borderColor = C.lavenderMid}
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label}
    </label>
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: 10,
        border: `1.5px solid ${C.lavenderMid}`, fontSize: 14, color: C.text,
        background: C.bg, outline: "none", boxSizing: "border-box", fontFamily: "inherit"
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled }) => {
  const styles = {
    primary: { background: C.primary, color: "#fff", border: "none" },
    secondary: { background: C.lavender, color: C.primary, border: `1.5px solid ${C.lavenderMid}` },
    danger: { background: "#FFF0F0", color: C.danger, border: `1.5px solid #FFCDD2` },
    success: { background: "#E8F5E9", color: C.success, border: `1.5px solid #C8E6C9` },
    whatsapp: { background: "#25D366", color: "#fff", border: "none" },
  };
  const pads = { sm: "6px 12px", md: "10px 20px", lg: "13px 28px" };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant], padding: pads[size], borderRadius: 10, fontSize: 14,
      fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex",
      alignItems: "center", gap: 6, opacity: disabled ? 0.6 : 1,
      fontFamily: "inherit", transition: "opacity .2s, transform .1s"
    }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)" }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)" }}
    >
      {children}
    </button>
  );
};

// ════════════════════════════════════════════════════════
// SEÇÃO: DASHBOARD
// ════════════════════════════════════════════════════════
const Dashboard = ({ orders, clients, catalog, supplies, setPage }) => {
  const totalRevenue = orders.reduce((s, o) => s + (parseFloat(o.finalPrice) || 0), 0);
  const totalSupplies = (supplies||[]).reduce((s, i) => s + (parseFloat(i.price)||0) * (parseFloat(i.quantity)||1), 0);
  const grossProfit = orders.filter(o => o.status === "Finalizado" || o.status === "Entregue").reduce((s, o) => s + (parseFloat(o.finalPrice)||0), 0) * 0.4;
  const realProfit = grossProfit - totalSupplies;

  const aguardando = orders.filter(o => o.status === "Pedido Recebido").length;
  const emProducao = orders.filter(o => o.status === "Em Produção").length;
  const acabamento = orders.filter(o => o.status === "Acabamento").length;
  const finalizados = orders.filter(o => o.status === "Finalizado" || o.status === "Entregue").length;

  const navButtons = [
    { id: "calculator", label: "Calculadora", icon: "calc"    },
    { id: "orders",     label: "Pedidos",     icon: "orders"  },
    { id: "clients",    label: "Clientes",    icon: "clients" },
    { id: "catalog",    label: "Catálogo",    icon: "catalog" },
    { id: "supplies",   label: "Insumos",     icon: "box" },
  ];

  const glassCard = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(201,168,255,0.15)",
    borderRadius: 16,
    backdropFilter: "blur(12px)",
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "rgba(201,168,255,0.6)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Painel de Controle</div>
        <h2 style={{ color: "#EEE8FF", margin: 0, fontSize: 22, fontWeight: 800 }}>Olá! 👋</h2>
      </div>

      {/* BANNER FINANCEIRO */}
      <div style={{
        ...glassCard,
        background: "linear-gradient(135deg, rgba(123,79,166,0.5) 0%, rgba(61,32,102,0.6) 100%)",
        border: "1px solid rgba(201,168,255,0.25)",
        padding: "20px 22px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        position: "relative", overflow: "hidden"
      }}>
        {/* fundo decorativo */}
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(201,168,255,0.08)" }} />
        <div style={{ position: "absolute", right: 40, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(201,168,255,0.05)" }} />
        <div>
          <div style={{ fontSize: 11, color: "rgba(201,168,255,0.7)", fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Receita Total</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>R$ {totalRevenue.toFixed(2).replace(".", ",")}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{orders.length} pedido{orders.length !== 1 ? "s" : ""} registrado{orders.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(201,168,255,0.7)", fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase" }}>Lucro Real</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: realProfit >= 0 ? "#7FFFA8" : "#FF8A80", letterSpacing: -0.5 }}>
            {realProfit < 0 ? "-" : ""}R$ {Math.abs(realProfit).toFixed(2).replace(".", ",")}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
            {realProfit < 0 ? `Faltam R$ ${Math.abs(realProfit).toFixed(2).replace(".", ",")} pra empatar` : "No lucro! 🎉"}
          </div>
        </div>
      </div>
      {totalSupplies > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.15)", fontSize: 12, color: "rgba(255,255,255,0.6)", display: "flex", justifyContent: "space-between" }}>
          <span>📦 Investido em insumos</span>
          <span style={{ color: "#FF8A80", fontWeight: 600 }}>- R$ {totalSupplies.toFixed(2).replace(".", ",")}</span>
        </div>
      )}

      {/* PRODUÇÃO — mini pills */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Aguardando", value: aguardando, color: "#C9A8FF", dot: "#9B6DC5" },
          { label: "Produção",   value: emProducao, color: "#FFD166", dot: "#E0A800" },
          { label: "Acabamento", value: acabamento, color: "#6EC6FF", dot: "#0090E0" },
          { label: "Prontos",    value: finalizados, color: "#7FFFA8", dot: "#00C853" },
        ].map(s => (
          <div key={s.label} style={{
            ...glassCard, padding: "12px 10px", textAlign: "center"
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, margin: "0 auto 6px", boxShadow: `0 0 8px ${s.dot}` }} />
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "rgba(201,168,255,0.6)", fontWeight: 600, letterSpacing: 0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* BOTÕES DE NAVEGAÇÃO */}
      <div style={{ fontSize: 11, color: "rgba(201,168,255,0.5)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Acessar</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {navButtons.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            ...glassCard,
            color: "#fff", padding: "24px 16px 20px",
            cursor: "pointer", textAlign: "center",
            fontFamily: "inherit", transition: "transform .15s, box-shadow .15s, border-color .15s, background .15s",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            position: "relative", overflow: "hidden"
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.background = "rgba(123,79,166,0.22)";
              e.currentTarget.style.borderColor = "rgba(201,168,255,0.4)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(123,79,166,0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(201,168,255,0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{
              background: "linear-gradient(145deg, rgba(123,79,166,0.5), rgba(61,32,102,0.5))",
              border: "1px solid rgba(201,168,255,0.2)",
              borderRadius: 14, width: 56, height: 56,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={n.icon} size={26} color="#C9A8FF" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#EEE8FF", letterSpacing: 0.3 }}>{n.label}</span>
          </button>
        ))}
      </div>

      {/* ÚLTIMOS PEDIDOS */}
      <div style={{ fontSize: 11, color: "rgba(201,168,255,0.5)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Últimos Pedidos</div>
      {orders.length === 0 ? (
        <div style={{ ...glassCard, padding: "32px 20px", textAlign: "center", color: "rgba(201,168,255,0.5)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <p style={{ margin: 0, fontSize: 14 }}>Nenhum pedido ainda.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...orders].reverse().slice(0, 5).map(o => (
            <div key={o.id} style={{
              ...glassCard, padding: "13px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "#EEE8FF", fontSize: 14 }}>{o.productName}</div>
                <div style={{ fontSize: 11, color: "rgba(201,168,255,0.55)", marginTop: 2 }}>{o.clientName} · {o.orderDate}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════
// SEÇÃO: CALCULADORA
// ════════════════════════════════════════════════════════
const Calculator = () => {
  const [filamentPrice, setFilamentPrice] = useState("90");
  const [gramsUsed, setGramsUsed] = useState("50");
  const [printHours, setPrintHours] = useState("3");
  const [energyPerHour, setEnergyPerHour] = useState("0.50");
  const [machinePerHour, setMachinePerHour] = useState("1.50");
  const [laborHours, setLaborHours] = useState("1");
  const [laborRate, setLaborRate] = useState("25");
  const [margin, setMargin] = useState("50");
  const [extraCosts, setExtraCosts] = useState("0");
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const filamentCost = (parseFloat(filamentPrice || 0) / 1000) * parseFloat(gramsUsed || 0);
    const hours = parseFloat(printHours || 0);
    const energyCost = hours * parseFloat(energyPerHour || 0);
    const machineCost = hours * parseFloat(machinePerHour || 0);
    const laborCost = parseFloat(laborHours || 0) * parseFloat(laborRate || 0);
    const extras = parseFloat(extraCosts || 0);
    const totalCost = filamentCost + energyCost + machineCost + laborCost + extras;
    const finalPrice = totalCost * (1 + parseFloat(margin || 0) / 100);
    const profit = finalPrice - totalCost;
    setResult({ filamentCost, energyCost, machineCost, laborCost, extras, totalCost, finalPrice, profit });
    setCalculated(true);
  };

  const row = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
      <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{label}</span>
      <span style={{ color: "#fff", fontWeight: 600 }}>R$ {value.toFixed(2).replace(".", ",")}</span>
    </div>
  );

  return (
    <div>
      <h2 style={{ color: C.primaryDark, margin: "0 0 4px" }}>Calculadora de Precificação</h2>
      <p style={{ color: C.textMid, marginBottom: 24 }}>Calcule o preço ideal para cada peça.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.white, borderRadius: 14, padding: 22, boxShadow: "0 2px 12px rgba(123,79,166,0.08)" }}>
          <h4 style={{ color: C.primaryDark, margin: "0 0 16px", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>🧵 Filamento</h4>
          <Field label="Preço do Filamento (R$/kg)" type="number" value={filamentPrice} onChange={v => { setFilamentPrice(v); setCalculated(false); }} placeholder="90" />
          <Field label="Gramas Usadas (g)" type="number" value={gramsUsed} onChange={v => { setGramsUsed(v); setCalculated(false); }} placeholder="50" />
          <h4 style={{ color: C.primaryDark, margin: "16px 0 12px", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>⚡ Energia & Máquina</h4>
          <Field label="Horas de Impressão (h)" type="number" value={printHours} onChange={v => { setPrintHours(v); setCalculated(false); }} placeholder="3" step="0.5" />
          <Field label="Energia por Hora (R$/h)" type="number" value={energyPerHour} onChange={v => { setEnergyPerHour(v); setCalculated(false); }} placeholder="0.50" step="0.01" />
          <Field label="Desgaste Máq. por Hora (R$/h)" type="number" value={machinePerHour} onChange={v => { setMachinePerHour(v); setCalculated(false); }} placeholder="1.50" step="0.01" />
        </div>
        <div style={{ background: C.white, borderRadius: 14, padding: 22, boxShadow: "0 2px 12px rgba(123,79,166,0.08)" }}>
          <h4 style={{ color: C.primaryDark, margin: "0 0 16px", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>🖌️ Mão de Obra</h4>
          <Field label="Horas Trabalhadas (h)" type="number" value={laborHours} onChange={v => { setLaborHours(v); setCalculated(false); }} placeholder="1" step="0.5" />
          <Field label="Valor por Hora (R$/h)" type="number" value={laborRate} onChange={v => { setLaborRate(v); setCalculated(false); }} placeholder="25" />
          <h4 style={{ color: C.primaryDark, margin: "16px 0 12px", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>📦 Extras & Lucro</h4>
          <Field label="Custos Extras — tinta, lixa... (R$)" type="number" value={extraCosts} onChange={v => { setExtraCosts(v); setCalculated(false); }} placeholder="0" step="0.01" />
          <Field label="Margem de Lucro (%)" type="number" value={margin} onChange={v => { setMargin(v); setCalculated(false); }} placeholder="50" />
        </div>
      </div>

      <button onClick={calculate} style={{
        width: "100%", marginTop: 16, padding: "15px", borderRadius: 14, border: "none",
        background: calculated ? "linear-gradient(135deg, #2E7D32, #43A047)" : `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`,
        color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 4px 20px rgba(123,79,166,0.3)", transition: "background .3s"
      }}>
        {calculated ? "✅ Calculado!" : "🧮 Calcular Preço"}
      </button>

      {result && (
        <div style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`, borderRadius: 14, padding: 24, marginTop: 12, color: "#fff" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.9)" }}>📊 Resumo</h4>
          {row("🧵 Filamento", result.filamentCost)}
          {row(`⚡ Energia (${printHours}h × R$${energyPerHour}/h)`, result.energyCost)}
          {row(`⚙️ Desgaste (${printHours}h × R$${machinePerHour}/h)`, result.machineCost)}
          {row("🖌️ Mão de obra", result.laborCost)}
          {result.extras > 0 && row("📦 Extras", result.extras)}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1.5px solid rgba(255,255,255,0.3)", marginTop: 4 }}>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Custo Total</span>
            <span style={{ fontWeight: 700 }}>R$ {result.totalCost.toFixed(2).replace(".", ",")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1.5px solid rgba(255,255,255,0.3)" }}>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Lucro Estimado</span>
            <span style={{ color: "#B9FFB9", fontWeight: 700 }}>R$ {result.profit.toFixed(2).replace(".", ",")}</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 18px", marginTop: 12
          }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>💰 Preço Sugerido</span>
            <span style={{ fontSize: 26, fontWeight: 800 }}>R$ {result.finalPrice.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════
// SEÇÃO: CLIENTES
// ════════════════════════════════════════════════════════
const Clients = ({ clients, addClient, updateClient, deleteClient }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", whatsapp: "", email: "", notes: "" });
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const openNew = () => { setForm({ name: "", whatsapp: "", email: "", notes: "" }); setEditing(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ name: c.name||"", whatsapp: c.whatsapp||"", email: c.email||"", notes: c.notes||"" }); setEditing(c.id); setShowModal(true); };
  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editing) { await updateClient(editing, form); }
    else { await addClient(form); }
    setSaving(false); setShowModal(false);
  };
  const del = async (id) => { if (confirm("Remover cliente?")) await deleteClient(id); };
  const filtered = clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: C.primaryDark, margin: 0 }}>Clientes</h2>
          <p style={{ color: C.textMid, margin: "4px 0 0" }}>{clients.length} cadastrado{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={openNew}><Icon name="plus" size={16} color="#fff" /> Novo Cliente</Btn>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou telefone..."
        style={{
          width: "100%", padding: "10px 16px", borderRadius: 10, border: `1.5px solid ${C.lavenderMid}`,
          fontSize: 14, marginBottom: 16, background: C.white, boxSizing: "border-box", fontFamily: "inherit", outline: "none"
        }} />
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
          <p>{search ? "Nenhum cliente encontrado." : "Nenhum cliente ainda. Adicione seu primeiro!"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(c => (
            <div key={c.id} style={{
              background: C.white, borderRadius: 12, padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: "0 1px 6px rgba(123,79,166,0.07)"
            }}>
              <div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 16 }}>{c.name}</div>
                <div style={{ color: C.textLight, fontSize: 13, marginTop: 2 }}>
                  {c.whatsapp && <span>📱 {c.whatsapp}</span>}
                  {c.email && <span style={{ marginLeft: 12 }}>✉️ {c.email}</span>}
                </div>
                {c.notes && <div style={{ color: C.textMid, fontSize: 12, marginTop: 4 }}>📝 {c.notes}</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {c.whatsapp && (
                  <a href={`https://wa.me/55${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                    <Btn variant="whatsapp" size="sm"><Icon name="whatsapp" size={15} color="#fff" /></Btn>
                  </a>
                )}
                <Btn variant="secondary" size="sm" onClick={() => openEdit(c)}><Icon name="edit" size={15} /></Btn>
                <Btn variant="danger" size="sm" onClick={() => del(c.id)}><Icon name="trash" size={15} /></Btn>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? "Editar Cliente" : "Novo Cliente"} onClose={() => setShowModal(false)}>
          <Field label="Nome *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Nome do cliente" />
          <Field label="WhatsApp (só números)" value={form.whatsapp} onChange={v => setForm(f => ({ ...f, whatsapp: v }))} placeholder="11999999999" />
          <Field label="E-mail" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="email@exemplo.com" />
          <Field label="Observações" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Preferências, histórico..." />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save} disabled={!form.name.trim()}><Icon name="check" size={15} color="#fff" /> Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════
// SEÇÃO: PEDIDOS
// ════════════════════════════════════════════════════════
const Orders = ({ orders, addOrder, updateOrder, deleteOrder, updateOrderStatus, clients }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const statuses = Object.keys(statusConfig);
  const today = new Date().toISOString().split("T")[0];
  const emptyForm = { clientName: "", productName: "", description: "", orderDate: today, deliveryDate: "", paymentMethod: "PIX", finalPrice: "", status: "Pedido Recebido", notes: "" };
  const [form, setForm] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState("Todos");

  const openNew = () => { setForm(emptyForm); setEditing(null); setShowModal(true); };
  const openEdit = (o) => { setForm({ clientName: o.clientName||"", productName: o.productName||"", description: o.description||"", orderDate: o.orderDate||today, deliveryDate: o.deliveryDate||"", paymentMethod: o.paymentMethod||"PIX", finalPrice: o.finalPrice||"", status: o.status||"Pedido Recebido", notes: o.notes||"" }); setEditing(o.id); setShowModal(true); };
  const save = async () => {
    if (!form.productName.trim()) return;
    setSaving(true);
    if (editing) { await updateOrder(editing, form); }
    else { await addOrder(form); }
    setSaving(false); setShowModal(false);
  };
  const del = async (id) => { if (confirm("Remover pedido?")) await deleteOrder(id); };
  const updateStatus = async (id, status) => { await updateOrderStatus(id, status); };

  const sendWhatsApp = (order, client) => {
    const msgs = {
      "Pedido Recebido": `Olá ${order.clientName}! 😊 Recebemos seu pedido de *${order.productName}* na LayerLab! Em breve começamos a produção. Qualquer dúvida é só chamar! ✨`,
      "Em Produção": `Olá ${order.clientName}! Seu pedido de *${order.productName}* já está em produção! 🖨️ Assim que terminar avisamos. #LayerLab`,
      "Acabamento": `Olá ${order.clientName}! Seu pedido de *${order.productName}* está na fase de acabamento — lixamento, pintura e os detalhes finais! 🎨 Logo fica pronto!`,
      "Finalizado": `Olá ${order.clientName}! 🎉 Seu pedido de *${order.productName}* está finalizado e pronto pra entrega! Vamos combinar os detalhes? 📦`,
    };
    const msg = msgs[order.status] || `Olá ${order.clientName}! Atualização do seu pedido: *${order.status}*. Dúvidas? É só chamar!`;
    const phone = client?.whatsapp?.replace(/\D/g, "") || "";
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const filtered = orders.filter(o => filterStatus === "Todos" || o.status === filterStatus);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: C.primaryDark, margin: 0 }}>Pedidos</h2>
          <p style={{ color: C.textMid, margin: "4px 0 0" }}>{orders.length} pedido{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={openNew}><Icon name="plus" size={16} color="#fff" /> Novo Pedido</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {["Todos", ...statuses].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: filterStatus === s ? C.primary : C.lavender,
            color: filterStatus === s ? "#fff" : C.textMid,
            border: "none", fontFamily: "inherit"
          }}>{s}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
          <p>{filterStatus === "Todos" ? "Nenhum pedido ainda." : `Nenhum pedido com status "${filterStatus}".`}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...filtered].reverse().map(o => {
            const client = clients.find(c => c.name === o.clientName);
            return (
              <div key={o.id} style={{ background: C.white, borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 8px rgba(123,79,166,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{o.productName}</div>
                    <div style={{ color: C.textLight, fontSize: 13, marginTop: 2 }}>
                      👤 {o.clientName || "—"} · 📅 Pedido: {o.orderDate} {o.deliveryDate && `· ⏰ Entrega: ${o.deliveryDate}`}
                    </div>
                    {o.description && <div style={{ color: C.textMid, fontSize: 13, marginTop: 4 }}>{o.description}</div>}
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <StatusBadge status={o.status} />
                      {o.finalPrice > 0 && <span style={{ fontSize: 14, fontWeight: 700, color: C.success }}>R$ {parseFloat(o.finalPrice).toFixed(2).replace(".", ",")}</span>}
                      {o.paymentMethod && <span style={{ fontSize: 12, color: C.textLight }}>💳 {o.paymentMethod}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${C.lavenderMid}`, fontSize: 12, fontFamily: "inherit", background: C.bg, color: C.text, cursor: "pointer" }}>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Btn variant="whatsapp" size="sm" onClick={() => sendWhatsApp(o, client)}>
                      <Icon name="whatsapp" size={14} color="#fff" /> Notificar
                    </Btn>
                    <Btn variant="secondary" size="sm" onClick={() => openEdit(o)}><Icon name="edit" size={14} /></Btn>
                    <Btn variant="danger" size="sm" onClick={() => del(o.id)}><Icon name="trash" size={14} /></Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? "Editar Pedido" : "Novo Pedido"} onClose={() => setShowModal(false)}>
          <Field label="Produto / Peça *" value={form.productName} onChange={v => setForm(f => ({ ...f, productName: v }))} placeholder="Ex: Estatueta de dragão" />
          <Field label="Cliente" value={form.clientName} onChange={v => setForm(f => ({ ...f, clientName: v }))} placeholder="Nome do cliente" />
          <Field label="Descrição" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Detalhes do pedido, cor, tamanho..." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Data do Pedido" type="date" value={form.orderDate} onChange={v => setForm(f => ({ ...f, orderDate: v }))} />
            <Field label="Prazo de Entrega" type="date" value={form.deliveryDate} onChange={v => setForm(f => ({ ...f, deliveryDate: v }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Valor (R$)" type="number" value={form.finalPrice} onChange={v => setForm(f => ({ ...f, finalPrice: v }))} placeholder="0,00" step="0.01" />
            <Select label="Pagamento" value={form.paymentMethod} onChange={v => setForm(f => ({ ...f, paymentMethod: v }))} options={["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Transferência", "A Combinar"]} />
          </div>
          <Select label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} options={statuses} />
          <Field label="Observações" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Anotações internas..." />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save} disabled={!form.productName.trim() || saving}><Icon name="check" size={15} color="#fff" /> {saving ? "Salvando..." : "Salvar"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════
// SEÇÃO: CATÁLOGO
// ════════════════════════════════════════════════════════
const Catalog = ({ catalog, addCatalog, updateCatalog, deleteCatalog }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const emptyForm = { name: "", description: "", price: "", category: "Decoração", inStock: "1", imageUrl: "" };
  const [form, setForm] = useState(emptyForm);
  const [shareText, setShareText] = useState("");

  const openNew = () => { setForm(emptyForm); setEditing(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ name: p.name||"", description: p.description||"", price: p.price||"", category: p.category||"Decoração", inStock: p.inStock||"1", imageUrl: p.imageUrl||"" }); setEditing(p.id); setShowModal(true); };
  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editing) { await updateCatalog(editing, form); }
    else { await addCatalog(form); }
    setSaving(false); setShowModal(false);
  };
  const del = async (id) => { if (confirm("Remover item?")) await deleteCatalog(id); };

  const generatePortfolio = () => {
    const text = catalog.map(p => `✨ *${p.name}*\n${p.description}\nPreço: R$ ${parseFloat(p.price).toFixed(2).replace(".", ",")}\n`).join("\n");
    const msg = `🐱 *LayerLab* — Portfólio de Produtos\n\n${text}\nPedidos e informações pelo WhatsApp! 💜`;
    setShareText(msg);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: C.primaryDark, margin: 0 }}>Catálogo & Portfólio</h2>
          <p style={{ color: C.textMid, margin: "4px 0 0" }}>{catalog.length} produto{catalog.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {catalog.length > 0 && <Btn variant="secondary" onClick={generatePortfolio}>📤 Gerar Portfólio</Btn>}
          <Btn onClick={openNew}><Icon name="plus" size={16} color="#fff" /> Adicionar</Btn>
        </div>
      </div>
      {shareText && (
        <div style={{ background: C.lavender, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.primaryDark, marginBottom: 8 }}>📱 Portfólio gerado — copie e envie pelo WhatsApp:</div>
          <textarea readOnly value={shareText} rows={8}
            style={{ width: "100%", borderRadius: 8, border: "none", background: C.white, padding: 12, fontSize: 12, fontFamily: "monospace", boxSizing: "border-box", resize: "vertical" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Btn size="sm" onClick={() => { navigator.clipboard.writeText(shareText); }}>📋 Copiar</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setShareText("")}>Fechar</Btn>
          </div>
        </div>
      )}
      {catalog.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🛍️</div>
          <p>Nenhum produto ainda. Adicione peças prontas pro catálogo!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {catalog.map(p => (
            <div key={p.id} style={{ background: C.white, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(123,79,166,0.09)" }}>
              <div style={{ height: 140, background: `linear-gradient(135deg, ${C.lavender}, ${C.lavenderMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🖨️"}
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>📂 {p.category} · 📦 Estoque: {p.inStock}</div>
                {p.description && <div style={{ fontSize: 12, color: C.textMid, marginTop: 6 }}>{p.description}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>R$ {parseFloat(p.price).toFixed(2).replace(".", ",")}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="secondary" size="sm" onClick={() => openEdit(p)}><Icon name="edit" size={13} /></Btn>
                    <Btn variant="danger" size="sm" onClick={() => del(p.id)}><Icon name="trash" size={13} /></Btn>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <Modal title={editing ? "Editar Produto" : "Novo Produto"} onClose={() => setShowModal(false)}>
          <Field label="Nome do Produto *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Ex: Miniatura de dragão" />
          <Field label="Descrição" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Material, tamanho, cores disponíveis..." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Preço (R$)" type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} placeholder="0,00" step="0.01" />
            <Field label="Estoque" type="number" value={form.inStock} onChange={v => setForm(f => ({ ...f, inStock: v }))} min="0" />
          </div>
          <Select label="Categoria" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={["Decoração", "Miniatura", "Funcional", "Personalizado", "Jogo & RPG", "Infantil", "Outro"]} />
          <Field label="URL da Imagem (opcional)" value={form.imageUrl} onChange={v => setForm(f => ({ ...f, imageUrl: v }))} placeholder="https://..." />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save} disabled={!form.name.trim()}><Icon name="check" size={15} color="#fff" /> Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};


// ── SUPABASE ─────────────────────────────────────────────
const SUPA_URL = "https://jforxecmnsflbzvxdfsr.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmb3J4ZWNtbnNmbGJ6dnhkZnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjgxMDQsImV4cCI6MjA5NzkwNDEwNH0.2BjpATxVU_qQLYyLib3Akwt6JnkEFBNyxMgSJhG1SLs";

const supa = {
  h: { "Content-Type": "application/json", "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}` },
  ah(token) { return { ...this.h, "Authorization": `Bearer ${token}` }; },
  async signIn(email, password) {
    const r = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: this.h, body: JSON.stringify({ email, password })
    }); return r.json();
  },
  async getAll(table, token) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?order=created_at.desc`, { headers: this.ah(token) });
    return r.json();
  },
  async insert(table, data, token) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
      method: "POST", headers: { ...this.ah(token), "Prefer": "return=representation" },
      body: JSON.stringify(data)
    }); const j = await r.json(); return Array.isArray(j) ? j[0] : j;
  },
  async update(table, id, data, token) {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH", headers: { ...this.ah(token), "Prefer": "return=representation" },
      body: JSON.stringify(data)
    }); const j = await r.json(); return Array.isArray(j) ? j[0] : j;
  },
  async remove(table, id, token) {
    await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: this.ah(token) });
  }
};

// ── FUNDO DECORATIVO ─────────────────────────────────────
const AppBackground = () => (
  <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="g1" cx="20%" cy="20%" r="50%">
        <stop offset="0%" stopColor="#7B4FA6" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#7B4FA6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g2" cx="85%" cy="75%" r="45%">
        <stop offset="0%" stopColor="#9B6DC5" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#9B6DC5" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g3" cx="60%" cy="10%" r="35%">
        <stop offset="0%" stopColor="#C9A8FF" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#C9A8FF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g1)" />
    <rect width="1200" height="800" fill="url(#g2)" />
    <rect width="1200" height="800" fill="url(#g3)" />
    {/* Grid de camadas — linhas horizontais finas */}
    {Array.from({ length: 28 }).map((_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 30} x2="1200" y2={i * 30}
        stroke="#9B6DC5" strokeOpacity={0.04} strokeWidth="1" />
    ))}
    {/* Erlenmeyer decorativo grande — fundo direito */}
    <g transform="translate(950, 80)" opacity="0.06">
      <path d="M60 0 L60 140 L10 280 L180 280 L130 140 L130 0 Z" fill="none" stroke="#C9A8FF" strokeWidth="3" />
      <rect x="50" y="-18" width="80" height="22" rx="8" fill="#C9A8FF" />
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1={134} y1={20 + i*22} x2={170} y2={20 + i*22} stroke="#C9A8FF" strokeWidth="4" strokeLinecap="round" opacity={1-i*0.14} />
      ))}
    </g>
    {/* Erlenmeyer decorativo pequeno — fundo esquerdo */}
    <g transform="translate(60, 500)" opacity="0.05">
      <path d="M30 0 L30 70 L5 140 L90 140 L65 70 L65 0 Z" fill="none" stroke="#C9A8FF" strokeWidth="2" />
      <rect x="24" y="-10" width="42" height="12" rx="4" fill="#C9A8FF" />
      {[0,1,2,3].map(i => (
        <line key={i} x1={67} y1={10 + i*16} x2={88} y2={10 + i*16} stroke="#C9A8FF" strokeWidth="3" strokeLinecap="round" opacity={1-i*0.2} />
      ))}
    </g>
    {/* Pontos de faísca espalhados */}
    {[[120,80],[400,40],[800,160],[1100,300],[200,620],[700,700],[1050,600]].map(([x,y],i) => (
      <g key={i}>
        <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="#C9A8FF" strokeWidth="1.5" strokeOpacity="0.25" />
        <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="#C9A8FF" strokeWidth="1.5" strokeOpacity="0.25" />
      </g>
    ))}
    {/* Círculos flutuantes */}
    <circle cx="350" cy="650" r="80" fill="none" stroke="#9B6DC5" strokeOpacity="0.06" strokeWidth="1.5" />
    <circle cx="350" cy="650" r="50" fill="none" stroke="#9B6DC5" strokeOpacity="0.04" strokeWidth="1" />
    <circle cx="900" cy="200" r="120" fill="none" stroke="#9B6DC5" strokeOpacity="0.05" strokeWidth="1.5" />
  </svg>
);

// ── TELA DE LOGIN ─────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(() => localStorage.getItem("ll_remember") === "true");

  const tryLogin = async () => {
    if (!email || !pass) { setError("Preencha e-mail e senha."); return; }
    setLoading(true); setError("");
    try {
      const res = await supa.signIn(email, pass);
      if (res.access_token) {
        if (remember) {
          localStorage.setItem("ll_remember", "true");
          localStorage.setItem("ll_email", email);
          localStorage.setItem("ll_pass", pass);
        } else {
          localStorage.removeItem("ll_remember");
          localStorage.removeItem("ll_email");
          localStorage.removeItem("ll_pass");
        }
        onLogin(res.access_token, res.user);
      } else {
        setError("E-mail ou senha incorretos.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(145deg, #1E1040 0%, #2A1658 50%, #1A2040 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflow: "hidden", padding: 20
    }}>
      <AppBackground />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 380,
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,255,0.2)",
        borderRadius: 24, padding: "40px 36px", backdropFilter: "blur(20px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <Logo dark />
          <div style={{ fontSize: 12, color: "rgba(201,168,255,0.5)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>
            Gestão de Impressão 3D
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(201,168,255,0.7)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>E-mail</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
            placeholder="seu@email.com"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, boxSizing: "border-box", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,168,255,0.2)", color: "#EEE8FF", fontSize: 14, fontFamily: "inherit", outline: "none" }}
            onFocus={e => e.target.style.borderColor = "rgba(201,168,255,0.55)"}
            onBlur={e => e.target.style.borderColor = "rgba(201,168,255,0.2)"}
            onKeyDown={e => e.key === "Enter" && tryLogin()}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(201,168,255,0.7)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Senha</label>
          <div style={{ position: "relative" }}>
            <input value={pass} onChange={e => setPass(e.target.value)}
              type={showPass ? "text" : "password"} placeholder="sua senha"
              style={{ width: "100%", padding: "12px 44px 12px 16px", borderRadius: 12, boxSizing: "border-box", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,168,255,0.2)", color: "#EEE8FF", fontSize: 14, fontFamily: "inherit", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "rgba(201,168,255,0.55)"}
              onBlur={e => e.target.style.borderColor = "rgba(201,168,255,0.2)"}
              onKeyDown={e => e.key === "Enter" && tryLogin()}
            />
            <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(201,168,255,0.5)", fontSize: 16, padding: 0 }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* LEMBRAR SENHA */}
        <div onClick={() => setRemember(v => !v)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer" }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, border: "1.5px solid rgba(201,168,255,0.4)",
            background: remember ? "linear-gradient(135deg, #7B4FA6, #9B6DC5)" : "rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "all .2s"
          }}>
            {remember && <span style={{ color: "#fff", fontSize: 13, lineHeight: 1 }}>✓</span>}
          </div>
          <span style={{ fontSize: 13, color: "rgba(201,168,255,0.7)", fontWeight: 500 }}>Lembrar meus dados</span>
        </div>

        {error && (
          <div style={{ background: "rgba(217,83,79,0.15)", border: "1px solid rgba(217,83,79,0.35)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#FF9A97", fontSize: 13, textAlign: "center" }}>
            {error}
          </div>
        )}

        <button onClick={tryLogin} disabled={loading} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: loading ? "rgba(123,79,166,0.5)" : "linear-gradient(135deg, #7B4FA6, #9B6DC5)",
          color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", letterSpacing: 0.3, boxShadow: "0 4px 20px rgba(123,79,166,0.4)"
        }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(201,168,255,0.3)" }}>
          LayerLab ✦ Acesso Restrito
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// SEÇÃO: INSUMOS
// ════════════════════════════════════════════════════════
const CATEGORIES_INSUMOS = ["Impressora", "Filamento", "Tinta & Primer", "Ferramentas", "Embalagem", "Acabamento", "Equipamento", "Outro"];

const Supplies = ({ supplies, addSupply, deleteSupply }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Filamento", price: "", quantity: "1", notes: "" });
  const [saving, setSaving] = useState(false);

  const totalSpent = supplies.reduce((s, i) => s + (parseFloat(i.price) || 0) * (parseFloat(i.quantity) || 1), 0);

  const save = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    await addSupply(form);
    setSaving(false); setShowModal(false);
    setForm({ name: "", category: "Filamento", price: "", quantity: "1", notes: "" });
  };
  const del = async (id) => { if (confirm("Remover item?")) await deleteSupply(id); };

  const byCategory = CATEGORIES_INSUMOS.map(cat => ({
    cat, items: supplies.filter(s => s.category === cat)
  })).filter(g => g.items.length > 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <h2 style={{ color: C.primaryDark, margin: 0 }}>Insumos & Investimentos</h2>
          <p style={{ color: C.textMid, margin: "4px 0 0", fontSize: 13 }}>Tudo que você já gastou no negócio</p>
        </div>
        <Btn onClick={() => setShowModal(true)}><Icon name="plus" size={16} color="#fff" /> Adicionar</Btn>
      </div>

      {/* TOTAL GASTO */}
      <div style={{
        background: "linear-gradient(135deg, #C0392B, #E74C3C)",
        borderRadius: 14, padding: "18px 22px", marginBottom: 20, color: "#fff",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Total Investido</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 2 }}>R$ {totalSpent.toFixed(2).replace(".", ",")}</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{supplies.length} item{supplies.length !== 1 ? "s" : ""} cadastrado{supplies.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{ fontSize: 36 }}>📦</div>
      </div>

      {supplies.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🧾</div>
          <p>Nenhum insumo ainda. Cadastre tudo que você já comprou!</p>
        </div>
      ) : (
        byCategory.map(({ cat, items }) => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{cat}</div>
            {items.map(item => (
              <div key={item.id} style={{
                background: C.white, borderRadius: 12, padding: "12px 16px", marginBottom: 8,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 1px 6px rgba(123,79,166,0.07)"
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: C.text }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>
                    Qtd: {item.quantity} × R$ {parseFloat(item.price).toFixed(2).replace(".", ",")}
                    {item.notes && <span style={{ marginLeft: 8 }}>· {item.notes}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#C0392B", fontSize: 15 }}>
                    R$ {(parseFloat(item.price) * parseFloat(item.quantity || 1)).toFixed(2).replace(".", ",")}
                  </span>
                  <Btn variant="danger" size="sm" onClick={() => del(item.id)}><Icon name="trash" size={13} /></Btn>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {showModal && (
        <Modal title="Novo Insumo" onClose={() => setShowModal(false)}>
          <Field label="Nome do Item *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Ex: Rolo de PLA Branco 1kg" />
          <Select label="Categoria" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} options={CATEGORIES_INSUMOS} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Preço Unitário (R$) *" type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} placeholder="0,00" step="0.01" />
            <Field label="Quantidade" type="number" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: v }))} placeholder="1" min="1" />
          </div>
          <Field label="Observações" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Ex: Comprado na Amazon" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save} disabled={!form.name.trim() || !form.price || saving}>
              <Icon name="check" size={15} color="#fff" /> {saving ? "Salvando..." : "Salvar"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};


export default function App() {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [page, setPage] = useState("home");
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [autoLogging, setAutoLogging] = useState(true);

  // Auto-login se tiver dados salvos
  useState(() => {
    const doAutoLogin = async () => {
      const saved = localStorage.getItem("ll_remember") === "true";
      const savedEmail = localStorage.getItem("ll_email");
      const savedPass = localStorage.getItem("ll_pass");
      if (saved && savedEmail && savedPass) {
        try {
          const res = await supa.signIn(savedEmail, savedPass);
          if (res.access_token) {
            await handleLoginData(res.access_token, res.user);
            return;
          }
        } catch {}
      }
      setAutoLogging(false);
    };
    doAutoLogin();
  });

  const handleLoginData = async (accessToken, user) => {
    setToken(accessToken);
    setUserEmail(user?.email || "");
    setLoadingData(true);
    try {
      const [c, o, cat, sup] = await Promise.all([
        supa.getAll("clients", accessToken),
        supa.getAll("orders", accessToken),
        supa.getAll("catalog", accessToken),
        supa.getAll("supplies", accessToken),
      ]);
      setClients(Array.isArray(c) ? c : []);
      setOrders(Array.isArray(o) ? o.map(x => ({ ...x, finalPrice: x.final_price, clientName: x.client_name, productName: x.product_name, orderDate: x.order_date, deliveryDate: x.delivery_date, paymentMethod: x.payment_method })) : []);
      setCatalog(Array.isArray(cat) ? cat.map(x => ({ ...x, inStock: x.in_stock, imageUrl: x.image_url })) : []);
      setSupplies(Array.isArray(sup) ? sup : []);
    } catch {}
    setLoadingData(false);
    setAutoLogging(false);
  };

  // Wrappers que sincronizam com Supabase
  const addClient = async (data) => {
    const r = await supa.insert("clients", data, token);
    if (r?.id) setClients(cs => [r, ...cs]);
  };
  const updateClient = async (id, data) => {
    await supa.update("clients", id, data, token);
    setClients(cs => cs.map(c => c.id === id ? { ...c, ...data } : c));
  };
  const deleteClient = async (id) => {
    await supa.remove("clients", id, token);
    setClients(cs => cs.filter(c => c.id !== id));
  };

  const toDb = (o) => ({ client_name: o.clientName, product_name: o.productName, description: o.description, order_date: o.orderDate, delivery_date: o.deliveryDate, payment_method: o.paymentMethod, final_price: parseFloat(o.finalPrice) || 0, status: o.status, notes: o.notes });
  const fromDb = (o) => ({ ...o, clientName: o.client_name, productName: o.product_name, orderDate: o.order_date, deliveryDate: o.delivery_date, paymentMethod: o.payment_method, finalPrice: o.final_price });

  const addOrder = async (data) => {
    const r = await supa.insert("orders", toDb(data), token);
    if (r?.id) setOrders(os => [fromDb(r), ...os]);
  };
  const updateOrder = async (id, data) => {
    await supa.update("orders", id, toDb(data), token);
    setOrders(os => os.map(o => o.id === id ? { ...o, ...data } : o));
  };
  const deleteOrder = async (id) => {
    await supa.remove("orders", id, token);
    setOrders(os => os.filter(o => o.id !== id));
  };
  const updateOrderStatus = async (id, status) => {
    await supa.update("orders", id, { status }, token);
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  };

  const toCatDb = (p) => ({ name: p.name, description: p.description, price: parseFloat(p.price) || 0, category: p.category, in_stock: parseInt(p.inStock) || 0, image_url: p.imageUrl });
  const fromCatDb = (p) => ({ ...p, inStock: p.in_stock, imageUrl: p.image_url });

  const addCatalog = async (data) => {
    const r = await supa.insert("catalog", toCatDb(data), token);
    if (r?.id) setCatalog(cs => [fromCatDb(r), ...cs]);
  };
  const updateCatalog = async (id, data) => {
    await supa.update("catalog", id, toCatDb(data), token);
    setCatalog(cs => cs.map(c => c.id === id ? { ...c, ...data } : c));
  };
  const deleteCatalog = async (id) => {
    await supa.remove("catalog", id, token);
    setCatalog(cs => cs.filter(c => c.id !== id));
  };

  const addSupply = async (data) => {
    const r = await supa.insert("supplies", { name: data.name, category: data.category, price: parseFloat(data.price)||0, quantity: parseFloat(data.quantity)||1, notes: data.notes }, token);
    if (r?.id) setSupplies(ss => [r, ...ss]);
  };
  const deleteSupply = async (id) => {
    await supa.remove("supplies", id, token);
    setSupplies(ss => ss.filter(s => s.id !== id));
  };

  if (autoLogging) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #1E1040, #2A1658, #1A2040)", fontFamily: "inherit" }}>
      <AppBackground />
      <div style={{ zIndex: 1, textAlign: "center", color: "#C9A8FF" }}>
        <Logo dark />
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 16, opacity: 0.7 }}>Entrando...</div>
      </div>
    </div>
  );

  if (!token) return <LoginScreen onLogin={handleLoginData} />;

  if (loadingData) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #1E1040, #2A1658, #1A2040)", fontFamily: "inherit" }}>
      <AppBackground />
      <div style={{ zIndex: 1, textAlign: "center", color: "#C9A8FF" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🖨️</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Carregando seus dados...</div>
      </div>
    </div>
  );

  const nav = [
    { id: "home", label: "Início", icon: "home" },
    { id: "calculator", label: "Calculadora", icon: "calc" },
    { id: "orders", label: "Pedidos", icon: "orders" },
    { id: "clients", label: "Clientes", icon: "clients" },
    { id: "catalog", label: "Catálogo", icon: "catalog" },
    { id: "supplies", label: "Insumos", icon: "box" },
  ];

  const renderPage = () => {
    switch (page) {
      case "home": return <Dashboard orders={orders} clients={clients} catalog={catalog} supplies={supplies} setPage={setPage} />;
      case "calculator": return <Calculator />;
      case "orders": return <Orders orders={orders} addOrder={addOrder} updateOrder={updateOrder} deleteOrder={deleteOrder} updateOrderStatus={updateOrderStatus} clients={clients} />;
      case "clients": return <Clients clients={clients} addClient={addClient} updateClient={updateClient} deleteClient={deleteClient} />;
      case "catalog": return <Catalog catalog={catalog} addCatalog={addCatalog} updateCatalog={updateCatalog} deleteCatalog={deleteCatalog} />;
      case "supplies": return <Supplies supplies={supplies} addSupply={addSupply} deleteSupply={deleteSupply} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(145deg, #1E1040 0%, #2A1658 50%, #1A2040 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative" }}>
      <AppBackground />
      <aside style={{ width: 220, background: "rgba(20,10,48,0.75)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(201,168,255,0.12)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 10 }} className="sidebar-desktop">
        <div style={{ padding: "24px 20px 12px" }}><Logo dark /></div>
        <div style={{ height: 1, background: "rgba(201,168,255,0.1)", margin: "4px 16px 8px" }} />
        {userEmail && <div style={{ padding: "0 16px 12px", fontSize: 11, color: "rgba(201,168,255,0.4)", textAlign: "center", wordBreak: "break-all" }}>👤 {userEmail}</div>}
        <nav style={{ flex: 1, padding: "8px 12px" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", borderRadius: 10, marginBottom: 4, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, background: page === n.id ? "rgba(123,79,166,0.3)" : "transparent", color: page === n.id ? "#D4B8FF" : "rgba(201,168,255,0.55)", transition: "all .15s" }}>
              <Icon name={n.icon} size={18} color={page === n.id ? "#D4B8FF" : "rgba(201,168,255,0.45)"} />
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(201,168,255,0.08)" }}>
          <button onClick={() => { setToken(null); setOrders([]); setClients([]); setCatalog([]); }} style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(201,168,255,0.15)", background: "rgba(255,255,255,0.04)", color: "rgba(201,168,255,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            🚪 Sair
          </button>
        </div>
      </aside>

      <div style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: "rgba(20,10,48,0.98)", borderTop: "1px solid rgba(201,168,255,0.15)", backdropFilter: "blur(20px)", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingTop: 10, paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }} id="mobile-nav">
        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: page === n.id ? "#D4B8FF" : "rgba(201,168,255,0.35)", fontSize: 9, fontWeight: 600, padding: "2px 6px", flex: 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: page === n.id ? "rgba(123,79,166,0.35)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}>
              <Icon name={n.icon} size={20} color={page === n.id ? "#D4B8FF" : "rgba(201,168,255,0.35)"} />
            </div>
            {n.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, padding: "32px 32px 100px", maxWidth: 900, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "none", alignItems: "center", justifyContent: "center", marginBottom: 24 }} id="mobile-header">
          <Logo dark />
        </div>
        {renderPage()}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          #mobile-nav { display: flex !important; }
          #mobile-header { display: flex !important; }
        }
        input::placeholder { color: rgba(201,168,255,0.3); }
        * { box-sizing: border-box; }
        html, body { background: #1E1040; height: 100%; margin: 0; padding: 0; }
        #root { min-height: 100vh; min-height: -webkit-fill-available; }
        #mobile-nav { padding-bottom: max(10px, env(safe-area-inset-bottom)) !important; }
      `}</style>
    </div>
  );
}
