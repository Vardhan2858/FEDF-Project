import React, { useState } from 'react'

const Studentregistration = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const [students, setStudents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedStudents = [...students, formData];
    setStudents(updatedStudents);
    setCurrentIndex(updatedStudents.length - 1);
    setFormData({ name: "", email: "" });
  };

  const handleNext = () => {
    if (currentIndex < students.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Inline CSS Styles
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "auto",
      paddingTop: "40px",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      justifyContent: "space-between",
      gap: "20px"
    },
    card: {
      flex: 1,
      background: "#ffffff",
      padding: "25px",
      borderRadius: "10px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
      fontWeight: "600"
    },
    formGroup: {
      marginBottom: "15px"
    },
    input: {
      width: "100%",
      padding: "10px",
      marginTop: "6px",
      border: "1px solid #ddd",
      borderRadius: "6px"
    },
    btn: {
      width: "100%",
      padding: "12px",
      cursor: "pointer",
      fontSize: "16px",
      border: "none",
      borderRadius: "6px",
      transition: "0.3s"
    },
    registerBtn: {
      background: "#3f51b5",
      color: "white"
    },
    studentDetails: {
      padding: "15px",
      background: "#f6f6f6",
      borderRadius: "6px",
      border: "1px solid #ddd",
      marginBottom: "15px"
    },
    buttonGroup: {
      display: "flex",
      gap: "10px"
    },
    navBtn: {
      background: "#2196f3",
      color: "white",
      padding: "12px",
      cursor: "pointer",
      border: "none",
      borderRadius: "6px",
      transition: "0.3s",
      flex: 1
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>
        <h2 style={styles.title}>Student Registration</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              style={styles.input}
            />
          </div>

          <button type="submit" style={{ ...styles.btn, ...styles.registerBtn }}>
            Register
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.title}>Registered Student</h3>

        {currentIndex >= 0 ? (
          <div style={styles.studentDetails}>
            <p><strong>Name:</strong> {students[currentIndex].name}</p>
            <p><strong>Email:</strong> {students[currentIndex].email}</p>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#777" }}>No students registered yet</p>
        )}

        <div style={styles.buttonGroup}>
          <button
            onClick={handleBack}
            disabled={currentIndex <= 0}
            style={{ ...styles.navBtn, opacity: currentIndex <= 0 ? 0.5 : 1 }}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= students.length - 1}
            style={{ ...styles.navBtn, opacity: currentIndex >= students.length - 1 ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  )
}

export default Studentregistration
