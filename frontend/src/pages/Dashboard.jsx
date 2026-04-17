import { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/analytics/stats?period=${period}`,
        );
        setStats(res.data);
      } catch (err) {
        // Dynamic Mock Data based on period
        const isDay = period === "day";
        const is6m = period === "6month";
        const isYear = period === "yearly";

        setStats({
          summary: {
            totalLeads: isDay ? 12 : is6m ? 145 : isYear ? 480 : 124,
            closedWon: isDay ? 2 : is6m ? 52 : isYear ? 120 : 45,
            winRate: isDay ? 16.6 : is6m ? 35.8 : isYear ? 25.0 : 36.3,
            totalValue: isDay ? 4500 : is6m ? 98400 : isYear ? 245000 : 84200,
          },
          leadsByMonth: [
            { _id: 1, count: isDay ? 2 : 12, value: isDay ? 500 : 5000 },
            { _id: 2, count: isDay ? 5 : 18, value: isDay ? 1200 : 8000 },
            { _id: 3, count: isDay ? 8 : 25, value: isDay ? 1800 : 12000 },
            { _id: 4, count: isDay ? 12 : 32, value: isDay ? 2500 : 19000 },
          ],
          leadsByStatus: [
            { _id: "New", count: isDay ? 5 : 40 },
            { _id: "Qualified", count: isDay ? 3 : 25 },
            { _id: "Closed Won", count: isDay ? 2 : 20 },
            { _id: "Closed Lost", count: isDay ? 1 : 14 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  const COLORS = [
    "#6366f1",
    "#818cf8",
    "#a5b4fc",
    "#c7d2fe",
    "#4ade80",
    "#f87171",
  ];

  if (loading && !stats) {
    return (
      <div className="dashboard-container" style={{ padding: "0 2rem" }}>
        <div
          style={{
            height: "60px",
            width: "300px",
            background: "var(--bg-tertiary)",
            borderRadius: "12px",
            marginBottom: "2rem",
            animation: "pulse 1.5s infinite opacity",
          }}
        ></div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "2rem",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: "100px",
                background: "var(--bg-tertiary)",
                borderRadius: "16px",
                animation: "pulse 1.5s infinite",
              }}
            ></div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              height: "300px",
              background: "var(--bg-tertiary)",
              borderRadius: "16px",
              animation: "pulse 1.5s infinite",
            }}
          ></div>
          <div
            style={{
              height: "300px",
              background: "var(--bg-tertiary)",
              borderRadius: "16px",
              animation: "pulse 1.5s infinite",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
            Sales Overview
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Performance metrics for the selected period
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            color: "white",
            fontSize: "0.8rem",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="day">Past 24 Hours</option>
          <option value="monthly">Past 30 Days</option>
          <option value="6month">Past 6 Months</option>
          <option value="yearly">Past Year</option>
        </select>
      </div>

      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Total Leads",
            value: stats.summary.totalLeads,
            icon: <Users size={18} />,
            color: "#6366f1",
          },
          {
            label: "Revenue Pool",
            value: `$${Math.floor(stats.summary.totalValue / 1000)}k`,
            icon: <DollarSign size={18} />,
            color: "#4ade80",
          },
          {
            label: "Win Rate",
            value: `${stats.summary.winRate}%`,
            icon: <Target size={18} />,
            color: "#f59e0b",
          },
          {
            label: "Closed Deals",
            value: stats.summary.closedWon,
            icon: <TrendingUp size={18} />,
            color: "#ec4899",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "8px",
                background: `${item.color}20`,
                color: item.color,
                borderRadius: "10px",
              }}
            >
              {item.icon}
            </div>
            <div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </p>
              <h3 style={{ fontSize: "1.2rem" }}>{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div
        className="charts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "15px",
          marginBottom: "1.5rem",
        }}
      >
        <div
          className="glass-card"
          style={{ padding: "1.25rem", height: "320px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3>Revenue Projection</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn"
                style={{
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  background: "var(--bg-tertiary)",
                }}
              >
                Monthly
              </button>
              <button
                className="btn"
                style={{
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  background: "var(--bg-tertiary)",
                }}
              >
                Quarterly
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={stats.leadsByMonth}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--accent-primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--accent-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="_id"
                stroke="var(--text-secondary)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "white" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--accent-primary)"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className="glass-card"
          style={{ padding: "1.5rem", height: "400px" }}
        >
          <h3 style={{ marginBottom: "1.5rem" }}>Pipeline Status</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={stats.leadsByStatus} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="_id"
                type="category"
                stroke="var(--text-secondary)"
                fontSize={10}
                width={80}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                {stats.leadsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem" }}>Recent Activities</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {[
              {
                type: "Email",
                text: "Proposal sent to Sarah Connor",
                time: "2h ago",
              },
              {
                type: "Call",
                text: "Follow-up with Bruce Wayne scheduled",
                time: "4h ago",
              },
              {
                type: "Meeting",
                text: "Architecture review with Stark team",
                time: "Yesterday",
              },
            ].map((activity, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--accent-primary)",
                    }}
                  ></div>
                  <span style={{ fontSize: "0.9rem" }}>{activity.text}</span>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem" }}>Quick Actions</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <button
              className="btn"
              style={{
                background: "var(--bg-tertiary)",
                justifyContent: "center",
                padding: "12px",
                fontSize: "0.85rem",
              }}
              onClick={() =>
                navigate("/leads", { state: { openCreateModal: true } })
              }
            >
              Create Lead
            </button>
            <button
              className="btn"
              style={{
                background: "var(--bg-tertiary)",
                justifyContent: "center",
                padding: "12px",
                fontSize: "0.85rem",
              }}
              onClick={() => navigate("/leads")}
            >
              Schedule Meeting
            </button>
            <button
              className="btn btn-primary"
              style={{
                gridColumn: "span 2",
                justifyContent: "center",
                padding: "12px",
                fontSize: "0.85rem",
              }}
              onClick={() =>
                window.open(
                  "http://localhost:5000/api/analytics/report",
                  "_blank",
                )
              }
            >
              Download Performance Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
