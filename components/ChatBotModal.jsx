import React, { useState, useCallback, useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { getGeminiReply } from '../app/geminiApi';
import { account,databases,database_id,medicines_collection_id,medicines_history_id } from '../app/appwrite';
import { Query } from 'react-native-appwrite';

export default function ChatBotModal({ visible, onClose }) {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [medications,setMedications] = useState([]);
  const [pastMedications,setPastMedications] = useState([]);

  // Predefined suggested quick replies
  const suggestions = [
    {
      title: 'Healthy Eating Tips',
      value: 'Can you share 3 simple healthy eating tips? Keep it easy to understand, use emojis and avoid using asterisks or markdown symbols'
    },
    {
      title: 'Hydration Tips',
      value: 'Why is drinking water important? Please explain briefly in under 4 lines, using emojis to make it friendly and avoid using asterisks or markdown symbols'
    },
    {
      title: 'Sleep Advice',
      value: 'How much sleep should an adult get, and why is it important? Keep it simple and add some emojis to make it friendly and avoid using asterisks or markdown symbols'
    },
    {
      title: 'Stress Relief',
      value: 'Suggest 3 simple ways to relax and reduce stress, use emojis, and avoid using asterisks or markdown symbols.'
    },
    { title: 'Analyze My Health', value: 'Analyze my health based on my past and current medications and give me some general wellness suggestions in a simple way.' }
  ];
  
  
  useEffect(() => {
    const fetchPastMedications = async () => {
      try {
        const userSession = await account.get();
        const userId = userSession.$id;
        setUserId(userId);
        const response = await databases.listDocuments(
          database_id,
          medicines_history_id,
          [Query.equal("userId", userId)]
        );
        const cleanedMeds = response.documents.map(({ 
          $id, $collectionId, $createdAt, $databaseId, 
          $permissions, $updatedAt, ...medData 
        }) => medData);
  
        setPastMedications(cleanedMeds);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPastMedications();
  }, [userId]);

  const fetchMedications = async () => {
      if (!userId) return;
    
      try {
        const response = await databases.listDocuments(
          database_id,
          medicines_collection_id,
          [Query.equal("userId", userId)]
        );
    
        const cleanedMeds = response.documents.map(
          ({$collectionId, $createdAt, $databaseId, $permissions, $updatedAt, ...medData }) => medData
        );
        setMedications(cleanedMeds);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    
  
    useEffect(() => {
      if (userId) {
        fetchMedications(); // automatic on load
      }
    }, [userId]);

  useEffect(() => {
    if (visible) {
      setMessages([
        {
          _id: 1,
          text: "Hi! I'm your health assistant. How can I help you today?",
          createdAt: new Date(),
          user: { _id: 2, name: 'Gemini Bot' },
          quickReplies: {
            type: 'radio', // or 'checkbox'
            keepIt: true,
            values: suggestions,
          },
        },
      ]);
    }
  }, [visible]);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));
    const userMsg = newMessages[0].text;
  
    if (userMsg.toLowerCase().includes("analyze my health")) {
      if (medications.length === 0 && pastMedications.length === 0) {
        const botReply = {
          _id: new Date().getTime(),
          text: "I don't have enough information about your medications to analyze your health.",
          createdAt: new Date(),
          user: { _id: 2, name: 'Gemini Bot' },
        };
        setMessages((prev) => GiftedChat.append(prev, [botReply]));
        return;
      }
  
      // Build a readable prompt
      let prompt = `I want you to analyze my health condition based on the following medications and provide simple health advice that a normal person can understand.\nGive advice in 3-5 simple bullet points. Do not include any disclaimers or chatbot instructions. Keep the response brief and easy to understand.\nGive advice in 3-5 short, friendly bullet points with emojis if suitable. Avoid long text or technical words`;
  
      if (pastMedications.length > 0) {
        prompt += `Past Medications:\n`;
        pastMedications.forEach((med, idx) => {
          prompt += `- Disease: ${med.disease_name}, Medicine: ${med.medicine_name}, Dosage: ${med.medicine_dosage}, Type: ${med.medicine_type}, Timings: ${med.timings.join(", ")}, Duration: ${med.start_date} to ${med.end_date}\n`;
        });
        prompt += `\n`;
      }
  
      if (medications.length > 0) {
        prompt += `Current Medications:\n`;
        medications.forEach((med, idx) => {
          prompt += `- Disease: ${med.disease_name}, Medicine: ${med.medicine_name}, Dosage: ${med.dosage}, Type: ${med.medicine_type}, Timings: ${med.timings.join(", ")}, Start Date: ${med.start_date}\n`;
        });
      }
  
      prompt += `\nGive advice in 3-5 simple bullet points.`;
  
      // Call Gemini with the prompt
      const replyText = await getGeminiReply(prompt);
      const cleanedReply = replyText
        .split('\n')
        .filter(line => !line.includes("chatbot") && !line.includes("consult") && !line.includes("***"))
        .join('\n');

      const botReply = {
        _id: new Date().getTime(),
        text: cleanedReply,
        createdAt: new Date(),
        user: { _id: 2, name: 'Gemini Bot' },
      };
  
      setMessages((prev) => GiftedChat.append(prev, [botReply]));
      return;
    }
  
    // fallback normal flow
    const replyText = await getGeminiReply(userMsg);
  
    const botReply = {
      _id: new Date().getTime(),
      text: replyText,
      createdAt: new Date(),
      user: { _id: 2, name: 'Gemini Bot' },
    };
  
    setMessages((prev) => GiftedChat.append(prev, [botReply]));
  }, [medications, pastMedications]);
  

  const onQuickReply = useCallback((quickReplies) => {
    if (!quickReplies || quickReplies.length === 0) return;
    const reply = quickReplies[0];
    const quickMessage = {
      _id: new Date().getTime(),
      text: reply.value,
      createdAt: new Date(),
      user: { _id: 1 },
    };
    onSend([quickMessage]);
  }, [onSend]);

  return (
    <Modal visible={visible} animationType="none">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        <GiftedChat
          messages={messages}
          onSend={(msgs) => onSend(msgs)}
          user={{ _id: 1 }}
          onQuickReply={onQuickReply}
          placeholder="Type your question here..."
          renderAvatar={() => null}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00B5E2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
  },
});
