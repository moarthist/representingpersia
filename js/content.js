// All the words in the room live here, apart from the interface labels.
// Edit freely: the wall panels, the reading panel and the interactive screen are all built from this file.


export const EXHIBITION = {
  title: 'Representing Persia',
  qualifier: '(Qajar)',
  subtitle: 'A micromuseum of photographs · Room 01',
  wall: 'Between 1881 and 1886 Jane and Marcel Dieulafoy crossed Qajar Iran, first as travellers and then as excavators at Susa. Jane carried a camera. Her six albums hold more than nine hundred photographs of monuments, landscapes and people. This room asks how Iran was pictured for a European public, and who stood behind the lens.',
  intro: [
    'Between 1881 and 1886 Jane and Marcel Dieulafoy crossed Qajar Iran, first as travellers and then as excavators at Susa. Jane carried a camera, and her six albums now held at the library of the Institut national d’histoire de l’art (INHA) in Paris contain more than nine hundred photographs of monuments, landscapes and people.',
    'This micromuseum is a small room built around those images. Twelve frames hang on its walls, each with a title, a text and a reference; the photographs are scans from INHA, to be read next to the people who made and used them. The Scottish geographer-photographer John Thomson has a stand in the middle of the room, and Jane Dieulafoy has her own panel on the left wall. Their work belongs to the same age of travelling cameras.',
    'The interactive screen opens the digital scans of the albums. Pick an album, follow the route the Dieulafoys took, and read how the images were made, collected and later altered for print.',
  ],
  howTo: [
    'Drag to look around, scroll or pinch to zoom, right-drag (or two fingers) to move.',
    'Click a frame, the gold pins, the stand, the Thomson panel, the screen or the wall text to read more.',
    'Use the view buttons for the entrance, each wall, the screen and the floor plan.',
  ],
  prototypeNote: 'All twelve frames hold scans. Click a frame to read its title, text and reference.',
};

