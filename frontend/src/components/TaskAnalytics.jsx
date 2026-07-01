import { useMemo } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants';

const { Title } = Typography;

const TaskAnalytics = ({ tasks }) => {
  const { darkMode } = useTheme();

  // Color constants aligned with the dashboard theme
  const colors = {
    pending: '#3b82f6',   // blue
    completed: '#22c55e', // green
    low: '#10b981',       // emerald
    medium: '#f59e0b',    // amber
    high: '#ef4444',      // red
    text: darkMode ? '#cbd5e1' : '#475569',
    grid: darkMode ? '#334155' : '#f1f5f9',
    tooltipBg: darkMode ? '#1e293b' : '#ffffff',
  };

  // 1. Compute Status Chart Data
  const statusData = useMemo(() => {
    const pending = tasks.filter((t) => t.status === TASK_STATUS.PENDING).length;
    const completed = tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;

    return [
      { name: 'Pending', value: pending, color: colors.pending },
      { name: 'Completed', value: completed, color: colors.completed },
    ];
  }, [tasks, colors.pending, colors.completed]);

  // 2. Compute Priority Chart Data
  const priorityData = useMemo(() => {
    const low = tasks.filter((t) => t.priority === TASK_PRIORITY.LOW).length;
    const medium = tasks.filter((t) => t.priority === TASK_PRIORITY.MEDIUM).length;
    const high = tasks.filter((t) => t.priority === TASK_PRIORITY.HIGH).length;

    return [
      { name: 'Low', count: low, fill: colors.low },
      { name: 'Medium', count: medium, fill: colors.medium },
      { name: 'High', count: high, fill: colors.high },
    ];
  }, [tasks, colors.low, colors.medium, colors.high]);

  // 3. Compute Weekly Completion Velocity
  const completionData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const completionCounts = {};

    // Populate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      completionCounts[key] = { name: dayName, date: key, count: 0 };
    }

    // Tally up completed tasks matching these dates
    tasks.forEach((task) => {
      if (task.status === TASK_STATUS.COMPLETED && (task.updatedAt || task.dueDate)) {
        const date = new Date(task.updatedAt || task.dueDate);
        const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (completionCounts[key]) {
          completionCounts[key].count += 1;
        }
      }
    });

    return Object.values(completionCounts);
  }, [tasks]);

  return (
    <div style={{ marginTop: '24px' }}>
      <Title level={3} style={{ marginBottom: '20px', fontWeight: 800, color: darkMode ? '#f1f5f9' : '#0f172a' }}>
        Workspace Analytics & Insights
      </Title>

      <Row gutter={[24, 24]}>
        {/* Status Pie Chart */}
        <Col xs={24} md={12}>
          <Card
            title={<span style={{ fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Tasks by Status</span>}
            bordered={false}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              background: darkMode ? '#1e293b' : '#ffffff',
            }}
          >
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: colors.tooltipBg,
                      border: 'none',
                      borderRadius: '8px',
                      color: colors.text,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Priority Bar Chart */}
        <Col xs={24} md={12}>
          <Card
            title={<span style={{ fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Tasks by Priority</span>}
            bordered={false}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              background: darkMode ? '#1e293b' : '#ffffff',
            }}
          >
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} />
                  <YAxis stroke={colors.text} fontSize={12} tickLine={false} />
                  <ChartTooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: colors.tooltipBg,
                      border: 'none',
                      borderRadius: '8px',
                      color: colors.text,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Weekly Completed Tasks Line Chart */}
        <Col xs={24}>
          <Card
            title={<span style={{ fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Weekly Completed Tasks Velocity</span>}
            bordered={false}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              background: darkMode ? '#1e293b' : '#ffffff',
            }}
          >
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={completionData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} />
                  <YAxis stroke={colors.text} fontSize={12} tickLine={false} />
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: colors.tooltipBg,
                      border: 'none',
                      borderRadius: '8px',
                      color: colors.text,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    dot={{ strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskAnalytics;
