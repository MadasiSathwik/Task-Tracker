import { Row, Col, Card, Skeleton } from 'antd';

/**
 * Animated Loading skeleton to mock task lists on loading cycles
 */
const TaskSkeleton = () => {
  const skeletonsCount = [1, 2, 3, 4, 5, 6];

  return (
    <div style={{ marginTop: '16px' }}>
      <Row gutter={[16, 16]}>
        {skeletonsCount.map((num) => (
          <Col xs={24} sm={12} md={8} key={num}>
            <Card
              bordered={false}
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02)',
                background: '#ffffff',
                marginBottom: '16px',
              }}
              styles={{
                body: {
                  padding: '20px',
                }
              }}
            >
              {/* Card Header Skeleton */}
              <Skeleton.Input active size="small" style={{ width: '60%', marginBottom: '12px', height: '18px' }} />
              
              {/* Card Description Skeleton */}
              <Skeleton active paragraph={{ rows: 2 }} title={false} style={{ marginBottom: '16px' }} />
              
              <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '0 0 12px 0' }} />
              
              {/* Card Footer Skeleton */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton.Input active size="small" style={{ width: '40%', height: '14px' }} />
                <Skeleton.Button active size="small" shape="square" style={{ width: '32px', height: '24px' }} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TaskSkeleton;
