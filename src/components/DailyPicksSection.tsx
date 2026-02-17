import { motion } from "framer-motion";
import { Sword, Network, HardDrive } from "lucide-react";

interface DailyEntry {
  name: string;
  description: string;
}

const soulsItems: DailyEntry[] = [
  { name: "Estus Flask", description: "An Undead favourite. Fill it at bonfires. Heals HP. Tastes like warm despair and campfire ash." },
  { name: "Humanity", description: "A tiny black sprite. Restores human form, kindles bonfires, and attracts invaders who want your blood." },
  { name: "Sunlight Medal", description: "Proof of jolly cooperation. Earned by helping others defeat bosses. Solaire would be proud. \\[T]/" },
  { name: "Titanite Slab", description: "The rarest upgrade material. One per playthrough. Choose wisely, or start NG+ and cry again." },
  { name: "Homeward Bone", description: "Warps you to the last bonfire. The coward's escape route. No shame — survival is survival." },
  { name: "Ring of Favor and Protection", description: "Boosts HP, stamina, and equip load. Breaks when removed. Commitment issues? Don't equip it." },
  { name: "Dried Finger", description: "Allows more phantoms in your world. More friends! Also more invaders. Mostly more invaders." },
  { name: "Zweihander", description: "A colossal greatsword. The legend's weapon of choice. Bass cannon not included." },
  { name: "Black Knight Halberd", description: "If this drops from the first Black Knight, congratulations — you've won Dark Souls." },
  { name: "Mask of the Father", description: "Boosts equip load. Part of the Giant Dad build. 'What rings u got?' — the community, forever." },
  { name: "Ember", description: "Remnants of the First Flame. Restores your power in DS3. Also makes you glow like a tasty target." },
  { name: "Siegbräu", description: "Siegward's personal brew. Heals you and warms the soul. Best consumed after defeating Yhorm together." },
  { name: "Crimson Flask", description: "Elden Ring's healing flask. Basically Estus with a rebrand. The Tarnished marketing department at work." },
  { name: "Rune Arc", description: "Activates your Great Rune in Elden Ring. Rare enough that you'll hoard 50 and never use one." },
  { name: "Furlcalling Finger Remedy", description: "Reveals summon signs. Because jolly cooperation transcends every Souls game." },
  { name: "Mimic Tear Ashes", description: "Summons a copy of yourself. Pre-nerf it was basically a second player. Still amazing." },
  { name: "Moonveil", description: "Elden Ring's most popular katana. Fires magic slashes. PvP players will groan when they see it." },
  { name: "Soap Stone", description: "Leave messages for other players. 'Try finger, but hole' — a literary masterpiece, really." },
];

const protocols: DailyEntry[] = [
  { name: "BGP (Border Gateway Protocol)", description: "The routing protocol that holds the internet together with duct tape and trust. One misconfiguration and half the internet goes down. AS211767 knows this well." },
  { name: "OSPF (Open Shortest Path First)", description: "A link-state routing protocol. Calculates shortest paths using Dijkstra's algorithm. Your router's GPS navigator." },
  { name: "DNS (Domain Name System)", description: "Translates domain names to IP addresses. The internet's phone book. When it breaks, everything breaks. It's always DNS." },
  { name: "DHCP (Dynamic Host Configuration Protocol)", description: "Automatically assigns IP addresses. Without it, you'd be manually configuring every device. The unsung hero of lazy networking." },
  { name: "ARP (Address Resolution Protocol)", description: "Maps IP addresses to MAC addresses on a local network. Simple, essential, and hilariously easy to spoof." },
  { name: "ICMP (Internet Control Message Protocol)", description: "The protocol behind ping and traceroute. Also used by your network admin to see if things are alive. Spoiler: they're not." },
  { name: "NTP (Network Time Protocol)", description: "Keeps all your clocks synchronized. Without it, your logs would be useless and Kerberos would cry." },
  { name: "SNMP (Simple Network Management Protocol)", description: "Monitors network devices. 'Simple' is generous. Community strings are basically passwords in plaintext." },
  { name: "VRRP (Virtual Router Redundancy Protocol)", description: "Provides automatic router failover. Because one router going down shouldn't take your entire network with it." },
  { name: "STP (Spanning Tree Protocol)", description: "Prevents broadcast storms in switched networks by blocking redundant paths. Slow but reliable. Like a turtle. Dog?" },
  { name: "LLDP (Link Layer Discovery Protocol)", description: "Devices announce themselves to neighbors. Like networking small talk. 'Hi, I'm a switch on port 24.'" },
  { name: "RADIUS (Remote Authentication Dial-In User Service)", description: "Centralized authentication for network access. The bouncer of enterprise Wi-Fi." },
  { name: "SSH (Secure Shell)", description: "Encrypted remote access. If you're still using Telnet, we need to talk. Seriously." },
  { name: "MQTT (Message Queuing Telemetry Transport)", description: "Lightweight messaging for IoT. Perfect for ESP8266 sensors reporting temperature to Grafana at 3 AM." },
  { name: "WireGuard", description: "Modern VPN protocol. Fast, simple, and the config fits on a napkin. The future of tunneling." },
];

