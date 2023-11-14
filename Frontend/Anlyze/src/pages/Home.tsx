import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { ArrowLeftIcon, Check, ChevronsUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useAuth } from "@/hooks/useAuth";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Graphs = [
  {
    value: "bar graph",
    label: "Bar",
  },
  {
    value: "pie chart",
    label: "Pie",
  },
];

const Home = () => {
  const [url, setURL] = useState<string | null>("");
  const [data, setData] = useState<[]>([]);
  const [showTable, setShowTable] = useState<number>(0);
  const { auth } = useAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sentiment Analysis of Youtube Video",
      },
    },
  };

  const labels = ["Positive", "Neutral", "Negative"];

  function handleShow() {
    setShowTable(showTable === 1 ? 0 : 1);
  }

  function preprocessData() {
    const count = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    data.forEach((obj) => {
      if (obj["sentiment"] === "positive") {
        count.positive++;
      }
      if (obj["sentiment"] === "neutral") {
        count.neutral++;
      }
      if (obj["sentiment"] === "negative") {
        count.negative++;
      }
    });

    return [count.positive, count.neutral, count.negative];
  }

  async function handleAnlyze() {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze/analyze",
      {
        data,
      },
      {
        headers: { Authorization: `Bearer ${auth.user?.token}` },
      }
    );
    if (response.status === 200) {
      setData(response.data.data);
      console.log(response.data);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze/scrap",
      {
        url: url,
      },
      {
        headers: { Authorization: `Bearer ${auth.user?.token}` },
      }
    );
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

  const barData = {
    labels,
    datasets: [
      {
        label: "Comments",
        data: preprocessData(),
        backgroundColor: ["green", "gray", "red"],
      },
    ],
  };

  return (
    <div className="flex justify-center items-center">
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

        <Tabs defaultValue="table" className="text-center">
          <TabsList className="">
            <TabsTrigger value="table">Comment Table</TabsTrigger>
            <TabsTrigger value="present">Data Representation</TabsTrigger>
          </TabsList>
          <TabsContent value="table" className="text-left">
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={data} />
            </div>
          </TabsContent>
          <TabsContent value="present">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? Graphs.find((graph) => graph.value === value)?.label
                    : "Select graph..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Select graph.." />
                  <CommandEmpty>No graph found</CommandEmpty>
                  <CommandGroup>
                    {Graphs.map((graph) => (
                      <CommandItem
                        key={graph.value}
                        value={graph.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === graph.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {graph.value}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex items-center justify-center">
              {value === "bar graph" && (
                <div style={{ width: 650, height: 650 }}>
                  <Bar options={options} data={barData} />
                </div>
              )}
              {value === "pie chart" && (
                <div style={{ width: 390, height: 390 }}>
                  <Pie data={barData} width="50" height="50" />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
