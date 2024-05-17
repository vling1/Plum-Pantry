import { React, useState } from "react";
import { Button, Toast } from "react-bootstrap";

function toastButton() {
  const [showA, setShowA] = useState(true);
  const toggleShowA = () => setShowA(!showA);

  return (
    <Toast show={showA} onClose={toggleShowA}>
      <Toast.Header>
        <strong className="me-auto">Bootstrap</strong>
      </Toast.Header>
      <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
    </Toast>
  );
}
