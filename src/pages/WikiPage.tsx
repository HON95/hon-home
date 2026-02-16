import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

type WikiEntry = { title: string; url: string };
type WikiSection = { name: string; entries: WikiEntry[] };

// Parsed from https://wiki.hon.one/ index page
const wikiData: WikiSection[] = [
  { name: "Authentication, Authorization and Accounting (AAA)", entries: [
    { title: "FreeIPA", url: "https://wiki.hon.one/aaa/freeipa/" },
    { title: "Kerberos", url: "https://wiki.hon.one/aaa/kerberos/" },
  ]},
  { name: "Automation", entries: [
    { title: "Ansible", url: "https://wiki.hon.one/automation/ansible/" },
    { title: "Puppet", url: "https://wiki.hon.one/automation/puppet/" },
    { title: "Terraform", url: "https://wiki.hon.one/automation/terraform/" },
  ]},
  { name: "Cloud", entries: [
    { title: "AWS", url: "https://wiki.hon.one/cloud/aws/" },
    { title: "Azure", url: "https://wiki.hon.one/cloud/azure/" },
    { title: "Cloudflare", url: "https://wiki.hon.one/cloud/cloudflare/" },
    { title: "Google Workspace", url: "https://wiki.hon.one/cloud/google-workspace/" },
  ]},
  { name: "Computers", entries: [
    { title: "Dell OptiPlex Series", url: "https://wiki.hon.one/computers/dell-optiplex/" },
    { title: "Dell PowerEdge Series", url: "https://wiki.hon.one/computers/dell-poweredge/" },
    { title: "HPE ProLiant Series", url: "https://wiki.hon.one/computers/hpe-proliant/" },
    { title: "Laptops", url: "https://wiki.hon.one/computers/laptops/" },
  ]},
  { name: "Containers", entries: [
    { title: "Cisco Catalyst App Hosting", url: "https://wiki.hon.one/containers/cisco-catalyst/" },
    { title: "Docker", url: "https://wiki.hon.one/containers/docker/" },
    { title: "Kubernetes", url: "https://wiki.hon.one/containers/k8s/" },
    { title: "Podman", url: "https://wiki.hon.one/containers/podman/" },
  ]},
  { name: "Crypto", entries: [
    { title: "Headless Linux ETH Mining", url: "https://wiki.hon.one/cryptocurrencies/headless-linux-eth-mining/" },
  ]},
  { name: "Software Engineering", entries: [
    { title: "C/C++ Tools", url: "https://wiki.hon.one/dev/ccpp-tools/" },
    { title: "Clang/LLVM", url: "https://wiki.hon.one/dev/clang-llvm/" },
    { title: "C++ (Language)", url: "https://wiki.hon.one/dev/cpp/" },
    { title: "Data Stuff", url: "https://wiki.hon.one/dev/data/" },
    { title: "Databases", url: "https://wiki.hon.one/dev/db/" },
    { title: "GNU Compiler Collection (GCC)", url: "https://wiki.hon.one/dev/gcc/" },
    { title: "Git", url: "https://wiki.hon.one/dev/git/" },
    { title: "Go (Language)", url: "https://wiki.hon.one/dev/go/" },
    { title: "Licensing", url: "https://wiki.hon.one/dev/licensing/" },
    { title: "OpenMP", url: "https://wiki.hon.one/dev/openmp/" },
    { title: "Rust (Language)", url: "https://wiki.hon.one/dev/rust/" },
    { title: "Web Security", url: "https://wiki.hon.one/dev/web-security/" },
  ]},
  { name: "Game Servers", entries: [
    { title: "Counter-Strike: Global Offensive (CS:GO)", url: "https://wiki.hon.one/game-servers/csgo/" },
    { title: "Minecraft (Bukkit)", url: "https://wiki.hon.one/game-servers/minecraft-bukkit/" },
    { title: "Team Fortress 2 (TF2)", url: "https://wiki.hon.one/game-servers/tf2/" },
  ]},
  { name: "General", entries: [
    { title: "Computer Testing", url: "https://wiki.hon.one/general/computer-testing/" },
    { title: "General", url: "https://wiki.hon.one/general/general/" },
    { title: "Linux General", url: "https://wiki.hon.one/general/linux/" },
  ]},
  { name: "Home Automation", entries: [
    { title: "Home Assistant", url: "https://wiki.hon.one/home-auto/home-assistant/" },
    { title: "Raspberry Pi", url: "https://wiki.hon.one/home-auto/raspberry-pi/" },
  ]},
  { name: "High-Performance Computing (HPC)", entries: [
    { title: "Betzy (Supercomputer)", url: "https://wiki.hon.one/hpc/betzy/" },
    { title: "Containers", url: "https://wiki.hon.one/hpc/containers/" },
    { title: "CUDA", url: "https://wiki.hon.one/hpc/cuda/" },
    { title: "Enroot", url: "https://wiki.hon.one/hpc/enroot/" },
    { title: "HIP", url: "https://wiki.hon.one/hpc/hip/" },
    { title: "Interconnects", url: "https://wiki.hon.one/hpc/interconnects/" },
    { title: "Open MPI", url: "https://wiki.hon.one/hpc/openmpi/" },
    { title: "ROCm", url: "https://wiki.hon.one/hpc/rocm/" },
    { title: "Singularity", url: "https://wiki.hon.one/hpc/singularity/" },
    { title: "Slurm", url: "https://wiki.hon.one/hpc/slurm/" },
    { title: "Vilje (Supercomputer)", url: "https://wiki.hon.one/hpc/vilje/" },
  ]},
  { name: "Lighting", entries: [
    { title: "DMX512", url: "https://wiki.hon.one/lighting/dmx512/" },
    { title: "Lighting Basics", url: "https://wiki.hon.one/lighting/lighting-basics/" },
    { title: "Obsidian Onyx", url: "https://wiki.hon.one/lighting/obsidian-onyx/" },
  ]},
  { name: "Linux Servers", entries: [
    { title: "Linux Server Applications", url: "https://wiki.hon.one/linux-servers/applications/" },
    { title: "Ceph", url: "https://wiki.hon.one/linux-servers/ceph/" },
    { title: "CockroachDB (CRDB)", url: "https://wiki.hon.one/linux-servers/db-crdb/" },
    { title: "Debian Server", url: "https://wiki.hon.one/linux-servers/debian/" },
    { title: "RabbitMQ", url: "https://wiki.hon.one/linux-servers/rabbitmq/" },
    { title: "Linux Server Storage", url: "https://wiki.hon.one/linux-servers/storage/" },
    { title: "ZFS", url: "https://wiki.hon.one/linux-servers/zfs/" },
  ]},
  { name: "Media", entries: [
    { title: "Audio Basics", url: "https://wiki.hon.one/media/audio-basics/" },
    { title: "Behringer X32", url: "https://wiki.hon.one/media/behringer-x32/" },
    { title: "FFmpeg", url: "https://wiki.hon.one/media/ffmpeg/" },
    { title: "GoPro", url: "https://wiki.hon.one/media/gopro/" },
    { title: "Image Basics", url: "https://wiki.hon.one/media/image-basics/" },
    { title: "Network Device Interface (NDI)", url: "https://wiki.hon.one/media/ndi/" },
    { title: "Open Broadcaster Software (OBS)", url: "https://wiki.hon.one/media/obs/" },
    { title: "Video4Linux 2 (V4L2)", url: "https://wiki.hon.one/media/v4l2/" },
    { title: "Video Basics", url: "https://wiki.hon.one/media/video-basics/" },
    { title: "Video Processing", url: "https://wiki.hon.one/media/video-processing/" },
    { title: "Video Ripping", url: "https://wiki.hon.one/media/video-ripping/" },
    { title: "Video Streaming", url: "https://wiki.hon.one/media/video-streaming/" },
    { title: "VLC", url: "https://wiki.hon.one/media/vlc/" },
    { title: "youtube-dl", url: "https://wiki.hon.one/media/youtube-dl/" },
  ]},
  { name: "Monitoring", entries: [
    { title: "Grafana", url: "https://wiki.hon.one/monitoring/grafana/" },
    { title: "Grafana Loki", url: "https://wiki.hon.one/monitoring/loki/" },
    { title: "Prometheus", url: "https://wiki.hon.one/monitoring/prometheus/" },
  ]},
  { name: "Networking", entries: [
    { title: "Network Architecture", url: "https://wiki.hon.one/networking/architecture/" },
    { title: "Border Gateway Protocol (BGP)", url: "https://wiki.hon.one/networking/bgp/" },
    { title: "BGP EVPN VXLAN Fabrics", url: "https://wiki.hon.one/networking/bgp-evpn-vxlan/" },
    { title: "Brocade FastIron Switches", url: "https://wiki.hon.one/networking/brocade-fastiron-switches/" },
    { title: "Cisco Application Centric Infrastructure (ACI)", url: "https://wiki.hon.one/networking/cisco-aci/" },
    { title: "Cisco General", url: "https://wiki.hon.one/networking/cisco-general/" },
    { title: "Cisco General (IOS/IOS XE)", url: "https://wiki.hon.one/networking/cisco-ios-general/" },
    { title: "Cisco Routers (IOS/IOS XE)", url: "https://wiki.hon.one/networking/cisco-ios-routers/" },
    { title: "Cisco Catalyst Switches (IOS/IOS XE)", url: "https://wiki.hon.one/networking/cisco-ios-switches/" },
    { title: "Cisco Identity Services Engine (ISE)", url: "https://wiki.hon.one/networking/cisco-ise/" },
    { title: "Cisco Nexus Switches (NX-OS)", url: "https://wiki.hon.one/networking/cisco-nxos-switches/" },
    { title: "Cisco Software-Defined Access (SDA)", url: "https://wiki.hon.one/networking/cisco-sda/" },
    { title: "Fibers & Fiber Optics", url: "https://wiki.hon.one/networking/fiber/" },
    { title: "FS FSOS Switches", url: "https://wiki.hon.one/networking/fs-fsos-switches/" },
    { title: "General", url: "https://wiki.hon.one/networking/general/" },
    { title: "HPE/Aruba General", url: "https://wiki.hon.one/networking/hpe-aruba-general/" },
    { title: "IPv4 Theory", url: "https://wiki.hon.one/networking/ipv4/" },
    { title: "IPv6 Theory", url: "https://wiki.hon.one/networking/ipv6/" },
    { title: "Juniper EX Series Switches", url: "https://wiki.hon.one/networking/juniper-ex/" },
    { title: "Juniper EX3300 Fan Mod", url: "https://wiki.hon.one/networking/juniper-ex3300-fanmod/" },
    { title: "Juniper Junos OS", url: "https://wiki.hon.one/networking/juniper-junos/" },
    { title: "Juniper SRX Series Firewalls", url: "https://wiki.hon.one/networking/juniper-srx/" },
    { title: "Linksys LGS Switches", url: "https://wiki.hon.one/networking/linksys-lgs/" },
    { title: "Linux Switching & Routing", url: "https://wiki.hon.one/networking/linux/" },
    { title: "Multicast", url: "https://wiki.hon.one/networking/multicast/" },
    { title: "Open Shortest Path First (OSPF)", url: "https://wiki.hon.one/networking/ospf/" },
    { title: "pfSense", url: "https://wiki.hon.one/networking/pfsense/" },
    { title: "Routing", url: "https://wiki.hon.one/networking/routing/" },
    { title: "Network Security", url: "https://wiki.hon.one/networking/security/" },
    { title: "Switching", url: "https://wiki.hon.one/networking/switching/" },
    { title: "TP-Link JetStream Switches", url: "https://wiki.hon.one/networking/tplink-jetstream-switches/" },
    { title: "Ubiquiti EdgeSwitch", url: "https://wiki.hon.one/networking/ubiquiti-edgeswitch/" },
    { title: "Ubiquiti UniFi Access Points", url: "https://wiki.hon.one/networking/ubiquiti-unifi-aps/" },
    { title: "Ubiquiti UniFi Controllers", url: "https://wiki.hon.one/networking/ubiquiti-unifi-controllers/" },
    { title: "VyOS", url: "https://wiki.hon.one/networking/vyos/" },
    { title: "WLAN Theory", url: "https://wiki.hon.one/networking/wlan/" },
    { title: "Wi-Fi Protected Access (WPA)", url: "https://wiki.hon.one/networking/wpa/" },
    { title: "Zero Trust Networking", url: "https://wiki.hon.one/networking/zero-trust/" },
  ]},
  { name: "Personal Devices", entries: [
    { title: "Android", url: "https://wiki.hon.one/personal-devices/android/" },
    { title: "PC Applications", url: "https://wiki.hon.one/personal-devices/applications/" },
    { title: "Arch Linux", url: "https://wiki.hon.one/personal-devices/arch/" },
    { title: "Kubuntu", url: "https://wiki.hon.one/personal-devices/kubuntu/" },
    { title: "Linux", url: "https://wiki.hon.one/personal-devices/linux/" },
    { title: "Manjaro (KDE)", url: "https://wiki.hon.one/personal-devices/manjaro-kde/" },
    { title: "Windows", url: "https://wiki.hon.one/personal-devices/windows/" },
  ]},
  { name: "Power", entries: [
    { title: "APC PDUs", url: "https://wiki.hon.one/power/apc-pdus/" },
  ]},
  { name: "Service", entries: [
    { title: "DNS Theory", url: "https://wiki.hon.one/services/dns/" },
    { title: "Email Theory", url: "https://wiki.hon.one/services/email/" },
    { title: "Internet Governance and Registries", url: "https://wiki.hon.one/services/inet-gov-reg/" },
    { title: "Network Time Protocol (NTP)", url: "https://wiki.hon.one/services/ntp/" },
    { title: "Precision Time Protocol (PTP)", url: "https://wiki.hon.one/services/ptp/" },
  ]},
  { name: "Virtualization", entries: [
    { title: "libvirt & KVM", url: "https://wiki.hon.one/virtualization/libvirt-kvm/" },
    { title: "Proxmox VE", url: "https://wiki.hon.one/virtualization/proxmox-ve/" },
    { title: "VirtualBox", url: "https://wiki.hon.one/virtualization/virtualbox/" },
  ]},
];

