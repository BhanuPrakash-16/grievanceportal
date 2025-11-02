import React, { Component } from "react";
import { FaHome, FaRegFileAlt, FaUserShield, FaCog } from "react-icons/fa";

// Stat card tooltip info
const ADMIN_STAT_TOOLTIPS = {
  "Open Complaints":
    "All unresolved, in progress, or under review complaints in the system.",
  Resolved: "Complaints marked as Resolved and closed.",
  "Avg Resolution": "Average number of days taken to resolve complaints."
};

function Tooltip({ show, x, y, text }) {
  if (!show) return null;
  return (
    <div
      className="fixed z-50 bg-purple-900 text-white text-xs md:text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none transition-all duration-200"
      style={{
        top: y + 15,
        left: x + 15,
        whiteSpace: "nowrap"
      }}
    >
      {text}
    </div>
  );
}

function StatCard({ title, value, gradient, onHover, onLeave }) {
  return (
    <div
      className="flex-1 min-w-[150px] max-w-[250px] h-28 rounded-2xl flex flex-col justify-center items-center shadow-md m-2 cursor-pointer transition-transform transform hover:scale-105"
      style={{
        background: gradient,
        color: "#fff",
        fontWeight: "bold"
      }}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      onTouchEnd={onLeave}
    >
      <div className="text-sm md:text-base opacity-80 mb-2">{title}</div>
      <div className="text-2xl md:text-3xl font-extrabold">{value}</div>
    </div>
  );
}

