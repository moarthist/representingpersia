// The twelve plates of the room: geometry, photograph, title, text and reference.
//
// A plate with  src  shows the scan inside its frame. A plate with  src: null  stays an empty frame
// (its title and text can still be read by clicking it). To hang a scan later: copy the file into
// assets/photos/ and set  src: 'assets/photos/plate-03.jpg'.  Frames resize to the picture's proportions
// if you also set  ar  (width divided by height).
//
// Layout: each row is placed by `row()` below (wall, centre, height, gap); frame sizes follow `ar`.

const SHELF = 'Library of the National Institute for Art History (INHA), Jacques Doucet collections, Paris';
const JD = 'Jane Dieulafoy and Marcel Dieulafoy';
const JDL = 'Jane Dieulafoy, Marcel Dieulafoy, and Louis Lapicque';
const ref = (fig, title, who, vol, view, nd = false) =>
  `Fig. ${fig} ${title}. ${who}, Albums Dieulafoy: Archaeological Excavations in Persia, vol. ${vol}, ${nd ? 'n.d., ' : ''}photograph, platinum print, ${SHELF}, shelf mark 4 PHOT 018 (${vol}), View ${view}.`;

const PLATES = [
  {
    id: 1, ar: 1163 / 1600, src: 'assets/photos/plate-01.jpg',
    title: 'Portrait of a young woman from Susa',
    text: ['A young local woman looks into the camera lens with a gentle smile. While photographing her always took a long time, and she looked tired and sullen, some images show a smile and peace. Her curly hair peeks out from under her turban. she is also wearing a nose ring, called a Khuzameh. A traditional bracelet or bangle is also visible on her right hand.'],
    ref: ref('2.29', 'Portrait of a young woman from Susa', JD, 5, 43, true),
  },
  {
    id: 2, ar: 1600 / 1204, src: 'assets/photos/plate-02.jpg',
    title: 'Arab women in tribal community of Beni Laam',
    text: [
      'In this photo, there is not only one person but a group of Beni Laam women. They mostly wear dark clothes and gaze at the photographer with curious eyes. The clothes are long enough to cover the entire body, including the hair. Similar outfits imply belonging to a tribal community. Women are in different postures, especially the one seated on a log with distinctive jewellery. On the right, men and children appear in the picture. Through an orientalist lens, this photo frames Arab communities in southern Persia, which host various tribes and minorities.',
      'Jane writes about her experience with the Beni Laam tribe: In short, the men and women sat in a circle around the fire that had been prepared to warm us; in the light of the smoky hearth, I could clearly admire the beautiful scene unfolding before me. Indeed, these primitive women—with their robust physiques, striking features, and braided hair cascading over their chests—were truly worthy of admiration, and I found such delight in watching them that I forgot my own ailment (Dieulafoy 1992, 669).',
    ],
    ref: ref('2.47', 'Arab women in tribal community of Beni Laam', JD, 5, 55),
  },
  {
    id: 3, ar: 0.75, src: null,
    title: 'Zoroastrian housewife with her son',
    text: ['A Zoroastrian woman wearing loose, patterned clothing and holding her child\'s hand. The intricate patterns and geometric designs on her trousers draw the viewer\'s attention. The Zoroastrian population is primarily concentrated in central Iran, particularly in cities such as Yazd and Kerman. Although the coexistence of the Zoroastrian community with Muslims has presented challenges, these residents have long been held in high regard.'],
    ref: ref('2.37', 'Zoroastrian housewife with her son', JD, 1, 55),
  },
  {
    id: 4, ar: 1076 / 1399, src: 'assets/photos/plate-04.jpg',
    title: 'Portrait of Bibi-Dordoun',
    text: [
      'The woman sitting with dignity and smiling at the photographer\'s camera is named Bibi Dordoun, as written in the description. She wears a scarf sewn in the local style typical of southwestern Iran. Sequins or coins are sewn into it for decoration. She wears a net-fabric shawl with embedded pearls and jewelry around her neck, which draw attention and suggest she is in a good financial situation. She wears a nose ring, as is customary for women in Khuzestan. She is wearing a flowered dress and skirt made of expensive fabrics and perhaps (silk or velvet) with a large flower design. The gold bangles and bracelets suggest elegance and wealth, helping portray a wealthy woman in Qajar-era local society.',
      'Jane Dieulafoy writes about Bibi Dordoun: In Dezful, we encountered a beautiful woman with white skin, shiny black hair down to her shoulders. She has teeth like pearls, a red blossom of pomegranate as lips. She wears a floral-patterned taffeta dress and a Kashmiri Termeh hat. A delicate silk scarf is tied around her neck, and jeweled gold rings hang from her nostrils. A gold-rimmed shell amulet drapes from her neck, while a magnificent armband adorns her arm, and bracelets of amber and red coral encircle her wrists. She wears lovely pearl-coloured stockings, with ruby-like tassels resting upon her insteps (Dieulafoy 1992, 687).',
    ],
    ref: ref('2.33', 'Portrait of Bibi-Dordoun', JDL, 4, 69),
  },
  {
    id: 5, ar: 1600 / 1187, src: 'assets/photos/plate-05.jpg',
    title: 'Grocer in Bazaar',
    text: [
      'A grocer surrounded by containers has put a long straw on his lips, most probably using a hookah. The products are sold in bulk, not in packages. That is why many jars, boxes, vases, and trays contain groceries like grains, oil, or spices. Identifying the products is not easy, but it indicates that the space is tight. The seller is sitting among the containers, wearing a turban and a long cape.',
      'The jars sit on shelves in diverse shapes, suggesting each one is meant to hold a specific material. These jars, with decorative motifs, are durable, affordable, and protected from direct sunlight. The glass bottles contain liquids like rose water, medicine, vinegar and other common fluid materials.',
    ],
    ref: ref('2.53', 'Grocer in bazar', JDL, 3, 23),
  },
  {
    id: 6, ar: 0.75, src: null,
    title: 'Portrait of the Dr. Olding’s children nanny',
    text: ['A close-up portrait of a young woman with a strong build and a very determined and dignified posture (Fig. 2.31). She tilts her head back and stares intently to the right of the frame. Her hair is delicately braided, with bangs at the front. Her long, thick braid is striking. The white skirt contrasts beautifully with the black hair. According to the photographer, she is the nanny of Dr. Odling\'s children. One area of employment for women was domestic service under various titles such as Dadeh (nanny/maid), Gis-sefid (matriarchal servant), and Dayeh (wet nurse), which were customary among wealthy families.'],
    ref: ref('2.31', 'Portrait of the Dr. Olding’s children nanny', JD, 2, 23, true),
  },
  {
    id: 7, ar: 0.75, src: null,
    title: 'Portrait of Mirza Nazim Ghaffary and his wives',
    text: ['Mirza Nazim Ghaffary is standing behind his wives. Three women sit on chairs, wearing elegant dresses, white stockings, and floral tiaras. Mirza, originally a title for a literate or wealthy person, with a distinctive mustache, looks proudly to his left. Jane Dieulafoy has written that the women are his wives. Their clothes are also inspired by Western fashion.'],
    ref: ref('2.3', 'Portrait of Mirza Nazim Ghaffary and his wives', JD, 1, 47),
  },
  {
    id: 8, ar: 0.75, src: null,
    title: 'Saint Catherine sisters',
    text: ['Dieulafoy photographed nuns wearing long black outfits during a religious event. They cover their bodies entirely, including their heads. Some are holding a wooden stick in their hands. The writer mentions only the name ‘Djoulfa’ as the location, which ambiguously refers to Djoulfa in the northwestern region or the quartier in Isfahan, ‘New Djoulfa’. In fact, the building of the Saint Catherine convent (location of this photo) still exists in the Djoulfa neighborhood in Isfahan. It was established in 1623 with the participation of three immigrant nuns called Urupsana, Taguhi, and Hr̥ip‘simē, who organized monastic life according to Armenian rules.'],
    ref: ref('2.40', 'Saint Catherine sisters, Djoulfa', JD, 2, 17),
  },
  {
    id: 9, ar: 0.75, src: null,
    title: 'Niece and nephew of the Shah',
    text: ['The portrait of two children from the Qajar nobility, who are relatives of Naser-e-Din Shah, is also remarkable in its kind. On the left, the little girl stares at the camera with half-open eyes from fatigue. She wears a crown of flowers, a makeup item of women of that period, and a (Tcharqad) that is exquisite and embroidered. She is also wearing a lot of jewellery. She also has a black spot between her eyebrows, which is one of the signs of makeup. On the right, a boy in a luxurious coat holds the girl by the shoulder, revealing his full, thick hair. The clothes of these two children are sewn with great delicacy, demonstrating the special art of weaving textiles during the Qajar period. The harmony between the richly patterned clothes and the carpet is spectacular.'],
    ref: ref('2.11', 'Niece and nephew of the Shah', JD, 1, 44),
  },
  {
    id: 10, ar: 1097 / 1600, src: 'assets/photos/plate-10.jpg',
    title: 'Veiled woman from Shiraz',
    text: ['One traditional garment worn by women during the Qajar period was the chador. A long, one-piece piece of cloth with sewn edges that women wore outside the home from head to ankle. Depending on the financial means of the wearer, chadors were simple, sometimes patterned, or made of exquisite fabric. Unlike earlier examples, this photo was taken in a studio and shows a woman in traditional Qajar clothing outside domestic area. One of the most striking features of the photo is the long, pleated trousers worn by women of that period, called Chaqchur. Persian literature says that wearing a Chador and Chaqchur at the same time means being ready to go out. This implicit reference in Persian signals choosing these two items of clothing when going out, and it has been used so often that it has become an idiom in everyday language.'],
    ref: ref('2.20', 'Veiled woman from Shiraz', JD, 2, 91),
  },
  {
    id: 11, ar: 861 / 1348, src: 'assets/photos/plate-11.jpg',
    title: 'Sheikh Miz\'al ibn Jaber (Local governor in south of Iran)',
    text: [
      'Sheikh Miz’al, looking powerful, sits on a wooden chair on the porch of a building. He wears a turban and a luxurious, gold-embroidered dress with traditional designs. A dark ‘Aba (cloak) is thrown over his shoulders. Shiny leather shoes are also noticeably visible in the photo. This porch, formed by columns and dry leaves, is a typical example of a government building in southern regions.',
      'Jane writes that Sheikh Miz\'al is an intelligent man whom the Arab tribes obey; although he has taken multiple wives, he has no children to succeed him. His brother is Sheikh Khaza\'al, and both are sons of Sheikh Jaber (Dieulafoy 1992, 548). In 18th century Persia, the country\'s regions were governed along tribal lines. Even with the king in the capital, local rulers derived their authority from their clans and constantly struggled to maintain their power. Because Arab tribes in the region bordering the Ottoman Empire traded and maintained connections via sea routes, they amassed considerable wealth. Sheikh Miz\'al\'s splendid attire, polished shoes, and well-groomed appearance reflect this status.',
    ],
    ref: ref('2.8', 'Sheikh Miz\'al ibn Jaber (Local governor in south of Iran)', JDL, 4, 59),
  },
  {
    id: 12, ar: 957 / 1566, src: 'assets/photos/plate-12.jpg',
    title: 'Torkan Khanoum holding a narghile in hand',
    text: [
      'Torkan Khanoum, holding a hookah in her left hand, straw on her lips, and staring to the left, depicts a powerful, wealthy person. An opulent headscarf with embroidered motifs, probably golden, is not a common item of clothing. In fact, it is intended to show off the person\'s social status. The narghile is carefully placed on a small table. The short skirt and white socks evoke an imitation of European fashion, symbolizing modernization even on a small scale. Ordinary people do not have this concern, and this indicates the wealth and power at her disposal.',
      'Travel to Europe was a vacation for the wealthy, and not everyone cared about adopting the new styles prevalent among Europeans. If someone adopted a look that mimicked Western lifestyles, their primary aim was to flaunt their belonging to the wealthy class. Consequently, they adopted that style in an absolutely artificial manner, without regard for whether it actually suited their way of life. In their view, the most prized souvenirs and gifts were goods imported into Iran from the West. Thus, when it came to having a photograph taken, what better appearance to adopt than the one prevalent in the West.',
      'Jane writes in her travelogue that, upon entering the house, Torkan Khanoum welcomed her and modestly apologized for not having a luxurious house. Then she clapped her hands to call maids to enter to help the guests. The room was decorated with artificial flowers and glassware (Dieulafoy 1992, 549). She also mentions that Torkan Khanoum speaks Arabic, Turkish, and Russian, as she was originally Circassian, living previously in Istanbul.',
    ],
    ref: ref('2.5', 'Torkan Khanoum holding a narghile in hand', JD, 2, 94, true),
  },
];

