import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Card, Form, Tab, Tabs } from "react-bootstrap";
import ChangeUsername from "../components/ChangeUsername.jsx";
import ChangeEmail from "../components/ChangeEmail.jsx";
import ChangePassword from "../components/ChangePassword.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/authUtils.jsx";

export default function UserSettings() {
  const navigate = useNavigate();

  // Check if user is logged in, if not redirect to login page
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/error404");
    }
  }, []);

  return (
    <PageWrapper>
      <Tabs defaultActiveKey="general">
        {/* General tab */}
        <Tab eventKey="general" title="General" className="max-w-500">
          <ChangeUsername />
          <ChangeEmail />
          <ChangePassword />
        </Tab>
      </Tabs>
    </PageWrapper>
  );
}
