import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DropDownPage.css'; // Import the CSS file for styling

const DropDownPage = () => {
  const jsonContent = {
    "segmentation": ["developing", "release", "production"],
    "transcription": ["developing", "production"],
    "quality_gates": ["developing", "local", "staging", "production"]
    // Add more elements as needed
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMicroservice, setSelectedMicroservice] = useState(null);
  const [selectedStage, setSelectedStage] = useState("");

  console.log(selectedStage)
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMicroserviceClick = (microservice) => {
    setSelectedMicroservice(microservice);
    setSelectedStage(null);
  };

  const handleStageClick = (stage) => {
    setSelectedStage(stage);
  };

  const [isDropdownOpenCommon, setIsDropdownOpenCommon] = useState(false);
  const [isSubDropdownOpen1Common, setIsSubDropdownOpen1Common] = useState(false);
  const [isSubDropdownOpen2Common, setIsSubDropdownOpen2Common] = useState(false);

  const toggleDropdownCommon = () => {
    setIsDropdownOpenCommon(!isDropdownOpenCommon);
  };

  const toggleSubDropdown1Common = () => {
    setIsSubDropdownOpen1Common(!isSubDropdownOpen1Common);
  };

  const toggleSubDropdown2Common = () => {
    setIsSubDropdownOpen2Common(!isSubDropdownOpen2Common);
  };

  return (
    <div className="style-drop-down">
      <div>
        <div className="sec-center" style={{ marginBottom: '50px', zIndex: 998 }}>
          <input
            type="checkbox"
            id="dropdown"
            name="dropdown"
            className="dropdown"
            checked={isDropdownOpen}
            onChange={toggleDropdown}
          />
          <label className="for-dropdown" htmlFor="dropdown">
            Select Microservice <i className="uil uil-arrow-down"></i>
          </label>

          {isDropdownOpen && (
            <div className="section-dropdown">
              {Object.keys(jsonContent).map((microservice) => (
                <React.Fragment key={microservice}>
                  <input
                    type="checkbox"
                    id={`dropdown-sub-${microservice}`}
                    name={`dropdown-sub-${microservice}`}
                    className="dropdown-sub"
                    checked={selectedMicroservice === microservice}
                    onChange={() => handleMicroserviceClick(microservice)}
                  />
                  <label className="for-dropdown-sub" htmlFor={`dropdown-sub-${microservice}`}>
                    {microservice.charAt(0).toUpperCase() + microservice.slice(1)}{' '}
                    <i className="uil uil-plus"></i>
                  </label>

                  {selectedMicroservice === microservice && (
                    <div className="section-dropdown-sub">
                      {jsonContent[microservice].map((stage) => (
                        <Link
                          key={stage}
                          onClick={() => handleStageClick(stage)}
                          to="/microservice_page"
                          state={{ "microservice":microservice, "stage":stage}}
                          className="hover-drop-down-menu"
                        >
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}{' '}
                          <i className="uil uil-arrow-right"></i>
                        </Link>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>




        <div className="sec-center" style={{ zIndex: 997}}>
          <input
            type="checkbox"
            id="dropdown-common"
            name="dropdown-common"
            className="dropdown"
            checked={isDropdownOpenCommon}
            onChange={toggleDropdownCommon}
          />
          <label className="for-dropdown" htmlFor="dropdown-common">
            Common Configs <i className="uil uil-arrow-down"></i>
          </label>

          

          {isDropdownOpenCommon && (
            <div className="section-dropdown">
              <input
                type="checkbox"
                id="dropdown-sub1-common" // Changed the ID to be unique
                name="dropdown-sub1-common" // Changed the name to be unique
                className="dropdown-sub"
                checked={isSubDropdownOpen1Common}
                onChange={toggleSubDropdown1Common}
              />

              <label className="for-dropdown-sub" htmlFor="dropdown-sub2" style={{ maxHeight:"20px" }}>
                <Link to="/commonConfig" style={{ textDecoration: 'none', color: 'inherit' }} state={{stage: "developing" }}>
                  <span>Developing</span> <i className="uil uil-plus"></i>
                </Link>
              </label>

              <input
                type="checkbox"
                id="dropdown-sub2-common" // Changed the ID to be unique
                name="dropdown-sub2-common" // Changed the name to be unique
                className="dropdown-sub"
                checked={isSubDropdownOpen2Common}
                onChange={toggleSubDropdown2Common}/>

              <label className="for-dropdown-sub" htmlFor="dropdown-sub2" style={{ maxHeight:"20px" }}>
                <Link to="/commonConfig" style={{ textDecoration: 'none', color: 'inherit' }} state={{stage: "release" }}>
                <span>Release</span> <i className="uil uil-plus"></i>
                </Link>
              </label>


              <input
                type="checkbox"
                id="dropdown-sub2-common" // Changed the ID to be unique
                name="dropdown-sub2-common" // Changed the name to be unique
                className="dropdown-sub"
                checked={isSubDropdownOpen2Common}
                onChange={toggleSubDropdown2Common}/>

              <label className="for-dropdown-sub" htmlFor="dropdown-sub2" style={{ maxHeight:"20px" }}>
                <Link to="/commonConfig" style={{ textDecoration: 'none', color: 'inherit' }} state={{stage: "production" }}>
                <span>Production</span> <i className="uil uil-plus"></i>
                </Link>
              </label>
            
            </div>
          )}
        </div>



      </div>
    </div>
  );
};

export default DropDownPage;
