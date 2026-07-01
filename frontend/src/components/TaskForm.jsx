import { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { TASK_STATUS, TASK_PRIORITY, TASK_CATEGORY } from '../utils/constants';

const { TextArea } = Input;

const TaskForm = ({ open, onCancel, onSubmit, task = null, loading = false }) => {
  const [form] = Form.useForm();
  const isEdit = !!task;

  // Sync form inputs when task metadata changes
  useEffect(() => {
    if (open) {
      if (task) {
        form.setFieldsValue({
          title: task.title,
          description: task.description,
          status: task.status,
          category: task.category || TASK_CATEGORY.TODO,
          priority: task.priority,
          dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: TASK_STATUS.PENDING,
          category: TASK_CATEGORY.TODO,
          priority: TASK_PRIORITY.LOW,
        });
      }
    }
  }, [open, task, form]);

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
    };
    onSubmit(formattedValues);
  };

  return (
    <Modal
      open={open}
      title={
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
          {isEdit ? 'Modify Task Details' : 'Create New Task'}
        </span>
      }
      onCancel={onCancel}
      destroyOnClose
      footer={null} // Hide default footer buttons to use form action button instead
      width={520}
      style={{ top: '80px' }}
    >
      <Form
        form={form}
        layout="vertical"
        name="taskForm"
        onFinish={onFinish}
        requiredMark="optional"
        style={{ marginTop: '20px' }}
      >
        {/* Task Title field */}
        <Form.Item
          name="title"
          label={<span style={{ fontWeight: 600, color: '#475569' }}>Task Title</span>}
          rules={[
            { required: true, message: 'Title is required. Please input a title!' },
            { max: 100, message: 'Title cannot exceed 100 characters' },
          ]}
        >
          <Input placeholder="What needs to be done?" size="large" style={{ borderRadius: '6px' }} />
        </Form.Item>

        {/* Description field */}
        <Form.Item
          name="description"
          label={<span style={{ fontWeight: 600, color: '#475569' }}>Description</span>}
          rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
        >
          <TextArea
            rows={4}
            placeholder="Add context, subtasks, or extra notes..."
            style={{ borderRadius: '6px' }}
          />
        </Form.Item>

        {/* Responsive Grid for Status, Priority, Category and Due Date */}
        <Row gutter={[16, 16]}>
          {isEdit && (
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label={<span style={{ fontWeight: 600, color: '#475569' }}>Status</span>}
                rules={[{ required: true, message: 'Please select a status!' }]}
              >
                <Select size="large" style={{ width: '100%' }}>
                  <Select.Option value={TASK_STATUS.PENDING}>Pending</Select.Option>
                  <Select.Option value={TASK_STATUS.COMPLETED}>Completed</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={isEdit ? 12 : 8}>
            <Form.Item
              name="priority"
              label={<span style={{ fontWeight: 600, color: '#475569' }}>Priority</span>}
              rules={[{ required: true, message: 'Please select priority!' }]}
            >
              <Select size="large" style={{ width: '100%' }}>
                <Select.Option value={TASK_PRIORITY.LOW}>Low</Select.Option>
                <Select.Option value={TASK_PRIORITY.MEDIUM}>Medium</Select.Option>
                <Select.Option value={TASK_PRIORITY.HIGH}>High</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={isEdit ? 12 : 8}>
            <Form.Item
              name="category"
              label={<span style={{ fontWeight: 600, color: '#475569' }}>Category</span>}
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select size="large" style={{ width: '100%' }}>
                <Select.Option value={TASK_CATEGORY.TODO}>To Do</Select.Option>
                <Select.Option value={TASK_CATEGORY.DOING}>Doing</Select.Option>
                <Select.Option value={TASK_CATEGORY.UPCOMING}>Upcoming</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={isEdit ? 12 : 8}>
            <Form.Item
              name="dueDate"
              label={<span style={{ fontWeight: 600, color: '#475569' }}>Due Date</span>}
              rules={[{ required: true, message: 'Please select the due date!' }]}
            >
              <DatePicker
                style={{ width: '100%', borderRadius: '6px' }}
                size="large"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
        </Row>

        <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '24px 0 16px 0' }} />

        {/* Submit Actions inside Form */}
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space size="middle">
            <Button onClick={onCancel} size="large" style={{ borderRadius: '6px' }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{
                borderRadius: '6px',
                fontWeight: 600,
                padding: '0 24px',
              }}
            >
              {isEdit ? 'Update Task' : 'Add Task'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
