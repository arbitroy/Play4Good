import { DashboardClient } from './dashboard-client'
import './dashboard.css'

export default function DashboardPage() {
    // This could be fetched from an API in a real application
    const teamProgress = 65
    const achievements = [
        "First Donation",
        "Team Player",
        "Mega Donor",
        "Streak: 7 days"
    ]
    const leaderboard = [
        { name: "Giving Tigers", amount: 2500, avatar: "GT" },
        { name: "Charity Heroes", amount: 2200, avatar: "CH" },
        { name: "Dream Team", amount: 1800, avatar: "DT" }
    ]
    const upcomingEvents = [
        { name: "Charity Run 2023", action: "Join" },
        { name: "Webinar: Impact of Giving", action: "Register" },
        { name: "Community Cleanup Day", action: "Volunteer" }
    ]
    const communityImpact = [
        "🏥 50 children received medical care",
        "🌳 1000 trees planted",
        "📚 200 students got school supplies"
    ]

    return (
        <div className="container">
            <h1 className="dashboard-title">Play4Good Dashboard</h1>
            <DashboardClient
                teamProgress={teamProgress}
                achievements={achievements}
                leaderboard={leaderboard}
                upcomingEvents={upcomingEvents}
                communityImpact={communityImpact}
            />
        </div>
    )
}