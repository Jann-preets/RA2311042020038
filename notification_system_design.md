Stage 1

The campus notification system prioritizes updates to ensure students see critical information first. The priority is determined by a combination of category weight and recency.


Placement: Highest Priority (Weight: 3)
Result: Medium Priority (Weight: 2)
Event: Standard Priority (Weight: 1)


To maintain the notifications efficiently as new data arrives:
1.Custom Comparator: I implemented a sorting algorithm that first evaluates the `Type` of notification against our weight map. If types are identical, it compares the `Timestamp` to ensure the most recent updates stay at the top.
2.Buffer Management: By using a `.slice(0, 10)` method on the sorted collection, the system ensures that memory overhead remains low, even if the upstream API returns hundreds of records.
3.Scalability: For a live production environment with high frequency, a Min-Heap of size 10 could be used to keep the top elements in $O(\log n)$ time, though a standard sort is highly effective for the current dataset size.

Stage 2

1.Secure Authentication Flow
The application implements a silent authentication handshake to interact with the evaluation server:

Credential Management: Utilizes a unique clientID and clientSecret assigned during registration (e.g., 05223376-303d-4832-bcc2-7b55d3d9181d).

Token Exchange: Upon component mount, the frontend issues a POST request to the /auth endpoint to receive a Bearer token.

Authorization: This access_token is attached to the Authorization header for all protected API calls.

2.Logging Middleware Integration
To fulfill the requirement for centralized observability, a logging utility was integrated:

Event Reporting: The system logs lifecycle events, including successful fetches (info), auth failures (error), and timeouts (warn).

Standardized Payload: Each log transmits a structured JSON object containing the stack (frontend), level, package, and message.

Fault Tolerance: The logging function uses a short timeout to ensure that log server connectivity issues do not block the UI.

3.Responsive UI Design (Material UI)
The interface is built using Material UI (MUI) for professional aesthetics and responsiveness:

Grid System: A responsive grid uses xs={12} for mobile (single column) and md={6} for desktop (dual column) to optimize screen real estate.

State Persistence: "Viewed" states are managed via localStorage, ensuring the visual "unread" indicator (blue highlight) remains hidden after a page refresh once a user has interacted with the card.

Hydration Guard: A client-side mount check prevents SSR (Server-Side Rendering) conflicts between Next.js and MUI.