import  React  from "react";

function Header({approvers, quorum}) {
    return(
        <header>
            <ul>
                <li>Approvers: 
                    {
                    <ul>{approvers.map((approver, id)=>{
                    return(
                    <li key={id}>{approver}</li>
                )})}
                </ul>
                    }</li>
                <li>Quorum: {quorum}</li>
            </ul>
        </header>
    )
}

export default Header;