import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendMessage, consumeMessages } from '../lib/Kafka';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
        user_name,
        account_number,
        email_address,
        identity_number,
    } = req.body

    const reqBody = {
        userName: user_name,
        accountNumber: account_number,
        emailAddress: email_address,
        identityNumber: identity_number,
    }

    await sendMessage(reqBody);

    consumeMessages().catch((error) => {
        console.error('Error starting Kafka consumer:', error);
    });

    res.status(201).json({ message: 'User data sent to Kafka' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Read User
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
