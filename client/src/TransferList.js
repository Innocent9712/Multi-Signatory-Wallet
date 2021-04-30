import React from 'react'

function TransferList({transfers, approveTransfer}) {
    return (
        <div>
            <h2>Transfers</h2>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Amount</th>
                        <th>To</th>
                        <th>approvals</th>
                        <th>sent</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map(transfer=> {
                        const {id, amount, approvals, sent, to} = transfer;
                        return  (
                            <tr key={id}>
                                <td>{id}</td>
                                <td>{amount}</td>
                                <td>{to}</td>
                                <td>
                                    {approvals}
                                    <button onClick={()=>approveTransfer(id)}>approve</button>
                                </td>
                                <td>{sent?"yes":"no"}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TransferList;