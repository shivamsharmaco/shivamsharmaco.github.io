(() => {
  "use strict";

  const D = window.ROOM_DATA || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const SVGNS = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ROOMS = {
    books:    { label: "Bookshelf",     sub: "books I've read",        bg: "#f3ead8" },
    games:    { label: "PC",            sub: "video games",            bg: "#120c22" },
    watching: { label: "TV",            sub: "movies & shows",         bg: "#0b0d12" },
    music:    { label: "Record player", sub: "music on repeat",        bg: "#1d1916" },
    about:    { label: "Corkboard",     sub: "about me & contact",     bg: "#b98a5a" }
  };

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const stars = (n) => n ? `<span class="stars" aria-label="${n} out of 5">${"★".repeat(n)}<span class="off">${"★".repeat(5 - n)}</span></span>` : "";
  const PALETTE = ["#e2563d", "#f0c04a", "#3e8f8a", "#5c7fc4", "#a3557a", "#6aa863", "#d9824a", "#7a5fb0", "#2f6d8f", "#c9a46b", "#b8423a", "#3f4f7a"];
  const pick = (s, arr = PALETTE, salt = 0) => arr[(hash(s) + salt) % arr.length];

  /* ---------- room decoration ---------- */
  function buildSpines() {
    const g = $("#book-spines");
    if (!g) return;
    const r = rng(42);
    const shelves = [[188, 296], [310, 418], [432, 540], [556, 680]];
    const cols = ["#e2563d", "#f0c04a", "#3e8f8a", "#5c7fc4", "#a3557a", "#e9e1d4", "#6aa863", "#d9824a", "#7a5fb0", "#2f6d8f", "#c9a46b"];
    shelves.forEach(([top, bottom], si) => {
      let x = 90;
      const end = 320;
      let leaned = false;
      while (x < end - 8) {
        const w = 10 + Math.floor(r() * 14);
        if (x + w > end) break;
        const h = (bottom - top) * (0.62 + r() * 0.34);
        const col = cols[Math.floor(r() * cols.length)];
        // occasional gap with a leaning book or small object
        if (!leaned && si % 2 === 0 && r() < 0.09 && x > 150) {
          leaned = true;
          const lh = (bottom - top) * 0.8;
          const rect = document.createElementNS(SVGNS, "rect");
          rect.setAttribute("x", x + 4); rect.setAttribute("y", bottom - lh);
          rect.setAttribute("width", 14); rect.setAttribute("height", lh);
          rect.setAttribute("fill", col);
          rect.setAttribute("transform", `rotate(14 ${x + 4} ${bottom})`);
          g.appendChild(rect);
          x += 30;
          continue;
        }
        if (si === 3 && x > 230 && x < 250) {
          // a horizontal stack on the bottom shelf
          let y = bottom;
          for (let i = 0; i < 4; i++) {
            const bh = 10 + r() * 6, bw = 58 + r() * 14;
            const rect = document.createElementNS(SVGNS, "rect");
            rect.setAttribute("x", x + (r() * 6)); rect.setAttribute("y", y - bh);
            rect.setAttribute("width", bw); rect.setAttribute("height", bh);
            rect.setAttribute("fill", cols[Math.floor(r() * cols.length)]);
            g.appendChild(rect); y -= bh;
          }
          x += 80;
          continue;
        }
        const rect = document.createElementNS(SVGNS, "rect");
        rect.setAttribute("x", x); rect.setAttribute("y", bottom - h);
        rect.setAttribute("width", w - 1.5); rect.setAttribute("height", h);
        rect.setAttribute("fill", col);
        g.appendChild(rect);
        if (r() < 0.6) {
          const band = document.createElementNS(SVGNS, "rect");
          band.setAttribute("x", x); band.setAttribute("y", bottom - h + 8 + r() * 10);
          band.setAttribute("width", w - 1.5); band.setAttribute("height", 3);
          band.setAttribute("fill", "rgba(0,0,0,.25)");
          g.appendChild(band);
        }
        x += w;
      }
    });
  }

  function buildFairyLights() {
    const path = $(".fairy path");
    const g = $("#fairy-bulbs");
    if (!path || !g) return;
    const len = path.getTotalLength();
    const cols = ["#ffd27a", "#ff9db5", "#9fe3ff", "#c6ff9f"];
    for (let i = 1; i < 30; i++) {
      const p = path.getPointAtLength((len * i) / 30);
      const c = document.createElementNS(SVGNS, "circle");
      c.setAttribute("cx", p.x); c.setAttribute("cy", p.y + 6); c.setAttribute("r", 5);
      c.setAttribute("fill", cols[i % cols.length]);
      c.style.animationDelay = `${(i % 7) * 0.4}s`;
      g.appendChild(c);
    }
  }

  function clockAndSky() {
    const el = $("#desk-clock");
    const tick = () => {
      const d = new Date();
      if (el) el.textContent = `${String(d.getHours()).padStart(2, "0")}${d.getSeconds() % 2 ? " " : ":"}${String(d.getMinutes()).padStart(2, "0")}`;
      const h = d.getHours();
      const sky = h >= 7 && h < 17 ? "day" : (h >= 17 && h < 20) || (h >= 5 && h < 7) ? "dusk" : "night";
      document.body.dataset.sky = sky;
    };
    tick();
    setInterval(tick, 1000);
    const greet = $("#room-greeting");
    const h = new Date().getHours();
    if (greet) greet.textContent = h < 5 ? "up late too? click around." : h < 12 ? "good morning — click around." : h < 18 ? "come in, click around." : "evening! click around.";
  }

  /* ---------- floating labels ---------- */
  const labelsEl = $("#labels");
  const tag = document.createElement("div");
  tag.className = "tag";
  labelsEl.appendChild(tag);

  function placeLabel(obj) {
    const hit = obj.querySelector("rect");
    const scene = $("#scene").getBoundingClientRect();
    const r = hit.getBoundingClientRect();
    const key = obj.dataset.room;
    tag.innerHTML = `<b>${ROOMS[key].label}</b><span>${ROOMS[key].sub}</span>`;
    tag.style.left = `${r.left - scene.left + r.width / 2}px`;
    tag.style.top = `${r.top - scene.top}px`;
    tag.classList.add("show");
  }
  $$(".hotspot").forEach((obj) => {
    obj.addEventListener("mouseenter", () => placeLabel(obj));
    obj.addEventListener("focus", () => placeLabel(obj));
    obj.addEventListener("mouseleave", () => tag.classList.remove("show"));
    obj.addEventListener("blur", () => tag.classList.remove("show"));
  });

  /* ---------- zoom transitions ---------- */
  const scene = $("#scene");
  const wash = $("#wash");
  const body = document.body;
  const DUR = reduceMotion ? 0 : 1100;
  let current = null;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function zoomTransform(key) {
    const obj = document.getElementById(`obj-${key}`);
    const hit = obj.querySelector("rect");
    const prev = scene.style.transform;
    scene.style.transition = "none";
    scene.style.transform = "none";
    const s = scene.getBoundingClientRect();
    const r = hit.getBoundingClientRect();
    scene.style.transform = prev;
    void scene.offsetWidth;
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.min(vw / r.width, vh / r.height) * 1.25;
    const cx = r.left + r.width / 2 - s.left;
    const cy = r.top + r.height / 2 - s.top;
    const tx = vw / 2 - s.left - scale * cx;
    const ty = vh / 2 - s.top - scale * cy;
    return `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function showPage(key, animate) {
    const page = document.getElementById(`page-${key}`);
    page.hidden = false;
    page.scrollTop = 0;
    if (animate) {
      requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add("in")));
    } else {
      page.classList.add("in");
    }
    body.classList.remove("at-room");
    body.classList.add("at-page");
    document.title = `${ROOMS[key].label} · Shivam's Room`;
    onEnter[key]?.();
    later(() => $(".back", page)?.focus({ preventScroll: true }), animate ? 450 : 0);
  }

  function hidePage(key) {
    const page = document.getElementById(`page-${key}`);
    page.classList.remove("in");
    return page;
  }

  function open(key, animate) {
    clearTimers();
    tag.classList.remove("show");
    const obj = document.getElementById(`obj-${key}`);
    $$(".hotspot.target").forEach((o) => o.classList.remove("target"));
    obj.classList.add("target");
    wash.style.background = ROOMS[key].bg;
    body.classList.add("zooming");
    body.dataset.room = key;

    if (!animate || reduceMotion) {
      scene.style.transition = "none";
      scene.style.transform = zoomTransform(key);
      wash.classList.add("on");
      showPage(key, false);
      return;
    }
    scene.style.transition = `transform ${DUR}ms cubic-bezier(.7,0,.2,1)`;
    scene.style.transform = zoomTransform(key);
    later(() => wash.classList.add("on"), DUR * 0.55);
    later(() => showPage(key, true), DUR * 0.85);
  }

  function close(from, animate) {
    clearTimers();
    const page = hidePage(from);
    body.classList.remove("at-page");
    body.classList.add("at-room");
    document.title = "Shivam's Room";
    const finish = () => {
      page.hidden = true;
      body.classList.remove("zooming");
      delete body.dataset.room;
      $$(".hotspot.target").forEach((o) => o.classList.remove("target"));
      const obj = document.getElementById(`obj-${from}`);
      obj?.focus({ preventScroll: true });
    };
    if (!animate || reduceMotion) {
      scene.style.transition = "none";
      scene.style.transform = "none";
      wash.classList.remove("on");
      finish();
      return;
    }
    later(() => {
      wash.classList.remove("on");
      scene.style.transition = `transform ${DUR}ms cubic-bezier(.6,0,.25,1)`;
      scene.style.transform = "none";
    }, 220);
    later(finish, 220 + DUR);
  }

  function switchTo(from, to) {
    clearTimers();
    const p = hidePage(from);
    p.hidden = true;
    open(to, false);
  }

  function parse() {
    const m = location.hash.match(/^#\/([\w-]+)/);
    return m && ROOMS[m[1]] ? m[1] : null;
  }

  let navigatedFromRoom = false;
  function route(first) {
    const key = parse();
    if (key === current) return;
    if (key && !current) open(key, !first);
    else if (!key && current) { close(current, true); navigatedFromRoom = false; }
    else if (key && current) switchTo(current, key);
    current = key;
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#/"]');
    if (!a) return;
    if (!current) { navigatedFromRoom = true; return; }
    // page → page: replace so "back" still lands in the room
    e.preventDefault();
    location.replace(a.getAttribute("href"));
  });
  $$(".back").forEach((b) => b.addEventListener("click", goBack));
  function goBack() {
    if (navigatedFromRoom && history.length > 1) { navigatedFromRoom = false; history.back(); }
    else location.hash = "";
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && current) goBack(); });
  window.addEventListener("hashchange", () => route(false));
  window.addEventListener("resize", () => {
    if (current) { scene.style.transition = "none"; scene.style.transform = zoomTransform(current); }
  });

  /* ---------- filters ---------- */
  function filters(forKey, options, onChange) {
    const wrap = $(`[data-filter-for="${forKey}"]`);
    wrap.innerHTML = options.map((o, i) =>
      `<button type="button" role="tab" aria-selected="${i === 0}" data-v="${o.v}">${esc(o.label)}<span class="count">${o.count}</span></button>`
    ).join("");
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("button", wrap).forEach((x) => x.setAttribute("aria-selected", x === b));
      onChange(b.dataset.v, b);
    });
  }

  /* ---------- BOOKS ---------- */
  function renderBooks() {
    const books = D.books || [];
    const grid = $("#book-grid");
    const read = books.filter((b) => b.status === "read").length;
    const reading = books.filter((b) => b.status === "reading");
    $("#books-stat").innerHTML = `${read} finished${reading.length ? ` · currently reading <em>${esc(reading[0].title)}</em>` : ""}.`;
    const STATUS = { read: "Read", reading: "Reading now", want: "Up next" };
    const draw = (f) => {
      const list = books.filter((b) => f === "all" || b.status === f);
      grid.innerHTML = list.map((b, i) => {
        const c = pick(b.title), c2 = pick(b.title, PALETTE, 5);
        const style = hash(b.author) % 3;
        return `<li class="book" style="--c:${c};--c2:${c2};--i:${i}">
          <div class="cover s${style}">
            <span class="cover-art"></span>
            <span class="cover-title">${esc(b.title)}</span>
            <span class="cover-author">${esc(b.author)}</span>
            ${b.fav ? '<span class="fav" title="favourite">★</span>' : ""}
          </div>
          <div class="book-meta">
            <span class="badge b-${b.status}">${STATUS[b.status] || ""}</span>
            ${stars(b.rating)}
            ${b.note ? `<p class="note">“${esc(b.note)}”</p>` : ""}
          </div>
        </li>`;
      }).join("") || `<li class="empty">Nothing here yet.</li>`;
    };
    const n = (s) => books.filter((b) => b.status === s).length;
    filters("books", [
      { v: "all", label: "All", count: books.length },
      { v: "read", label: "Read", count: n("read") },
      { v: "reading", label: "Reading", count: n("reading") },
      { v: "want", label: "Want to read", count: n("want") }
    ], draw);
    draw("all");
  }

  /* ---------- GAMES ---------- */
  function renderGames() {
    const games = D.games || [];
    const list = $("#game-list");
    const total = games.reduce((a, g) => a + (g.hours || 0), 0);
    const max = Math.max(1, ...games.map((g) => g.hours || 0));
    $("#games-stat").textContent = `${games.length} game(s) found · ${total.toLocaleString()} hours of my life, well spent.`;
    const STATUS = { playing: "PLAYING", finished: "BEATEN", backlog: "BACKLOG" };
    const draw = (f) => {
      const rows = games.filter((g) => f === "all" || g.status === f).sort((a, b) => (b.hours || 0) - (a.hours || 0));
      list.innerHTML = rows.map((g, i) => `
        <li class="game" style="--i:${i};--c:${pick(g.title)}">
          <span class="g-icon" aria-hidden="true">${esc(g.title.replace(/^the\s+/i, "")[0] || "?")}</span>
          <span class="g-main">
            <span class="g-title">${esc(g.title)}${g.fav ? ' <span class="g-fav">♥</span>' : ""}</span>
            <span class="g-sub">${esc(g.platform || "")}${g.note ? ` — ${esc(g.note)}` : ""}</span>
            <span class="g-bar"><span style="width:${((g.hours || 0) / max) * 100}%"></span></span>
          </span>
          <span class="g-side">
            <span class="g-hours">${g.hours || 0}h</span>
            <span class="g-status s-${g.status}">[${STATUS[g.status] || ""}]</span>
            ${g.rating ? `<span class="g-rating">${"■".repeat(g.rating)}<span class="off">${"■".repeat(5 - g.rating)}</span></span>` : ""}
          </span>
        </li>`).join("") || `<li class="empty">No games found.</li>`;
    };
    const n = (s) => games.filter((g) => g.status === s).length;
    filters("games", [
      { v: "all", label: "ALL", count: games.length },
      { v: "playing", label: "PLAYING", count: n("playing") },
      { v: "finished", label: "BEATEN", count: n("finished") },
      { v: "backlog", label: "BACKLOG", count: n("backlog") }
    ], draw);
    draw("all");
  }
  function typeCommand() {
    const el = $("#games-typed");
    const cmd = "dir /games /sort:hours";
    el.textContent = "";
    if (reduceMotion) { el.textContent = cmd; return; }
    let i = 0;
    const step = () => { el.textContent = cmd.slice(0, ++i); if (i < cmd.length) later(step, 35 + Math.random() * 40); };
    later(step, 300);
  }

  /* ---------- WATCHING ---------- */
  function renderWatching() {
    const all = D.watching || [];
    const grid = $("#poster-grid");
    const page = $("#page-watching");
    const draw = (f) => {
      const list = all.filter((w) => f === "all" || w.type === f);
      grid.innerHTML = list.map((w, i) => {
        const c = pick(w.title), c2 = pick(w.title, PALETTE, 3);
        return `<li class="poster" style="--c:${c};--c2:${c2};--i:${i}">
          <div class="poster-art p${hash(w.title) % 3}">
            <span class="p-type">${w.type === "show" ? "SERIES" : "FILM"}</span>
            <span class="p-title">${esc(w.title)}</span>
            <span class="p-year">${esc(w.year || "")}</span>
            ${w.fav ? '<span class="fav">★</span>' : ""}
          </div>
          <div class="poster-meta">${stars(w.rating)}${w.note ? `<p class="note">${esc(w.note)}</p>` : ""}</div>
        </li>`;
      }).join("") || `<li class="empty">No signal.</li>`;
    };
    const n = (t) => all.filter((w) => w.type === t).length;
    filters("watching", [
      { v: "all", label: "CH 01 · Everything", count: all.length },
      { v: "movie", label: "CH 02 · Movies", count: n("movie") },
      { v: "show", label: "CH 03 · Shows", count: n("show") }
    ], (v, b) => {
      $("#channel").textContent = b.textContent.slice(0, 5);
      page.classList.remove("zap"); void page.offsetWidth; page.classList.add("zap");
      later(() => draw(v), reduceMotion ? 0 : 140);
    });
    draw("all");
  }

  /* ---------- MUSIC ---------- */
  function renderMusic() {
    const crate = $("#crate");
    crate.innerHTML = (D.music || []).map((m, i) => {
      const c = pick(m.title), c2 = pick(m.artist, PALETTE, 2), c3 = pick(m.title + m.artist, PALETTE, 7);
      return `<li class="album" style="--c:${c};--c2:${c2};--c3:${c3};--i:${i}" tabindex="0">
        <div class="disc" aria-hidden="true"><span style="background:${c3}"></span></div>
        <div class="sleeve a${hash(m.title) % 4}">
          <span class="sleeve-art"></span>
          ${m.fav ? '<span class="fav">★</span>' : ""}
        </div>
        <p class="a-title">${esc(m.title)}</p>
        <p class="a-artist">${esc(m.artist)}${m.year ? ` · ${esc(m.year)}` : ""}</p>
      </li>`;
    }).join("");
  }

  /* ---------- ABOUT ---------- */
  function renderAbout() {
    const a = D.about || {};
    const reading = (D.books || []).find((b) => b.status === "reading");
    const playing = (D.games || []).find((g) => g.status === "playing");
    const watching = (D.watching || []).find((w) => /watching now/i.test(w.note || "")) || (D.watching || [])[0];
    const initials = (a.name || "S").split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
    $("#board").innerHTML = `
      <div class="pinned polaroid" style="--r:-4deg"><i class="pin"></i>
        <div class="photo"><span>${esc(initials)}</span></div>
        <p class="hand">me :)</p>
      </div>
      <div class="pinned paper hello" style="--r:1.5deg"><i class="pin"></i>
        <h1 id="about-title" class="hand big">${esc(a.hello || "Hi!")}</h1>
        <p>${esc(a.blurb || "")}</p>
      </div>
      <div class="pinned sticky yellow" style="--r:3deg"><i class="pin"></i>
        <p class="hand label">currently…</p>
        <ul class="hand">
          ${reading ? `<li>📖 reading <b>${esc(reading.title)}</b></li>` : ""}
          ${playing ? `<li>🎮 playing <b>${esc(playing.title)}</b></li>` : ""}
          ${watching ? `<li>📺 watching <b>${esc(watching.title)}</b></li>` : ""}
          ${(D.music || [])[0] ? `<li>🎧 spinning <b>${esc(D.music[0].title)}</b></li>` : ""}
        </ul>
      </div>
      <div class="pinned sticky pink" style="--r:-2.5deg"><i class="pin"></i>
        <p class="hand label">random facts</p>
        <ul class="hand">${(a.facts || []).map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      </div>
      <div class="pinned card contact" style="--r:-1deg"><i class="pin"></i>
        <p class="hand label">say hi</p>
        ${a.email ? `<a class="link" href="mailto:${esc(a.email)}">${esc(a.email)}</a>` : ""}
        ${(a.links || []).map((l) => `<a class="link" href="${esc(l.url)}"${/^https?:/.test(l.url) ? ' target="_blank" rel="me noopener noreferrer"' : ""}>${esc(l.label)} →</a>`).join("")}
      </div>
      <div class="pinned ticket" style="--r:4deg"><i class="pin"></i>
        <p class="hand">explore the room:</p>
        <div class="ticket-links">
          <a href="#/books">books</a><a href="#/games">games</a><a href="#/watching">movies &amp; tv</a><a href="#/music">music</a>
        </div>
      </div>`;
  }

  const onEnter = {
    games: typeCommand
  };

  /* ---------- boot ---------- */
  buildSpines();
  buildFairyLights();
  clockAndSky();
  renderBooks();
  renderGames();
  renderWatching();
  renderMusic();
  renderAbout();

  // centre the room horizontally on narrow (portrait) screens
  const scroller = $("#room-scroller");
  const centre = () => { scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2; };
  centre();
  setTimeout(() => scroller.addEventListener("scroll", () => body.classList.add("scrolled"), { once: true, passive: true }), 300);

  route(true);
  requestAnimationFrame(() => body.classList.add("ready"));
})();
