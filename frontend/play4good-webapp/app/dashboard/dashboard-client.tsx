'use client'

import { useState } from "react"

import { Trophy, Users, Gift, Share2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { Avatar } from "../components/ui/avatar"
import "./dashboard-client.css"

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
        <div className="dashboard-grid">
            <Card>
                <CardHeader>
                    <h2 className="card-title">Team Progress</h2>
                    <p className="card-description">Dream Team Donations</p>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} />
                    <p className="progress-text">
                        ${progress * 10} raised of $1000 goal
                    </p>
                    <div className="progress-actions">
                        <Button variant="outline" size="sm" onClick={() => setProgress(Math.min(progress + 5, 100))}>
                            Add Donation
                        </Button>
                        <Badge variant="secondary">
                            <Trophy className="badge-icon" />
                            Top 10 Team
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className="card-title">Achievements</h2>
                    <p className="card-description">Your Impact</p>
                </CardHeader>
                <CardContent>
                    <div className="achievements-list">
                        {achievements.map((achievement, index) => (
                            <Badge key={index} variant="outline">{achievement}</Badge>
                        ))}
                    </div>
                    <Button className="full-width" variant="outline">View All Achievements</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className="card-title">Leaderboard</h2>
                    <p className="card-description">Top Teams This Week</p>
                </CardHeader>
                <CardContent>
                    <ol className="leaderboard-list">
                        {leaderboard.map((team, index) => (
                            <li key={index} className="leaderboard-item">
                                <span className="leaderboard-name">
                                    <span className="leaderboard-rank">{index + 1}.</span>
                                    <Avatar>{team.avatar}</Avatar>
                                    {team.name}
                                </span>
                                <span>${team.amount}</span>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className="card-title">Upcoming Events</h2>
                    <p className="card-description">Join and make a difference</p>
                </CardHeader>
                <CardContent>
                    <ul className="events-list">
                        {upcomingEvents.map((event, index) => (
                            <li key={index} className="event-item">
                                <span>{event.name}</span>
                                <Button size="sm">{event.action}</Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className="card-title">Donation Options</h2>
                    <p className="card-description">Choose how you want to help</p>
                </CardHeader>
                <CardContent>
                    <Button className="full-width" variant="outline">
                        <Gift className="button-icon" /> Monetary Donation
                    </Button>
                    <Button className="full-width" variant="outline">
                        <Gift className="button-icon" /> Donate Goods
                    </Button>
                    <Button className="full-width" variant="outline">
                        <Users className="button-icon" /> Offer Services
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className="card-title">Community Impact</h2>
                    <p className="card-description">Your contributions at work</p>
                </CardHeader>
                <CardContent>
                    <div className="impact-list">
                        {communityImpact.map((impact, index) => (
                            <p key={index} className="impact-item">{impact}</p>
                        ))}
                    </div>
                    <Button className="full-width" variant="outline">
                        <Share2 className="button-icon" /> Share Your Impact
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}