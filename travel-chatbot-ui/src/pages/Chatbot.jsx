
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios"; 
// import "../styles/Chatbot.css";

// // Base URL for Node.js backend (Authentication, Data Storage)
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
// // Base URL for Python backend (Gemini AI Chatbot)
// const CHATBOT_API_URL = process.env.REACT_APP_CHATBOT_API_URL || "http://localhost:5001";

// const Chatbot = ({ userProfile }) => {
//   const [chats, setChats] = useState([]);
//   const [activeChatId, setActiveChatId] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);
  
//   // ✅ CRITICAL STATE: Stores proposed options while waiting for user selection
//   const [proposedOptions, setProposedOptions] = useState(null); 
  
//   // Custom safe date parser for DD/MM/YYYY format
//   const parseSafeDate = (dateString) => {
//       // Replaces common separators with a slash for safety before parsing
//       const cleanedDate = dateString.replace(/[-.\s]/g, '/');
//       const parts = cleanedDate.split('/');
      
//       if (parts.length === 3) {
//           const [day, month, year] = parts;
//           // Reformat to YYYY-MM-DD for reliable ISO conversion required by MongoDB
//           return new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
//       }
//       return null;
//   };

//   // Helper function to send message to AI model (Fallback)
//   const sendAiResponse = async (currentMessage, currentChats) => {
//     try {
//         const response = await axios.post(`${CHATBOT_API_URL}/chat`, {
//             message: currentMessage,
//             chatId: activeChatId,
//             userProfile,
//         });

//         const botMessage = {
//             sender: "bot",
//             text: response.data.reply || "❌ No reply from server",
//         };

//         const finalChats = currentChats.map((chat) =>
//             chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
//         );
//         setChats(finalChats);
//     } catch (error) {
//         console.error("❌ Error fetching bot reply:", error);
//         const errorMsg = {
//             sender: "bot",
//             text: "⚠️ Could not connect to server. Please try again.",
//         };
//         const errorChats = currentChats.map((chat) =>
//             chat.id === activeChatId ? { ...chat, messages: [...chat.messages, errorMsg] } : chat
//         );
//         setChats(errorChats);
//     }
//   };
  
//   // 1. LOAD CHAT HISTORY from MongoDB (when userProfile changes/on login)
//   useEffect(() => {
//     const loadChatHistory = async () => {
//       if (userProfile && userProfile._id) {
//         try {
//           const response = await axios.get(`${API_URL}/api/chats/load/${userProfile._id}`);
//           const loadedChats = response.data.chats;
//           setChats(loadedChats.length > 0 ? loadedChats : []);
//           setActiveChatId(loadedChats.length > 0 ? loadedChats[0].id : null);
//         } catch (error) {
//           console.error("Failed to load chat history:", error);
//           setChats([]);
//           setActiveChatId(null);
//         }
//       }
//     };
//     loadChatHistory();
//   }, [userProfile]);

//   // 2. SAVE CHAT HISTORY to MongoDB (when chats state changes)
//   useEffect(() => {
//     const saveChatHistory = async () => {
//       if (userProfile && userProfile._id && chats.length > 0) {
//         try {
//           await axios.post(`${API_URL}/api/chats/save`, {
//             userId: userProfile._id,
//             chats,
//           });
//         } catch (error) {
//           console.error("Failed to save chat history:", error);
//         }
//       }
//     };
//     saveChatHistory();
//   }, [chats, userProfile]);

//   // 3. Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chats, activeChatId]);

//   // --- START: HANDLERS ---
//   const handleNewChat = () => {
//     const newChat = {
//       id: Date.now().toString(),
//       title: `Chat ${chats.length + 1}`,
//       messages: [{ sender: "bot", text: "Hello! Ask me about festivals or travel plans." }],
//     };
//     setChats([newChat, ...chats]);
//     setActiveChatId(newChat.id);
//   };

//   const handleDeleteChat = (chatId) => {
//     const updatedChats = chats.filter((chat) => chat.id !== chatId);
//     setChats(updatedChats);
//     if (chatId === activeChatId) {
//       setActiveChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
//     }
//   };