const filesystems: DailyEntry[] = [
  { name: "ZFS", description: "The last word in filesystems. Copy-on-write, checksums, snapshots, compression. Your data has never been safer. Your RAM has never been more consumed." },
  { name: "ext4", description: "Linux's reliable workhorse. Not flashy, not exciting, but it just works. The Honda Civic of filesystems." },
  { name: "Btrfs", description: "Linux's CoW filesystem. Snapshots, subvolumes, compression. Great until your RAID5/6 array eats your data." },
  { name: "XFS", description: "High-performance journaling filesystem. Excels at large files and parallel I/O. Red Hat's favourite." },
  { name: "NTFS", description: "Windows' filesystem. Journals, ACLs, compression. Works great on Windows. Works... interestingly on Linux." },
  { name: "FAT32", description: "Universal compatibility, 4GB file size limit. The USB drive filesystem that refuses to die. Like an Undead." },
  { name: "tmpfs", description: "RAM-backed filesystem. Blazing fast, completely volatile. Everything disappears on reboot. Like your souls when you die." },
  { name: "NFS (Network File System)", description: "Share files over the network. Simple, mature, and the cause of many 'stale file handle' errors at 2 AM." },
  { name: "CIFS/SMB", description: "Windows file sharing. Works everywhere, configured nowhere correctly. Samba config is its own Dark Souls boss." },
  { name: "OverlayFS", description: "Layers filesystems on top of each other. Docker's best friend. Containers wouldn't exist without it." },
  { name: "squashfs", description: "Read-only compressed filesystem. Used in live CDs and container images. Small, fast, immutable." },
  { name: "FUSE", description: "Filesystem in Userspace. Mount anything as a filesystem — S3 buckets, Google Drive, your hopes and dreams." },
  { name: "procfs (/proc)", description: "Virtual filesystem exposing kernel and process info. Not a real filesystem. More of a window into the matrix." },
  { name: "F2FS", description: "Flash-Friendly File System. Optimized for NAND flash. Your phone probably uses it. Samsung's gift to storage." },
  { name: "CephFS", description: "Distributed filesystem built on Ceph. Scales to petabytes. Also scales your complexity to petabytes." },
];

// Deterministic daily pick based on date
const getDailyIndex = (seed: number, length: number) => {
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / 86400000);
  return (daysSinceEpoch + seed) % length;
};

const DailyPicksSection = () => {
  const item = soulsItems[getDailyIndex(0, soulsItems.length)];
  const protocol = protocols[getDailyIndex(7, protocols.length)];
  const fs = filesystems[getDailyIndex(13, filesystems.length)];

  const picks = [
    { icon: Sword, label: "Souls Item of the Day", entry: item },
    { icon: Network, label: "Protocol of the Day", entry: protocol },
    { icon: HardDrive, label: "Filesystem of the Day", entry: fs },
  ];

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
            # Daily Picks
          </h2>
          <div className="h-px bg-border mb-10" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {picks.map((pick, i) => (
            <motion.div
              key={pick.label}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <pick.icon className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-primary uppercase tracking-wider">
                  {pick.label}
                </span>
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-2">
                {pick.entry.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pick.entry.description}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-muted-foreground/50 text-xs text-center mt-6 font-mono">
          Rotates daily. All descriptions are AI-generated and probably wrong.
        </p>
      </div>
    </section>
  );
};

export default DailyPicksSection;
