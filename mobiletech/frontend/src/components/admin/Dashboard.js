import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from "react";
import { getAdminProducts } from "../../actions/productActions";
import { getUsers } from '../../actions/userActions';
import { adminOrders as adminOrdersAction } from '../../actions/orderActions';
import { Link } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { products = [] } = useSelector(state => state.productsState);
  const { adminOrders = [] } = useSelector(state => state.orderState);
  const { users = [] } = useSelector(state => state.userState);
  const dispatch = useDispatch();
  const chartRef = useRef(null); // Ref to capture chart for download

  let outOfStock = products.filter(product => product.stock === 0).length;
  let totalAmount = adminOrders.reduce((acc, order) => acc + order.totalPrice, 0);

  useEffect(() => {
    dispatch(getAdminProducts);
    dispatch(getUsers);
    dispatch(adminOrdersAction);
  }, [dispatch]);

  // Function to group sales by week (assuming orders have a `createdAt` field)
  const getWeeklySales = () => {
    const weeklySales = [0, 0, 0, 0, 0, 0, 0]; // Initialize an array for each day of the week

    adminOrders.forEach(order => {
      const orderDate = new Date(order.createdAt); // Assuming orders have a `createdAt` date field
      const dayOfWeek = orderDate.getDay(); // Get day of the week (0 = Sunday, 1 = Monday, etc.)

      // Add the total price to the corresponding day in the weekly sales
      weeklySales[dayOfWeek] += order.totalPrice;
    });

    return weeklySales;
  };

  const chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Weekly labels
    datasets: [
      {
        label: 'Sales Price (₹)',
        data: getWeeklySales(),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderSkipped: false,
        barThickness: 80,
        borderRadius: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: 'easeOutBounce',
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weekly Sales Overview' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Function to download chart as an image
  const downloadChart = () => {
    const chart = chartRef.current;
    html2canvas(chart).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'weekly-sales-chart.png';
      link.click();
    });
  };

  return (
    <div className="row" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>

      <div className="col-12 col-md-10 p-4">
        <h1 className="my-4 text-center" style={{
          textShadow: "0 5px 10px rgba(0, 0, 0, 0.3)",
          fontSize: "38px",
          fontStyle: "Rockwell Extra Bold",
          animation: "float 3s ease-in-out infinite"
        }}>
          DASHBOARD
        </h1>

        <style>
          {`
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
          `}
        </style>

        <div className="row mb-4 justify-content-center">
          <div className="col-xl-8">
            <div className="card border-left-primary shadow h-100 py-4">
              <div className="card-body d-flex justify-content-center align-items-center text-center">
                <div>
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Amount</div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">₹{totalAmount}</div>
                </div>
                <i className="fas fa-rupee-sign fa-3x text-gray-300 ms-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4 justify-content-center">
          <div className="col-12 d-flex justify-content-center">
            <div className="card shadow-sm" style={{ height: '400px', width: '95%' }}>
              <div className="card-body d-flex justify-content-center" ref={chartRef}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Button to download the chart */}
        <div className="row justify-content-center mb-4">
          <button className="btn btn-primary" onClick={downloadChart}>
            Download Weekly Sales Report
          </button>
        </div>

        <div className="row justify-content-center">
          {[{
            title: 'Products',
            count: products.length,
            color: 'success',
            link: '/admin/products'
          }, {
            title: 'Orders',
            count: adminOrders.length,
            color: 'danger',
            link: '/admin/orders'
          }, {
            title: 'Users',
            count: users.length,
            color: 'info',
            link: '/admin/users'
          }, {
            title: 'Out of Stock',
            count: outOfStock,
            color: 'warning'
          }].map((item, index) => (
            <div key={index} className="col-xl-3 col-md-6 mb-4">
              <div className={`card border-left-${item.color} shadow h-100 py-4`}>
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                  <div>
                    <div className={`text-xs font-weight-bold text-${item.color} text-uppercase mb-1`}>{item.title}</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">{item.count}</div>
                  </div>
                  <i className={`fas ${item.icon} fa-2x text-gray-300 mt-3`}></i>
                </div>
                {item.link && (
                  <Link className={`card-footer text-${item.color} small z-1 text-center`} to={item.link}>
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
