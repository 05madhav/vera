"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/* ── Static data (replaced by real DB data later) ── */
const ACTIVITIES = [
  { id: 1, emoji: "☕", type: "Coffee",    title: "Morning Brew @ Koramangala",       dist: "0.4 km", time: "8:30 AM",  when: "Today",    count: 6,  color: "teal"   },
  { id: 2, emoji: "📚", type: "Study",     title: "Deep Work @ Dialogues Café",       dist: "1.1 km", time: "5:00 PM",  when: "Today",    count: 4,  color: "violet" },
  { id: 3, emoji: "🏃", type: "Run",       title: "Evening Run — KP Loop",            dist: "0.8 km", time: "6:30 PM",  when: "Today",    count: 8,  color: "blue"   },
  { id: 4, emoji: "💬", type: "Talk",      title: "Conversation Circle — Indiranagar",dist: "1.4 km", time: "7:00 PM",  when: "Today",    count: 11, color: "teal"   },
  { id: 5, emoji: "💻", type: "Cowork",   title: "Coworking Evening @ Third Wave",    dist: "0.5 km", time: "4:00 PM",  when: "Tomorrow", count: 5,  color: "violet" },
  { id: 6, emoji: "🏸", type: "Badminton",title: "Casual Badminton — HSR Court",      dist: "2.2 km", time: "7:30 AM",  when: "Tomorrow", count: 3,  color: "blue"   },
];

const NODES = [
  { id: 1, name: "Ananya",  dist: "0.6 km", tags: ["Café Hopping","Photography"],        vouch: "Community Vouched", color: "violet", top: "21%", left: "19%" },
  { id: 2, name: "Rohan",   dist: "1.2 km", tags: ["Running","Wellness"],                vouch: "Actually Shows Up", color: "blue",   top: "37%", left: "67%" },
  { id: 3, name: "Priya",   dist: "0.9 km", tags: ["Coworking","Live Music"],            vouch: "Great Group Energy",color: "teal",   top: "61%", left: "27%" },
  { id: 4, name: "Karthik", dist: "1.5 km", tags: ["Badminton","Fitness"],               vouch: "Reliable",          color: "violet", top: "54%", left: "54%" },
  { id: 5, name: "Meera",   dist: "0.4 km", tags: ["Walks","Conversation"],              vouch: "Community Vouched", color: "blue",   top: "29%", left: "43%" },
  { id: 6, name: "Dev",     dist: "2.1 km", tags: ["Startup Networking","Coffee"],       vouch: "Trusted Host",      color: "teal",   top: "71%", left: "61%" },
  { id: 7, name: "Sara",    dist: "0.7 km", tags: ["Photography","Wellness"],            vouch: "Community Vouched", color: "violet", top: "17%", left: "54%" },
];

const MAP_CARDS = [
  { emoji: "☕", type: "Coffee",  title: "Morning Brew · Koramangala", count: 6,  dist: "0.4 km", time: "8:30 AM", color: "teal",   top: "10%",  left: "22%" },
  { emoji: "📚", type: "Study",  title: "Deep Work · Dialogues",      count: 4,  dist: "1.1 km", time: "5:00 PM", color: "violet", bottom: "18%",right: "4%"  },
  { emoji: "🏃", type: "Run",    title: "Evening Run · KP Loop",      count: 8,  dist: "0.8 km", time: "6:30 PM", color: "blue",   top: "42%",  left: "4%"  },
];

const COLOR = {
  teal:   { dot: "#5eead4", glow: "rgba(94,234,212,0.22)",  text: "#5eead4" },
  violet: { dot: "#a78bfa", glow: "rgba(167,139,250,0.22)", text: "#a78bfa" },
  blue:   { dot: "#4d9fff", glow: "rgba(77,159,255,0.22)",  text: "#4d9fff" },
};

