import PageWrapper from "./../components/PageWrapper.jsx";
import { Button, Card, Form, Image, InputGroup } from "react-bootstrap";
import { useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Tag from "../components/Tag.jsx";
import TagSelectionWidget from "../components/TagSelectionWidget.jsx";
import TagMeasuringWidget from "../components/TagMeasuringWidget.jsx";
import api from "../api/axiosConfig.jsx";

export default function RecipeEditor() {
  /*
    Get parameters from the link
    For example: WEBSITE.COM/?query=tag1+tag2+tag3&sort=favorite
    Will get an object with two parameters: query="tag1 tag2 tag3" and sort="favorite"
  */
  let [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);

  function cookingTimeNotValid(time) {
    if (time != "" && /^[0-9]+$/.test(time)) {
      return false;
    }
    return true;
  }

  function timeFormat(time) {
    let m = time % 60;
    let h = Math.floor(time / 60);
    return [h, m];
  }

  // data for form fields
  const [formData, setFormData] = useState({
    title: "",
    instructions: "",
    image: "",
    hours: "",
    minutes: "",
  });
  // form check for validity
  const [notValid, setNotValid] = useState({
    title: false,
    instructions: false,
    hours: false,
    minutes: false,
  });
  const [file, setFile] = useState();
  const [privacy, setPrivacy] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImage = (event) => {
    console.log(event.target.files);
    setFile(URL.createObjectURL(event.target.files[0]));

    handleChange(event);
  }

  // validation on submit
  const handleSubmit = (event) => {
    notValid.title = formData.title == "";
    notValid.instructions = formData.instructions == "";
    notValid.hours = cookingTimeNotValid(formData.hours);
    notValid.minutes = cookingTimeNotValid(formData.minutes);

    if (parseInt(formData.hours) == 0 && parseInt(formData.minutes) == 0) {
      notValid.hours = true;
      notValid.minutes = true;
    }

    handleChange(event);

    if (
      notValid.title ||
      notValid.instructions ||
      notValid.hours ||
      notValid.minutes
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const {recipeID} = useParams();
  const navigator = useNavigate();

  const getRecipe = async () => {
    try {
      const response = await api.get("/db/Recipes/recipe/" + recipeID);
      if (response.data) {
        let time = timeFormat(response.data.cookTime);

        setFormData({
          ...formData,
          title: response.data.recipeTitle,
          instructions: (response.data.instructions).join(' '),
          hours: time[0],
          minutes: time[1],
        })
        setFile(response.data.image);

        console.log(response.data);
      } else {
        navigator("/error404")
      }
    } catch (err) {
      console.error("Error fetching recipe:", err);
    }
  };

  useEffect(() => {
    // This code happens only once when the page
    // is rendered the first time
    if (recipeID) {
      getRecipe();
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageWrapper>
      <Form onSubmit={handleSubmit}>
        <div className="row d-flex justify-content-center">
          <div className="col-md-6">
            {/* Recipe title */}
            <Form.Control
              className="mt-2 border-dark"
              type="text"
              size="lg"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Recipe Title"
              maxLength={100}
              isInvalid={notValid.title}
            />
            <Form.Control.Feedback type="invalid">
              Title is required.
            </Form.Control.Feedback>

            {/* Instructions */}
            <h5 className="mt-4">Instructions</h5>
            <Form.Group className="mb-2">
              <Form.Control
                className="overflow-auto border-dark"
                as="textarea"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Type instructions here"
                rows={25}
                isInvalid={notValid.instructions}
              />
              <Form.Control.Feedback type="invalid">
                Instructions are required.
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="col-md-5">
            {/* Image dropbox */}
            <Form.Group className="mt-2 mb-3">
              <Form.Control
                className="border-dark"
                type="file"
                name="image"
                value={formData.image}
                accept=".png, .jpg, .jpeg"
                onChange={handleImage}
                size="lg"
              />
              {file != null ? (
                <Image src={file} className="mt-3" fluid />
              ) : null}
            </Form.Group>

            {/* Cooking time input */}
            <Card className="mt-2 mb-3" border="dark">
              <Card.Body>
                <h5>Cooking Time</h5>
                <Form.Group className="d-flex justify-content-center">
                  <InputGroup className="me-2">
                    <Form.Control
                      type="text"
                      name="hours"
                      value={formData.hours}
                      onChange={handleChange}
                      maxLength={2}
                      isInvalid={notValid.hours}
                    />
                    <InputGroup.Text>hrs.</InputGroup.Text>
                  </InputGroup>

                  <InputGroup>
                    <Form.Control
                      type="text"
                      inputMode="numeric"
                      name="minutes"
                      value={formData.minutes}
                      onChange={handleChange}
                      maxLength={2}
                      isInvalid={notValid.minutes}
                    />
                    <InputGroup.Text>min.</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Ingredient selection */}
            <Card className="mb-3" border="dark">
              <Card.Body>
                <TagMeasuringWidget />
              </Card.Body>
            </Card>

            {/* Miscellaneous tag selection */}
            <Card className="mb-3" border="dark">
              <Card.Body>
                <TagSelectionWidget />
              </Card.Body>
            </Card>

            {/* Privacy options */}
            <Card className="mb-3" border="dark">
              <Card.Body>
                <h5>Who can see this recipe?</h5>
                <Form.Select onChange={(event) => setPrivacy(event.target.value)}>
                  <option value="0">Only me</option>
                  <option value="1">Anyone</option>
                </Form.Select>
              </Card.Body>
            </Card>

            {/* Control buttons */}
            <div className="d-flex justify-content-between">
              <div>
                <Button className="me-2" type="submit" variant="success">
                  Save
                </Button>
                <Button variant="warning">Preview</Button>
              </div>
              <Button variant="danger">Delete</Button>
            </div>
          </div>
        </div>
      </Form>
    </PageWrapper>
  );
}
