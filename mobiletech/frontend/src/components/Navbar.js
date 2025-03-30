import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import { FaShoppingCart } from "react-icons/fa"; // For cart icon
import Search from './layouts/Search'; // For search icon

const Navbar = () => {
    const { items:cartItems } = useSelector(state => state.cartState); // Assuming cart state exists

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    MobiTech
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">
                                <Search /> 
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">
                                <Link to="/cart"><span id="cart" className="ml-3">Cart</span></Link>
                                    <span className="ml-1" id="cart_count">{cartItems.length}</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