//   // ✅ New dedicated function to trigger the booking automation
//   const triggerBookingAutomation = async (bookingType, optionIndex) => {
    
//     if (!proposedOptions || !proposedOptions.options[optionIndex]) return;

//     setLoading(true);
//     const selectedOption = proposedOptions.options[optionIndex];

//     const bookingData = {
//         userId: userProfile._id,
//         bookingType: bookingType, 
//         details: selectedOption.details, 
//         cost: selectedOption.details.price || selectedOption.details.price_per_night, 
//         userEmail: userProfile.email,
//         userPhone: userProfile.phone
//     };

//     try {
//         // Call the new direct booking execution endpoint (No more n8n webhook)
//         const response = await axios.post(`${API_URL}/api/execute-booking`, bookingData);
        
//         const botMessage = {
//             sender: "bot",
//             text: `✅ Booking confirmed for **${selectedOption.name}**! Confirmation code ${response.data.confirmationCode}. A final SMS has been sent to ${userProfile.phone}.`
//         };
        
//         const finalChats = chats.map((chat) =>
//             chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
//         );
//         setChats(finalChats);
//         setProposedOptions(null); // Clear proposals after successful booking
        
//     } catch (error) {
//         console.error("❌ Booking Execution Failed:", error);
//         const errorMsg = {
//             sender: "bot",
//             text: `⚠️ Could not complete ${bookingType} booking. Please check your phone number format.`,
//         };
//         const errorChats = chats.map((chat) =>
//             chat.id === activeChatId ? { ...chat, messages: [...chat.messages, errorMsg] } : chat
//         );
//         setChats(errorChats);
//     } finally {
//         setLoading(false);
//     }
//   };
  
//   const handleSendMessage = async () => {
//     if (!message.trim() || !activeChatId) return;

//     // Reset proposals before new action
//     setProposedOptions(null); 

//     const userMessage = { sender: "user", text: message };
//     const initialChats = chats.map((chat) =>
//       chat.id === activeChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
//     );
//     setChats(initialChats);
//     setMessage("");
//     setLoading(true);
    
//     const currentMessage = message; 

//     try {
//       const messageLower = currentMessage.toLowerCase();
      
//       const tripMatch = currentMessage.match(
//         /(?:trip|plan|go to|going to|i want to go)\s+(?:.*?)\s+(.*?)\s+.*?(?:from|between|starting|and)\s+(\d{1,2}[/.-]\d{1,2}[/.-]\d{4}).*?(\d{1,2}[/.-]\d{1,2}[/.-]\d{4})/i
//       );

//       // Regex to capture BOOKING intent, location, and number of guests
//       const bookingIntentMatch = currentMessage.match(
//         /(book|reserve)\s+(a|the)\s+(hotel|restaurant)\s+(?:in|at)\s+([a-z\s]+)(?:\s+for\s+(\d+)\s+(?:people|guests?))?/i
//       );
      
//       // ✅ FIX: Use simple includes check to catch the general intent
//       if (messageLower.includes("book a hotel") || messageLower.includes("book a restaurant")) {
        
//         const type = messageLower.includes("hotel") ? "hotel" : "restaurant";

//         const location = bookingIntentMatch ? bookingIntentMatch[4].trim() : null;
//         const guests = bookingIntentMatch ? parseInt(bookingIntentMatch[5] || '2', 10) : 2; 

//         // 1. If location is missing (e.g., user just typed "book a hotel"), prompt for details.
//         if (!location || !guests || isNaN(guests) || guests < 1) {
//             const botMessage = {
//                 sender: "bot",
//                 text: `I need the **location** and **number of guests** to search for available ${type}s. Please resend your request like this: "book a ${type} in [City] for [Number] guests"`
//             };
//             const finalChats = initialChats.map((chat) =>
//                 chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
//             );
//             setChats(finalChats);
//             return; 
//         }

//         // 2. Call backend to get filtered, available options
//         const proposalResponse = await axios.post(`${API_URL}/api/propose-options`, { type, location, guests });
        
//         let promptBotMessage;
        
//         if (proposalResponse.data.found) {
//             setProposedOptions(proposalResponse.data);

