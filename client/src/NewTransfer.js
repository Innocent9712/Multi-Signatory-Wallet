import React, {useState} from 'react'

function NewTransfer({createTransfer}) {
    const [transfer, setTransfer] = useState([])
    // const [amount, setAmount] = useState('')
    // const [to, setTo] = useState('')

    const updateTransfer =  (e, field) => {
        const value = e.target.value;
        setTransfer({...transfer, [field]: value})
    }
    const handleSubmit = e => {
        e.preventDefault();
        // setTransfer(...transfer,{amount:amount, to:to})
        // console.log(transfer)
        createTransfer(transfer)
        // setAmount('')
        // setTo('')
    }
    return (
        <div>
            <h2>Create transfer</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor='amount'>Amount</label>
                <input type='text' id='amount' onChange={(e)=>updateTransfer(e, "amount")} />
                <label htmlFor='to'>Recipient Address</label>
                <input type='text' id='to'   onChange={(e)=>updateTransfer(e, "to")} />
                <button type='submit'>Send</button>
            </form>
        </div>
    )
}

export default NewTransfer;
