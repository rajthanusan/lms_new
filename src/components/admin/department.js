import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../common/navbar';
import Loading from '../Loading';

const RegisterDepartment = () => {
    const [show, setShow] = useState(false);
    const [departmentName, setDepartmentName] = useState('');
    const [location, setLocation] = useState('');
    const [editID, setEditId] = useState('');
    const [editDepartmentName, setEditDepartmentName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading before fetching data
            await getData(); // Wait for data fetching to complete
            setLoading(false); // Set loading to false after data is fetched
        };

        fetchData(); // Call the async function
    }, []);

    const getData = async () => {
        try {
            const result = await axios.get('https://lms-be-beta.vercel.app/api/Department');
            setData(result.data);
        } catch (error) {
            console.log("Error fetching departments:", error);
            toast.error("Failed to load departments");
        }
    };

    const handleEdit = async (id) => {
        setShow(true);
        setEditId(id);
        try {
            const result = await axios.get(`https://lms-be-beta.vercel.app/api/Department/${id}`);
            setEditDepartmentName(result.data.department_name);
            setEditLocation(result.data.location);
        } catch (error) {
            console.log("Error fetching department details:", error);
            toast.error("Failed to load department details");
        }
    };

    const handleUpdate = () => {
        if (!editID) {
            toast.error('Invalid ID');
            return;
        }

        const url = `https://lms-be-beta.vercel.app/api/Department/${editID}`;
        const data = {
            department_name: editDepartmentName,
            location: editLocation,
        };

        axios.put(url, data)
            .then((result) => {
                toast.success('Department has been updated');
                getData();
                clear();
                setShow(false);
            })
            .catch((error) => {
                console.error('Error during update:', error);
                toast.error('Department updating failed');
            });
    };

    const handleSave = () => {
        const url = 'https://lms-be-beta.vercel.app/api/Department';
        const data = {
            department_name: departmentName,
            location: location
        };
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('Department has been added');
            })
            .catch((error) => {
                toast.error('Failed to add department');
            });
    };

    const clear = () => {
        setDepartmentName('');
        setLocation('');
        setEditDepartmentName('');
        setEditLocation('');
        setEditId('');
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    // Delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            axios.delete(`https://lms-be-beta.vercel.app/api/Department/${deleteId}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Department has been deleted");
                        getData();
                        handleCloseDeleteModal();
                    }
                })
                .catch((error) => {
                    toast.error('Failed to delete department');
                });
        }
    };

    if (loading) {
        return <Loading />;
      }

    return (
        <Fragment>
            <Navbar admin /> <br />
            <div className="container">
                <ToastContainer />
                <Row>
                    <Col>
                        <div className="container pt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <div className="card shadow-lg p-4">
                                        <h1 className="text-darkblue">Register Department</h1> <hr /> <br />
                                        <label htmlFor="">Department Name</label>
                                        <input type="text" className="form-control" placeholder="Department Name" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} required />
                                        <br />
                                        <label htmlFor="">Location</label>
                                        <input type="text" className="form-control" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                                        <br />
                                        <button className="btn btn-primary custom-darkblue-button" onClick={handleSave}>Create</button> <br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="container pt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <div className="card shadow-lg p-4">
                                        <h1 className="text-darkblue">Departments</h1> <hr />
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Department Name</th>
                                                    <th>Location</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.department_name}</td>
                                                        <td>{item.location}</td>
                                                        <td>
                                                            <button className="btn btn-primary custom-darkblue-button" onClick={() => handleEdit(item.id)}><FontAwesomeIcon icon={faPencil} /></button>&nbsp;
                                                            <button className="btn btn-danger" onClick={() => handleShowDeleteModal(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                        <div>
                                            <button className="btn" onClick={prevPage} disabled={currentPage === 0}>{"<"}</button>
                                            &nbsp;<span>{currentPage + 1} / {totalPages}</span>&nbsp;
                                            <button className="btn custom-darkblue-button" onClick={nextPage} disabled={currentPage === totalPages - 1}>{">"}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal show={show} onHide={() => setShow(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-darkblue">Update Department</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col>
                                        <label htmlFor="">Department Name</label>
                                        <input type="text" className="form-control" placeholder="Department Name" value={editDepartmentName} onChange={(e) => setEditDepartmentName(e.target.value)} />
                                    </Col>
                                    <Col>
                                        <label htmlFor="">Location</label>
                                        <input type="text" className="form-control" placeholder="Location" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                                <Button variant="primary custom-darkblue-button" onClick={handleUpdate}>Save Changes</Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Delete Confirmation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure you want to delete this department?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseDeleteModal}>Cancel</Button>
                                <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
};

export default RegisterDepartment;
