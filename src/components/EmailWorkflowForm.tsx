import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Send, Workflow, CheckCircle, AlertCircle } from "lucide-react";

const EmailWorkflowForm = () => {
  const webhookUrl = "http://localhost:5678/webhook/Email";
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message fields", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      // Since we're using no-cors, we won't get a proper response status
      // Instead, we'll show a success message assuming the request was sent
      toast.success("Email workflow triggered successfully!", {
        description: "Request sent to n8n. Check your workflow history to confirm.",
        icon: <CheckCircle className="h-4 w-4" />,
      });
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error triggering workflow:", error);
      toast.error("Failed to trigger workflow", {
        description: "Please check your n8n webhook URL and try again.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-8 pt-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold mb-3">
              Email Manager
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Send personalized emails instantly
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-lg font-semibold text-gray-700">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Enter your email subject..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="message" className="text-lg font-semibold text-gray-700">
                  Text
                </Label>
                <Textarea
                  id="message"
                  placeholder="Write your email message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[180px] text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3" />
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6 mr-3" />
                    Send Emails
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailWorkflowForm;