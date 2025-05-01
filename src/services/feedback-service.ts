/**
 * Represents system information.
 */
export interface SystemInformation {
  /**
   * The operating system.
   */
  os: string;
  /**
   * The browser name.
   */
  browser: string;
}

/**
 * Represents user account information.
 */
export interface AccountInformation {
  /**
   * The user ID.
   */
  userId: string;
  /**
   * The user's email address.
   */
  email: string;
}

/**
 * Represents feedback data.
 */
export interface FeedbackData {
  /**
   * The feedback description.
   */
  description: string;
  /**
   * The captured snapshots as base64 encoded strings.
   */
  snapshots: string[];
  /**
   * The account information. Can be N/A if not included.
   */
  accountInformation: AccountInformation;
  /**
   * The system information. Can be N/A if not included.
   */
  systemInformation: SystemInformation;
}

/**
 * Asynchronously sends feedback data to the server.
 *
 * This is currently a placeholder. In a real application, this function
 * would make an API request (e.g., using fetch) to an Express server
 * endpoint to save the feedback data.
 *
 * @param feedbackData The feedback data to send.
 * @returns A promise that resolves to a boolean indicating success or failure.
 */
export async function sendFeedback(feedbackData: FeedbackData): Promise<boolean> {
  console.log('Sending feedback data (placeholder):');
  // Log description and info, but truncate snapshots for brevity in console
  console.log('Description:', feedbackData.description);
  console.log('Account Info:', feedbackData.accountInformation);
  console.log('System Info:', feedbackData.systemInformation);
  console.log(`Snapshots captured: ${feedbackData.snapshots.length}`);
  feedbackData.snapshots.forEach((snapshot, index) => {
      console.log(`Snapshot ${index + 1}: ${snapshot.substring(0, 100)}... (truncated)`);
  });

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a successful response
  // TODO: Replace with actual fetch call to your Express backend
  // Example:
  // try {
  //   const response = await fetch('/api/feedback', { // Your API endpoint
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(feedbackData),
  //   });
  //   return response.ok;
  // } catch (error) {
  //   console.error("API call failed:", error);
  //   return false;
  // }

  return true; // Placeholder return value
}
