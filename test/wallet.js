const {expectRevert} = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts) => {
    let wallet;
    beforeEach(async () => {
        wallet = await Wallet.new([accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]], 3);
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000});
    });
    it('should have correct approvers and quorum', async()=>{
       const approvers = await wallet.getApprovers();
       const quorum = await wallet.quorum();
       assert(approvers.length === 5);
       for (let i; i <= approvers.length; i++)  {
            assert(approvers[i] === accounts[i])
       };
       assert(quorum.toNumber() === 3);
    });
    it('Should create transfers', async () => {
        await wallet.createTransfer(100 , accounts[7], {from : accounts[3]});
        const transfers = await wallet.getTransfers();
        assert(transfers.length === 1);
        assert(transfers[0].id === '0');
        assert(transfers[0].amount === '100');
        assert(transfers[0].to === accounts[7]);
        assert(transfers[0].approvals ===  '0');
        assert(transfers[0].sent === false);
    })
    it('Should NOT creat transfers, if sender is not an approved address',async ()=>{
        await   expectRevert(
            wallet.createTransfer(100, accounts[7], {from: accounts[8]}),
            "Only Approvers allowed!"
        )
    })
    it('Should increment approvals.', async ()=>{
        await wallet.createTransfer(100 , accounts[7], {from : accounts[3]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[2]});
        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        assert(transfers[0].approvals === '2');
        assert(transfers[0].sent === false);
        assert(balance === '1000');
    })
    it('Should send transfer if Approvals >= quorum',  async ()=>{
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[7]));
        await wallet.createTransfer(100 , accounts[7], {from : accounts[3]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[2]});
        await wallet.approveTransfer(0, {from: accounts[4]});
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[7]));
        const transfers = await wallet.getTransfers();
        assert(transfers[0].sent === true);
        assert(balanceAfter.sub(balanceBefore).toNumber() === 100);
    })
    it('Should NOT approve transfer, if sender is not approved', async ()=>{
        await wallet.createTransfer(100 , accounts[7], {from : accounts[3]});
        await   expectRevert(
            wallet.approveTransfer(0, {from: accounts[9]}),
            "Only Approvers allowed!"
        )
    })
    it('Should NOT approve transfer, if transfer is already sent', async ()=>{
        await wallet.createTransfer(100 , accounts[7], {from : accounts[3]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[2]});
        await wallet.approveTransfer(0, {from: accounts[4]});
        await   expectRevert(
            wallet.approveTransfer(0, {from: accounts[0]}),
            "Transfer already sent!"
        )
    })
    it('Should NOT approve transfer, if transfer is already approved by account', async ()=>{
        await wallet.createTransfer(100 , accounts[7], {from : accounts[3]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[2]});
        await   expectRevert(
            wallet.approveTransfer(0, {from: accounts[2]}),
            "Cannot approve transfer twice!"
        )
    })
})