//             const proposalsText = proposalResponse.data.options.map((r, i) => 
//                 `Option ${i + 1}: **${r.name}** (${r.price}) - ${r.description.slice(0, 40)}...`
//             ).join('\n\n');
            
//             promptBotMessage = {
//                 sender: "bot",
//                 text: `I found ${proposalResponse.data.options.length} available ${type}s in ${location}:\n\n${proposalsText}\n\n**Which option would you like to book? Click the button below your choice.**`
//             };
//         } else {
//             promptBotMessage = {
//                 sender: "bot",
//                 text: proposalResponse.data.message
//             };
//         }
        
//         const finalChats = initialChats.map((chat) =>
//             chat.id === activeChatId ? { ...chat, messages: [...chat.messages, promptBotMessage] } : chat
//         );
//         setChats(finalChats);
        
//       } else if (tripMatch) {
//           // --- TRIP SAVING LOGIC ---
//           const destination = tripMatch[1].trim();
//           const startDateString = tripMatch[2].trim();
//           const endDateString = tripMatch[3].trim();
          
//           const startDate = parseSafeDate(startDateString);
//           const endDate = parseSafeDate(endDateString);

//           if (!startDate || !endDate) {
//              const botMessage = {
//                 sender: "bot",
//                 text: "I couldn't understand your dates. Please specify the trip destination and dates in DD/MM/YYYY format."
//             };
//             const finalChats = initialChats.map((chat) =>
//                 chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
//             );
//             setChats(finalChats);
//             return; 
//           } else {
//              const tripData = {
//                  userId: userProfile._id,
//                  destination: destination,
//                  startDate: startDate,
//                  endDate: endDate,
//              };

//              await axios.post(`${API_URL}/api/trips/save`, tripData);

//              const botMessage = {
//                  sender: "bot",
//                  text: `✅ Trip to ${destination} from ${startDateString} to ${endDateString} has been saved! I will now check for local festivals and send you an SMS alert.`
//              };
//              const finalChats = initialChats.map((chat) =>
//                  chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
//              );
//              setChats(finalChats);
//           }
          
//       } else {
//         // --- STANDARD AI CHAT CALL ---
//         await sendAiResponse(currentMessage, initialChats);
//       }

//     } catch (error) {
//       console.error("❌ Error fetching bot reply:", error);
//       const errorMsg = {
//         sender: "bot",
//         text: "⚠️ Could not connect to server or request failed. Please try again.",
//       };
//       const errorChats = initialChats.map((chat) =>
//         chat.id === activeChatId ? { ...chat, messages: [...chat.messages, errorMsg] } : chat
//       );
//       setChats(errorChats);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const activeChat = chats.find((c) => c.id === activeChatId);

//   if (!userProfile) return <p>Please log in to use the chatbot.</p>;

//   return (
//     <div className="chatbot-container">
//       {/* Sidebar UI remains here */}
//       <div className="chatbot-sidebar">
//         <div className="sidebar-header">
//           <h2>Chats</h2>
//           <button onClick={handleNewChat}>+ New</button>
//         </div>
//         <ul>
//           {chats.map((chat) => (
//             <li
//               key={chat.id}
//               className={chat.id === activeChatId ? "active" : ""}
//             >
//               <span onClick={() => setActiveChatId(chat.id)}>{chat.title}</span>
//               <button onClick={() => handleDeleteChat(chat.id)}>🗑️</button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Area UI remains here */}
//       <div className="chatbot-chatarea">
//         <div className="chatbot-messages">
//           {activeChat ? (
//             activeChat.messages.map((msg, idx) => (
//               <div key={idx} className={`chatbot-message ${msg.sender}`}>
//                 {msg.sender === "bot" && <div className="avatar">🤖</div>}
//                 {msg.sender === "user" && <div className="avatar">👤</div>}
//                 <div className="message-text">{msg.text}</div>
                
