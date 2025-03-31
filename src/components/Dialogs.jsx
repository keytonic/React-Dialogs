import {useState, useEffect} from "react";
import './Dialogs.css';

function constrain(value, min, max) 
{
    return Math.min(Math.max(value, min), max);
}

function difference(num1, num2) 
{
    return Math.abs(num1 - num2);
}

export function Alert(props) 
{
    function handleClick()
    {
        props.handler({[props.name]: false});
    }

    const content = <span className="message" id="message">{props.message}</span>;
    const buttons = <button id="ok" onClick={handleClick} className="aButton">Ok</button>;

    return (
        <>
            <Window 
                name    =   {props.name}
                handler =   {props.handler}
                title   =   {props.title}
                visible =   {props.visible}
                width   =   {props.width}
                height  =   {props.height}
                content =   {content}
                buttons =   {buttons}
            />
        </>
    );
}

export function Confirm(props) 
{
    function handleClick(event)
    {
        props.handler({[props.name]: event.target.innerText});
    }

    const content = <span className="message" id="message">{props.message}</span>;
    const buttons = <><button id="ok" onClick={handleClick} className="aButton">Yes</button><button id="cancel" onClick={handleClick} className="aButton">No</button></>;

    return (
        <>
            <Window 
                name    =   {props.name}
                handler =   {props.handler}
                title   =   {props.title}
                visible =   {props.visible}
                width   =   {props.width}
                height  =   {props.height}
                content =   {content}
                buttons =   {buttons}
            />
        </>
    );
}

export function Prompt(props) 
{
    const [state, setState] = useState("");

    function handleClick(event)
    {
        props.handler({[props.name]: state});
        setState("");
    }

    function handleChange(event)
    {
        setState(event.target.value);
    }

    let content = <>
                    <span className="message" id="message">{props.message}</span>
                    <input tabindex="0" type="text" id="popup_input" onChange={handleChange} defaultValue={state} ></input>
                  </>;

    const buttons = <button id="submit" onClick={handleClick} className="aButton">Submit</button>;

    return (
        <>
            <Window 
                name    =   {props.name}
                handler =   {props.handler}
                title   =   {props.title}
                visible =   {props.visible}
                width   =   {props.width}
                height  =   {props.height}
                content =   {content}
                buttons =   {buttons}
            />
        </>
    );
}

