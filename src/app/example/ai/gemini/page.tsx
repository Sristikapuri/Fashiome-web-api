// app/example/ai/gemini/page.tsx
"use client";
import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import { handleGenerateContent } from "@/lib/actions/ai/gemini-action";

type ChatMessage = {
    id: number;
    role: "user" | "assistant";
    content: string;
};

const starterMessages: ChatMessage[] = [
    {
        id: 1,
        role: "assistant",
        content: "Ask me anything.",
    },
];

const formatMessage = (value: unknown) => {
    if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
    }

    return "No content generated.";
};

export default function Page() {
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(starterMessages);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isSending]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt || isSending) {
            return;
        }

        setPrompt("");
        setIsSending(true);
        setChatHistory((previousHistory) => [
            ...previousHistory,
            {
                id: Date.now(),
                role: "user",
                content: trimmedPrompt,
            },
        ]);

        try {
            const result = await handleGenerateContent(trimmedPrompt);
            const resultData = formatMessage(
                result.data?.candidates?.[0]?.content?.parts?.[0]?.text,
            );

            setChatHistory((previousHistory) => [
                ...previousHistory,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: result.success ? resultData : result.message || "Something went wrong.",
                },
            ]);
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred.";

            setChatHistory((previousHistory) => [
                ...previousHistory,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: message,
                },
            ]);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <main className="min-h-screen bg-canvas px-4 py-6 text-body">
            <div className="mx-auto flex h-[82vh] w-full max-w-2xl flex-col border border-hairline bg-surface-soft">
                <header className="border-b border-hairline px-4 py-3">
                    <p className="text-sm text-body-strong">Gemini chat</p>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-4">
                        {chatHistory.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[88%] rounded-lg border px-3 py-2.5 text-sm leading-6 ${
                                        message.role === "user"
                                            ? "border-m-blue-dark/40 bg-surface-card text-body-strong"
                                            : "border-hairline bg-surface-card text-body"
                                    }`}
                                >
                                    <p className="mb-1 text-[0.7rem] text-muted">
                                        {message.role === "user" ? "You" : "Gemini"}
                                    </p>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {isSending ? (
                            <div className="flex justify-start">
                                <div className="rounded-lg border border-hairline bg-surface-card px-3 py-2 text-sm text-muted">
                                    Gemini is typing...
                                </div>
                            </div>
                        ) : null}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="border-t border-hairline p-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <label className="sr-only" htmlFor="chat-prompt">
                            Message Gemini
                        </label>
                        <textarea
                            id="chat-prompt"
                            value={prompt}
                            onChange={handlePromptChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={3}
                            className="w-full resize-none rounded-md border border-hairline bg-canvas px-3 py-2.5 text-sm text-body-strong outline-none placeholder:text-muted focus:border-m-blue-dark/60"
                        />
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs text-muted">Enter to send, Shift+Enter for newline.</p>
                            <button
                                type="submit"
                                disabled={isSending || !prompt.trim()}
                                className="rounded-md border border-m-blue-dark/40 bg-m-blue-dark px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSending ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}