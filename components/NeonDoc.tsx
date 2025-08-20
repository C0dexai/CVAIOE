// components/NeonDoc.tsx
import React, { useMemo } from "react";

/* --- Neon theme --- */
export const neonCSS = `
:root {
  --bg:#0b0f14; --panel:#0f141a; --ink:#d4e1f5; --muted:#1f2a36;
  --teal:#6ae3ff; --teal-ghost: rgba(106,227,255,.15);
  --ok:#32d74b; --warn:#ffd60a; --bad:#ff453a;
}
.neon-surface {
  background: var(--panel);
  border-radius: 16px;
  border: 1px solid var(--muted);
  box-shadow: 0 0 0 1px var(--teal-ghost), 0 16px 40px rgba(106,227,255,.08);
  color: var(--ink);
}
.neon-edge { outline: 1px solid rgba(106,227,255,.25); border-radius: 16px; }
.neon-card { position: relative; padding: 16px 18px; }
.neon-card h1,.neon-card h2,.neon-card h3 { margin: 6px 0 10px; }
.neon-quote {
  border-left: 3px solid var(--teal);
  padding: 8px 12px; margin: 8px 0; background: rgba(106,227,255,.06);
  border-radius: 8px;
}
.neon-code { background:#0b1016; border:1px solid #1b2633; border-radius:12px; padding:12px; overflow:auto; }
.neon-chip { display:inline-block; font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid #2f3c4d; background:#0c1420; color:#9fd0ea; }
.neon-callout { border:1px solid #223041; border-radius:12px; padding:10px; margin:8px 0; }
.neon-callout.info { border-color:#223041; background:#0b1016; }
.neon-callout.warn { border-color:#4a3a12; background:rgba(255,214,10,.08); }
.neon-callout.success { border-color:#17381f; background:rgba(50,215,75,.08); }

.neon-toolbar-fixed {
  position: fixed; right: 16px; top: 50%; transform: translateY(-50%);
  display: grid; gap: 8px; z-index: 20;
}
.neon-icon-btn {
  width: 40px; height: 40px; display:grid; place-items:center; cursor:pointer;
  background: #0b1016; border:1px solid #223041; border-radius:12px; color:#9fc0e0;
}
.neon-icon-btn:hover { box-shadow: 0 0 0 1px var(--teal-ghost), 0 8px 22px rgba(106,227,255,.08); }

.p-toolbar {
  position:absolute; right:10px; top:8px; display:flex; gap:6px; opacity:.0; transition:opacity .15s ease;
}
.p:hover .p-toolbar { opacity:1; }
.p { position:relative; }
.anchor { color:#9fc0e0; font-size:12px; cursor:pointer; user-select:none; }
`;

/* --- Utility: simple trigger parsing --- */
type Block =
  | { kind: "p"; id: string; html: string }
  | { kind: "quote"; id: string; html: string }
  | { kind: "code"; id: string; lang: string; body: string }
  | { kind: "command"; id: string; name: string; body: string }
  | { kind: "callout"; id: string; ctype: "info"|"warn"|"success"; body: string };

const uid = (()=>{ let i=0; return ()=>`p-${++i}`; })();

