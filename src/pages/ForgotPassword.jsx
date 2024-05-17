import PageWrapper from "./../components/PageWrapper";
import { Button, Container, Card, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import icons from "./../icon-data.js";

export default function ResetPassword() {
  return (
    <PageWrapper showBackground="false">
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <Card className="text-center w-300" border="dark">
          <Card.Body>
            <Card.Title>
              <h2>Reset Password</h2>
            </Card.Title>
            <Card.Text>
              Enter your email and we'll send you a link to reset your password.
            </Card.Text>
            <Form>
              <Form.Group className="mb-2">
                <Form.Control type="email" placeholder="Email" maxLength={30} />
              </Form.Group>
              <Form.Group className="mb-4">
                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </div>
              </Form.Group>
              <Link to="/login">
                <Button variant="secondary">
                  <div className="d-flex gap-2">
                    <ReactSVG src={icons.arrowLeft} />
                    <snap>Back to Login</snap>
                  </div>
                </Button>
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </PageWrapper>
  );
}
