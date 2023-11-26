import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [itemName, setItemName] = useState('');
    const [response, setResponse] = useState('');

    const handleCreateItem = async () => {
        try {
            const result = await axios.post('http://localhost:8000/chat/ask', { content: itemName });
            setResponse(`Created item: ${result.data.item.name}`);
        } catch (error) {
            setResponse('Error creating item');
        }
    };

    return (
        <div>
            <h1>Create Item</h1>
            <input
                type="text"
                placeholder="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <button onClick={handleCreateItem}>Create</button>
            <p>{response}</p>
        </div>
    );
}

export default App;