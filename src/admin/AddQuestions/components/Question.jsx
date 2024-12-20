import React from "react";

function Question({
  data,
  setData,
  setParagraphId,
  paragraphId,
  paragraphData,
  handleSave,
}) {
  // Check if all options are filled
  const areOptionsValid = () => {
    if (data.isImageOption) {
      data.option_a_text = "";
      data.option_b_text = "";
      data.option_c_text = "";
      data.option_d_text = "";
      return (
        data.option_a_image &&
        data.option_b_image &&
        data.option_c_image &&
        data.option_d_image
      );
    } else {
      data.option_a_image = null;
      data.option_b_image = null;
      data.option_c_image = null;
      data.option_d_image = null;
      return (
        data.option_a_text.trim() !== "" &&
        data.option_b_text.trim() !== "" &&
        data.option_c_text.trim() !== "" &&
        data.option_d_text.trim() !== ""
      );
    }
  };

  // Generate options for the dropdown
  const dropdownOptions = () => {
    if (data.isImageOption) {
      return [
        { value: "1", label: "Option A" },
        { value: "2", label: "Option B" },
        { value: "3", label: "Option C" },
        { value: "4", label: "Option D" },
      ];
    } else {
      return [
        { value: data.option_a_text, label: data.option_a_text },
        { value: data.option_b_text, label: data.option_b_text },
        { value: data.option_c_text, label: data.option_c_text },
        { value: data.option_d_text, label: data.option_d_text },
      ];
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setData((prevData) => ({
      ...prevData,
      [field]: file,
    }));
  };
  // Form validation
  const validateForm = () => {
    const isValid =
      data.question_text &&
      data.answer_text &&
      data.question_marks &&
      data.question_difficulty &&
      (data.isImageOption
        ? data.option_a_image &&
          data.option_b_image &&
          data.option_c_image &&
          data.option_d_image
        : data.option_a_text.trim() !== "" &&
          data.option_b_text.trim() !== "" &&
          data.option_c_text.trim() !== "" &&
          data.option_d_text.trim() !== "");
    return isValid;
  };
  return (
    <div className="col-lg-8 order-2 order-lg-1 mt-10 mt-lg-0">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <h4 className="card-title">Add Question</h4>
          </div>
        </div>
        <div className="card-body pt-0">
          <form>
            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-label">Question</label>
                <textarea
                  className="form-control"
                  id="question"
                  placeholder="Enter Question"
                  name="question"
                  rows="3"
                  value={data.question_text}
                  onChange={(e) =>
                    setData({
                      ...data,
                      question_text: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>
            </div>
            <div className="row g-3 mt-3">
              <div className="col-lg-6">
                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isParagraph"
                    name="isParagraph"
                    checked={data.isParagraph}
                    onChange={(e) =>
                      setData({
                        ...data,
                        isParagraph: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="isParagraph">
                    Is the question is paragraph based?
                  </label>
                </div>
                {data.isParagraph && (
                  <select
                    className="form-select"
                    onChange={(e) =>
                      setData({ ...data, tbl_paragraph: e.target.value })
                    }
                    value={data.tbl_paragraph || ""}
                  >
                    <option value="">Select Paragraph</option>
                    {paragraphData?.data?.map((paragraph) => (
                      <option
                        key={paragraph.paragraph_id}
                        value={paragraph.paragraph_id}
                      >
                        {paragraph.paragraph_title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="col-lg-6">
                <div className="form-check mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isImageQuestion"
                    name="isImageQuestion"
                    checked={data.isImageQuestion}
                    onChange={(e) =>
                      setData({
                        ...data,
                        isImageQuestion: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="isImageQuestion">
                    Is the question in image format?
                  </label>
                </div>
                {data.isImageQuestion && (
                  <div className="input-group mt-3">
                    <input
                      type="file"
                      className="form-control"
                      id="inputGroupFile04"
                      aria-describedby="inputGroupFileAddon04"
                      aria-label="Upload"
                      onChange={(e) => handleFileChange(e, "question_image")}
                    />
                  </div>
                )}
              </div>
            </div>
            {data.isImageOption ? (
              <>
                <div className="row g-3 mt-3">
                  <div className="col-sm-6">
                    <label>Option A</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleFileChange(e, "option_a_image")}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label>Option B</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleFileChange(e, "option_b_image")}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label>Option C</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleFileChange(e, "option_c_image")}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label>Option D</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleFileChange(e, "option_d_image")}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row g-3 mt-3">
                  <div className="col-sm-6">
                    <label>Option A</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option A"
                      value={data.option_a_text}
                      onChange={(e) =>
                        setData({ ...data, option_a_text: e.target.value })
                      }
                      required={!data.isImageOption}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label>Option B</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option B"
                      value={data.option_b_text}
                      onChange={(e) =>
                        setData({ ...data, option_b_text: e.target.value })
                      }
                      required={!data.isImageOption}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label>Option C</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option C"
                      value={data.option_c_text}
                      onChange={(e) =>
                        setData({ ...data, option_c_text: e.target.value })
                      }
                      required={!data.isImageOption}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label>Option D</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option D"
                      value={data.option_d_text}
                      onChange={(e) =>
                        setData({ ...data, option_d_text: e.target.value })
                      }
                      required={!data.isImageOption}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="isImageOption"
                checked={data.isImageOption}
                onChange={(e) =>
                  setData({ ...data, isImageOption: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="isImageOption">
                Are options in image format?
              </label>
            </div>
            {areOptionsValid() && (
              <>
                <div className="row g-3 mt-3">
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>Select Correct Answer</label>
                      <select
                        className="form-select"
                        value={data.answer_text}
                        onChange={(e) =>
                          setData({ ...data, answer_text: e.target.value })
                        }
                        required
                      >
                        <option value={""}>Select Option</option>
                        {dropdownOptions().map((opt, index) => (
                          <option key={index} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label>Difficulty</label>
                    <select
                      className="form-select"
                      value={data.question_difficulty}
                      onChange={(e) =>
                        setData({
                          ...data,
                          question_difficulty: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Time Consuming">Time Consuming</option>
                    </select>
                  </div>
                  <div className="col-lg-4">
                    <label>Marks</label>
                    <input
                      type="number"
                      className="form-control py-8"
                      placeholder="Enter marks"
                      value={data.question_marks}
                      onChange={(e) =>
                        setData({ ...data, question_marks: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="row g-3 mt-3"></div>

                <div className="row g-3 mt-3">
                  <div className="col-lg-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isAskedPreviously"
                        checked={data.isAskedPreviously}
                        onChange={(e) =>
                          setData({
                            ...data,
                            isAskedPreviously: e.target.checked,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="isAskedPreviously"
                      >
                        Is this question previously asked?
                      </label>
                    </div>
                    {data.isAskedPreviously && (
                      <>
                        <div className="row">
                          <div className="col-sm-6">
                            <label>Which Paper?</label>
                            <input
                              type="text"
                              className="form-control py-8"
                              value={data.prevAskedPaper}
                              placeholder="BE01"
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  prevAskedPaper: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="col-sm-6">
                            <label>Which Year?</label>
                            <input
                              type="number"
                              className="form-control py-8"
                              value={data.prevAskedYear}
                              placeholder="2024"
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  prevAskedYear: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-lg-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isFromBook"
                        checked={data.isFromBook}
                        onChange={(e) =>
                          setData({
                            ...data,
                            isFromBook: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="isFromBook">
                        Is this question from a book?
                      </label>
                    </div>
                    {data.isFromBook && (
                      <>
                        <label>Which Book?</label>
                        <input
                          type="text"
                          className="form-control py-8"
                          value={data.fromBook}
                          placeholder="DDCET Solutions"
                          onChange={(e) =>
                            setData({ ...data, fromBook: e.target.value })
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="row mt-4">
              <div className="col-lg-12 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-info rounded-pill"
                  onClick={handleSave}
                  disabled={!validateForm()}
                >
                  <span className="btn-icon-start">
                    <i className="ph ph-plus fw-bold"></i>
                  </span>
                  &nbsp; Add Question
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Question;