export const BIOS = {
  jane: {
    id: 'jane',
    kicker: '01 · Traveller, archaeologist, photographer',
    name: 'Jane Dieulafoy',
    dates: '1851 – 1916',
    born: 'Born Jeanne Henriette Magre, Toulouse, 29 June 1851. Died 25 May 1916, Pompertuzat, near Toulouse.',
    panel: ['Jane Dieulafoy (1851–1916) and her husband, Marcel Dieulafoy, from the years of 1881 to 1884, they traveled to Persia for three times. They crossed the Caucasus lands to reach Persian lands. Their expeditions produced theses textual documents: La Perse, la Chaldée et la Susiane: relation de voyage (1887), a rich source of direct observations of Persian society, including drawings, gravures, and photos of the Qajar period and the reign of Naser-e-Din Shah. The other book  À Suse: journal des fouilles, 1884-1886 (1888) is the result of Dieulafoy\'s second and third journeys in Persia, focusing on archaeological expeditions in southern Iran. Une archéologue en Perse (1887) is an overall notebook on their archeological excavation. Une Amazone en Orient du Caucase à Ispahan 1881-1882 (Du Caucase à Persépolis 1881-1882) is in a form of a travelogue to the central regions of Persia, the city of Isfahan. The book: Vers le soleil persan (Voyages extraordinaires d\'une aventurière en Orient) is a collection of memories on her way during their journies. Another book that focuses on social life of the people in the West and southern parts of Persia is L\'Orient sous le voile. She explains about the life of women and the ordinary people. She has also written a novel inspired by the Persian history with a fictional view which is called: Parysatis (1890). Another book which related to the history of Spain is Aragon et Valence - Barcelone, Saragosse, Sagonte, Valence (1888).'],
    lead: 'Jane Dieulafoy turned a marriage to an engineer into one of the most unusual careers of nineteenth-century France: soldier’s companion, traveller, excavator at Susa, novelist, and the photographer behind six albums of Qajar Iran.',
    sections: [
      {
        h: 'Early life',
        p: [
          'Jeanne Magre was born in Toulouse into a wealthy merchant family and educated at the Couvent de l’Assomption in Auteuil, near Paris, from 1862 to 1870. In May 1870, aged nineteen, she married Marcel-Auguste Dieulafoy, an engineer and architect who would later become an archaeologist. They had no children.',
        ],
      },
      {
        h: 'War and men’s dress',
        p: [
          'When the Franco-Prussian War broke out in 1870, Marcel volunteered and Jane went with him. Later accounts, notably her obituaries, say she followed him to the front dressed as a soldier; the story rests largely on those sources. She became known for wearing tailored men’s clothes in public, which in France then officially required police permission.',
        ],
      },
      {
        h: 'Persia, 1881–1882',
        p: [
          'After the war Marcel worked for the southern railways, and the couple travelled in Egypt and Morocco. In 1879 he turned to archaeology. Their first journey to Persia took place in 1881–82: from Marseille to Constantinople, by Russian steamer to Poti, across the Caucasus to Tabriz, then on to Tehran, Isfahan and Shiraz.',
          'Jane kept a daily journal and photographed monuments, ruins and people. She had studied photography in Paris before leaving, and carried cameras, glass plates and albumen paper by horse. Her aim, as scholars have noted, was to document every step of the journey, so quantity often won over polish.',
        ],
      },
      {
        h: 'Susa, 1884–1886',
        p: [
          'On later journeys, the last in 1884, the Dieulafoys excavated at Susa, the ancient Elamite and Achaemenid capital. These were the first French excavations on the site. The glazed-brick friezes they found, among them the Lion Frieze and the Frieze of the Archers, were shipped to the Louvre, where rooms are devoted to the Dieulafoy missions. Jane was made a Chevalier of the Legion of Honour in 1886.',
        ],
      },
      {
        h: 'The albums',
        p: [
          'Her photographs survive in six albums, Perse 1 to Perse 6, which hold more than nine hundred prints. They reached the library of INHA shortly after Marcel Dieulafoy’s death in 1920, and INHA digitised them in 2021. Perse 1 is scrapbook-like: small prints, often without captions or borders, with stitched panoramas and collages.',
        ],
      },
      {
        h: 'Reading the images critically',
        p: [
          'The albums are not a pure record of one person’s eye. A red “D” stamp marks ownership, not necessarily authorship, and the albums include professional photographs she collected. In the book the images were reworked: engravers added figures and softened shadows, and the albums often contain more pictures than the printed volume. Her prose carries the prejudices and stereotypes of her time. These are reasons to read the photographs as constructed representations of Iran made for a European audience.',
        ],
      },
      {
        h: 'Last years',
        p: [
          'She went on travelling in Spain and Morocco. During the First World War Marcel volunteered for service in Rabat and Jane went with him. There she contracted amoebic dysentery; she returned to France and died on 25 May 1916.',
        ],
      },
    ],
    keyDates: [
      ['1851', 'Born in Toulouse'],
      ['1870', 'Marries Marcel Dieulafoy; Franco-Prussian War'],
      ['1881–82', 'First journey to Persia'],
      ['1884–86', 'Excavations at Susa'],
      ['1886', 'Chevalier of the Legion of Honour'],
      ['1887', 'La Perse, la Chaldée et la Susiane'],
      ['1888', 'À Suse, journal des fouilles'],
      ['1890', 'Parysatis'],
      ['1916', 'Dies, 25 May'],
      ['2021', 'INHA digitises the six Perse albums'],
    ],
    sources: [
      { label: 'Jane Dieulafoy, Wikipedia', url: 'https://en.wikipedia.org/wiki/Jane_Dieulafoy' },
      { label: 'Jane Dieulafoy in Varamin, Getty Research Journal 19', url: 'https://www.getty.edu/publications/grj/19/_assets/downloads/getty-research-journal-19-jane-dieulafoy-in-varamin.pdf' },
      { label: 'Jane Dieulafoy (1851–1916), BnF', url: 'https://heritage.bnf.fr/bibliothequesorient/en/jane-dieulafoy-art' },
    ],
  },

  thomson: {
    id: 'thomson',
    kicker: '02 · Geographer, photographer, traveller',
    name: 'John Thomson',
    dates: '1837 – 1921',
    born: 'Born Edinburgh, 14 June 1837. Died September 1921.',
    panel: ['John Thomson (1837-1921). He was born in Edinburgh, Scotland. As the first modern photojournalist, he mixed documentary photography with written reports for public publication. Over ten years of travel, he photographed regions and people in Southeast and East Asia, including Thailand, Cambodia, and China. He published important works such as "Illustrations of China and Its People." He worked as a lecturer in photography at the Royal Geographical Society (RGS), London, promoting photography as a documentary and scientific tool in geographical travel (Parker 1978, 465). Although his photographs mostly focus on Southeast Asia and China, he also captured unique images of the daily lives and work of Persian people while traveling through Persia. He was one of the first photographers to travel east and document the people, landscapes, and artifacts of Eastern cultures. Upon his return home, he became a known example of social documentary photography that helped lay the foundations of photojournalism. His adventures are reflected in eight books: The Antiquities of Cambodia (1867), Views on the North River (1870), Illustrations of China and Its People (1873–1874), Foochow and the River Min (1873)',
      'The Straits of Malacca, Indo-China, and China: Or, Ten Years\' Travels, Adventures and Residence Abroad (1875), Street Life in London (1877–1878), Through Cyprus with the Camera, in the Autumn of 1878 (1879), Through China With a Camera (1898). The photographs John Thomson took in China and along the route there, as well as those he captured on the streets of London, enjoy worldwide renown. The photos of Persia at INHA are in a collection of photographs taken in Persia, Turkey and in the Caucasus, during a seven months\' journey in 1891.'],
    lead: 'A Scot who trained in optics and instrument-making, then carried a camera across Southeast Asia and China, and later turned it on the streets of London.',
    sections: [
      {
        h: 'Training',
        p: [
          'John Thomson was born in Edinburgh in 1837. He was apprenticed to an Edinburgh optical and scientific-instrument maker, and took evening classes in natural philosophy, mathematics and chemistry at the Watt Institution and School of Arts, now Heriot-Watt University. This mix of optics, chemistry and measurement shaped everything he later did with a camera.',
        ],
      },
      {
        h: 'Singapore and Southeast Asia',
        p: [
          'In April 1862 he left Edinburgh for Singapore to join his elder brother William, and set up a business making chronometers and instruments together with a portrait studio. He travelled in Malaya and Sumatra, visited Ceylon and India in 1864, and reached Bangkok in 1865, where he photographed the Siamese king and his court.',
          'In 1866 he travelled to Angkor with H. G. Kennedy and spent about two weeks there; the photographs became The Antiquities of Cambodia (1867). That same year he was elected a Fellow of the Royal Geographical Society.',
        ],
      },
      {
        h: 'China',
        p: [
          'In the late 1860s he settled in Hong Kong and spent about four years travelling widely, to Fujian in 1870–71, to Taiwan in 1871, and along the Yangtze. Back in Britain in 1872, he published Illustrations of China and Its People (four volumes, 1873–74), pairing each photograph with text in the manner of a geographer’s report.',
        ],
      },
      {
        h: 'London',
        p: [
          'Thomson settled in Brixton and, with the journalist Adolphe Smith, produced Street Life in London (1877), portraits of street traders and the poor that helped found social documentary photography. His last long photographic journey took him to Cyprus in 1878 (Through Cyprus with a Camera, 1879).',
          'He ran a portrait studio in Mayfair and was appointed photographer to Queen Victoria and the royal family in 1881. From 1886 he was instructor in photography to the Royal Geographical Society, teaching explorers to use the camera in the field. Through China with a Camera appeared in 1898. He retired in 1910 and died in September 1921.',
        ],
      },
      {
        h: 'Thomson and Persia',
        p: [
          'The text on the wall places Thomson in Persia, and the INHA collection of photographs taken in Persia, Turkey and the Caucasus during a seven months’ journey in 1891 is linked to him there. His better-known work lies in Southeast Asia, China and London. Set beside Dieulafoy, he invites questions about method (the geographer’s caption and the traveller’s album), audience, and what each chose to show.',
        ],
      },
    ],
    keyDates: [
      ['1837', 'Born in Edinburgh'],
      ['1862', 'Leaves for Singapore'],
      ['1865–66', 'Siam; Angkor; elected FRGS'],
      ['1867', 'The Antiquities of Cambodia'],
      ['c. 1868–72', 'Hong Kong and travels in China'],
      ['1873–74', 'Illustrations of China and Its People'],
      ['1877', 'Street Life in London'],
      ['1878', 'Cyprus'],
      ['1881', 'Photographer to Queen Victoria'],
      ['1886', 'Instructor in photography, RGS'],
      ['1921', 'Dies, September'],
    ],
    sources: [
      { label: 'John Thomson (photographer), Wikipedia', url: 'https://en.wikipedia.org/wiki/John_Thomson_(photographer)' },
      { label: 'John Thomson, Historic Environment Scotland', url: 'https://www.historicenvironment.scot/visit-a-place/commemorative-plaques/john-thomson/' },
      { label: 'John Thomson, English Heritage blue plaque', url: 'https://www.english-heritage.org.uk/visit/blue-plaques/john-thomson/' },
    ],
  },
};

