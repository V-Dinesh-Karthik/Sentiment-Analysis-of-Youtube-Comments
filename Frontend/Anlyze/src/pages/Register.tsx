import { useForm } from "react-hook-form"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "../components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../components/ui/input"
import  * as z from "zod"


const Register = () => {
  const formSchema = z.object({
      username: z.string().min(2),
      email: z.string().min(2),
      password: z.string(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <div className="flex justify-center items-center h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField control={form.control} name='username' render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                  </FormItem>
                )}  />
                <FormField control={form.control} name='email' render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}  />
                <FormField control={form.control} name='password' render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}  />
                <Button type="submit">Register</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
    </div>
  )
}

export default Register