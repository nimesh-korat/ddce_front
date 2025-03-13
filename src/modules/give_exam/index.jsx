import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Footer from "../../common/footer";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuizQuestions, studentSubmitTest } from "../../apis/apis";
import { toast } from "react-toastify";
import QuizQuestion from "./components/QuizQuestions";
import QuizQuestionSummary from "./components/QuestionSummary";

function GiveExam() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(false); // State for showing the submit button

  const location = useLocation();
  const navigate = useNavigate();
  const { exam } = location.state || {};

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ]; // Swap
    }
    return shuffledArray;
  };

  const getQuizQuestionsQuery = useMutation({
    mutationFn: getQuizQuestions,
    onSuccess: (data) => {
      const shuffledQuestions = shuffleArray(data.data);
      setQuestions(shuffledQuestions);
      // Initialize questionStatus
      setQuestionStatus(
        shuffledQuestions.map(() => ({
          std_answer: "",
          attempt_status: "1",
        }))
      );
    },
    onError: (error) => {
      console.error("getQuestionsForTest() Error: ", error);
    },
  });

  useEffect(() => {
    getQuizQuestionsQuery.mutate({ test_id: exam?.test_id });
    // eslint-disable-next-line
  }, [exam]);

  const handleOptionSelect = (optionKey, optionText) => {
    setSelectedOption({ key: optionKey, text: optionText });
  };

  const handleNextQuestion = () => {
    // Record the current answer or skip immediately
    setQuestionStatus((prevStatus) => {
      const updatedStatus = [...prevStatus];
      updatedStatus[currentQuestionIndex] = {
        std_answer: selectedOption ? selectedOption.text : "", // Store selected option's text or empty string if skipped
        attempt_status: selectedOption ? "0" : "skipped", // Set attempt_status based on whether an option is selected
      };
      return updatedStatus;
    });

    // If the current question is the last question, show the submit button after "Next" is clicked
    if (currentQuestionIndex === questions.length - 1) {
      setShowSubmitButton(true); // Show the submit button
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Proceed to next question
      if (currentQuestionIndex < questions.length - 1) {
        setSelectedOption(null);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const handleSkipQuestion = () => {
    setQuestionStatus((prevStatus) => {
      const updatedStatus = [...prevStatus];
      updatedStatus[currentQuestionIndex] = {
        std_answer: "",
        attempt_status: "skipped",
      };
      return updatedStatus;
    });

    if (currentQuestionIndex === questions.length - 1) {
      setShowSubmitButton(true); // Show the submit button
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Proceed to next question
      if (currentQuestionIndex < questions.length - 1) {
        setSelectedOption(null);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const submitTestQuery = useMutation({
    mutationFn: (data) => studentSubmitTest(data),
    onSuccess: (data) => {
      toast.success("Test submitted successfully!", {
        onClose: () => navigate("/exams"),
      });
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.log("Error:", error);
    },
  });

  const validateAllQuestionsAttempted = () => {
    const isAllAttempted = questionStatus.every(
      (status) =>
        status.attempt_status === "0" || status.attempt_status === "skipped"
    );

    if (!isAllAttempted) {
      Swal.fire({
        title: "Incomplete Test",
        text: "Please attempt or skip all questions before submitting.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    // Validate if all questions are attempted
    if (!validateAllQuestionsAttempted()) {
      return; // Stop submission if validation fails
    }

    // Update the current question before submitting
    setQuestionStatus((prevStatus) => {
      const updatedStatus = [...prevStatus];
      updatedStatus[currentQuestionIndex] = {
        std_answer: selectedOption ? selectedOption.text : "",
        attempt_status: selectedOption ? "0" : "skipped",
      };
      return updatedStatus;
    });

    const submissionData = {
      test_id: exam?.test_id,
      answers: questions.map((q, index) => ({
        question_id: q.question_id,
        std_answer: questionStatus[index]?.std_answer || "",
        attempt_status: questionStatus[index]?.attempt_status || "1",
      })),
    };

    console.log("Submission Data:", submissionData);

    // Trigger the mutation to submit the test
    submitTestQuery.mutate(submissionData);
  };

  const showPopUp = () => {
    // Validate if all questions are attempted
    if (!validateAllQuestionsAttempted()) {
      return; // Stop if validation fails
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Once you submit, you won't be able to change your answers!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit();
      }
    });
  };

  // Detect if the tab is inactive or the developer tools are open
  useEffect(() => {
    // Detect tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        Swal.fire({
          title: "Tab switched",
          text: "You have switched to another tab. Please return to continue the exam.",
          icon: "warning",
          confirmButtonText: "Ok",
        });
      }
    };

    // Detect developer tools open by checking the console
    //! NOTE: This is not a perfect solution.
    const detectDevTools = () => {
      const threshold = 160; // The width of the developer tools window in some browsers
      const height = window.outerHeight - window.innerHeight > threshold;
      const width = window.outerWidth - window.innerWidth > threshold;
      if (height || width) {
        Swal.fire({
          title: "Developer Tools Detected",
          text: "Please close the developer tools to continue with the exam.",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = setInterval(detectDevTools, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(
      questionStatus[index]?.std_answer
        ? { key: "", text: questionStatus[index].std_answer }
        : null
    );

    // Reset showSubmitButton if the navigated question is not the last one
    if (index !== questions.length - 1) {
      setShowSubmitButton(false);
    }
  };
  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="row gy-4">
            <QuizQuestion
              questions={questions}
              currentQuestion={currentQuestion}
              selectedOption={selectedOption}
              handleOptionSelect={handleOptionSelect}
              handleSkipQuestion={handleSkipQuestion}
              handleNextQuestion={handleNextQuestion}
              showSubmitButton={showSubmitButton}
              showPopUp={showPopUp}
              questionStatus={questionStatus}
              currentQuestionIndex={currentQuestionIndex}
              setSelectedOption={setSelectedOption}
            />
            <QuizQuestionSummary
              questions={questions}
              questionStatus={questionStatus}
              currentQuestionIndex={currentQuestionIndex}
              handleQuestionNavigation={handleQuestionNavigation}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default GiveExam;
