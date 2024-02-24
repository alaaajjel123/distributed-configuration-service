import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Navbar from './components/Navbar';
import DropdownPage from './components/DropdownPage';
import ConfigPage from './components/ConfigPage';
import Posts from '../src/Pages/Posts/Posts';
import Post from '../src/Pages/Post/Post';
import CommonPosts from '../src/CommonPages/CommonPosts/CommonPosts'
import CommonPost from '../src/CommonPages/CommonPost/CommonPost';
import ArchivePost from '../src/ArchivePages/ArchivePage/archivePost';
import ClipLoader from "react-spinners/ClipLoader";
import SelectDatePage from './SelectDatePage/SelectDatePage';

const App = () => {
  
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    },2000)
  },[]);

    // Styles for centering the spinner
    const centerStyles = {
      backgroundColor: '#1a1e23',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    };

  return (
    <>
    {
      loading?
      <div style={centerStyles}>
      <ClipLoader color={'#36d7b7'} loading={loading} /*cssOverride={override}*/ size={50} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      :
      <Router>
      <div>
        <Navbar />
        <Routes style={{backgroundColor: '#1a1e23'}}>
          <Route path="/" element={<DropdownPage />} />
          <Route path="/microservice_page" element={<Posts />}/>
          <Route path="/post/:id" element={<Post />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/commonConfig" element={<CommonPosts />} />
          <Route path="/commonConfig/:id" element={<CommonPost />} />
          <Route path="/archive" element={<ArchivePost />} />
          <Route path="/selectDate" element={<SelectDatePage />} />
        </Routes>
      </div>
      </Router>

    }
    </>

  );
};

export default App;