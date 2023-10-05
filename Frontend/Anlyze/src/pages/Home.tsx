import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";

const Home = () => {
  const [url, setURL] = useState<string | null>("");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await axios.post("http://127.0.0.1:8000/analyze/scrap", {
      url: url,
    });
    if (response.status === 200) {
      console.log(response.data);
    } else {
      console.log("Unexpected status code:", response.status);
    }
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setURL(event.target.value);
    console.log(event.target.value);
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex space-x-2 flex-grow"
        >
          <Input type="url" placeholder="Youtube URL" onChange={handleChange} />
          <Button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Home;
