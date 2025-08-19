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
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in both subject and content fields", {
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
        body: JSON.stringify({
          subject: subject.trim(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Email workflow triggered successfully!", {
          description: "Your emails are being sent via n8n workflow",
          icon: <CheckCircle className="h-4 w-4" />,
        });
        setSubject("");
        setContent("");
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error triggering workflow:", error);
      let errorMessage = "Please check your n8n server and try again";
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "Cannot connect to localhost from hosted app. Use ngrok or run locally!";
      }
      
      toast.error("Failed to trigger workflow", {
        description: errorMessage,
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
                <Label htmlFor="content" className="text-lg font-semibold text-gray-700">
                  Message
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your email message here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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