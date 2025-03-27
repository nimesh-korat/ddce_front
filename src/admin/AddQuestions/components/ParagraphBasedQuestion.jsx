import React, { useState } from "react";

function ParagraphBasedQuestion({ data, setData, handleSave }) {
  const [errors, setErrors] = useState({
    paragraph_title: "",
    paragraph_text: "",
    paragraph_img: "",
  });

  // Validation function to check required fields and apply trimming and minlength
  const validate = () => {
    let isValid = true;
    const newErrors = {
      paragraph_title: "",
      paragraph_text: "",
      paragraph_img: "",
    };

    // Trim input values and check for required fields
    const trimmedTitle = data.paragraph_title.trim();
    const trimmedText = data.paragraph_text.trim();

    // Paragraph title validation
    if (!trimmedTitle) {
      newErrors.paragraph_title = "Paragraph title is required.";
      isValid = false;
    } else if (trimmedTitle.length < 3) {
      newErrors.paragraph_title =
        "Paragraph title must be at least 3 characters.";
      isValid = false;
    } else if (trimmedTitle.length > 50) {
      newErrors.paragraph_title =
        "Paragraph title must be at less than 50 characters.";
      isValid = false;
    }

    // Paragraph text validation
    if (!trimmedText) {
      newErrors.paragraph_text = "Paragraph text is required.";
      isValid = false;
    } else if (trimmedText.length < 20) {
      newErrors.paragraph_text =
        "Paragraph text must be at least 20 characters.";
      isValid = false;
    }

    // Image validation (only if the checkbox is checked)
    if (data.isImageParagraph && !data.paragraph_img) {
      newErrors.paragraph_img =
        "Image is required when the checkbox is checked.";
      isValid = false;
    }

    // Update errors state
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      handleSave();
    }
  };

  return (
    <div className="col-lg-8 order-2 order-lg-1 mt-10 mt-lg-0">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <h4 className="card-title">Add Paragraph</h4>
          </div>
        </div>
        <div className="card-body pt-0">
          <form>
            <div className="row g-3">
              <div className="col-lg-12">
                <div className="form-group">
                  <label className="form-label mb-0">
                    Paragraph Title
                    <span className="text-danger ms-1 text-12">
                      (title will not be visible to students)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Paragraph Title"
                    name="paragraph_title"
                    value={data.paragraph_title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        paragraph_title: e.target.value,
                      })
                    }
                  />
                  {errors.paragraph_title && (
                    <span className="text-danger">
                      {errors.paragraph_title}
                    </span>
                  )}
                </div>
                <div className="form-group mt-3">
                  <label className="form-label mb-0">
                    Paragraph or Description
                  </label>
                  <textarea
                    className="form-control"
                    id="paragraph_text"
                    placeholder="Enter paragraph or description"
                    name="paragraph_text"
                    rows="3"
                    value={data.paragraph_text}
                    onChange={(e) =>
                      setData({
                        ...data,
                        paragraph_text: e.target.value,
                      })
                    }
                  />
                  {errors.paragraph_text && (
                    <span className="text-danger">{errors.paragraph_text}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="isImageParagraph"
                name="isImageParagraph"
                checked={data.isImageParagraph}
                onChange={(e) =>
                  setData({
                    ...data,
                    isImageParagraph: e.target.checked,
                  })
                }
              />
              <label className="form-check-label" htmlFor="isImageParagraph">
                Is image required?
              </label>
            </div>
            {data.isImageParagraph && (
              <>
                <div className="input-group mt-3">
                  <input
                    type="file"
                    className="form-control"
                    name="paragraph_img"
                    id="inputGroupFile04"
                    accept="image/*"
                    aria-label="Upload"
                    aria-describedby="inputGroupFileAddon04"
                    onChange={(e) =>
                      setData({
                        ...data,
                        paragraph_img: e.target.files[0],
                      })
                    }
                  />
                </div>
                {errors.paragraph_img && (
                  <span className="text-danger">{errors.paragraph_img}</span>
                )}
              </>
            )}
            <div className="row mt-4">
              <div className="col-lg-12 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary rounded-pill"
                  onClick={handleSubmit}
                >
                  <span className="btn-icon-start">
                    <i className="ph ph-plus fw-bold"></i>
                  </span>
                  &nbsp; Submit Paragraph
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ParagraphBasedQuestion;
