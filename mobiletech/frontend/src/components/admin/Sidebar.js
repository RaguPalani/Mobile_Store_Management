import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap'; // Importing NavDropdown from react-bootstrap

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    {/* Dashboard Link */}
                    <li>
                        <Link to="/admin/dashboard">
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                        </Link>
                    </li>

                    {/* Product Dropdown */}
                    <li>
                        <NavDropdown title={<i className='fa fa-product-hunt'> Product</i>}>
                            <NavDropdown.Item onClick={() => navigate('/admin/products')}>
                                <i className='fa fa-shopping-basket'></i> All
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/admin/products/create')}>
                                <i className='fa fa-plus'></i> Create
                            </NavDropdown.Item>
                        </NavDropdown>
                    </li>

                    {/* Orders Link */}
                    <li>
                        <Link to="/admin/orders">
                            <i className="fa fa-shopping-basket"></i> Orders
                        </Link>
                    </li>

                    {/* Users Link */}
                    <li>
                        <Link to="/admin/users">
                            <i className="fa fa-users"></i> Users
                        </Link>
                    </li>

                    {/* Reviews Link */}
                    <li>
                        <Link to="/admin/reviews">
                            <i className="fa fa-star"></i> Reviews
                        </Link>
                    </li>

                    {/* Out of Stock Link */}
                    <li>
                        <Link to="/admin/outofstock">
                            <i className="fa fa-exclamation-triangle"></i> Out of Stock
                        </Link>
                    </li>

                    {/* Service Details Link */}
                    <li>
                        <Link to="/admin/services">
                            <i className="fa fa-cogs"></i> Service Form
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/admin/serviceList">
                            <i className="fa fa-cogs"></i> Service List
                        </Link>
                    </li> */}
                </ul>
            </nav>
        </div>
    );
}