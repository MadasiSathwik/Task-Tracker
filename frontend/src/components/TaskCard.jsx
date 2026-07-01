import { Card, Tag, Typography, Button, Space, Popconfirm, Tooltip, Dropdown, Badge } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { formatDate, getPriorityInfo, getStatusInfo, truncateText, getDeadlineCountdown } from '../utils/helpers';
import { TASK_STATUS, TASK_CATEGORY } from '../utils/constants';

const { Text } = Typography;

const TaskCard = ({ task, index, onEdit, onDelete, onUpdateFields }) => {
  const { _id, title, description, status, priority, category = 'Todo', dueDate } = task;

  const priorityInfo = getPriorityInfo(priority);
  const statusInfo = getStatusInfo(status);
  const countdown = getDeadlineCountdown(dueDate, status);

  // Status mapping for Ant Design Badge states
  const statusBadgeTypes = {
    [TASK_STATUS.PENDING]: 'processing',
    [TASK_STATUS.COMPLETED]: 'success',
  };

  const categoryLabelColors = {
    Todo: 'cyan',
    Doing: 'orange',
    Upcoming: 'purple',
  };

  // Color mappings for deadline text
  const countdownColors = {
    red: '#ef4444',
    orange: '#f59e0b',
    blue: '#3b82f6',
    green: '#10b981',
    gray: '#94a3b8',
  };

  // Build transition menu options for Pending tasks
  const menuItems = [];
  if (status === TASK_STATUS.PENDING) {
    if (category !== TASK_CATEGORY.TODO) {
      menuItems.push({ key: 'move-todo', label: 'Move to To Do' });
    }
    if (category !== TASK_CATEGORY.DOING) {
      menuItems.push({ key: 'move-doing', label: 'Start Doing' });
    }
    if (category !== TASK_CATEGORY.UPCOMING) {
      menuItems.push({ key: 'move-upcoming', label: 'Mark Upcoming' });
    }
    menuItems.push({ type: 'divider' });
    menuItems.push({ key: 'mark-completed', label: 'Mark Completed', danger: true });
  }

  const handleMenuClick = (info) => {
    if (info.key === 'move-todo') {
      onUpdateFields(_id, { category: TASK_CATEGORY.TODO });
    } else if (info.key === 'move-doing') {
      onUpdateFields(_id, { category: TASK_CATEGORY.DOING });
    } else if (info.key === 'move-upcoming') {
      onUpdateFields(_id, { category: TASK_CATEGORY.UPCOMING });
    } else if (info.key === 'mark-completed') {
      onUpdateFields(_id, { status: TASK_STATUS.COMPLETED });
    }
  };

  const priorityBorderColors = {
    Low: '#10b981',    // green
    Medium: '#f59e0b', // amber
    High: '#ef4444',   // red
  };

  return (
    <Draggable draggableId={_id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: '12px',
            touchAction: 'none', // Prevents touch scrolling issues on mobile during drag
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            <Card
              bordered={false}
              className={`task-card-item ${snapshot.isDragging ? 'dragging' : ''}`}
              style={{
                borderRadius: '10px',
                boxShadow: snapshot.isDragging
                  ? '0 10px 25px rgba(0, 0, 0, 0.1)'
                  : '0 4px 8px rgba(0, 0, 0, 0.02)',
                borderLeft: `4px solid ${priorityBorderColors[priority] || '#cbd5e1'}`,
                background: '#ffffff',
                transition: 'box-shadow 0.2s, background-color 0.2s',
                transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
              }}
              styles={{
                body: {
                  padding: '16px 20px',
                }
              }}
            >
              {/* Title & Priority Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <Text style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b', lineHeight: 1.3 }}>
                  {title}
                </Text>
                <Space size={4} style={{ flexShrink: 0 }}>
                  <Tag color={priorityInfo.color} style={{ margin: 0, borderRadius: '4px', fontWeight: 600 }}>
                    {priorityInfo.label}
                  </Tag>
                  {status === TASK_STATUS.PENDING && (
                    <Tag color={categoryLabelColors[category] || 'default'} style={{ margin: 0, borderRadius: '4px', fontWeight: 600 }}>
                      {category === 'Todo' ? 'To Do' : category}
                    </Tag>
                  )}
                </Space>
              </div>

              {/* Description Body */}
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  marginBottom: '16px',
                  minHeight: '36px',
                  lineHeight: '1.4',
                  margin: '0 0 16px 0',
                }}
              >
                {truncateText(description, 120)}
              </p>

              {/* Divider */}
              <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '0 0 12px 0' }} />

              {/* Footer Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Status Badge & Due Date */}
                <Space direction="vertical" size={2}>
                  <Badge status={statusBadgeTypes[status] || 'default'} text={<span style={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}>{statusInfo.label}</span>} />
                  <Space size={8} style={{ marginTop: '2px' }}>
                    <Space size={4} style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
                      <CalendarOutlined style={{ fontSize: '11px' }} />
                      <span>{formatDate(dueDate)}</span>
                    </Space>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: countdownColors[countdown.color] || '#94a3b8' }}>
                      {countdown.text}
                    </span>
                  </Space>
                </Space>

                {/* Action button triggers */}
                <Space size={4}>
                  <Tooltip title="Edit Task">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined style={{ color: '#64748b' }} />}
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering card drag hooks
                        onEdit(task);
                      }}
                      style={{ borderRadius: '4px' }}
                    />
                  </Tooltip>

                  {/* Render status change dropdown menu ONLY if task is NOT completed */}
                  {status === TASK_STATUS.PENDING && (
                    <Dropdown
                      menu={{
                        items: menuItems,
                        onClick: handleMenuClick,
                      }}
                      trigger={['click']}
                      placement="bottomRight"
                    >
                      <Tooltip title="Transition Stage">
                        <Button
                          type="text"
                          size="small"
                          icon={<ArrowRightOutlined style={{ color: '#64748b' }} />}
                          style={{ borderRadius: '4px' }}
                        />
                      </Tooltip>
                    </Dropdown>
                  )}

                  <Popconfirm
                    title="Delete Task"
                    description="Are you sure you want to delete this task?"
                    onConfirm={() => onDelete(_id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                    placement="topRight"
                  >
                    <Tooltip title="Delete Task">
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined style={{ color: '#ef4444' }} />}
                        style={{ borderRadius: '4px' }}
                      />
                    </Tooltip>
                  </Popconfirm>
                </Space>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
