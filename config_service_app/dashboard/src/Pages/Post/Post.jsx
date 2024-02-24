import { useNavigate,useParams,useLocation } from "react-router-dom";
import "./Post.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Post/Shared.css";
import PageWithBootstrap from"../../components/PageWithBootstrap"
import ClipLoader from "react-spinners/ClipLoader";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Post = () => {
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    },500)
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
  const { microservice, stage, old_config_value } = location.state || {}; 
  const navigate = useNavigate();
  const {id} = useParams();
  const [post, setPost] = useState({
    config_value_name:id === 'new' ? "" : id,
    config_value_value:"",
  });

  //console.log(microservice)
  //console.log(stage)
  console.log("hello")
  console.log(old_config_value)
  console.log("hello")

  //console.log(`http://localhost:2023/config/${microservice}/?stage=${stage}`);



  const handleChange = (e) =>{
    if (id !== 'new' && e.target.name === "config_value_name") {
      // If id is not 'new', and the name is "config_value_name", ignore the changes
      return;
    }

    const postClone = {...post};
    postClone[e.target.name] = e.target.value;
    setPost(postClone);
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();

    try{
      if(id === 'new')
      {
        const data = {"config_value_name":post["config_value_name"],"config_value_value":post["config_value_value"]};
        console.log(post["config_value_name"]);
        console.log(post["config_value_value"]);

        const res =await axios.post(`http://localhost:2023/config/${microservice}/?stage=${stage}`, data);
        //console.log(res.request.status);

        /**/
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
            //progress: ,
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
            theme: "light",
            });
            setTimeout(resolve, 1700);
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
            theme: "light",
            });
            setTimeout(resolve, 1700);
          });
        }

        /**/
        return navigate(-1);
      }else{
        const data = {"config_value_name":id,"config_value_value":/*JSON.stringify(*/post["config_value_value"]};
        console.log(post["config_value_name"]);
        console.log(post["config_value_value"]);
        const res =await axios.put(`http://localhost:2023/config/${microservice}/?stage=${stage}`, data);
        //console.log(res.request.status);

        /**/
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
            setTimeout(resolve, 1700); 
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
            setTimeout(resolve, 1700); 
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
            theme: "light",
            });
            setTimeout(resolve, 1700);
          });
        }

        /**/
        return navigate(-1);
      }
      
    }catch(error){
      console.log(error);
    }
  };

  return (
    <PageWithBootstrap>
    {
      loading?
      <div style={centerStyles}>
      <ClipLoader color={'#36d7b7'} loading={loading} /*cssOverride={override}*/ size={50} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      :
      <div>
      <div className='post__wrapper'>
        <div className="container">
            <form className="post">
              <input type="text" placeholder="Content..." name="config_value_name"  value={post.config_value_name}  disabled={id !== 'new'} onChange={handleChange}/>
              <input type="text" placeholder={old_config_value}/*"Content..."*/ name="config_value_value" value={post.config_value_value} onChange={handleChange} />
  
              <button onClick={handleSubmit} className="btn btn-primary">{id === "new" ? "Post" :"Update"}</button>
              <ToastContainer/>
            </form>
        </div>
      </div>
    </div>
    }
    </PageWithBootstrap>
  )
}

export default Post