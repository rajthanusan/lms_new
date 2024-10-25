import React, { useState, useEffect, Fragment, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import { Paginator } from "primereact/paginator";
import Navbar from "../common/navbar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from '../image/leave-management-1.png';
import Loading from '../Loading';

const ManagerLeaveSummary = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [leaveSummary, setLeaveSummary] = useState({});
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  const username = sessionStorage.getItem("loggedInDepartmentManager")
    ? JSON.parse(sessionStorage.getItem("loggedInDepartmentManager")).username
    : "";

  const fetchDepartment = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://lms-be-beta.vercel.app/find-department", {
        params: { username },
      });
      setDepartment(response.data.department);
    } catch (error) {
      toast.error("Error fetching department.");
    }
  }, [username]);

  const fetchEmployees = useCallback(async () => {
    if (!department) return;

    try {
      const response = await axios.get("https://lms-be-beta.vercel.app/api/User", {
        params: { department },
      });
      setEmployees(response.data);
    } catch (error) {
      toast.error("Error fetching employees.");
    }
  }, [department]);

  const getLeaveData = useCallback(async () => {
    try {
      const result = await axios.get("https://lms-be-beta.vercel.app/api/LeaveView");
      const leaveList = result.data.data;

      const filteredLeaveData = leaveList.filter(leave =>
        employees.some(employee => employee.username === leave.username)
      );

      setLeaveData(filteredLeaveData);
      summarizeLeaveData(filteredLeaveData);
    } catch (error) {
      toast.error("Error fetching leave data.");
    } finally {
      setLoading(false);
    }
  }, [employees]);

  const summarizeLeaveData = (data) => {
    const summary = data.reduce((acc, leave) => {
      const username = leave.username;
      const leaveType = leave.leave_type;
      const status = leave.status;

      if (!acc[username]) {
        acc[username] = {};
      }

      if (!acc[username][leaveType]) {
        acc[username][leaveType] = {
          approved: 0,
          pending: 0,
          rejected: 0,
        };
      }

      acc[username][leaveType][status] += 1;
      return acc;
    }, {});

    setLeaveSummary(summary);
  };

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  useEffect(() => {
    if (department) {
      fetchEmployees();
    }
  }, [fetchEmployees, department]);

  useEffect(() => {
    if (employees.length > 0) {
      getLeaveData();
    }
  }, [getLeaveData, employees]);

  useEffect(() => {
    // If leave data is not empty and loading is false, set loading to false
    if (leaveData.length > 0 && loading) {
      setLoading(false);
    }
  }, [leaveData, loading]);

  const indexOfLastRow = currentPage * itemsPerPage;
  const indexOfFirstRow = indexOfLastRow - itemsPerPage;

  const filteredData = Object.keys(leaveSummary).filter((username) =>
    username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1);
  };

  const downloadPdf = (username) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.addImage(logo, 'PNG', 14, 20, 20, 20);
    doc.text("Employee Leave Summary", 14, 60);

    doc.setFontSize(12);
    doc.text(`Employee: ${username}`, 14, 70);
    doc.text(`Department: ${department}`, 14, 76);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 82);

    const leaveDataForUser = leaveSummary[username];
    const tableData = Object.keys(leaveDataForUser).map((leaveType) => [
      leaveType,
      leaveDataForUser[leaveType].approved || 0,
      leaveDataForUser[leaveType].pending || 0,
      leaveDataForUser[leaveType].rejected || 0,
    ]);

    doc.autoTable({
      startY: 90,
      head: [["Leave Type", "Approved", "Pending", "Rejected"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10, left: 14, right: 14 },
    });

    const filteredLeaveData = leaveData.filter(leave => leave.username === username);
    const detailedLeaveData = filteredLeaveData.map(leave => [
      leave.leave_type,
      new Date(leave.start_date).toLocaleDateString(),
      new Date(leave.end_date).toLocaleDateString(),
      leave.comments,
      leave.status,
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Leave Type", "Start Date", "End Date", "Comments", "Status"]],
      body: detailedLeaveData,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
      doc.text("Leave Management Team", 170, doc.internal.pageSize.height - 10);
    }

    doc.save(`${username}-leave-summary-${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <Fragment>
      <Navbar manager username={username} />
      <Container className="my-5">
        <ToastContainer />
        <h1 className="text-darkblue">Employee Leave Summary</h1>
        {loading ? (
          <Loading />
        ) : (
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {currentRows.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Leave Type</th>
                    <th>Approved</th>
                    <th>Pending</th>
                    <th>Rejected</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((username) => {
                    const leaveTypes = leaveSummary[username];
                    return Object.keys(leaveTypes).map((leaveType, index) => (
                      <tr key={`${username}-${leaveType}`}>
                        {index === 0 && (
                          <td rowSpan={Object.keys(leaveTypes).length}>{username}</td>
                        )}
                        <td>{leaveType}</td>
                        <td>{leaveTypes[leaveType].approved || 0}</td>
                        <td>{leaveTypes[leaveType].pending || 0}</td>
                        <td>{leaveTypes[leaveType].rejected || 0}</td>
                        {index === 0 && (
                          <td rowSpan={Object.keys(leaveTypes).length}>
                            <button
                              className="btn btn-primary custom-darkblue-button"
                              onClick={() => downloadPdf(username)}
                            >
                              Download PDF
                            </button>
                          </td>
                        )}
                      </tr>
                    ));
                  })}
                </tbody>
              </Table>
            ) : (
              <p className="text-center">No data available.</p>
            )}
            <Paginator
              first={(currentPage - 1) * itemsPerPage}
              rows={itemsPerPage}
              totalRecords={filteredData.length}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Container>
    </Fragment>
  );
};

export default ManagerLeaveSummary;
