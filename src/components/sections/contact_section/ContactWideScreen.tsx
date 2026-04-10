"use client";

import TextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"
import BookingButton from "@/components/shared/booking-button/BookingButton";
import { useState } from "react";
import checkVid from '../../../assets/Check.webm';
import chime from './../../../assets/sounds/success_chime.mp3'
import { staticImportSrc } from "@/lib/staticImportSrc";
const MyTextField = styled(TextField)({
    '& .MuiInputLabel-root': {
                color:'#3A745C',
    
    },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'solid #3A745C 1pt'
    
  },
  '&:hover .MuiOutlinedInput-notchedOutline' : {
    border:'solid #3A745C 2pt',
  }
});

const ContactWideScreen = () => {
    const formFields = {
    fName:'',
    lName:'',
    email:'',
    subject:'',
    message:''
  }
  const [isSubmitted, setIsSubmitted ] = useState(false);
  const [formFieldsObj,setFormFieldsObj] = useState(formFields);
  
    const formInsert = async () => {
      // Supabase submission intentionally disabled for local UI preview.
      return Promise.resolve();
    }

  const validateFields = () => {
    const strInputsAry:string[] = Object.values(formFieldsObj);
    // Validate Empty Fields by checking for ''
    let isValid = false;
    for(let str of strInputsAry) {
      if(str.trim() === '') {
        setIsSubmitted(false);
        isValid = false;
        break;
      } else {
        isValid = true;
      }
    };
    
    if(isValid) {
        setIsSubmitted(!isSubmitted);
        formInsert();
    }


  }

  if(isSubmitted){
    return (
      <div className="contactWideScreenContain">
          <div className="flexCont" style={{display:'flex',flexDirection:'column',}}>
            <video playsInline autoPlay  >
              <source src={staticImportSrc(checkVid)} type="video/webm"/>
            </video>
            <audio autoPlay hidden>
              <source src={staticImportSrc(chime)}/>
            </audio>
          <h3 style={{fontFamily:'Inter', fontWeight:'500', color:'#55948A'}}>Message Recieved</h3>
          </div>
      </div>
    )
  } else {
      return (
    <div className="contactWideScreenContain">
      <div className="greyBox">
        <h3>Leave a Message</h3>
        <div className="nameInputs">
          <MyTextField  label="First Name" 
          InputLabelProps={{shrink: true}} 
          required
          onChange={(e)=>setFormFieldsObj({...formFieldsObj,fName:e.target.value})}
          />
          <MyTextField label="Last Name" 
          InputLabelProps={{shrink: true}}
          required
          onChange={(e)=>setFormFieldsObj({...formFieldsObj,lName:e.target.value})}
          />
        </div>
        
        <MyTextField
          sx={{ width: '100%' }}
          label="Email"
          required
          InputLabelProps={{shrink: true}} 
          onChange={(e)=>setFormFieldsObj({...formFieldsObj,email:e.target.value})}
        />
        <MyTextField
          sx={{ width: '100%' }}
          label="Subject"
          required
          InputLabelProps={{shrink: true}} 
          onChange={(e)=>setFormFieldsObj({...formFieldsObj,subject:e.target.value})}
        />
        <MyTextField
          onChange={(e)=>setFormFieldsObj({...formFieldsObj,message:e.target.value})}
          sx={{ width: '100%' }}
          label="Message" 
          multiline
          rows={5}
          required
          InputLabelProps={{shrink: true}}
        />
        
        <BookingButton variant="filled" label="Send Message" customCB={validateFields} />
      </div>
    </div>
  )
  }
}

export default ContactWideScreen