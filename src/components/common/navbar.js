import React from "react";
import { Menubar } from "primereact/menubar";
import { SplitButton } from "primereact/splitbutton";
import "../customStyles.css"; // Import the custom CSS

export function Nav() {
  const items = [{  }];

  const end = (
    <>
     
      
    </>
  );

  return <Menubar model={items} end={end} className="menu-item" />;
}

export function Navuser() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const username = loggedInUser ? JSON.parse(loggedInUser).username : "";

  const items = [
    { label: "Apply Leave", icon: "pi pi-users", url: "/applyleave" },
    { label: "My Leave", icon: "pi pi-calendar-plus", url: "/myleave" },
    {
      label: "Leave Summary",
      icon: "pi pi-calendar",
      url: "/leavesummary",
    },
  ];

  const end = (
    <SplitButton
      label={username}
      icon="pi pi-user"
      className="custom-darkblue-button" // Apply the custom CSS class
      model={[
        {
          label: "Logout",
          icon: "pi pi-power-off",
          command: () => {
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "/login";
          },
        },
      ]}
    />
  );

  return <Menubar model={items} end={end} className="menu-item" />;
}

export function Navmanager({ username }) {
  // If username is not provided as a prop, fallback to reading from sessionStorage
  const effectiveUsername =
    username ||
    (sessionStorage.getItem("loggedInDepartmentManager")
      ? JSON.parse(sessionStorage.getItem("loggedInDepartmentManager")).username
      : "");

  const items = [
    { label: "Employees", icon: "pi pi-users", url: "/employees" },
    {
      label: "Leave Requests",
      icon: "pi pi-calendar-plus",
      url: "/leaverequest",
    },
    { label: "Leave Summary", icon: "pi pi-calendar", url: "/leavesummaryemp" },
  ];

  const end = (
    <SplitButton
      label={effectiveUsername || "Manager"} // Default to 'Manager' if username is empty
      icon="pi pi-user"
      className="custom-darkblue-button"
      model={[
        {
          label: "Logout",
          icon: "pi pi-power-off",
          command: () => {
            sessionStorage.removeItem("loggedInDepartmentManager");
            window.location.href = "/login";
          },
        },
      ]}
    />
  );

  return <Menubar model={items} end={end} className="menu-item" />;
}

export function Navadmin() {
  const items = [
    { label: "Manager", icon: "pi pi-id-card", url: "/manager" },
    { label: "Department", icon: "pi pi-sitemap", url: "/department" },
    { label: "Leave Types", icon: "pi pi-calendar", url: "/leavetype" },
  ];

  const end = (
    <SplitButton
      label="admin@gmail.com"
      icon="pi pi-cog"
      className="custom-darkblue-button" // Apply the custom CSS class
      model={[
        {
          label: "Logout",
          icon: "pi pi-power-off",
          command: () => {
            sessionStorage.removeItem("loggedInAdmin");
            window.location.href = "/login";
          },
        },
      ]}
    />
  );

  return <Menubar model={items} end={end} className="menu-item" />;
}

export default function Navbar(props) {
  if (props.user) {
    return <Navuser />;
  }
  if (props.manager) {
    return <Navmanager username={props.username} />;
  }
  if (props.admin) {
    return <Navadmin />;
  } else {
    return <Nav />;
  }
}
