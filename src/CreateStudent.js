import React from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { withRouter } from "react-router-dom";

const API_URL = "https://assign-stdent-mentor.herokuapp.com/students";

class CreateStudent extends React.Component {
  constructor() {
    super();
    this.state = {
      students: [],
      name: "",
      mentor: "",
      id: null,
      view: true,
      message: "",
    };
  }

  componentDidMount = () => this.getStudents();

  getStudents = async () => {
    try {
      const { data } = await axios.get(API_URL);
      this.setState({ students: data });
    } catch (err) {
      console.error(err);
    }
  };

  createStudent = async () => {
    const { name } = this.state;
    var config = {
      method: "post",
      url: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        name: name,
      }),
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (!response.data.error) this.props.history.push("/students");
        else alert(response.data.error);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.state.students.forEach((s) => {
      if (s.name == this.state.name) {
        this.setState({ view: false });
      }
    });
    if (this.state.view) this.createStudent();
    else this.setState({ message: "Room name already exists" });
  };

  render() {
    return (
      <>
        <div className="page">
          <h3>To add a student enter the name: </h3>
          <Form onSubmit={this.handleSubmit}>
            <label> Name : </label>{" "}
            <input
              required
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />{" "}
            {this.state.view ? "" : <span>{this.state.message}</span>}
            <br />
            <br />
            <input type="Submit" />
          </Form>{" "}
        </div>
      </>
    );
  }
}

export default withRouter(CreateStudent);
