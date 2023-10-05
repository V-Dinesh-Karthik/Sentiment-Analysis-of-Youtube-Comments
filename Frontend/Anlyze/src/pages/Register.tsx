import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter,
  CardDescription,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { toast } = useToast();

  const navigate = useNavigate();

  const [passVisibility, setPassVisibility] = useState(false);

  const handlePassVisibility = () => {
    setPassVisibility(!passVisibility);
  };

  const formSchema = z.object({
    username: z.string().min(2).max(55),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.confirmPassword != values.password) {
      toast({
        title: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    alert(
      JSON.stringify({
        username: values.username,
        password: values.password,
        email: values.email,
      })
    );
    const response = await axios.post("http://127.0.0.1:8000/auth/register", {
      username: values.username,
      email: values.email,
      password: values.password,
    });
    if (response.status === 201) {
      toast({
        title: "User Created! Navigating to Login page",
        variant: "default",
      });

      navigate("/login", { replace: true });
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Welcome to our website!</CardDescription>
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
                      <Input placeholder="Enter your username.." {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email.." {...field} />
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
                      <Input
                        placeholder="Enter your password.."
                        {...field}
                        type={passVisibility ? "text" : "password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Re-enter your password.."
                        {...field}
                        type={passVisibility ? "text" : "password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="submit">Register</Button>
                <Button
                  type="button"
                  onClick={handlePassVisibility}
                  variant={"ghost"}
                >
                  {passVisibility == false ? <EyeOff></EyeOff> : <Eye></Eye>}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default Register;
