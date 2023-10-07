import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { ArrowLeftIcon } from "lucide-react";

const Home = () => {
  const [url, setURL] = useState<string | null>("");
  const [data, setData] = useState<[]>([]);
  const [showTable, setShowTable] = useState<number>(0);

  function handleShow() {
    setShowTable(showTable === 1 ? 0 : 1);
  }

  async function handleAnlyze() {
    let response = await axios.post("http://127.0.0.1:8000/analyze/analyze", {
      data,
    });
    if (response.status === 200) {
      setData(response.data.data);
      console.log(response.data);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await axios.post("http://127.0.0.1:8000/analyze/scrap", {
      url: url,
    });
    if (response.status === 200) {
      setData(response.data.data);
      setShowTable(showTable === 0 ? 1 : 0);
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
      <div
        className={cn("flex w-full max-w-sm items-center space-x-2", {
          hidden: showTable === 1,
        })}
      >
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
      <div
        className={cn("container mx-auto py-10", {
          hidden: showTable === 0,
        })}
      >
        <div className="flex justify-between mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShow}
            className="space-x-1"
          >
            <ArrowLeftIcon />
            <span>Go Back</span>
          </Button>
          <Button variant="default" size="sm" onClick={handleAnlyze}>
            Analyze
          </Button>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Home;
