import  { useState } from "react";
import './App.css'

import {Alert} from './components/Dialogs'; 

export default function App() 
{
    const [state, setState] = useState(
    {
        demoAlert: false
    });

    function handleClick(event)
    {
        if(event.target.id == "alertButton")
        {
            setState(previousState => { return { ...previousState, demoAlert: true }});
        }
    }

    function handleComponent(props)
    {
       
        if(props.hasOwnProperty("aSweetAlertDemo") == true)
        {
            setState(previousState => { return { ...previousState, demoAlert: props.aSweetAlertDemo }});//false when closing
        }
    }

    return (
        <>
            <button id="alertButton" onClick={handleClick}>Alert</button>
            <Alert 
                name="aSweetAlertDemo"
                title="Lorem Ipsum"
                message="fermentum vehicula dolor. Integer sit amet nisl viverra, varius nisl in, ullamcorper ex. Morbi a justo nec ligula dictum consequat." 
                visible={state.demoAlert}
                handler={handleComponent}
            />
        </>
    )
}