// ---- Layout --------------------------------------------------------------------------------
const WIN = 0.66;            // longest side of the picture window (m)
const FRAME_PAD = 0.26;      // border 60 mm + mat 70 mm on each side
const size = (ar) => {
  const iw = ar >= 1 ? WIN : WIN * ar, ih = ar >= 1 ? WIN / ar : WIN;
  return { w: +(iw + FRAME_PAD).toFixed(3), h: +(ih + FRAME_PAD).toFixed(3) };
};
const byId = (id) => PLATES.find((p) => p.id === id);

function row(ids, wall, centre, y, gap, light) {
  const sizes = ids.map((id) => size(byId(id).ar));
  const total = sizes.reduce((s, z) => s + z.w, 0) + gap * (ids.length - 1);
  let u = centre - total / 2;
  ids.forEach((id, i) => {
    const p = byId(id);
    Object.assign(p, sizes[i], { wall, u: +(u + sizes[i].w / 2).toFixed(3), y, light });
    u += sizes[i].w + gap;
  });
}
row([1, 2], 'back', -1.15, 1.55, 0.3, 'back-a');
row([3, 4], 'back', 1.15, 1.55, 0.3, 'back-b');
row([5, 6], 'left', -1.5, 2.0, 0.26, 'left-top');
row([7, 8], 'left', -1.5, 0.92, 0.26, 'left-bottom');
row([9, 10], 'right', -0.55, 1.55, 0.26, 'right-a');
row([11, 12], 'right', 1.35, 1.55, 0.26, 'right-b');

export const SLOTS = PLATES.map((p) => ({
  id: p.id, fig: p.ref.match(/^Fig\. ([\d.]+)/)[1], wall: p.wall, u: p.u, y: p.y, w: p.w, h: p.h, light: p.light, ar: p.ar,
  src: p.src, title: p.title, text: p.text, ref: p.ref,
}));