//                 {/* ✅ CONDITIONAL BUTTONS FOR SELECTION */}
//                 {(proposedOptions && msg.sender === 'bot' && activeChat.messages.length - 1 === idx && proposedOptions.found) && (
//                     <div className="flex-col gap-2 mt-2">
//                         {proposedOptions.options.map((option, index) => (
//                             <button 
//                                 key={index}
//                                 className="booking-select-button"
//                                 onClick={() => triggerBookingAutomation(proposedOptions.type, index)}
//                                 disabled={loading}
//                             >
//                                 Book Option {index + 1} ({option.name.substring(0, 20)}...)
//                             </button>
//                         ))}
//                     </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>Select or start a chat</p>
//           )}
//           {loading && <p className="typing">Bot is typing...</p>}
//           <div ref={messagesEndRef} />
//         </div>

//         {activeChat && (
//           <div className="chatbot-input">
//             <input
//               type="text"
//               placeholder="Type your question..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//             />
//             <button onClick={handleSendMessage} disabled={loading}>
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; 
import "../styles/Chatbot.css";

// Base URL for Node.js backend (Authentication, Data Storage)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
// Base URL for Python backend (Gemini AI Chatbot)
const CHATBOT_API_URL = process.env.REACT_APP_CHATBOT_API_URL || "http://localhost:5001";

