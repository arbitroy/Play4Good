import Image from "next/image";
import Card from './Card'

export default function Home() {
  return (
    <main>
      <h1>Play4Good</h1>
      <div className="card-container">
        <Card 
          title="Cause 1" 
          image="https://avatar.iran.liara.run/public/34" 
          content={<p>Details about Cause 1...</p>}
        />
        <Card 
          title="Team 1" 
          image="https://avatar.iran.liara.run/public/41" 
          content={<p>Details about Team 1...</p>}
        />
        <Card 
          title="Achievement 1" 
          image="https://avatar.iran.liara.run/public/33" 
          content={<p>Details about Achievement 1...</p>}
        />
      </div>
    </main>
  )
}
