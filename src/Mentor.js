import { withRouter } from "react-router-dom";
import React from "react";
import axios from "axios";

import { Table, Button } from "react-bootstrap";

const API_URL = "https://assign-stdent-mentor.herokuapp.com/mentor";
const API_URL1 = "https://assign-stdent-mentor.herokuapp.com/students";

class Mentor extends React.Component {
  constructor() {
    super();
    this.state = {
      mentor: [],
      mentorStuds: [],
      students: [],
      view: false,
    };
  }

  componentDidMount = () => {
    this.getMentor();
    this.getStudents();
  };
  getMentor = async () => {
    // API Call to server
    try {
      const id = this.props.match.params.id;
      const { data } = await axios.get(`${API_URL}/${id}`);
      this.setState({ mentor: data, mentorStuds: data.studs });
    } catch (err) {
      console.error(err);
    }
  };
  getStudents = async () => {
    // API Call to server and get all students
    try {
      const { data } = await axios.get(API_URL1);
      let students = [];
      for (let i in data) {
        if (!data[i].mentor) {
          students.push(data[i]);
        }
      }
      this.setState({ students });
    } catch (err) {
      console.error(err);
    }
  };

  viewToggle = () => {
    this.setState({ view: !this.state.view });
  };

  addStudent = (student) => {
    var config = {
      method: "put",
      url: `${API_URL}/${this.state.mentor.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        student: student.name,
      }),
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.getMentor();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    return (
      <>
        {" "}
        <h4>Mentor Info</h4>{" "}
        <Table striped bordered hover className="table " responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.mentor.id}</td>
              <td>{this.state.mentor.name}</td>
              <td>
                <ul style={{ listStyle: "none" }}>
                  {this.state.mentorStuds.map((s) => {
                    return <li>{s}</li>;
                  })}
                </ul>
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
        <br />
        <br />
        <h4>
          List of students without a mentor. Click to add the student to this
          mentor
        </h4>
        {this.state.students.map((s) => {
          return (
            <Button
              className="studentButton"
              onClick={() => {
                this.addStudent(s);
              }}
            >
              {s.name}
            </Button>
          );
        })}
      </>
    );
  }
}
export default withRouter(Mentor);
