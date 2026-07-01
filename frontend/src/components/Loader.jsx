import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

/**
 * Centered spinner component for application loading states.
 * @param {string} [tip="Loading..."] - Optional loading message
 */
const Loader = ({ tip = 'Loading...' }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        height: '100%',
        width: '100%',
        padding: '2rem',
      }}
    >
      <Spin indicator={antIcon} tip={tip} size="large" />
    </div>
  );
};

export default Loader;
