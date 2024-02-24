import axios from "axios";
import { useEffect, useState } from "react";
import "./archivePosts.css";
import PageWithBootstrap from '../../components/PageWithBootstrap'
//import "../Post/Shared.css"
import { /*useNavigate,*/ useLocation } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

const ArchivePosts = () => {
  //const navigate = useNavigate();
  const [archivePosts, setArchivePosts] = useState(/*[]*/{});

  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    },700)
  },[]);

  // Styles for centering the spinner
  const centerStyles = {
    backgroundColor: '#1a1e23',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    marginBottom: '50px'
  };

  const location = useLocation();
  const { selectedDay, selectedMonth, selectedYear } = location.state || {};  




  useEffect(()=>{
    const fetchArchivePosts = async() => {

      const res = await axios.get(`http://localhost:2023/archivedConfigs?day=${selectedDay}&month=${selectedMonth}&year=${selectedYear}`);
      //const res = await axios.get(`http://${config_service}:2023/config/${microservice}/?stage=${stage}`);
      //const res = await axios.get(`http://localhost:2023/config/segmentation/?stage=production`);
      const configelts = res.data;
      console.log(configelts);
      let configItems;
      let objList={};
      Object.keys(configelts).map((key) =>
      {
        configItems = Object.keys(configelts[key]).map((configName) => ({
          config_value_name: configName,
          config_value_value: configelts[key][configName],
          
          }));
          objList[key]= configItems;
          //console.log(objList)
          return null;
      }
      )
      console.log(objList)
      setArchivePosts(objList)
  };
  fetchArchivePosts();
},[selectedDay,selectedMonth,selectedYear]); 


// Helper function to render value based on its type
const renderValue = (value) => {
if (Array.isArray(value)) {
  return `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;//value.join(", "); // Convert array to comma-separated string
} else if (typeof value === "object") {
  return JSON.stringify(value); // Convert object to JSON string
}
return value; // For strings and other types, simply return the value
};

  return (
    <PageWithBootstrap style={{background:"#1a1e23" }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom:'500', background:"#1a1e23" }}>
    {
      Object.keys(archivePosts).map((key) => (
      loading?
      <div style={centerStyles}>
      <ClipLoader color={'#36d7b7'} loading={loading} /*cssOverride={override}*/ size={50} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      :
      <div className="archivePosts" >
      <div className="container">
      <p style={{ textAlign: 'center' }}>{key}</p>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {archivePosts[key].map((archivePost_ind) => (           
              <tr key={archivePost_ind.config_value_name}>
                  <td> {archivePost_ind.config_value_name} </td>
                  <td> {renderValue(archivePost_ind.config_value_value)} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    ))}
    </div>
    </PageWithBootstrap>
  );

};


export default ArchivePosts;