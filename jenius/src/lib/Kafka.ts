import { Kafka } from 'kafkajs';
import { PrismaClient } from '@prisma/client';

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'user-group' });
const producer = kafka.producer();
const prisma = new PrismaClient();

export const sendMessage = async (message: any) => {
  await producer.connect();
  try {
    await producer.send({
      topic: 'user-topic',
      messages: [
        { value: JSON.stringify(message) },
      ],
    });
    console.log('Message sent to Kafka:', message);
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
  } finally {
    await producer.disconnect();
  }
}

export const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-topic', fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        if (message.value) {
            const userData = JSON.parse(message.value.toString());
            console.log(userData)
            try {
                const user = await prisma.user.create({
                    data: userData,
                });

                console.log('User inserted into database:', user);
            } catch (error) {
            console.error('Error inserting user into database:', error);
            }
        }
    },
  });
};
