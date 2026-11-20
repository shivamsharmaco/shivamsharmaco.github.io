/* =====================================================================
   EVERYTHING IN MY ROOM LIVES HERE.
   Edit this file to add / remove books, games, movies, shows and music.
   No build step — save, commit, push, done.

   NOTE: the entries below are PLACEHOLDERS. Swap them for your own.

   Field cheat-sheet
   - rating: 1–5 (optional, use 0 or leave out to hide stars)
   - note:   one-line hot take (optional)
   - fav:    true to pin it with a little star (optional)
   ===================================================================== */

window.ROOM_DATA = {

  about: {
    name: "Shivam Sharma",
    hello: "Hey, I'm Shivam.",
    blurb: "Strategy & marketing by day, AI/ML tinkerer by night. This is my room — the stuff I read, play, watch and listen to when I'm not working.",
    email: "shivamsh4904@gmail.com",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/shivamsharmaco/" },
      { label: "My work / portfolio", url: "/work/" }
    ],
    // little facts that get pinned to the corkboard
    facts: [
      "Based in: somewhere with good coffee",
      "Currently learning: deep learning",
      "Night owl, obviously"
    ]
  },

  /* status: "read" | "reading" | "want" */
  books: [
    { title: "Atomic Habits",           author: "James Clear",         status: "read",    rating: 4, note: "Small things, compounding." },
    { title: "Sapiens",                 author: "Yuval Noah Harari",   status: "read",    rating: 5, note: "Rewired how I think about history.", fav: true },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman",     status: "read",    rating: 4 },
    { title: "The Psychology of Money", author: "Morgan Housel",       status: "read",    rating: 5 },
    { title: "Zero to One",             author: "Peter Thiel",         status: "read",    rating: 3 },
    { title: "Project Hail Mary",       author: "Andy Weir",           status: "read",    rating: 5, note: "Rocky. That's the review.", fav: true },
    { title: "Dune",                    author: "Frank Herbert",       status: "reading" },
    { title: "Deep Learning",           author: "Goodfellow, Bengio & Courville", status: "reading" },
    { title: "The Three-Body Problem",  author: "Liu Cixin",           status: "want" },
    { title: "Shoe Dog",                author: "Phil Knight",         status: "want" }
  ],

  /* status: "playing" | "finished" | "backlog" */
  games: [
    { title: "Red Dead Redemption 2", platform: "PC",     hours: 120, status: "finished", rating: 5, note: "Arthur deserved better.", fav: true },
    { title: "Elden Ring",            platform: "PC",     hours: 95,  status: "finished", rating: 5 },
    { title: "Hades",                 platform: "PC",     hours: 60,  status: "finished", rating: 5 },
    { title: "Valorant",              platform: "PC",     hours: 300, status: "playing",  rating: 4, note: "One more game. (lie)" },
    { title: "Stardew Valley",        platform: "PC",     hours: 80,  status: "playing",  rating: 4 },
    { title: "The Witcher 3",         platform: "PC",     hours: 110, status: "finished", rating: 5 },
    { title: "Baldur's Gate 3",       platform: "PC",     hours: 20,  status: "backlog" },
    { title: "Hollow Knight",         platform: "Switch", hours: 0,   status: "backlog" }
  ],

  /* type: "movie" | "show" */
  watching: [
    { title: "Interstellar",          year: 2014, type: "movie", rating: 5, note: "Cried at a bookshelf.", fav: true },
    { title: "The Social Network",    year: 2010, type: "movie", rating: 5 },
    { title: "Parasite",              year: 2019, type: "movie", rating: 5 },
    { title: "Spider-Verse",          year: 2018, type: "movie", rating: 5 },
    { title: "Whiplash",              year: 2014, type: "movie", rating: 4 },
    { title: "Succession",            year: 2018, type: "show",  rating: 5, note: "Corporate strategy, but make it Shakespeare.", fav: true },
    { title: "Breaking Bad",          year: 2008, type: "show",  rating: 5 },
    { title: "The Office",            year: 2005, type: "show",  rating: 4 },
    { title: "Arcane",                year: 2021, type: "show",  rating: 5 },
    { title: "Severance",             year: 2022, type: "show",  rating: 4, note: "Watching now." }
  ],

  music: [
    { title: "Random Access Memories", artist: "Daft Punk",       year: 2013, fav: true },
    { title: "Currents",               artist: "Tame Impala",     year: 2015 },
    { title: "Blonde",                 artist: "Frank Ocean",     year: 2016 },
    { title: "AM",                     artist: "Arctic Monkeys",  year: 2013 },
    { title: "After Hours",            artist: "The Weeknd",      year: 2020 },
    { title: "Discovery",              artist: "Daft Punk",       year: 2001 }
  ]
};
