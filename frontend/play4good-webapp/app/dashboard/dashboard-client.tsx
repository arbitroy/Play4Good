'use client'

import { useState } from "react"
import { Trophy, Users, Gift, Share2} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

interface DashboardClientProps {
    teamProgress: number
    achievements: string[]
    leaderboard: Array<{ name: string; amount: number; avatar: string }>
    upcomingEvents: Array<{ name: string; action: string }>
    communityImpact: string[]
}

export function DashboardClient({
    teamProgress: initialTeamProgress,
    achievements,
    leaderboard,
    upcomingEvents,
    communityImpact
}: DashboardClientProps) {
    const [progress, setProgress] = useState(initialTeamProgress)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Progress</CardTitle>
                    <CardDescription>Dream Team Donations</CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                        ${progress * 10} raised of $1000 goal
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                        <Button variant="outline" size="sm" onClick={() => setProgress(Math.min(progress + 5, 100))}>
                            Add Donation
                        </Button>
                        <Badge variant="secondary">
                            <Trophy className="w-4 h-4 mr-1" />
                            Top 10 Team
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Your Impact</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {achievements.map((achievement, index) => (
                            <Badge key={index} variant="outline">{achievement}</Badge>
                        ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">View All Achievements</Button>
                </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle>Leaderboard</CardTitle>
                    <CardDescription>Top Teams This Week</CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-2">
                        {leaderboard.map((team, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <span className="flex items-center">
                                    <span className="font-bold mr-2">{index + 1}.</span>
                                    <Avatar className="h-6 w-6 mr-2">
                                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                                        <AvatarFallback>{team.avatar}</AvatarFallback>
                                    </Avatar>
                                    {team.name}
                                </span>
                                <span>${team.amount}</span>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Join and make a difference</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {upcomingEvents.map((event, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span>{event.name}</span>
                                <Button size="sm">{event.action}</Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Donation Options */}
            <Card>
                <CardHeader>
                    <CardTitle>Donation Options</CardTitle>
                    <CardDescription>Choose how you want to help</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button className="w-full" variant="outline">
                        <Gift className="mr-2 h-4 w-4" /> Monetary Donation
                    </Button>
                    <Button className="w-full" variant="outline">
                        <Gift className="mr-2 h-4 w-4" /> Donate Goods
                    </Button>
                    <Button className="w-full" variant="outline">
                        <Users className="mr-2 h-4 w-4" /> Offer Services
                    </Button>
                </CardContent>
            </Card>

            {/* Community Impact */}
            <Card>
                <CardHeader>
                    <CardTitle>Community Impact</CardTitle>
                    <CardDescription>Your contributions at work</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {communityImpact.map((impact, index) => (
                            <p key={index} className="text-sm">{impact}</p>
                        ))}
                        <Button className="w-full mt-4" variant="outline">
                            <Share2 className="mr-2 h-4 w-4" /> Share Your Impact
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}