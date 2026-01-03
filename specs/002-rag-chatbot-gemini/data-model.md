# Data Model: RAG Chatbot Integration

## Entities

### ChatSession
- **Description**: Represents a user's conversation context
- **Fields**:
  - `id` (string): Unique session identifier
  - `created_at` (timestamp): Session creation time
  - `updated_at` (timestamp): Last interaction time
  - `messages` (array): Array of message objects in the conversation
  - `user_id` (string, optional): Anonymous user identifier (for analytics)
  - `metadata` (object): Additional session metadata

### Message
- **Description**: Individual message within a chat session
- **Fields**:
  - `id` (string): Unique message identifier
  - `role` (string): Message role (user|assistant)
  - `content` (string): Message content
  - `timestamp` (timestamp): Message creation time
  - `retrieved_chunks` (array): Array of retrieved document chunks used in response

### DocumentChunk
- **Description**: Represents an indexed piece of documentation content in Qdrant Cloud
- **Fields**:
  - `chunk_id` (string): Unique chunk identifier
  - `text` (string): The actual text content of the chunk
  - `source_path` (string): Path to the source document
  - `page_title` (string): Title of the page containing this chunk
  - `embedding` (array): Vector embedding of the text
  - `metadata` (object): Additional metadata (created_at, updated_at, etc.)
  - `hash` (string): Content hash for idempotent ingestion

### RetrievedChunk
- **Description**: Represents a piece of documentation retrieved during RAG process
- **Fields**:
  - `source_path` (string): Path to the source document
  - `chunk_id` (string): ID of the retrieved chunk
  - `text` (string): The actual text content of the chunk
  - `score` (float): Relevance score from vector search
  - `page_title` (string): Title of the page containing this chunk

### UsageLog
- **Description**: Represents logged interaction data for analytics
- **Fields**:
  - `id` (string): Unique log identifier
  - `session_id` (string): Associated session ID
  - `user_id` (string, optional): Anonymous user identifier
  - `query` (string): Original user query
  - `response` (string): AI response
  - `retrieved_chunks` (array): List of source chunks used
  - `timestamp` (timestamp): Log creation time
  - `mode` (string): Query mode (strict|augment)
  - `response_time_ms` (integer): Time taken to generate response

### QueryRequest
- **Description**: Request object for the /query endpoint
- **Fields**:
  - `query` (string): User's question
  - `selected_text` (string, optional): Selected text from the page
  - `mode` (string): Query mode (strict|augment, default: augment)
  - `session_id` (string, optional): Session identifier for context
  - `top_k` (integer, optional): Number of chunks to retrieve (default: 5)

### QueryResponse
- **Description**: Response object from the /query endpoint
- **Fields**:
  - `answer` (string): AI-generated answer
  - `retrieved` (array): Array of RetrievedChunk objects
  - `session_id` (string): Session identifier
  - `mode` (string): Mode used for the query

### ChatSessionRequest
- **Description**: Request object for the /chatkit/session endpoint
- **Fields**:
  - `session_id` (string, optional): Existing session ID (creates new if not provided)
  - `user_preferences` (object, optional): User preferences for the session

### ChatSessionResponse
- **Description**: Response object from the /chatkit/session endpoint
- **Fields**:
  - `session_id` (string): Session identifier
  - `messages` (array): Array of messages in the session
  - `created` (boolean): True if new session was created