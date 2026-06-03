// ── CONSTANTS ──────────────────────────────────────────────────────────
export const COLORS = [
  ["#FDE8B0", "#7A4F00"],
  ["#C8EDD9", "#155235"],
  ["#F5C4C4", "#7A1A1A"],
  ["#C8D8F5", "#1A3A7A"],
  ["#E4C8F5", "#4A1A7A"],
  ["#C8F0F0", "#0A4A4A"],
];

export const ALL_METRICS = [
  "upsells", "speed", "guest praise", "zero complaints",
  "creativity", "teamwork", "problem solving", "menu knowledge",
];

// ── SEED EMPLOYEES ─────────────────────────────────────────────────────
export const SEED_EMPLOYEES = [
  { name: "Sofia M.",  role: "Senior Waiter" },
  { name: "James T.",  role: "Bartender"     },
  { name: "Aisha R.",  role: "Host"           },
  { name: "Marco D.",  role: "Runner"         },
];

// ── SEED HISTORY ────────────────────────────────────────────────────────
export const SEED_HISTORY = [
  {
    date: "2026-05-31",
    venue: "The Grand Brasserie",
    stype: "Dinner service",
    covers: 152,
    parsed: {
      recognitions: [
        {
          name: "Sofia M.",
          badge: "Guest Champion",
          message: "Sofia delivered exceptional service during one of our busiest Friday dinners this season. She handled Table 12's last-minute dietary requests with grace and received three unsolicited compliments from guests. Her ability to upsell the tasting menu increased table spend significantly. A true professional who leads by example every shift.",
          reward_suggestion: "Employee of the week",
          points: 80,
        },
        {
          name: "James T.",
          badge: "Craft Maestro",
          message: "James demonstrated outstanding creativity at the bar tonight, introducing guests to our new seasonal cocktail menu and securing numerous additional orders. His speed during peak hours kept the bar queue under three minutes throughout service. His passion for the craft is visible in every drink he makes.",
          reward_suggestion: "Feature on staff noticeboard",
          points: 65,
        },
        {
          name: "Aisha R.",
          badge: "First Impressions",
          message: "Aisha managed a 40-minute waitlist with warmth and professionalism, ensuring zero guest complaints about wait times. Her proactive communication and welcoming energy set the tone for the entire evening. Several guests specifically commented on how pleasant their arrival experience was.",
          reward_suggestion: "Shoutout in team briefing",
          points: 60,
        },
      ],
      team_highlight:
        "Friday night at The Grand Brasserie was exceptional — the team handled 152 covers with composure, creativity and genuine hospitality. A standout performance across all stations that reflects months of hard work and dedication. Thank you all for an incredible shift!",
    },
  },
  {
    date: "2026-05-28",
    venue: "The Grand Brasserie",
    stype: "Lunch service",
    covers: 98,
    parsed: {
      recognitions: [
        {
          name: "Marco D.",
          badge: "Team Anchor",
          message: "Marco kept the floor running seamlessly during what could have been a chaotic midweek lunch. His communication with the kitchen was precise, and he stepped in to cover two tables when Sofia was managing a complex group order. True team player who never needs to be asked twice.",
          reward_suggestion: "Extra break on next shift",
          points: 55,
        },
        {
          name: "Sofia M.",
          badge: "Upsell Star",
          message: "Sofia achieved the highest upsell rate of the week during Wednesday lunch, converting multiple dessert add-ons and wine pairings. Her product knowledge and natural conversation style make upselling feel genuinely helpful rather than pushy. Guests leave feeling like they discovered something, not sold to.",
          reward_suggestion: "Staff recognition board",
          points: 70,
        },
      ],
      team_highlight:
        "A smooth and efficient Wednesday lunch — the team punched above their weight with a lean crew and delivered quality that our regulars noticed. Special mention to Marco and Sofia who showed real initiative and lifted everyone around them.",
    },
  },
  {
    date: "2026-05-24",
    venue: "Rooftop Bar",
    stype: "Event",
    covers: 210,
    parsed: {
      recognitions: [
        {
          name: "James T.",
          badge: "Event MVP",
          message: "James headlined the cocktail station for a 210-cover corporate event with zero hiccups. He prepared ahead of the rush, trained two temporary staff on the fly, and kept energy high throughout a four-hour service. His professionalism under pressure is exactly what makes a great bartender.",
          reward_suggestion: "Bonus shift premium",
          points: 90,
        },
        {
          name: "Aisha R.",
          badge: "VIP Coordinator",
          message: "Aisha managed VIP check-in for 40 guests with flawless organisation and personal attention to each arrival. Three VIP guests personally asked for her name at the end of the evening to pass on their compliments to management. She is the reason first impressions are always immaculate.",
          reward_suggestion: "Employee of the month nomination",
          points: 85,
        },
        {
          name: "Marco D.",
          badge: "Logistics Hero",
          message: "Marco handled all logistics coordination between the kitchen, floor and bar during the event, preventing three potential service failures through quick thinking and clear communication. His behind-the-scenes work was the invisible backbone of a smooth evening.",
          reward_suggestion: "Shoutout at next briefing",
          points: 75,
        },
      ],
      team_highlight:
        "The Rooftop Bar event was a resounding success — 210 covers, zero complaints, and multiple guest compliments sent directly to management. This team showed exactly what professional hospitality looks like under pressure. Incredibly proud of every single one of you.",
    },
  },
];

// ── HELPERS ─────────────────────────────────────────────────────────────
export function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function avatarColors(index) {
  return COLORS[index % COLORS.length];
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

export function buildEmpDataFromHistory(employees, historyData) {
  const data = {};
  employees.forEach((_, i) => { data[i] = { recs: [], badges: [], points: 0 }; });

  historyData.forEach((h) => {
    h.parsed.recognitions.forEach((r) => {
      const i = employees.findIndex((e) => e.name === r.name);
      if (i < 0) return;
      const already = data[i].recs.find((x) => x.date === h.date && x.badge === r.badge);
      if (!already) {
        data[i].recs.push({ date: h.date, message: r.message, badge: r.badge, venue: h.venue });
        data[i].badges.push(r.badge);
        data[i].points += r.points || 50;
      }
    });
  });

  return data;
}
