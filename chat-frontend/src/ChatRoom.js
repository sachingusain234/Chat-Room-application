import React, { useState, useEffect, useRef } from 'react';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null); // Ref to scroll to the bottom

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/messages');
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            await fetch('http://localhost:5000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, message }),
            });

            // Clear the message input after sending
            setMessage('');
            // Fetch messages to update the list
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        // Fetch messages on component mount
        fetchMessages();
        // Poll for new messages every 2 seconds
        const interval = setInterval(() => {
            fetchMessages();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Scroll to the bottom whenever messages update
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen p-4 bg-black">
            <h2 className="text-2xl font-bold mb-4 text-white">CHAT ROOM</h2>
            <div className="flex-1 overflow-auto mb-4 p-4 border border-gray-300 rounded bg-white flex flex-col-reverse">
                <ul className="space-y-2">
                    {messages.map((msg) => (
                        <li key={msg._id} className="flex">
                            <strong className="font-semibold mr-2">{msg.user}:</strong>
                            <span>{msg.message}</span>
                        </li>
                    ))}
                    <div ref={messagesEndRef} /> {/* Empty div to help scroll to the bottom */}
                </ul>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Your name"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-1/4 p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 border-2 border-gray-400"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
