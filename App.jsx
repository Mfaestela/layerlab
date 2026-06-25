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
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
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
  "Pedido Recebido": { color: "#7B4FA6", bg: "#EDE4FF", emoji: "📥" },
  "Em Produção":     { color: "#F0A500", bg: "#FFF3CD", emoji: "⚙️" },
  "Acabamento":      { color: "#0077CC", bg: "#D0ECFF", emoji: "✨" },
  "Finalizado":      { color: "#5CB85C", bg: "#D4EDDA", emoji: "✅" },
  "Entregue":        { color: "#888",    bg: "#EEE",    emoji: "📦" },
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
  const paidOrders = orders.filter(o => o.paid);
  const totalRevenue = paidOrders.reduce((s, o) => s + (parseFloat(o.finalPrice) || 0), 0);
  const totalSupplies = (supplies||[]).reduce((s, i) => s + (parseFloat(i.price)||0) * (parseFloat(i.quantity)||1), 0);
  const realProfit = totalRevenue - totalSupplies;

  const aguardando = orders.filter(o => o.status === "Pedido Recebido").length;
  const emProducao = orders.filter(o => o.status === "Em Produção").length;
  const acabamento = orders.filter(o => o.status === "Acabamento").length;
  const finalizados = orders.filter(o => o.status === "Finalizado" || o.status === "Entregue").length;

  const navButtons = [
    { id: "calculator", label: "Calculadora", icon: "calc"    },
    { id: "orders",     label: "Pedidos",     icon: "orders"  },
    { id: "clients",    label: "Clientes",    icon: "clients" },
    { id: "catalog",    label: "Catálogo",    icon: "catalog" },
    { id: "supplies",   label: "Insumos",     icon: "box"     },
    { id: "financial",  label: "Financeiro",  icon: "chart"   },
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

// ── BUSCA DE CLIENTE ─────────────────────────────────────
const ClientSearch = ({ clients, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const filtered = clients.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));
  return (
    <div style={{ marginBottom: 14, position: "relative" }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Cliente</label>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder="Digite para buscar cliente..."
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.lavenderMid}`, fontSize: 14, color: C.text, background: C.bg, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
      />
      {open && value && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.white, borderRadius: 10, boxShadow: "0 4px 20px rgba(123,79,166,0.25)", border: `1.5px solid ${C.lavenderMid}`, zIndex: 999, maxHeight: 180, overflowY: "auto" }}>
          {filtered.map(c => (
            <div key={c.id}
              onMouseDown={() => { onChange(c.name); setOpen(false); }}
              style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.lavender}`, fontSize: 14, color: C.text }}
              onMouseEnter={e => e.currentTarget.style.background = C.lavender}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              {c.whatsapp && <div style={{ fontSize: 12, color: C.textLight }}>📱 {c.whatsapp}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════
// SEÇÃO: SERVIÇOS
// ════════════════════════════════════════════════════════
const ServicesCatalog = ({ services, addService, deleteService }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    await addService({ name: form.name, description: form.description, price: parseFloat(form.price) || 0 });
    setSaving(false);
    setShowModal(false);
    setForm({ name: "", description: "", price: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: C.primaryDark, margin: 0 }}>Serviços</h2>
          <p style={{ color: C.textMid, margin: "4px 0 0" }}>{services.length} serviço{services.length !== 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={() => setShowModal(true)}><Icon name="plus" size={16} color="#fff" /> Novo Serviço</Btn>
      </div>

      {services.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textLight }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎨</div>
          <p>Nenhum serviço ainda. Adicione lixamento, pintura, montagem...</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {services.map(s => (
            <div key={s.id} style={{ background: C.white, borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 6px rgba(123,79,166,0.07)" }}>
              <div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{s.name}</div>
                {s.description && <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{s.description}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 800, color: C.primary, fontSize: 16 }}>R$ {parseFloat(s.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                <button onClick={() => { if(confirm("Remover serviço?")) deleteService(s.id); }} style={{ padding: "5px 10px", borderRadius: 8, background: C.danger, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Novo Serviço" onClose={() => setShowModal(false)}>
          <Field label="Nome do Serviço *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Ex: Lixamento, Pintura, Montagem..." />
          <Field label="Descrição" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Detalhes do serviço..." />
          <Field label="Valor (R$) *" type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} placeholder="0,00" step="0.01" />
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

// ════════════════════════════════════════════════════════
// SEÇÃO: PEDIDOS
// ════════════════════════════════════════════════════════
const Orders = ({ orders, addOrder, updateOrder, deleteOrder, updateOrderStatus, clients, addClient, catalog, services }) => {

  const [view, setView] = useState("list"); // list | edit
  const [editingOrder, setEditingOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ name: "", whatsapp: "", email: "" });
  const [showNewModal, setShowNewModal] = useState(false);

  const statuses = ["Pedido Recebido", "Em Produção", "Acabamento", "Finalizado", "Entregue"];
  const today = new Date().toISOString().split("T")[0];
  const emptyOrder = { clientName: "", description: "", orderDate: today, deliveryDate: "", status: "Pedido Recebido", notes: "", finalPrice: 0, paymentMethod: "PIX", paid: false, products: [], services: [] };
  const [newForm, setNewForm] = useState({ clientName: "", description: "", orderDate: today, deliveryDate: "", notes: "" });

  const openNew = () => { setNewForm({ clientName: "", description: "", orderDate: today, deliveryDate: "", notes: "" }); setShowNewModal(true); setShowNewClient(false); };

  const saveNew = async () => {
    if (!newForm.clientName.trim()) return;
    setSaving(true);
    const order = { ...emptyOrder, ...newForm };
    await addOrder(order);
    setSaving(false);
    setShowNewModal(false);
    // Abre edição do pedido recém criado
    setTimeout(() => {
      const latest = orders[0]; // será atualizado pelo state
    }, 100);
  };

  const openEdit = (o) => {
    const products = (() => { try { return typeof o.products === "string" ? JSON.parse(o.products||"[]") : (o.products||[]); } catch { return []; }})();
    const services = (() => { try { return typeof o.services === "string" ? JSON.parse(o.services||"[]") : (o.services||[]); } catch { return []; }})();
    setEditingOrder({ ...o, products, services });
    setActiveTab("info");
    setView("edit");
  };

  const saveEdit = async () => {
    if (!editingOrder) return;
    setSaving(true);
    const total = [
      ...(editingOrder.products||[]),
      ...(editingOrder.services||[])
    ].reduce((s, i) => s + parseFloat(i.price||0) * (i.qty||1), 0);
    await updateOrder(editingOrder.id, {
      ...editingOrder,
      finalPrice: total,
      products: JSON.stringify(editingOrder.products||[]),
      services: JSON.stringify(editingOrder.services||[]),
    });
    setSaving(false);
  };

  const saveNewClient = async () => {
    if (!newClientForm.name.trim()) return;
    await addClient(newClientForm);
    setNewForm(f => ({ ...f, clientName: newClientForm.name }));
    setNewClientForm({ name: "", whatsapp: "", email: "" });
    setShowNewClient(false);
  };

  const del = async (id) => { if (confirm("Remover pedido?")) { await deleteOrder(id); } };

  const addItem = (type, item) => {
    setEditingOrder(o => {
      const arr = o[type] || [];
      const existing = arr.find(i => i.id === item.id);
      if (existing) return { ...o, [type]: arr.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) };
      return { ...o, [type]: [...arr, { ...item, qty: 1 }] };
    });
  };

  const removeItem = (type, itemId) => setEditingOrder(o => ({ ...o, [type]: (o[type]||[]).filter(i => i.id !== itemId) }));
  const changeQty = (type, itemId, delta) => setEditingOrder(o => ({ ...o, [type]: (o[type]||[]).map(i => i.id === itemId ? { ...i, qty: Math.max(1, i.qty + delta) } : i) }));

  const total = editingOrder ? [...(editingOrder.products||[]), ...(editingOrder.services||[])].reduce((s,i) => s + parseFloat(i.price||0)*(i.qty||1), 0) : 0;

  const sendWhatsApp = (order, client) => {
    const msgs = {
      "Pedido Recebido": `Olá ${order.clientName}! 😊 Recebemos seu pedido na LayerLab! Em breve começamos a produção. ✨`,
      "Em Produção": `Olá ${order.clientName}! Seu pedido está em produção! 🖨️`,
      "Acabamento": `Olá ${order.clientName}! Seu pedido está na fase de acabamento! 🎨`,
      "Finalizado": `Olá ${order.clientName}! 🎉 Seu pedido está pronto pra entrega! 📦`,
    };
    const msg = msgs[order.status] || `Olá ${order.clientName}! Status: *${order.status}*`;
    const phone = client?.whatsapp?.replace(/\D/g, "") || "";
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const filtered = orders.filter(o => filterStatus === "Todos" || o.status === filterStatus);

  const CatalogPicker = ({ type }) => {
    const isProduct = type === "products";
    const sourceItems = isProduct ? catalog : services;
    return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
        {isProduct ? "Adicionar Produto do Catálogo" : "Adicionar Serviço"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
        {sourceItems.length === 0 ? (
          <p style={{ color: C.textLight, fontSize: 13 }}>{isProduct ? "Nenhum produto no catálogo." : "Nenhum serviço cadastrado."}</p>
        ) : sourceItems.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 10, background: C.lavender, border: `1px solid ${C.lavenderMid}` }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{item.name}</div>
              <div style={{ fontSize: 12, color: C.textLight }}>R$ {parseFloat(item.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
            </div>
            <button onClick={() => addItem(type, item)} style={{ padding: "5px 14px", borderRadius: 8, border: "none", background: C.primary, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Add</button>
          </div>
        ))}
      </div>

      {(editingOrder?.[type]||[]).length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Itens adicionados</div>
          {(editingOrder[type]||[]).map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", marginBottom: 6, borderRadius: 10, background: C.white, border: `1px solid ${C.lavenderMid}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <button onClick={() => changeQty(type, item.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: C.lavenderMid, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>-</button>
                  <span style={{ fontWeight: 700 }}>{item.qty}</span>
                  <button onClick={() => changeQty(type, item.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: C.lavenderMid, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>+</button>
                  <span style={{ fontSize: 12, color: C.textLight }}>× R$ {parseFloat(item.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: C.primary }}>R$ {(parseFloat(item.price) * item.qty).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <button onClick={() => removeItem(type, item.id)} style={{ fontSize: 11, color: C.danger, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2 }}>remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );};

  // ── TELA DE EDIÇÃO ──
  if (view === "edit" && editingOrder) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 140px)" }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "rgba(201,168,255,0.5)", marginBottom: 2 }}>Pedido</div>
          <h2 style={{ color: "#EEE8FF", margin: 0, fontSize: 18 }}>{editingOrder.clientName}</h2>
          <div style={{ marginTop: 6 }}><StatusBadge status={editingOrder.status} /></div>
        </div>

        {/* Abas */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "2px solid rgba(201,168,255,0.15)" }}>
          {[
            { id: "info", label: "📋 Informações" },
            { id: "products", label: "🖨️ Produtos" },
            { id: "services", label: "🎨 Serviços" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "8px 14px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              background: activeTab === tab.id ? "rgba(123,79,166,0.4)" : "transparent",
              color: activeTab === tab.id ? "#D4B8FF" : "rgba(201,168,255,0.4)",
              borderBottom: activeTab === tab.id ? "2px solid #9B6DC5" : "none",
              marginBottom: -2
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Conteúdo da aba */}
        <div style={{ flex: 1, marginBottom: 80 }}>
          {activeTab === "info" && (
            <div>
              <ClientSearch clients={clients} value={editingOrder.clientName} onChange={v => setEditingOrder(o => ({ ...o, clientName: v }))} />
              <Field label="Descrição" value={editingOrder.description||""} onChange={v => setEditingOrder(o => ({ ...o, description: v }))} placeholder="Detalhes, referências, cores..." />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Data do Pedido" type="date" value={editingOrder.orderDate||""} onChange={v => setEditingOrder(o => ({ ...o, orderDate: v }))} />
                <Field label="Prazo de Entrega" type="date" value={editingOrder.deliveryDate||""} onChange={v => setEditingOrder(o => ({ ...o, deliveryDate: v }))} />
              </div>
              <Select label="Status" value={editingOrder.status} onChange={v => {
                if (v === "Entregue" && !editingOrder.paid) { alert("⚠️ Pagamento em aberto! Confirme antes de entregar."); return; }
                setEditingOrder(o => ({ ...o, status: v }));
              }} options={statuses} />
              <Select label="Forma de Pagamento" value={editingOrder.paymentMethod||"PIX"} onChange={v => setEditingOrder(o => ({ ...o, paymentMethod: v }))} options={["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Transferência", "A Combinar"]} />
              <div onClick={() => setEditingOrder(o => ({ ...o, paid: !o.paid }))} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer", padding: "10px 14px", borderRadius: 10, background: editingOrder.paid ? "#D4EDDA" : "#FFF9E6", border: `1.5px solid ${editingOrder.paid ? "#C8E6C9" : "#FFE082"}` }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: editingOrder.paid ? "#2E7D32" : "transparent", border: `2px solid ${editingOrder.paid ? "#2E7D32" : "#B07800"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {editingOrder.paid && <span style={{ color: "#fff", fontSize: 13 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: editingOrder.paid ? "#2E7D32" : "#B07800" }}>{editingOrder.paid ? "💰 Pagamento recebido" : "⏳ Aguardando pagamento"}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>Marque quando o cliente pagar</div>
                </div>
              </div>
              <Field label="Observações" value={editingOrder.notes||""} onChange={v => setEditingOrder(o => ({ ...o, notes: v }))} placeholder="Anotações internas..." />
            </div>
          )}
          {activeTab === "products" && <CatalogPicker type="products" />}
          {activeTab === "services" && <CatalogPicker type="services" />}
        </div>

        {/* Botões fixos na base */}
        <div style={{ position: "fixed", bottom: 60, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 10, padding: "12px 20px", background: "rgba(20,10,48,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(201,168,255,0.15)", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
            <button onClick={() => {
            const client = clients.find(c => c.name === editingOrder.clientName);
            const items = [...(editingOrder.products||[]), ...(editingOrder.services||[])];
            const win = window.open("", "_blank");
            win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><title>Fatura — ${editingOrder.clientName}</title>
            <style>body{font-family:Arial,sans-serif;padding:32px;max-width:600px;margin:0 auto}h1{color:#7B4FA6}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#F0EAFF;padding:8px;text-align:left;font-size:13px}td{padding:8px;border-bottom:1px solid #EEE;font-size:13px}.total{font-size:18px;font-weight:900;color:#7B4FA6;text-align:right;margin-top:16px}.footer{margin-top:32px;font-size:12px;color:#AAA;text-align:center}</style>
            </head><body>
            <h1>LayerLab ✦</h1>
            <p><strong>Cliente:</strong> ${editingOrder.clientName||"—"}</p>
            <p><strong>Data:</strong> ${editingOrder.orderDate||"—"} &nbsp; <strong>Entrega:</strong> ${editingOrder.deliveryDate||"—"}</p>
            <p><strong>Pagamento:</strong> ${editingOrder.paymentMethod||"PIX"}</p>
            ${editingOrder.description ? `<p><strong>Descrição:</strong> ${editingOrder.description}</p>` : ""}
            ${items.length > 0 ? `<table><tr><th>Item</th><th>Qtd</th><th>Unit.</th><th>Total</th></tr>
            ${items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>R$ ${parseFloat(i.price).toLocaleString("pt-BR",{minimumFractionDigits:2})}</td><td>R$ ${(parseFloat(i.price)*i.qty).toLocaleString("pt-BR",{minimumFractionDigits:2})}</td></tr>`).join("")}
            </table>` : "<p>Nenhum item adicionado.</p>"}
            <div class="total">Total: R$ ${total.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
            <div class="footer">LayerLab — Gestão de Impressão 3D</div>
            </body></html>`);
            win.document.close();
            setTimeout(() => win.print(), 400);
          }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid rgba(201,168,255,0.4)", background: "rgba(123,79,166,0.15)", color: "#C9A8FF", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            🧾 Faturar
          </button>
          <button onClick={async () => { await saveEdit(); }} disabled={saving} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #7B4FA6, #9B6DC5)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
            {saving ? "..." : "💾 Salvar"}
          </button>
          <button onClick={() => setView("list")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid rgba(201,168,255,0.2)", background: "transparent", color: "rgba(201,168,255,0.6)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            ✕ Sair
          </button>
        </div>
      </div>
    );
  }

  // ── LISTA DE PEDIDOS ──
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
            color: filterStatus === s ? "#fff" : C.textMid, border: "none", fontFamily: "inherit"
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
              <div key={o.id} onClick={() => openEdit(o)} style={{ background: C.white, borderRadius: 14, padding: "16px 18px", boxShadow: "0 1px 8px rgba(123,79,166,0.08)", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{o.clientName || "—"}</div>
                    <div style={{ color: C.textLight, fontSize: 12, marginTop: 2 }}>
                      📅 {o.orderDate}{o.deliveryDate ? ` · ⏰ ${o.deliveryDate}` : ""}
                    </div>
                    {o.description && <div style={{ color: C.textMid, fontSize: 13, marginTop: 4 }}>{o.description}</div>}
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <StatusBadge status={o.status} />
                      {parseFloat(o.finalPrice) > 0 && (
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.success }}>
                          R$ {parseFloat(o.finalPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      <span style={{ fontSize: 12, fontWeight: 700, color: o.paid ? "#2E7D32" : "#B07800", background: o.paid ? "#D4EDDA" : "#FFF3CD", padding: "2px 8px", borderRadius: 12 }}>
                        {o.paid ? "✅ Pago" : "💰 Em aberto"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                    <button onClick={e => { e.stopPropagation(); const c = clients.find(cl => cl.name === o.clientName); sendWhatsApp(o, c); }} style={{ padding: "5px 10px", borderRadius: 8, background: "#25D366", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      💬
                    </button>
                    <button onClick={e => { e.stopPropagation(); del(o.id); }} style={{ padding: "5px 10px", borderRadius: 8, background: C.danger, color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL NOVO PEDIDO */}
      {showNewModal && (
        <Modal title="Novo Pedido" onClose={() => setShowNewModal(false)}>
          <ClientSearch clients={clients} value={newForm.clientName} onChange={v => { setNewForm(f => ({ ...f, clientName: v })); setShowNewClient(false); }} />
          {!showNewClient && newForm.clientName && !clients.find(c => c.name.toLowerCase() === newForm.clientName.toLowerCase()) && (
            <button onClick={() => { setNewClientForm({ name: newForm.clientName, whatsapp: "", email: "" }); setShowNewClient(true); }}
              style={{ marginBottom: 14, padding: "8px 14px", borderRadius: 10, border: `1.5px dashed ${C.primary}`, background: C.lavender, color: C.primary, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}>
              ➕ Cadastrar "{newForm.clientName}" como novo cliente
            </button>
          )}
          {showNewClient && (
            <div style={{ background: C.lavender, borderRadius: 12, padding: 14, marginBottom: 14, border: `1.5px solid ${C.lavenderMid}` }}>
              <div style={{ fontWeight: 700, color: C.primaryDark, marginBottom: 10, fontSize: 13 }}>Cadastrar Novo Cliente</div>
              <Field label="Nome *" value={newClientForm.name} onChange={v => setNewClientForm(f => ({ ...f, name: v }))} placeholder="Nome" />
              <Field label="WhatsApp" value={newClientForm.whatsapp} onChange={v => setNewClientForm(f => ({ ...f, whatsapp: v }))} placeholder="11999999999" />
              <Field label="E-mail" value={newClientForm.email} onChange={v => setNewClientForm(f => ({ ...f, email: v }))} placeholder="email@exemplo.com" />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={saveNewClient} disabled={!newClientForm.name.trim()}><Icon name="check" size={14} color="#fff" /> Salvar</Btn>
                <Btn variant="secondary" onClick={() => setShowNewClient(false)}>Cancelar</Btn>
              </div>
            </div>
          )}
          <Field label="Descrição" value={newForm.description} onChange={v => setNewForm(f => ({ ...f, description: v }))} placeholder="Detalhes do pedido..." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Data" type="date" value={newForm.orderDate} onChange={v => setNewForm(f => ({ ...f, orderDate: v }))} />
            <Field label="Prazo" type="date" value={newForm.deliveryDate} onChange={v => setNewForm(f => ({ ...f, deliveryDate: v }))} />
          </div>
          <Field label="Observações" value={newForm.notes} onChange={v => setNewForm(f => ({ ...f, notes: v }))} placeholder="Anotações..." />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setShowNewModal(false)}>Cancelar</Btn>
            <Btn onClick={async () => {
              if (!newForm.clientName.trim()) return;
              setSaving(true);
              await addOrder({ ...emptyOrder, ...newForm });
              setSaving(false);
              setShowNewModal(false);
            }} disabled={!newForm.clientName.trim() || saving}>
              <Icon name="check" size={15} color="#fff" /> {saving ? "Salvando..." : "Salvar e Continuar"}
            </Btn>
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

// ════════════════════════════════════════════════════════
// SEÇÃO: FINANCEIRO
// ════════════════════════════════════════════════════════
const Financial = ({ orders, supplies }) => {
  const today = new Date();
  const paidOrders = orders.filter(o => o.paid);
  const unpaidOrders = orders.filter(o => !o.paid && parseFloat(o.finalPrice) > 0);
  const totalReceived = paidOrders.reduce((s, o) => s + (parseFloat(o.finalPrice) || 0), 0);
  const totalPending = unpaidOrders.reduce((s, o) => s + (parseFloat(o.finalPrice) || 0), 0);
  const totalInvested = (supplies||[]).reduce((s, i) => s + (parseFloat(i.price)||0) * (parseFloat(i.quantity)||1), 0);
  const totalRevenue = orders.reduce((s, o) => s + (parseFloat(o.finalPrice) || 0), 0);
  const realProfit = totalReceived - totalInvested;
  const profitMargin = totalReceived > 0 ? ((realProfit / totalReceived) * 100).toFixed(1) : "0.0";
  const fmt = (v) => `R$ ${Math.abs(v).toFixed(2).replace(".", ",")}`;

  const debtors = unpaidOrders.map(o => {
    const deliveryDate = o.deliveryDate ? new Date(o.deliveryDate) : null;
    const daysLate = deliveryDate ? Math.floor((today - deliveryDate) / (1000*60*60*24)) : null;
    return { ...o, daysLate };
  }).sort((a, b) => (b.daysLate||0) - (a.daysLate||0));

  const payerMap = {};
  paidOrders.forEach(o => { payerMap[o.clientName||"—"] = (payerMap[o.clientName||"—"]||0) + (parseFloat(o.finalPrice)||0); });
  const payers = Object.entries(payerMap).sort((a,b) => b[1]-a[1]);

  const generatePDF = () => {
    const dateStr = today.toLocaleDateString("pt-BR");
    const profit = realProfit >= 0;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>LayerLab — Relatório Financeiro</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 32px; font-size: 13px; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #7B4FA6; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 24px; font-weight: 900; color: #3D2066; }
  .logo span { color: #7B4FA6; }
  .date { color: #888; font-size: 12px; }
  .situation { padding: 16px 20px; border-radius: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; background: ${profit ? "#E8F5E9" : "#FFEBEE"}; border: 2px solid ${profit ? "#4CAF50" : "#EF5350"}; }
  .situation h2 { font-size: 20px; color: ${profit ? "#2E7D32" : "#C62828"}; }
  .situation .amount { font-size: 28px; font-weight: 900; color: ${profit ? "#2E7D32" : "#C62828"}; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .card { border: 1.5px solid #DDD0F5; border-radius: 8px; padding: 12px 16px; }
  .card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #8B7AAA; font-weight: 700; }
  .card .value { font-size: 20px; font-weight: 900; margin-top: 4px; }
  .section { margin-bottom: 20px; }
  .section h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #7B4FA6; font-weight: 700; border-bottom: 1.5px solid #DDD0F5; padding-bottom: 6px; margin-bottom: 10px; }
  .row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #F0EAFF; font-size: 13px; }
  .row:last-child { border-bottom: none; }
  .late { color: #C62828; font-weight: 700; font-size: 11px; }
  .ok { color: #2E7D32; font-weight: 700; font-size: 11px; }
  .footer { margin-top: 32px; border-top: 1px solid #DDD; padding-top: 12px; text-align: center; color: #AAA; font-size: 11px; }
  .green { color: #2E7D32; }
  .red { color: #C62828; }
  .yellow { color: #B07800; }
  .purple { color: #7B4FA6; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">Layer<span>Lab</span> ✦</div>
    <div class="date">Relatório Financeiro · ${dateStr}</div>
  </div>

  <div class="situation">
    <div>
      <h2>${profit ? "✅ No Lucro!" : "⚠️ Prejuízo"}</h2>
      <div class="amount">${realProfit < 0 ? "-" : ""}${fmt(realProfit)}</div>
      <div style="font-size:12px;color:#555;margin-top:4px">${realProfit < 0 ? `Faltam ${fmt(Math.abs(realProfit))} pra empatar` : "Lucro real após descontar investimentos"}</div>
    </div>
    <div style="font-size:48px">${profit ? "🎉" : "📉"}</div>
  </div>

  <div class="grid">
    <div class="card"><div class="label">Total Recebido</div><div class="value green">${fmt(totalReceived)}</div><div style="font-size:11px;color:#888">${paidOrders.length} pedidos pagos</div></div>
    <div class="card"><div class="label">Em Aberto</div><div class="value yellow">${fmt(totalPending)}</div><div style="font-size:11px;color:#888">${unpaidOrders.length} pedidos pendentes</div></div>
    <div class="card"><div class="label">Total Investido</div><div class="value red">${fmt(totalInvested)}</div><div style="font-size:11px;color:#888">${(supplies||[]).length} itens cadastrados</div></div>
    <div class="card"><div class="label">Margem de Lucro</div><div class="value ${parseFloat(profitMargin)>=0?"green":"red"}">${profitMargin}%</div><div style="font-size:11px;color:#888">sobre total recebido</div></div>
  </div>

  ${debtors.length > 0 ? `
  <div class="section">
    <h3>⚠️ Pagamentos em Aberto</h3>
    ${debtors.map(o => `
      <div class="row">
        <div>
          <div><strong>${o.clientName||"—"}</strong> — ${o.productName||""}</div>
          ${o.daysLate !== null ? `<div class="${o.daysLate>0?"late":"ok"}">${o.daysLate>0?`🔴 ${o.daysLate} dias em atraso`:"🟢 Dentro do prazo"}</div>` : ""}
        </div>
        <div class="yellow" style="font-weight:700">${fmt(parseFloat(o.finalPrice))}</div>
      </div>`).join("")}
  </div>` : ""}

  ${payers.length > 0 ? `
  <div class="section">
    <h3>✅ Clientes que Pagaram</h3>
    ${payers.map(([name,val]) => `
      <div class="row">
        <span>${name}</span>
        <span class="green" style="font-weight:700">${fmt(val)}</span>
      </div>`).join("")}
  </div>` : ""}

  ${(supplies||[]).length > 0 ? `
  <div class="section">
    <h3>📦 Insumos Investidos</h3>
    ${(supplies||[]).map(s => `
      <div class="row">
        <span>${s.name} (${s.category}) × ${s.quantity}</span>
        <span class="red">${fmt(parseFloat(s.price)*parseFloat(s.quantity||1))}</span>
      </div>`).join("")}
    <div class="row" style="font-weight:700">
      <span>TOTAL INVESTIDO</span>
      <span class="red">${fmt(totalInvested)}</span>
    </div>
  </div>` : ""}

  <div class="footer">LayerLab — Gestão de Impressão 3D · Relatório gerado em ${dateStr}</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const glassCard = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,255,0.15)", borderRadius: 14 };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: "#EEE8FF", margin: 0 }}>Financeiro</h2>
          <p style={{ color: "rgba(201,168,255,0.5)", margin: "4px 0 0", fontSize: 13 }}>Visão completa do negócio</p>
        </div>
        <button onClick={generatePDF} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #7B4FA6, #9B6DC5)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          📄 Relatório
        </button>
      </div>

      {/* SITUAÇÃO */}
      <div style={{ ...glassCard, background: realProfit >= 0 ? "linear-gradient(135deg,rgba(46,125,50,0.45),rgba(67,160,71,0.3))" : "linear-gradient(135deg,rgba(192,57,43,0.45),rgba(231,76,60,0.3))", border: `1px solid ${realProfit>=0?"rgba(76,175,80,0.35)":"rgba(231,76,60,0.35)"}`, padding: "18px 20px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{realProfit >= 0 ? "✅ No Lucro!" : "⚠️ Prejuízo"}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginTop: 4 }}>{realProfit < 0 ? "-" : ""}{fmt(realProfit)}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{realProfit < 0 ? `Faltam ${fmt(Math.abs(realProfit))} pra empatar` : "Lucro real após investimentos"}</div>
        </div>
        <span style={{ fontSize: 40 }}>{realProfit >= 0 ? "🎉" : "📉"}</span>
      </div>

      {/* CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Recebido", value: fmt(totalReceived), color: "#7FFFA8", sub: `${paidOrders.length} pagos` },
          { label: "Em Aberto", value: fmt(totalPending), color: "#FFD166", sub: `${unpaidOrders.length} pendentes` },
          { label: "Investido", value: fmt(totalInvested), color: "#FF8A80", sub: `${(supplies||[]).length} itens` },
          { label: "Margem Lucro", value: `${profitMargin}%`, color: parseFloat(profitMargin)>=0?"#7FFFA8":"#FF8A80", sub: "sobre recebido" },
        ].map(c => (
          <div key={c.label} style={{ ...glassCard, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "rgba(201,168,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: c.color, marginTop: 4 }}>{c.value}</div>
            <div style={{ fontSize: 10, color: "rgba(201,168,255,0.45)", marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* DEVEDORES */}
      {debtors.length > 0 && <>
        <div style={{ fontSize: 11, color: "rgba(201,168,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>⚠️ Pagamentos em Aberto</div>
        {debtors.map(o => (
          <div key={o.id} style={{ ...glassCard, padding: "12px 16px", marginBottom: 8, borderColor: o.daysLate > 0 ? "rgba(231,76,60,0.45)" : "rgba(201,168,255,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#EEE8FF", fontSize: 14 }}>{o.clientName || "—"}</div>
                <div style={{ fontSize: 12, color: "rgba(201,168,255,0.55)", marginTop: 2 }}>{o.productName}</div>
                {o.daysLate !== null && <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: o.daysLate > 0 ? "#FF8A80" : "#7FFFA8" }}>
                  {o.daysLate > 0 ? `🔴 ${o.daysLate} dias em atraso` : "🟢 Dentro do prazo"}
                </div>}
              </div>
              <span style={{ fontWeight: 900, color: "#FFD166", fontSize: 16 }}>{fmt(parseFloat(o.finalPrice))}</span>
            </div>
          </div>
        ))}
      </>}

      {/* PAGADORES */}
      {payers.length > 0 && <>
        <div style={{ fontSize: 11, color: "rgba(201,168,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 16 }}>✅ Clientes que Pagaram</div>
        {payers.map(([name, val]) => (
          <div key={name} style={{ ...glassCard, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#EEE8FF", fontWeight: 600 }}>{name}</span>
            <span style={{ color: "#7FFFA8", fontWeight: 700 }}>{fmt(val)}</span>
          </div>
        ))}
      </>}

      {orders.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(201,168,255,0.4)" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
          <p>Nenhum dado financeiro ainda.</p>
        </div>
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
  const [services, setServices] = useState([]);
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
      const [c, o, cat, sup, svc] = await Promise.all([
        supa.getAll("clients", accessToken),
        supa.getAll("orders", accessToken),
        supa.getAll("catalog", accessToken),
        supa.getAll("supplies", accessToken),
        supa.getAll("services", accessToken),
      ]);
      setClients(Array.isArray(c) ? c : []);
      setOrders(Array.isArray(o) ? o.map(x => ({ ...x, finalPrice: x.final_price, clientName: x.client_name, productName: x.product_name, orderDate: x.order_date, deliveryDate: x.delivery_date, paymentMethod: x.payment_method })) : []);
      setCatalog(Array.isArray(cat) ? cat.map(x => ({ ...x, inStock: x.in_stock, imageUrl: x.image_url })) : []);
      setSupplies(Array.isArray(sup) ? sup : []);
      setServices(Array.isArray(svc) ? svc : []);
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

  const toDb = (o) => ({ client_name: o.clientName, product_name: o.productName||"", description: o.description, order_date: o.orderDate, delivery_date: o.deliveryDate, payment_method: o.paymentMethod||"PIX", final_price: parseFloat(o.finalPrice) || 0, status: o.status, paid: o.paid||false, notes: o.notes, invoice_items: o.invoiceItems||null, products: typeof o.products === "string" ? o.products : JSON.stringify(o.products||[]), services: typeof o.services === "string" ? o.services : JSON.stringify(o.services||[]) });
  const fromDb = (o) => ({ ...o, clientName: o.client_name, productName: o.product_name, orderDate: o.order_date, deliveryDate: o.delivery_date, paymentMethod: o.payment_method, finalPrice: o.final_price, paid: o.paid||false, products: (() => { try { return JSON.parse(o.products||"[]"); } catch { return []; }})(), services: (() => { try { return JSON.parse(o.services||"[]"); } catch { return []; }})() });

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

  const addService = async (data) => {
    const r = await supa.insert("services", data, token);
    if (r?.id) setServices(ss => [r, ...ss]);
  };
  const deleteService = async (id) => {
    await supa.remove("services", id, token);
    setServices(ss => ss.filter(s => s.id !== id));
  };

  const nav = [
    { id: "home",      label: "Início",      icon: "home" },
    { id: "calculator",label: "Calculadora", icon: "calc" },
    { id: "orders",    label: "Pedidos",     icon: "orders" },
    { id: "clients",   label: "Clientes",    icon: "clients" },
    { id: "catalog",   label: "Catálogo",    icon: "catalog" },
    { id: "supplies",  label: "Insumos",     icon: "box" },
    { id: "financial", label: "Financeiro",  icon: "chart" },
    { id: "services",  label: "Serviços",    icon: "calc" },
  ];

  const renderPage = () => {
    switch (page) {
      case "home":       return <Dashboard orders={orders} clients={clients} catalog={catalog} supplies={supplies} setPage={setPage} />;
      case "calculator": return <Calculator />;
      case "orders":     return <Orders orders={orders} addOrder={addOrder} updateOrder={updateOrder} deleteOrder={deleteOrder} updateOrderStatus={updateOrderStatus} clients={clients} addClient={addClient} catalog={catalog} services={services} />;
      case "services":   return <ServicesCatalog services={services} addService={addService} deleteService={deleteService} />;
      case "clients":    return <Clients clients={clients} addClient={addClient} updateClient={updateClient} deleteClient={deleteClient} />;
      case "catalog":    return <Catalog catalog={catalog} addCatalog={addCatalog} updateCatalog={updateCatalog} deleteCatalog={deleteCatalog} />;
      case "supplies":   return <Supplies supplies={supplies} addSupply={addSupply} deleteSupply={deleteSupply} />;
      case "financial":  return <Financial orders={orders} supplies={supplies} />;
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
        <button onClick={() => { if(confirm("Sair da conta?")) { setToken(null); setOrders([]); setClients([]); setCatalog([]); setSupplies([]); }}} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "rgba(255,100,100,0.7)", fontSize: 9, fontWeight: 600, padding: "2px 6px", flex: 1 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>🚪</span>
          </div>
          Sair
        </button>
      </div>

      <main style={{ flex: 1, padding: "16px 20px 100px", maxWidth: 900, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "none", alignItems: "center", justifyContent: "center", marginBottom: 20, paddingTop: 8 }} id="mobile-header">
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
