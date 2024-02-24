//import config from '../../config.json';
import axios from "axios";
import { useEffect, useState } from "react";
import PageWithBootstrap from '../../components/PageWithBootstrap';
import "./CommonPosts.css";
//import "../Post/Shared.css"
import { useNavigate, useLocation } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

const CommonPosts = () => {
  const navigate = useNavigate();
  const [commonPosts, setCommonPosts] = useState([]);

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
  };

  const location = useLocation();
  const { stage } = location.state || {};  




  useEffect(()=>{
    const fetchCommonPosts = async() => {

      const res = await axios.get(`http://localhost:2023/commonConfigs?stage=${stage}`);
      //const res = await axios.get(`http://${config_service}:2023/config/${microservice}/?stage=${stage}`);
      const configValues = res.data;
      const configItems = Object.keys(configValues).map((configName) => ({
        config_value_name: configName,
        config_value_value: configValues[configName],
    })); 
    setCommonPosts(configItems);
  };
  fetchCommonPosts();
},[/*microservice,*/ stage]); 


// Helper function to render value based on its type
const renderValue = (value) => {
if (Array.isArray(value)) {
  return `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;//value.join(", "); // Convert array to comma-separated string
} else if (typeof value === "object") {
  return JSON.stringify(value); // Convert object to JSON string
}
return value; // For strings and other types, simply return the value
};

const handleDelete = async (commonPost) =>{
  try{
    const data = {"config_value_name":commonPost["config_value_name"]};
    await axios.delete(`http://localhost:2023/commonConfigs?stage=${stage}`, {data});
    //await axios.delete(`http://localhost:2023/config/${microservice}/?stage=${stage}`, {data});
    setCommonPosts(commonPosts.filter(p=> p.config_value_name !== commonPost.config_value_name));
  }catch(error)
  {
    console.log(error)
  }
}

  return (
    <PageWithBootstrap>
    {
      loading?
      <div style={centerStyles}>
      <ClipLoader color={'#36d7b7'} loading={loading} /*cssOverride={override}*/ size={50} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      :
      <div className="posts" >
      <div className="container">
        <button onClick={()=>navigate("/commonConfig/new", {state:{/*microservice:microservice,*/stage:stage,old_config_value:"Content..."}})} className="btn btn-primary mb-4">New Config Value</button>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {commonPosts.map((commonPost) => (           
              <tr key={commonPost.config_value_name}>
                  <td> {commonPost.config_value_name} </td>
                  <td> {renderValue(commonPost.config_value_value)} </td>
                  <td>
                  <button onClick={()=>navigate(`/commonConfig/${commonPost.config_value_name}`, {state:{/*microservice:microservice,*/stage:stage,old_config_value:JSON.stringify(commonPost.config_value_value)}})} className="btn btn-primary ">Update</button>
                  </td>
                  <td> 
                  <button onClick={()=>handleDelete(commonPost)} className="btn btn-danger">Delete</button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    }

    </PageWithBootstrap>
  );

};


export default CommonPosts