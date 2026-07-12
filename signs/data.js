// Sign & Say — basic ASL / baby-sign words for kids.
// Every sign is a REAL signer video (embedded from the "Baby Sign Language"
// channel on YouTube), so kids see the true handshape and movement — not a
// made-up animation. IDs were pulled from babysignlanguage.com's dictionary,
// so each one is the correct video for that word.
window.SIGN = {
  ATTRIBUTION: 'Sign videos from the “Baby Sign Language” channel on YouTube.',
  CATS: [
    ['all','All'],
    ['greet','👋 Greetings'],
    ['family','👪 Family'],
    ['feel','😊 Feelings'],
    ['food','🍎 Food & Drink'],
    ['need','🙋 Needs & Play'],
    ['animal','🐶 Animals'],
    ['basics','⭐ Basics']
  ],
  WORDS: [
    { slug:'hello',     word:'Hello',     cat:'greet',  emoji:'👋', id:'xSYGBpalVTA' },
    { slug:'goodbye',   word:'Goodbye',   cat:'greet',  emoji:'👋', id:'Hbwtcoz_CBA' },
    { slug:'please',    word:'Please',    cat:'greet',  emoji:'🙏', id:'VBr_hnELRqM' },
    { slug:'thank-you', word:'Thank you', cat:'greet',  emoji:'🙏', id:'O5Tv5KT1VLs' },
    { slug:'sorry',     word:'Sorry',     cat:'greet',  emoji:'😔', id:'0W_Jbl7mxuU' },
    { slug:'yes',       word:'Yes',       cat:'greet',  emoji:'✅', id:'c0P1sW02-Aw' },
    { slug:'no',        word:'No',        cat:'greet',  emoji:'❌', id:'Li3gtgJyyII' },

    { slug:'mommy',     word:'Mommy',     cat:'family', emoji:'👩', id:'EVUezKawOqo' },
    { slug:'daddy',     word:'Daddy',     cat:'family', emoji:'👨', id:'dv_OgknPDMY' },
    { slug:'baby',      word:'Baby',      cat:'family', emoji:'👶', id:'dJgTfkJq9Q8' },
    { slug:'friend',    word:'Friend',    cat:'family', emoji:'🤝', id:'AdiVO_kuY9M' },

    { slug:'happy',     word:'Happy',     cat:'feel',   emoji:'😄', id:'pYM3Dx0Hx2w' },
    { slug:'sad',       word:'Sad',       cat:'feel',   emoji:'😢', id:'vxc_tWAWZJs' },
    { slug:'love',      word:'Love',      cat:'feel',   emoji:'❤️', id:'8wkiRL1aPrY' },
    { slug:'angry',     word:'Angry',     cat:'feel',   emoji:'😠', id:'HsjkKyXkYME' },
    { slug:'scared',    word:'Scared',    cat:'feel',   emoji:'😨', id:'bR5ODevHigQ' },
    { slug:'tired',     word:'Tired',     cat:'feel',   emoji:'😴', id:'jmcD_vGQ5c4' },

    { slug:'eat',       word:'Eat',       cat:'food',   emoji:'🍽️', id:'Z3rvyvZ1Dlk' },
    { slug:'drink',     word:'Drink',     cat:'food',   emoji:'🥤', id:'66Lu16dZ9zU' },
    { slug:'milk',      word:'Milk',      cat:'food',   emoji:'🍼', id:'FrNOUcs_lTk' },
    { slug:'water',     word:'Water',     cat:'food',   emoji:'💧', id:'aNz9H_rCdLw' },
    { slug:'more',      word:'More',      cat:'food',   emoji:'➕', id:'EVaRNgCUpGE' },
    { slug:'all-done',  word:'All done',  cat:'food',   emoji:'🛑', id:'HJ030U8QfU4' },
    { slug:'hungry',    word:'Hungry',    cat:'food',   emoji:'🍽️', id:'nzHSI34GIbQ' },
    { slug:'apple',     word:'Apple',     cat:'food',   emoji:'🍎', id:'Hup2DdvV2Bc' },
    { slug:'cookie',    word:'Cookie',    cat:'food',   emoji:'🍪', id:'GSRb-tAoFeM' },
    { slug:'banana',    word:'Banana',    cat:'food',   emoji:'🍌', id:'Szb5qbVJVX0' },

    { slug:'help',      word:'Help',      cat:'need',   emoji:'🆘', id:'HgRpq8gEnC8' },
    { slug:'want',      word:'Want',      cat:'need',   emoji:'🙋', id:'Jnb4IMwGuxw' },
    { slug:'stop',      word:'Stop',      cat:'need',   emoji:'✋', id:'TMrbC2flEVE' },
    { slug:'go',        word:'Go',        cat:'need',   emoji:'🏃', id:'fo86VzT9soc' },
    { slug:'play',      word:'Play',      cat:'need',   emoji:'🧸', id:'uNfPr5Tlauo' },
    { slug:'sleep',     word:'Sleep',     cat:'need',   emoji:'😴', id:'51zIxIxSZrc' },
    { slug:'book',      word:'Book',      cat:'need',   emoji:'📖', id:'GhmFpeEFMlg' },
    { slug:'bath',      word:'Bath',      cat:'need',   emoji:'🛁', id:'Iced6kuPOJA' },
    { slug:'potty',     word:'Potty',     cat:'need',   emoji:'🚽', id:'tjTAGoDiBQ0' },

    { slug:'dog',       word:'Dog',       cat:'animal', emoji:'🐶', id:'0EKiH2dtKxg' },
    { slug:'cat',       word:'Cat',       cat:'animal', emoji:'🐱', id:'QVTPOg_o5ng' },
    { slug:'bird',      word:'Bird',      cat:'animal', emoji:'🐦', id:'CG4XHxIM6tw' },
    { slug:'fish',      word:'Fish',      cat:'animal', emoji:'🐟', id:'ZwZe2JRqcRQ' },

    { slug:'name',      word:'Name',      cat:'basics', emoji:'🏷️', id:'GyKbGo-2YB0' },
    { slug:'good',      word:'Good',      cat:'basics', emoji:'👍', id:'4_gXibyFSGI' },
    { slug:'bad',       word:'Bad',       cat:'basics', emoji:'👎', id:'37lEc2r2gsw' },
    { slug:'hot',       word:'Hot',       cat:'basics', emoji:'🔥', id:'1WscDLitEwQ' },
    { slug:'cold',      word:'Cold',      cat:'basics', emoji:'❄️', id:'JwIyR8TEUUI' }
  ],

  // Basic "keyword" sentences — how kids really start communicating in sign:
  // sign the important words in order. Each entry lists word slugs to sign.
  SENTENCES: [
    { group:'Mealtime',   text:'More, please',        signs:['more','please'] },
    { group:'Mealtime',   text:'I want milk',          signs:['want','milk'] },
    { group:'Mealtime',   text:'Drink water, please',  signs:['drink','water','please'] },
    { group:'Mealtime',   text:'More cookie, please',  signs:['more','cookie','please'] },
    { group:'Mealtime',   text:'All done!',            signs:['all-done'] },
    { group:'Mealtime',   text:'I am hungry — eat',    signs:['hungry','eat'] },

    { group:'Needs',      text:'Help me, please',      signs:['help','please'] },
    { group:'Needs',      text:'Mommy, help!',         signs:['mommy','help'] },
    { group:'Needs',      text:'I want to play',       signs:['want','play'] },
    { group:'Needs',      text:'I am tired — sleep',   signs:['tired','sleep'] },
    { group:'Needs',      text:'Stop, please',         signs:['stop','please'] },
    { group:'Needs',      text:'I want a book',        signs:['want','book'] },

    { group:'Feelings',   text:'I love Mommy',         signs:['love','mommy'] },
    { group:'Feelings',   text:'I am happy',           signs:['happy'] },
    { group:'Feelings',   text:'Sorry, friend',        signs:['sorry','friend'] },
    { group:'Feelings',   text:'Good dog!',            signs:['good','dog'] },

    { group:'Manners',    text:'Hello, friend!',       signs:['hello','friend'] },
    { group:'Manners',    text:'Please and thank you', signs:['please','thank-you'] },
    { group:'Manners',    text:'Thank you!',           signs:['thank-you'] },
    { group:'Manners',    text:'Goodbye!',             signs:['goodbye'] }
  ]
};
