import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../common/home';
import Login from '../common/login';
import Register from '../common/register';
import ApplyLeave from '../user/applyLeave';
import MyLeave from '../user/myleave';
import Leavetype from '../admin/leavetype';
import Manager from '../admin/manager';
import Leaverequest from '../manager/leaverequest';
import Employees from '../manager/employees';
import LeaveSummary from '../user/LeaveSummary';
import Department from '../admin/department';
import Whatsapp from '../admin/AdminWhatsAppPanel';
import LeaveSummaryEmp from '../manager/leavesummaryemp';


const Loading = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 24 24"><g><circle cx="12" cy="2.5" r="1.5" fill="#204183" opacity="0.14"/><circle cx="16.75" cy="3.77" r="1.5" fill="#204183" opacity="0.29"/><circle cx="20.23" cy="7.25" r="1.5" fill="#204183" opacity="0.43"/><circle cx="21.5" cy="12" r="1.5" fill="#204183" opacity="0.57"/><circle cx="20.23" cy="16.75" r="1.5" fill="#204183" opacity="0.71"/><circle cx="16.75" cy="20.23" r="1.5" fill="#204183" opacity="0.86"/><circle cx="12" cy="21.5" r="1.5" fill="#204183"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg>
    </div>
);

const EmployeesWithProps = () => {
    const loggedInDepartmentManager = JSON.parse(sessionStorage.getItem('loggedInDepartmentManager'));
    const username = loggedInDepartmentManager ? loggedInDepartmentManager.username : '';
    return <Employees username={username} />;
};

export default function Routesnav() {
    const [loading, setLoading] = useState(true);
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const loggedInAdmin = JSON.parse(sessionStorage.getItem('loggedInAdmin'));
    const loggedInDepartmentManager = JSON.parse(sessionStorage.getItem('loggedInDepartmentManager'));

    
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <Router>
            <Routes>
                {/* Home navigation routes */}
                <Route
                    path="/Admin"
                    element={loggedInAdmin ? <Home admin /> : <Navigate to="/login" />}
                />
                <Route
                    path="/Employee"
                    element={loggedInUser ? <Home user /> : <Navigate to="/login" />}
                />
                <Route
                    path="/DManager"
                    element={loggedInDepartmentManager ? <Home departmentManager /> : <Navigate to="/login" />}
                />

                {/* Common pages routes */}
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Login and register routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User pages routes */}
                <Route
                    path="/applyleave"
                    element={loggedInUser ? <ApplyLeave /> : <Navigate to="/login" />}
                />
                <Route
                    path="/myleave"
                    element={loggedInUser ? <MyLeave /> : <Navigate to="/login" />}
                />
                <Route
                    path="/employees"
                    element={loggedInDepartmentManager ? <EmployeesWithProps /> : <Navigate to="/login" />}
                />

                {/* Admin pages routes */}
                <Route
                    path="/manager"
                    element={loggedInAdmin ? <Manager /> : <Navigate to="/login" />}
                />
                
                <Route
                    path="/department"
                    element={loggedInAdmin ? <Department /> : <Navigate to="/login" />}
                />
                <Route
                    path="/leavetype"
                    element={loggedInAdmin ? <Leavetype /> : <Navigate to="/login" />}
                />
                <Route
                    path="/leaverequest"
                    element={loggedInDepartmentManager ? <Leaverequest /> : <Navigate to="/login" />}
                />
                <Route
                    path="/leavesummaryemp"
                    element={loggedInDepartmentManager ? <LeaveSummaryEmp /> : <Navigate to="/login" />}
                />
                <Route
                    path="/leavesummary"
                    element={loggedInUser ? <LeaveSummary /> : <Navigate to="/login" />}
                />
                <Route
                    path="/Whatsapp"
                    element={loggedInAdmin ? <Whatsapp /> : <Navigate to="/login" />}
                />
                
            </Routes>
        </Router>
    );
}
