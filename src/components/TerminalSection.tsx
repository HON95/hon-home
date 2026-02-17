import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

let cachedIp: string | null = null;

const fetchRealIp = async (): Promise<string> => {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    cachedIp = data.ip;
    return data.ip;
  } catch {
    return "?.?.?.?";
  }
};

const COMMANDS: Record<string, string | (() => string | Promise<string>)> = {
  help: "Available commands: help, ip, skills, projects, uptime, ping, whois, clear",
  skills: "Rust • Go • C++ • Python • Docker • Prometheus • Linux • Networking • IoT",
  projects: "prometheus-nut-exporter (⭐133) | prometheus-esp8266-dht-exporter (⭐42) | wiki | configs",
  uptime: `Uptime: ${Math.floor((Date.now() - new Date("2010-01-01").getTime()) / 86400000)} days (since first GitHub commit)`,
  ping: "PONG! 🏓 latency: 0.42ms",
  ip: async () => {
    const ip = await fetchRealIp();
    return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    link/loopback 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether de:ad:be:ef:ca:fe
    inet ${ip}/24 scope global eth0`;
  },
  whois: `% RIPE Database Query — AS211767

aut-num:       AS211767
as-name:       HON-PERSONAL-AS
descr:         Håvard's personal ASN
org:           ORG-HON1-RIPE
admin-c:       HON95-RIPE
status:        ASSIGNED
remarks:       Because running BGP at home is a perfectly normal hobby.
remarks:       "It's not hoarding if it's network infrastructure."
created:       Yes
last-modified: Probably recently
source:        RIPE # Filtered (with love)`,
};

const TerminalSection = () => {
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([
    { cmd: "", output: 'Welcome to HON95 terminal. Type "help" to get started.' },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (!hasInteracted.current) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd || loading) return;
    hasInteracted.current = true;

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const raw = COMMANDS[cmd];
    if (!raw) {
      setHistory((h) => [...h, { cmd: input, output: `command not found: ${cmd}. Try "help"` }]);
      setInput("");
      return;
    }

    if (typeof raw === "function") {
      const result = raw();
      if (result instanceof Promise) {
        setHistory((h) => [...h, { cmd: input, output: "Loading..." }]);
        setInput("");
        setLoading(true);
        const output = await result;
        setHistory((h) => {
          const updated = [...h];
          updated[updated.length - 1] = { ...updated[updated.length - 1], output };
          return updated;
        });
        setLoading(false);
      } else {
        setHistory((h) => [...h, { cmd: input, output: result }]);
        setInput("");
      }
    } else {
      setHistory((h) => [...h, { cmd: input, output: raw }]);
      setInput("");
    }
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            # Terminal
          </h2>
          <div className="h-px bg-border mb-10" />

          <div
            className="bg-card border border-border rounded-lg overflow-hidden cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border-b border-border">
              <span className="w-3 h-3 rounded-full bg-destructive/70" />
              <span className="w-3 h-3 rounded-full opacity-70" style={{ backgroundColor: "hsl(45, 80%, 55%)" }} />
              <span className="w-3 h-3 rounded-full opacity-70" style={{ backgroundColor: "hsl(140, 60%, 45%)" }} />
              <span className="ml-3 font-mono text-xs text-muted-foreground">hon95@norway</span>
            </div>

            {/* Terminal body */}
            <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
              {history.map((entry, i) => (
                <div key={i} className="mb-2">
                  {entry.cmd && (
                    <div className="flex gap-2">
                      <span className="text-primary">$</span>
                      <span className="text-foreground">{entry.cmd}</span>
                    </div>
                  )}
                  <pre className="text-muted-foreground whitespace-pre-wrap text-xs mt-0.5 ml-4">
                    {entry.output}
                  </pre>
                </div>
              ))}

              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <span className="text-primary">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground caret-primary"
                  
                  spellCheck={false}
                  disabled={loading}
                />
              </form>
              <div ref={endRef} />
            </div>
          </div>
          <p className="text-muted-foreground text-xs mt-3 text-center">
            Try typing <span className="text-primary font-mono">ip</span>, <span className="text-primary font-mono">whois</span>, or <span className="text-primary font-mono">skills</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalSection;
