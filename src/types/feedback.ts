/**
 * Represents system information captured with feedback.
 */
export interface SystemInformation {
  os: string;
  browser: string;
}

/**
 * Represents user account information captured with feedback.
 */
export interface AccountInformation {
  userId: string;
  email: string;
}

/**
 * Represents the structure of feedback data sent to the backend.
 */
export interface FeedbackPayload {
  description: string;
  snapshots: string[]; // Array of base64 encoded image strings
  accountInformation: AccountInformation | { userId: 'N/A', email: 'N/A' };
  systemInformation: SystemInformation | { os: 'N/A', browser: 'N/A' };
}

/**
 * Represents a captured snapshot with its ID and data URL.
 */
export interface Snapshot {
  id: string;
  dataUrl: string;
}

/**
 * Represents a drawing made on a snapshot.
 */
export interface DrawingRect {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'highlight' | 'hide';
  shape: 'square' | 'circle';
}

/**
 * Defines the available drawing tools.
 */
export type DrawingTool = 'highlight' | 'hide' | 'none';

/**
 * Defines the available drawing shapes.
 */
export type DrawingShape = 'square' | 'circle';
