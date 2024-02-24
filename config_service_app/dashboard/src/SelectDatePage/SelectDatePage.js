import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SelectDatePage.css'; // Import the CSS file for styling

const SelectDatePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(""); // Initialize selectedMonth state
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value); // Update selectedDay when a radio button is selected
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value); // Update selectedMonth when a radio button is selected
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value); // Update selectedYear when a radio button is selected
  };

  const daysInMonth = Array.from({ length: 31 }, (_, index) => index + 1); // Array with numbers 1 to 31

  const startYear = 2023;
  const endYear = 2050;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);

  console.log(selectedDay)
  console.log(selectedMonth)
  console.log(selectedYear)

  return (
    <>

    <div style={{display: 'flex', justifyContent: 'space-between', zIndex:"100"}}>
    <div className="container-SelectDatePage" style={{ marginLeft: '250px' }}>
      <div className="list-choice">
        <div className="list-choice-title" style={{height:"45px", backgroundColor:"#fff"}}><span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>Day</span></div>
        <div className="list-choice-objects">
          {daysInMonth.map((day) => (
            <label key={day}>
              <input
                type="radio"
                name="day"
                value={day < 10 ? `0${day}` : `${day}`} // Adding leading zero for single-digit days
                onChange={handleDayChange}
              />
              <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>{day}</span>
            </label>
          ))}
        </div>
      </div>
    </div>



    <div className='container-SelectDatePage'>
    <div className="list-choice">
      <div className="list-choice-title" style={{height:"45px", backgroundColor:"#fff", paddingTop:"-10px"}}><span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>Month</span></div>
      <div className="list-choice-objects">
        <label>
          <input
            type="radio"
            name="month"
            value="01"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>January</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="02"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>February</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="03"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>March</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="04"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>April</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="05"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>May</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="06"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>June</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="07"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>July</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="08"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>August</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="09"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>September</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="10"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>October</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="11"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>November</span>
        </label>
        <label>
          <input
            type="radio"
            name="month"
            value="12"
            onChange={handleMonthChange}
          />
          <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>December</span>
        </label>
      </div>
    </div>
    </div>




    <div className="container-SelectDatePage" style={{ marginRight: '250px' }}>
      <div className="list-choice">
        <div className="list-choice-title" style={{height:"45px", backgroundColor:"#fff"}}><span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>Year</span></div>
        <div className="list-choice-objects" >
          {years.map((year) => (
            <label key={year}>
              <input
                type="radio"
                name="year"
                value={year}
                onChange={handleYearChange}
              />
              <span style={{textDecoration: 'none', color: '#102770',fontWeight: "500"}}>{year}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    </div>

    <div className="container-SelectDatePage" style={{ zIndex:"-1", position: "absolute",left: "41%" }}>
      <div className="list-choice">
        <div className="list-choice-title" style={{height:"45px", backgroundColor:"#fff"}}> <Link to="/archive" style={{ textDecoration: 'none', color: '#102770', paddingLeft:"110px"}} state={{selectedDay:selectedDay, selectedMonth:selectedMonth, selectedYear:selectedYear }}><span>Click</span> <i className="uil uil-plus"></i></Link></div>
        </div>
      </div>
    </>
  );
};

export default SelectDatePage;
