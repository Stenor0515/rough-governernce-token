import * as React from "react";
import { getContract } from "../utility/commonFun";
import { BOX, GovernorContract } from "../utility/contractAddress";

import boxABI from '../contractABI/box_abi.json'
import governorABI from '../contractABI/governor_abi.json';

const Container = () => {

  const [proposal, setProposal] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [Id, setId] = React.useState()

  // propose
  const submitPropose = async () => {

    try {
      const box = await getContract(BOX, boxABI)
      const governor = await getContract(GovernorContract, governorABI)
      console.log(box.contract, "box contract")
      console.log(governor.contract, "governor contract")
      const encodedFunctionCall = box.contract.interface.encodeFunctionData("store", [77])
      const proposeTx = await governor.contract.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposal
      )
      const proposeReceipt = await proposeTx.wait(1)
      const proposalId = proposeReceipt.events[0].args.proposalId
      console.log("proposalId", proposalId)
      setId(proposalId)
      let proposalState = await governor.contract.state(proposalId)
      console.log(`Current Proposal State: ${proposalState}`)
    } catch (error) {
      console.log(error);
    }
  };

  // vote
  const submitVote = async () => {
    try {
      const governor = await getContract(GovernorContract, governorABI)
      const voteTx = await governor.contract.castVoteWithReason(Id, 1, reason)
      await voteTx.wait(1)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="container">
      <textarea
        type="text"
        className="form-control mt-3"
        onChange={(e) => { setProposal(e.target.value) }}
        value={proposal}
        placeholder="Enter your proposal"
        aria-label="Your proposal"
        aria-describedby="textArea"
      />
      <button
        className="btn btn-outline-success m-3 float-right"
        type="button"
        id="button-addon2"
        onClick={submitPropose}
      >
        Submit Proposal
      </button>
      <textarea
        type="text"
        className="form-control mt-3"
        onChange={(e) => { setReason(e.target.value) }}
        value={reason}
        placeholder="Enter your reason"
        aria-label="Your proposal"
        aria-describedby="textArea"
      />
      <button className="btn btn-outline-success mt-3 float-right" type="button" id="button-addon2" onClick={submitVote}>Submit Reason</button>
    </div>
  );
};

export default Container;
