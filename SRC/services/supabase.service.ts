import { createClient } from '@supabase/supabase-js';
import { User, Conversation, Message, Document } from '../types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  // USERS
  static async createUser(userData: Omit<User, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getPendingUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'pending');
    
    if (error) throw error;
    return data;
  }

  static async updateUserStatus(userId: string, status: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUserPassword(userId: string, passwordHash: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // CONVERSATIONS
  static async createConversation(conversationData: Omit<Conversation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('conversations')
      .insert([conversationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // MESSAGES
  static async createMessage(messageData: Omit<Message, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getConversationMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if ( error) throw error;
    return data;
  }

  // DOCUMENTS
  static async createDocument(documentData: Omit<Document, 'id' | 'uploaded_at'>) {
    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserDocuments(userId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getAllDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async updateDocumentIndexation(documentId: string, isIndexed: boolean) {
    const { data, error } = await supabase
      .from('documents')
      .update({ is_indexed: isIndexed })
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteDocument(documentId: string) {
    const { data, error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId')
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
