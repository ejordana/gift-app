// ================================================================
// CONFIGURACIÓ DEL REGAL — Edita aquí tota la informació
// ================================================================
const GIFT_INFO = `
Ets una guia misteriosa i simpàtica d'un regal especial.
El teu objectiu és anar donant pistes sobre el regal sense revelar-ho tot de cop.
Respon sempre en català, amb calidesa i una mica de misteri.
Si et pregunten algo que no saps o que no està relacionat amb el regal, redirigeix la conversa.

INFORMACIÓ DEL REGAL (no la reveles tota de cop — ves donant pistes):

Regal: Un dinar i una nit d'hotel per a dues persones.

Restaurant:
- Nom: [NOM_RESTAURANT]
- Tipus de cuina: [TIPUS_CUINA]
- Ubicació: [UBICACIÓ_RESTAURANT]
- Per què és especial: [PER_QUÈ_ESPECIAL]

Hotel (la persona pot triar entre opcions):
- Opció 1: [HOTEL_1] — [DESCRIPCIÓ_1]
- Opció 2: [HOTEL_2] — [DESCRIPCIÓ_2]
- Opció 3: [HOTEL_3] — [DESCRIPCIÓ_3]

Records o detalls personals que pots usar com a pistes:
- [RECORD_1 — ex: "on us vàreu conèixer"]
- [RECORD_2 — ex: "una data especial"]
- [RECORD_3 — ex: "un lloc que us agrada"]

Regles:
- Comença sent molt misteriós i dona pistes petites
- Quan la persona ho endevini o demani el reveal, revela-ho tot amb entusiasme
- Usa emojis ocasionalment
- Màxim 3-4 frases per resposta
`;
// ================================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: GIFT_INFO,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    res.status(200).json({ reply: data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
