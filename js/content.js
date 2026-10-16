// All the words in the room live here, apart from the interface labels.
// Edit freely: the wall panels, the reading panel and the interactive screen are all built from this file.

import { SLOTS } from './photos.js';

export const EXHIBITION = {
  title: 'Representing Persia',
  qualifier: '(Qajar)',
  subtitle: 'A micromuseum of photographs · Room 01',
  wall: 'Between 1881 and 1886 Jane and Marcel Dieulafoy crossed Qajar Iran, first as travellers and then as excavators at Susa. Jane carried a camera. Her six albums hold more than nine hundred photographs of monuments, landscapes and people. This room asks how Iran was pictured for a European public, and who stood behind the lens.',
  intro: [
    'Between 1881 and 1886 Jane and Marcel Dieulafoy crossed Qajar Iran, first as travellers and then as excavators at Susa. Jane carried a camera, and her six albums now held at the library of the Institut national d’histoire de l’art (INHA) in Paris contain more than nine hundred photographs of monuments, landscapes and people.',
    'This micromuseum is a small room built around those images. Twelve frames hang on its walls, each with a title, a text and a reference; the photographs are scans from INHA, to be read next to the people who made and used them. Jane Dieulafoy has a stand in the middle of the room, and the Scottish geographer-photographer John Thomson has his own panel on the left wall. Their work belongs to the same age of travelling cameras.',
    'The interactive screen opens the digital scans of the albums. Pick an album, follow the route the Dieulafoys took, and read how the images were made, collected and later altered for print.',
  ],
  howTo: [
    'Drag to look around, scroll or pinch to zoom, right-drag (or two fingers) to move.',
    'Click a frame, the gold pins, the stand, the Thomson panel, the screen or the wall text to read more.',
    'Use the view buttons for the entrance, each wall, the screen and the floor plan.',
  ],
  prototypeNote: 'Seven frames hold scans; plates 03, 06, 07, 08 and 09 are still empty and wait for their scans (see README.md, “Hang your photographs”). Click a frame to read its title, text and reference.',
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
  title: 'Perse 1–6',
  org: 'Institut national d’histoire de l’art (INHA), Paris',
  // Replace with the exact address of the digitised albums when you have it.
  url: 'https://bibliotheque-numerique.inha.fr/',
  about: [
    'Jane Dieulafoy’s photographs of Persia survive in six personal albums, Perse 1 to Perse 6, with more than nine hundred prints in total. They came to the library of INHA shortly after Marcel Dieulafoy’s death in 1920 and were digitised in 2021.',
    'The albums mix prints she made herself with photographs she collected; a red “D” stamp shows ownership, not necessarily authorship. Quality varies, because the aim was to document every step of the journey.',
    'The printed book, La Perse, la Chaldée et la Susiane (1887), used engravings made from the photographs. Figures were added and shadows lightened, so the albums often show more, and differently, than the book.',
  ],
  // Notes per album. Only Perse 1 is described in the sources used here: add notes for the others from the INHA catalogue.
  albums: [
    { id: 'Perse 1', note: 'A scrapbook-like album of small prints, often without captions or borders, with stitched panoramas and collages.' },
    { id: 'Perse 2', note: 'Add a description from the INHA catalogue.' },
    { id: 'Perse 3', note: 'Add a description from the INHA catalogue.' },
    { id: 'Perse 4', note: 'Add a description from the INHA catalogue.' },
    { id: 'Perse 5', note: 'Add a description from the INHA catalogue.' },
    { id: 'Perse 6', note: 'Add a description from the INHA catalogue.' },
  ],
  // To show real scans on the screen, add objects to an album here, for example:
  //   scans: { 'Perse 1': [ { title: '…', src: 'assets/scans/perse1-001.jpg', caption: '…', url: 'https://…' } ] }
  // Until then the screen shows empty placeholder tiles.
  scans: SLOT_SCANS(),
  placeholderTiles: 12,
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

// The scans that are already hung become tiles on the screen, filed under the album (volume) they came from.
function SLOT_SCANS() {
  const out = {};
  SLOTS.filter((p) => p.src).forEach((p) => {
    const vol = (p.ref.match(/vol\. (\d)/) || [])[1];
    if (!vol) return;
    (out['Perse ' + vol] = out['Perse ' + vol] || []).push({ title: p.title, src: p.src, caption: p.ref });
  });
  return out;
}
