import React from 'react';
import Navbar from './navbar';
import { Link } from "react-router-dom";
import { Button } from 'primereact/button';
import './HomeStyles.css';
import { useEffect } from 'react';

export function Homebase() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const loggedInAdmin = sessionStorage.getItem("loggedInAdmin");
    const loggedInDepartmentManager = sessionStorage.getItem("loggedInDepartmentManager");

    let name = "";

    // Determine user name based on session storage
    if (loggedInUser) {
        name = JSON.parse(loggedInUser).name;
    } else if (loggedInAdmin) {
        name = JSON.parse(loggedInAdmin).name;
    } else if (loggedInDepartmentManager) {
        name = JSON.parse(loggedInDepartmentManager).name;
    }

    return (
        <>
        <Navbar />
        <div className="container mt-5 ">
            <div className="row row-grid align-items-center">
                <div className="col-12 col-md-5 col-lg-6 order-md-2 text-center">
                    <figure className="w-100">
                        <img
                            src="https://imconnect.in/wp-content/uploads/2024/04/imconnect-employee-location-tracking-app.gif"
                            alt="Leave Management"
                            className="img-fluid mw-md-120"
                        />
                    </figure>
                </div>
                <div className="col-12 col-md-7 col-lg-6 order-md-2 pr-md-5">
                    <h1 className="display-4 text-center text-md-left mb-3">
                        Welcome to<strong className="text-darkblue"> Leave Management</strong> 
                    </h1>
                    {name && <h2 className="text-center text-md-left mb-3">Hello, <strong>{name}</strong>!</h2>} {/* Display user's name if available */}
                    <p className="lead text-center text-md-left text-muted">
                        A comprehensive Leave Management System encompasses a range of essential features to streamline the leave management process effectively.
                    </p>

                    <div className="text-center text-md-left mt-5">
                        <Link to="/login">
                            <Button
                                label="Login"
                                className="p-button-sm custom-darkblue-button"
                                icon="pi pi-sign-in"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export function Homeuser() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    

    let name = "";

    if (loggedInUser) {
        name = JSON.parse(loggedInUser).name;
    }
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Prevent scrolling
        return () => {
            document.body.style.overflow = ""; // Reset on unmount
        };
    }, []);


    return (
        <>
            <Navbar user />
            <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
                <div className="row w-100">
                    <div className="col-12 col-md-5 text-center d-flex justify-content-center align-items-center">
                        <figure className="w-100">
                            <img
                                src="https://media.licdn.com/dms/image/C4D12AQH3moW8i3ewrw/article-cover_image-shrink_600_2000/0/1628589993746?e=2147483647&v=beta&t=x0r-d-0VMlcRA_l3hQGm6RBCel5ZrQrV1KkIE6N167g"
                                alt="Leave Management"
                                className="img-fluid uniform-image"
                            />
                        </figure>
                    </div>
                    <div className="col-12 col-md-7 d-flex flex-column justify-content-center">
                        <h1 className="display-4 mb-3" style={{ fontSize: '3rem' }}>
                            Welcome <strong className="text-darkblue">{name}</strong>, to the Leave Management System.
                        </h1>
                        <p className="lead text-muted">
                        A well-rounded Leave Management System offers various features to manage employee leave efficiently. Employees can easily submit leave requests, check their available leave balances, monitor the status of their requests, and download their leave reports.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export function Homeadmin() {
    
    const loggedInAdmin = sessionStorage.getItem("loggedInAdmin");
    
    let name = "";

    if(loggedInAdmin) {
        name = JSON.parse(loggedInAdmin).name;
    }
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Prevent scrolling
        return () => {
            document.body.style.overflow = ""; // Reset on unmount
        };
    }, []);


    return (
        <>
            <Navbar admin />
            <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
                <div className="row w-100">
                    <div className="col-12 col-md-5 text-center">
                        <figure className="w-100">
                            <img
                                src="https://www.chawtechsolutions.com/wp-content/uploads/2019/03/developer-dribbble.gif"
                                alt="Leave Management"
                                className="img-fluid uniform-image"
                            />
                        </figure>
                    </div>
                    <div className="col-12 col-md-7 d-flex flex-column justify-content-center">
                        <h1 className="display-4 mb-3" style={{ fontSize: '3rem' }}>
                            Welcome <strong className="text-darkblue">{name}</strong>, to the Leave Management System.
                        </h1>
                        <p className="lead text-muted">
                        The Leave Management System provides administrators with effective tools to manage managers, departments, and leave types, ensuring smooth operations and better coordination across the organization. It facilitates easy reporting and analytics, allowing for informed decision-making and improved resource management.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export function HomeDepartmentManager() {
    
    const loggedInDepartmentManager = sessionStorage.getItem("loggedInDepartmentManager");

    let name = "";

    if (loggedInDepartmentManager) {
        name = JSON.parse(loggedInDepartmentManager).name;
    }
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Prevent scrolling
        return () => {
            document.body.style.overflow = ""; // Reset on unmount
        };
    }, []);

    return (
        <>
        <Navbar manager />
        <div className="container-fluid no-scroll d-flex align-items-center justify-content-center">
            <div className="row w-100">
                <div className="col-12 col-md-5 text-center">
                    <figure className="w-100">
                        <img
                            src="https://www.kanakkupillai.com/storage/273/about-image.gif"
                            alt="Leave Management"
                            className="img-fluid uniform-image"
                        />
                    </figure>
                </div>
                <div className="col-12 col-md-7 d-flex flex-column justify-content-center">
                    <h2 className="display-4 mb-3" style={{ fontSize: '3rem' }}>
                        Welcome <strong className="text-darkblue">{name}</strong>, to the Leave Management System.
                    </h2>
                    <p className="lead text-muted">
                        The Leave Management System provides department managers with a suite of tools to oversee and manage employee leave within their departments. Managers can review leave requests, approve or reject them, and keep track of their department's leave balances and reports.
                    </p>
                </div>
            </div>
        </div>
    </>
    );
}

export default function Home(props) {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const loggedInAdmin = sessionStorage.getItem("loggedInAdmin");
    const loggedInDepartmentManager = sessionStorage.getItem("loggedInDepartmentManager");

    // Decide which component to render based on user type
    if (loggedInUser) {
        return <Homeuser />;
    } else if (loggedInAdmin) {
        return <Homeadmin />;
    } else if (loggedInDepartmentManager) {
        return <HomeDepartmentManager />;
    }

    return <Homebase />;
}