function Window(props) 
{
    const [state, setState] = useState(
    {
        width:      props.hasOwnProperty("width") ? props.width : 0,
        height:     props.hasOwnProperty("height") ? props.height : 0,
        visible:    props.hasOwnProperty("visible") ? props.visible : true,
        clientX:    0,
        clientY:    0,
        grabbing:   false,
        resizingLeft:   false,
        resizingRight:   false,
        resizingBottom:   false,
        resizingTop:   false,
        dialog:     null
    });

    useEffect(() => 
    {
        setState(previousState => { return { ...previousState, visible: props.visible }});

    }, [props.visible]);

    useEffect(() => 
    {
        if(state.visible == true)
        {
            let dialog = document.getElementById("dialog-window");
            setState(previousState => { return { ...previousState, dialog: dialog }});
        }

    }, [state.visible]);

    useEffect(() => 
    {
        window.addEventListener('resize', handleResize);




    },[]);

    function handleResize()
    {
        const dialogWrapper = document.getElementById("dialog-wrapper");
        if(dialogWrapper == null) return;

        const rec = dialogWrapper.getBoundingClientRect();
        if(rec == null) return;

        const dialog = document.getElementById("dialog-window");
        if(dialog == null) return;

        const cssObj = window.getComputedStyle(dialog, null);
        if(cssObj == null) return;

        const width = cssObj.getPropertyValue("width").slice(0, -2);
        const height = cssObj.getPropertyValue("height").slice(0, -2);

        //center dialog on screen when screen is being resized
        dialog.style.top = ((rec.height / 2) - (height / 2)) + "px";
        dialog.style.left = ((rec.width / 2) - (width / 2)) + "px";

        //if dialog is wider thenn screen after resizing the window, constrain dialog width to screen 
        if(width > document.body.clientWidth)
        {
            dialog.style.width = document.body.clientWidth + "px";
            dialog.style.left = ((rec.width / 2) - (document.body.clientWidth / 2)) + "px";
        }

        //if dialog is wider thenn screen after resizing the window, constrain dialog width to screen
        if(height > document.body.clientHeight)
        {
            dialog.style.height = document.body.clientHeight + "px";
            dialog.style.top = ((rec.height / 2) - (document.body.clientHeight / 2)) + "px";
        }
    }

    function handleClick(event)
    {
        if(event.target.id == "ok" || event.target.id == "close")
        {
            event.preventDefault();

            if(props.hasOwnProperty("handler"))
            {
                props.handler({[props.name]: false});
            }

            setState(previousState => { return { ...previousState, grabbing: false, visible: false}});
        }
    }

    function releaseMouse(event = null)
    {
        event.preventDefault();
        setState(previousState => { return { ...previousState, grabbing: false, resizingLeft: false, resizingRight: false, resizingBottom: false, resizingTop: false}});
        state.dialog.parentNode.style.cursor = "inherit";
        state.dialog.style.userSelect = "auto";
        document.getElementById("div5").style.cursor = "grab";
    }

    function handleMouseDown(event)
    {
        if(event.target.id == "title" && state.grabbing == false)
        {
            event.preventDefault();
            document.getElementById("div5").style.cursor = "grabbing";
            setState(previousState => { return { ...previousState, grabbing: true, clientX: event.clientX, clientY: event.clientY }});
        }
        else if( event.target.id == "div6" || event.target.id == "div9" || event.target.id == "div12" )
        {
            setState(previousState => { return { ...previousState, resizingRight: true }});
        }
        else if( event.target.id == "div4" || event.target.id == "div7" || event.target.id == "div10" )
        {
            setState(previousState => { return { ...previousState, resizingLeft: true }});
        }
        else if( event.target.id == "div14" )
        {
            setState(previousState => { return { ...previousState, resizingBottom: true }});
        }
        else if( event.target.id == "div2" )
        {
            setState(previousState => { return { ...previousState, resizingTop: true }});
        }
        else if( event.target.id == "div15" )
        {
            setState(previousState => { return { ...previousState, resizingBottom: true, resizingRight: true }});
        }
        else if( event.target.id == "div13" )
        {
            setState(previousState => { return { ...previousState, resizingBottom: true, resizingLeft: true }});
        }
        else if( event.target.id == "div3" )
        {
            setState(previousState => { return { ...previousState, resizingRight: true, resizingTop: true }});
        }
        else if( event.target.id == "div1" )
        {
            setState(previousState => { return { ...previousState, resizingLeft: true, resizingTop: true }});
        }
    }

    function handleMouseMove(event)
    {
        if(state.grabbing != true && state.resizingLeft != true && state.resizingRight != true && state.resizingBottom != true && state.resizingTop != true || state.visible == false) return;

        event.preventDefault();
        state.dialog.style.userSelect = "none";

        const cssObj = window.getComputedStyle(state.dialog, null);
        const left   = parseFloat(cssObj.getPropertyValue("left").slice(0, -2));
        //const right = parseFloat(cssObj.getPropertyValue("right").slice(0, -2));
        const width  = parseFloat(cssObj.getPropertyValue("width").slice(0, -2));
        const height = parseFloat(cssObj.getPropertyValue("height").slice(0, -2));
        const top    = parseFloat(cssObj.getPropertyValue("top").slice(0, -2));
        //const bottom = parseFloat(cssObj.getPropertyValue("bottom").slice(0, -2));

        if(state.grabbing == true)
        {
            let pos1 = state.clientX - event.clientX;
            let pos2 = state.clientY - event.clientY;

            setState(previousState => { return { ...previousState, clientX: event.clientX, clientY: event.clientY }});

            state.dialog.style.top = constrain((state.dialog.offsetTop - pos2),0,(document.body.clientHeight - height)) + "px";
            state.dialog.style.left = constrain((state.dialog.offsetLeft - pos1),0,(document.body.clientWidth - width)) + "px";
            state.dialog.style.width = width + "px";
            state.dialog.style.height = height + "px";
            state.dialog.parentNode.style.cursor = "grabbing";
            state.dialog.style.minHeight = "fit-content";
        }
        else
        {
            if(state.resizingLeft == true)
            {
                state.dialog.style.maxWidth = "inherit";
                state.dialog.style.left = event.clientX + "px";
                state.dialog.style.width = ((left > event.clientX) ? (width + difference(left,event.clientX)) : (width - difference(left,event.clientX))) + "px";
                state.dialog.parentNode.style.cursor = "ew-resize";
            }
            if(state.resizingRight == true)
            {
                state.dialog.style.maxWidth = "inherit";
                state.dialog.style.left = left + "px";
                state.dialog.style.width = (width + (event.clientX - (left + width))) + "px";
                state.dialog.parentNode.style.cursor = "ew-resize";
            }
            if(state.resizingBottom == true)
            {
                state.dialog.style.minHeight = "fit-content";
                state.dialog.style.top = top + "px";
                state.dialog.style.height = (height + (event.clientY - (top + height))) + "px";
                state.dialog.parentNode.style.cursor = "ns-resize";
            }
            if(state.resizingTop == true)
            {
                state.dialog.style.minHeight = "fit-content";
                state.dialog.style.top = event.clientY + "px";
                state.dialog.style.height = ((top > event.clientY) ? (height + difference(top,event.clientY)) : (height - difference(top,event.clientY))) + "px";
                state.dialog.parentNode.style.cursor = "ns-resize";
            }
    
            if(state.resizingBottom == true && state.resizingRight == true || state.resizingTop == true && state.resizingLeft == true)
            {
                state.dialog.parentNode.style.cursor = "nw-resize";
            }
            if(state.resizingTop == true && state.resizingRight == true || state.resizingBottom == true && state.resizingLeft == true)
            {
                state.dialog.parentNode.style.cursor = "ne-resize";
            }
        }
    }

    if(state.visible == false) return (<></>);

    return (
        <>
            <div className="dialog-wrapper" id="dialog-wrapper" onMouseDown={handleMouseDown} onMouseUp={releaseMouse} onMouseMove={handleMouseMove} onMouseLeave={releaseMouse}>
                <div className="dialog-window" id="dialog-window" style={{width: (state.width ? state.width  + "px" : "auto"), height: (state.height ? state.height + "px" : "auto")}}>
                    <div className="parent">
                        <div id="div1"></div>
                        <div id="div2"></div>
                        <div id="div3"></div>
                        <div id="div4"></div>
                        <div id="div5"> 
                            <span className="title" id="title" >{props.hasOwnProperty("title") ? props.title : "Alert"}</span>
                            <span className="close" id="close" onClick={handleClick}>×</span>
                        </div>
                        <div id="div6"></div>
                        <div id="div7"></div>
                        <div id="div8"> 
                            {props.content}
                        </div>
                        <div id="div9"></div>
                        <div id="div10"></div>
                        <div id="div11"> 
                            {props.buttons}
                        </div>
                        <div id="div12"></div>
                        <div id="div13"></div>
                        <div id="div14"></div>
                        <div id="div15"></div>
                    </div>
                </div>
            </div>
        </>
    );
}