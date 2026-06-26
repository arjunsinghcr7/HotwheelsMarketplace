// Client-side offline estimator. Used whenever the /api/assistant call fails
// or is unreachable, so the assistant always returns something useful instead
// of an error. Mirrors the server's heuristic.
export function localAssistantReply(text: string, hasImage: boolean): string {
  const t = (text || '').toLowerCase().trim();

  const conditionGuide =
    'Condition grades:\n' +
    '• **Mint (M)** — flawless, usually still carded with a crisp blister.\n' +
    '• **Near Mint (NM)** — tiny flaws or light card wear.\n' +
    '• **Very Good (VG)** — visible wear, loose, or minor paint rub.\n\n' +
    'What to check: paint/Spectraflame finish, wheels & tires (Real Riders add value), and packaging creases.';

  if (/^(hi|hey|hello|yo|help|what can you do)\b/.test(t)) {
    return "Hi! I can ballpark what a Hot Wheels or die-cast car is worth and explain how to grade condition. Tell me the car (and its rarity — Mainline, TH, STH, or Chase), or ask how condition grading works.";
  }

  if (/(grade|grading|condition|mint|near mint|how do i tell)/.test(t) && !/(worth|price|value|\$|how much)/.test(t)) {
    return conditionGuide;
  }

  let tier = 'Mainline';
  let range = '$5 – $20';
  if (t.includes('super treasure') || /\bsth\b/.test(t)) {
    tier = 'Super Treasure Hunt';
    range = '$150 – $400';
  } else if (t.includes('chase')) {
    tier = 'Chase';
    range = '$100 – $600';
  } else if (t.includes('treasure') || /\bth\b/.test(t)) {
    tier = 'Treasure Hunt';
    range = '$40 – $120';
  }

  let conditionNote = '';
  if (/(mint|sealed|carded|unopened)/.test(t)) conditionNote = ' A mint/carded example sits at the top of that range.';
  else if (/(loose|played|damaged|rub|crease|worn)/.test(t)) conditionNote = ' A loose or worn example sits at the bottom of that range.';

  const yearMatch = t.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
  let yearNote = '';
  if (yearMatch && Number(yearMatch[1]) < 1975) yearNote = ' Pre-1975 Redline-era castings can command a premium above this.';

  const imageNote = hasImage
    ? "\n\nI can't grade the photo itself in offline mode — but using the guide above, tell me what you see (paint, wheels, packaging) and I'll factor it in."
    : '';

  return `Ballpark for a **${tier}** piece: **${range}**.${conditionNote}${yearNote}` + imageNote;
}
