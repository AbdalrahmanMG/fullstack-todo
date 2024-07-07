import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });

  //* Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    console.log("DATA", data);
    try {
      const res = await axiosInstance.post("/auth/local/register", data);
      console.log(res);
      toast.success("You will be navigte to the login page after 4 sec. !", {
        position: "bottom-center",
        duration: 4000,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } catch (error) {
      const errorObj = error as AxiosError <IErrorResponse>
      console.log(errorObj?.response?.data.error.message);
      toast.error(`${errorObj?.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 4000});
    } finally {
      setIsLoading(false);
    }
  };
  console.log(errors);

  //* render
  const formInputRender = REGISTER_FORM.map(({ name, placeholder, type, validation }, idx) => (
    <div key={idx}>
      <Input placeholder={placeholder} {...register(name, validation)} type={type} />
      {errors[name] && <InputErrorMessage msg={errors[name].message} />}
    </div>
  ));

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {formInputRender}
        <Button fullWidth isLoading={isLoading}>{isLoading ? "loading..." : "Register"}</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
