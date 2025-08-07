'use client'

import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
// import { Input } from '@/components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'
import { useToast } from '../../hooks/use-toast'
import { Star, MessageSquare } from 'lucide-react'

export default function FeedbackPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          message,
          userId: user.id,
        }),
      })

      if (response.ok) {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback! We appreciate your input.",
        })
        
        // Reset form
        setRating(0)
        setHoveredRating(0)
        setMessage('')
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Share Your Feedback</h1>
          <p className="text-muted-foreground">
            We value your opinion and would love to hear about your experience with Eurasian.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Your Feedback
            </CardTitle>
            <CardDescription>
              Help us improve our service by sharing your thoughts and suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Please log in to submit feedback.
                </p>
                <Button asChild>
                  <a href="/login">Log In</a>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <Label>Overall Rating</Label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`p-1 rounded-full transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <Star className={`h-6 w-6 ${star <= (hoveredRating || rating) ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Your Feedback</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your experience, suggestions for improvement, or any issues you've encountered..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                {/* User Info */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Submitting as: <span className="font-medium">{user.name}</span> ({user.email})
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Feedback Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">What We'd Love to Hear About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="outline">Features</Badge>
                <p className="text-sm text-muted-foreground">
                  Which features do you find most useful? What would you like to see added?
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">User Experience</Badge>
                <p className="text-sm text-muted-foreground">
                  How easy is it to navigate and use our platform? Any suggestions for improvement?
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">Performance</Badge>
                <p className="text-sm text-muted-foreground">
                  How would you rate the speed and reliability of our service?
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">Support</Badge>
                <p className="text-sm text-muted-foreground">
                  Have you needed help? How was your support experience?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}