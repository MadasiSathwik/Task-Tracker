import { Segmented, Select } from 'antd';
import { FilterOutlined, SortAscendingOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

/**
 * FilterBar handles filtering and sorting configurations for tasks.
 */
const FilterBar = ({
  statusValue,
  onStatusChange,
  priorityValue,
  onPriorityChange,
  dateFilterValue,
  onDateFilterChange,
  sortValue,
  onSortChange,
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
      }}
    >
      {/* Status Segmented controls */}
      <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
        <Segmented
          options={[
            { label: 'All', value: 'ALL' },
            { label: 'To Do', value: 'Todo' },
            { label: 'Doing', value: 'Doing' },
            { label: 'Upcoming', value: 'Upcoming' },
            { label: 'Completed', value: 'Completed' },
          ]}
          value={statusValue}
          onChange={onStatusChange}
          size="large"
          style={{
            width: '100%',
            borderRadius: '8px',
            background: darkMode ? '#0f172a' : '#f1f5f9',
          }}
        />
      </div>

      {/* Priority Dropdown Select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px', flex: '1 1 120px' }}>
        <FilterOutlined style={{ color: '#94a3b8' }} />
        <Select
          value={priorityValue}
          onChange={onPriorityChange}
          size="large"
          style={{ width: '100%' }}
          options={[
            { label: 'All Priorities', value: 'ALL' },
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' },
          ]}
        />
      </div>

      {/* Date Deadline Dropdown Select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px', flex: '1 1 120px' }}>
        <CalendarOutlined style={{ color: '#94a3b8' }} />
        <Select
          value={dateFilterValue}
          onChange={onDateFilterChange}
          size="large"
          style={{ width: '100%' }}
          options={[
            { label: 'All Deadlines', value: 'ALL' },
            { label: 'Due Today', value: 'TODAY' },
            { label: 'Overdue', value: 'OVERDUE' },
          ]}
        />
      </div>

      {/* Sort Option Dropdown Select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '170px', flex: '1 1 150px' }}>
        <SortAscendingOutlined style={{ color: '#94a3b8' }} />
        <Select
          value={sortValue}
          onChange={onSortChange}
          size="large"
          style={{ width: '100%' }}
          options={[
            { label: 'Due Date: Soonest', value: 'DUE_DATE_ASC' },
            { label: 'Due Date: Latest', value: 'DUE_DATE_DESC' },
            { label: 'Priority: High to Low', value: 'PRIORITY_DESC' },
            { label: 'Priority: Low to High', value: 'PRIORITY_ASC' },
            { label: 'Title: A-Z', value: 'TITLE_ASC' },
            { label: 'Title: Z-A', value: 'TITLE_DESC' },
            { label: 'Newest First', value: 'NEWEST_FIRST' },
            { label: 'Oldest First', value: 'OLDEST_FIRST' },
          ]}
        />
      </div>
    </div>
  );
};

export default FilterBar;
