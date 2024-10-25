import React, { useState, useEffect, Fragment, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../common/navbar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../image/leave-management-1.png"; 
import Loading from '../Loading';

const LeaveSummary = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveLimits, setLeaveLimits] = useState({});
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState(""); 
  const [loading, setLoading] = useState(true); 

  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const username = loggedInUser ? JSON.parse(loggedInUser).username : "";

  const fetchLeaveTypes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await axios.get("https://lms-be-beta.vercel.app/api/getLeavetype");
      setLeaveTypes(result.data);
      
      const limits = result.data.reduce((acc, item) => {
        acc[item.leave_type_name] = item.total_days || 0;
        return acc;
      }, {});
      setLeaveLimits(limits);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDepartment = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://lms-be-beta.vercel.app/find-department", {
        params: { username },
      });
      setDepartment(response.data.department);
    } catch (error) {
      console.error("Error fetching department:", error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    try {
      const result = await axios.get("https://lms-be-beta.vercel.app/api/LeaveView/");
      const filteredData = result.data.data.filter(item => item.username === username);
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchLeaveTypes();
    fetchDepartment();
    fetchLeaveRequests();
  }, [fetchLeaveTypes, fetchDepartment, fetchLeaveRequests]);

  const approvedLeaveCount = leaveTypes.map(type => {
    const approvedCount = data.filter(item => item.leave_type === type.leave_type_name && item.status === "approved").length;
    const rejectedCount = data.filter(item => item.leave_type === type.leave_type_name && item.status === "rejected").length;
    const pendingCount = data.filter(item => item.leave_type === type.leave_type_name && item.status === "pending").length;

    return {
      leave_type_name: type.leave_type_name,
      approved: approvedCount,
      rejected: rejectedCount,
      pending: pendingCount,
      total: leaveLimits[type.leave_type_name] || 0,
    };
  });
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.addImage(logo, "PNG", 14, 10, 30, 30);
    doc.text("Employee Leave Summary", 14, 50);
    doc.setFontSize(12);
    doc.text(`Employee: ${username}`, 14, 60);
    doc.text(`Department: ${department}`, 14, 66);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 72);
  
    // Prepare the table data
    const tableData = approvedLeaveCount.map(item => [
      item.leave_type_name,
      item.approved,
      item.rejected,
      item.pending,
    ]);

    // Calculate totals
    const totalApproved = approvedLeaveCount.reduce((acc, item) => acc + item.approved, 0);
    const totalRejected = approvedLeaveCount.reduce((acc, item) => acc + item.rejected, 0);
    const totalPending = approvedLeaveCount.reduce((acc, item) => acc + item.pending, 0);

    // Create the main leave summary table
    doc.autoTable({
      startY: 80, 
      head: [["Leave Type", "Approved", "Rejected", "Pending"]],
      body: [...tableData, ["Total", totalApproved, totalRejected, totalPending]], // Add totals as the last row
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10, left: 14, right: 14 },
      // Add styling for the total row
      didParseCell: (data) => {
        if (data.row.index === tableData.length) { // Check if this is the total row
          data.cell.styles.fillColor = [200, 200, 200]; // Light gray background for total row
          data.cell.styles.fontStyle = 'bold'; // Bold font for total row
        }
      }
    });

    // Prepare detailed leave data
    const detailedLeaveData = data
      .filter(leave => leave.username === username)
      .map(leave => [
        leave.leave_type,
        new Date(leave.start_date).toLocaleDateString(),
        new Date(leave.end_date).toLocaleDateString(),
        leave.comments,
        leave.status,
      ]);

    // Add the detailed leave summary table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Leave Type", "Start Date", "End Date", "Comments", "Status"]],
      body: detailedLeaveData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Add page numbers and footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
      doc.text("Leave Management Team", 170, doc.internal.pageSize.height - 10);
    }

    // Save the PDF
    doc.save(`${username}-leave-summary-${new Date().toLocaleDateString()}.pdf`);
};


  if (loading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <Navbar user />
      <ToastContainer /> <br />
      <Container>
        <h2 className="mb-4 text-darkblue">Leave Summary</h2>
        <hr />
        <div className="row">
          {approvedLeaveCount.length > 0 ? (
            approvedLeaveCount.map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h4 className="card-title text-darkblue">{item.leave_type_name}</h4>
                    <hr />
                    <p className="card-text">
                      Approved Leaves: <strong>{item.approved}</strong> / <strong>{item.total}</strong>
                    </p>
                    <p className="card-text">
                      Rejected Leaves: <strong>{item.rejected}</strong>
                    </p>
                    <p className="card-text">
                      Pending Leaves: <strong>{item.pending}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-warning" role="alert">
              No leave requests found.
            </div>
          )}
        </div>
        <div className="text-center mb-4">
          <button
            className="btn btn-primary custom-darkblue-button"
            onClick={downloadPdf}
            disabled={approvedLeaveCount.length === 0}
          >
            Download Leave Summary Report
          </button>
        </div>
      </Container>
    </Fragment>
  );
};

export default LeaveSummary;
