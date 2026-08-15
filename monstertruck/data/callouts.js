// Every callable target in the game, plus every line the announcer can say.
// Classic script on purpose (window.* globals, like the other Learn Zone apps):
// the TTS batch generator and tools/check-callouts.mjs both read THIS file, so
// the voice clips on disk can never drift from what the game asks for.
//
// Each target: { id, vo, text, ... }
//   vo   — clip filename stem: audio/vo/<vo>.mp3
//   text — what the announcer says; doubles as the speechSynthesis fallback AND
//          the script the TTS batch reads, so clip and fallback always match.
//   confusable — same-category ids that look alike; never offered as distractors
//          until the target itself has been found a couple of times (mastery),
//          so early rounds can't ask a 3-year-old to tell b from d.

(function () {
  const shapes = [
    { id: 'circle',   vo: 'shape_circle',   text: 'Find the circle!' },
    { id: 'square',   vo: 'shape_square',   text: 'Find the square!',  confusable: ['diamond'] },
    { id: 'triangle', vo: 'shape_triangle', text: 'Find the triangle!' },
    { id: 'star',     vo: 'shape_star',     text: 'Find the star!' },
    { id: 'heart',    vo: 'shape_heart',    text: 'Find the heart!' },
    { id: 'diamond',  vo: 'shape_diamond',  text: 'Find the diamond!', confusable: ['square'] },
  ];

  const colors = [
    { id: 'red',    hex: '#e8442e', vo: 'color_red',    text: 'Drive through the red gate!',    confusable: ['orange'] },
    { id: 'blue',   hex: '#2f6fe0', vo: 'color_blue',   text: 'Drive through the blue gate!',   confusable: ['purple'] },
    { id: 'green',  hex: '#3fae4c', vo: 'color_green',  text: 'Drive through the green gate!' },
    { id: 'yellow', hex: '#f4c531', vo: 'color_yellow', text: 'Drive through the yellow gate!', confusable: ['orange'] },
    { id: 'purple', hex: '#8e4ec6', vo: 'color_purple', text: 'Drive through the purple gate!', confusable: ['blue'] },
    { id: 'orange', hex: '#f07820', vo: 'color_orange', text: 'Drive through the orange gate!', confusable: ['red', 'yellow'] },
  ];

  // Letters that mirror or flip into each other stay apart until mastered.
  const LOOKALIKES = {
    b: ['d', 'p', 'q'], d: ['b', 'p', 'q'], p: ['b', 'd', 'q'], q: ['b', 'd', 'p'],
    m: ['w'], w: ['m'], i: ['l'], l: ['i'], n: ['u'], u: ['n'],
  };
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('').map((c) => ({
    id: c,
    glyph: c.toUpperCase(),          // uppercase only: what preschool teaches first
    vo: 'letter_' + c,
    text: 'Find the letter ' + c.toUpperCase() + '!',
    confusable: LOOKALIKES[c] ?? [],
  }));

  const NUMBER_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const NUMBER_LOOKALIKES = { n1: ['n7'], n7: ['n1'], n3: ['n8'], n8: ['n3'], n6: ['n9'], n9: ['n6'] };
  const numbers = NUMBER_WORDS.map((word, i) => ({
    id: 'n' + (i + 1),
    glyph: String(i + 1),
    value: i + 1,                    // gates draw this many dots under the digit
    vo: 'number_' + (i + 1),
    text: 'Find the number ' + word + '!',
    confusable: NUMBER_LOOKALIKES['n' + (i + 1)] ?? [],
  }));

  window.CALLOUTS = { shapes, colors, letters, numbers };

  window.VO_EXTRA = {
    praise: [
      { vo: 'praise_1', text: 'You got it!' },
      { vo: 'praise_2', text: 'Awesome driving!' },
      { vo: 'praise_3', text: 'Way to go!' },
      { vo: 'praise_4', text: 'Monster job!' },
      { vo: 'praise_5', text: 'Yeah! That’s it!' },
      { vo: 'praise_6', text: 'Super!' },
    ],
    retry: [
      { vo: 'retry_1', text: 'Almost! Try another gate!' },
      { vo: 'retry_2', text: 'Not that one. Keep looking!' },
      { vo: 'retry_3', text: 'You can do it! Find it!' },
    ],
    intros: {
      shapes:  { vo: 'intro_shapes',  text: 'Let’s find shapes!' },
      colors:  { vo: 'intro_colors',  text: 'Let’s find colors!' },
      letters: { vo: 'intro_letters', text: 'Let’s find letters!' },
      numbers: { vo: 'intro_numbers', text: 'Let’s find numbers!' },
      mix:     { vo: 'intro_mix',     text: 'Let’s mix it up!' },
    },
    title:     { vo: 'title',      text: 'Monster Truck!' },
    airtime:   { vo: 'airtime',    text: 'Big air!' },
    fivestars: { vo: 'five_stars', text: 'Five stars! Fireworks!' },
    // Garage screen: tapping a truck says its color out loud.
    words: [
      { id: 'red',    vo: 'word_red',    text: 'Red!' },
      { id: 'blue',   vo: 'word_blue',   text: 'Blue!' },
      { id: 'green',  vo: 'word_green',  text: 'Green!' },
      { id: 'yellow', vo: 'word_yellow', text: 'Yellow!' },
    ],
  };
})();
