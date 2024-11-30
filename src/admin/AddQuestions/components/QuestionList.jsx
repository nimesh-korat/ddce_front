import { useState } from "react";

function QuestionList({
  questionList,
  onEdit,
  onDelete,
  onSubmit,
  editingIndex, // Receiving editingIndex as a prop
}) {
  const handleEdit = (index) => {
    console.log("Editing index:", index);
    onEdit(index); // Call the parent function to edit
  };

  const handleDelete = (index) => {
    onDelete(index); // Call the parent function to delete the question
  };

  const handleSubmit = () => {
    onSubmit(); // Submit all questions
  };

  return (
    <div className="col-lg-4 order-1 order-lg-2 mt-lg-2">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title d-flex justify-content-center">
            <i>Questions List</i>
          </h4>
        </div>
        <div className="card-body pt-0">
          {questionList.length === 0 ? (
            <p className="text-center">No questions added yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questionList.map((question, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{question.question_text || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => onEdit(index)}
                        disabled={editingIndex === index} // Disable the button if it's the editing question
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="d-flex justify-content-end">
            {questionList.length > 0 && (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={editingIndex !== null} // Disable Submit if a question is being edited
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionList;
