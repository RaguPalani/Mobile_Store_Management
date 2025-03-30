import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../../actions/productActions";
import { clearError } from "../../slices/productSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function OutOfStockProducts() {
  const { products = [], loading = true, error } = useSelector(
    (state) => state.productsState
  );
  const dispatch = useDispatch();

  const setOutOfStockProducts = () => {
    const data = {
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    products
      .filter((product) => product.stock === 0)
      .forEach((product) => {
        data.rows.push({
          id: product._id,
          name: product.name,
          price: `$${product.price}`,
          stock: product.stock,
          actions: (
            <Fragment>
              <Link
                to={`/admin/product/${product._id}`}
                className="btn btn-primary"
              >
                <i className="fa fa-pencil"></i>
              </Link>
            </Fragment>
          ),
        });
      });

    return data;
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }

    dispatch(getAdminProducts);
  }, [dispatch, error]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
      <h1 className="mb-3 text-center text-uppercase">Out of Stock Products</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setOutOfStockProducts()}
              bordered
              striped
              hover
              className="px-3"
              noBottomColumns
            />
          )}
        </Fragment>
      </div>
    </div>
  );
}
