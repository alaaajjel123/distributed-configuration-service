//import config from '../../config.json';
import axios from "axios";
import { useEffect, useState } from "react";
import "./Posts.css";
import "../Post/Shared.css"
import PageWithBootstrap from "../../components/PageWithBootstrap"
import { useNavigate, useLocation } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

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
  const { microservice, stage } = location.state || {}; 

  console.log(microservice)
  console.log(stage)


  useEffect(()=>{
    const fetchPosts = async() => {

      const res = await axios.get(`http://localhost:2023/config/${microservice}/?stage=${stage}`);
      //const res = await axios.get(`http://${config_service}:2023/config/${microservice}/?stage=${stage}`);
      const configValues = res.data;
      const configItems = Object.keys(configValues).map((configName) => ({
        config_value_name: configName,
        config_value_value: configValues[configName],
    })); 
    setPosts(configItems);
  };
  fetchPosts();
},[microservice, stage]); 


// Helper function to render value based on its type
const renderValue = (value) => {
if (Array.isArray(value)) {
  return `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;//value.join(", "); // Convert array to comma-separated string
} else if (typeof value === "object") {
  return JSON.stringify(value); // Convert object to JSON string
}
return value; // For strings and other types, simply return the value
};

const handleDelete = async (post) =>{
  try{
    const data = {"config_value_name":post["config_value_name"]};
    const res = await axios.delete(`http://localhost:2023/config/${microservice}/?stage=${stage}`, {data});
    if(res.request.status===200)
    {
      await new Promise((resolve) => {
      toast.success('Operation success', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        });
        setTimeout(resolve, 1700); // Wait for 1 second (adjust as needed)
    });

    }

    if(res.request.status >= 400 && res.request.status < 500)
    {
      await new Promise((resolve) => {
      toast.warn('Invalid parameters', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        //progress: ,
        theme: "light",
        });
        setTimeout(resolve, 1700); // Wait for 1 second (adjust as needed)
      });
    }

    if(res.request.status >= 500 && res.request.status < 600 )
    {
      await new Promise((resolve) => {
      toast.error('Internal server error', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        //progress: ,
        theme: "light",
        });
        setTimeout(resolve, 1700); // Wait for 1 second (adjust as needed)
      });
    }
    setPosts(posts.filter(p=> p.config_value_name !== post.config_value_name));
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
        <button onClick={()=>navigate("/post/new", {state:{microservice:microservice,stage:stage,old_config_value:"Content..."}})} className="btn btn-primary mb-4">New Config Value</button>
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
            {posts.map((post) => (           
              <tr key={post.config_value_name}>
                  <td> {post.config_value_name} </td>
                  <td> {renderValue(post.config_value_value)} </td>
                  <td>
                  <button onClick={()=>navigate(`/post/${post.config_value_name}`, {state:{microservice:microservice,stage:stage,old_config_value:JSON.stringify(post.config_value_value)}})} className="btn btn-primary ">Update</button>
                  </td>
                  <td> 
                  <button onClick={()=>handleDelete(post)} className="btn btn-danger">Delete</button>
                  <ToastContainer/>
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


export default Posts