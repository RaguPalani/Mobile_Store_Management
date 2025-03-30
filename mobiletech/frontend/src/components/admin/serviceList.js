import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllServices } from "../../actions/serviceActions";
import { clearError } from "../../slices/serviceSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import moment from "moment";

export default function ServiceList() {
  const { services = [], loading = true, error } = useSelector(
    (state) => state.serviceState
  );

  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  // Fetch services on component mount and whenever search term changes
  useEffect(() => {
    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }

    dispatch(fetchAllServices(searchTerm));
  }, [dispatch, error, searchTerm]);

  const setServices = () => {
    const data = {
      columns: [
        {
          label: "Service Date",
          field: "serviceDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "Mobile Name",
          field: "mobileName",
          sort: "asc",
        },
        {
          label: "Customer",
          field: "username",
          sort: "asc",
        },
        {
          label: "Phone",
          field: "phoneNumber",
          sort: "asc",
          width: 150,
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
          width: 150,
        },
        {
          label: "Actions",
          field: "actions",
          sort: "disabled",
          width: 120,
        },
      ],
      rows: services.map((service) => ({
        serviceDate: moment(service.serviceDate).format("MMM D, YYYY"),
        mobileName: service.mobileName,
        username: service.username,
        phoneNumber: service.phoneNumber,
        status: (
          <span
            className={`badge ${
              service.status === "Completed"
                ? "bg-success"
                : service.status === "In Progress"
                ? "bg-warning text-dark"
                : service.status === "Cancelled"
                ? "bg-danger"
                : "bg-secondary"
            }`}
          >
            {service.status}
          </span>
        ),
        actions: (
          <Fragment>
            <Link
              to={`/admin/service/${service._id}`}
              className="btn btn-primary btn-sm"
              title="View Details"
            >
              <i className="fa fa-eye"></i>
            </Link>
            <Link
              to={`/admin/service/update/${service._id}`}
              className="btn btn-info btn-sm ms-2"
              title="Update Status"
            >
              <i className="fa fa-edit"></i>
            </Link>
          </Fragment>
        ),
      })),
    };

    return data;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(fetchAllServices(searchTerm));
  };

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Service Requests</h1>
        <div className="row justify-content-center mt-5">
          <div className="col-8">
            <form onSubmit={submitHandler} className="row">
              <div className="col-9">
                <div className="form-group">
                  <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className="form-control"
                    placeholder="Search by customer name, mobile name or phone number"
                  />
                </div>
              </div>
              <div className="col-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block py-2"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="text-end mb-3">
          <Link to="/admin/service/new" className="btn btn-success">
            <i className="fa fa-plus"></i> Create New Service
          </Link>
        </div>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setServices()}
              bordered
              striped
              hover
              responsive
              className="px-3"
              noBottomColumns
              displayEntries={false}
              sortable={true}
              searching={false}
            />
          )}
        </Fragment>
      </div>
    </div>
  );
}
