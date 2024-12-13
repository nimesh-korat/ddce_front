import { format } from "date-fns";

function ProfileTab({ data }) {
  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined dates
    return format(new Date(isoDate), "dd MMM yyyy");
  };
  return (
    <div className="card overflow-hidden">
      <div className="card-body p-0">
        <div className="cover-img position-relative">
          <div className="avatar-upload">
            <div className="avatar-preview">
              <div
                id="coverImagePreview"
                style={{
                  backgroundImage:
                    'url("assets/images/thumbs/setting-cover-img.png")',
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="setting-profile px-24">
          <div className="flex-between">
            <div className="d-flex align-items-end flex-wrap mb-32 gap-24">
              <img
                src="assets/images/thumbs/setting-profile-img.jpg"
                alt=""
                className="w-120 h-120 rounded-circle border border-white"
              />
              <div>
                <h4 className="mb-8">{data?.Name}</h4>
                <div className="setting-profile__infos flex-align flex-wrap gap-16">
                  <div className="flex-align gap-6">
                    <span className="text-gray-600 d-flex text-lg">
                      <i className="ph ph-swatches" />
                    </span>
                    <span className="text-gray-600 d-flex text-15">
                      {data?.College_Name}
                    </span>
                  </div>
                  {/* <div className="flex-align gap-6">
                    <span className="text-gray-600 d-flex text-lg">
                      <i className="ph ph-map-pin" />
                    </span>
                    <span className="text-gray-600 d-flex text-15">
                      Sans Fransisco
                    </span>
                  </div> */}
                  <div className="flex-align gap-6">
                    <span className="text-gray-600 d-flex text-lg">
                      <i className="ph ph-calendar-dots" />
                    </span>
                    <span className="text-gray-600 d-flex text-15">
                      {`Member Since: ${formatDate(data?.registration_time)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul
            className="nav common-tab style-two nav-pills mb-0"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-details-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-details"
                type="button"
                role="tab"
                aria-controls="pills-details"
                aria-selected="true"
              >
                Personal Details
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Academic Details
              </button>
            </li>
            {/* <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-password-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-password"
                type="button"
                role="tab"
                aria-controls="pills-password"
                aria-selected="false"
              >
                Change Password
              </button>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;
