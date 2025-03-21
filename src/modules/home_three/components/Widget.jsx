function HomeWidgets({ bgColor, img, title, count, isLocked }) {
  return (
    <>
      <div className="col-sm-6">
        <div className="card">
          <div className="card-body position-relative">
            {isLocked && (
              <div className="lock-overlay active">
                <i className="ph-fill ph-lock" />{" "}
              </div>
            )}
            {isLocked ? (
              <>
                <div className="content">
                  <div className="flex-between gap-8 mb-24">
                    <span
                      className={`flex-shrink-0 w-48 h-48 flex-center rounded-circle bg-main-600 text-white text-2xl ${bgColor}`}
                    >
                      <i className={img} />
                    </span>
                    {/* <div
                      id="complete-course"
                      className="remove-tooltip-title rounded-tooltip-value"
                    /> */}
                  </div>
                  <h4 className="mb-2">{`${count}`}</h4>
                  <span className="text-gray-300">{title}</span>
                </div>
              </>
            ) : (
              <>
                {/* Small and medium screen UI */}
                <div className="d-lg-none">
                  <div className="row">
                    <div className="col-3">
                      <div className="flex-between gap-8">
                        <span
                          className={`flex-shrink-0 w-48 h-48 flex-center rounded-circle bg-main-600 text-white text-2xl ${bgColor}`}
                        >
                          <i className={img} />
                        </span>
                      </div>
                    </div>
                    <div className="col-9 text-end">
                      <h4 className="mb-2">{`${count}`}</h4>
                      <span className="text-gray-300 text-18">{title}</span>
                    </div>
                  </div>
                </div>

                {/* Large screen and above UI */}
                <div className="d-none d-lg-block">
                  <div className="flex-between gap-8 mb-24">
                    <span
                      className={`flex-shrink-0 w-48 h-48 flex-center rounded-circle bg-main-600 text-white text-2xl ${bgColor}`}
                    >
                      <i className={img} />
                    </span>
                  </div>
                  <h4 className="mb-2">{`${count}`}</h4>
                  <span className="text-gray-300">{title}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeWidgets;
