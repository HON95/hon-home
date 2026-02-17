import { motion } from "framer-motion";

interface Meme {
  title: string;
  text: string;
  subtext?: string;
  emoji: string;
}

const memes: Meme[] = [
  {
    emoji: "🧅",
    title: "Siegmeyer Moment",
    text: "\"Hmmmm... Mmm...\"",
    subtext: "— Siegmeyer, doing absolutely nothing for the 5th hour straight while you clear the entire area for him",
  },
  {
    emoji: "☀️",
    title: "\\[T]/ PRAISE THE SUN",
    text: "If only I could be so grossly incandescent...",
    subtext: "Me at 3 AM explaining to my cat why Solaire is the greatest NPC ever written",
  },
  {
    emoji: "🦶",
    title: "Trusty Patches",
    text: "\"Go on, there's treasure down there.\"",
    subtext: "Narrator: There was no treasure. Only gravity.",
  },
  {
    emoji: "💀",
    title: "First Time in Blighttown",
    text: "FPS: 4. Toxic: Yes. Lost: Yes. Poisoned: Yes.",
    subtext: "\"This is fine. Everything is fine. I chose to come here.\"",
  },
  {
    emoji: "🐉",
    title: "The Bridge Drake",
    text: "Walks onto bridge casually → Gets incinerated",
    subtext: "Every first playthrough. Every. Single. One.",
  },
  {
    emoji: "🪦",
    title: "Bed of Chaos",
    text: "Died to a tree. Again. A TREE.",
    subtext: "FromSoftware's greatest achievement in making players hate botany",
  },
  {
    emoji: "📦",
    title: "Mimics",
    text: "Finally! A chest! Let me just open— CHOMP",
    subtext: "Trust issues: Origin story. Always hit the chest first.",
  },
  {
    emoji: "🔥",
    title: "Link the Fire?",
    text: "You either die Hollow or live long enough to become fuel",
    subtext: "The original trolley problem but the trolley is on fire and so are you",
  },
  {
    emoji: "🐕",
    title: "Capra Demon",
    text: "It's not the boss. It's the TWO DOGS in a PHONE BOOTH.",
    subtext: "Hardest boss in the game is the camera angle",
  },
  {
    emoji: "⚔️",
    title: "Ornstein & Smough",
    text: "\"Which one do I kill first?\" — Yes.",
    subtext: "The original gank squad. Summoning Solaire is not optional, it's therapy.",
  },
  {
    emoji: "🏃",
    title: "The Run Back",
    text: "Boss died? No. But the 5-minute corpse run sure builds character.",
    subtext: "Speedrunning the level to die in 3 seconds. Again.",
  },
  {
    emoji: "📝",
    title: "Soapstone Messages",
    text: "\"Try jumping\" next to every cliff edge",
    subtext: "Community trust level: -9000. But you still jump. Just in case.",
  },
];

const DarkSoulsMemes = () => {
  return (
    <section className="py-24 px-6 bg-muted/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            # Souls Memes
          </h2>
          <p className="text-muted-foreground text-sm mb-2">
            Emotional damage from Lordran, curated.
          </p>
          <div className="h-px bg-border mb-10" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memes.map((meme, i) => (
            <motion.div
              key={meme.title}
              className="group bg-card border border-border rounded-lg p-5 hover:border-amber-400/30 transition-all duration-300 hover:shadow-[0_0_20px_hsl(45_80%_50%/0.08)] flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="text-3xl mb-3">{meme.emoji}</div>
              <h3 className="font-serif font-semibold text-sm text-foreground mb-2">
                {meme.title}
              </h3>
              <p className="text-amber-400/80 text-sm font-serif italic mb-2 leading-relaxed">
                {meme.text}
              </p>
              {meme.subtext && (
                <p className="text-muted-foreground text-xs leading-relaxed mt-auto pt-2 border-t border-border/50">
                  {meme.subtext}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DarkSoulsMemes;
