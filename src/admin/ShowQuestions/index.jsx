import React, { useState, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import AdminSidebar from "../../common/AdminSidebar";
import Preloader from "../../utils/Preloader";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import AdminQuestionCard from "./components/QuestionCard";
import { adminGetQuestions } from "../../apis/apis";

function ShowQuestions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  // Fetch questions using useInfiniteQuery
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["questions"],
    queryFn: adminGetQuestions,
    getNextPageParam: (lastPage) => lastPage.nextPage || false, // `nextPage` is returned by the API
    staleTime: 5 * 60 * 1000,
  });

  const observer = useRef();
  const lastQuestionRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (isError) {
    console.log("Error:", error);

    return (
      <div>
        <p>something went wrong</p>
      </div>
    );
  }

  // Ensure data is defined before accessing it
  const questions = data?.pages?.flatMap((page) => page.data) || [];

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="container-fluid dashboard-content">
            {questions.map((question, index) => {
              if (index === questions.length - 1) {
                return (
                  <AdminQuestionCard
                    key={index}
                    ref={lastQuestionRef} // Attach the ref to the last question
                    index={index + 1}
                    question={question.question_text}
                    option1={question.option_a_text}
                    option2={question.option_b_text}
                    option3={question.option_c_text}
                    option4={question.option_d_text}
                    answer={question.answer_text}
                  />
                );
              }
              return (
                <AdminQuestionCard
                  key={index}
                  index={index + 1}
                  question={question.question_text}
                  option1={question.option_a_text}
                  option2={question.option_b_text}
                  option3={question.option_c_text}
                  option4={question.option_d_text}
                  answer={question.answer_text}
                />
              );
            })}
            {isFetchingNextPage && <Preloader />}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ShowQuestions;
