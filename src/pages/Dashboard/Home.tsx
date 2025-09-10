import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';
import { LuPackageOpen } from 'react-icons/lu';
import Skeleton from 'react-loading-skeleton';
import type { StatsType } from 'type';

import axios from '../../axios';

interface StatsResponse {
  data: StatsType;
  status: string;
}

interface StatsCardProps {
  title: string;
  key: string;
  icon: ReactNode;
  bgColor: string;
  value: string | null;
}

const DashboardHome = () => {
  const fetchAllStats = async (): Promise<StatsType> => {
    const res = await axios.get<StatsResponse>('/dashboard/stats');
    return res.data.data;
  };
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchAllStats,
  });
  console.log(stats, 'stats hai na');
  const StatCard = ({ title, icon, bgColor, value }: StatsCardProps) => (
    <Col lg={3} md={4} sm={6} key={title}>
      <Card className="p-3 shadow-sm border-0 rounded-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-muted mb-0 text-uppercase fs-6">{title}</h2>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: bgColor,
            }}
          >
            {icon}
          </div>
        </div>
        <h3 className="fw-bold mt-3 fs-3">{isLoading ? <Skeleton width={60} /> : value}</h3>
      </Card>
    </Col>
  );

  const statsConfig = [
    {
      title: 'Total Customers',
      key: 'totalCustomers',
      icon: <FaUsers size={18} color="#28C76F" />,
      bgColor: '#28c76f1a',
    },
    {
      title: 'Total Orders',
      key: 'totalOrders',
      icon: <FaShoppingCart size={18} color="#219ebc" />,
      bgColor: 'rgb(33 158 188 / 20%)',
    },
    {
      title: 'Total Revenue',
      key: 'totalRevenue',
      icon: <FaRupeeSign size={20} color="#606c38" />,
      bgColor: 'rgb(96 108 56 / 20%)',
      prefix: '₹ ',
    },
    {
      title: 'Total Product Categories',
      key: 'totalProductCategories',
      icon: <BiSolidCategoryAlt size={18} color="#003049" />,
      bgColor: 'rgb(0 48 73 / 20%)',
    },
    {
      title: 'Total Products',
      key: 'totalProducts',
      icon: <LuPackageOpen size={18} color="#bc4749" />,
      bgColor: 'rgb(188 71 73 / 20%)',
    },
  ] satisfies ReadonlyArray<{
    title: string;
    key: keyof StatsType;
    icon: ReactNode;
    bgColor: string;
    prefix?: string;
  }>;

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <Row className="g-4 mt-4">
        {statsConfig.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            icon={item.icon}
            bgColor={item.bgColor}
            value={`${item.prefix ?? ''}${stats?.[item.key]}`}
          />
        ))}
      </Row>
    </div>
  );
};

export default DashboardHome;
