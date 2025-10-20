export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  last_login?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  uses_documents: boolean;
  document_sources?: string[];
  redirect_url?: string;
  tokens_used: number;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  content_text?: string;
  is_indexed: boolean;
  is_public: boolean;
  uploaded_at: string;
}
