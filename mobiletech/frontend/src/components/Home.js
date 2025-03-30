import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { useSearchParams, Link } from "react-router-dom";
import Carousel from "./Carousel";

export default function Home() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
        dispatch(getProducts(null, null, null, null, currentPage));
    }, [error, dispatch, currentPage]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={'Buy Best Products'} />

                    {/* Navigation converted to section */}
                    <section className="bg-white py-3 sticky-top">
                        <div className="container">
                            <ul className="d-flex justify-content-center list-unstyled mb-0">
                                <li className="mx-3">
                                    <Link className="text-dark text-decoration-none" to="/">Home</Link>
                                </li>
                                <li className="mx-3">
                                    <a className="text-dark text-decoration-none" href="#products_heading">Products</a>
                                </li>
                                <li className="mx-3">
                                    <a className="text-dark text-decoration-none" href="#about">About</a>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Rest of the code remains exactly the same */}
                    <section id="carousel" className="container mt-5">
                        <Carousel />
                    </section>

                    <h1 id="products_heading" className="mt-5">Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product col={3} key={product._id} product={product} />
                            ))}
                        </div>
                    </section>

                    {productsCount > 0 && productsCount > resPerPage ? (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={'Next'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                            />
                        </div>
                    ) : null}

                    <section className="container mt-5">
                        <h2 className="text-center">Affordable Mobile Phones and Laptops</h2>
                        <p className="text-center">Explore our range of affordable and reliable mobile phones.</p>

                        <div className="row mt-5">
                            <div className="col-md-6">
                                <img src="./images/p1_2.png" alt="Budget-Friendly Options" className="img-fluid rounded" />
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                                <div>
                                    <h3>Budget-Friendly Options</h3>
                                    <p>Discover cost-effective mobile phones and laptops that meet your needs without breaking the bank.</p>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-5">
                            <div className="col-md-6 d-flex align-items-center">
                                <div>
                                    <h3>Reliable Performance</h3>
                                    <p>Enjoy consistent and dependable performance with our range of reliable mobile phones.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <img src="./images/p1_1.png" alt="Reliable Performance" className="img-fluid rounded" />
                            </div>
                        </div>

                        <div className="row mt-5">
                            <div className="col-md-6">
                                <img src="./images/p2_1.png" alt="Diverse Selection" className="img-fluid rounded" />
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                                <div>
                                    <h3>Diverse Selection</h3>
                                    <p>Choose from a wide variety of mobile phones to find the perfect fit for your lifestyle and preferences.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="about" className="container mt-5 py-5 bg-light">
                        <div className="row">
                            <div className="col-12 text-center">
                                <h2>About AMERICAN CELL SHOP</h2>
                                <p className="lead">Your trusted partner for mobile devices</p>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-6 mx-auto">
                                <div className="card border-0 bg-transparent">
                                    <div className="card-body text-center">
                                        <h4 className="card-title">Sales & Service</h4>
                                        <p className="card-text">Software & Hardware Solutions</p>
                                        <address>
                                            Balaji Cycle Stand,<br />
                                            Sankari Main Road,<br />
                                            Kondalampatty Bye-Pass,<br />
                                            Salem-10
                                        </address>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Fragment>
            )}
        </Fragment>
    );
}