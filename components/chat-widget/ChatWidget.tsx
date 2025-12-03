"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"initial" | "chat">("initial");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log("Sending lead:", { email, message });
    setStep("chat");
    setMessage("");
    // In a real app, we'd add the message to the chat history here
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 md:w-96 shadow-xl border-indigo-100">
          <CardHeader className="bg-indigo-600 text-white rounded-t-lg flex flex-row items-center justify-between p-4">
            <CardTitle className="text-lg">Chat with us</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-indigo-700 h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 h-96 flex flex-col">
            {step === "initial" ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 flex-1 flex flex-col justify-center"
              >
                <div className="text-center space-y-2 mb-4">
                  <p className="font-medium">Hi there! 👋</p>
                  <p className="text-sm text-muted-foreground">
                    Let us know how we can help and we&apos;ll get back to you
                    instantly.
                  </p>
                </div>
                <Input
                  placeholder="Your email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Textarea
                  placeholder="How can we help?"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Chat
                </Button>
              </form>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 p-2">
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white rounded-lg py-2 px-3 max-w-[80%] text-sm">
                      {message || "I'm interested in your services."}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-800 rounded-lg py-2 px-3 max-w-[80%] text-sm">
                      Thanks for reaching out! Our AI agent is analyzing your
                      request and will reply shortly.
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Input placeholder="Type a message..." />
                  <Button size="icon" className="bg-indigo-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
