import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const getIpCommand = (): string => {
  // Generate fake but realistic-looking addresses
  const ipv4 = `${10}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*254)+1}`;
  const ipv6Seg = () => Math.floor(Math.random()*65535).toString(16).padStart(4, '0');
  const ipv6 = `fd${ipv6Seg().slice(0,2)}:${ipv6Seg()}:${ipv6Seg()}::${ipv6Seg().slice(-4)}/64`;
  return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    link/loopback 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether de:ad:be:ef:ca:fe
    inet ${ipv4}/24 brd ${ipv4.split('.').slice(0,3).join('.')}.255 scope global eth0
    inet6 ${ipv6} scope global`;
};

const COMMANDS: Record<string, string | (() => string)> = {
  help: "Available commands: help, ip, skills, projects, uptime, ping, whois, clear",
  skills: "Rust • Go • C++ • Python • Docker • Prometheus • Linux • Networking • IoT",
  projects: "prometheus-nut-exporter (⭐133) | prometheus-esp8266-dht-exporter (⭐42) | wiki | configs",
  uptime: `Uptime: ${Math.floor((Date.now() - new Date("2010-01-01").getTime()) / 86400000)} days (since first GitHub commit)`,
  ping: "PONG! 🏓 latency: 0.42ms",
  ip: getIpCommand,
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
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const raw = COMMANDS[cmd];
    const output = raw ? (typeof raw === "function" ? raw() : raw) : `command not found: ${cmd}. Try "help"`;
    setHistory((h) => [...h, { cmd: input, output }]);
    setInput("");
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
                  autoFocus
                  spellCheck={false}
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
