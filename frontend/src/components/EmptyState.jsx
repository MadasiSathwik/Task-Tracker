import { Empty } from 'antd';

/**
 * Modern Empty state component for blank lists
 * @param {string} [description="No tasks found"] - Info text
 */
const EmptyState = ({ description = 'No tasks found' }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
        width: '100%',
        minHeight: '200px',
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>
            {description}
          </span>
        }
      />
    </div>
  );
};

export default EmptyState;
