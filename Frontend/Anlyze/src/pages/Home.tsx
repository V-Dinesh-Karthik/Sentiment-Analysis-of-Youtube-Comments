import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen">
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="url" placeholder="Youtube URL"/>
            <Button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </Button>
        </div>
    </div>

  )
}

export default Home