import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  Button,
  Space,
  Row,
  Col,
  Card,
  Statistic,
  Alert,
  FloatButton,
  Progress,
  Radio,
  Dropdown,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  CalendarOutlined,
  DashboardOutlined,
  PieChartOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// API Services
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';

// Custom Sub-components
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import TaskCalendar from '../components/TaskCalendar';
import TaskAnalytics from '../components/TaskAnalytics';
import TaskSkeleton from '../components/TaskSkeleton';

const { Title, Text } = Typography;

const DEFAULT_TASKS = [
  {
    _id: 'mock-1',
    title: 'Setup Database Connection & Schemas',
    description: 'Configure MongoDB Atlas, install Mongoose, and define User and Task data models.',
    status: TASK_STATUS.COMPLETED,
    priority: TASK_PRIORITY.HIGH,
    category: 'Todo',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'mock-2',
    title: 'Design Kanban Dashboard UI Layout',
    description: 'Create responsive header navbar, sidebar filter panels, and drag/drop board views using Ant Design.',
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.MEDIUM,
    category: 'Doing',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    _id: 'mock-3',
    title: 'Implement User JWT Authentication Flow',
    description: 'Build backend signup/signin endpoints with token generations, and connect frontend auth providers.',
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.HIGH,
    category: 'Todo',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
  },
  {
    _id: 'mock-4',
    title: 'Write API Controller Integration Tests',
    description: 'Perform unit and integration testing using Supertest and Jest to verify database validation boundaries.',
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.LOW,
    category: 'Upcoming',
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
  },
];

