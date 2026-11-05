import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardStats } from '../../services/adminService';
import { toast } from 'react-hot-toast';

// Comentamos temporalmente la importación de recharts para evitar errores
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   ResponsiveContainer
// } from 'recharts';

interface TopSellingProduct {
    id: string;
    name: string;
    image: string;
    quantity: number;
    revenue: number;
}

interface OrdersByStatus {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
}

interface RevenueByDay {
    _id: {
        year: number;
        month: number;
        day: number;
    };
    revenue: number;
    count: number;
}

interface RecentOrder {
    _id: string;
    userId?: {
        name?: string;
    };
    total?: number;
    status: string;
    createdAt: string;
}

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalProductsSold: number;
    orderCompletionRate: number;
    averageOrderValue: number;
    ordersByStatus: OrdersByStatus;
    revenueByDay: RevenueByDay[];
    topSellingProducts: TopSellingProduct[];
    recentOrders: RecentOrder[];
}

export default function AdminLayout() {
    const { user, isAuthReady } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthReady && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, navigate, isAuthReady]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                toast.error('Không thể tải thống kê');
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthReady && user?.role === 'admin') {
            fetchStats();
        }
    }, [user, isAuthReady]);

    if (!isAuthReady) {
        return <div>Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/admin" className="text-xl font-bold text-red-600">
                                    Admin Dashboard
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/admin/products"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Products
                                </Link>
                                <Link
                                    to="/admin/add-product"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Add Product
                                </Link>
                                <Link
                                    to="/admin/orders"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Dashboard Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tổng sản phẩm
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {stats?.totalProducts || 0}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tổng đơn hàng
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {stats?.totalOrders || 0}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tổng doanh thu
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(stats?.totalRevenue || 0)}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tổng sản phẩm đã bán
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {stats?.totalProductsSold || 0}
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tỷ lệ hoàn thành đơn hàng
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {stats?.orderCompletionRate || 0}%
                                        </dd>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-green-600 h-2.5 rounded-full"
                                                style={{ width: `${stats?.orderCompletionRate || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Giá trị đơn hàng trung bình
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(stats?.averageOrderValue || 0)}
                                        </dd>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Trạng thái đơn hàng
                                        </dt>
                                        <div className="mt-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-blue-500">Đang chờ</span>
                                                <span className="text-xs font-medium text-blue-500">{stats?.ordersByStatus?.pending || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-yellow-500">Đang xử lý</span>
                                                <span className="text-xs font-medium text-yellow-500">{stats?.ordersByStatus?.processing || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-green-500">Hoàn thành</span>
                                                <span className="text-xs font-medium text-green-500">{stats?.ordersByStatus?.completed || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-red-500">Đã hủy</span>
                                                <span className="text-xs font-medium text-red-500">{stats?.ordersByStatus?.cancelled || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Table (reemplazando temporalmente el gráfico) */}
                            {stats?.revenueByDay && stats.revenueByDay.length > 0 && (
                                <div className="bg-white shadow rounded-lg mb-8">
                                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Doanh thu 7 ngày gần đây
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Ngày
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Doanh thu
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Số đơn hàng
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {stats.revenueByDay.map((day, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {`${day._id.day}/${day._id.month}/${day._id.year}`}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                }).format(day.revenue)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {day.count}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Top Selling Products */}
                            {stats?.topSellingProducts && stats.topSellingProducts.length > 0 && (
                                <div className="bg-white shadow rounded-lg mb-8">
                                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Sản phẩm bán chạy nhất
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Sản phẩm
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Số lượng đã bán
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Doanh thu
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {stats.topSellingProducts.map((product) => (
                                                    <tr key={product.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <img
                                                                        className="h-10 w-10 rounded-md object-cover"
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {product.quantity}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(product.revenue || 0)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Recent Orders */}
                            {stats?.recentOrders && stats.recentOrders.length > 0 && (
                                <div className="bg-white shadow rounded-lg mb-8">
                                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Đơn hàng gần đây
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        ID
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Khách hàng
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tổng tiền
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Trạng thái
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Ngày tạo
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Chi tiết
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {stats.recentOrders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {order._id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {order.userId?.name || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(order.total || 0)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {order.status}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(order.createdAt).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <Link to={`/admin/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900">
                                                                Xem
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Outlet for nested routes */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}