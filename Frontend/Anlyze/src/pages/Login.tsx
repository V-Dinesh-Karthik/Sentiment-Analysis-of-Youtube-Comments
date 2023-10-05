import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import * as z from "zod";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const formSchema = z.object({
    username: z.string().min(2),
    password: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        username: values.username,
        password: values.password,
      });
      if (response.status === 200) {
        const token = await response.data;
        await getUserData(token["token"]);
      } else {
        setApiError("Login Failed. Please check your credentials");
        setAuth({
          user: null,
          isAuthenticated: false,
        });
        toast({
          title: "Login failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("Login error: ", error);
      setApiError("An error occured while logging in");
      setAuth({
        user: null,
        isAuthenticated: false,
      });
    }
  }
  async function getUserData(token: any) {
    try {
      const response = await axios.get("http://127.0.0.1:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const userData = await response.data;
        userData.token = token;
        setAuth({
          user: {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            token: userData.token,
          },
          isAuthenticated: true,
        });
        setApiError(null);
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast({
        title: "Error fetching the data",
        variant: "destructive",
      });
    }
  }
  //
  //absolute -translate-x-1/2 -translate-y-1/2 top-1/2
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Log in</Button>
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div className="text-center">
                <a href="./register">Register here</a>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default Login;
