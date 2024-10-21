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

const ManagerLeaveSummary = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); 
  const [leaveSummary, setLeaveSummary] = useState({});
  const [department, setDepartment] = useState("");

  const username = sessionStorage.getItem("loggedInDepartmentManager")
    ? JSON.parse(sessionStorage.getItem("loggedInDepartmentManager")).username
    : "";

  const fetchDepartment = useCallback(async () => {
    try {
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
      console.log("Error fetching leave data:", error);
      toast.error("Error fetching leave data.");
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

      acc[username][leaveType][status] =
        acc[username][leaveType][status] + 1 || 1;
      return acc;
    }, {});

    setLeaveSummary(summary);
  };

  useEffect(() => {
    const filtered = leaveData.filter((leave) =>
      leave.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    summarizeLeaveData(filtered);
  }, [searchTerm, leaveData]);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    getLeaveData();
  }, [getLeaveData, employees]);

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
    const logoBase64 = logo;

    doc.setFontSize(18);
    doc.addImage(logoBase64, 'PNG', 14, 20, 20, 20);
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
        <hr />
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by mail"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {currentRows.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Leave Type</th>
                <th>Approved</th>
                <th>Pending</th>
                <th>Rejected</th>
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((username) =>
                Object.keys(leaveSummary[username]).map((leaveType, i) => (
                  <Fragment key={`${username}-${i}`}>
                    <tr>
                      {i === 0 && (
                        <td rowSpan={Object.keys(leaveSummary[username]).length}>
                          {username}
                        </td>
                      )}
                      <td>{leaveType}</td>
                      <td>{leaveSummary[username][leaveType].approved || 0}</td>
                      <td>{leaveSummary[username][leaveType].pending || 0}</td>
                      <td>{leaveSummary[username][leaveType].rejected || 0}</td>
                      {i === 0 && (
                        <td rowSpan={Object.keys(leaveSummary[username]).length}>
                          <button
                            className="btn btn-primary custom-darkblue-button"
                            onClick={() => downloadPdf(username)}
                          >
                            Download PDF
                          </button>
                        </td>
                      )}
                    </tr>
                  </Fragment>
                ))
              )}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning text-center" role="alert">
            No leave records available.
          </div>
        )}
        {currentRows.length > 0 && (
          <Paginator
            first={indexOfFirstRow}
            rows={itemsPerPage}
            totalRecords={filteredData.length}
            onPageChange={onPageChange}
            className="custom-paginator"
          />
        )}
      </Container>
    </Fragment>
  );
};

export default ManagerLeaveSummary;
