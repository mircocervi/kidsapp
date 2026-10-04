import type { GameDef, Question } from "./types";
import { ROUND, shuffle } from "./util";

// Banca domande di scienze per livello. La prima opzione è sempre quella giusta (viene mescolata).
type Item = { level: number; visual: string; en: [string, ...string[]]; it: [string, ...string[]] };

const bank: Item[] = [
  // livello 2 (prima elementare)
  { level: 2, visual: "🐄", en: ["What does a cow give us?", "Milk", "Honey", "Eggs"], it: ["Che cosa ci dà la mucca?", "Il latte", "Il miele", "Le uova"] },
  { level: 2, visual: "🐝", en: ["What do bees make?", "Honey", "Milk", "Bread"], it: ["Che cosa fanno le api?", "Il miele", "Il latte", "Il pane"] },
  { level: 2, visual: "🌱", en: ["What does a plant need to grow?", "Water and light", "Only darkness", "Sweets"], it: ["Di cosa ha bisogno una pianta per crescere?", "Acqua e luce", "Solo buio", "Caramelle"] },
  { level: 2, visual: "🐟", en: ["Where does a fish live?", "In water", "In a tree", "In the sand"], it: ["Dove vive il pesce?", "Nell'acqua", "Su un albero", "Nella sabbia"] },
  { level: 2, visual: "❄️", en: ["What is snow made of?", "Frozen water", "Sugar", "Paper"], it: ["Di che cosa è fatta la neve?", "Acqua ghiacciata", "Zucchero", "Carta"] },
  { level: 2, visual: "👃", en: ["Which part of the body do we smell with?", "Nose", "Ears", "Knees"], it: ["Con quale parte del corpo sentiamo gli odori?", "Il naso", "Le orecchie", "Le ginocchia"] },
  { level: 2, visual: "🐣", en: ["What comes out of a hen's egg?", "A chick", "A puppy", "A fish"], it: ["Che cosa nasce da un uovo di gallina?", "Un pulcino", "Un cagnolino", "Un pesce"] },
  { level: 2, visual: "🌙", en: ["When can we usually see the Moon best?", "At night", "Only at lunch", "Never"], it: ["Quando vediamo meglio la Luna?", "Di notte", "Solo a pranzo", "Mai"] },
  // livello 3 (seconda)
  { level: 3, visual: "🐛", en: ["What does a caterpillar become?", "A butterfly", "A bird", "A frog"], it: ["Che cosa diventa un bruco?", "Una farfalla", "Un uccello", "Una rana"] },
  { level: 3, visual: "🐸", en: ["What is a baby frog called?", "Tadpole", "Puppy", "Calf"], it: ["Come si chiama il piccolo della rana?", "Girino", "Cucciolo", "Vitello"] },
  { level: 3, visual: "🧊", en: ["What happens to ice in the sun?", "It melts", "It grows", "It sings"], it: ["Che cosa succede al ghiaccio al sole?", "Si scioglie", "Cresce", "Canta"] },
  { level: 3, visual: "🦴", en: ["What holds our body up?", "The skeleton", "The hair", "The nails"], it: ["Che cosa sostiene il nostro corpo?", "Lo scheletro", "I capelli", "Le unghie"] },
  { level: 3, visual: "🌳", en: ["Which part of the plant is under the ground?", "Roots", "Flowers", "Leaves"], it: ["Quale parte della pianta sta sotto terra?", "Le radici", "I fiori", "Le foglie"] },
  { level: 3, visual: "🐋", en: ["Is a whale a fish or a mammal?", "A mammal", "A fish", "A bird"], it: ["La balena è un pesce o un mammifero?", "Un mammifero", "Un pesce", "Un uccello"] },
  // livello 4 (terza)
  { level: 4, visual: "💧", en: ["What are the three states of water?", "Solid, liquid, gas", "Hot, cold, warm", "Big, small, tiny"], it: ["Quali sono i tre stati dell'acqua?", "Solido, liquido, gassoso", "Caldo, freddo, tiepido", "Grande, piccolo, minuscolo"] },
  { level: 4, visual: "🦁", en: ["An animal that eats only meat is a…", "Carnivore", "Herbivore", "Vegetable"], it: ["Un animale che mangia solo carne è un…", "Carnivoro", "Erbivoro", "Vegetale"] },
  { level: 4, visual: "🐄", en: ["An animal that eats only plants is a…", "Herbivore", "Carnivore", "Mineral"], it: ["Un animale che mangia solo piante è un…", "Erbivoro", "Carnivoro", "Minerale"] },
  { level: 4, visual: "🌍", en: ["What do we call the air around the Earth?", "Atmosphere", "Ocean", "Desert"], it: ["Come si chiama l'aria intorno alla Terra?", "Atmosfera", "Oceano", "Deserto"] },
  { level: 4, visual: "🧲", en: ["What does a magnet attract?", "Iron", "Wood", "Glass"], it: ["Che cosa attira una calamita?", "Il ferro", "Il legno", "Il vetro"] },
  { level: 4, visual: "🌡️", en: ["At what temperature does water freeze?", "0 °C", "50 °C", "100 °C"], it: ["A che temperatura gela l'acqua?", "0 °C", "50 °C", "100 °C"] },
  // livello 5 (quarta)
  { level: 5, visual: "🍃", en: ["How do plants make their food?", "Photosynthesis", "Digestion", "Hibernation"], it: ["Come producono il cibo le piante?", "Con la fotosintesi", "Con la digestione", "Con il letargo"] },
  { level: 5, visual: "❤️", en: ["What does the heart pump around the body?", "Blood", "Air", "Food"], it: ["Che cosa pompa il cuore nel corpo?", "Il sangue", "L'aria", "Il cibo"] },
  { level: 5, visual: "🫁", en: ["Which organs do we breathe with?", "Lungs", "Kidneys", "Stomach"], it: ["Con quali organi respiriamo?", "I polmoni", "I reni", "Lo stomaco"] },
  { level: 5, visual: "🦎", en: ["Animals without a backbone are called…", "Invertebrates", "Vertebrates", "Mammals"], it: ["Gli animali senza colonna vertebrale si chiamano…", "Invertebrati", "Vertebrati", "Mammiferi"] },
  { level: 5, visual: "🌋", en: ["What comes out of an erupting volcano?", "Lava", "Snow", "Milk"], it: ["Che cosa esce da un vulcano in eruzione?", "La lava", "La neve", "Il latte"] },
  { level: 5, visual: "🌞", en: ["What is the Sun?", "A star", "A planet", "A moon"], it: ["Che cos'è il Sole?", "Una stella", "Un pianeta", "Una luna"] },
  // livello 6 (quinta)
  { level: 6, visual: "🪐", en: ["Which is the largest planet in the Solar System?", "Jupiter", "Mars", "Mercury"], it: ["Qual è il pianeta più grande del Sistema solare?", "Giove", "Marte", "Mercurio"] },
  { level: 6, visual: "🌍", en: ["How long does the Earth take to go around the Sun?", "About one year", "One day", "One month"], it: ["Quanto impiega la Terra a girare intorno al Sole?", "Circa un anno", "Un giorno", "Un mese"] },
  { level: 6, visual: "🔬", en: ["What is the smallest living unit of the body?", "The cell", "The bone", "The muscle"], it: ["Qual è la più piccola unità vivente del corpo?", "La cellula", "L'osso", "Il muscolo"] },
  { level: 6, visual: "⚡", en: ["Which material conducts electricity well?", "Copper", "Rubber", "Wood"], it: ["Quale materiale conduce bene l'elettricità?", "Il rame", "La gomma", "Il legno"] },
  { level: 6, visual: "🌱", en: ["Which gas do plants release during photosynthesis?", "Oxygen", "Smoke", "Helium"], it: ["Quale gas liberano le piante con la fotosintesi?", "Ossigeno", "Fumo", "Elio"] },
  { level: 6, visual: "🌕", en: ["Why does the Moon shine?", "It reflects sunlight", "It has lamps", "It is on fire"], it: ["Perché la Luna brilla?", "Riflette la luce del Sole", "Ha delle lampade", "Sta bruciando"] },
];

export const science: GameDef = {
  id: "science",
  subject: "science",
  icon: "🔬",
  color: "#B8E0A0",
  minLevel: 2,
  maxLevel: 6,
  title: { en: "Science quiz", it: "Quiz di scienze" },
  generate: (level, locale) => {
    // domande del proprio livello e del precedente, per ripasso
    const pool = bank.filter((q) => q.level === level || q.level === level - 1);
    return shuffle(pool).slice(0, ROUND).map((q): Question => {
      const [prompt, correct, ...wrong] = q[locale];
      const options = shuffle([correct, ...wrong]);
      return { prompt, visual: q.visual, options, answer: options.indexOf(correct) };
    });
  },
};