const Chatbot = ({ userProfile }) => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // ✅ CRITICAL STATE: Stores proposed options while waiting for user selection
  const [proposedOptions, setProposedOptions] = useState(null); 
  
  // Custom safe date parser for DD/MM/YYYY format
  const parseSafeDate = (dateString) => {
      const cleanedDate = dateString.replace(/[-.\s]/g, '/');
      const parts = cleanedDate.split('/');
      
      if (parts.length === 3) {
          const [day, month, year] = parts;
          // Reformat to YYYY-MM-DD for reliable ISO conversion required by MongoDB
          return new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
      }
      return null;
  };

  // Helper function to send message to AI model (Fallback)
  const sendAiResponse = async (currentMessage, currentChats) => {
    try {
        const response = await axios.post(`${CHATBOT_API_URL}/chat`, {
            message: currentMessage,
            chatId: activeChatId,
            userProfile,
        });

        const botMessage = {
            sender: "bot",
            text: response.data.reply || "❌ No reply from server",
        };

        const finalChats = currentChats.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
        );
        setChats(finalChats);
    } catch (error) {
        console.error("❌ Error fetching bot reply:", error);
        const errorMsg = {
            sender: "bot",
            text: "⚠️ Could not connect to server. Please try again.",
        };
        const errorChats = currentChats.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, errorMsg] } : chat
        );
        setChats(errorChats);
    }
  };
  
  // 1. LOAD CHAT HISTORY from MongoDB (when userProfile changes/on login)
  useEffect(() => {
    const loadChatHistory = async () => {
      if (userProfile && userProfile._id) {
        try {
          const response = await axios.get(`${API_URL}/api/chats/load/${userProfile._id}`);
          const loadedChats = response.data.chats;
          setChats(loadedChats.length > 0 ? loadedChats : []);
          setActiveChatId(loadedChats.length > 0 ? loadedChats[0].id : null);
        } catch (error) {
          console.error("Failed to load chat history:", error);
          setChats([]);
          setActiveChatId(null);
        }
      }
    };
    loadChatHistory();
  }, [userProfile]);

  // 2. SAVE CHAT HISTORY to MongoDB (when chats state changes)
  useEffect(() => {
    const saveChatHistory = async () => {
      if (userProfile && userProfile._id && chats.length > 0) {
        try {
          await axios.post(`${API_URL}/api/chats/save`, {
            userId: userProfile._id,
            chats,
          });
        } catch (error) {
          console.error("Failed to save chat history:", error);
        }
      }
    };
    saveChatHistory();
  }, [chats, userProfile]);

  // 3. Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId]);

  // --- START: HANDLERS ---
  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `Chat ${chats.length + 1}`,
      messages: [{ sender: "bot", text: "Hello! Ask me about festivals or travel plans." }],
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (chatId === activeChatId) {
      setActiveChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
  };

  // ✅ New dedicated function to trigger the booking automation
  const triggerBookingAutomation = async (bookingType, optionIndex) => {
    
    if (!proposedOptions || !proposedOptions.options[optionIndex]) return;

    setLoading(true);
    const selectedOption = proposedOptions.options[optionIndex];

    const bookingData = {
        userId: userProfile._id,
        bookingType: bookingType, 
        details: selectedOption.details, 
        cost: selectedOption.details.price || selectedOption.details.price_per_night, 
        userEmail: userProfile.email,
        userPhone: userProfile.phone
    };

    try {
        // Call the new direct booking execution endpoint (No more n8n webhook)
        const response = await axios.post(`${API_URL}/api/execute-booking`, bookingData);
        
        const botMessage = {
            sender: "bot",
            text: `✅ Booking confirmed for **${selectedOption.name}**! Confirmation code ${response.data.confirmationCode}. A final SMS has been sent to ${userProfile.phone}.`
        };
        
        const finalChats = chats.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
        );
        setChats(finalChats);
        setProposedOptions(null); // Clear proposals after successful booking
        
    } catch (error) {
        console.error("❌ Booking Execution Failed:", error);
        const errorMsg = {
            sender: "bot",
            text: `⚠️ Could not complete ${bookingType} booking. Please check your phone number format.`,
        };
        const errorChats = chats.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, errorMsg] } : chat
        );
        setChats(errorChats);
    } finally {
        setLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || !activeChatId) return;

    // Reset proposals before new action
    setProposedOptions(null); 

    const userMessage = { sender: "user", text: message };
    const initialChats = chats.map((chat) =>
      chat.id === activeChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
    );
    setChats(initialChats);
    setMessage("");
    setLoading(true);
    
    const currentMessage = message; 
    const messageLower = currentMessage.toLowerCase(); 

    try {
      
      const tripMatch = currentMessage.match(
        /(?:trip|plan|go to|going to|i want to go)\s+(?:.*?)\s+(.*?)\s+.*?(?:from|between|starting|and)\s+(\d{1,2}[/.-]\d{1,2}[/.-]\d{4}).*?(\d{1,2}[/.-]\d{1,2}[/.-]\d{4})/i
      );

      // Regex to capture BOOKING intent, location, and number of guests
      const bookingIntentMatch = currentMessage.match(
        /(book|reserve)\s+(a|the)\s+(hotel|restaurant)\s+(?:in|at)\s+([a-z\s]+)(?:\s+for\s+(\d+)\s+(?:people|guests?))?/i
      );
      
      // 1. Check for Final Confirmation (Highest Priority)
      const finalConfirmationMatch = currentMessage.match(/(?:yes|book|option)\s+\s*(\d+)/i);
      
      if (finalConfirmationMatch && proposedOptions) {
          // If user confirms option 1, 2, or 3, trigger the final booking execution
          const index = parseInt(finalConfirmationMatch[1], 10) - 1;
          
          if (index >= 0 && index < proposedOptions.options.length) {
              await triggerBookingAutomation(proposedOptions.type, index);
              // EXIT: Booking initiated, do not continue to AI
              return; 
          }
      }
      
      // 2. Check for Proposal Intent
      if (messageLower.includes("book a hotel") || messageLower.includes("book a restaurant")) {
        
        const type = messageLower.includes("hotel") ? "hotel" : "restaurant";

        const location = bookingIntentMatch ? bookingIntentMatch[4].trim() : null;
        const guests = bookingIntentMatch ? parseInt(bookingIntentMatch[5] || '2', 10) : 2; 

        // CRITICAL CHECK: If location/guests are missing, prompt user for details.
        if (!location || !guests || isNaN(guests) || guests < 1) {
            const botMessage = {
                sender: "bot",
                text: `I need the **location** and **number of guests** to search for available ${type}s. Please resend your request like this: "book a ${type} in [City] for [Number] guests"`
            };
            const finalChats = initialChats.map((chat) =>
                chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
            );
            setChats(finalChats);
            return; // EXIT: Do not proceed to call backend or external AI
        }

        // Call backend to get filtered, available options
        const proposalResponse = await axios.post(`${API_URL}/api/propose-options`, { type, location, guests });
        
        let promptBotMessage;
        
        if (proposalResponse.data.found) {
            setProposedOptions(proposalResponse.data);

            const proposalsText = proposalResponse.data.options.map((r, i) => 
                `Option ${i + 1}: **${r.name}** (${r.price}) - ${r.description.slice(0, 40)}...`
            ).join('\n\n');
            
            promptBotMessage = {
                sender: "bot",
                text: `I found ${proposalResponse.data.options.length} available ${type}s in ${location}:\n\n${proposalsText}\n\n**Which option would you like to book? Click the button below your choice.**`
            };
        } else {
            promptBotMessage = {
                sender: "bot",
                text: proposalResponse.data.message
            };
        }
        
        const finalChats = initialChats.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, promptBotMessage] } : chat
        );
        setChats(finalChats);
        
      } else if (tripMatch) {
          // --- 3. TRIP SAVING LOGIC ---
          const destination = tripMatch[1].trim();
          const startDateString = tripMatch[2].trim();
          const endDateString = tripMatch[3].trim();
          
          const startDate = parseSafeDate(startDateString);
          const endDate = parseSafeDate(endDateString);

          if (!startDate || !endDate) {
             const botMessage = {
                sender: "bot",
                text: "I couldn't understand your dates. Please specify the trip destination and dates in DD/MM/YYYY format."
            };
            const finalChats = initialChats.map((chat) =>
                chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
            );
            setChats(finalChats);
            return; 
          } else {
             const tripData = {
                 userId: userProfile._id,
                 destination: destination,
                 startDate: startDate,
                 endDate: endDate,
             };

             await axios.post(`${API_URL}/api/trips/save`, tripData);

             const botMessage = {
                 sender: "bot",
                 text: `✅ Trip to ${destination} from ${startDateString} to ${endDateString} has been saved! I will now check for local festivals and send you an SMS alert.`
             };
             const finalChats = initialChats.map((chat) =>
                 chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
             );
             setChats(finalChats);
          }
          
      } else {
        // --- 4. STANDARD AI CHAT CALL (Fallback to external AI) ---
        await sendAiResponse(currentMessage, initialChats);
      }

    } catch (error) {
      console.error("❌ Error fetching bot reply:", error);
      const errorMsg = {
        sender: "bot",
        text: "⚠️ Could not connect to server or request failed. Please try again.",
      };
      const errorChats = initialChats.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages: [...chat.messages, errorMsg] } : chat
      );
      setChats(errorChats);
    } finally {
      setLoading(false);
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  if (!userProfile) return <p>Please log in to use the chatbot.</p>;

  return (
    <div className="chatbot-container">
      {/* Sidebar UI remains here */}
      <div className="chatbot-sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button onClick={handleNewChat}>+ New</button>
        </div>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={chat.id === activeChatId ? "active" : ""}
            >
              <span onClick={() => setActiveChatId(chat.id)}>{chat.title}</span>
              <button onClick={() => handleDeleteChat(chat.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area UI remains here */}
      <div className="chatbot-chatarea">
        <div className="chatbot-messages">
          {activeChat ? (
            activeChat.messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.sender}`}>
                {msg.sender === "bot" && <div className="avatar">🤖</div>}
                {msg.sender === "user" && <div className="avatar">👤</div>}
                <div className="message-text">{msg.text}</div>
                
                {/* ✅ CONDITIONAL BUTTONS FOR SELECTION */}
                {(proposedOptions && msg.sender === 'bot' && activeChat.messages.length - 1 === idx && proposedOptions.found) && (
                    <div className="flex-col gap-2 mt-2">
                        {proposedOptions.options.map((option, index) => (
                            <button 
                                key={index}
                                className="booking-select-button"
                                onClick={() => triggerBookingAutomation(proposedOptions.type, index)}
                                disabled={loading}
                            >
                                Book Option {index + 1} ({option.name.substring(0, 20)}...)
                            </button>
                        ))}
                    </div>
                )}
              </div>
            ))
          ) : (
            <p>Select or start a chat</p>
          )}
          {loading && <p className="typing">Bot is typing...</p>}
          <div ref={messagesEndRef} />
        </div>

        {activeChat && (
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage} disabled={loading}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;