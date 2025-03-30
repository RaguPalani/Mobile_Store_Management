import { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getReviews } from "../../actions/productActions";
import { clearError, clearReviewDeleted } from "../../slices/productSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function ReviewList() {
  const { reviews = [], loading = true, error, isReviewDeleted } = useSelector(
    (state) => state.productState
  );

  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const setReviews = () => {
    const data = {
      columns: [
        {
          label: "Product Name",
          field: "productName",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    reviews.forEach((review) => {
      data.rows.push({
        productName: review.productName || "Unknown",
        rating: review.rating,
        user: review.user?.name || "Anonymous",
        comment: review.comment || "No comment",
        actions: (
          <Fragment>
            <Button
              onClick={(e) => deleteHandler(e, review._id)}
              className="btn btn-danger py-1 px-2 ml-2"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteReview(searchTerm, id));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast("Please enter a product name to search", {
        type: "warning",
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    dispatch(getReviews(searchTerm));
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }
    if (isReviewDeleted) {
      toast("Review Deleted Successfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearReviewDeleted()),
      });
      dispatch(getReviews(searchTerm));
      return;
    }
  }, [dispatch, error, isReviewDeleted, searchTerm]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
      <h1 className="mb-3 text-center text-uppercase">Review List</h1>
        <div className="row justify-content-center mt-5">
          <div className="col-5">
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label>Search by Product Name</label>
                <input
                  type="text"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  className="form-control"
                  placeholder="Enter product name keywords"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block py-2"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setReviews()}
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