// Interactive screen: the INHA digital scans.
export const INHA = {
  title: 'Dieulafoy and Thomson albums',
  org: 'Institut national d’histoire de l’art (INHA), Paris',
  // Replace with the exact address of the digitised albums when you have it.
  url: 'https://bibliotheque-numerique.inha.fr/',
  about: [
    'Jane Dieulafoy’s photographs of Persia survive in six personal albums, Perse 1 to Perse 6, with more than nine hundred prints in total. They came to the library of INHA shortly after Marcel Dieulafoy’s death in 1920 and were digitised in 2021.',
    'The albums mix prints she made herself with photographs she collected; a red “D” stamp shows ownership, not necessarily authorship. Quality varies, because the aim was to document every step of the journey.',
    'The printed book, La Perse, la Chaldée et la Susiane (1887), used engravings made from the photographs. Figures were added and shadows lightened, so the albums often show more, and differently, than the book.',
    'John Thomson’s A Collection of Photographs taken in Persia, Turkey and in the Caucasus, during a seven months’ journey in 1891 is a two-volume album of platinotype prints, each plate captioned in ink. INHA holds it in the Jacques Doucet collections (shelf marks 4 PHOT 15 (1) and (2)); it was digitised in 2010.',
  ],
  // Notes per album, and the album's page in the INHA digital library.
  // Only Perse 1 is described in the sources used here: add notes for the others from the INHA catalogue.
  albums: [
    { id: 'Perse 1', group: 'Jane Dieulafoy, 1881–1886', url: 'https://bibliotheque-numerique.inha.fr/collection/item/62746-album-dieulafoy-perse-1?offset=3',
      viewer: 62746, iiif: '/d0/90/4f/e6/d0904fe6-c342-4a43-8646-5300db27f951/iiif/1090_doucet_4PHOT018_01_', shelf: '4 PHOT 018 (1)',
      pages: [6, 17, 27, 38, 49, 59, 70, 81, 91, 102],
      note: 'A scrapbook-like album of small prints, often without captions or borders, with stitched panoramas and collages.' },
    { id: 'Perse 2', url: 'https://bibliotheque-numerique.inha.fr/collection/item/62742-album-dieulafoy-perse-2?offset=4',
      viewer: 62742, iiif: '/78/c8/a6/da/78c8a6da-6504-45a3-acd7-52dc2bf1a4eb/iiif/1090_doucet_4PHOT018_02_', shelf: '4 PHOT 018 (2)',
      pages: [6, 17, 28, 38, 49, 60, 71, 81, 92, 103],
      note: 'Add a description from the INHA catalogue.' },
    { id: 'Perse 3', url: 'https://bibliotheque-numerique.inha.fr/collection/item/62745-album-dieulafoy-perse-3?offset=5',
      viewer: 62745, iiif: '/6f/91/a3/14/6f91a314-0d93-4b7a-8ec4-6b4dff474b39/iiif/1090_doucet_4PHOT018_03_', shelf: '4 PHOT 018 (3)',
      pages: [6, 17, 27, 38, 48, 59, 69, 80, 90, 101],
      note: 'Add a description from the INHA catalogue.' },
    { id: 'Perse 4', url: 'https://bibliotheque-numerique.inha.fr/collection/item/62743-album-dieulafoy-perse-4?offset=6',
      viewer: 62743, iiif: '/e7/ba/67/f7/e7ba67f7-77df-4476-9b07-62acf0b0353e/iiif/1090_doucet_4PHOT018_04_', shelf: '4 PHOT 018 (4)',
      pages: [7, 17, 27, 38, 49, 59, 70, 81, 89, 102],
      note: 'Add a description from the INHA catalogue.' },
    { id: 'Perse 5', url: 'https://bibliotheque-numerique.inha.fr/collection/item/62747-album-dieulafoy-perse-5?offset=7',
      viewer: 62747, iiif: '/12/d1/b1/6f/12d1b16f-16f6-40ad-92b1-4bbeda51f4ca/iiif/1090_doucet_4PHOT018_05_', shelf: '4 PHOT 018 (5)',
      pages: [6, 17, 28, 39, 50, 61, 72, 83, 94, 105],
      note: 'Add a description from the INHA catalogue.' },
    { id: 'Perse 6', url: 'https://bibliotheque-numerique.inha.fr/collection/item/62754-album-dieulafoy-perse-6?offset=8',
      viewer: 62754, iiif: '/15/5b/56/95/155b5695-461c-47ac-b0fc-e092af9fa89e/iiif/1090_doucet_4PHOT018_06_', shelf: '4 PHOT 018 (6)',
      pages: [6, 15, 25, 34, 43, 53, 62, 71, 81, 90],
      note: 'Add a description from the INHA catalogue.' },
    { id: 'Divers', url: 'https://bibliotheque-numerique.inha.fr/collection/item/62750-album-dieulafoy-divers?offset=1',
      viewer: 62750, iiif: '/3e/85/66/cf/3e8566cf-6408-4383-939f-4b2bdf6a17bd/iiif/1090_doucet_4PHOT019_', shelf: '4 PHOT 019',
      pages: [6, 17, 27, 38, 48, 59, 69, 80, 90, 101],
      note: 'A further Dieulafoy album of miscellaneous photographs. Add a description from the INHA catalogue.' },
    // John Thomson's album of the 1891 journey, in two volumes.
    { id: 'Thomson, vol. 1', group: 'John Thomson, 1891', collection: 'John Thomson, A Collection of Photographs taken in Persia, Turkey and in the Caucasus, during a seven months’ journey in 1891, vol. 1, platinotype',
      url: 'https://bibliotheque-numerique.inha.fr/collection/item/15526-a-collection-of-photographs-taken-in-persia-turkey-and-in-the-caucasus-vol-1',
      viewer: 15526, iiif: '/04/f3/47/80/04f34780-418a-4514-8c8f-3a7c91eff201/iiif/1053_doucet_4PHOT15_01_', shelf: '4 PHOT 15 (1)',
      pages: [8, 20, 26, 31, 33, 38, 47, 55, 65, 74],
      // Titles from the captions printed under each plate.
      titles: {
        8: 'Bushire. Back view of the Agency of the Imperial Bank of Persia', 20: 'Kark Island. Group of natives', 26: 'Bassorah',
        31: 'Bassorah. Old gate with wood carvings', 33: 'Bagdad. The house of a European resident', 38: 'Mohamrah. A group of natives',
        47: 'Ahwaz. Natives', 55: 'Shushter. Son and nephew of the Governor',
        65: 'Kazerun. Poor peasants (Arab settlers) on their way to the mountain pastures', 74: 'Shiraz. Haji Seyid Ibrahim',
      },
      note: 'Platinotype prints from John Thomson’s seven-month journey of 1891 through the Persian Gulf, Mesopotamia and southern Persia. Volume 1 runs from Bushire and Bassorah to Shushter, Kazerun and Shiraz.' },
    { id: 'Thomson, vol. 2', collection: 'John Thomson, A Collection of Photographs taken in Persia, Turkey and in the Caucasus, during a seven months’ journey in 1891, vol. 2, platinotype',
      url: 'https://bibliotheque-numerique.inha.fr/collection/item/15528-a-collection-of-photographs-taken-in-persia-turkey-and-in-the-caucasus-vol-2',
      viewer: 15528, iiif: '/87/83/ff/ec/8783ffec-251f-4680-b380-91b670515cdb/iiif/1053_doucet_4PHOT15_02_', shelf: '4 PHOT 15 (2)',
      pages: [3, 8, 17, 27, 36, 47, 49, 56, 66, 74],
      titles: {
        3: 'H.I.H. Masoud Mirza Zil-es-Sultan, eldest son of the Shah, Governor of Isfahan', 8: 'Isfahan. The Maidan-i-Shah (King’s Square)',
        17: 'Isfahan. The bridge of Ali Verdi Khan', 27: 'On the road from Isfahan to Sultanabad. A muleteer and his servant',
        36: 'Sultanabad. Group of weavers in a village in the neighbourhood', 47: 'On the road from Sultanabad to Teheran. People of Malayer on their way to Teheran',
        49: 'A European on the road from Sultanabad to Teheran', 56: 'Teheran. The five blind beggars', 66: 'Tabreez. Group of natives',
        74: 'On the road from Tabreez to Tiflis. Erivan (Caucasus), the principal street',
      },
      note: 'Volume 2 continues north through Isfahan, Sultanabad and Teheran to Tabreez, and on into the Caucasus at Erivan and Tiflis.' },
  ],
  // Ten thumbnails per album, loaded straight from the INHA image server (IIIF); see INHA.scans below.
  // To show other pages, change an album's  pages  list (page numbers as in the INHA viewer).
  placeholderTiles: 12,
  // The printed itinerary map, shown on the Route tab next to the simplified route.
  routeMap: {
    src: 'assets/route-map.jpg',
    title: 'Carte pour servir à l’intelligence du voyage de Mme Dieulafoy de Tiflis à Bagdad, Suse et Mohamerè',
    caption: 'Map from Jane Dieulafoy, La Perse, la Chaldée et la Susiane (Paris: Hachette, 1887). The red line is her itinerary, from Tiflis through Tabriz, Tehran, Isfahan and Shiraz to Susa, Baghdad and Mohammerah.',
  },
  // The 1881–82 route and Susa. Coordinates are latitude, longitude.
  route: [
    { name: 'Marseille', lat: 43.296, lon: 5.37, note: 'Departure from France.' },
    { name: 'Constantinople', lat: 41.01, lon: 28.98, note: 'Sea crossing to the Ottoman capital.' },
    { name: 'Poti', lat: 42.15, lon: 41.67, note: 'Russian steamer across the Black Sea.' },
    { name: 'Tabriz', lat: 38.08, lon: 46.29, note: 'First Persian city, reached after the Caucasus.' },
    { name: 'Tehran', lat: 35.69, lon: 51.39, note: 'The Qajar capital.' },
    { name: 'Isfahan', lat: 32.65, lon: 51.67, note: 'Safavid monuments.' },
    { name: 'Shiraz', lat: 29.59, lon: 52.58, note: 'Southern Iran.' },
  ],
  susa: { name: 'Susa', lat: 32.19, lon: 48.26, note: 'Excavations of 1884–1886; friezes sent to the Louvre.' },
};

// Thumbnails for each album's chosen pages, each linked to that page in the INHA viewer.
const IIIF = 'https://bibliotheque-numerique.inha.fr/i/?IIIF=';
INHA.scans = Object.fromEntries(INHA.albums.map((a) => [a.id, (a.pages || []).map((n) => ({
  title: (a.titles && a.titles[n]) || `${a.id}, page ${n}`,
  src: `${IIIF}${a.iiif}${String(n).padStart(6, '0')}.tif/full/!320,320/0/default.jpg`,
  caption: `${a.collection || 'Album Dieulafoy, ' + a.id}, page ${n}. INHA library, Jacques Doucet collections, shelf mark ${a.shelf}.`,
  url: `https://bibliotheque-numerique.inha.fr/viewer/${a.viewer}/?offset=#page=${n}&viewer=picture`,
}))]));