export default function Home() {
  const router   = useRouter();
  const mapRef   = useRef(null);
  const timerRef = useRef(null);

  const [user,      setUser]      = useState(null);
  const [popup,     setPopup]     = useState(null);   // { node, x, y }
  const [activeTab, setActiveTab] = useState("Nearby");
  const [rsvpd,     setRsvpd]    = useState(new Set());

  /* Auth guard */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/");
      else setUser(session.user);
    });
  }, [router]);

  /* Lock body scroll while on this page */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Close popup on outside click */
  const closePopup = useCallback(() => setPopup(null), []);

  function handleNodeClick(node, e) {
    e.stopPropagation();
    if (popup?.node.id === node.id) { setPopup(null); return; }

    const mapRect = mapRef.current.getBoundingClientRect();
    let x = e.clientX - mapRect.left + 14;
    let y = e.clientY - mapRect.top  + 14;
    if (x + 230 > mapRect.width)  x = e.clientX - mapRect.left - 240;
    if (y + 180 > mapRect.height) y = e.clientY - mapRect.top  - 180;

    setPopup({ node, x: Math.max(8, x), y: Math.max(8, y) });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPopup(null), 5000);
  }

  function toggleRsvp(id) {
    setRsvpd(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (!user) return null;
  const firstName = user.user_metadata?.first_name || "";

  return (
    <div style={s.root}>

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <div style={s.logo}>
          <span style={s.logoDot}></span>
          <span>vera</span>
        </div>

        <div style={s.searchBar}>
          <span style={s.searchIcon}>⌕</span>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search people or activities nearby..."
          />
        </div>

        <div style={s.navRight}>
          <div style={s.navIconBtn} title="Notifications">🔔</div>
          <div
            style={s.avatarBtn}
            onClick={() => router.push("/profile")}
            title={firstName || "Profile"}
          >
            {firstName ? firstName[0].toUpperCase() : "?"}
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={s.body}>

        {/* ── MAP ── */}
        <div ref={mapRef} style={s.map} onClick={closePopup}>
          {/* Grid overlay */}
          <div style={s.mapGrid}></div>

          {/* User nodes */}
          {NODES.map(node => (
            <button
              key={node.id}
              style={{
                ...s.node,
                top: node.top, left: node.left,
                background: COLOR[node.color].dot,
                boxShadow: `0 0 0 4px ${COLOR[node.color].glow}, 0 0 18px ${COLOR[node.color].dot}`,
              }}
              onClick={e => handleNodeClick(node, e)}
              title={node.name}
            />
          ))}

          {/* Me dot */}
          <div style={s.meDot}>
            <div style={s.meInner}></div>
            <div style={s.meRing}></div>
          </div>

          {/* Floating activity cards */}
          {MAP_CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                ...s.mapCard,
                ...(card.top    ? { top:    card.top    } : {}),
                ...(card.bottom ? { bottom: card.bottom } : {}),
                ...(card.left   ? { left:   card.left   } : {}),
                ...(card.right  ? { right:  card.right  } : {}),
              }}
            >
              <div style={{ ...s.mapCardType, color: COLOR[card.color].dot }}>
                {card.emoji} {card.type}
              </div>
              <div style={s.mapCardTitle}>{card.title}</div>
              <div style={s.mapCardMeta}>
                <span>{card.count} joining</span>
                <span style={s.metaDot}></span>
                <span>{card.dist}</span>
                <span style={s.metaDot}></span>
                <span>{card.time}</span>
              </div>
            </div>
          ))}

          {/* Node popup */}
          {popup && (
            <div style={{ ...s.popup, left: popup.x, top: popup.y }}>
              <div style={s.popupHead}>
                <div style={{
                  ...s.popupAvatar,
                  background: `linear-gradient(135deg, ${COLOR[popup.node.color].dot}, #4d9fff)`,
                }}></div>
                <div>
                  <div style={s.popupName}>{popup.node.name}</div>
                  <div style={s.popupDist}>{popup.node.dist} away</div>
                </div>
              </div>
              <div style={s.popupTags}>
                {popup.node.tags.map(t => (
                  <span key={t} style={s.popupTag}>{t}</span>
                ))}
              </div>
              <div style={{ ...s.popupVouch, color: COLOR[popup.node.color].dot }}>
                <span style={{
                  ...s.vouchDot,
                  background: COLOR[popup.node.color].dot,
                  boxShadow: `0 0 6px ${COLOR[popup.node.color].dot}`,
                }}></span>
                {popup.node.vouch}
              </div>
            </div>
          )}

          {/* Float button */}
          <button
            style={s.floatBtn}
            onClick={() => router.push("/float")}
            title="Float a plan"
          >
            +
          </button>
        </div>

        {/* ── SIDEBAR ── */}
        <div style={s.sidebar}>
          <div style={s.sidebarTabs}>
            {["Nearby", "People"].map(tab => (
              <div
                key={tab}
                style={{
                  ...s.sidebarTab,
                  ...(activeTab === tab ? s.sidebarTabActive : {}),
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div style={s.sidebarList}>
            {ACTIVITIES.map(a => (
              <div key={a.id} style={s.actCard}>
                <div style={{ ...s.actType, color: COLOR[a.color].dot }}>
                  {a.emoji} {a.type}
                </div>
                <div style={s.actTitle}>{a.title}</div>
                <div style={s.actChips}>
                  <span style={s.chip}>{a.dist}</span>
                  <span style={s.chip}>{a.time}</span>
                  <span style={s.chip}>{a.when}</span>
                </div>
                <div style={s.actFoot}>
                  <div style={s.actPeople}>
                    <div style={s.actAvatars}>
                      {[0,1,2].map(i => (
                        <span key={i} style={{
                          ...s.actAvatar,
                          background: i === 0
                            ? "linear-gradient(135deg,#4d9fff,#a78bfa)"
                            : i === 1
                            ? "linear-gradient(135deg,#5eead4,#4d9fff)"
                            : "linear-gradient(135deg,#a78bfa,#5eead4)",
                        }}></span>
                      ))}
                    </div>
                    <span style={s.actCount}>{a.count} joining</span>
                  </div>
                  <button
                    style={{
                      ...s.rsvpBtn,
                      ...(rsvpd.has(a.id) ? s.rsvpBtnActive : {}),
                    }}
                    onClick={() => toggleRsvp(a.id)}
                  >
                    {rsvpd.has(a.id) ? "Joined ✓" : "RSVP"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes nodePulse  { 0%,100%{transform:scale(1)}   50%{transform:scale(1.3)} }
        @keyframes ringExpand { 0%{transform:translate(-50%,-50%) scale(0.4);opacity:1} 100%{transform:translate(-50%,-50%) scale(2.6);opacity:0} }
        @keyframes floatGlow  {
          0%,100%{box-shadow:0 8px 32px -6px rgba(167,139,250,0.65),0 0 0 0 rgba(167,139,250,0.18)}
          50%    {box-shadow:0 8px 32px -6px rgba(167,139,250,0.65),0 0 0 14px rgba(167,139,250,0)}
        }
        @keyframes mapCardFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>
    </div>
  );
}

/* ── Styles ── */
const s = {
  root: {
    height: "100vh", width: "100vw",
    display: "flex", flexDirection: "column",
    background: "#050507", color: "#f5f5f7",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    fontWeight: 300, overflow: "hidden",
    WebkitFontSmoothing: "antialiased",
  },

  /* NAV */
  nav: {
    display: "flex", alignItems: "center", gap: 16,
    padding: "14px 24px",
    background: "rgba(5,5,7,0.78)",
    backdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0, zIndex: 10,
  },
  logo: {
    display: "flex", alignItems: "center", gap: 10,
    fontWeight: 600, fontSize: 18, letterSpacing: "-0.02em",
    flexShrink: 0,
  },
  logoDot: {
    display: "inline-block",
    width: 10, height: 10, borderRadius: "50%",
    background: "linear-gradient(135deg,#4d9fff,#a78bfa)",
    boxShadow: "0 0 14px #a78bfa",
  },
  searchBar: {
    flex: 1, maxWidth: 420,
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 16px", borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  searchIcon: { color: "rgba(245,245,247,0.4)", fontSize: 15 },
  searchInput: {
    flex: 1, background: "none", border: "none", outline: "none",
    color: "#f5f5f7", fontSize: 13,
    fontFamily: "var(--font-inter), system-ui, sans-serif",
  },
  navRight: { display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" },
  navIconBtn: {
    width: 38, height: 38, borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: 15,
  },
  avatarBtn: {
    width: 38, height: 38, borderRadius: "50%",
    background: "linear-gradient(135deg,#5eead4,#a78bfa)",
    cursor: "pointer", border: "2px solid rgba(94,234,212,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 600, color: "#050507",
    transition: "transform .2s",
  },

  /* BODY */
  body: { flex: 1, display: "flex", overflow: "hidden" },

  /* MAP */
  map: {
    flex: 1, position: "relative", overflow: "hidden",
    background: `
      radial-gradient(circle at 35% 45%, rgba(77,159,255,0.09), transparent 50%),
      radial-gradient(circle at 65% 55%, rgba(167,139,250,0.09), transparent 50%),
      linear-gradient(180deg,#11111a,#0a0a10)
    `,
    cursor: "default",
  },
  mapGrid: {
    position: "absolute", inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 72%)",
    maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 72%)",
  },
  node: {
    position: "absolute", width: 16, height: 16,
    borderRadius: "50%", border: "none",
    cursor: "pointer", zIndex: 3,
    transform: "translate(-50%,-50%)",
    animation: "nodePulse 2.5s ease-in-out infinite",
  },
  meDot: {
    position: "absolute", top: "50%", left: "50%",
    width: 22, height: 22,
    transform: "translate(-50%,-50%)",
    zIndex: 4,
  },
  meInner: {
    width: 22, height: 22, borderRadius: "50%",
    background: "linear-gradient(135deg,#4d9fff,#a78bfa)",
    boxShadow: "0 0 0 5px rgba(167,139,250,0.2), 0 0 30px #a78bfa",
    position: "relative", zIndex: 2,
  },
  meRing: {
    position: "absolute",
    width: 110, height: 110,
    top: "50%", left: "50%",
    borderRadius: "50%",
    border: "1px solid rgba(167,139,250,0.22)",
    animation: "ringExpand 3s ease-out infinite",
  },
  mapCard: {
    position: "absolute", zIndex: 5,
    padding: "12px 16px", borderRadius: 14,
    background: "rgba(10,10,16,0.88)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
    minWidth: 190,
    boxShadow: "0 14px 40px -10px rgba(0,0,0,0.6)",
    animation: "mapCardFloat 6s ease-in-out infinite",
  },
  mapCardType: {
    fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase",
    marginBottom: 5,
  },
  mapCardTitle: { fontSize: 13, fontWeight: 500, marginBottom: 6 },
  mapCardMeta: {
    display: "flex", gap: 8, fontSize: 11,
    color: "rgba(245,245,247,0.45)", alignItems: "center",
  },
  metaDot: {
    width: 3, height: 3, borderRadius: "50%",
    background: "rgba(245,245,247,0.2)", display: "inline-block",
  },

  /* NODE POPUP */
  popup: {
    position: "absolute", zIndex: 10,
    padding: "16px 18px", borderRadius: 16,
    background: "rgba(8,8,14,0.95)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.14)",
    width: 220,
    boxShadow: "0 20px 60px -15px rgba(0,0,0,0.7)",
  },
  popupHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  popupAvatar: {
    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
  },
  popupName: { fontSize: 13, fontWeight: 500 },
  popupDist: { fontSize: 11, color: "rgba(245,245,247,0.4)", marginTop: 1 },
  popupTags: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 },
  popupTag: {
    fontSize: 10, padding: "3px 8px", borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(245,245,247,0.65)",
  },
  popupVouch: { fontSize: 11, display: "flex", alignItems: "center", gap: 5 },
  vouchDot: { width: 5, height: 5, borderRadius: "50%", flexShrink: 0 },

  /* FLOAT BUTTON */
  floatBtn: {
    position: "absolute", bottom: 30, right: 30, zIndex: 6,
    width: 60, height: 60, borderRadius: "50%",
    background: "linear-gradient(135deg,#4d9fff,#a78bfa)",
    border: "none", cursor: "pointer",
    fontSize: 28, color: "#fff", lineHeight: 1,
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "floatGlow 3s ease-in-out infinite",
    transition: "transform .3s",
  },

  /* SIDEBAR */
  sidebar: {
    width: 320, flexShrink: 0,
    background: "rgba(5,5,7,0.65)",
    backdropFilter: "blur(20px)",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    display: "flex", flexDirection: "column", overflow: "hidden",
  },
  sidebarTabs: {
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0,
  },
  sidebarTab: {
    flex: 1, padding: "14px", textAlign: "center",
    fontSize: 13, color: "rgba(245,245,247,0.5)",
    cursor: "pointer", borderBottom: "2px solid transparent",
    transition: "all .2s",
  },
  sidebarTabActive: { color: "#a78bfa", borderBottomColor: "#a78bfa" },
  sidebarList: {
    flex: 1, overflowY: "auto",
    padding: 14, display: "flex", flexDirection: "column", gap: 11,
  },

  /* ACTIVITY CARD */
  actCard: {
    padding: "16px 18px", borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer", transition: "all .28s",
  },
  actType: {
    fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase",
    marginBottom: 6,
  },
  actTitle: { fontSize: 14, marginBottom: 8 },
  actChips: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  chip: {
    fontSize: 11, padding: "3px 9px", borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(245,245,247,0.45)",
  },
  actFoot: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  actPeople: { display: "flex", alignItems: "center", gap: 7 },
  actAvatars: { display: "flex" },
  actAvatar: {
    width: 20, height: 20, borderRadius: "50%",
    border: "1.5px solid #0a0a10", marginLeft: -5,
    display: "inline-block",
  },
  actCount: { fontSize: 12, color: "rgba(245,245,247,0.45)" },
  rsvpBtn: {
    fontSize: 11, padding: "5px 12px", borderRadius: 999,
    background: "rgba(167,139,250,0.1)",
    border: "1px solid rgba(167,139,250,0.3)",
    color: "#a78bfa", cursor: "pointer", transition: "all .2s",
    fontFamily: "inherit",
  },
  rsvpBtnActive: {
    background: "rgba(94,234,212,0.1)",
    borderColor: "rgba(94,234,212,0.3)",
    color: "#5eead4",
  },
};