const totalEntries = wikiData.reduce((sum, s) => sum + s.entries.length, 0);

const WikiPage = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return wikiData;
    return wikiData
      .map((section) => ({
        ...section,
        entries: section.entries.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            section.name.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.entries.length > 0);
  }, [search]);

  const matchCount = filtered.reduce((sum, s) => sum + s.entries.length, 0);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">HON's Wiki</h1>
          </div>
          <p className="text-muted-foreground text-sm mb-1">
            Random collection of config notes and miscellanea.{" "}
            <span className="italic">Technically not a wiki.</span>
          </p>
          <p className="text-muted-foreground text-xs mb-8">
            {wikiData.length} sections · {totalEntries} pages ·{" "}
            <a
              href="https://wiki.hon.one/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit original wiki ↗
            </a>
          </p>

          {/* Search */}
          <div className="relative mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wiki pages..."
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              spellCheck={false}
            />
            {search && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                {matchCount} result{matchCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </motion.div>

        {/* Sections */}
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center font-mono text-sm py-12">
            No pages matching "{search}" 🤷
          </p>
        ) : (
          <div className="space-y-8">
            {filtered.map((section, i) => (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
              >
                <h2 className="font-mono text-primary text-xs tracking-widest uppercase mb-3">
                  {section.name}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {section.entries.map((entry) => (
                    <a
                      key={entry.url}
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2.5 hover:border-primary/40 transition-all duration-200 hover:shadow-[0_0_15px_hsl(170_60%_50%/0.08)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {entry.title}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default WikiPage;
