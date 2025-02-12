type MessageHandler = (data: any) => void;
type ConnectionHandler = () => void;

class WebSocketService {
	private ws: WebSocket | null = null;
	private messageHandlers: Map<string, MessageHandler[]> = new Map();
	private connectionHandlers: ConnectionHandler[] = [];
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectTimeout = 1000;

	constructor(private url: string) {}

	connect() {
		this.ws = new WebSocket(this.url);
		
		this.ws.onopen = () => {
			this.reconnectAttempts = 0;
			this.connectionHandlers.forEach(handler => handler());
		};

		this.ws.onmessage = (event) => {
			const { type, data } = JSON.parse(event.data);
			this.messageHandlers.get(type)?.forEach(handler => handler(data));
		};

		this.ws.onclose = () => {
			if (this.reconnectAttempts < this.maxReconnectAttempts) {
				setTimeout(() => {
					this.reconnectAttempts++;
					this.connect();
				}, this.reconnectTimeout * Math.pow(2, this.reconnectAttempts));
			}
		};
	}

	subscribe(type: string, handler: MessageHandler) {
		if (!this.messageHandlers.has(type)) {
			this.messageHandlers.set(type, []);
		}
		this.messageHandlers.get(type)?.push(handler);
	}

	unsubscribe(type: string, handler: MessageHandler) {
		const handlers = this.messageHandlers.get(type);
		if (handlers) {
			this.messageHandlers.set(
				type,
				handlers.filter(h => h !== handler)
			);
		}
	}

	onConnect(handler: ConnectionHandler) {
		this.connectionHandlers.push(handler);
	}

	send(type: string, data: any) {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify({ type, data }));
		}
	}

	disconnect() {
		this.ws?.close();
		this.ws = null;
		this.messageHandlers.clear();
		this.connectionHandlers = [];
	}
}

export const wsService = new WebSocketService(
	process.env.NEXT_PUBLIC_WS_URL || 'wss://api.butterflycrm.com/ws'
);