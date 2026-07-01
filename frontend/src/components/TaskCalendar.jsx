import { Calendar, Badge, Card } from 'antd';
import { useTheme } from '../context/ThemeContext';

/**
 * TaskCalendar component renders a monthly calendar view mapping tasks to their due dates.
 */
const TaskCalendar = ({ tasks }) => {
  const { darkMode } = useTheme();

  // Find tasks due on a given day
  const getTasksForDate = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDateStr = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDateStr === dateStr;
    });
  };

  // Render individual date cells
  const dateCellRender = (value) => {
    const dayTasks = getTasksForDate(value);
    
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflow: 'hidden' }}>
        {dayTasks.map((task) => {
          let badgeStatus = 'processing'; // default blue for low priority pending
          if (task.status === 'Completed') {
            badgeStatus = 'success'; // green
          } else if (task.priority === 'High') {
            badgeStatus = 'error'; // red
          } else if (task.priority === 'Medium') {
            badgeStatus = 'warning'; // orange
          }

          return (
            <li key={task._id} style={{ margin: '2px 0' }}>
              <Badge
                status={badgeStatus}
                text={
                  <span
                    style={{
                      fontSize: '11px',
                      color: darkMode ? '#cbd5e1' : '#475569',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                      maxWidth: '100%',
                    }}
                    title={task.title}
                  >
                    {task.title}
                  </span>
                }
              />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
        background: darkMode ? '#1e293b' : '#ffffff',
        overflowX: 'auto',
      }}
      styles={{
        body: {
          padding: '20px',
          minWidth: '600px', // Prevent grid crushing on small mobile viewports
        }
      }}
    >
      <Calendar
        cellRender={(current, info) => {
          if (info.type === 'date') return dateCellRender(current);
          return info.originNode;
        }}
      />
    </Card>
  );
};

export default TaskCalendar;
