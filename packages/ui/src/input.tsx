"use client";


interface InputProps {
  className?: string;
  type:string;
  placeholder:string;
  refernce?:any;
  onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

export const Input = ({className,type,placeholder,refernce,onChange}: InputProps) => {
  return (
    <input
      className={className}
      placeholder={placeholder}
      type={type}
      ref={refernce}
      onChange={onChange}
    >
    </input>
  );
};