function RecentComplaintsBox({ complaints }) {
  return (
    <div className="w-full mt-7">
      <div className="mb-1 ml-1 text-sm text-purple-700 font-bold">
        Recent Complaints Quickview
      </div>
      <div className="flex flex-wrap gap-3">
        {complaints.length ? (
          complaints.slice(0, 4).map((c, i) => (
            <div
              key={i}
              className="rounded-xl bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 shadow flex-1 p-4 min-w-[180px] max-w-[330px] border border-purple-100 hover:border-pink-400 transition group"
            >
              <div className="font-bold mb-1 text-purple-800 group-hover:text-pink-500 transition">
                #{c.id}
              </div>
              <div className="text-xs opacity-70 mb-0.5">
                User: <span className="font-semibold">{c.username || c.user || "Anonymous"}</span>
              </div>
              <div className="text-xs opacity-70 mb-0.5">
                Category: <span className="font-semibold">{c.category}</span>
              </div>
              <div
                className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 mb-2 ${
                  c.status === "Resolved" || c.status === "RESOLVED"
                    ? "bg-green-100 text-green-700"
                    : c.status === "Under Review" || c.status === "IN_PROGRESS"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {c.status}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {c.date ? new Date(c.date).toLocaleDateString() : new Date(c.id).toLocaleDateString()}
              </div>
              <a
                href={`/admin/complaints/${c.id}`}
                className="inline-block mt-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white text-xs font-semibold shadow hover:scale-110 transition"
              >
                View
              </a>
            </div>
          ))
        ) : (
          <span className="italic text-gray-400 py-5 text-sm">
            No recent complaints.
          </span>
        )}
      </div>
    </div>
  );
}

// Pie chart for complaint categories
class PieChart extends Component {
  state = { hovered: null, x: 0, y: 0 };
  handleHover = (idx, e) => {
    const ev = e.touches ? e.touches[0] : e;
    this.setState({ hovered: idx, x: ev.clientX, y: ev.clientY });
  };
  handleLeave = () => this.setState({ hovered: null });
  render() {
    const { data } = this.props;
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let last = 0;
    return (
      <div className="relative flex flex-col items-center min-h-[110px]">
        <svg width="90" height="90" viewBox="0 0 32 32">
          {data.map((d, idx) => {
            const percent = d.value / total;
            const dash = percent * 100;
            const empty = 100 - dash;
            const rotate = last;
            const isActive = idx === this.state.hovered;
            last += percent * 360;
            return (
              <circle
                key={d.label}
                r={isActive ? "15" : "14.5"}
                cx="16"
                cy="16"
                fill="transparent"
                stroke={d.color}
                strokeWidth={isActive ? "12" : "10"}
                strokeDasharray={`${dash} ${empty}`}
                strokeDashoffset={-25 - (idx ? last - 360 : 0)}
                style={{
                  transform: `rotate(${rotate}deg)`,
                  transformOrigin: "center",
                  cursor: "pointer",
                  filter: isActive ? "drop-shadow(0 0 8px #a21caf77)" : "none",
                  transition: "all .17s"
                }}
                onMouseMove={(e) => this.handleHover(idx, e)}
                onMouseLeave={this.handleLeave}
                onTouchStart={(e) => this.handleHover(idx, e)}
                onTouchEnd={this.handleLeave}
              />
            );
          })}
        </svg>
        <Tooltip
          show={this.state.hovered !== null}
          x={this.state.x}
          y={this.state.y}
          text={
            this.state.hovered !== null
              ? `${data[this.state.hovered].label}: ${data[this.state.hovered].value} complaints`
              : ""
          }
        />
      </div>
    );
  }
}

// Trends line chart for admin trends
class TrendsLineChart extends Component {
  state = { hovered: null, x: 0, y: 0 };
  handleHover = (idx, e) => {
    const ev = e.touches ? e.touches[0] : e;
    this.setState({ hovered: idx, x: ev.clientX, y: ev.clientY });
  };
  handleLeave = () => this.setState({ hovered: null });
  render() {
    const { data } = this.props;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Today"];
    return (
      <div className="relative flex flex-col items-center">
        <svg width="220" height="80" viewBox="0 0 220 80" className="mb-2 mt-3">
          <polyline
            fill="none"
            stroke="#f472b6"
            strokeWidth="4"
            points={data.map((v, i) => `${10 + i * 30},${70 - v * 6}`).join(" ")}
          />
          {data.map((v, i) => (
            <circle
              key={i}
              cx={10 + i * 30}
              cy={70 - v * 6}
              r={this.state.hovered === i ? 8 : 5}
              fill="#a21caf"
              stroke={this.state.hovered === i ? "#fbbf24" : "#fff"}
              strokeWidth={this.state.hovered === i ? 4 : 2}
              onMouseMove={(e) => this.handleHover(i, e)}
              onMouseLeave={this.handleLeave}
              onTouchStart={(e) => this.handleHover(i, e)}
              onTouchEnd={this.handleLeave}
              style={{
                cursor: "pointer",
                filter: this.state.hovered === i ? "drop-shadow(0 0 9px #f472b655)" : "none",
                transition: "all .1s"
              }}
            />
          ))}
        </svg>
        <Tooltip
          show={this.state.hovered !== null}
          x={this.state.x}
          y={this.state.y}
          text={
            this.state.hovered !== null
              ? `Complaints: ${data[this.state.hovered]} (${days[this.state.hovered]})`
              : ""
          }
        />
        <div className="text-xs text-gray-500 mt-1">Sun - Today</div>
      </div>
    );
  }
}

// Admin pill navbar
const AdminBottomNav = () => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto z-50 px-2">
    <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
      {[
        { href: "/admin", icon: <FaHome />, label: "Dashboard", bg: "from-orange-400 to-pink-500" },
        { href: "/admin/complaints", icon: <FaRegFileAlt />, label: "Complaints", bg: "from-pink-400 to-blue-500" },
        { href: "/admin/users", icon: <FaUserShield />, label: "Users", bg: "from-green-400 to-cyan-500" },
        { href: "/admin/settings", icon: <FaCog />, label: "Settings", bg: "from-purple-500 to-yellow-500" }
      ].map((btn, idx) => (
        <a
          key={idx}
          href={btn.href}
          className={`flex flex-col items-center justify-center w-[95px] h-[48px] text-sm font-semibold text-white rounded-2xl shadow-lg transition-transform hover:scale-105 bg-gradient-to-br ${btn.bg}`}
        >
          {btn.icon}
          <span className="text-xs mt-0.5">{btn.label}</span>
        </a>
      ))}
    </div>
  </div>
);

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allComplaints: [],
      openCount: 0,
      resolvedCount: 0,
      avgTime: 0,
      thisWeek: 0,
      thisMonth: 0,
      trendData: [0, 0, 0, 0, 0, 0, 0],
      catBreakdown: [],
      responseTimes: [],
      recentComplaints: [],
      statHover: null,
      statCoords: { x: 0, y: 0 }
    };
  }

  componentDidMount() {
    const stored = window.sessionStorage.getItem("complaints_all");
    if (stored) {
      const all = JSON.parse(stored);

      // Open/resolved
      const openCount = all.filter((c) =>
        ["Open", "Complaint Submitted", "In Progress", "Under Review", "NEW", "IN_PROGRESS"].includes(c.status)
      ).length;
      const resolved = all.filter((c) =>
        ["Resolved", "RESOLVED"].includes(c.status)
      );

      const resolvedCount = resolved.length;

      // ~~ RESOLUTION TIME CALCULATED HERE ~~
      // Assumes each 'resolved' complaint contains something like: { date, resolvedDate }
      const avgTime = resolved.length
        ? Math.round(
            resolved
              .map((c) => {
                // You must ensure your resolved complaints have both date and resolvedDate
                // If you do not track resolvedDate separately, fallback: treat resolvedDate as date
                const d1 = new Date(c.date || c.id);
                const d2 = new Date(c.resolvedDate || c.date || c.id);
                return Math.max(
                  Math.round((d2 - d1) / (24 * 60 * 60 * 1000)),
                  0
                );
              })
              .reduce((a, b) => a + b, 0) / resolved.length
          )
        : 0;

      const now = new Date();
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      const thisWeek = all.filter((c) => {
        const dateVal = c.date || c.id;
        return new Date(dateVal).getTime() >= oneWeekAgo.getTime();
      }).length;
      const thisMonth = all.filter((c) => {
        const dateVal = c.date || c.id;
        return new Date(dateVal).getMonth() === now.getMonth();
      }).length;

      // Category breakdown 
      const uniqueCategories = Array.from(new Set(all.map((c) => c.category).filter(Boolean)));
      const colors = ["#60a5fa", "#fbbf24", "#f472b6", "#14b8a6", "#818cf8", "#fca5a5", "#34d399"];
      const catBreakdown = uniqueCategories.map((cat, idx) => ({
        label: cat,
        value: all.filter((c) => c.category === cat).length,
        color: colors[idx % colors.length]
      }));


      // Recent complaints (now only 4!)
      const recentComplaints = [...all]
        .sort((a, b) => new Date((b.date || b.id)) - new Date((a.date || a.id)))
        .slice(0, 4);

      // Trends: last 7 days count
      let trendData = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        const count = all.filter(c => {
          const dateVal = c.date || c.id;
          return new Date(dateVal).toLocaleDateString() === d.toLocaleDateString();
        }).length;
        trendData[i] = count;
      }

      this.setState({
        allComplaints: all,
        openCount,
        resolvedCount,
        avgTime,
        thisWeek,
        thisMonth,
        catBreakdown,
        recentComplaints,
        trendData
      });
    }
  }

  handleLogout = () => {
    window.sessionStorage.clear();
    window.location.replace("/");
  };

  handleStatHover = (title) => (e) => {
    const ev = e.touches ? e.touches[0] : e;
    this.setState({ statHover: title, statCoords: { x: ev.clientX, y: ev.clientY } });
  };
  handleStatLeave = () => this.setState({ statHover: null });

  render() {
    const {
      openCount,
      resolvedCount,
      avgTime,
      trendData,
      catBreakdown,
      responseTimes,
      recentComplaints,
      statHover,
      statCoords
    } = this.state;

    const statCards = [
      { title: "Open Complaints", value: openCount, gradient: "linear-gradient(135deg,#f87171,#fbbf24)" },
      { title: "Resolved", value: resolvedCount, gradient: "linear-gradient(135deg,#4f46e5,#f472b6)" },
      { title: "Avg Resolution", value: `${avgTime} days`, gradient: "linear-gradient(135deg,#34d399,#818cf8)" }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 flex flex-col pb-24">
        {/* COLORED HEADER */}
        <div className="w-full py-4 px-6 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 border-b flex items-center justify-between shadow">
          <div className="text-lg md:text-2xl font-extrabold text-white drop-shadow">Grievance Portal</div>
          <button
            onClick={this.handleLogout}
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
          >
            Logout
          </button>
        </div>

        {/* Dashboard */}
        <div className="w-full max-w-4xl mx-auto mt-6 px-3 flex flex-col items-stretch">
          <div className="text-center font-extrabold text-lg md:text-xl mb-4">
            Admin Dashboard
          </div>

          {/* Stat Cards */}
          <div className="flex flex-wrap justify-center md:justify-between gap-3 mb-4">
            {statCards.map(({ title, value, gradient }) => (
              <StatCard
                key={title}
                title={title}
                value={value}
                gradient={gradient}
                onHover={this.handleStatHover(title)}
                onLeave={this.handleStatLeave}
              />
            ))}
          </div>

          <Tooltip
            show={!!statHover}
            x={statCoords.x}
            y={statCoords.y}
            text={ADMIN_STAT_TOOLTIPS[statHover] || ""}
          />

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow">
              <span className="font-semibold text-purple-600 text-md">
                Trends (Complaints/Day, Last 7 Days)
              </span>
              <TrendsLineChart data={trendData} />
            </div>
            <div className="bg-white p-5 rounded-xl shadow">
              <span className="font-semibold text-purple-600 text-md">Category Breakdown</span>
              <PieChart data={catBreakdown.length ? catBreakdown : [
                { label: "Water", value: 5, color: "#60a5fa" },
                { label: "Traffic", value: 3, color: "#fbbf24" },
                { label: "Sanitation", value: 2, color: "#f472b6" }
              ]} />
            </div>
          </div>

          {/* Recent Complaints Box: only 4 shown */}
          <RecentComplaintsBox complaints={recentComplaints} />
        </div>
        <AdminBottomNav />
      </div>
    );
  }
}

export default AdminDashboard;
