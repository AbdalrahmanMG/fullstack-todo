import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMessage from "../components/ui/InputErrorMessage";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  // Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log("DATA", data);
  };
  console.log(errors);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input placeholder={"Username"} {...register("username", { required: true, minLength: 5 })} />
          {errors?.username && errors.username.type === "required" ? <InputErrorMessage msg="Username is required" /> : null}
          {errors?.username && errors.username.type === "minLength" ? <InputErrorMessage msg="Username length should be more than 5 characters" /> : null}
        </div>
        <div>
          <Input placeholder={"Email"} {...register("email", { required: true, pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ })} />
          {errors?.email && errors.email.type === "required" ? <InputErrorMessage msg="Email is required" /> : null}
          {errors?.email && errors.email.type === "pattern" ? <InputErrorMessage msg="Email is not valid!" /> : null}
        </div>
        <div>
          <Input placeholder={"Password"} {...register("password", { required: true, minLength: 6 })} />
          {errors?.password && errors.password.type === "required" ? <InputErrorMessage msg="Passpassword is required" /> : null}
          {errors?.password && errors.password.type === "minLength" ? <InputErrorMessage msg="Passpassword length should be more than 6 characters" /> : null}
        </div>

        <Button fullWidth>{"Register"}</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
