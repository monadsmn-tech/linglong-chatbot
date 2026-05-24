require("dotenv").config();
const express = require("express");
const axios = require("axios");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const conversations = {};

// ─── LINGLONG ҮНИЙН МЭДЭЭЛЛИЙН САН ───────────────────────────────────────────
const LINGLONG_PRICES = `
=== LINGLONG TIRES — БҮТЭН ҮНЭ ЖАГСААЛТ (Гурван Шүтээн ХХК) ===
Вэбсайт: https://gurvanshuteen.mn

--- WINTER ICE I-15 (Өвлийн дугуй) ---
165R13C 6PR хадаастай (LL140)                   | 110,000₮
165R13C (LL166)                                 | 120,000₮
195R14C 8PR G-M Winter VAN 106 (LL179)          | 175,000₮
195R15C 8PR GREEN-Max Van 106 (LL110)           | 150,000₮
195/65R15 G-M WINTER ICE I-15 95T (LL174)      | 125,000₮
205/65R15 G-M Winter I-16 94T (LL063)          | 135,000₮
205/70R15 G-M Ice I-15 SUV 96T (LL074)         | 135,000₮
205/70R15 W D Ice I-15 SUV 96T (LL177)         | 175,000₮
215/75R15 G-M W Ice I-15 SUV 100T (LL170)      | 155,000₮
215/75R15 W D Ice I-15 SUV 105T (LL076)        | 225,000₮
205/60R16 G-M WINTER ICE I-15 96T (LL065)      | 130,000₮
205/60R16 G-M WINTER ICE 96T (LL020)           | 170,000₮
215/60R16 W D Ice I-15 99T (LL077)             | 170,000₮
215/65R16 G-M GRIP 2 96T (LL043)               | 155,000₮
215/65R16 G-M WINTER ICE I-15 102T (LL044)     | 155,000₮
215/65R16 G-M Winter Grip 98T (LL078)          | 155,000₮
215/65R16 W D Ice I-15 105T (LL016)            | 155,000₮
215/65R16 GREEN-Max Winter HP 98H (LL079)       | 155,000₮
215/65R16 WINTER DEFENDER HP 98H (LL081)        | 150,000₮
215/65R16 NORD MASTER 102T (LL090)              | 150,000₮
215/70R16 G-M Winter Grip 115T (LL144)         | 170,000₮
225/70R16 G-M W Ice I-15 SUV 107T (LL168)      | 185,000₮
225/70R16 ECOSNOW SUV 104T (LL083)             | 140,000₮
225/75R16C ECOSNOW VAN 121 (LL085)             | 210,000₮
235/75R16 G-M W GRIP 2 106T (LL196)            | 185,000₮
235/70R16 G-M W Ice I-15 SUV 106T (LL169)      | 185,000₮
235/70R16 G-M W Ice I-15 SUV 111S (LL175)      | 225,000₮
265/70R16 G-M GRIP 112T (LL046)                | 210,000₮
265/70R16 ECOSNOW SUV 112T (LL047)             | 210,000₮
275/70R16 G-M W Ice I-15 114T (LL047)          | 235,000₮
215/60R17 W D Ice I-15 SUV 96T (LL023)         | 155,000₮
215/60R17 ECOZEN PLUS 100V (LL048)             | 200,000₮
225/55R17 G-M WINTER ICE I-15 101T (LL048)     | 200,000₮
225/55R17 W D Ice I-15 101T (LL086)            | 170,000₮
225/60R17 G-M W Ice I-15 102T (LL030)          | 180,000₮
225/55R17 ECOSNOW SUV 112T (LL200)             | 225,000₮
225/65R17 W D ICE I-15 112T (LL113)            | 225,000₮
235/65R17 G-M Winter Grip 115T (LL049)         | 260,000₮
235/65R17 W D Ice I-15 SUV 116T (LL176)        | 250,000₮
265/65R17 G-M W Ice I-15 SUV 116S (LL087)      | 260,000₮
275/65R17 W D Ice I-15 SUV 115T (LL176)        | 250,000₮
215/55R18 G-M W Ice I-15 99S (LL067)           | 170,000₮
215/55R18 W D Ice I-15 SUV 99T (LL088)         | 195,000₮
225/50R18 G-M W Ice I-15 SUV 99T (LL089)       | 195,000₮
225/50R18 W D Ice I-15 SUV 98T (LL033)         | 180,000₮
225/60R18 G-M W Ice I-15 100T (LL052)          | 186,000₮
225/60R18 W D Ice I-15 SUV 100T (LL026)        | 175,000₮
235/55R18 G-M W Ice I-15 SUV 97T (LL026)       | 175,000₮
235/60R18 G-M W Ice I-15 SUV 97T (LL093)       | 225,000₮
235/60R18 W D Ice I-15 SUV 107T (LL053)        | 180,000₮
235/60R18 ECOZEN PLUS 107V (LL114)             | 180,000₮
235/65R18 G-M W Ice I-15 SUV 106T (LL034)      | 180,000₮
245/45R18 G-M W Ice I-15 SUV 96T (LL094)       | 200,000₮
245/60R18 G-M W Ice I-15 SUV 105T (LL095)      | 245,000₮
245/60R18 W D Ice I-15 SUV 112H (LL056)        | 240,000₮
265/60R18 G-M W Ice I-15 110H (LL142)          | 265,000₮
265/70R18 G-M Winter Grip 115T (LL142)         | 265,000₮
285/60R18 W D Ice I-15 SUV 116T (LL057)        | 260,000₮
235/55R19 W D Ice I-15 SUV 99T (LL097)         | 245,000₮
235/55R19 G-M W Ice I-15 105H (LL116)          | 245,000₮
235/55R19 G-M W Ice I-15 107T (LL117)          | 240,000₮
275/40R19 W D Ice I-15 111T (LL118)            | 320,000₮
275/55R19 G-M W Ice I-15 111T (LL178)          | 320,000₮
275/55R19.5 18PR DI95 (LL027)                  | 480,000₮
245/45R20 G-M W Ice I-15 SUV 99T (LL027)       | 260,000₮
245/50R20 W D Ice I-15 SUV 99T (LL028)         | 270,000₮
255/50R20 G-M W Ice I-15 SUV 102T (LL028)      | 270,000₮
255/50R20 W D Ice I-15 102T (LL031)            | 270,000₮
255/50R20 G-M W Ice I-15 SUV 109H (LL032)      | 280,000₮
265/50R20 G-M W Ice I-15 SUV 109H (LL050)      | 240,000₮
275/50R20 G-M W Ice I-15 SUV 110T (LL025)      | 320,000₮
275/55R20 W D Grip 112T (LL062)                | 230,000₮
285/50R20 W D Grip 112T (LL072)                | 400,000₮
255/45R21 W D Ice I-15 SUV 102S (LL099)        | 250,000₮
255/45R21 W D Ice I-15 SUV 107T (LL100)        | 340,000₮
275/45R21 W D Ice I-15 SUV 113T (LL073)        | 290,000₮

--- CROSSWIND M/T (Mud Terrain - Оффроуд) ---
205R14C 8PR CW M/T 109/107R (LL161)            | 175,000₮
LT215/75R15 10PR CW M/T 100/97Q (LL131)        | 215,000₮
235/75R15 LMB3 105S (LL120)                    | 225,000₮
LT235/75R15 6PR CW M/T 104/101Q (LL035)        | 230,000₮
30x9.50R15LT 6PR CW M/T (LL035)                | 230,000₮
31X10.50R15LT 6PR CW M/T 109Q (LL159)          | 280,000₮
215/80R16 CW M/T 107S (LL128)                  | 270,000₮
225/75R16 8PR CW M/T 110/107Q (LL165)          | 255,000₮
LT235/70R16 8PR CW M/T 110/107Q (LL154)        | 260,000₮
LT265/70R16 6PR CW M/T 110/107Q (LL163)        | 290,000₮
LT265/70R16 6PR L-S M/T 123/120Q (LL040)       | 330,000₮
LT265/75R16 10PR CW M/T 126/123Q (LL137)       | 385,000₮
LT315/75R16 8PR CW M/T 121/118Q (LL164)        | 400,000₮
LT265/70R17 10PR CW M/T 121/118Q (LL138)       | 360,000₮
LT285/70R17 10PR CW M/T 121/118Q (LL149)       | 340,000₮
LT285/60R18 10PR M/T (LL165)                   | 330,000₮
35X12.50R18LT 10PR CW M/T 123Q (LL165)         | 430,000₮

--- CROSSWIND A/T (All Terrain) ---
215/65R16 PARALLER AT 98T (LL122)              | 155,000₮
215/65R16 R620 98H (LL146)                     | 145,000₮
215/70R16 CW A/T 100T (LL145)                  | 150,000₮
LT225/75R16 10PR CW AT100 115/112Q (LL156)     | 210,000₮
LT235/85R16 10PR L-S A/T 120/116Q (LL039)      | 250,000₮
265/70R16 L-S AT 112T (LL042)                  | 290,000₮
LT265/70R16 10PR CW A/T 123/120R (LL139)       | 360,000₮
265/65R16 CW A/T 116T (LL121)                  | 270,000₮
LT285/75R16 10PR CW A/T 126/123R (LL162)       | 290,000₮
265/60R17 CROSSWIND A/T 103H (LL068)            | 190,000₮
225/65R17 CW A/T 106T (LL147)                  | 170,000₮
LT265/70R17 10PR CW A/T 121/118R (LL150)       | 295,000₮
225/60R18 PARALLER AT 104H (LL052)              | 175,000₮
235/60R18 CW A/T 107T (LL041)                  | 185,000₮
265/60R18 CW A/T 110T (LL124)                  | 250,000₮
275/60R20 CW AT 115H (LL183)                   | 310,000₮

--- TRUCK BUS RADIAL (TBR) ---
Бүх хэмжээ                                     | 900,000₮-аас
`;

