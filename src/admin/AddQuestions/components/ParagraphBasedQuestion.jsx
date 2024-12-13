import React from "react";

function ParagraphBasedQuestion({ data, setData, handleSave }) {
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
                      (title will not be visible to student){" "}
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
                  ></input>
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
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="form-check mt-3">
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
              <div className="input-group mt-3">
                <input
                  type="file"
                  className="form-control"
                  name="paragraph_img"
                  id="inputGroupFile04"
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
            )}
            {/* upper fields should be added in array and then reset */}
            <div className="row mt-4">
              <div className="col-lg-12 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary rounded-pill"
                  onClick={handleSave}
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
