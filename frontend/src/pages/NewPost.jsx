import React from 'react'
import BlogNavBar from '../components/BlogNavBar/BlogNavBar';
import Row from 'react-bootstrap/esm/Row';
import { Form } from 'react-router-dom';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import BlogFooter from '../components/BlogFooter/BlogFooter';

export default function NewPost() {
  return (
    <>
    <BlogNavBar></BlogNavBar>
    <div style={{backgroundColor:"#F4C21B", padding:"30px"}}>
        <h2 style={{margin:"0px"}}>Pubblica un nuovo articolo:</h2>
        <hr></hr>
        <h3>Spazio dedicato al form</h3>
    </div>
    <BlogFooter></BlogFooter>
   </>
  )
}