const chipify = (s:string) =>
  s.replace(/`:chip:([^`]+)`/g, (_m, label) =>
    `<span class="neon-chip">${label}</span>`);

const mdLineToHtml = (line: string) => {
  if (line.startsWith(">")) return { kind:"quote" as const, html: chipify(line.replace(/^>\s?/, "")) };
  return { kind:"p" as const, html: chipify(line) };
};

export function parseContent(raw: string): Block[] {
  const out: Block[] = [];
  const lines = raw.split(/\r?\n/);
  const buf: string[] = [];
  let mode: null | { t:"code"; lang:string } | { t:"command"; name:string } | { t:"callout"; ctype:"info"|"warn"|"success" } = null;

  const flushParagraph = () => {
    if (!buf.length) return;
    const para = buf.join("\n").trim();
    if (para) {
      const lns = para.split("\n");
      lns.forEach((ln) => {
        const m = mdLineToHtml(ln);
        if (m.kind === "quote") out.push({ kind:"quote", id: uid(), html: m.html });
        else out.push({ kind:"p", id: uid(), html: m.html });
      });
    }
    buf.length = 0;
  };

  for (const line of lines) {
    const openCode = line.match(/^\[\[SYNTAX:([a-z0-9]+)\]\]$/i);
    const closeCode = line.match(/^\[\[\/SYNTAX\]\]$/i);
    const openCmd  = line.match(/^\[\[COMMAND:([A-Z0-9_\-]+)\]\]$/i);
    const closeCmd = line.match(/^\[\[\/COMMAND\]\]$/i);
    const openCall = line.match(/^\[\[CALLOUT:(info|warn|success)\]\]$/i);
    const closeCall = line.match(/^\[\[\/CALLOUT\]\]$/i);

    if (openCode) { flushParagraph(); mode = { t:"code", lang: openCode[1] }; continue; }
    if (closeCode && mode?.t==="code") {
      out.push({ kind:"code", id: uid(), lang: mode.lang, body: buf.join("\n") });
      buf.length=0; mode=null; continue;
    }
    if (openCmd) { flushParagraph(); mode = { t:"command", name: openCmd[1] }; continue; }
    if (closeCmd && mode?.t==="command") {
      out.push({ kind:"command", id: uid(), name: mode.name, body: buf.join("\n") });
      buf.length=0; mode=null; continue;
    }
    if (openCall) { flushParagraph(); mode = { t:"callout", ctype: openCall[1] as any }; continue; }
    if (closeCall && mode?.t==="callout") {
      out.push({ kind:"callout", id: uid(), ctype: mode.ctype, body: buf.join("\n") });
      buf.length=0; mode=null; continue;
    }

    buf.push(line);
  }
  flushParagraph();
  return out;
}

/* --- Icons --- */
const Icon = {
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v2h2a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v2zm8 2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2"/></svg>,
  Up: () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5l7 7-1.41 1.41L13 9.83V20h-2V9.83L6.41 13.4 5 12z"/></svg>,
  Down: () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 19l-7-7 1.41-1.41L11 14.17V4h2v10.17l4.59-4.58L19 12z"/></svg>,
  Bookmark: () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6 2h12v20l-6-4-6 4z"/></svg>,
  Voice: () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm7-3a1 1 0 0 1 2 0 9 9 0 0 1-8 8.94V22h-2v-2.06A9 9 0 0 1 3 11a1 1 0 0 1 2 0a7 7 0 0 0 14 0z"/></svg>,
  Link: () => <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3.9 12a5 5 0 0 1 5-5h3v2h-3a3 3 0 1 0 0 6h3v2h-3a5 5 0 0 1-5-5m7-3h3a5 5 0 1 1 0 10h-3v-2h3a3 3 0 0 0 0-6h-3z"/></svg>,
};

/* --- Toolbar --- */
function FixedToolbar() {
  const copySel = () => {
    const s = document.getSelection()?.toString() || "";
    if (!s) return;
    navigator.clipboard.writeText(s);
  };
  const go = (dir: "up"|"down") => window.scrollBy({ top: dir==="up" ? -window.innerHeight : window.innerHeight, behavior:"smooth" });
  const speak = () => {
    if (typeof window.speechSynthesis === 'undefined') {
        console.warn('Web Speech API not supported in this browser.');
        return;
    }
    const s = window.getSelection()?.toString();
    const text = s || document.querySelector(".neon-card")?.textContent || "";
    const u = new SpeechSynthesisUtterance(text.slice(0, 8000));
    speechSynthesis.speak(u);
  };
  const bm = () => localStorage.setItem("neon:lastBookmark", String(window.scrollY));
  return (
    <div className="neon-toolbar-fixed">
      <button className="neon-icon-btn" aria-label="Copy selection" onClick={copySel}><Icon.Copy/></button>
      <button className="neon-icon-btn" aria-label="Scroll up" onClick={()=>go("up")}><Icon.Up/></button>
      <button className="neon-icon-btn" aria-label="Scroll down" onClick={()=>go("down")}><Icon.Down/></button>
      <button className="neon-icon-btn" aria-label="Bookmark" onClick={bm}><Icon.Bookmark/></button>
      <button className="neon-icon-btn" aria-label="Voice" onClick={speak}><Icon.Voice/></button>
    </div>
  );
}

/* --- Card renderer --- */
export function NeonDoc({ text }: { text: string }) {
  const blocks = useMemo(()=>parseContent(text), [text]);
  const copyBlock = (id:string) => {
    const node = document.getElementById(id);
    if (!node) return;
    const txt = node.innerText;
    navigator.clipboard.writeText(txt);
  };
  const copyLink = (id:string) => {
    const url = `${location.origin}${location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <>
      <style>{neonCSS}</style>
      <FixedToolbar />
      <article className="neon-surface neon-edge neon-card">
        {blocks.map(b => {
          if (b.kind === "p") return (
            <div key={b.id} id={b.id} className="p" dangerouslySetInnerHTML={{__html: b.html}} />
          );
          if (b.kind === "quote") return (
            <blockquote key={b.id} id={b.id} className="neon-quote p" dangerouslySetInnerHTML={{__html: b.html}} />
          );
          if (b.kind === "code") return (
            <div key={b.id} id={b.id} className="neon-code p">
              <div className="p-toolbar">
                <span className="anchor" onClick={()=>copyBlock(b.id)} title="Copy"><Icon.Copy/></span>
                <span className="anchor" onClick={()=>copyLink(b.id)} title="Copy link"><Icon.Link/></span>
              </div>
              <div style={{fontSize:12, color:"#9fc0e0", marginBottom:6}}>{b.lang.toUpperCase()}</div>
              <pre><code>{b.body}</code></pre>
            </div>
          );
          if (b.kind === "command") return (
            <div key={b.id} id={b.id} className="neon-code p">
              <div className="p-toolbar">
                <span className="anchor" onClick={()=>copyBlock(b.id)} title="Copy"><Icon.Copy/></span>
                <span className="anchor" onClick={()=>copyLink(b.id)} title="Copy link"><Icon.Link/></span>
              </div>
              <div style={{fontSize:12, color:"#9fc0e0", marginBottom:6}}>COMMAND: {b.name}</div>
              <pre><code>{b.body}</code></pre>
            </div>
          );
          if (b.kind === "callout") return (
            <div key={b.id} id={b.id} className={`neon-callout p ${b.ctype}`}>
              <div className="p-toolbar">
                <span className="anchor" onClick={()=>copyBlock(b.id)} title="Copy"><Icon.Copy/></span>
                <span className="anchor" onClick={()=>copyLink(b.id)} title="Copy link"><Icon.Link/></span>
              </div>
              <strong style={{textTransform:"uppercase", fontSize:12, letterSpacing:.4}}>{b.ctype}</strong>
              <div style={{marginTop:6, whiteSpace:"pre-wrap"}}>{b.body}</div>
            </div>
          );
          return null;
        })}
      </article>
    </>
  );
}