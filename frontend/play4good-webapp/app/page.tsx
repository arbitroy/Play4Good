import Logout from "./components/Logout";
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Trophy, Users, Gift, Share2 } from 'lucide-react'
export default function Page() {
  return (
    <div className="min-h-screen ">
      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">Turn Giving into an Adventure</h1>
          <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
            Join Play4Good and make every donation a memorable experience. Form teams, compete, and track your impact in real-time.
          </p>
          <Link href="/causes" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </section>

        <section id="features" className=" py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">Why Choose Play4Good?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="w-12 h-12 text-blue-600" />}
                title="Team Spirit"
                description="Create or join teams with friends and colleagues. Rally together for a common cause and watch your collective impact grow."
              />
              <FeatureCard
                icon={<Trophy className="w-12 h-12 text-blue-600" />}
                title="Friendly Competition"
                description="Engage in fun, friendly competitions between teams with real-time leaderboards to see who's making the biggest difference."
              />
              <FeatureCard
                icon={<Gift className="w-12 h-12 text-blue-600" />}
                title="Diverse Donation Options"
                description="Support causes with financial donations, goods, or services. Add a personal touch to your contributions."
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className=" py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">How It Works</h2>
            <div className="max-w-3xl mx-auto">
              <ol className="relative border-l border-blue-300">
                <HowItWorksStep
                  number={1}
                  title="Create Your Profile"
                  description="Sign up and personalize your donor profile with avatars, themes, and badges."
                />
                <HowItWorksStep
                  number={2}
                  title="Join or Form a Team"
                  description="Connect with friends or colleagues to create a fundraising dream team."
                />
                <HowItWorksStep
                  number={3}
                  title="Choose Your Cause"
                  description="Browse and select from a variety of worthy causes that align with your values."
                />
                <HowItWorksStep
                  number={4}
                  title="Donate and Compete"
                  description="Make your contribution and watch as your team climbs the leaderboard."
                />
                <HowItWorksStep
                  number={5}
                  title="Track Your Impact"
                  description="See the real-world difference your donations are making through interactive progress tracking."
                />
              </ol>
            </div>
          </div>
        </section>

        <section id="join" className=" py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Join Play4Good Today</h2>
            <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
              Experience the joy of giving like never before. Start your journey with Play4Good and make a difference, one fun-filled donation at a time.
            </p>
            <form className="max-w-md mx-auto" >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 mb-4 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
              >
                Sign Up Now
              </button>
            </form>
          </div>
        </section>
      </main>

      
    </div>)
}


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-blue-50 p-6 rounded-lg text-center">
      <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-blue-900 mb-2">{title}</h3>
      <p className="text-blue-700">{description}</p>
    </div>
  )
}

interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
}

function HowItWorksStep({ number, title, description }: HowItWorksStepProps) {
  return (
    <li className="mb-10 ml-6">
      <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full -left-4 ring-4 ring-white">
        <span className="text-white font-bold">{number}</span>
      </span>
      <h3 className="font-semibold text-blue-900 text-lg">{title}</h3>
      <p className="text-blue-700">{description}</p>
    </li>
  )
}