import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { LOGIN_FORM } from "../data";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import axiosInstance from "../config/axios.config";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  //* Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    console.log("DATA", data);
    try {
      const {data: resData} = await axiosInstance.post("/auth/local", data);

      toast.success("You will be navigte to the home page after 2 sec. !", {
        position: "bottom-center",
        duration: 1500,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });

      localStorage.setItem('loggedInUser', JSON.stringify(resData))

      setTimeout(() => {
        location.replace('/')
      }, 2000);

    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      console.log(errorObj?.response?.data.error.message);
      toast.error(`${errorObj?.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 1500,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //* render
  const formInputRender = LOGIN_FORM.map(({ name, placeholder, type, validation }, idx) => (
    <div key={idx}>
      <Input placeholder={placeholder} {...register(name, validation)} type={type} />
      {errors[name] && <InputErrorMessage msg={errors[name].message} />}
    </div>
  ));

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {formInputRender}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
