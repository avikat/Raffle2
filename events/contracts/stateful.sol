pragma solidity ^0.8.0;

contract StatefulContract {
    // sample event
    event SetMessage(address indexed from, string message);

    // the message we're storing
    string message;

    constructor(string memory message_) public {
        emit SetMessage(msg.sender, message_);
        message = message_;
    }

    function set_message(string memory message_) public {
        emit SetMessage(msg.sender, message_);
        message = message_;
    }

    // return a string
    function get_message() public view returns (string memory messageOut) {
        messageOut = message;
    }
}