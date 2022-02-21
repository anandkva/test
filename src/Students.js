import React from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

const API_URL = "https://assign-stdent-mentor.herokuapp.com/students";
const API_URL1 = "https://assign-stdent-mentor.herokuapp.com/mentors";
const API_URL2 = "https://assign-stdent-mentor.herokuapp.com/student";

class Students extends React.Component {
  constructor() {
    super();
    this.state = {
      students: [],
      visibility: [],
      view: false,
      mentors: [],
    };
  }

  componentDidMount = () => {
    this.getStudents();
    this.getMentors();
  };

  getStudents = async () => {
    // API Call to server and get all rooms
    try {
      const { data } = await axios.get(API_URL);
      let visibility = new Array(data.length).fill(0);
      this.setState({ students: data });
    } catch (err) {
      console.error(err);
    }
  };
  getMentors = async () => {
    // API Call to server and get all rooms
    try {
      const { data } = await axios.get(API_URL1);
      this.setState({ mentors: data });
    } catch (err) {
      console.error(err);
    }
  };

  viewMentors = (studentId) => {
    let visibility = { ...this.state.visibility };
    visibility[studentId] = !visibility[studentId];
    this.setState({ visibility });
  };

  assignMentor = (studentId, mentor) => {
    var config = {
      method: "put",
      url: `${API_URL2}/${studentId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        mentor: mentor.name,
      }),
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (!response.data.error) {
          this.viewMentors(studentId);
          this.getStudents();
        } else alert(response.data.error);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  viewToggle = () => {
    this.setState({ view: !this.state.view });
  };

  render() {
    return (
      <>
        {" "}
        <h4 style={{ textAlign: "center" }}>Students</h4>{" "}
        <Table striped bordered hover className="table " responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Mentor</th>
              <th>Change Mentor</th>
            </tr>
          </thead>
          <tbody>
            {this.state.students.map((s) => {
              return (
                <>
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.mentor ? s.mentor : "-"}</td>

                    <td>
                      <Button
                        onClick={() => {
                          this.viewMentors(s.id);
                        }}
                      >
                        Mentors
                      </Button>
                    </td>
                  </tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <p>
                    {this.state.visibility[s.id] ? (
                      <p>
                        {this.state.mentors.map((m) => {
                          return (
                            <Button
                              className="studentButton"
                              onClick={() => {
                                this.assignMentor(s.id, m);
                              }}
                            >
                              {m.name}
                            </Button>
                          );
                        })}
                      </p>
                    ) : null}
                  </p>
                </>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  }
}

export default Students;
