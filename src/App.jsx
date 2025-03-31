import  { useState } from "react";

import {Alert, Confirm, Prompt} from './components/Dialogs'; 

export default function App() 
{
    const [state, setState] = useState(
    {
        demoAlert: false,
        demoConfirm: false,
        demoPrompt: false
    });

    function handleClick(event)
    {
        document.getElementById("output").innerText = ""; 

        if(event.target.id == "alertButton")
        {
            setState(previousState => { return { ...previousState, demoAlert: true }});
        }
        else if(event.target.id == "confirmButton")
        {
            setState(previousState => { return { ...previousState, demoConfirm: true }});
        }
        else if(event.target.id == "promptButton")
        {
            setState(previousState => { return { ...previousState, demoPrompt: true }});
        }
    }

    function handleComponent(props)
    {
        if(props.hasOwnProperty("aSweetAlertDemo") == true)
        {
            setState(previousState => { return { ...previousState, demoAlert: props.aSweetAlertDemo }});//false when closing
        }
        if(props.hasOwnProperty("aSweetConfirmDemo") == true)
        {
            setState(previousState => { return { ...previousState, demoConfirm: false }});

            if(props.aSweetConfirmDemo == false) return;//closed dialog without a responce... X

            document.getElementById("output").innerText = `You answerd: ${props.aSweetConfirmDemo}.`;
        }
        if(props.hasOwnProperty("aSweetPromptDemo") == true)
        {
            setState(previousState => { return { ...previousState, demoPrompt: false }});
            
            if(props.aSweetPromptDemo != false)
            {
                document.getElementById("output").innerText = `You answerd: ${props.aSweetPromptDemo}.`;
            }
        }
    }

    return (
        <>
            <button id="alertButton" onClick={handleClick} style={{marginBottom: "5px", width: "75px"}} >Alert</button>
            <button id="confirmButton" onClick={handleClick} style={{marginBottom: "5px", width: "75px"}} >Confirm</button>
            <button id="promptButton" onClick={handleClick} style={{marginBottom: "5px", width: "75px"}} >Prompt</button>
            <span id="output"></span>

            <Alert 
                name="aSweetAlertDemo"
                title="Alert"
                message="This is a simple alert." 
                visible={state.demoAlert}
                handler={handleComponent}
            />

            <Confirm 
                name="aSweetConfirmDemo"
                title="Delete"
                message="Are you sure you want to delete." 
                visible={state.demoConfirm}
                handler={handleComponent}
            />

            <Prompt 
                name="aSweetPromptDemo"
                title="Input Name"
                message="Please enter your full name." 
                visible={state.demoPrompt}
                handler={handleComponent}
            />
        </>
    )
}