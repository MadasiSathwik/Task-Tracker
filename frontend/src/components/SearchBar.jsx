import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

/**
 * Modern Search bar component for tasks querying
 */
const SearchBar = ({ value, onChange, placeholder = 'Search tasks by title or description...' }) => {
  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: '4px' }} />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      allowClear
      size="large"
      style={{
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.01)',
      }}
    />
  );
};

export default SearchBar;