const Dashboard = () => {
  const { darkMode } = useTheme();
  const fileInputRef = useRef(null);

  // tasks acts as the raw, unfiltered task list from api/mock
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  // Search, Filter, Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DUE_DATE_ASC');
  
  // View Toggle: 'board' | 'calendar' | 'analytics'
  const [activeView, setActiveView] = useState('board');

  const location = useLocation();

  // Modal form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Initialize status filter from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    if (statusParam && ['Todo', 'Doing', 'Upcoming', 'Completed'].includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [location.search]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTasks();
      const rawTasks = Array.isArray(response) 
        ? response 
        : (response && Array.isArray(response.data) ? response.data : []);
      
      setTasks(rawTasks);
      setIsUsingMockData(false);
    } catch (error) {
      console.warn('API connection failed. Falling back to mock tasks.', error);
      setTasks(DEFAULT_TASKS);
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Keyboard shortcut listener: Ctrl + N (Create Task)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleOpenCreateModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Form Submit handler (Create or Update)
  const handleFormSubmit = async (values) => {
    setFormSubmitting(true);
    try {
      if (selectedTask) {
        // Edit Task Operation
        const isMock = selectedTask._id.startsWith('mock-');
        if (isMock) {
          setTasks((prev) =>
            prev.map((t) => (t._id === selectedTask._id ? { ...t, ...values } : t))
          );
          toast.success('Mock task updated (Demo Mode)');
        } else {
          await updateTask(selectedTask._id, values);
          toast.success('Task updated successfully!');
          fetchTasks();
        }
      } else {
        // Create Task Operation
        if (isUsingMockData) {
          const mockId = `mock-${Date.now()}`;
          setTasks((prev) => [...prev, { ...values, _id: mockId }]);
          toast.success('Mock task created (Demo Mode)');
        } else {
          await createTask(values);
          toast.success('Task created successfully!');
          fetchTasks();
        }
      }
      setIsFormOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error(selectedTask ? 'Failed to update task.' : 'Failed to create task.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete handler
  const handleDeleteTask = async (id) => {
    try {
      if (id.startsWith('mock-')) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        toast.success('Mock task deleted (Demo Mode)');
      } else {
        await deleteTask(id);
        toast.success('Task deleted successfully!');
        fetchTasks();
      }
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  // Dynamic fields update handler (for drag & drop or category dropdown clicks)
  const handleUpdateTaskFields = async (id, updatedFields) => {
    try {
      if (id.startsWith('mock-')) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, ...updatedFields } : t))
        );
        toast.success('Task stage updated (Demo Mode)');
      } else {
        await updateTask(id, updatedFields);
        toast.success('Task updated successfully!');
        fetchTasks();
      }
    } catch (error) {
      toast.error('Failed to update task.');
    }
  };

  // Drag & Drop event listener
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    handleUpdateTaskFields(draggableId, { status: newStatus });
  };

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  // Local filtering & sorting computation via useMemo for optimal performance
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Unified Status & Category Stage Filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Completed') {
        result = result.filter((t) => t.status === TASK_STATUS.COMPLETED);
      } else {
        result = result.filter((t) => t.status === TASK_STATUS.PENDING && t.category === statusFilter);
      }
    }

    // 2. Priority Filter
    if (priorityFilter !== 'ALL') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // 3. Date Deadline Filter
    if (dateFilter !== 'ALL') {
      const todayStr = new Date().toISOString().split('T')[0];
      result = result.filter((t) => {
        if (!t.dueDate) return false;
        const taskDateStr = new Date(t.dueDate).toISOString().split('T')[0];
        
        if (dateFilter === 'TODAY') {
          return taskDateStr === todayStr && t.status !== TASK_STATUS.COMPLETED;
        } else if (dateFilter === 'OVERDUE') {
          return new Date(taskDateStr) < new Date(todayStr) && t.status !== TASK_STATUS.COMPLETED;
        }
        return true;
      });
    }

    // 4. Advanced Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description || '').toLowerCase().includes(query) ||
          t.priority.toLowerCase().includes(query) ||
          t.status.toLowerCase().includes(query)
      );
    }

    // 5. Sorting Options
    const priorityWeights = { High: 3, Medium: 2, Low: 1 };
    switch (sortBy) {
      case 'DUE_DATE_ASC':
        result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case 'DUE_DATE_DESC':
        result.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        break;
      case 'PRIORITY_DESC':
        result.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));
        break;
      case 'PRIORITY_ASC':
        result.sort((a, b) => (priorityWeights[a.priority] || 0) - (priorityWeights[b.priority] || 0));
        break;
      case 'TITLE_ASC':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'TITLE_DESC':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'NEWEST_FIRST':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'OLDEST_FIRST':
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      default:
        break;
    }

    return result;
  }, [tasks, statusFilter, priorityFilter, dateFilter, searchQuery, sortBy]);

  // Derived stats from raw tasks
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === TASK_STATUS.PENDING).length;
    const completed = tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
    
    // High Priority pending count
    const highPriority = tasks.filter((t) => t.status === TASK_STATUS.PENDING && t.priority === TASK_PRIORITY.HIGH).length;
    
    // Due today pending count
    const todayStr = new Date().toISOString().split('T')[0];
    const dueToday = tasks.filter((t) => {
      if (t.status === TASK_STATUS.COMPLETED || !t.dueDate) return false;
      const taskDateStr = new Date(t.dueDate).toISOString().split('T')[0];
      return taskDateStr === todayStr;
    }).length;

    return { total, pending, completed, highPriority, dueToday };
  }, [tasks]);

  const progressPercent = tasks.length > 0 
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  // PDF Report Exporter
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // slate 900
    doc.text('Workspace Tasks Report', 14, 22);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 28);
    doc.text(`Scope: ${statusFilter} status • ${priorityFilter} priority • ${processedTasks.length} tasks matching filters`, 14, 33);
    
    const tableColumn = ["Title", "Description", "Priority", "Status", "Stage/Category", "Due Date"];
    const tableRows = processedTasks.map(t => [
      t.title,
      t.description || '',
      t.priority,
      t.status,
      t.status === 'Completed' ? 'N/A' : (t.category === 'Todo' ? 'To Do' : t.category),
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'
    ]);

    doc.autoTable({
      startY: 38,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [22, 119, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        1: { cellWidth: 50 }, // Lock description column width to wrap text
      }
    });

    doc.save(`tasks-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF Report exported successfully!');
  };

  // CSV Exporter
  const exportCSV = () => {
    const headers = ['Title', 'Description', 'Priority', 'Status', 'Category', 'Due Date'];
    const rows = processedTasks.map(t => [
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.priority,
      t.status,
      t.category || 'Todo',
      t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : 'N/A'
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tasks-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Backups exported successfully!');
  };

  // CSV Importer parser
  const handleCSVImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      if (lines.length < 2) {
        toast.error('CSV file has no data.');
        return;
      }
      
      let importedCount = 0;
      let failedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV splitter respecting quotation marks
        const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (columns.length < 1) continue;

        const title = columns[0] ? columns[0].replace(/^"|"$/g, '').trim() : '';
        const description = columns[1] ? columns[1].replace(/^"|"$/g, '').trim() : '';
        let priority = columns[2] ? columns[2].replace(/^"|"$/g, '').trim() : 'Medium';
        let status = columns[3] ? columns[3].replace(/^"|"$/g, '').trim() : 'Pending';
        let category = columns[4] ? columns[4].replace(/^"|"$/g, '').trim() : 'Todo';
        let dueDate = columns[5] ? columns[5].replace(/^"|"$/g, '').trim() : null;

        // Clean priority string case
        priority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
        if (!['Low', 'Medium', 'High'].includes(priority)) priority = 'Medium';

        // Clean status string case
        status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        if (!['Pending', 'Completed'].includes(status)) status = 'Pending';

        // Clean category string case
        if (category.toLowerCase() === 'todo' || category.toLowerCase() === 'to do') category = 'Todo';
        else if (category.toLowerCase() === 'doing') category = 'Doing';
        else if (category.toLowerCase() === 'upcoming') category = 'Upcoming';
        else category = 'Todo';

        if (dueDate && isNaN(new Date(dueDate).getTime())) dueDate = null;

        if (!title) {
          failedCount++;
          continue;
        }

        try {
          if (isUsingMockData) {
            const mockId = `mock-import-${Date.now()}-${i}`;
            setTasks((prev) => [...prev, {
              _id: mockId,
              title,
              description,
              priority,
              status,
              category,
              dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
              createdAt: new Date().toISOString()
            }]);
          } else {
            await createTask({
              title,
              description,
              priority,
              status,
              category,
              dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
            });
          }
          importedCount++;
        } catch (error) {
          failedCount++;
        }
      }

      toast.success(`Successfully imported ${importedCount} tasks!`);
      if (failedCount > 0) {
        toast.warn(`Failed to import ${failedCount} rows due to formats.`);
      }
      fetchTasks();
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  const exportMenuItems = [
    { key: 'pdf', label: 'Export as PDF', onClick: exportPDF },
    { key: 'csv', label: 'Export as CSV', onClick: exportCSV },
  ];

  return (
    <div>
      {/* Hidden input for CSV imports */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: 'none' }}
      />

      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }} gutter={[16, 16]}>
        <Col xs={24} sm={14}>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.5px' }}>
            Board Workspace
          </Title>
          <Text type="secondary" style={{ fontSize: '15px', color: darkMode ? '#94a3b8' : '#64748b' }}>
            Monitor pipelines, view critical metrics, and coordinate tasks.
          </Text>
        </Col>
        <Col xs={24} sm={10} style={{ textAlign: 'right' }}>
          <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button icon={<ReloadOutlined />} onClick={fetchTasks} size="large">
              Sync
            </Button>
            
            <Button icon={<UploadOutlined />} onClick={handleCSVImportClick} size="large">
              Import CSV
            </Button>

            <Dropdown menu={{ items: exportMenuItems }} trigger={['click']}>
              <Button icon={<DownloadOutlined />} size="large">
                Export
              </Button>
            </Dropdown>

            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreateModal} size="large" style={{ fontWeight: 600 }}>
              New Task
            </Button>
          </Space>
        </Col>
      </Row>

      {isUsingMockData && (
        <Alert
          message="Demo Mode (Offline)"
          description="The frontend could not connect to your MERN backend API. Operating on local mock session data."
          type="warning"
          showIcon
          closable
          style={{ marginBottom: '24px', borderRadius: '8px' }}
        />
      )}

      {/* Summary statistics cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={8} md={4.8} style={{ flex: '1 1 120px' }}>
          <Card bordered={false} hoverable style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)', background: darkMode ? '#1e293b' : '#ffffff' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#64748b' }}>Total Tasks</span>}
              value={stats.total}
              valueStyle={{ color: '#1677ff', fontWeight: 800 }}
              prefix={<DashboardOutlined style={{ marginRight: '4px' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4.8} style={{ flex: '1 1 120px' }}>
          <Card bordered={false} hoverable style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)', background: darkMode ? '#1e293b' : '#ffffff' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#64748b' }}>Pending</span>}
              value={stats.pending}
              valueStyle={{ color: '#faad14', fontWeight: 800 }}
              prefix={<ClockCircleOutlined style={{ marginRight: '4px' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4.8} style={{ flex: '1 1 120px' }}>
          <Card bordered={false} hoverable style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)', background: darkMode ? '#1e293b' : '#ffffff' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#64748b' }}>Completed</span>}
              value={stats.completed}
              valueStyle={{ color: '#52c41a', fontWeight: 800 }}
              prefix={<CheckCircleOutlined style={{ marginRight: '4px' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4.8} style={{ flex: '1 1 120px' }}>
          <Card bordered={false} hoverable style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)', background: darkMode ? '#1e293b' : '#ffffff' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#64748b' }}>High Priority</span>}
              value={stats.highPriority}
              valueStyle={{ color: '#ef4444', fontWeight: 800 }}
              prefix={<AlertOutlined style={{ marginRight: '4px' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4.8} style={{ flex: '1 1 120px' }}>
          <Card bordered={false} hoverable style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)', background: darkMode ? '#1e293b' : '#ffffff' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#64748b' }}>Due Today</span>}
              value={stats.dueToday}
              valueStyle={{ color: '#fa8c16', fontWeight: 800 }}
              prefix={<CalendarOutlined style={{ marginRight: '4px' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Bar widget */}
      <Card
        bordered={false}
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
          background: darkMode ? '#1e293b' : '#ffffff',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <Text style={{ fontWeight: 700, color: darkMode ? '#f1f5f9' : '#1e293b' }}>Workspace Completion Progress</Text>
          <Text style={{ fontWeight: 800, color: '#22c55e' }}>{progressPercent}% Done</Text>
        </div>
        <Progress
          percent={progressPercent}
          strokeColor={{ '0%': '#10b981', '100%': '#22c55e' }}
          trailColor={darkMode ? '#334155' : '#f1f5f9'}
          status={progressPercent === 100 ? 'success' : 'active'}
        />
      </Card>

      {/* Workspace View Toggle buttons (Board vs Calendar vs Insights Charts) */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '24px' }}>
        <Radio.Group
          value={activeView}
          onChange={(e) => setActiveView(e.target.value)}
          size="large"
          buttonStyle="solid"
        >
          <Radio.Button value="board">
            <Space size={6}>
              <DashboardOutlined />
              <span>Kanban Board</span>
            </Space>
          </Radio.Button>
          <Radio.Button value="calendar">
            <Space size={6}>
              <CalendarOutlined />
              <span>Calendar</span>
            </Space>
          </Radio.Button>
          <Radio.Button value="analytics">
            <Space size={6}>
              <PieChartOutlined />
              <span>Insights Analytics</span>
            </Space>
          </Radio.Button>
        </Radio.Group>
      </div>

      {/* Search & Filter bar combined card */}
      <Card
        bordered={false}
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
          background: darkMode ? '#1e293b' : '#ffffff',
        }}
        styles={{ body: { padding: '20px' } }}
      >
        <Row gutter={[16, 20]} align="middle">
          {/* Search bar Component */}
          <Col xs={24}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </Col>

          {/* Filtering panels */}
          <Col xs={24}>
            <FilterBar
              statusValue={statusFilter}
              onStatusChange={setStatusFilter}
              priorityValue={priorityFilter}
              onPriorityChange={setPriorityFilter}
              dateFilterValue={dateFilter}
              onDateFilterChange={setDateFilter}
              sortValue={sortBy}
              onSortChange={setSortBy}
            />
          </Col>
        </Row>
      </Card>

      {/* Workspace View rendering nodes */}
      {loading ? (
        <Card bordered={false} style={{ minHeight: '300px', borderRadius: '12px', background: darkMode ? '#1e293b' : '#ffffff' }}>
          <TaskSkeleton />
        </Card>
      ) : (
        <div>
          {activeView === 'board' && (
            <TaskList
              tasks={processedTasks}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              onUpdateFields={handleUpdateTaskFields}
              onDragEnd={handleDragEnd}
            />
          )}

          {activeView === 'calendar' && (
            <TaskCalendar tasks={processedTasks} />
          )}

          {activeView === 'analytics' && (
            <TaskAnalytics tasks={processedTasks} />
          )}
        </div>
      )}

      {/* Floating Action Button (FAB) shortcut for quick task additions */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={handleOpenCreateModal}
        style={{ right: 24, bottom: 24, width: 56, height: 56 }}
        tooltip="Create Task (Ctrl + N)"
      />

      <TaskForm
        open={isFormOpen}
        task={selectedTask}
        loading={formSubmitting}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Dashboard;