// ─── МОНГОЛ ХЭЛНИЙ СИСТЕМ ПРОМПТ ─────────────────────────────────────────────
const SYSTEM_PROMPT = `Та бол Гурван Шүтээн ХХК-ийн албан ёсны AI туслах юм. ТА ЗААВАЛ МОНГОЛ ХЭЛЭЭР ХАРИУЛНА. Хэрэглэгч Англиар бичсэн ч гэсэн МОНГОЛ ХЭЛЭЭР хариулна.

БАЙГУУЛЛАГЫН МЭДЭЭЛЭЛ:
- Нэр: Гурван Шүтээн ХХК
- Вэбсайт: https://gurvanshuteen.mn
- Брэндүүд: Linglong Tires 🛞, Toyo Tires, Enkei Wheels, BOTO Tires
- Байршил: Улаанбаатар, Монгол
- Ажлын цаг: Даваа–Бямба, 09:00–18:00

ЗАН ЧАНАР:
- Найрсаг, мэргэжлийн, товч тодорхой
- Мессенжерт тохиромжтой богино хариулт өгнө
- Хэрэглэгчийг "та" гэж хандана

ҮНЭ ХАЙХ ЗААВАР:
- Хэрэглэгч үнэ асуувал доорх мэдээллийн санаас ЯАРАЛТАЙ хэмжээг хайж үнийг мэдэгдэнэ
- Яг тохирсон хэмжээ олдвол: дагуу форматаар хариулна
- Хэмжээ олдохгүй бол: "Уг хэмжээний үнийг шалгаж, та руу буцаж мэдэгдэх болно. Утасны дугаараа үлдээнэ үү" гэж хариулна
- Вэбсайтын холбоос заавал оруулна: https://gurvanshuteen.mn/products?category_id=323196

ҮНЭ АСУУХАД ХАРИУЛАХ ФОРМАТ:
🛞 [Дугуйн нэр]
📏 Хэмжээ: [хэмжээ]
💰 Үнэ: [үнэ]
🌐 https://gurvanshuteen.mn

ЕРӨНХИЙ МЭДЭЭЛЭЛ:
- Өвлийн дугуй (ICE I-15): 110,000₮-аас эхлэн
- Оффроуд M/T: 175,000₮-аас эхлэн  
- All Terrain A/T: 145,000₮-аас эхлэн
- Truck TBR: 900,000₮-аас эхлэн

ДАМЖУУЛАХ ТОХИОЛДОЛ (менежерт шилжүүлэх):
- 5-аас дээш дугуй захиалах
- Гомдол, буцаалт
- Хэмжээ олдохгүй тохиолдол
→ "Та манай менежертэй шууд холбогдохыг хүсвэл утасны дугаараа үлдээнэ үү."

Хариултын эцэст үргэлж нэмэлт асуулт эсвэл дараагийн алхмыг санал болгоно.

LINGLONG ДУГУЙН ҮНЭ МЭДЭЭЛЛИЙН САН:
${LINGLONG_PRICES}`;

