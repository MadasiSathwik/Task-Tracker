import { Row, Col, Card, Badge } from 'antd';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import { TASK_STATUS } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';

const TaskList = ({ tasks, onEdit, onDelete, onUpdateFields, onDragEnd }) => {
  const { darkMode } = useTheme();

  // Group tasks by status (Pending, Completed)
  const groupedTasks = {
    [TASK_STATUS.PENDING]: tasks.filter((t) => t.status === TASK_STATUS.PENDING),
    [TASK_STATUS.COMPLETED]: tasks.filter((t) => t.status === TASK_STATUS.COMPLETED),
  };

  const columns = [
    { key: TASK_STATUS.PENDING, title: 'Pending Tasks', statusColor: '#3b82f6', bgHeader: darkMode ? '#1e293b' : '#eff6ff' },
    { key: TASK_STATUS.COMPLETED, title: 'Completed Tasks', statusColor: '#22c55e', bgHeader: darkMode ? '#1e293b' : '#dcfce7' },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ marginTop: '16px' }}>
        <Row gutter={[24, 24]}>
          {columns.map((col) => {
            const colTasks = groupedTasks[col.key] || [];
            return (
              <Col xs={24} lg={12} key={col.key}>
                <Card
                  bordered={false}
                  styles={{
                    header: {
                      borderBottom: 'none',
                      padding: '16px 20px',
                      borderRadius: '12px 12px 0 0',
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    },
                    body: {
                      padding: '12px',
                      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                      minHeight: '500px',
                      maxHeight: 'calc(100vh - 320px)',
                      overflowY: 'auto',
                      borderRadius: '0 0 12px 12px',
                      border: darkMode ? '1px solid #1e293b' : 'none',
                    }
                  }}
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                    background: darkMode ? '#1e293b' : '#ffffff',
                  }}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: col.statusColor,
                            display: 'inline-block',
                          }}
                        />
                        <span style={{ fontSize: '15px', fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                          {col.title}
                        </span>
                      </div>
                      <Badge
                        count={colTasks.length}
                        style={{
                          backgroundColor: col.bgHeader,
                          color: col.statusColor,
                          fontWeight: 700,
                          boxShadow: 'none',
                          fontSize: '12px',
                          padding: '0 8px',
                        }}
                      />
                    </div>
                  }
                >
                  <Droppable droppableId={col.key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          minHeight: '480px',
                          padding: '4px',
                          borderRadius: '8px',
                          backgroundColor: snapshot.isDraggingOver
                            ? (darkMode ? '#1e293b' : '#f1f5f9')
                            : 'transparent',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        {colTasks.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {colTasks.map((task, index) => (
                              <TaskCard
                                key={task._id}
                                task={task}
                                index={index}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onUpdateFields={onUpdateFields}
                              />
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding: '40px 0' }}>
                            <EmptyState description={`No tasks in ${col.title}`} />
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </DragDropContext>
  );
};

export default TaskList;
