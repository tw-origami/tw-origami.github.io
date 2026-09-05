// The Learn Zone — books, options, weekly goals, and upcoming-lesson queues.
// Model: each subject has a weekly GOAL (min # of days) + OPTIONS the kid can pick each day.
//   - workbook:true  -> `queue` holds the upcoming workbook lessons; queue[0] is the "next up".
//   - alt[]          -> other ways to satisfy the subject (an app, a book, research).
// The kid checks whichever days they do it and picks any option that day. When they DO the
// workbook, it advances — tell Claude and he removes finished items from `queue` and bumps `page`.
window.BOOKS_META = { updated: "2026-08-22" };

// Reading list (books they can choose instead of the reading workbook). Add titles here.
window.READING_LIST = { ryland: [], reid: [] };

window.STUDENTS = [
  {
    id: "ryland", name: "Ryland", grade: "6th (grade 5–6 books)",
    subjects: [
      { subject: "Math", source: "Khan Academy", pace: "daily", goal: 4, workbook: false, page: null, last: null,
        alt: ["Khan Academy — next lesson", "Learn Zone (15 min)"] },
      { subject: "Reading", book: "Spectrum Reading 5", pace: "1 lesson", goal: 3, workbook: true, page: 90, last: 150,
        alt: ["A book from the reading list"],
        queue: [
          "“Behind the Scenes at the Zoo” — pp.90–91 + questions",
          "“An Unlikely Friendship” — pp.92–93 + questions",
          "“Cats, Cats, Cats” — pp.94–95 + questions",
          "“The Power of Cats” — pp.96–97 + questions",
          "“Sam Carmichael, Egyptologist” — pp.98–99 + questions" ] },
      { subject: "Grammar / Word Study", book: "Spectrum Word Study & Phonics 6", pace: "1–2 pages", goal: 3, workbook: true, page: 20, last: 150,
        alt: [],
        queue: [
          "Lesson 1.6 Ti and Ci — pp.20–21",
          "Review: Digraphs / Silent Consonants — pp.22–23",
          "Lesson 1.7 Vowel Sounds (ai, ay, ei, ey) — pp.24–25",
          "Lesson 1.8 Vowel Sounds (ee, ea, ie, ey) — pp.26–27",
          "Lesson 1.9 Vowel Sounds (ind, ild, igh) — pp.28–29" ] },
      { subject: "Spelling", book: "Spectrum Spelling 5", pace: "1–2 pages", goal: 3, workbook: true, page: 80, last: 106,
        goalText: "3 book + 3 Spell It", altLabel: "— plus —",
        alt: [{ label: "Learn Zone → Spell It", boxes: 3 }],
        queue: [
          "Review — pp.80–81",
          "Lesson 17 Prefixes (dis-, pre-, un-) — pp.82–83",
          "Lesson 18 Suffixes (-ion, -tion, -ation) — pp.86–87",
          "Review — pp.90–91",
          "Lesson 19 Rhyming Words — pp.92–93" ] },
      { subject: "Writing", book: "Spectrum Writing 5", pace: "1–2 pages", goal: 2, workbook: true, page: 72, last: 112,
        alt: [],
        queue: [
          "Ch.2 L6 Cause-and-Effect Organization — pp.72–73",
          "Ch.2 L7 News Report — pp.74–75",
          "Ch.2 L8 Comparisons — pp.76–77",
          "Ch.2 L9 Compare Two Objects — pp.78–79",
          "Ch.2 L10 Writing About Literature — pp.80–81" ] },
      { subject: "Typing", source: "Learn Zone → Typing Quest", pace: "~15 min", goal: 3, workbook: false, page: null, last: null,
        alt: ["Learn Zone → Typing Quest (15 min)"] },
      { subject: "Handwriting", book: "Zaner-Bloser Handwriting 3", pace: "1–2 pages", goal: 2, workbook: true, page: 127, last: 154,
        alt: [],
        queue: [
          "Review + Apply: Book Character/Summary — pp.127–129",
          "Review Uppercase + Evaluate — pp.130–131",
          "Practice + start Unit 4 — pp.132–136",
          "Unit 4: Cursive in the Real World — pp.136–139",
          "Apply: Narrative (Last Weekend, Story Retelling) — pp.140–142" ] },
      { subject: "Geography", book: "Spectrum Geography: World 6", pace: "1 topic", goal: 2, workbook: true, page: 28, last: 90,
        alt: ["Learn Zone (15 min)", "Research a country / topic"],
        queue: [
          "L5 The Roman Peace — pp.28–29",
          "L5 The Culture of Rome — pp.30–31",
          "L6 The Mongol Empire — pp.32–33",
          "L6 The Mongol Peace — pp.34–35",
          "L6 The Chinese Dynasties — pp.36–37" ] },
      { subject: "Science", book: "Spectrum Science 6", pace: "1 lesson", goal: 2, workbook: true, page: 44, last: 146,
        alt: ["Research a science topic"],
        queue: [
          "Ch.3 L3.1 Communities of Life — pp.44–45 + questions",
          "L3.2 Darwin’s Finches — pp.46–47 + questions",
          "L3.3 DNA: A Blueprint for Life — pp.48–49 + questions",
          "L3.4 Blowing in the Wind — pp.50–51 + questions",
          "L3.5 The Nitrogen Cycle — pp.54–55 + questions" ] }
    ]
  },
  {
    id: "reid", name: "Reid", grade: "3rd/4th (grade 3 books)",
    subjects: [
      { subject: "Math", source: "Khan Academy", pace: "daily", goal: 4, workbook: false, page: null, last: null,
        alt: ["Khan Academy — next lesson", "Learn Zone (15 min)"] },
      { subject: "Reading", book: "Scholastic Daily Word Ladders 4–6", pace: "1 ladder", goal: 3, workbook: true, page: 34, last: 106,
        alt: ["A book from the reading list"],
        queue: [
          "“Give a Dog a Bone” — p.34",
          "“Dinner’s Ready” — p.35",
          "“Happy Birthday” — p.36",
          "“Chew on This” — p.37",
          "“Peaks and Valleys” — p.38" ] },
      { subject: "Grammar / Word Study", book: "Spectrum Word Study & Phonics 3", pace: "1–2 pages", goal: 3, workbook: true, page: 87, last: 150,
        alt: [],
        queue: [
          "Review: Sounds of y & R-Controlled — pp.87–88",
          "Ch.2 L2.1 Base Words & Endings (-ed, -ing) — pp.89–90",
          "L2.2 Base Word Endings (-s, -es) — pp.91–92",
          "L2.3 Comparative Endings (-er, -est) — pp.93–94",
          "Review: Base Words and Endings — pp.95–96" ] },
      { subject: "Spelling", book: "Spectrum Spelling 3", pace: "1–2 pages", goal: 3, workbook: true, page: 104, last: 140,
        goalText: "3 book + 3 Spell It", altLabel: "— plus —",
        alt: [{ label: "Learn Zone → Spell It", boxes: 3 }],
        queue: [
          "Review — pp.104–105",
          "Lesson 23 Words with ld and ft — pp.106–109",
          "Lesson 24 /kw/ and /skw/ Sounds — pp.110–113",
          "Lesson 25 Silent k or w — pp.114–117",
          "Lesson 26 lf, mb, tch — pp.118–121" ] },
      { subject: "Writing", book: "Spectrum Writing 3", pace: "1–2 pages", goal: 2, workbook: true, page: 66, last: 120,
        alt: [],
        queue: [
          "Ch.2 L4 How to Do It — pp.66–67",
          "Ch.2 L5 Special Instructions — pp.68–69",
          "Ch.2 L6 Who Will Read It? — pp.70–71",
          "Ch.2 L7 How to Compare — pp.72–73",
          "Ch.2 L8 Compare It With a Venn — pp.74–75" ] },
      { subject: "Typing", source: "Learn Zone → Typing Quest", pace: "~15 min", goal: 3, workbook: false, page: null, last: null,
        alt: ["Learn Zone → Typing Quest (15 min)"] },
      { subject: "Geography", book: "Spectrum Geography: Communities 3", pace: "1 topic", goal: 2, workbook: true, page: 38, last: 90,
        alt: ["Learn Zone (15 min)", "Research a place / topic"],
        queue: [
          "L7 All about Lakes and Rivers — pp.38–39",
          "L7 Reading a River Map — pp.40–41",
          "L7 Learn about River Communities — pp.42–43",
          "L8 Where Early Native Americans Lived — pp.44–45",
          "L8 Use a Map (Movement of People) — pp.46–47" ] },
      { subject: "Science", book: "Spectrum Science 3", pace: "1 lesson", goal: 2, workbook: true, page: 108, last: 120,
        alt: ["Research a science topic"],
        queue: [
          "L7.3 A Story Worth Listening To — pp.108–109",
          "L7.4 Follow the Leader — pp.110–111",
          "L7.5 Mary Anning, Fossil Hunter — pp.112–113",
          "L7.6 Seeing the Stars in Ancient Egypt — pp.114–115",
          "L7.7 The World in Space — pp.116–117" ] }
    ]
  }
];

// convenience: upNext = next workbook item (or first option)
window.STUDENTS.forEach(s => s.subjects.forEach(sub => {
  sub.upNext = (sub.workbook && sub.queue && sub.queue[0]) || (sub.alt && sub.alt[0]) || "";
}));