// ─── Мессенжерт хариу илгээх ──────────────────────────────────────────────────
async function sendMessage(recipientId, text) {
  await axios.post(
    `https://graph.facebook.com/v19.0/me/messages`,
    { recipient: { id: recipientId }, message: { text } },
    { params: { access_token: process.env.META_PAGE_ACCESS_TOKEN } }
  );
}

// ─── Claude AI хариу авах ─────────────────────────────────────────────────────
async function getAIResponse(userId, userMessage) {
  if (!conversations[userId]) conversations[userId] = [];
  conversations[userId].push({ role: "user", content: userMessage });
  const recentMessages = conversations[userId].slice(-10);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: recentMessages,
  });

  const reply = response.content[0].text;
  conversations[userId].push({ role: "assistant", content: reply });
  return reply;
}

// ─── Webhook баталгаажуулалт ──────────────────────────────────────────────────
app.get("/webhook", (req, res) => {
  const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;
  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook баталгаажлаа");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ─── Ирж буй мессеж боловсруулах ─────────────────────────────────────────────
app.post("/webhook", async (req, res) => {
  const body = req.body;
  if (body.object !== "page") return res.sendStatus(404);
  res.sendStatus(200);

  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      if (!event.message || event.message.is_echo) continue;
      const senderId = event.sender.id;
      const text = event.message.text;
      if (!text) continue;

      console.log(`📨 [${senderId}]: ${text}`);
      try {
        const reply = await getAIResponse(senderId, text);
        await sendMessage(senderId, reply);
        console.log(`✅ Хариу илгээлээ: ${senderId}`);
      } catch (err) {
        console.error("❌ Алдаа:", err.message);
        await sendMessage(senderId, "Уучлаарай, түр техникийн асуудал гарлаа. Хэсэг хугацааны дараа дахин туршина уу. 🙏");
      }
    }
  }
});

// ─── Серверийн төлөв шалгах ───────────────────────────────────────────────────
app.get("/", (req, res) => res.json({
  төлөв: "🟢 Гурван Шүтээн AI Chatbot ажиллаж байна",
  цаг: new Date().toISOString()
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Гурван Шүтээн AI Chatbot порт ${PORT}-д ажиллаж байна`));
